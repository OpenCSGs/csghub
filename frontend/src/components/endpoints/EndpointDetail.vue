<template>
  <div class="w-full bg-gray-25 border-b border-gray-100 pt-9 pb-[60px] xl:px-10 md:px-0 md:pb-6 md:h-auto">
    <div class="mx-auto page-responsive-width">
      <repo-header
        :name="repoDetailStore.deployName"
        :path="repoDetailStore.modelId"
        :appStatus="repoDetailStore.status"
        :space-resource="repoDetailStore.hardware"
        :avatar="avatar"
        :owner-url="ownerUrl"
        repo-type="endpoint"
        :repoId="repoDetailStore.repositoryId"
        :deployId="repoDetailStore.deployId"
      />
    </div>
  </div>
  <div class="mx-auto page-responsive-width mt-[-40px] md:px-0">
    <repo-tabs
      :repo-detail="repoDetailStore"
      :appStatus="repoDetailStore.status"
      :appEndpoint="appEndpoint"
      :current-path="currentPath"
      :default-tab="defaultTab"
      :actionName="actionName"
      :settingsVisibility="canManage"
      :can-write="canWrite"
      repo-type="endpoint"
      :clusterId="repoDetailStore.clusterId"
      :sku="repoDetailStore.sku"
      :modelId="repoDetailStore.modelId"
      :private="repoDetailStore.privateVisibility"
      :endpointReplica="repoDetailStore.actualReplica"
      :endpointName="repoDetailStore.deployName"
      :endpointId="repoDetailStore.deployId"
      :deployId="repoDetailStore.deployId"
      :userName="namespace"
      :replicaList="replicaList"
      :path="`${namespace}/${modelName}/${endpointId}`"
    />
  </div>
</template>

<script setup>
  import { ref, onMounted, inject, computed, provide } from 'vue'
  import RepoHeader from '../shared/RepoHeader.vue'
  import RepoTabs from '../shared/RepoTabs.vue'
  import { useCookies } from "vue3-cookies";
  import { fetchEventSource } from '@microsoft/fetch-event-source';
  import refreshJWT from '../../packs/refreshJWT.js'
  import useRepoDetailStore from '../../stores/RepoDetailStore'
  import useFetchApi from '../../packs/useFetchApi'
  import useUserStore from '../../stores/UserStore.js'
  import { ElMessage } from 'element-plus'
  import { storeToRefs } from 'pinia';
  import { useRepoTabStore } from '../../stores/RepoTabStore'

  const props = defineProps({
    currentPath: String,
    defaultTab: String,
    actionName: String,
    tags: Object,
    namespace: String,
    modelName: String,
    endpointId: Number
  })

  const repoDetailStore = useRepoDetailStore()
  const userStore = useUserStore()
  const { isInitialized } = storeToRefs(repoDetailStore)
  const { cookies } = useCookies()
  const { setRepoTab } = useRepoTabStore()

  // only owner can view endpoint detail, so just set true
  const canManage = ref(true)

  const canWrite = computed(() => {
    return userStore.username === props.namespace
  })
  const isSameRepo = computed(() => {
    return (
      Number(props.endpointId) === repoDetailStore.deployId &&
      repoDetailStore.repoType === 'endpoint'
    )
  })

  const csghubServer = inject('csghubServer')
  // const endpoint = ref({})
  const modelInfo = ref({})
  // const allStatus = ['Building', 'Deploying', 'Startup', 'Running', 'Stopped', 'Sleeping', 'BuildingFailed', 'DeployFailed', 'RuntimeError']
  const isStatusSSEConnected = ref(false)
  const replicaList = ref([])

  const appEndpoint = computed(() => {
    const endpointUrl = repoDetailStore.endpoint
    if (endpointUrl) {
      if(ENABLE_HTTPS === 'true') {
        return `https://${endpointUrl}`
      } else {
        return `http://${endpointUrl}`
      }
    } else {
      return ''
    }
  })

  const ownerUrl = computed(() => {
    const { namespace } = modelInfo.value
    if (!namespace) return ''
    const baseUrl = namespace.Type === 'user' ? '/profile/' : '/organizations/'
    return baseUrl + namespace.Path
  })

  const avatar = computed(() => modelInfo.value.namespace?.Avatar || '')

  const fetchModelDetail = async () => {
    const url = `/models/${props.namespace}/${props.modelName}`

    try {
      const { data, error } = await useFetchApi(url).json()

      if (data.value) {
        modelInfo.value = data.value.data
      } else {
        ElMessage({ message: error.value.msg, type: 'warning' })
      }
    } catch (error) {
      console.log(error)
    }
  }

  const fetchRepoDetail = async () => {
    const url = `/models/${props.namespace}/${props.modelName}/run/${props.endpointId}`

    try {
      const { data, error } = await useFetchApi(url).json()

      if (data.value) {
        const json = data.value
        repoDetailStore.initialize(json.data, 'endpoint')
      } else {
        ElMessage({ message: error.value.msg, type: 'warning' })
      }
    } catch (error) {
      console.log(error.msg)
    }
  }

  const syncEndpointStatus = () => {
    fetchEventSource(`${csghubServer}/api/v1/models/${props.namespace}/${props.modelName}/run/${props.endpointId}/status`, {
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
        if (repoDetailStore.status !== eventResponse.status) {
          repoDetailStore.status = eventResponse.status
          fetchRepoDetail()
        }

        if (eventResponse.details && eventResponse.details[0].name) {
          repoDetailStore.activeInstance = eventResponse.details[0].name
        }

        if (eventResponse.details) {
          replicaList.value = eventResponse.details
        }
        repoDetailStore.failedReason = eventResponse.reason
      },
      onerror(err) {
        console.log('Status Server Error:')
        console.log(err)
      }
    })
  }

  onMounted(() => {
    if (!isSameRepo.value || (isSameRepo.value && !isInitialized.value)) {
      fetchRepoDetail()
    }
    fetchModelDetail()

    if (isStatusSSEConnected.value === false) {
      syncEndpointStatus()
    }

    setRepoTab({
      repoType: props.repoType,
      namespace: props.namespace,
      repoName: props.modelName,
    })
  })

  provide('fetchRepoDetail', fetchRepoDetail)
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
    border-radius: var(--border-radius-sm);
    background: #E5E7EB;
    padding: 6px;
  }
</style>
