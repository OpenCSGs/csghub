<template>
  <div
    class="border border-[#DCDFE6] rounded-[8px] my-[32px] md:my-0 md:border-none px-[24px] py-[24px]"
  >
    <!-- 暂停 -->
    <div class="flex xl:flex-col gap-[32px]">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-[14px] text-[#344054] leading-[20px] font-medium">
          {{ $t('finetunes.settings.stopFinetune') }}
        </div>
      </div>
      <div class="flex flex-col gap-[6px]">
        <div class="flex flex-col gap-[6px]">
          <el-button
            @click="stopFinetune"
            class="w-[100px]"
            :disabled="!initialized || isStopped"
          >
            {{ $t('finetunes.settings.stop') }}
          </el-button>
        </div>
      </div>
    </div>

    <el-divider />

    <!-- 重启 -->
    <div class="flex xl:flex-col gap-[32px]">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-[14px] text-[#344054] leading-[20px] font-medium">
          {{ $t('finetunes.settings.restartFinetune') }}
        </div>
      </div>
      <div class="flex flex-col gap-[6px]">
        <el-button
          @click="restartFinetune"
          class="w-[100px]"
          :disabled="notInitialized"
        >
          {{ $t('finetunes.settings.restart') }}
        </el-button>
      </div>
    </div>

    <el-divider />

    <!-- cloud resource -->
    <div class="flex xl:flex-col gap-[32px]">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-[14px] text-[#344054] leading-[20px] font-medium">
          {{ $t('finetunes.settings.resource') }}
        </div>
        <div class="text-[14px] text-[#475467] leading-[20px]">
          {{ $t('finetunes.settings.resourceTip') }}
        </div>
      </div>
      <div class="flex flex-col gap-[6px]">
        <p class="text-[#344054] text-[14px]">
          {{ $t('finetunes.settings.currentCloudResource') }}
        </p>
        <el-select
          v-model="currentResource"
          placeholder="选择"
          size="large"
          class="!w-[512px] sm:!w-full"
          @change="updateCloudResource"
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

    <!-- framework -->
    <div class="flex xl:flex-col gap-[32px]">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-[14px] text-[#344054] leading-[20px] font-medium">
          {{ $t('finetunes.settings.framework') }}
        </div>
      </div>
      <div class="flex flex-col gap-[6px]">
        <p class="text-[#344054] text-[14px]">
          {{ $t('finetunes.settings.currentFramework') }}
        </p>
        <el-select
          v-model="currentFrameworkId"
          placeholder="选择"
          size="large"
          class="!w-[512px] sm:!w-full"
          @change="updateFramework"
        >
          <el-option
            v-for="item in frameworks"
            :key="item.id"
            :label="item.frame_name"
            :value="item.id"
          />
        </el-select>
      </div>
    </div>

    <el-divider />

    <!-- 删除 -->
    <div class="flex xl:flex-col gap-[32px]">
      <div class="w-[380px] sm:w-full flex flex-col gap-[6px]">
        <div class="text-[14px] text-[#344054] leading-[20px] font-medium">
          {{ $t('finetunes.settings.deleteFinetune') }}
        </div>
        <div class="text-[14px] text-[#475467] leading-[20px]">
          {{ $t('finetunes.settings.delTips') }}
          <span class="text-black font-medium">{{ $t('all.canNot') }}</span>
          {{ $t('finetunes.settings.delTips2') }}
          <span class="text-black font-medium break-words">{{
            finetuneName
          }}</span>
          {{ $t('finetunes.settings.delTips3') }}
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
          {{ $t('finetunes.settings.namespaceName') }}
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
            {{ $t('finetunes.settings.confirmDel') }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { h, ref, computed, inject, onMounted } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import refreshJWT from '../../packs/refreshJWT.js'
  import jwtFetch from '../../packs/jwtFetch'
  import csrfFetch from '../../packs/csrfFetch'
  import { useI18n } from 'vue-i18n'
  import useRepoDetailStore from '../../stores/RepoDetailStore'

  const props = defineProps({
    finetuneId: Number,
    finetuneName: String,
    appStatus: String,
    modelId: String,
    userName: String,
    cloudResource: String,
    framework: String,
    maxReplica: Number,
    minReplica: Number
  })

  const { t } = useI18n()
  const csghubServer = inject('csghubServer')
  const delDesc = ref('')
  const currentResource = ref(props.cloudResource)
  const cloudResources = ref([])
  const currentFrameworkId = ref('')

  const frameworks = ref([])
  const replicaRanges = ['1', '2', '3', '4', '5']
  const currentMaxReplica = ref(props.maxReplica)
  const currentMinReplica = ref(props.minReplica)
  const repoDetailStore = useRepoDetailStore()
  const visibilityOptions = ref([
    { value: 'Private', label: t('all.private') },
    { value: 'Public', label: t('all.public') }
  ])

  const visibilityName = computed(() => {
    return !!repoDetailStore.privateVisibility ? 'Private' : 'Public'
  })

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
      `${csghubServer}/api/v1/models/runtime_framework?deploy_type=1`,
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
        currentFrameworkId.value = currentFramework.id
      })
    }
  }

  const updateFramework = (value) => {
    const payload = { framework_id: value }
    updateFinetune(payload)
  }

  const updateMaxReplica = (value) => {
    const payload = { max_replica: value }
    updateFinetune(payload)
  }

  const updateMinReplica = (value) => {
    const payload = { min_replica: value }
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
    const finetuneDeleteFinetune = `/internal_api/finetunes/${props.userName}/${props.finetuneName}/${props.finetuneId}`
    const option = { method: 'DELETE' }
    const response = await csrfFetch(finetuneDeleteFinetune, option)

    if (!response.ok) {
      return response.json().then((data) => {
        throw new Error(data.message)
      })
    } else {
      ElMessage({ message: t('all.delSuccess'), type: 'success' })
      setTimeout(() => {
        window.location.href = `/profile/${props.userName}`
      }, 500)
      return response.json()
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
  })
</script>
