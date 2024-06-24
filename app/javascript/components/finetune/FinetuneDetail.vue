<template>
  <div
    class="w-full bg-[#FCFCFD] pt-9 pb-[60px] xl:px-10 md:px-0 md:pb-6 md:h-auto"
  >
    <div class="mx-auto max-w-[1280px]">
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
  <div class="mx-auto max-w-[1280px] mt-[-40px] xl:px-10 md:px-0 relative">
    <el-button
      v-show="activeName == 'page' && finetune.endpoint"
      color="#3250BD"
      style="border-radius: 8px !important"
      class="absolute top-0 right-0 z-10 cursor-pointer text-[#fff]"
      @click="toNotebookPage"
      >{{ $t('finetune.detail.notebook') }}</el-button
    >
    <el-tabs
      v-model="activeName"
      class="demo-tabs"
      @tab-click="handleClick"
    >
      <el-tab-pane
        :label="$t('finetune.detail.tab1')"
        name="page"
      >
        <div class="pt-[24px]">
          <iframe
            v-if="finetune.endpoint"
            :src="`https://${finetune.proxy_endpoint}?jwt=${jwtToken}`"
            width="100%"
            height="700"
            frameborder="0"
            allowfullscreen
          >
          </iframe>
          <div
            v-else
            class="flex items-center justify-start border border-[#D0D5DD] p-[16px] rounded-xl shadow-sm"
          >
            <div class="border border-[#D0D5DD] p-[10px] rounded-lg">
              <SvgIcon
                name="finetune_tip"
                width="20"
                height="20"
              />
            </div>
            <div class="ml-[16px]">
              <p class="text-[#344054] text-sm font-medium mb-[4px]">
                微调实例尚未处于运行状态
              </p>
              <p class="text-[#475467] text-sm font-light">
                请等待部署成功或前往设置页面启用运行状态后，再尝试访问微调界面。
              </p>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane
        :label="$t('finetune.detail.tab2')"
        name="setting"
      >
        <FinetuneSettings
          :finetune="finetune"
          :finetuneId="finetune.deploy_id"
          :finetuneName="finetune.deploy_name"
          :appStatus="finetune.status"
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
  import { ref, inject, computed, onBeforeMount } from 'vue'
  import RepoHeader from '../shared/RepoHeader.vue'
  import { useCookies } from 'vue3-cookies'
  import { fetchEventSource } from '@microsoft/fetch-event-source'
  import refreshJWT from '../../packs/refreshJWT.js'
  import useRepoDetailStore from '../../stores/RepoDetailStore'
  import FinetuneSettings from './FinetuneSettings.vue'
  import jwtFetch from '../../packs/jwtFetch.js'

  const props = defineProps({
    namespace: String,
    name: String,
    userName: String,
    finetuneName: String,
    finetuneId: Number
  })

  const finetune = ref({})

  const activeName = ref('page')
  const startEvent = ref(false)

  const finetuneResources = ref([])
  const finetuneResource = ref('')

  const handleClick = (tab, event) => {
    console.log(tab, event)
  }

  const csghubServer = inject('csghubServer')

  function toNotebookPage() {
    window.open(`https://${finetune.value.endpoint}?jwt=${jwtToken}`)
  }

  async function getDetail() {
    const options = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    }
    try {
      const res = await jwtFetch(
        `${csghubServer}/api/v1/models/${props.namespace}/${props.name}/run/${props.finetuneId}`,
        options
      )
      if (res.ok) {
        res.json().then((body) => {
          if (body.msg == 'OK' && body.data) {
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
        })
      }
    } catch (err) {
      console.log(err)
    }
  }

  const fetchResources = async () => {
    const options = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    }
    const res = await jwtFetch(
      `${csghubServer}/api/v1/space_resources`,
      options
    )
    if (!res.ok) {
      ElMessage({ message: t('all.fetchError'), type: 'warning' })
    } else {
      res.json().then((body) => {
        finetuneResources.value = body.data
        const obj = body.data.find((item) => {
          return item.resources === finetune.value.hardware
        })
        finetuneResource.value = obj?.name
      })
    }
  }

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
  const appfinetune = computed(() => {
    const finetuneUrl = finetune.value.finetune || ''
    if (ENABLE_HTTPS === 'true') {
      return `https://${finetuneUrl}`
    } else {
      return `http://${finetuneUrl}`
    }
  })

  const isStatusSSEConnected = ref(false)

  const replicaList = ref([])

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
          }
          if (eventResponse.details) {
            replicaList.value = eventResponse.details
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
    border-radius: 6px;
    background: #e5e7eb;
    padding: 6px;
  }
</style>
