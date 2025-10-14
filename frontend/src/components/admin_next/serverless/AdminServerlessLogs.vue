<template>
  <div class="my-[16px]">
    <div class="flex justify-start items-center gap-3">
      <el-select
        v-model="currentInstance"
        placeholder="Select"
        style="width: 240px"
        @change="refreshInstanceLogs">
        <el-option
          v-for="instance in instances"
          :key="instance.name"
          :label="instance.name"
          :value="instance.name" />
      </el-select>
      <el-select
        v-model="timeDuration"
        placeholder="Select"
        class="!w-[150px]"
        size="large"
        @change="reloadTimeLogs">
        <el-option
          v-for="time in timeSelectObj"
          :key="time"
          :label="$t(`endpoints.timeDurations.${time}`)"
          :value="time" />
      </el-select>
    </div>
    <div
      class="h-[80vh] border mt-[8px] overflow-scroll p-[8px]"
      ref="instanceLogDiv"></div>
  </div>
</template>

<script setup>
  import { ref, inject, watch, nextTick, onMounted } from 'vue'
  import refreshJWT from '@/packs/refreshJWT'
  import { fetchEventSource } from '@microsoft/fetch-event-source'
  import { useCookies } from 'vue3-cookies'

  const props = defineProps({
    instances: {
      type: Array,
      default: []
    },
    modelId: String,
    deployId: Number
  })

  const csghubServer = inject('csghubServer')
  const { cookies } = useCookies()

  const instanceLogDiv = ref(null)
  const instanceLogLineNum = ref(0)

  const currentInstance = ref(props.instances[0]?.name || '')

  const timeSelectObj = ['10mins', '30mins', '1hour', '6hours', '1day', '2days', '1week','all']
  const timeDuration = ref('10mins')

  const reloadTimeLogs = ()=>{
    syncInstanceLogs(currentInstance.value)
  }

  watch(
    () => props.instances,
    (newInstances) => {
      if (newInstances && newInstances.length !== 0) {
        currentInstance.value = newInstances[0].name
        if (isLogsSSEConnected.value === false) {
          syncInstanceLogs(currentInstance.value)
        }
      }
    }
  )

  const isLogsSSEConnected = ref(false)

  const syncInstanceLogs = (instanceName) => {
    fetchEventSource(
      `${csghubServer}/api/v1/models/${props.modelId}/serverless/${props.deployId}/logs/${instanceName}?since=${timeDuration.value=='all'?'':timeDuration.value}`,
      {
        openWhenHidden: true,
        headers: {
          Authorization: `Bearer ${cookies.get('user_token')}`
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
          } else if (
            response.status >= 400 &&
            response.status < 500 &&
            response.status !== 429
          ) {
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
              scrollToBottom(instanceLogDiv)
            })
          }
        },
        onerror(err) {
          console.log('Logs Server Error:')
          console.log(err)
        }
      }
    )
  }

  const scrollToBottom = (targetRef) => {
    const targetDiv = targetRef.value
    if (targetDiv) {
      targetDiv.scrollTop = targetDiv.scrollHeight
    }
  }

  const appendLog = (refElem, data, refLineNum) => {
    const node = document.createElement('p')
    node.innerHTML = `${refLineNum.value}: ${data.replace(/\\r/g, '<br>')}`
    if (refElem.value) {
      refElem.value.appendChild(node)
      refLineNum.value = refLineNum.value + 1
    }
  }

  const refreshInstanceLogs = (value) => {
    syncInstanceLogs(value)
  }

  onMounted(() => {
    if (props.instances[0]) {
      syncInstanceLogs(props.instances[0].name)
    }
  })
</script>
