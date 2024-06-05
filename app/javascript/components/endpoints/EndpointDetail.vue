<template>
  <div class="w-full bg-[#FCFCFD] pt-9 pb-[60px] xl:px-10 md:px-0 md:pb-6 md:h-auto">
    <div class="mx-auto max-w-[1280px]">
      <repo-header
        :private="endpoint.data.private"
        :name="endpoint.data.deploy_name"
        :path="endpoint.data.model_id"
        :appStatus="appStatus"
        :space-resource="endpoint.data.hardware"
        :avatar="avatar"
        :owner-url="ownerUrl"
        repo-type="endpoint"
        :repoId="endpoint.data.repository_id"
      />
    </div>
  </div>
  <div class="mx-auto max-w-[1280px] mt-[-40px] xl:px-10 md:px-0">
    <repo-tabs
      :repo-detail="endpoint.data"
      :appStatus="appStatus"
      :appEndpoint="appEndpoint"
      :current-path="currentPath"
      :default-tab="defaultTab"
      :actionName="actionName"
      :settingsVisibility="settingsVisibility"
      :can-write="canWrite"
      repo-type="endpoint"
      :hardware="endpoint.data.hardware"
      :modelId="endpoint.data.model_id"
      :private="endpoint.data.private"
      :endpointReplica="endpoint.data.actual_replica"
      :endpointName="endpoint.data.deploy_name"
      :endpointId="endpoint.data.deploy_id"
      :userName="userName"
      :replicaList="replicaList"
    />
  </div>
</template>

<script setup>
  import { ref, onMounted, inject, computed } from 'vue'
  import RepoHeader from '../shared/RepoHeader.vue'
  import RepoTabs from '../shared/RepoTabs.vue'
  import { useCookies } from "vue3-cookies";
  import { fetchEventSource } from '@microsoft/fetch-event-source';
  import refreshJWT from '../../packs/refreshJWT.js'
  import useRepoDetailStore from '../../stores/RepoDetailStore'

  const props = defineProps({
    endpoint: Object,
    currentPath: String,
    defaultTab: String,
    actionName: String,
    avatar: String,
    settingsVisibility: Boolean,
    tags: Object,
    ownerUrl: String,
    canWrite: Boolean,
    userName: String
  })

  const csghubServer = inject('csghubServer')

  const repoDetailStore = useRepoDetailStore()
  repoDetailStore.initialize(props.endpoint.data)

  const allStatus = ['Building', 'Deploying', 'Startup', 'Running', 'Stopped', 'Sleeping', 'BuildingFailed', 'DeployFailed', 'RuntimeError']

  const { cookies } = useCookies()
  const appStatus = ref(props.endpoint.data.status)
  const appEndpoint = computed(() => {
    const endpointUrl = props.endpoint.data.endpoint || ''
    if(ENABLE_HTTPS === 'true') {
      return `https://${endpointUrl}`
    } else {
      return `http://${endpointUrl}`
    }
  })

  const isStatusSSEConnected = ref(false)

  const replicaList = ref([])

  const syncEndpointStatus = () => {
    fetchEventSource(`${csghubServer}/api/v1/models/${props.endpoint.data.model_id}/run/${props.endpoint.data.deploy_id}/status`, {
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
        console.log(ev)
        const eventResponse = JSON.parse(ev.data)
        console.log(`SyncStatus: ${eventResponse.status}`)
        console.log(`SyncStatus: ${eventResponse.details && eventResponse.details[0].name}`)
        if (appStatus.value !== eventResponse.status) {
          appStatus.value = eventResponse.status
        }
        if (eventResponse.details) {
          replicaList.value = eventResponse.details
        }
      },
      onerror(err) {
        console.log('Status Server Error:')
        console.log(err)
      }
    })
  }

  onMounted(() => {
    console.log(`Endpoint 初始状态：${appStatus.value}`)
    if (isStatusSSEConnected.value === false && allStatus.includes(appStatus.value)) {
      syncEndpointStatus()
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
