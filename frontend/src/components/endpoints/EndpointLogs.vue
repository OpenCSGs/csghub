<template>
  <div class="my-4">
    <div class="flex justify-between items-center pb-2 flex-wrap gap-2">
      <div class="flex items-center gap-2 flex-wrap">
        <el-select
          v-model="currentInstance"
          placeholder="Select"
          class="!w-[220px]"
          size="default"
          @change="refreshInstanceLogs"
        >
          <el-option
            v-for="instance in instances"
            :key="instance.name"
            :label="instance.name"
            :value="instance.name"
          />
        </el-select>
        <el-input
          v-model="searchQuery"
          :placeholder="$t('endpoints.logSearch')"
          clearable
          :prefix-icon="Search"
          class="!w-[220px]"
          size="default"
          @input="handleSearchInput"
        />
        <span class="text-xs text-gray-500 whitespace-nowrap">
          {{
            searchQuery
              ? $t('endpoints.logLinesCount', { filtered: filteredCount, total: totalCount })
              : $t('endpoints.logTotalLines', { total: totalCount })
          }}
        </span>
      </div>

      <div class="flex items-center gap-2 flex-wrap">
        <CsgButton
          class="btn btn-secondary-gray btn-sm flex items-center gap-1"
          :class="{ '!bg-brand-50 !text-brand-700 !border-brand-300': autoScrollEnabled }"
          :name="$t('endpoints.logAutoScroll')"
          @click="toggleAutoScroll"
        />
        <CsgButton
          class="btn btn-secondary-gray btn-sm flex items-center gap-1"
          :class="{ '!bg-brand-50 !text-brand-700 !border-brand-300': wrapLines }"
          :name="$t('endpoints.logWrap')"
          @click="toggleWrapLines"
        />
        <CsgButton
          class="btn btn-secondary-gray btn-sm"
          :name="$t('endpoints.logCopy')"
          @click="copyLogs"
        />
        <CsgButton
          class="btn btn-secondary-gray btn-sm"
          :name="$t('endpoints.logClear')"
          @click="clearLogs"
        />
        <CsgButton
          class="btn btn-primary btn-sm"
          :name="$t('endpoints.logDownload')"
          @click="downloadLog"
        />
      </div>
    </div>

    <div
      class="h-[80vh] bg-gray-900 p-6 rounded-xl text-gray-100 font-mono text-xs overflow-auto"
      :class="wrapLines ? 'whitespace-pre-wrap break-all' : 'whitespace-pre overflow-x-auto'"
      ref="instanceLogDiv"
    >
      <p>...</p>
    </div>
  </div>
</template>

