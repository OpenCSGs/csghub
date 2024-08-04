<template>
  <div
    class="border border-[#DCDFE6] rounded-[8px] my-[32px] md:my-0 md:border-none px-[24px] py-[24px]"
  >
    <!-- 暂停 -->
    <div class="flex xl:flex-col gap-[32px]">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-[14px] text-[#344054] leading-[20px] font-medium">
          {{ $t('endpoints.settings.stopEndpoint') }}
        </div>
      </div>
      <div class="flex flex-col gap-[6px]">
        <div class="flex flex-col gap-[6px]">
          <el-button
            @click="stopEndpoint"
            class="w-[100px]"
            :disabled="!initialized || isStopped"
          >
            {{ $t('endpoints.settings.stop') }}
          </el-button>
        </div>
      </div>
    </div>

    <el-divider />

    <!-- 重启 -->
    <div class="flex xl:flex-col gap-[32px]">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-[14px] text-[#344054] leading-[20px] font-medium">
          {{ $t('endpoints.settings.restartEndpoint') }}
        </div>
      </div>
      <div class="flex flex-col gap-[6px]">
        <el-button
          @click="restartEndpoint"
          class="w-[100px]"
          :disabled="notInitialized"
        >
          {{ $t('endpoints.settings.restart') }}
        </el-button>
      </div>
    </div>

    <el-divider />

    <!-- cloud resource -->
    <div class="flex xl:flex-col gap-[32px]">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-[14px] text-[#344054] leading-[20px] font-medium">
          {{ $t('endpoints.settings.resource') }}
        </div>
        <div class="text-[14px] text-[#475467] leading-[20px]">
          {{ $t('endpoints.settings.resourceTip') }}
        </div>
      </div>
      <div class="flex flex-col gap-[6px]">
        <p class="text-[#344054] text-[14px]">
          {{ $t('endpoints.settings.currentCloudResource') }}
        </p>
        <el-select
          v-model="currentResource"
          placeholder="选择"
          size="large"
          class="!w-[512px] sm:!w-full"
          @change="updateCloudResource"
          :disabled="!isStopped"
        >
          <el-option
            v-for="item in cloudResources"
            :key="item.name"
            :label="item.name"
            :value="item.id"
            :disabled="!item.is_available"
          />
        </el-select>
      </div>
    </div>

    <el-divider />

    <!-- framework -->
    <div class="flex xl:flex-col gap-[32px]">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-[14px] text-[#344054] leading-[20px] font-medium">
          {{ $t('endpoints.settings.framework') }}
        </div>
      </div>
      <div class="flex flex-col gap-[6px]">
        <p class="text-[#344054] text-[14px]">
          {{ $t('endpoints.settings.currentFramework') }}
        </p>
        <el-select
          v-model="currentFrameworkId"
          placeholder="选择"
          size="large"
          class="!w-[512px] sm:!w-full"
          @change="updateFramework"
          :disabled="!isStopped"
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

    <!-- max replica -->
    <div class="flex xl:flex-col gap-[32px]">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-[14px] text-[#344054] leading-[20px] font-medium">
          {{ $t('endpoints.settings.maxReplica') }}
        </div>
      </div>
      <div class="flex flex-col gap-[6px]">
        <p class="text-[#344054] text-[14px]">
          {{ $t('endpoints.settings.currentMaxReplica') }}
        </p>
        <el-select
          v-model="currentMaxReplica"
          placeholder="选择"
          size="large"
          class="!w-[512px] sm:!w-full"
          @change="updateMaxReplica"
          :disabled="!isStopped"
        >
          <el-option
            v-for="item in replicaRanges"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </div>
    </div>

    <el-divider />

    <!-- min replica -->
    <div class="flex xl:flex-col gap-[32px]">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-[14px] text-[#344054] leading-[20px] font-medium">
          {{ $t('endpoints.settings.minReplica') }}
        </div>
      </div>
      <div class="flex flex-col gap-[6px]">
        <p class="text-[#344054] text-[14px]">
          {{ $t('endpoints.settings.currentMinReplica') }}
        </p>
        <el-select
          v-model="currentMinReplica"
          placeholder="选择"
          size="large"
          class="!w-[512px] sm:!w-full"
          @change="updateMinReplica"
          :disabled="!isStopped"
        >
          <el-option
            v-for="item in replicaRanges"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </div>
    </div>

    <el-divider />

    <!-- 修改可见性 -->
    <div class="flex xl:flex-col gap-[32px]">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-[14px] text-[#344054] leading-[20px] font-medium">
          {{ $t('endpoints.settings.changeVisibility') }}
        </div>
        <div class="text-[14px] text-[#475467] leading-[20px]">
          {{ $t('endpoints.settings.statusText') }}
          <span class="text-black font-semibold"
            >【{{
              repoDetailStore.isPrivate ? t('all.private') : t('all.public')
            }}】</span
          >
          {{ $t('endpoints.settings.status') }}。{{
            repoDetailStore.isPrivate
              ? t('endpoints.settings.privateVis')
              : t('endpoints.settings.publicVis')
          }}
        </div>
      </div>
      <div class="flex flex-col gap-[6px]">
        <p class="text-[#344054] text-[14px]">
          {{ $t('endpoints.settings.visibility') }}
        </p>
        <el-select
          v-model="visibilityName"
          @change="changeVisibility"
          placeholder="Select"
          size="large"
          class="!w-[512px] sm:!w-full"
          :disabled="!isStopped"
        >
          <el-option
            v-for="item in visibilityOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
    </div>

    <el-divider />

    <!-- 删除 -->
    <div class="flex xl:flex-col gap-[32px]">
      <div class="w-[380px] sm:w-full flex flex-col gap-[6px]">
        <div class="text-[14px] text-[#344054] leading-[20px] font-medium">
          {{ $t('endpoints.settings.deleteEndpoint') }}
        </div>
        <div class="text-[14px] text-[#475467] leading-[20px]">
          {{ $t('endpoints.settings.delTips') }}
          <span class="text-black font-medium">{{ $t('all.canNot') }}</span>
          {{ $t('endpoints.settings.delTips2') }}
          <span class="text-black font-medium break-words">{{
            endpointName
          }}</span>
          {{ $t('endpoints.settings.delTips3') }}
        </div>
        <div class="text-[14px] text-[#475467] leading-[20px]">
          {{ $t('all.enterPls') }}
          <span class="text-black font-medium break-words">
            {{ `${endpointName}/${endpointId}` }}
          </span>
          {{ $t('all.sureDel') }}
        </div>
      </div>
      <div class="flex flex-col gap-[8px]">
        <p class="text-[#344054] text-[14px]">
          {{ $t('endpoints.settings.namespaceName') }}
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
              delDesc === `${endpointName}/${endpointId}`
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
  import { h, ref, computed, inject, onMounted, watchEffect, watch } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import refreshJWT from '../../packs/refreshJWT.js'
  import jwtFetch from '../../packs/jwtFetch'
  import { useI18n } from 'vue-i18n'
  import useRepoDetailStore from '../../stores/RepoDetailStore'

  const repoDetailStore = useRepoDetailStore()

  const props = defineProps({
    endpointId: Number,
    endpointName: String,
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
  const cloudResources = ref([])
  const frameworks = ref([])
  const replicaRanges = [1, 2, 3, 4, 5]
  const visibilityOptions = ref([
    { value: 'Private', label: t('all.private') },
    { value: 'Public', label: t('all.public') }
  ])
  const currentResource = ref(null)
  const currentFrameworkId = ref(null)
  const currentMinReplica = ref(null)
  const currentMaxReplica = ref(null)
  const visibilityName = ref('Public')

  watch(() => repoDetailStore.privateVisibility, (newVal) => {
    visibilityName.value = newVal ? 'Private' : 'Public'
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
      console.log('fetch frameworks failed')
    } else {
      res.json().then((body) => {
        frameworks.value = body.data
        const currentFramework = body.data.find((framework) => {
          return framework.frame_name === props.framework
        })
        currentFrameworkId.value = currentFramework?.id
      })
    }
  }

  // fetchFrameworks 的定义需要放到前面，不然找不到定义
  watchEffect(() => {
    currentResource.value = /^\d+$/.test(props.cloudResource) ? Number(props.cloudResource) : props.cloudResource
    currentMaxReplica.value = props.maxReplica
    currentMinReplica.value = props.minReplica
    fetchFrameworks()
  })

  const stopEndpoint = async () => {
    stopUrl = `${csghubServer}/api/v1/models/${props.modelId}/run/${props.endpointId}/stop`
    const response = await jwtFetch(stopUrl, { method: 'PUT' })

    if (response.ok) {
      ElMessage({
        message: t('endpoints.settings.toggleStatusSuccess'),
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

  const changeVisibility = (value) => {
    ElMessageBox({
      title: t('endpoints.settings.changeVisibility'),
      message: h('p', null, [
        h('span', null, t('all.changeVis')),
        h(
          'span',
          null,
          value === 'Private' ? t('all.private') : t('all.public')
        ),
        h(
          'span',
          null,
          value === 'Private'
            ? t('endpoints.settings.privateInfo')
            : t('endpoints.settings.publicInfo')
        )
      ]),
      showCancelButton: true,
      confirmButtonText: t('all.confirm'),
      cancelButtonText: t('all.cancel')
    })
      .then(() => {
        changeVisibilityCall(value)
      })
      .catch(() => {
        ElMessage({
          type: 'warning',
          message: t('all.changeCancel')
        })
      })
  }

  const changeVisibilityCall = (value) => {
    visibilityName.value = value
    const payload = { secure_level: value === 'Private' ? 2 : 1 }
    updateEndpoint(payload)
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
    const payload = { resource_id: value }
    updateEndpoint(payload)
  }

  const updateFramework = (value) => {
    const payload = { framework_id: value }
    updateEndpoint(payload)
  }

  const updateMaxReplica = (value) => {
    const payload = { max_replica: value }
    updateEndpoint(payload)
  }

  const updateMinReplica = (value) => {
    const payload = { min_replica: value }
    updateEndpoint(payload)
  }

  const updateEndpoint = async (payload) => {
    const endpointUpdateEndpoint = `${csghubServer}/api/v1/models/${props.modelId}/run/${props.endpointId}`
    const options = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }
    const response = await jwtFetch(endpointUpdateEndpoint, options)

    if (!response.ok) {
      response.json().then((err) => {
        ElMessage({ message: err.msg, type: 'warning' })
      })
    } else {
      if (payload.hasOwnProperty('private')) {
        repoDetailStore.updateVisibility(payload.private)
      }
      response.json().then((data) => {
        ElMessage({ message: data.msg, type: 'success' })
      })
    }
  }

  const deleteEndpoint = async () => {
    const endpointDeleteEndpoint = `${csghubServer}/api/v1/models/${props.modelId}/run/${props.endpointId}`
    const options = { method: 'DELETE' }
    const response = await jwtFetch(endpointDeleteEndpoint, options)

    if (!response.ok) {
      return response.json().then((data) => {
        ElMessage({ message: data.msg, type: 'warning' })
      })
    } else {
      ElMessage({ message: t('all.delSuccess'), type: 'success' })
      setTimeout(() => {
        window.location.href = `/profile/${props.userName}`
      }, 500)
      return response.json()
    }
  }

  const restartEndpoint = async () => {
    startUrl = `${csghubServer}/api/v1/models/${props.modelId}/run/${props.endpointId}/start`
    const response = await jwtFetch(startUrl, { method: 'PUT' })

    if (response.ok) {
      ElMessage({
        message: t('endpoints.settings.toggleStatusSuccess'),
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
    if (delDesc.value === `${props.endpointName}/${props.endpointId}`) {
      deleteEndpoint().catch((err) => {
        ElMessage({
          message: err.message,
          type: 'warning'
        })
      })
    }
  }

  onMounted(() => {
    fetchResources()
  })
</script>
