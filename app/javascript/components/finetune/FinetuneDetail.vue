<template>
  <div class="w-full bg-[#FCFCFD] pt-9 pb-[60px] xl:px-10 md:px-0 md:pb-6 md:h-auto">
    <div class="mx-auto max-w-[1280px]">
      <repo-header
        :private="finetune.data.private"
        :name="finetune.data.deploy_name"
        :path="finetune.data.model_id"
        :appStatus="appStatus"
        :space-resource="finetune.data.hardware"
        :owner-url="ownerUrl"
        repo-type="finetune"
        :repoId="finetune.data.repository_id"
      />
    </div>
  </div>
  <div class="mx-auto max-w-[1280px] mt-[-40px] xl:px-10 md:px-0">
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
    <el-tab-pane label="概览" name="page">
      <div class="w-full">
    <iframe
      :src="factoryUrl"
      width="100%"
      height="700"
      frameborder="0"
      allowfullscreen>
    </iframe>
  </div>
    </el-tab-pane>
    <el-tab-pane label="日志" name="log">
      <FinetuneItem/>
    </el-tab-pane>
    <el-tab-pane label="设置" name="setting">
      <FinetuneSettings/>
    </el-tab-pane>
  </el-tabs>
  </div>
</template>

<script setup>
  import { ref, onMounted, inject, computed } from 'vue'
  import RepoHeader from '../shared/RepoHeader.vue'
  import { useCookies } from "vue3-cookies";
  import { fetchEventSource } from '@microsoft/fetch-event-source';
  import refreshJWT from '../../packs/refreshJWT.js'
  import useRepoDetailStore from '../../stores/RepoDetailStore'
  import FinetuneItem from './FinetuneItem.vue';
  import FinetuneSettings from './FinetuneSettings.vue';

  const props = defineProps({
    finetune: Object,
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

  const activeName = ref('page')
  const factoryUrl = ref('')

  const handleClick = (tab, event) => {
  console.log(tab, event)
}

  const csghubServer = inject('csghubServer')

  const repoDetailStore = useRepoDetailStore()
  repoDetailStore.initialize(props.finetune.data)

  const allStatus = ['Building', 'Deploying', 'Startup', 'Running', 'Stopped', 'Sleeping', 'BuildingFailed', 'DeployFailed', 'RuntimeError']

  const { cookies } = useCookies()
  const appStatus = ref(props.finetune.data.status)
  const appfinetune = computed(() => {
    const finetuneUrl = props.finetune.data.finetune || ''
    if(ENABLE_HTTPS === 'true') {
      return `https://${finetuneUrl}`
    } else {
      return `http://${finetuneUrl}`
    }
  })

  const isStatusSSEConnected = ref(false)

  const replicaList = ref([])

  const syncfinetuneStatus = () => {
    fetchEventSource(`${csghubServer}/api/v1/models/${props.finetune.data.model_id}/run/${props.finetune.data.deploy_id}/status`, {
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
    console.log(`finetune 初始状态：${appStatus.value}`)
    if (isStatusSSEConnected.value === false && allStatus.includes(appStatus.value)) {
      syncfinetuneStatus()
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
