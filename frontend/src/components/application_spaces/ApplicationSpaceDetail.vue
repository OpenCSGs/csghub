<template>
  <div
    class="w-full bg-gray-25 border-b border-gray-100 pt-9 pb-[60px] xl:px-10 md:px-0 md:pb-6 md:h-auto"
    v-show="!isDataLoading && isInitialized">
    <div class="mx-auto page-responsive-width">
      <repo-header
        :license="repoDetailStore.license"
        :name="repoDetailStore.name"
        :nickname="repoDetailStore.nickname"
        :path="`${namespace}/${repoName}`"
        :desc="repoDetailStore.description"
        :appStatus="repoDetailStore.status"
        :space-resource="repoDetailStore.hardware"
        :avatar="repoDetailStore.namespace?.Avatar"
        :tags="tags"
        :owner-url="ownerUrl"
        :canWrite="repoDetailStore.canWrite"
        repo-type="space"
        :repoId="repoDetailStore.repositoryId"
        :totalLikes="repoDetailStore.likeCount"
        :hasLike="repoDetailStore.userLikes"
        @toggleSpaceLogsDrawer="toggleSpaceLogsDrawer" />
    </div>
  </div>
  <div class="mx-auto page-responsive-width mt-[-40px] md:px-0" v-show="!isDataLoading && isInitialized">
    <repo-tabs
      :repo-detail="repoDetailStore"
      :appStatus="repoDetailStore.status"
      :sdk="repoDetailStore.sdk"
      :appEndpoint="appEndpoint"
      :current-branch="currentBranch || repoDetailStore.defaultBranch || 'main'"
      :current-path="currentPath"
      :default-tab="defaultTab"
      :actionName="actionName"
      :settingsVisibility="repoDetailStore.canManage"
      :can-write="repoDetailStore.canWrite"
      repo-type="space"
      :user-name="userName"
      :commitId="commitId"
      @toggleSpaceLogsDrawer="toggleSpaceLogsDrawer"
      :path="`${namespace}/${repoName}`" />
  </div>

  <LoadingSpinner 
    :loading="isDataLoading" 
    :text="$t('application_spaces.loading')" 
  />

  <!-- logs drawer -->
  <div v-show="repoDetailStore.canWrite">
    <el-drawer
      v-model="spaceLogsDrawer"
      direction="btt"
      :size="drawerSize"
      :show-close="false">
      <template #header="{ close }">
        <div class="flex flex-col gap-6 pt-3">
          <div class="flex justify-between gap-1.5 pb-6 border-b">
            <div class="flex gap-1.5">
              <div
                class="flex items-center border rounded-md border-gray-200 p-2.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none">
                  <path
                    d="M11.6663 9.16699H6.66634M8.33301 12.5003H6.66634M13.333 5.83366H6.66634M16.6663 8.75033V5.66699C16.6663 4.26686 16.6663 3.5668 16.3939 3.03202C16.1542 2.56161 15.7717 2.17916 15.3013 1.93948C14.7665 1.66699 14.0665 1.66699 12.6663 1.66699H7.33301C5.93288 1.66699 5.23281 1.66699 4.69803 1.93948C4.22763 2.17916 3.84517 2.56161 3.60549 3.03202C3.33301 3.5668 3.33301 4.26686 3.33301 5.66699V14.3337C3.33301 15.7338 3.33301 16.4339 3.60549 16.9686C3.84517 17.439 4.22763 17.8215 4.69803 18.0612C5.23281 18.3337 5.93288 18.3337 7.33301 18.3337H9.58301M18.333 18.3337L17.083 17.0837M17.9163 15.0003C17.9163 16.6112 16.6105 17.917 14.9997 17.917C13.3888 17.917 12.083 16.6112 12.083 15.0003C12.083 13.3895 13.3888 12.0837 14.9997 12.0837C16.6105 12.0837 17.9163 13.3895 17.9163 15.0003Z"
                    stroke="#344054"
                    stroke-width="1.66667"
                    stroke-linecap="round"
                    stroke-linejoin="round" />
                </svg>
              </div>
              <div class="felx flex-col gap-1">
                <p class="font-medium text-md text-black">
                  {{ $t('application_spaces.errorPage.log') }}
                </p>
                <div class="text-gray-600 text-sm font-light">
                  {{ $t('application_spaces.errorPage.logDesc') }}
                </div>
              </div>
            </div>
            <div class="flex gap-2 items-center">
              <CsgButton
                class="btn btn-secondary-gray btn-lg"
                v-if="drawerSize === '70%'"
                @click="toggleDrawerSize"
                svgName="chevron-up" />
              <CsgButton
                class="btn btn-secondary-gray btn-lg" 
                v-else
                @click="toggleDrawerSize"
                svgName="chevron-down" />
              <CsgButton
                class="btn btn-secondary-gray btn-lg"
                @click="close"
                svgName="x-close" />
            </div>
          </div>
          <div class="flex justify-between gap-4">
            <div class="flex-1">
              <el-tabs v-model="activeTab" class="log-tabs">
                <el-tab-pane :label="$t('application_spaces.errorPage.build')" name="build" />
                <el-tab-pane :label="$t('application_spaces.errorPage.container')" name="container" />
              </el-tabs>
            </div>
            <CsgButton  
              class="btn btn-secondary-gray btn-sm"
              @click="downloadLog"
              :name="$t('application_spaces.errorPage.download')" />
          </div>
        </div>
      </template>
      <div class="flex flex-col gap-4 h-full">
        <div
          v-show="isBuildLogTab"
          ref="buildLogDiv"
          class="flex-1 h-0 overflow-y-auto bg-gray-800 p-6 rounded-xl text-white">
          <p>...</p>
        </div>
        <div
          v-show="!isBuildLogTab"
          ref="containerLogDiv"
          class="flex-1 h-0 overflow-y-auto bg-gray-800 p-6 rounded-xl text-white">
          <p>...</p>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
  import { ref, onMounted, inject, computed, nextTick, provide, watch, onUnmounted } from 'vue'
  import RepoHeader from '../shared/RepoHeader.vue'
  import RepoTabs from '../shared/RepoTabs.vue'
  import CsgButton from '../shared/CsgButton.vue'
  import LoadingSpinner from '../shared/LoadingSpinner.vue'
  import { useCookies } from 'vue3-cookies'
  import { fetchEventSource } from '@microsoft/fetch-event-source'
  import { useI18n } from 'vue-i18n'
  import refreshJWT from '../../packs/refreshJWT.js'
  import useRepoDetailStore from '../../stores/RepoDetailStore'
  import useFetchApi from '../../packs/useFetchApi'
  import { buildTags } from '../../packs/buildTags'
  import { ElMessage } from 'element-plus'
  import { storeToRefs } from 'pinia'
  import { useRepoTabStore } from '../../stores/RepoTabStore'
  import { ToNotFoundPage } from '../../packs/utils'

  const props = defineProps({
    repoType: String,
    files: Object,
    lastCommit: Object,
    branches: Object,
    currentBranch: String,
    currentPath: String,
    defaultTab: String,
    blob: Object,
    actionName: String,
    tags: Object,
    userName: String,
    commitId: String,
    namespace: String,
    repoName: String
  })

  const csghubServer = inject('csghubServer')

  const repoDetailStore = useRepoDetailStore()
  const { isInitialized } = storeToRefs(repoDetailStore)
  const { setRepoTab } = useRepoTabStore()
  
  const isDataLoading = ref(false)

  const { cookies } = useCookies()
  const appEndpoint = computed(() => {
    if (ENABLE_HTTPS === 'true') {
      return `https://${repoDetailStore.endpoint}`
    } else {
      return `http://${repoDetailStore.endpoint}`
    }
  })

  const tags = computed(() => {
    return buildTags(repoDetailStore)
  })

  // const ownerUrl = ref('')
  const ownerUrl = computed(() => {
    if (repoDetailStore.user.username === props.namespace) {
      return `/profile/${props.namespace}`
    } else {
      return `/organizations/${props.namespace}`
    }
  })

  const isSameRepo = computed(() => {
    return (
      props.repoType === repoDetailStore.repoType &&
      props.namespace === repoDetailStore.namespace.Path &&
      props.repoName === repoDetailStore.name
    )
  })

  const spaceLogsDrawer = ref(false)
  const buildLogDiv = ref(null)
  const containerLogDiv = ref(null)
  const buildLogLineNum = ref(0)
  const containerLogLineNum = ref(0)

  const activeTab = ref('build')
  const isBuildLogTab = computed(() => activeTab.value === 'build')
  
  const drawerSize = ref('70%')

  const isStatusSSEConnected = ref(false)
  const isLogsSSEConnected = ref(false)

  const isUserScrolling = ref(false)
  const isAtBottom = ref(true)

  const handleScroll = (event) => {
    const container = event.target
    const scrollPosition = container.scrollTop + container.clientHeight
    const scrollHeight = container.scrollHeight
    // 判断是否在底部，允许 5px 的误差
    isAtBottom.value = Math.abs(scrollHeight - scrollPosition) < 5
  }

  const scrollToBottom = () => {
    const targetDiv = isBuildLogTab.value ? buildLogDiv.value : containerLogDiv.value
    if (targetDiv && isAtBottom.value) {
      targetDiv.scrollTop = targetDiv.scrollHeight
    }
  }

  const toggleDrawerSize = () => {
    if (drawerSize.value === '70%') {
      drawerSize.value = '100%'
    } else {
      drawerSize.value = '70%'
    }
  }

  const fetchRepoDetail = async (isUpdate = false) => {
    if (isDataLoading.value) {
      return false
    }
    if (!isUpdate) {
      isDataLoading.value = true
    }
    
    const url = `/${props.repoType}s/${props.namespace}/${props.repoName}`

    try {
      const { response, data, error } = await useFetchApi(url).json()
      
      if (response.value.status === 404) {
        ToNotFoundPage()
        return false
      }
      
      if (!data.value) {
        ElMessage.warning(error.value.msg)
        return false
      }

      const repoData = data.value.data
      repoDetailStore.initialize(repoData, props.repoType)
      
      setRepoTab({
        currentBranch: props.currentBranch ? props.currentBranch : repoDetailStore.defaultBranch,
      })
      return true
    } catch (error) {
      return false
    } finally {
      isDataLoading.value = false
    }
  }

  const controller = ref(null);

  const toggleSpaceLogsDrawer = () => {
    spaceLogsDrawer.value = !spaceLogsDrawer.value;
  }

  watch(spaceLogsDrawer, (newVal) => {
    if (newVal) {
      nextTick(() => {
        const logContainer = isBuildLogTab.value ? buildLogDiv.value : containerLogDiv.value
        if (logContainer) {
          logContainer.addEventListener('scroll', handleScroll)
          // 初始打开时滚动到底部
          logContainer.scrollTop = logContainer.scrollHeight
          isAtBottom.value = true
        }
      })
      syncSpaceLogs()
    } else {
      const logContainer = isBuildLogTab.value ? buildLogDiv.value : containerLogDiv.value
      if (logContainer) {
        logContainer.removeEventListener('scroll', handleScroll)
      }
      if (controller.value) {
        console.log('Closing SSE logs connection')
        controller.value.abort()
        controller.value = null
        isLogsSSEConnected.value = false
      }
    }
  });

  // 监听标签切换，切换时重新设置滚动
  watch(activeTab, () => {
    if (spaceLogsDrawer.value) {
      nextTick(() => {
        const logContainer = isBuildLogTab.value ? buildLogDiv.value : containerLogDiv.value
        if (logContainer) {
          // 移除旧容器的事件监听
          const oldContainer = !isBuildLogTab.value ? buildLogDiv.value : containerLogDiv.value
          if (oldContainer) {
            oldContainer.removeEventListener('scroll', handleScroll)
          }
          // 添加新容器的事件监听
          logContainer.addEventListener('scroll', handleScroll)
          // 切换标签时滚动到底部
          logContainer.scrollTop = logContainer.scrollHeight
          isAtBottom.value = true
        }
      })
    }
  })

  const syncSpaceLogs = () => {
    if (controller.value) {
      controller.value.abort();
      controller.value = null;
    }
    
    if (buildLogDiv.value) {
      buildLogDiv.value.innerHTML = '';
      buildLogLineNum.value = 0;
    }
    if (containerLogDiv.value) {
      containerLogDiv.value.innerHTML = '';
      containerLogLineNum.value = 0;
    }
    controller.value = new AbortController();
    
    fetchEventSource(
      `${csghubServer}/api/v1/spaces/${props.namespace}/${props.repoName}/logs`,
      {
        openWhenHidden: true,
        headers: {
          Authorization: `Bearer ${cookies.get('user_token')}`
        },
        signal: controller.value.signal,
        async onopen(response) {
          if (!spaceLogsDrawer.value) {
            controller.value?.abort();
            return;
          }
          
          if (response.ok) {
            console.log('SSE logs server connected');
            isLogsSSEConnected.value = true;
          } else if (response.status === 401) {
            refreshJWT();
          } else if (
            response.status >= 400 &&
            response.status < 500 &&
            response.status !== 429
          ) {
            console.log('Logs Server Connection Error');
            console.log(response.status);
            console.log(response.body);
          } else {
            console.log('Logs Server Unknown Error');
            console.log(response.body);
          }
        },
        onmessage(ev) {
          if (!spaceLogsDrawer.value) {
            controller.value?.abort();
            return;
          }
          
          if (ev.event === 'Build') {
            appendLog(buildLogDiv, ev.data, buildLogLineNum, buildLogBlocks, { value: lastBuildLogTime })
            nextTick(() => {
              scrollToBottom();
            });
          } else if (ev.event === 'Container') {
            const lines = ev.data.split('\n');
            lines.forEach(line => {
              if (line.trim()) {
                appendLog(containerLogDiv, line, containerLogLineNum, containerLogBlocks, { value: lastContainerLogTime })
              }
            });

            nextTick(() => {
              scrollToBottom();
            });
          }
        },
        onerror(err) {
          console.log('Logs Server Error:');
          console.log(err);
          
          if (!spaceLogsDrawer.value) {
            controller.value?.abort();
            return;
          }
        }
      }
    ).catch(err => {
      if (err.name !== 'AbortError' && spaceLogsDrawer.value) {
        console.error('Unexpected error in logs connection:', err);
      }
    });
  }

  onUnmounted(() => {
    const logContainer = isBuildLogTab.value ? buildLogDiv.value : containerLogDiv.value
    if (logContainer) {
      logContainer.removeEventListener('scroll', handleScroll)
    }
    if (controller.value) {
      controller.value.abort()
      controller.value = null
    }
  });

  // 日志块缓存和最后时间戳
  const buildLogBlocks = ref([]) // [{ time: '03s', lines: ['内容1', '内容2'] }]
  const containerLogBlocks = ref([])
  let lastBuildLogTime = ''
  let lastContainerLogTime = ''

  const appendLog = (refElem, data, refLineNum, logBlocksRef, lastLogTimeRef) => {
    if (!refElem.value) return;
    
    // ANSI 转 HTML 简单实现
    function ansiToHtml(text) {
      const ansiMap = {
        '0': '</span>', // reset
        '31': '<span style="color:#e25555">', // red
        '32': '<span style="color:#4caf50">', // green
        '33': '<span style="color:#ffb300">', // yellow
        '34': '<span style="color:#42a5f5">', // blue
        '35': '<span style="color:#ab47bc">', // magenta
        '36': '<span style="color:#26c6da">', // cyan
        '37': '<span style="color:#bdbdbd">', // white/gray
      };
      return text.replace(/\x1b\[(\d+)m/g, (match, code) => ansiMap[code] || '');
    }

    /**
     * 将 [0004] 转换为 [00:04] 格式
     */
    function formatTime(timeStr) {
      if (!timeStr) return '';
      
      // 处理秒格式 (如 "03s")
      if (/^\d+s$/.test(timeStr)) {
        const seconds = timeStr.replace('s', '').padStart(2, '0');
        return `00:${seconds}`;
      }
      
      // 处理纯数字格式 (如 "0107")
      if (/^\d{4}$/.test(timeStr)) {
        return `${timeStr.slice(0, 2)}:${timeStr.slice(2)}`;
      }
      
      return timeStr;
    }

    /**
     * 过滤不需要的前缀如"build-"
     */
    function filterPrefixes(text) {
      return text.replace(/(build|platform)-\d+\s*\|\s*/g, '');
    }

    // 新增：在日志级别后添加空格的函数
    function addSpaceAfterLogLevel(text) {
      return text.replace(/(INFO|WARN|ERROR|DEBUG|TRACE|FATAL)([^\s])/g, '$1 $2');
    }

    // 处理换行符
    const processedData = data.replace(/\\n/g, '\n');

    // 按行处理日志内容
    processedData.split('\n').forEach(line => {
      if (!line.trim()) return;

      // 转换时间格式 [0004] → [00:04]
      line = line.replace(/\[(\d{4})\]/g, (_, time) => `[${time.slice(0, 2)}:${time.slice(2)}]`)
               .replace(/\[(\d+)s\]/g, (_, sec) => `[00:${sec.padStart(2, '0')}]`);

      // 处理内容
      let content = line;
      
      // 过滤不需要的前缀
      content = filterPrefixes(content);
      
      // 在日志级别后添加空格
      content = addSpaceAfterLogLevel(content);
      
      content = ansiToHtml(content.replace(/\\r/g, '<br>'));

      // 合并到同一时间块（不再使用时间块分组）
      logBlocksRef.value.push({ 
        time: '',  // 置空时间，不在渲染时显示单独的时间行
        lines: [content] 
      });
    });

    // 重新渲染
    renderLogBlocks(refElem, logBlocksRef)
    refLineNum.value = logBlocksRef.value.reduce((acc, b) => acc + b.lines.length, 0)
    nextTick(() => {
      scrollToBottom()
    })
  }

  function renderLogBlocks(refElem, logBlocksRef) {
      if (!refElem.value) return
      refElem.value.innerHTML = ''
      let lineNum = 0
      logBlocksRef.value.forEach(block => {
        const blockDiv = document.createElement('div')
        blockDiv.className = 'mb-2'
        if (block.time) {
          const timeDiv = document.createElement('div')
          timeDiv.className = 'text-base text-gray-400 mb-1 flex items-center'
          timeDiv.innerHTML = `⏱ <span class='ml-1'>${block.time}</span>`
          blockDiv.appendChild(timeDiv)
        }
        block.lines.forEach(line => {
          const lineDiv = document.createElement('div')
          lineDiv.className = 'flex items-start'
          // 在INFO/WARN/ERROR等类型和内容之间加4px间距
          let lineHtml = line
          // 匹配以INFO/WARN/ERROR/DEBUG等大写单词开头的内容，后跟内容
          lineHtml = lineHtml.replace(/^(<span[^>]*>)*(INFO|WARN|ERROR|DEBUG|TRACE|FATAL|NOTICE|WARNING)(<\/span[^>]*>)*([\s\S]*?)(?=<|$)/, (match, p1, type, p3, rest) => {
            return `${p1 || ''}${type}${p3 || ''}<span style='display:inline-block;width:4px'></span>${rest || ''}`
          })
          lineDiv.innerHTML = `<span class='mr-1 text-base text-gray-400' style='min-width:2.5em;display:inline-block;'>${lineNum}:</span><span class='mr-2 text-base'>•</span><span class='text-base'>${lineHtml}</span>`
          blockDiv.appendChild(lineDiv)
          lineNum++
        })
        refElem.value.appendChild(blockDiv)
      })
  }

  const downloadLog = () => {
    const logBlocks = isBuildLogTab.value ? buildLogBlocks : containerLogBlocks
    
    if (!logBlocks.value.length) {
      ElMessage.warning(t('application_spaces.errorPage.downloadNull'))
      return
    }

    // 时间格式转换函数
    const formatTime = (timeStr) => {
      if (!timeStr) return ''
      
      // 处理秒格式 (如 "03s")
      if (/^\d+s$/.test(timeStr)) {
        const seconds = timeStr.replace('s', '').padStart(2, '0')
        return `00:${seconds}`
      }
      
      // 处理纯数字格式 (如 "0107")
      if (/^\d{4}$/.test(timeStr)) {
        return `${timeStr.slice(0, 2)}:${timeStr.slice(2)}`
      }
      
      return timeStr
    }

    const logContent = logBlocks.value.map(block => {
      // 转换时间格式 [0004] → [00:04]
      const timeHeader = block.time ? `[${formatTime(block.time)}]\n` : ''
      return timeHeader + block.lines.map(line => {
        const tempDiv = document.createElement('div')
        tempDiv.innerHTML = line
        let plainText = tempDiv.textContent || tempDiv.innerText || ''
        
        // 1. 日志级别后添加空格 (INFO/WARN/ERROR等)
        plainText = plainText.replace(/^(INFO|WARN|ERROR|DEBUG|TRACE|FATAL|NOTICE|WARNING)([^\s])/, '$1 $2')
        
        // 2. 移除ANSI颜色代码
        plainText = plainText.replace(/\x1b\[[0-9;]*m/g, '')
        
        // 3. 处理换行符 (\r → \n)
        plainText = plainText.replace(/\\r/g, '\n')
        
        // 4. 处理换行符 (\n → 实际换行)
        plainText = plainText.replace(/\\n/g, '\n')
        
        return plainText
      }).join('\n')
    }).join('\n\n')

    try {
      const blob = new Blob([logContent], { type: 'text/plain;charset=utf-8' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `${props.repoName}_${isBuildLogTab.value ? 'build' : 'container'}_${new Date().toISOString().slice(0,10)}.log`
      
      document.body.appendChild(link)
      link.click()
      
      setTimeout(() => {
        document.body.removeChild(link)
        URL.revokeObjectURL(link.href)
      }, 100)
    } catch (err) {
      console.error('日志下载失败:', err)
      ElMessage.error(t('application_spaces.errorPage.downloadError'))
    }
}

  const syncSpaceStatus = () => {
    fetchEventSource(
      `${csghubServer}/api/v1/spaces/${props.namespace}/${props.repoName}/status`,
      {
        openWhenHidden: true,
        headers: {
          Authorization: `Bearer ${cookies.get('user_token')}`
        },
        async onopen(response) {
          if (response.ok) {
            console.log('SSE status server connected')
            isStatusSSEConnected.value = true
          } else if (response.status === 401) {
            refreshJWT()
          } else if (
            response.status >= 400 &&
            response.status < 500 &&
            response.status !== 429
          ) {
            console.log('Status Server Connection Error')
            console.log(response.status)
            console.log(response.body)
          } else {
            console.log('Status Server Unknow Error')
            console.log(response.body)
          }
        },
        onmessage(ev) {
          console.log(`SyncStatus: ${ev.data}`)
          if (repoDetailStore.status !== ev.data) {
            if (ev.data === 'Building') {
              if (buildLogDiv.value) {
                buildLogDiv.value.innerHTML = ''
                buildLogLineNum.value = 0
              }
              if (containerLogDiv.value) {
                containerLogDiv.value.innerHTML = ''
                containerLogLineNum.value = 0
              }
            }
            repoDetailStore.status = ev.data
          }
        },
        onerror(err) {
          console.log('Status Server Error:')
          console.log(err)
        }
      }
    )
  }

  onMounted(async () => {
    const success = await fetchRepoDetail()
    if (success) {
      if (isStatusSSEConnected.value === false) {
        syncSpaceStatus()
      }
    }

    setRepoTab({
      repoType: props.repoType,
      namespace: props.namespace,
      repoName: props.repoName,
      currentBranch: props.currentBranch || repoDetailStore.defaultBranch || 'main',
    })
  })

  provide('fetchRepoDetail', fetchRepoDetail)
</script>

<style scoped>
  body {
    background: #fff !important;
  }

  :deep(.el-drawer__header) {
    padding: 24px;
    margin-bottom: 0;
  }

  .active-tab {
    border-radius: var(--border-radius-sm);
    background: #e5e7eb;
    padding: 6px;
  }
</style>
