<template>
  <div
    class="w-full bg-gray-25 border-b border-gray-100 pt-9 pb-[60px] xl:px-10 md:px-0 md:pb-6 md:h-auto">
    <div class="mx-auto page-responsive-width">
      <repo-header
        :license="repoDetailStore.license"
        :name="repoDetailStore.name"
        :nickname="applicationSpace.nickname"
        :path="`${namespace}/${repoName}`"
        :desc="repoDetailStore.description"
        :appStatus="appStatus"
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
  <div class="mx-auto page-responsive-width mt-[-40px] md:px-0">
    <repo-tabs
      :repo-detail="repoDetailStore"
      :appStatus="appStatus"
      :sdk="repoDetailStore.sdk"
      :appEndpoint="appEndpoint"
      :current-branch="currentBranch"
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

  <!-- logs drawer -->
  <div v-show="repoDetailStore.canWrite">
    <el-drawer
      v-model="spaceLogsDrawer"
      direction="btt"
      :size="drawerSize"
      :show-close="false">
      <template #header="{ close }">
        <div class="flex flex-col gap-[24px] pt-3">
          <div class="flex justify-between gap-1.5 pb-6 border-b">
            <div class="flex gap-1.5">
              <div
                class="flex items-center border rounded-md border-gray-200 p-[10px]">
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
                <p class="font-[600] text-md text-black">
                  {{ $t('application_spaces.errorPage.log') }}
                </p>
                <div class="text-gray-600 text-sm font-light">
                  {{ $t('application_spaces.errorPage.logDesc') }}
                </div>
              </div>
            </div>
            <div class="flex gap-[8px]">
              <el-icon
                v-if="drawerSize === '70%'"
                @click="toggleDrawerSize"
                ><ArrowUp
              /></el-icon>
              <el-icon
                v-else
                @click="toggleDrawerSize"
                ><ArrowDown
              /></el-icon>
              <el-icon @click="close"><CloseBold /></el-icon>
            </div>
          </div>
          <div class="flex justify-between">
            <div class="flex gap-4 items-center">
              <span
                class="text-sm text-gray-500 cursor-pointer"
                data-value="build"
                @click="toggleActiveTab"
                :class="isBuildLogTab ? 'active-tab' : ''"
                >{{ $t('application_spaces.errorPage.build') }}</span
              >
              <span
                class="text-sm text-gray-500 cursor-pointer"
                data-value="container"
                @click="toggleActiveTab"
                :class="isBuildLogTab ? '' : 'active-tab'"
                >{{ $t('application_spaces.errorPage.container') }}</span
              >
            </div>
            <div
              class="cursor-pointer text-xs text-brand-700 font-normal"
              @click="downloadLog">
              {{ $t('application_spaces.errorPage.download') }}
            </div>
          </div>
        </div>
      </template>
      <div
        v-show="isBuildLogTab"
        ref="buildLogDiv"
        class="h-auto bg-gray-800 p-6 rounded-xl text-white">
        <p>...</p>
      </div>
      <div
        v-show="!isBuildLogTab"
        ref="containerLogDiv"
        class="h-auto bg-gray-800 p-6 rounded-xl text-white">
        <p>...</p>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
  import { ref, onMounted, inject, computed, nextTick } from 'vue'
  import RepoHeader from '../shared/RepoHeader.vue'
  import RepoTabs from '../shared/RepoTabs.vue'
  import { useCookies } from 'vue3-cookies'
  import { fetchEventSource } from '@microsoft/fetch-event-source'
  import { useI18n } from 'vue-i18n'
  import refreshJWT from '../../packs/refreshJWT.js'
  import useRepoDetailStore from '../../stores/RepoDetailStore'
  import useFetchApi from '../../packs/useFetchApi'
  import { buildTags } from '../../packs/buildTags'
  import { ElMessage } from 'element-plus'
  import { storeToRefs } from 'pinia'

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

  // const allStatus = ['Building', 'Deploying', 'Startup', 'Running', 'Stopped', 'Sleeping', 'BuildingFailed', 'DeployFailed', 'RuntimeError']

  const applicationSpace = ref({})
  const { t } = useI18n()
  const { cookies } = useCookies()
  const appStatus = ref('')
  const appEndpoint = computed(() => {
    if (ENABLE_HTTPS === 'true') {
      return `https://${applicationSpace.value.endpoint}`
    } else {
      return `http://${applicationSpace.value.endpoint}`
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

  const isBuildLogTab = ref(true)
  const drawerSize = ref('70%')

  const isStatusSSEConnected = ref(false)
  const isLogsSSEConnected = ref(false)

  const toggleActiveTab = (event) => {
    const currentTarget = event.target
    if (currentTarget.dataset.value === 'build') {
      isBuildLogTab.value = true
    } else {
      isBuildLogTab.value = false
    }
  }

  const toggleDrawerSize = () => {
    if (drawerSize.value === '70%') {
      drawerSize.value = '100%'
    } else {
      drawerSize.value = '70%'
    }
  }

  const toggleSpaceLogsDrawer = () => {
    if (spaceLogsDrawer.value) {
      spaceLogsDrawer.value = false
    } else {
      spaceLogsDrawer.value = true
      syncSpaceLogs()
    }
  }


  const fetchRepoDetail = async () => {
    const url = `/${props.repoType}s/${props.namespace}/${props.repoName}`

    try {
      const { data, error } = await useFetchApi(url).json()

      if (!data.value) {
        ElMessage.warning(error.value.msg)
        return
      }

      const repoData = data.value.data

      // applicationSpace.value = repoData
      appStatus.value = repoData.status
      // tags.value = buildTags(repoData.tags)
      // ownerUrl.value = getOwnerUrl(repoData)
      repoDetailStore.initialize(repoData, props.repoType)
    } catch (error) {
      console.log(error)
    }
  }

  const syncSpaceLogs = () => {
    fetchEventSource(
      `${csghubServer}/api/v1/spaces/${props.namespace}/${props.repoName}/logs`,
      {
        openWhenHidden: true,
        headers: {
          Authorization: `Bearer ${cookies.get('user_token')}`
        },
        async onopen(response) {
          if (response.ok) {
            console.log('SSE logs server connected')
            isLogsSSEConnected.value = true
            if (buildLogDiv.value) {
              buildLogDiv.value.innerHTML = ''
              buildLogLineNum.value = 0
            }
            if (containerLogDiv.value) {
              containerLogDiv.value.innerHTML = ''
              containerLogLineNum.value = 0
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
          if (ev.event === 'Build') {
            appendLog(buildLogDiv, ev.data, buildLogLineNum)
            nextTick(() => {
              scrollToBottom()
            })
          } else if (ev.event === 'Container') {
            appendLog(containerLogDiv, ev.data, containerLogLineNum)
            nextTick(() => {
              scrollToBottom()
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

  const scrollToBottom = () => {
    const targetDiv = document.getElementsByClassName('el-drawer__body')[0]
    if (targetDiv) {
      targetDiv.scrollTop = targetDiv.scrollHeight
    }
  }

  const appendLog = (refElem, data, refLineNum) => {
    // Create the div element
    const divNode = document.createElement('div')
    divNode.className = 'flex'

    // Create the first p element
    const pNode1 = document.createElement('p')
    pNode1.className = 'pr-6 pt-2'
    pNode1.innerHTML = `${refLineNum.value}:`

    // Create the second p element
    const pNode2 = document.createElement('p')
    pNode2.className = 'pt-2'
    pNode2.innerHTML = `${data.replace(/\\r/g, '<br>')}`

    // Append the p elements to the div element
    divNode.appendChild(pNode1)
    divNode.appendChild(pNode2)

    // const node = document.createElement("p")
    // node.innerHTML = `${refLineNum.value}: ${data.replace(/\\r/g, "<br>")}`
    if (refElem.value) {
      refElem.value.appendChild(divNode)
      refLineNum.value = refLineNum.value + 1
    }
  }

  const downloadLog = () => {
    const targetDiv = isBuildLogTab.value ? buildLogDiv : containerLogDiv
    if (!targetDiv.value) return

    const logElements = targetDiv.value.querySelectorAll('p')
    let logContent = ''
    logElements.forEach((element) => {
      logContent += element.textContent + '\n'
    })

    const blob = new Blob([logContent], { type: 'text/plain' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = isBuildLogTab.value ? 'build_log.txt' : 'container_log.txt'
    link.click()
    URL.revokeObjectURL(link.href)
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
          if (appStatus.value !== ev.data) {
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
            appStatus.value = ev.data
          }
        },
        onerror(err) {
          console.log('Status Server Error:')
          console.log(err)
        }
      }
    )
  }

  onMounted(() => {
    if (!isSameRepo.value || (isSameRepo.value && !isInitialized.value)) {
      fetchRepoDetail()
    }

    console.log(`Space 初始状态：${appStatus.value}`)
    if (isStatusSSEConnected.value === false) {
      syncSpaceStatus()
    }
  })
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