<script setup>
  import { ref, inject, nextTick, computed, onMounted, watch, onUnmounted } from 'vue'
  import { Search } from '@element-plus/icons-vue'
  import { ElMessage } from 'element-plus'
  import { useI18n } from 'vue-i18n'
  import refreshJWT from '../../packs/refreshJWT.js'
  import { fetchEventSource } from '@microsoft/fetch-event-source'
  import { useCookies } from 'vue3-cookies'
  import useRepoDetailStore from '../../stores/RepoDetailStore.js'
  import CsgButton from '../shared/CsgButton.vue'

  const props = defineProps({
    instances: Array,
    modelId: String,
    deployId: Number
  })

  const { t } = useI18n()
  const repoDetailStore = useRepoDetailStore()
  const csghubServer = inject('csghubServer')
  const { cookies } = useCookies()
  const instanceLogDiv = ref(null)
  const instanceLogLineNum = ref(0)
  const isLogsSSEConnected = ref(false)
  const shouldAutoScroll = ref(true)
  const autoScrollEnabled = ref(true)
  const wrapLines = ref(true)
  const searchQuery = ref('')
  const totalCount = ref(0)
  const filteredCount = ref(0)

  const currentInstance = computed({
    get() {
      return repoDetailStore.activeInstance
    },
    set(val) {
      repoDetailStore.activeInstance = val
    }
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
          const targetDiv = instanceLogDiv?.value || instanceLogDiv
          if (targetDiv) {
            targetDiv.innerHTML = ''
            instanceLogLineNum.value = 0
            totalCount.value = 0
            filteredCount.value = 0
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
            scrollToBottom(instanceLogDiv)
          })
        }
      },
      onerror(err) {
        console.log('Logs Server Error:')
        console.log(err)
      }
    })
  }

  const isAtBottom = () => {
    const element = instanceLogDiv?.value || instanceLogDiv
    if (!element) return true
    return Math.abs(element.scrollHeight - element.scrollTop - element.clientHeight) < 10
  }

  const handleScroll = () => {
    shouldAutoScroll.value = isAtBottom()
  }

  const scrollToBottom = (targetRef) => {
    const targetDiv = targetRef?.value || targetRef
    if (targetDiv && autoScrollEnabled.value && shouldAutoScroll.value) {
      targetDiv.scrollTop = targetDiv.scrollHeight
    }
  }

  const ansiToHtml = (text) => {
    const ansiMap = {
      '0': '</span>',
      '1': '<span class="font-bold">',
      '30': '<span style="color:#6b7280">',
      '31': '<span style="color:#ef4444">',
      '32': '<span style="color:#10b981">',
      '33': '<span style="color:#f59e0b">',
      '34': '<span style="color:#3b82f6">',
      '35': '<span style="color:#a855f7">',
      '36': '<span style="color:#06b6d4">',
      '37': '<span style="color:#d1d5db">',
      '90': '<span style="color:#9ca3af">',
      '91': '<span style="color:#f87171">',
      '92': '<span style="color:#34d399">',
      '93': '<span style="color:#fbbf24">',
      '94': '<span style="color:#60a5fa">',
      '95': '<span style="color:#c084fc">',
      '96': '<span style="color:#22d3ee">',
      '97': '<span style="color:#ffffff">',
    }
    return text.replace(/\x1b\[(\d+)m/g, (match, code) => ansiMap[code] || '')
  }

  const appendLog = (refElem, data, refLineNum) => {
    const targetElem = refElem?.value || refElem
    if (!targetElem) return

    const lineNumRef = refLineNum && typeof refLineNum === 'object' && 'value' in refLineNum
      ? refLineNum
      : { value: 1 }

    const processedData = data.replace(/\\n/g, '\n')
    const lines = processedData.split('\n')
    const fragment = document.createDocumentFragment()

    lines.forEach((line) => {
      if (!line.trim()) return

      const formattedContent = ansiToHtml(line.replace(/\\r/g, '<br>').replace(/\r/g, '<br>'))

      const divNode = document.createElement('div')
      divNode.className = 'flex log-line'

      const pNode1 = document.createElement('p')
      pNode1.className = 'pr-4 pt-1 text-gray-500 select-none flex-shrink-0'
      pNode1.innerHTML = `${lineNumRef.value}:`

      const pNode2 = document.createElement('p')
      pNode2.className = 'pt-1 break-all'
      pNode2.innerHTML = formattedContent

      divNode.appendChild(pNode1)
      divNode.appendChild(pNode2)

      if (searchQuery.value?.trim()) {
        const query = searchQuery.value.trim().toLowerCase()
        const textContent = line.toLowerCase()
        if (!textContent.includes(query)) {
          divNode.style.display = 'none'
        } else {
          filteredCount.value += 1
        }
      } else {
        filteredCount.value += 1
      }

      fragment.appendChild(divNode)
      lineNumRef.value += 1
      totalCount.value += 1
    })

    targetElem.appendChild(fragment)
  }

  const handleSearchInput = () => {
    const targetDiv = instanceLogDiv?.value || instanceLogDiv
    if (!targetDiv) return
    const query = searchQuery.value?.trim().toLowerCase()
    const logNodes = targetDiv.querySelectorAll('.log-line')
    let matchCount = 0

    logNodes.forEach((node) => {
      if (!query) {
        node.style.display = 'flex'
        matchCount++
      } else {
        const text = node.textContent?.toLowerCase() || ''
        if (text.includes(query)) {
          node.style.display = 'flex'
          matchCount++
        } else {
          node.style.display = 'none'
        }
      }
    })

    filteredCount.value = matchCount
  }

  const toggleAutoScroll = () => {
    autoScrollEnabled.value = !autoScrollEnabled.value
    const targetDiv = instanceLogDiv?.value || instanceLogDiv
    if (autoScrollEnabled.value && targetDiv) {
      targetDiv.scrollTop = targetDiv.scrollHeight
    }
  }

  const toggleWrapLines = () => {
    wrapLines.value = !wrapLines.value
  }

  const clearLogs = () => {
    const targetDiv = instanceLogDiv?.value || instanceLogDiv
    if (targetDiv) {
      targetDiv.innerHTML = ''
    }
    instanceLogLineNum.value = 0
    totalCount.value = 0
    filteredCount.value = 0
  }

  const copyLogs = async () => {
    const targetDiv = instanceLogDiv?.value || instanceLogDiv
    if (!targetDiv) return

    const logNodes = targetDiv.querySelectorAll('.log-line')
    const linesToCopy = []
    logNodes.forEach((node) => {
      if (node.style.display !== 'none') {
        const pTags = node.querySelectorAll('p')
        if (pTags.length >= 2) {
          linesToCopy.push(`${pTags[0].textContent} ${pTags[1].textContent}`)
        } else {
          linesToCopy.push(node.textContent)
        }
      }
    })

    const fullText = linesToCopy.join('\n')
    if (!fullText) return

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(fullText)
      } else {
        const textarea = document.createElement('textarea')
        textarea.value = fullText
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
      }
      ElMessage.success(t('endpoints.logCopied'))
    } catch (e) {
      console.error('Failed to copy logs', e)
    }
  }

  const downloadLog = () => {
    const targetDiv = instanceLogDiv?.value || instanceLogDiv
    if (!targetDiv) return

    const logNodes = targetDiv.querySelectorAll('.log-line')
    let logContent = ''
    logNodes.forEach((node) => {
      if (node.style.display !== 'none') {
        const pTags = node.querySelectorAll('p')
        if (pTags.length >= 2) {
          logContent += `${pTags[0].textContent} ${pTags[1].textContent}\n`
        } else {
          logContent += `${node.textContent}\n`
        }
      }
    })

    const blob = new Blob([logContent], { type: 'text/plain;charset=utf-8' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${props.modelId || 'endpoint'}_logs.txt`
    link.click()
    URL.revokeObjectURL(link.href)
  }

  const refreshInstanceLogs = (value) => {
    syncInstanceLogs(value)
  }

  onMounted(() => {
    if (currentInstance.value && isLogsSSEConnected.value === false) {
      syncInstanceLogs(currentInstance.value)
    }
    const targetDiv = instanceLogDiv?.value || instanceLogDiv
    if (targetDiv) {
      targetDiv.addEventListener('scroll', handleScroll)
    }
  })

  onUnmounted(() => {
    const targetDiv = instanceLogDiv?.value || instanceLogDiv
    if (targetDiv) {
      targetDiv.removeEventListener('scroll', handleScroll)
    }
  })
</script>