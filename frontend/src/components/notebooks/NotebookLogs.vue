<template>
  <div class="my-4">
    <div class="flex justify-between items-center pb-2">
      <el-select
        v-model="repoDetailStore.activeInstance"
        placeholder="Select"
        class="!w-[400px] mb-1 ml-1"
        size="large"
        @change="refreshInstanceLogs"
        :disabled="isLoading || !hasInstances"
      >
        <el-option
          v-for="instance in instances"
          :key="instance.name"
          :label="instance.name"
          :value="instance.name"
        />
      </el-select>
      <CsgButton
        class="btn btn-primary btn-sm"
        :name="$t('endpoints.logDownload')"
        @click="downloadLog"
        :disabled="isLoading || !hasInstances"
      />
    </div>
    <div
      class="h-[80vh] bg-gray-800 p-6 rounded-xl text-white overflow-auto"
      ref="instanceLogDiv"
    >
      <p>...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, nextTick, computed, onMounted, watch, onUnmounted } from 'vue'
import refreshJWT from '../../packs/refreshJWT.js'
import { fetchEventSource } from '@microsoft/fetch-event-source'
import { useCookies } from 'vue3-cookies'
import useRepoDetailStore from '../../stores/RepoDetailStore.js'
import CsgButton from '../shared/CsgButton.vue'

const props = defineProps({
  instances: Array,
  notebookId: [String, Number],
  deployId: [String, Number]
})

const repoDetailStore = useRepoDetailStore()
const csghubServer = inject('csghubServer')
const { cookies } = useCookies()
const instanceLogDiv = ref(null)
const instanceLogLineNum = ref(0)
const isLogsSSEConnected = ref(false)
const shouldAutoScroll = ref(true)
const isLoading = ref(true)
const isInitialSetupDone = ref(false)
const hasInstances = computed(() => {
  return Array.isArray(props.instances) && props.instances.length > 0
})

watch(() => repoDetailStore.activeInstance, (newValue) => {
  if (repoDetailStore.status !== 'Running') {
    return
  }
  
  if (!newValue) {
    return
  }
  
  if (props.instances?.length > 0) {
    const instanceExists = props.instances.some(instance => instance.name === newValue)
    if (instanceExists) {
      if (!isLogsSSEConnected.value && isInitialSetupDone.value) {
        syncInstanceLogs(newValue)
      }
    } else {
      repoDetailStore.activeInstance = ''
    }
  } else {
    repoDetailStore.activeInstance = ''
  }
}, { immediate: false })

watch(() => repoDetailStore.isInitialized, (initialized) => {
  if (initialized && isInitialSetupDone.value && 
      repoDetailStore.status === 'Running' && 
      props.instances?.length > 0) {
    const firstInstance = props.instances[0].name
    
    if (repoDetailStore.activeInstance !== firstInstance) {
      repoDetailStore.activeInstance = firstInstance
    } else if (!isLogsSSEConnected.value) {
      syncInstanceLogs(firstInstance)
    }
  }
})

watch(() => repoDetailStore.status, (newStatus) => {
  if (newStatus !== 'Running' || !props.instances?.length) {
    isLogsSSEConnected.value = false
    isLoading.value = false
    return
  }
  
  if (!isLogsSSEConnected.value && isInitialSetupDone.value && props.instances?.length > 0) {
    if (repoDetailStore.activeInstance) {
      const instanceExists = props.instances.some(instance => instance.name === repoDetailStore.activeInstance)
      if (instanceExists) {
        syncInstanceLogs(repoDetailStore.activeInstance)
        return
      }
    }
    
    const firstInstance = props.instances[0].name
    repoDetailStore.activeInstance = firstInstance
  }
})

watch(() => props.instances, (newInstances) => {
  isLogsSSEConnected.value = false
  
  if (!newInstances?.length) {
    repoDetailStore.activeInstance = ''
    isLoading.value = false
    return
  } 
  
  if (isInitialSetupDone.value && repoDetailStore.status === 'Running') {
    const firstInstance = newInstances[0].name
    if (repoDetailStore.activeInstance !== firstInstance) {
      repoDetailStore.activeInstance = firstInstance
    }
  } else {
    isLoading.value = false
  }
}, { deep: true })

const syncInstanceLogs = (instanceName) => {
  if (repoDetailStore.status !== 'Running') {
    isLoading.value = false
    return
  }
  
  if (isLogsSSEConnected.value || !instanceName || !Array.isArray(props.instances)) {
    isLoading.value = false
    return
  }
  
  if (!props.instances.length) {
    repoDetailStore.activeInstance = ''
    isLoading.value = false
    return
  }
  
  const instanceExists = props.instances.some(instance => instance.name === instanceName)
  if (!instanceExists) {
    if (repoDetailStore.activeInstance === instanceName) {
      repoDetailStore.activeInstance = ''
    }
    isLoading.value = false
    return
  }
  
  fetchEventSource(`${csghubServer}/api/v1/notebooks/${props.notebookId}/logs/${instanceName}`, {
    openWhenHidden: true,
    headers: {
      Authorization: `Bearer ${cookies.get('user_token')}`,
    },
    async onopen(response) {
      isLoading.value = false
      if (response.ok) {
        isLogsSSEConnected.value = true
        nextTick(() => {
          if (instanceLogDiv.value) {
            instanceLogDiv.value.innerHTML = ''
            instanceLogLineNum.value = 0
          }
        })
      } else if (response.status === 401) {
        refreshJWT()
      } else if (response.status >= 400 && response.status < 500 && response.status !== 429) {
        console.log('Logs Server Connection Error')
        console.log(response.status)
        console.log(response.body)
      } else {
        console.log('Logs Server Unknow Error')
        console.log(response.body)
      }
    },
    onmessage(ev) {
      if (ev.event === 'Container') {
        nextTick(() => {
          if (instanceLogDiv.value) {
            appendLog(instanceLogDiv, ev.data, instanceLogLineNum);
            scrollToBottom(instanceLogDiv);
          }
        });
      }
    },
    onerror() {
      isLogsSSEConnected.value = false
    }
  })
}

