<template>
  <div class="my-[16px]">
    <el-select
      v-model="currentInstance"
      placeholder="Select"
      style="width: 240px"
      @change="refreshInstanceLogs"
    >
      <el-option
        v-for="instance in instances"
        :key="instance.name"
        :label="instance.name"
        :value="instance.name"
      />
    </el-select>
    <div
      class="h-[80vh] border mt-[8px] overflow-scroll p-[8px]"
      ref="instanceLogDiv"
    >
    </div>
  </div>
</template>

<script setup>
  import { ref, computed, onMounted, inject } from 'vue'
  import refreshJWT from '../../packs/refreshJWT.js'
  import { fetchEventSource } from '@microsoft/fetch-event-source';
  import { useCookies } from "vue3-cookies";

  const props = defineProps({
    instances: Array,
    modelId: String,
    deployId: Number
  })

  const csghubServer = inject('csghubServer')
  const { cookies } = useCookies()

  const instanceLogDiv = ref(null)
  const instanceLogLineNum = ref(0)

  const defaultInstance = computed(() => {
    if (props.instances && props.instances.length !== 0) {
      return props.instances[0].name
    } else {
      return ''
    }
  })

  const currentInstance = ref(defaultInstance.value)
  const isLogsSSEConnected = ref(false)

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
        }
      },
      onerror(err) {
        console.log('Logs Server Error:')
        console.log(err)
      }
    })
  }

  const appendLog = (refElem, data, refLineNum) => {
    const node = document.createElement("p")
    node.innerHTML = `${refLineNum.value}: ${data.replace(/\\r/g, "<br>")}`
    if (refElem.value) {
      refElem.value.appendChild(node)
      refLineNum.value = refLineNum.value + 1
    }
  }

  const refreshInstanceLogs = (value) => {
    syncInstanceLogs(value)
  }

  onMounted(() => {
    if (isLogsSSEConnected.value === false && currentInstance.value !== '') {
      syncInstanceLogs(currentInstance.value)
    }
  })
</script>