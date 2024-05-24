<template>
  <div class="w-full bg-[#FCFCFD] pt-9 pb-[60px] xl:px-10 md:px-0 md:pb-6 md:h-auto">
    <div class="mx-auto max-w-[1280px]">
      <repo-header
        :private="applicationSpace.data.private"
        :name="applicationSpace.data.name"
        :path="applicationSpace.data.path"
        :appStatus="appStatus"
        :space-resource="applicationSpace.data.hardware"
        :avatar="avatar"
        :owner-url="ownerUrl"
        repo-type="endpoint"
        :repoId="applicationSpace.data.repository_id"
        :totalLikes="applicationSpace.data.like_count"
        :hasLike="applicationSpace.data.user_likes"
      />
    </div>
  </div>
  <div class="mx-auto max-w-[1280px] mt-[-40px] xl:px-10 md:px-0">
    <repo-tabs
      :blob="blob.data"
      :local-repo-id="localRepoId"
      :repo-detail="applicationSpace.data"
      :last-commit="lastCommit.data"
      :branches="branches.data"
      :appStatus="appStatus"
      :sdk="applicationSpace.data.sdk"
      :appEndpoint="appEndpoint"
      :current-branch="currentBranch"
      :current-path="currentPath"
      :default-tab="defaultTab"
      :actionName="actionName"
      :settingsVisibility="settingsVisibility"
      :can-write="canWrite"
      repo-type="space"
      :user-name="userName"
      :user-token="userToken"
      @toggleSpaceLogsDrawer="toggleSpaceLogsDrawer"
      :isAdmin="isAdmin"
      :hardware="applicationSpace.data.hardware"
      :modelId="applicationSpace.data.model_id"
      :private="applicationSpace.data.private"
      :appInstanceNumber="applicationSpace.data.private"
    />
  </div>
</template>

<script setup>
  import { ref, onMounted, inject, computed } from 'vue'
  import RepoHeader from '../shared/RepoHeader.vue'
  import RepoTabs from '../shared/RepoTabs.vue'
  import { useCookies } from "vue3-cookies";
  import { fetchEventSource } from '@microsoft/fetch-event-source';
  import { useI18n } from 'vue-i18n'
  import refreshJWT from '../../packs/refreshJWT.js'
  import useRepoDetailStore from '../../stores/RepoDetailStore'

  const props = defineProps({
    applicationSpace: Object,
    files: Object,
    lastCommit: Object,
    branches: Object,
    localRepoId: String,
    currentBranch: String,
    currentPath: String,
    defaultTab: String,
    blob: Object,
    actionName: String,
    avatar: String,
    settingsVisibility: Boolean,
    tags: Object,
    ownerUrl: String,
    canWrite: Boolean,
    userName: String,
    userToken: String,
    isAdmin: Boolean
  })

  const csghubServer = inject('csghubServer')
  const enableHttps = inject('enableHttps')

  const repoDetailStore = useRepoDetailStore()
  repoDetailStore.initialize(props.applicationSpace.data)

  const allStatus = ['Building', 'Deploying', 'Startup', 'Running', 'Stopped', 'Sleeping', 'BuildingFailed', 'DeployFailed', 'RuntimeError']

  const { t } = useI18n();
  const { cookies } = useCookies();
  const appStatus = ref(props.applicationSpace.data.status)
  const appEndpoint = computed(() => {
    if(enableHttps === 'true') {
      return `https://${props.applicationSpace.data.endpoint}`
    } else {
      return `http://${props.applicationSpace.data.endpoint}`
    }
  })

  const spaceLogsDrawer = ref(false)
  const buildLogDiv = ref(null)
  const containerLogDiv = ref(null)
  const buildLogLineNum = ref(0)
  const containerLogLineNum = ref(0)

  const isBuildLogTab = ref(true)
  const drawerSize = ref("70%")

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
    }
  }

  const syncSpaceLogs = () => {
    fetchEventSource(`${csghubServer}/api/v1/spaces/${props.applicationSpace.data.path}/logs`, {
      openWhenHidden: true,
      headers: {
        Authorization: `Bearer ${cookies.get('user_token')}`,
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
        if (ev.event === 'Build') {
          appendLog(buildLogDiv, ev.data, buildLogLineNum)
        } else if (ev.event === 'Container') {
          appendLog(containerLogDiv, ev.data, containerLogLineNum)
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

  const syncSpaceStatus = () => {
    fetchEventSource(`${csghubServer}/api/v1/spaces/${props.applicationSpace.data.path}/status`, {
      openWhenHidden: true,
      headers: {
        Authorization: `Bearer ${cookies.get('user_token')}`,
      },
      async onopen(response) {
        if (response.ok) {
          console.log('SSE status server connected')
          isStatusSSEConnected.value = true
        }
        else if (response.status === 401) {
          refreshJWT()
        } else if (response.status >= 400 && response.status < 500 && response.status !== 429) {
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

        // 启动日志
        if (isLogsSSEConnected.value === false) {
          syncSpaceLogs()
        }
      },
      onerror(err) {
        console.log('Status Server Error:')
        console.log(err)
      }
    })
  }

  onMounted(() => {
    console.log(`Space 初始状态：${appStatus.value}`)
    if (isStatusSSEConnected.value === false && allStatus.includes(appStatus.value)) {
      syncSpaceStatus()
    }
  })
</script>

<style scoped>
  body {
    background: #fff !important;
  }

  :deep(.el-drawer__header) {
    border-bottom: solid 1px lightgray;
    padding: 10px;
    margin-bottom: 0;
  }

  .active-tab {
    border-radius: 6px;
    background: #E5E7EB;
    padding: 6px;
  }
</style>