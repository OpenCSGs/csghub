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

// 仅在用户手动切换实例或外部主动修改时触发，避免初始化时重复调用
watch(() => repoDetailStore.activeInstance, (newValue, oldValue) => {
  if (!newValue || !isInitialSetupDone.value) {
    return
  }
  
  // 如果是初始化时的首次赋值（从空到有值），跳过，由 onMounted 处理
  if (!oldValue && newValue && !isLogsSSEConnected.value) {
    return
  }
  
  if (props.instances?.length > 0) {
    const instanceExists = props.instances.some(instance => instance.name === newValue)
    if (instanceExists) {
      if (!isLogsSSEConnected.value) {
        syncInstanceLogs(newValue)
      }
    } else {
      repoDetailStore.activeInstance = ''
    }
  } else {
    repoDetailStore.activeInstance = ''
  }
}, { immediate: false })

// 监听 store 初始化状态，仅在 store 延迟初始化的场景下触发
watch(() => repoDetailStore.isInitialized, (initialized, wasInitialized) => {
  // 只在从未初始化变为已初始化时处理，避免重复触发
  if (initialized && !wasInitialized && isInitialSetupDone.value && props.instances?.length > 0) {
    const firstInstance = props.instances[0].name
    
    if (repoDetailStore.activeInstance !== firstInstance) {
      repoDetailStore.activeInstance = firstInstance
    } else if (!isLogsSSEConnected.value) {
      syncInstanceLogs(firstInstance)
    }
  }
})

// 监听状态变化，仅在特定状态转换时重新连接日志
watch(() => repoDetailStore.status, (newStatus, oldStatus) => {
  if (!props.instances?.length) {
    isLogsSSEConnected.value = false
    isLoading.value = false
    return
  }
  
  // 只在状态真正发生变化且未连接时才处理，避免初始化时重复触发
  if (oldStatus && newStatus !== oldStatus && !isLogsSSEConnected.value && isInitialSetupDone.value) {
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
  
  if (isInitialSetupDone.value) {
    const firstInstance = newInstances[0].name
    if (repoDetailStore.activeInstance !== firstInstance) {
      repoDetailStore.activeInstance = firstInstance
      // syncInstanceLogs(firstInstance)
    }
  } else {
    isLoading.value = false
  }
}, { deep: true })

const syncInstanceLogs = (instanceName) => {
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
    
    // 无论 store 是否初始化，都尝试设置实例并连接日志
    if (props.instances.length > 0) {
      const firstInstance = props.instances[0].name
      
      // 如果当前没有选中实例或选中的实例不存在，设置为第一个
      if (!repoDetailStore.activeInstance || 
          !props.instances.some(inst => inst.name === repoDetailStore.activeInstance)) {
        repoDetailStore.activeInstance = firstInstance
      }
      
      const targetInstance = repoDetailStore.activeInstance || firstInstance
      if (!isLogsSSEConnected.value && targetInstance) {
        syncInstanceLogs(targetInstance)
      }
      
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
