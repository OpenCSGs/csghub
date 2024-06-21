<template>
  <div
    class="border border-[#DCDFE6] rounded-[8px] my-[32px] md:my-0 md:border-none px-[24px] py-[24px]"
  >
    <div class="flex xl:flex-col gap-[32px]">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-[14px] text-[#344054] leading-[20px] font-medium">
          {{ $t('finetune.detail.settings.region') }}
        </div>
        <div class="text-[14px] text-[#475467] font-light leading-[20px]">
          {{ $t('finetune.detail.settings.regionTip1') }}
        </div>
        <div class="text-[14px] text-[#475467] font-light leading-[20px]">
          {{ $t('finetune.detail.settings.regionTip2') }}
        </div>
      </div>
      <div class="flex flex-col gap-[6px]">
        <p class="text-[#344054] text-[14px]">
          {{ $t('finetune.detail.settings.regionTip3') }}
        </p>
        <el-select
          v-model="currentCid"
          :placeholder="$t('all.select')"
          size="large"
          class="!w-[512px] sm:!w-full"
          disabled
        >
          <el-option
            v-for="item in finetuneClusters"
            :key="item.cluster_id"
            :label="item.region"
            :value="item.cluster_id"
          />
        </el-select>
      </div>
    </div>
    <el-divider />
    <div class="flex xl:flex-col gap-[32px]">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-[14px] text-[#344054] leading-[20px] font-medium">
          {{ $t('finetune.detail.settings.resources') }}
        </div>
        <div class="text-[14px] text-[#475467] font-light leading-[20px]">
          {{ $t('finetune.detail.settings.resourcesTip1') }}
        </div>
        <div class="text-[14px] text-[#475467] font-light leading-[20px]">
          {{ $t('finetune.detail.settings.resourcesTip2') }}
        </div>
      </div>
      <div class="flex flex-col gap-[6px]">
        <p class="text-[#344054] text-[14px]">
          {{ $t('finetune.detail.settings.resourcesTip3') }}
        </p>
        <el-select
          v-model="currentResource"
          :placeholder="$t('all.select')"
          size="large"
          class="!w-[512px] sm:!w-full"
          disabled
        >
          <el-option
            v-for="item in cloudResources"
            :key="item.name"
            :label="item.name"
            :value="item.resources"
          />
        </el-select>
      </div>
    </div>
    <el-divider />
    <div class="flex xl:flex-col gap-[32px]">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-[14px] text-[#344054] leading-[20px] font-medium">
          {{ $t('finetune.detail.settings.status') }}
        </div>
        <div class="text-[14px] text-[#475467] font-light leading-[20px]">
          {{ $t('finetune.detail.settings.statusTip1') }}
        </div>
      </div>
      <div class="flex flex-col gap-[6px]">
        <div>
          <el-switch
            v-model="statusVal"
            class="mr-2"
            style="
              --el-switch-on-color: #3250bd;
              --el-switch-off-color: #f2f4f7;
            "
            @change="changeStatus"
          />
          <span>{{
            statusVal
              ? $t('finetune.detail.settings.statusVal1')
              : $t('finetune.detail.settings.statusVal2')
          }}</span>
        </div>
      </div>
    </div>
    <el-divider />
    <div class="flex xl:flex-col gap-[32px]">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-[14px] text-[#344054] leading-[20px] font-medium">
          {{ $t('finetune.detail.settings.enName') }}
        </div>
        <div class="text-[14px] text-[#475467] font-light leading-[20px]">
          {{ $t('finetune.detail.settings.enNameTip1') }}
        </div>
      </div>
      <div class="flex flex-col gap-[6px]">
        <el-input
          :value="props.finetuneName"
          disabled
          size="large"
          class="!w-[512px] sm:!w-full"
        />
        <div class="flex items-center">
          <el-input
            :value="`portal.opencsg.com/${props.modelId}`"
            disabled
            size="large"
            class="!w-[50%] sm:!w-full"
          />
          <el-input
            :value="props.finetuneName"
            disabled
            size="large"
            class="!w-[50%] sm:!w-full"
          />
        </div>
      </div>
    </div>
    <br />
    <div class="flex xl:flex-col gap-[32px]">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-[14px] text-[#344054] leading-[20px] font-medium">
          {{ $t('finetune.detail.settings.cnName') }}
        </div>
        <div class="text-[14px] text-[#475467] font-light leading-[20px]">
          {{ $t('finetune.detail.settings.cnNameTip1') }}
        </div>
      </div>
      <div class="flex flex-col gap-[6px]">
        <el-input
          v-model="cnName"
          clearable
          size="large"
          class="!w-[512px] sm:!w-full"
        />
      </div>
    </div>
    <el-divider />

    <!-- 删除 -->
    <div class="flex xl:flex-col gap-[32px]">
      <div class="w-[380px] sm:w-full flex flex-col gap-[6px]">
        <div class="text-[14px] text-[#344054] leading-[20px] font-medium">
          {{ $t('finetune.detail.settings.delete') }}
        </div>
        <div class="text-[14px] text-[#475467] font-light leading-[20px]">
          {{ $t('finetune.detail.settings.deleteTip1') }}
          <span class="text-black font-medium break-words">{{
            props.modelId
          }}</span>
          {{ $t('finetune.detail.settings.deleteTip2') }}
        </div>
        <div class="text-[14px] text-[#475467] leading-[20px]">
          {{ $t('all.enterPls') }}
          <span class="text-black font-medium break-words">
            {{ `${finetuneName}/${finetuneId}` }}
          </span>
          {{ $t('all.sureDel') }}
        </div>
      </div>
      <div class="flex flex-col gap-[8px]">
        <p class="text-[#344054] text-[14px]">
          {{ $t('finetune.detail.settings.finetuneName') }}
        </p>
        <el-input
          v-model="delDesc"
          clearable
          size="large"
          class="!w-[512px] sm:!w-full"
        />
        <div class="flex">
          <div
            id="confirmDelete"
            @click="clickDelete"
            class="text-[#98A2B3] py-[8px] px-[12px] text-[14px] leading-[20px] rounded-[8px]"
            :class="
              delDesc === `${finetuneName}/${finetuneId}`
                ? 'bg-[#D92D20] text-[#FFFFFF] cursor-pointer active:shadow-box active:space-y-0 active:space-x-0 active:ring-4 active:ring-red-400 active:ring-opacity-25 active:bg-[#D92D20] hover:text-white'
                : 'bg-[#F2F4F7]'
            "
            @mouseover="handleMouseOver"
            @mouseleave="handleMouseLeave"
          >
            {{ $t('endpoints.settings.confirmDel') }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed, inject, onMounted, watch } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import refreshJWT from '../../packs/refreshJWT.js'
  import jwtFetch from '../../packs/jwtFetch'
  import csrfFetch from '../../packs/csrfFetch'
  import { useI18n } from 'vue-i18n'
  import useRepoDetailStore from '../../stores/RepoDetailStore'

  const props = defineProps({
    finetune: Object,
    finetuneId: Number,
    finetuneName: String,
    appStatus: String,
    modelId: String,
    userName: String,
    cloudResource: String,
    framework: String,
    clusterId: String
  })

  const statusVal = ref(props.appStatus == 'Running')
  const { t } = useI18n()
  const csghubServer = inject('csghubServer')
  const delDesc = ref('')
  const currentResource = ref(props.cloudResource)
  const cloudResources = ref([])
  const currentFrameworkId = ref('')
  const cnName = ref('')
  const currentCid = ref(props.finetune.cluster_id)

  const finetuneClusters = ref([])

  const frameworks = ref([])
  const repoDetailStore = useRepoDetailStore()

  watch(
    () => props.appStatus,
    (newVal, oldVal) => {
      statusVal.value = newVal == 'Running'
    }
  )
  watch(
    () => props.cloudResource,
    (newVal, oldVal) => {
      currentResource.value = newVal
    }
  )
  watch(
    () => props.clusterId,
    (newVal, oldVal) => {
      currentCid.value = newVal
    }
  )
  const initialized = computed(() => {
    return [
      'Building',
      'Deploying',
      'Startup',
      'Running',
      'Stopped',
      'Sleeping',
      'BuildingFailed',
      'DeployFailed',
      'RuntimeError'
    ].includes(props.appStatus)
  })

  const notInitialized = computed(() => {
    return ['NoAppFile'].includes(props.appStatus)
  })

  const isStopped = computed(() => {
    return ['Stopped'].includes(props.appStatus)
  })

  async function changeStatus() {
    const options = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' }
    }
    const res = await jwtFetch(
      `${csghubServer}/api/v1/models/${props.modelId}/finetune/${
        props.finetuneId
      }/${statusVal.value ? 'start' : 'stop'}`,
      options
    )
    if (!res.ok) {
      ElMessage({
        message: t('all.fetchError'),
        type: 'warning'
      })
      statusVal.value = !statusVal.value
    } else {
      res.json().then((body) => {
        console.log('testApi suc===', body)
      })
    }
  }

  const stopFinetune = async () => {
    stopUrl = `${csghubServer}/api/v1/models/${props.modelId}/run/${props.finetuneId}/stop`
    const response = await jwtFetch(stopUrl, { method: 'PUT' })

    if (response.ok) {
      ElMessage({
        message: t('finetunes.settings.toggleStatusSuccess'),
        type: 'success'
      })
    } else {
      if (response.status === 401) {
        refreshJWT()
      } else {
        response.json().then((data) => {
          ElMessage({
            message: data.msg,
            type: 'warning'
          })
        })
      }
    }
  }

  const fetchClusters = async () => {
    const options = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    }
    const res = await jwtFetch(`${csghubServer}/api/v1/cluster`, options)
    if (!res.ok) {
      ElMessage({ message: t('all.fetchError'), type: 'warning' })
    } else {
      res.json().then((body) => {
        finetuneClusters.value = body.data
      })
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
      ElMessage({
        message: t('all.fetchError'),
        type: 'warning'
      })
    } else {
      res.json().then((body) => {
        cloudResources.value = body.data
      })
    }
  }

  const updateCloudResource = (value) => {
    const payload = { cloud_resource: value }
    updateFinetune(payload)
  }

  const fetchFrameworks = async () => {
    const options = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    }
    const res = await jwtFetch(
      `${csghubServer}/api/v1/models/runtime_framework?deploy_type=2`,
      options
    )
    if (!res.ok) {
      ElMessage({
        message: t('all.fetchError'),
        type: 'warning'
      })
    } else {
      res.json().then((body) => {
        frameworks.value = body.data
        const currentFramework = body.data.find((framework) => {
          return framework.frame_name === props.framework
        })
        currentFrameworkId.value = currentFramework?.id || ''
      })
    }
  }

  const updateFramework = (value) => {
    const payload = { framework_id: value }
    updateFinetune(payload)
  }

  const updateFinetune = async (payload) => {
    const finetuneUpdateFinetune = `/internal_api/finetunes/${props.userName}/${props.finetuneName}/${props.finetuneId}`
    const option = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }
    const response = await csrfFetch(finetuneUpdateFinetune, option)

    if (!response.ok) {
      response.json().then((err) => {
        ElMessage({ message: err.message, type: 'warning' })
      })
    } else {
      if (payload.hasOwnProperty('private')) {
        repoDetailStore.updateVisibility(payload.private)
      }
      response.json().then((data) => {
        ElMessage({ message: data.message, type: 'success' })
      })
    }
  }

  const deleteFinetune = async () => {
    const options = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    }
    const res = await jwtFetch(
      `${csghubServer}/api/v1/models/${props.modelId}/finetune/${props.finetuneId}`,
      options
    )
    if (!res.ok) {
      ElMessage({
        message: t('all.fetchError'),
        type: 'warning'
      })
    } else {
      res.json().then((body) => {
        ElMessage({ message: t('all.delSuccess'), type: 'success' })
        setTimeout(() => {
          window.location.href = `/profile/${props.userName}`
        }, 500)
      })
    }
  }

  const restartFinetune = async () => {
    startUrl = `${csghubServer}/api/v1/models/${props.modelId}/run/${props.finetuneId}/start`
    const response = await jwtFetch(startUrl, { method: 'PUT' })

    if (response.ok) {
      ElMessage({
        message: t('finetunes.settings.toggleStatusSuccess'),
        type: 'success'
      })
    } else {
      if (response.status === 401) {
        refreshJWT()
      } else {
        response.json().then((data) => {
          ElMessage({
            message: data.msg,
            type: 'warning'
          })
        })
      }
    }
  }

  const handleMouseOver = () => {
    if (delDesc.value !== '') {
      document
        .getElementById('confirmDelete')
        .classList.replace('bg-[#D92D20]', 'bg-[#B42318]')
    }
  }

  const handleMouseLeave = () => {
    document
      .getElementById('confirmDelete')
      .classList.replace('bg-[#B42318]', 'bg-[#D92D20]')
  }

  const clickDelete = () => {
    if (delDesc.value === `${props.finetuneName}/${props.finetuneId}`) {
      deleteFinetune().catch((err) => {
        ElMessage({
          message: err.message,
          type: 'warning'
        })
      })
    }
  }

  onMounted(() => {
    fetchResources()
    fetchFrameworks()
    fetchClusters()
  })
</script>
