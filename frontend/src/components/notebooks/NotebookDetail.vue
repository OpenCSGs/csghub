<template>
  <div 
    class="w-full bg-gray-25 border-b border-gray-100 pt-9 pb-[60px] xl:px-10 md:px-0 md:pb-6 md:h-auto"
    v-show="isInitialized">
    <div class="mx-auto page-responsive-width">
      <repo-header
        :name="repoDetailStore.deployName"
        :path="repoDetailStore.id"
        :appStatus="repoDetailStore.status"
        :space-resource="repoDetailStore.hardware"
        :resource-name="repoDetailStore.notebookResource"
        :avatar="avatar"
        :owner-url="ownerUrl"
        repo-type="notebook"
        :repoId="repoDetailStore.repositoryId"
        :deployId="repoDetailStore.deployId"
        :nickname="repoDetailStore.nickName || ''"
        :desc="repoDetailStore.description || ''"
      />
    </div>
  </div>
  <div 
    class="mx-auto page-responsive-width mt-[-40px] md:px-0 relative"
    v-show="!isDataLoading && isInitialized">
    <div class="absolute top-0 right-0 pr-4 z-10" v-if="repoDetailStore.endpoint || repoDetailStore.status === 'Deploying'">
      <div
        @click="startNotebook"
        class="btn btn-sm"
        :class="{
          'btn-primary': repoDetailStore.status === 'Running',
          'btn-secondary-gray btn-gray-disabled-notebook': repoDetailStore.status === 'Deploying' || !repoDetailStore.endpoint
        }"
        >
        {{ $t('notebooks.startNotebook') }}
      </div>  
    </div>
    <repo-tabs
      :repo-detail="repoDetailStore"
      :appStatus="repoDetailStore.status"
      :appEndpoint="appEndpoint"
      :current-path="''"
      :default-tab="'logs'"
      :actionName="props.actionName"
      :settingsVisibility="canManage"
      :can-write="canWrite"
      repo-type="notebook"
      :clusterId="repoDetailStore.clusterId"
      :modelId="repoDetailStore.modelId"
      :private="repoDetailStore.privateVisibility"
      :endpointReplica="repoDetailStore.actualReplica"
      :notebookName="repoDetailStore.deployName"
      :notebookId="repoDetailStore.id"
      :endpointId="repoDetailStore.deployId"
      :deployId="repoDetailStore.deployId"
      :userName="namespace"
      :replicaList="replicaList"
      :path="props.notebookName || props.notebookId"
    />
  </div>
  
  <LoadingSpinner 
    :loading="isDataLoading" 
    :text="$t('notebooks.loading')" 
  />
</template>