const isAtBottom = () => {
  const element = instanceLogDiv.value
  if (!element) return true
  return Math.abs(element.scrollHeight - element.scrollTop - element.clientHeight) < 10
}

const handleScroll = () => {
  shouldAutoScroll.value = isAtBottom()
}

const scrollToBottom = (targetRef) => {
  if (!targetRef?.value) return
  
  const targetDiv = targetRef.value
  if (shouldAutoScroll.value) {
    targetDiv.scrollTop = targetDiv.scrollHeight
  }
}

const appendLog = (refElem, data, refLineNum) => {
  if (!refElem?.value) return

  const ansiToHtml = (text) => {
    const ansiMap = {
      '0': '</span>',
      '31': '<span style="color:#e25555">',
      '32': '<span style="color:#4caf50">',
      '33': '<span style="color:#ffb300">',
      '34': '<span style="color:#42a5f5">',
      '35': '<span style="color:#ab47bc">',
      '36': '<span style="color:#26c6da">',
      '37': '<span style="color:#bdbdbd">',
    }
    return text.replace(/\x1b\[(\d+)m/g, (match, code) => ansiMap[code] || '')
  }

  function filterPrefixes(text) {
    return text.replace(/(platform)-\d+\s*\|\s*/g, '');
  }

  function addSpaceAfterLogLevel(text) {
    return text.replace(/(INFO|WARN|ERROR|DEBUG|TRACE|FATAL)([^\s])/g, '$1 $2');
  }

  const processedData = data.replace(/\\n/g, '\n');

  const fragment = document.createDocumentFragment();
  
  processedData.split('\n').forEach(line => {
    if (!line.trim()) return;

    line = line.replace(/\[(\d{4})\]/g, (_, time) => `[${time.slice(0, 2)}:${time.slice(2)}]`)
             .replace(/\[(\d+)s\]/g, (_, sec) => `[00:${sec.padStart(2, '0')}]`);

    let content = line;
    
    content = filterPrefixes(content);
    
    content = addSpaceAfterLogLevel(content);
    
    content = ansiToHtml(content.replace(/\r/g, '<br>'));

    const divNode = document.createElement("div");
    divNode.className = "flex";

    const pNode1 = document.createElement("p");
    pNode1.className = "pr-6 pt-2";
    pNode1.innerHTML = `${refLineNum.value}:`;

    const pNode2 = document.createElement("p");
    pNode2.className = "pt-2";
    pNode2.innerHTML = content;

    divNode.appendChild(pNode1);
    divNode.appendChild(pNode2);

    fragment.appendChild(divNode);
    refLineNum.value += 1;
  });
  
  refElem.value.appendChild(fragment);
}

const downloadLog = () => {
  if (!instanceLogDiv?.value) return
  
  const logElements = instanceLogDiv.value.querySelectorAll('p')
  let logContent = ''
  logElements.forEach((element) => {
    logContent += `${element.textContent}\n`
  })

  const blob = new Blob([logContent], { type: 'text/plain' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = 'inference_deploy_log.txt'
  link.click()
  URL.revokeObjectURL(link.href)
}

const refreshInstanceLogs = (value) => {
  isLogsSSEConnected.value = false
  isLoading.value = true
  repoDetailStore.activeInstance = value
}

onMounted(() => {
  nextTick(() => {
    if (instanceLogDiv.value) {
      instanceLogDiv.value.addEventListener('scroll', handleScroll)
    }
    
    if (!props.instances?.length) {
      repoDetailStore.activeInstance = ''
      isLoading.value = false
      isInitialSetupDone.value = true
      return
    }
    
    isInitialSetupDone.value = true
    
    if (repoDetailStore.isInitialized && 
        repoDetailStore.status === 'Running' && 
        props.instances.length > 0) {
      const firstInstance = props.instances[0].name
      if (repoDetailStore.activeInstance !== firstInstance) {
        repoDetailStore.activeInstance = firstInstance
      } else if (!isLogsSSEConnected.value) {
        syncInstanceLogs(firstInstance)
      }
      console.log(`Status is ${repoDetailStore.status} on mount, waiting for status change`)
      isLoading.value = false
    }
  });
})

onUnmounted(() => {
  if (instanceLogDiv.value) {
    instanceLogDiv.value.removeEventListener('scroll', handleScroll);
  }
})
</script>
