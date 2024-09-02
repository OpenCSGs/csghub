<template>
  <div class="w-full bg-[#FCFCFD] pt-9 pb-[60px] xl:px-10 md:px-0 md:pb-6 md:h-auto">
    <div class="mx-auto max-w-[1280px]">
      <repo-header
        :private="applicationSpace.private"
        :license="applicationSpace.license"
        :name="applicationSpace.name"
        :nickname="applicationSpace.nickname"
        :path="`${namespace}/${repoName}`"
        :desc="applicationSpace.description"
        :appStatus="appStatus"
        :space-resource="applicationSpace.hardware"
        :avatar="applicationSpace.namespace?.Avatar"
        :tags="tags"
        :owner-url="ownerUrl"
        :canWrite="applicationSpace.can_write"
        repo-type="space"
        :repoId="applicationSpace.repository_id"
        :totalLikes="applicationSpace.like_count"
        :hasLike="applicationSpace.user_likes"
        @toggleSpaceLogsDrawer="toggleSpaceLogsDrawer"
      />
    </div>
  </div>
  <div class="mx-auto max-w-[1280px] mt-[-40px] xl:px-10 md:px-0">
    <repo-tabs
      :local-repo-id="localRepoId"
      :repo-detail="applicationSpace"
      :appStatus="appStatus"
      :sdk="applicationSpace.sdk"
      :appEndpoint="appEndpoint"
      :current-branch="currentBranch"
      :current-path="currentPath"
      :default-tab="defaultTab"
      :actionName="actionName"
      :settingsVisibility="applicationSpace.can_manage"
      :can-write="applicationSpace.can_write"
      repo-type="space"
      :user-name="userName"
      :commitId="commitId"
      @toggleSpaceLogsDrawer="toggleSpaceLogsDrawer"
      :path="`${namespace}/${repoName}`"
    />
  </div>

  <!-- logs drawer -->
  <div v-show="applicationSpace.can_write">
    <el-drawer
      v-model="spaceLogsDrawer"
      direction="btt"
      :size="drawerSize"
      :show-close="false"
    >
      <template #header="{close}">
        <div class="flex gap-[24px] items-center">
          <div class="flex gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M11.6663 9.16699H6.66634M8.33301 12.5003H6.66634M13.333 5.83366H6.66634M16.6663 8.75033V5.66699C16.6663 4.26686 16.6663 3.5668 16.3939 3.03202C16.1542 2.56161 15.7717 2.17916 15.3013 1.93948C14.7665 1.66699 14.0665 1.66699 12.6663 1.66699H7.33301C5.93288 1.66699 5.23281 1.66699 4.69803 1.93948C4.22763 2.17916 3.84517 2.56161 3.60549 3.03202C3.33301 3.5668 3.33301 4.26686 3.33301 5.66699V14.3337C3.33301 15.7338 3.33301 16.4339 3.60549 16.9686C3.84517 17.439 4.22763 17.8215 4.69803 18.0612C5.23281 18.3337 5.93288 18.3337 7.33301 18.3337H9.58301M18.333 18.3337L17.083 17.0837M17.9163 15.0003C17.9163 16.6112 16.6105 17.917 14.9997 17.917C13.3888 17.917 12.083 16.6112 12.083 15.0003C12.083 13.3895 13.3888 12.0837 14.9997 12.0837C16.6105 12.0837 17.9163 13.3895 17.9163 15.0003Z" stroke="#344054" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <p class="font-[600] text-[16px] text-black">{{ $t('application_spaces.errorPage.log') }}</p>
          </div>
          <div class="flex gap-4 items-center">
            <span class="text-[14px] text-[#667085] cursor-pointer"
                  data-value="build"
                  @click="toggleActiveTab"
                  :class="isBuildLogTab ? 'active-tab' : ''"
            >{{ $t('application_spaces.errorPage.build') }}</span>
            <span class="text-[14px] text-[#667085] cursor-pointer"
                  data-value="container"
                  @click="toggleActiveTab"
                  :class="isBuildLogTab ? '' : 'active-tab'"
            >{{ $t('application_spaces.errorPage.container') }}</span>
          </div>
        </div>
        <div class="flex gap-[8px]">
          <el-icon v-if="drawerSize==='70%'"
                   @click="toggleDrawerSize"><ArrowUp /></el-icon>
          <el-icon v-else @click="toggleDrawerSize"><ArrowDown /></el-icon>
          <el-icon @click="close"><CloseBold /></el-icon>
        </div>
      </template>
      <div v-show="isBuildLogTab"
           ref="buildLogDiv"
           class="overflow-scroll"
      >
      </div>
      <div v-show="!isBuildLogTab"
           ref="containerLogDiv"
           class="overflow-scroll"
      >
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
  import { ref, onMounted, inject, computed, nextTick } from 'vue'
  import RepoHeader from '../shared/RepoHeader.vue'
  import RepoTabs from '../shared/RepoTabs.vue'
  import { useCookies } from "vue3-cookies";
  import { fetchEventSource } from '@microsoft/fetch-event-source';
  import { useI18n } from 'vue-i18n'
  import refreshJWT from '../../packs/refreshJWT.js'
  import useRepoDetailStore from '../../stores/RepoDetailStore'
  import useFetchApi from '../../packs/useFetchApi'
  import { buildTags } from '../../packs/buildTags'
  import { ElMessage } from 'element-plus'

  const props = defineProps({
    repoType: String,
    files: Object,
    lastCommit: Object,
    branches: Object,
    localRepoId: String,
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

  const allStatus = ['Building', 'Deploying', 'Startup', 'Running', 'Stopped', 'Sleeping', 'BuildingFailed', 'DeployFailed', 'RuntimeError']

  const applicationSpace = ref({})
  const { t } = useI18n();
  const { cookies } = useCookies();
  const appStatus = ref('')
  const appEndpoint = computed(() => {
    if(ENABLE_HTTPS === 'true') {
      return `https://${applicationSpace.value.endpoint}`
    } else {
      return `http://${applicationSpace.value.endpoint}`
    }
  })

  const tags = ref({
    task_tags: [],
    framework_tags: [],
    language_tags: [],
    license_tags: [],
    industry_tags: [],
    other_tags: []
  })

  const ownerUrl = ref('')

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
      syncSpaceLogs()
    }
  }

  const getOwnerUrl = (repo) => {
    if (repo.user.username === props.namespace) {
      return `/profile/${props.namespace}`
    } else {
      return `/organizations/${props.namespace}`
    }
  }

  const fetchRepoDetail = async () => {
    const url = `/${props.repoType}s/${props.namespace}/${props.repoName}`

    try {
      const { data, error } = await useFetchApi(url).json()

      const json = data.value
      if (json) {
        applicationSpace.value = json.data
        appStatus.value = json.data.status
        tags.value = buildTags(json.data.tags)
        repoDetailStore.initialize(json.data)
        ownerUrl.value = getOwnerUrl(json.data)
      } else {
        ElMessage({ message: error.value.msg, type: 'warning' })
      }
    } catch (error) {
      console.log(error)
    }
  }

  const syncSpaceLogs = () => {
    fetchEventSource(`${csghubServer}/api/v1/spaces/${props.namespace}/${props.repoName}/logs`, {
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
          nextTick(() => {
            scrollToBottom(buildLogDiv);
          });
        } else if (ev.event === 'Container') {
          appendLog(containerLogDiv, ev.data, containerLogLineNum)
          nextTick(() => {
            scrollToBottom(containerLogDiv);
          });
        }
      },
      onerror(err) {
        console.log('Logs Server Error:')
        console.log(err)
      }
    })
  }

  const scrollToBottom = (targetRef) => {
    const targetDiv = targetRef.value;
    if (targetDiv) {
      targetDiv.scrollTop = targetDiv.scrollHeight;
    }
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
    fetchEventSource(`${csghubServer}/api/v1/spaces/${props.namespace}/${props.repoName}/status`, {
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
      },
      onerror(err) {
        console.log('Status Server Error:')
        console.log(err)
      }
    })
  }

  onMounted(() => {
    fetchRepoDetail()

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