<script setup>
  import { ref, onMounted, onUnmounted, inject, computed, provide } from 'vue'
  import RepoHeader from '../shared/RepoHeader.vue'
  import RepoTabs from '../shared/RepoTabs.vue'
  import LoadingSpinner from '../shared/LoadingSpinner.vue'
  import { useCookies } from "vue3-cookies";
  import { fetchEventSource } from '@microsoft/fetch-event-source';
  import refreshJWT from '../../packs/refreshJWT.js'
  import useRepoDetailStore from '../../stores/RepoDetailStore'
  import useFetchApi from '../../packs/useFetchApi'
  import useUserStore from '../../stores/UserStore.js'
  import { ElMessage } from 'element-plus'
  import { storeToRefs } from 'pinia';
  import { useRepoTabStore } from '../../stores/RepoTabStore'
  import { ToNotFoundPage } from '../../packs/utils'

  const props = defineProps({
    actionName: String,
    tags: Object,
    notebookId: String,
    notebookName: String
  })

  const repoDetailStore = useRepoDetailStore()
  const userStore = useUserStore()
  const { isInitialized } = storeToRefs(repoDetailStore)
  const { cookies } = useCookies()
  const jwtToken = cookies.get('user_token')
  const httpProtocal = ENABLE_HTTPS === 'true' ? 'https' : 'http'
  const { setRepoTab } = useRepoTabStore()

  const isDataLoading = ref(false)
  const namespace = ref('')
  const notebookResource = ref('')

  // only owner can view notebook detail, so just set true
  const canManage = ref(true)

  const canWrite = computed(() => {
    return true // 笔记本应该总是可写的
  })
  const isSameRepo = computed(() => {
    return repoDetailStore.repoType === 'notebook'
  })

  const csghubServer = inject('csghubServer')
  const modelInfo = ref({})
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

  const fetchNotebookDetail = async (isUpdate = false) => {
    if (isDataLoading.value) {
      return false
    }
    if (!isUpdate) {
      isDataLoading.value = true
    }
    
    const url = `/notebooks/${props.notebookId}`

    try {
      const { response, data, error } = await useFetchApi(url).json()
      
      if (response.value.status === 404) {
        ToNotFoundPage()
        return false
      }
      
      if (data.value) {
        const json = data.value
        modelInfo.value = json.data
        repoDetailStore.initialize({...json.data, sku: json.data.resource_id + '/' + json.data.order_detail_id}, 'notebook')
        notebookResource.value = json.data.resource_name || ''
        
        // 更新 namespace 值
        if (json.data.namespace && json.data.namespace.Path) {
          namespace.value = json.data.namespace.Path
        } else {
          namespace.value = userStore.username || ''
        }
        
        return true
      } else {
        ElMessage({ message: error.value.msg, type: 'warning' })
        return false
      }
    } catch (error) {
      console.log(error.message || error.msg)
      return false
    } finally {
      isDataLoading.value = false
    }
  }

  const startNotebook = () => {
    if (repoDetailStore.status === 'Deploying' || !repoDetailStore.endpoint) {
      return;
    }
    window.open(`${httpProtocal}://${repoDetailStore.endpoint}?jwt=${jwtToken}`)
  }

  const syncEndpointStatus = () => {
    fetchEventSource(`${csghubServer}/api/v1/notebooks/${props.notebookId}/status`, {
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
        if (ev.event === 'Status' || ev.event === 'status') {
          console.log(`SyncStatus: ${ev.data}`)
          
          if (repoDetailStore.status !== ev.data) {
            repoDetailStore.status = ev.data
            fetchNotebookDetail()
          }
        } else if (ev.event === 'Instance' || ev.event === 'instance') {
          repoDetailStore.activeInstance = ev.data
        } else if (ev.event === 'Replica' || ev.event === 'replica') {
          try {
            const replicaData = JSON.parse(ev.data)
            if (Array.isArray(replicaData)) {
              replicaList.value = replicaData
            }
          } catch (error) {
            console.error('Failed to parse replica data:', error)
          }
        } else if (ev.event === 'Reason' || ev.event === 'reason') {
          repoDetailStore.failedReason = ev.data
        }
      },
      onerror(err) {
        console.log('Status Server Error:')
        console.log(err)
      }
    })
  }

  onMounted(async () => {
    repoDetailStore.isInitialized = false
    repoDetailStore.activeInstance = ''
    repoDetailStore.status = ''

    await fetchNotebookDetail()

    if (isStatusSSEConnected.value === false) {
      syncEndpointStatus()
    }

    setRepoTab({
      repoType: 'notebook',
      namespace: '',
      repoName: props.notebookName || props.notebookId,
      tab: 'logs'
    })
  })

  onUnmounted(() => {
    repoDetailStore.isInitialized = false
    repoDetailStore.activeInstance = ''
    repoDetailStore.status = ''
  })

  provide('fetchRepoDetail', fetchNotebookDetail)
</script>

<style scoped>
  .btn-secondary-gray.btn-gray-disabled-notebook {
    cursor: not-allowed;
    pointer-events: none;
    background-color: var(--Gray-100);
    color: var(--Gray-400);
    border: 1px solid var(--Gray-200);
    box-shadow: var(--shadow-xs);
    &:hover {
      cursor: not-allowed;
      pointer-events: none;
    }
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
