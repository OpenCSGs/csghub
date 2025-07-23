<template>
  <div
    class="w-full bg-gray-25 border-b border-gray-100 pt-9 pb-[60px] xl:px-10 md:px-0 md:pb-6 md:h-auto"
  >
    <div class="mx-auto page-responsive-width">
      <RepoHeader
        :name="repoDetailStore.deployName"
        :path="`${namespace}/${modelName}`"
        :appStatus="repoDetailStore.status"
        :space-resource="repoDetailStore.hardware"
        :resource-name="finetuneResource"
        repo-type="finetune"
        :repoId="repoDetailStore.repositoryId"
        :deployId="repoDetailStore.deployId"
      />
    </div>
  </div>
  <div
    class="mx-auto page-responsive-width mt-[-40px] md:px-0 relative"
    v-loading="dataLoading"
  >
    <CsgButton
      v-show="activeName == 'page' && repoDetailStore.endpoint"
      class="btn btn-primary btn-sm absolute top-0 right-0 z-10"
      :name="$t('finetune.detail.notebook')"
      @click="toNotebookPage"
    />
    <el-tabs
      v-model="activeName"
      class="demo-tabs finetune-repo-tabs"
      :key="activeName"
      @tabClick="tabChange"
    >
      <el-tab-pane
        :label="$t('finetune.detail.tab1')"
        name="page"
      >
        <div  v-if="activeName === 'page'" class="pt-6 -mx-4">
          <iframe
            v-if="repoDetailStore.endpoint"
            :src="`${httpProtocal}://${repoDetailStore.proxyEndpoint}?jwt=${jwtToken}`"
            width="100%"
            :height="iframeHeight"
            frameborder="0"
            allowfullscreen
            class="block w-full"
          >
          </iframe>
          <div
            class="flex flex-col gap-6"
            v-else
          >
            <div
              class="flex items-center justify-start border border-gray-300 p-4 rounded-xl shadow-sm"
            >
              <div class="border border-gray-300 p-2 rounded-lg">
                <SvgIcon
                  name="finetune_tip"
                  width="20"
                  height="20"
                />
              </div>
              <div class="ml-4">
                <p class="text-gray-700 text-sm font-medium mb-1">
                  {{ $t('finetune.detail.noDataTip1') }}
                </p>
                <p class="text-gray-600 text-sm font-light">
                  {{ $t('finetune.detail.noDataTip2') }}
                </p>
              </div>
            </div>
            <InstanceInBuilding
              v-if="['Building', 'Deploying', 'Startup'].includes(repoDetailStore.status)"
              :loadingText="$t('all.deployLoadingText')"
            />
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane
        :label="$t('finetune.detail.tab3')"
        name="analysis"
      >
        <InstanceAnalysis
          v-if="activeName === 'analysis'"
          :repoType="repoDetailStore.repoType"
          :instances="repoDetailStore.instances"
          :modelId="repoDetailStore.modelId"
          :deployId="repoDetailStore.deployId"
          :maxReplica="repoDetailStore.maxReplica"
        />
      </el-tab-pane>
      <el-tab-pane
        :label="$t('billing.billing')"
        name="billing"
      >
        <BillingDetail
          v-if="activeName === 'billing'"
          type="finetune"
          :instanceName="repoDetailStore.svcName"
        ></BillingDetail>
      </el-tab-pane>
      <el-tab-pane
        :label="$t('finetune.detail.tab2')"
        name="settings"
      >
        <FinetuneSettings
          v-if="activeName === 'settings'"
          :finetune="repoDetailStore"
          :finetuneId="repoDetailStore.deployId"
          :finetuneName="repoDetailStore.deployName"
          :appStatus="repoDetailStore.status"
          :modelId="repoDetailStore.modelId"
          :framework="repoDetailStore.runtimeFramework"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
  import { ref, inject, onBeforeMount, computed, provide, watch, onMounted, onUnmounted } from 'vue'
  import RepoHeader from '../shared/RepoHeader.vue'
  import { useCookies } from 'vue3-cookies'
  import { fetchEventSource } from '@microsoft/fetch-event-source'
  import refreshJWT from '../../packs/refreshJWT.js'
  import useRepoDetailStore from '../../stores/RepoDetailStore'
  import FinetuneSettings from './FinetuneSettings.vue'
  import useFetchApi from '@/packs/useFetchApi'
  import BillingDetail from '../shared/BillingDetail.vue'
  import { ElMessage } from 'element-plus'
  import InstanceInBuilding from '../shared/InstanceInBuilding.vue'
  import InstanceAnalysis from '../shared/InstanceAnalysis.vue'
  import { storeToRefs } from 'pinia'
  import { useRepoTabStore } from '@/stores/RepoTabStore'
  import { useRoute, useRouter } from 'vue-router'
  import { validateTab } from '@/packs/utils'
  import CsgButton from '../shared/CsgButton.vue'

  const props = defineProps({
    namespace: String,
    modelName: String,
    userName: String,
    finetuneName: String,
    finetuneId: Number,
    path: String
  })

  const repoDetailStore = useRepoDetailStore()
  const { isInitialized } = storeToRefs(repoDetailStore)
  const { repoTab, setRepoTab } = useRepoTabStore()
  const router = useRouter()
  const route = useRoute()
  
  const activeName = ref('page')
  const dataLoading = ref(false)
  const finetuneResources = ref([])
  const finetuneResource = ref('')
  const iframeHeight = ref(700) // Default height
  const allStatus = [
    'Building',
    'Deploying',
    'Startup',
    'Running',
    'Stopped',
    'Sleeping',
    'BuildingFailed',
    'DeployFailed',
    'RuntimeError'
  ]
  const { cookies } = useCookies()
  const jwtToken = cookies.get('user_token')
  // const appStatus = ref('')
  const isStatusSSEConnected = ref(false)
  const csghubServer = inject('csghubServer')
  const httpProtocal = ENABLE_HTTPS === 'true' ? 'https' : 'http'

  // Function to calculate iframe height
  const calculateIframeHeight = () => {
    // Get viewport height
    const viewportHeight = window.innerHeight
    
    // Estimate fixed height parts to subtract
    // These values need to be adjusted based on actual page layout
    const headerHeight = 200 // RepoHeader approximate height
    const tabsHeight = 60 // Tabs navigation height
    const paddingAndMargin = 50 // Various padding and margin (reduced since iframe now fills container)
    
    // Calculate the height iframe should have
    const calculatedHeight = viewportHeight - headerHeight - tabsHeight - paddingAndMargin
    
    // Set minimum height to prevent being too small
    iframeHeight.value = Math.max(calculatedHeight, 700)
  }

  // Recalculate height when window size changes
  const handleResize = () => {
    calculateIframeHeight()
  }

  const isSameRepo = computed(() => {
    return (
    Number(props.finetuneId) === repoDetailStore.deployId &&
      repoDetailStore.repoType === 'finetune'
    )
  })

  watch(() => repoDetailStore.clusterId, (newVal) => {
    if (newVal) {
      fetchResources()
    }
  })

  watch(() => [repoDetailStore.deployId, repoDetailStore.modelId], (newVal1, newVal2) => {
    if (newVal1 && newVal2) {
      syncfinetuneStatus()
    }
  })

  const validTabs = computed(() => {
    return ['page', 'analysis', 'billing', 'settings']
  })

  const getDefaultTab = () => {
    return 'page'
  }

  const isValidTab = (tab) => {
    return validTabs.value.includes(tab)
  }

  // Listen for route changes, update tab when user uses browser forward/back buttons
  watch(() => route.query.tab, (newTab) => {
    const validatedTab = validateTab(newTab)
    if (validatedTab && isValidTab(validatedTab) && validatedTab !== activeName.value) {
      activeName.value = validatedTab
      setRepoTab({
        tab: validatedTab,
        actionName: 'files',
        lastPath: ''
      })
      tabChange({ paneName: validatedTab })
    }
  })

  const tabChange = (tab) => {
    let tabName = validateTab(tab.paneName)
    
    if (!isValidTab(tabName)) {
      tabName = getDefaultTab()
      router.push({
        path: `/finetune/${props.namespace}/${props.modelName}/${props.finetuneName}/${props.finetuneId}`,
        query: { tab: tabName }
      })
    }

    if (tabName === repoTab.tab) return

    activeName.value = tabName

    setRepoTab({
      tab: tabName,
      repoType: 'finetune',
      namespace: props.namespace,
      repoName: props.modelName
    })

    router.push({
      path: `/finetune/${props.namespace}/${props.modelName}/${props.finetuneName}/${props.finetuneId}`,
      query: {
        tab: tabName
      }
    })

    fetchRepoDetail()
  }

  const toNotebookPage = () => {
    window.open(`${httpProtocal}://${repoDetailStore.endpoint}?jwt=${jwtToken}`)
  }

  const fetchRepoDetail = async () => {
    dataLoading.value = true

    try {
      const { data } = await useFetchApi(
        `/models/${props.namespace}/${props.modelName}/run/${props.finetuneId}`
      ).json()
      if (data.value) {
        const body = data.value
        if (body.data) {
          repoDetailStore.initialize(body.data, 'finetune')
        }
      }
    } catch (err) {
      console.log(err)
    } finally {
      dataLoading.value = false
    }
  }

  const fetchResources = async () => {
    const { data, error } = await useFetchApi(
      `/space_resources?cluster_id=${repoDetailStore.clusterId}&deploy_type=2`
    ).json()
    if (error.value) {
      ElMessage({ message: error.value.msg, type: 'warning' })
    } else {
      const body = data.value
      finetuneResources.value = body.data
      const obj = body.data.find((item) => {
        return item.id === Number(repoDetailStore.sku)
      })
      finetuneResource.value = obj?.name
    }
  }

  const syncfinetuneStatus = () => {
    fetchEventSource(
      `${csghubServer}/api/v1/models/${repoDetailStore.modelId}/run/${repoDetailStore.deployId}/status`,
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
          console.log(ev)
          const eventResponse = JSON.parse(ev.data)
          console.log(`SyncStatus: ${eventResponse.status}`)
          console.log(
            `SyncStatus: ${
              eventResponse.details && eventResponse.details[0].name
            }`
          )
          if (repoDetailStore.status !== eventResponse.status) {
            repoDetailStore.status = eventResponse.status
            if (repoDetailStore.status == 'Running') {
              fetchRepoDetail()
            }
          }
          repoDetailStore.failedReason = eventResponse.reason
        },
        onerror(err) {
          console.log('Status Server Error:')
          console.log(err)
        }
      }
    )
  }

  onBeforeMount(() => {
    if (props.path) {
      activeName.value = props.path
    }

    // const urlTab = route?.query?.tab
    const params = new URLSearchParams(window.location.search)
    const urlTab = validateTab(params.get('tab'))
    if (urlTab && isValidTab(urlTab)) {
      tabChange({ paneName: urlTab })
    } else {
      tabChange({ paneName: getDefaultTab() })
    }

    fetchRepoDetail()

    if (repoDetailStore.clusterId) {
      fetchResources()
    }

    if (
      isStatusSSEConnected.value === false &&
      allStatus.includes(repoDetailStore.status) &&
      repoDetailStore.modelId &&
      repoDetailStore.deployId
    ) {
      syncfinetuneStatus()
    }

    setRepoTab({
      repoType: 'finetune',
      namespace: props.namespace,
      repoName: props.modelName,
    })
  })

  onMounted(() => {
    calculateIframeHeight()
    window.addEventListener('resize', handleResize)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
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
    background: #e5e7eb;
    padding: 6px;
  }

  :deep(.finetune-repo-tabs .el-tabs__content) {
    min-height: 600px;
  }
</style>
