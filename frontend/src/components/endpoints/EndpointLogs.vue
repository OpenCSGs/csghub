<template>
  <div class="my-4">
    <div class="flex justify-between items-center pb-2">
      <el-select
        v-model="currentInstance"
        placeholder="Select"
        class="!w-[240px] mb-1 ml-1"
        size="large"
        @change="refreshInstanceLogs"
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
  import { fetchEventSource } from '@microsoft/fetch-event-source';
  import { useCookies } from "vue3-cookies";
  import useRepoDetailStore from '../../stores/RepoDetailStore.js'
  import CsgButton from '../shared/CsgButton.vue';

  const props = defineProps({
    instances: Array,
    modelId: String,
    deployId: Number
  })

  const repoDetailStore = useRepoDetailStore()
  const csghubServer = inject('csghubServer')
  const { cookies } = useCookies()
  const instanceLogDiv = ref(null)
  const instanceLogLineNum = ref(0)
  const isLogsSSEConnected = ref(false)
  const shouldAutoScroll = ref(true)
  const currentInstance = computed(() => {
    return repoDetailStore.activeInstance
  })

  watch([() => props.modelId, () => props.deployId], () => {
    if (currentInstance.value && isLogsSSEConnected.value === false) {
      syncInstanceLogs(currentInstance.value)
    }
  })

  watch(() => repoDetailStore.status, () => {
    if (currentInstance.value && isLogsSSEConnected.value === false) {
      syncInstanceLogs(currentInstance.value)
    }
  })

  const syncInstanceLogs = (instanceName) => {
    fetchEventSource(`${csghubServer}/api/v1/models/${props.modelId}/run/${props.deployId}/logs/${instanceName}`, {
      openWhenHidden: true,
      headers: {
        Authorization: `Bearer ${cookies.get('user_token')}`,
      },
      async onopen(response) {
        if (response.ok) {
          console.log('SSE logs server connected')
          isLogsSSEConnected.value = true
          if (instanceLogDiv.value) {
            instanceLogDiv.value.innerHTML = ''
            instanceLogLineNum.value = 0
          }
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
          appendLog(instanceLogDiv, ev.data, instanceLogLineNum)
          nextTick(() => {
            scrollToBottom(instanceLogDiv);
          });
        }
      },
      onerror(err) {
        console.log('Logs Server Error:')
        console.log(err)
      }
    })
  }

  const isAtBottom = () => {
    const element = instanceLogDiv.value;
    if (!element) return true;
    return Math.abs(element.scrollHeight - element.scrollTop - element.clientHeight) < 10;
  }

  const handleScroll = () => {
    shouldAutoScroll.value = isAtBottom();
  }

  const scrollToBottom = (targetRef) => {
    const targetDiv = targetRef.value;
    if (targetDiv && shouldAutoScroll.value) {
      targetDiv.scrollTop = targetDiv.scrollHeight;
    }
  }

  const appendLog = (refElem, data, refLineNum) => {
    // Create the div element
    const divNode = document.createElement("div");
    divNode.className = "flex";

    // Create the first p element
    const pNode1 = document.createElement("p");
    pNode1.className = "pr-6 pt-2";
    pNode1.innerHTML = `${refLineNum.value}:`;

    // Create the second p element
    const pNode2 = document.createElement("p");
    pNode2.className = "pt-2";
    pNode2.innerHTML = `${data.replace(/\\r/g, "<br>")}`;

    // Append the p elements to the div element
    divNode.appendChild(pNode1);
    divNode.appendChild(pNode2);

    // const node = document.createElement("p")
    // node.innerHTML = `${refLineNum.value}: ${data.replace(/\\r/g, "<br>")}`
    if (refElem.value) {
      refElem.value.appendChild(divNode)
      refLineNum.value = refLineNum.value + 1
    }
  }

  const downloadLog = () => {
    const targetDiv = instanceLogDiv;
    if (!targetDiv.value) return;

    const logElements = targetDiv.value.querySelectorAll('p');
    let logContent = '';
    logElements.forEach((element) => {
      logContent += element.textContent + '\n';
    });

    const blob = new Blob([logContent], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'inference_deploy_log.txt'
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const refreshInstanceLogs = (value) => {
    syncInstanceLogs(value)
  }

  onMounted(() => {
    if (currentInstance.value && isLogsSSEConnected.value === false) {
      syncInstanceLogs(currentInstance.value)
    }
    if (instanceLogDiv.value) {
      instanceLogDiv.value.addEventListener('scroll', handleScroll);
    }
  })

  onUnmounted(() => {
    if (instanceLogDiv.value) {
      instanceLogDiv.value.removeEventListener('scroll', handleScroll);
    }
  })
</script>