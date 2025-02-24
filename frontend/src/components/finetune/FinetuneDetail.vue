<template>
  <div
    class="w-full bg-gray-25 border-b border-gray-100 pt-9 pb-[60px] xl:px-10 md:px-0 md:pb-6 md:h-auto"
  >
    <div class="mx-auto page-responsive-width">
      <repo-header
        :name="finetune.deploy_name"
        :path="`${namespace}/${name}`"
        :appStatus="appStatus"
        :space-resource="finetune.hardware"
        :resource-name="finetuneResource"
        repo-type="finetune"
        :repoId="finetune.repository_id"
      />
    </div>
  </div>
  <div
    class="mx-auto page-responsive-width mt-[-40px] md:px-0 relative"
    v-loading="dataLoading"
  >
    <el-button
      v-show="activeName == 'page' && finetune.endpoint"
      color="#3250BD"
      style="border-radius: var(--border-radius-md) !important"
      class="absolute top-0 right-0 z-10 cursor-pointer text-white"
      @click="toNotebookPage"
      >{{ $t('finetune.detail.notebook') }}</el-button
    >
    <el-tabs
      v-model="activeName"
      class="demo-tabs"
      :beforeLeave="handleTabLeave"
      @tabClick="tabChange"
    >
      <el-tab-pane
        :label="$t('finetune.detail.tab1')"
        name="page"
      >
        <div class="pt-[24px]">
          <iframe
            v-if="finetune.endpoint"
            :src="`${httpProtocal}://${finetune.proxy_endpoint}?jwt=${jwtToken}`"
            width="100%"
            height="700"
            frameborder="0"
            allowfullscreen
          >
          </iframe>
          <div
            class="flex flex-col gap-6"
            v-else
          >
            <div
              class="flex items-center justify-start border border-gray-300 p-[16px] rounded-xl shadow-sm"
            >
              <div class="border border-gray-300 p-[10px] rounded-lg">
                <SvgIcon
                  name="finetune_tip"
                  width="20"
                  height="20"
                />
              </div>
              <div class="ml-[16px]">
                <p class="text-gray-700 text-sm font-medium mb-[4px]">
                  {{ $t('finetune.detail.noDataTip1') }}
                </p>
                <p class="text-gray-600 text-sm font-light">
                  {{ $t('finetune.detail.noDataTip2') }}
                </p>
              </div>
            </div>
            <InstanceInBuilding
              v-if="['Building', 'Deploying', 'Startup'].includes(appStatus)"
              :loadingText="$t('all.deployLoadingText')"
            />
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane
        :label="$t('billing.billing')"
        name="billing"
      >
        <BillingDetail
          type="finetune"
          :instanceName="finetune.svc_name"
        ></BillingDetail>
      </el-tab-pane>
      <el-tab-pane
        :label="$t('finetune.detail.tab2')"
        name="setting"
      >
        <FinetuneSettings
          :finetune="finetune"
          :finetuneId="finetune.deploy_id"
          :finetuneName="finetune.deploy_name"
          :appStatus="appStatus"
          :modelId="finetune.model_id"
          :userName="userName"
          :cloudResource="finetune.hardware"
          :framework="finetune.runtime_framework"
          :clusterId="finetune.cluster_id"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
  import { ref, inject, onBeforeMount } from 'vue'
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

  const props = defineProps({
    namespace: String,
    name: String,
    userName: String,
    finetuneName: String,
    finetuneId: Number,
    path: String
  })

  const finetune = ref({})

  const activeName = ref('page')
  const dataLoading = ref(true)

  const finetuneResources = ref([])
  const finetuneResource = ref('')

  const repoDetailStore = useRepoDetailStore()
  repoDetailStore.initialize(finetune.value)

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
  const appStatus = ref('')

  const isStatusSSEConnected = ref(false)

  const csghubServer = inject('csghubServer')

  const httpProtocal = ENABLE_HTTPS === 'true' ? 'https' : 'http'

  const handleTabLeave = (tab) => {
    tabChange(tab)
    return false
  }

  const tabChange = (tab) => {
    switch (tab.paneName) {
      case 'page':
        location.href = `/finetune/${props.namespace}/${props.name}/${props.finetuneName}/${props.finetuneId}`
        break
      default:
        location.href = `/finetune/${props.namespace}/${props.name}/${props.finetuneName}/${props.finetuneId}/${tab.paneName}`
        break
    }
  }

  const toNotebookPage = () => {
    window.open(`${httpProtocal}://${finetune.value.endpoint}?jwt=${jwtToken}`)
  }

  const getDetail = async (type) => {
    if (type != 'reload') {
      dataLoading.value = true
    }

    try {
      const { data } = await useFetchApi(
        `/models/${props.namespace}/${props.name}/run/${props.finetuneId}`
      ).json()
      if (data.value) {
        const body = data.value
        if (body.data) {
          finetune.value = body.data
          appStatus.value = finetune.value.status
          fetchResources()
          if (
            isStatusSSEConnected.value === false &&
            allStatus.includes(appStatus.value)
          ) {
            syncfinetuneStatus()
          }
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
      `/space_resources?cluster_id=${finetune.value.cluster_id}&deploy_type=2`
    ).json()
    if (error.value) {
      ElMessage({ message: error.value.msg, type: 'warning' })
    } else {
      const body = data.value
      finetuneResources.value = body.data
      const obj = body.data.find((item) => {
        return item.resources === finetune.value.hardware
      })
      finetuneResource.value = obj?.name
    }
  }

  const syncfinetuneStatus = () => {
    fetchEventSource(
      `${csghubServer}/api/v1/models/${finetune.value.model_id}/run/${finetune.value.deploy_id}/status`,
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
          if (appStatus.value !== eventResponse.status) {
            appStatus.value = eventResponse.status
            if (appStatus.value == 'Running') {
              getDetail('reload')
            }
          }
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
    getDetail()
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
    border-radius: var(--border-radius-sm);
    background: #e5e7eb;
    padding: 6px;
  }
</style>
