<template>
  <div
    class="border border-gray-200 rounded-md my-[32px] md:my-0 md:border-none px-[24px] py-[24px]">
    <!-- 暂停 -->
    <div class="flex xl:flex-col gap-[32px]">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-sm text-gray-700 leading-[20px] font-medium">
          {{ $t('endpoints.settings.stopEndpoint') }}
        </div>
      </div>
      <div class="flex flex-col gap-[6px]">
        <div class="flex flex-col gap-[6px]">
          <CsgButton
            @click="stopEndpoint"git 
            class="btn btn-secondary-gray btn-sm w-[100px]"
            :disabled="!initialized || isStopped"
            :name="$t('endpoints.settings.stop')">
          </CsgButton>
        </div>
      </div>
    </div>

    <el-divider />

    <!-- 重启 -->
    <div class="flex xl:flex-col gap-[32px]">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-sm text-gray-700 leading-[20px] font-medium">
          {{ $t('endpoints.settings.restartEndpoint') }}
        </div>
      </div>
      <div class="flex flex-col gap-[6px]">
        <CsgButton
          @click="restartEndpoint"
          class="btn btn-secondary-gray btn-sm w-[100px]"
          :disabled="notInitialized"
          :name="$t('endpoints.settings.restart')">
        </CsgButton>
      </div>
    </div>

    <el-divider />

    <!-- cloud resource -->
    <div class="flex xl:flex-col gap-[32px]">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-sm text-gray-700 leading-[20px] font-medium">
          {{ $t('endpoints.settings.resource') }}
        </div>
        <div class="text-sm text-gray-600 leading-[20px]">
          {{ $t('endpoints.settings.resourceTip') }}
        </div>
      </div>
      <div class="flex flex-col gap-[6px]">
        <p class="text-gray-700 text-sm">
          {{ $t('endpoints.settings.currentCloudResource') }}
        </p>
        <el-select
          v-model="currentResource"
          placeholder="选择"
          size="large"
          class="!w-[512px] sm:!w-full"
          @change="updateCloudResource"
          :disabled="!isStopped">
          <el-option-group
            v-for="group in cloudResources"
            :key="group.label"
            :label="group.label"
          >
            <el-option
              v-for="item in group.options"
              :key="item.name"
              :label="item.label"
              :value="item.id"
              :disabled="!item.is_available"
            />
          </el-option-group>
        </el-select>
      </div>
    </div>

    <el-divider />

    <!-- framework -->
    <div class="flex xl:flex-col gap-[32px]">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-sm text-gray-700 leading-[20px] font-medium">
          {{ $t('endpoints.settings.framework') }}
        </div>
      </div>
      <div class="flex flex-col gap-[6px]">
        <p class="text-gray-700 text-sm">
          {{ $t('endpoints.settings.currentFramework') }}
        </p>
        <el-select
          v-model="currentFrameworkId"
          placeholder="选择"
          size="large"
          class="!w-[512px] sm:!w-full"
          @change="updateFramework"
          :disabled="!isStopped">
          <el-option
            v-for="item in filterFrameworks"
            :key="item.id"
            :label="item.frame_name"
            :value="item.id" />
        </el-select>
      </div>
    </div>

    <div v-if="Object.keys(variables).length > 0" class="w-[925px] mt-4 xl:w-full">
      <EngineArgs
        :engineArgs="engineArgs"
        :disabled="!isStopped"
      />
      <div class="flex justify-end">
        <CsgButton
          :name="$t('all.update')"
          class="btn btn-primary btn-sm"
          @click="updateArgs"
          :disabled="!isStopped"
        />
      </div>
    </div>

    <el-divider />

    <!-- max replica -->
    <div class="flex xl:flex-col gap-[32px]">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-sm text-gray-700 leading-[20px] font-medium">
          {{ $t('endpoints.settings.maxReplica') }}
        </div>
      </div>
      <div class="flex flex-col gap-[6px]">
        <p class="text-gray-700 text-sm">
          {{ $t('endpoints.settings.currentMaxReplica') }}
        </p>
        <el-select
          v-model="currentMaxReplica"
          placeholder="选择"
          size="large"
          class="!w-[512px] sm:!w-full"
          @change="updateMaxReplica"
          :disabled="!isStopped">
          <el-option
            v-for="item in replicaRanges"
            :key="item"
            :label="item"
            :value="item" />
        </el-select>
      </div>
    </div>

    <el-divider />

    <!-- min replica -->
    <div class="flex xl:flex-col gap-[32px]">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-sm text-gray-700 leading-[20px] font-medium">
          {{ $t('endpoints.settings.minReplica') }}
        </div>
      </div>
      <div class="flex flex-col gap-[6px]">
        <p class="text-gray-700 text-sm">
          {{ $t('endpoints.settings.currentMinReplica') }}
        </p>
        <el-select
          v-model="currentMinReplica"
          placeholder="选择"
          size="large"
          class="!w-[512px] sm:!w-full"
          @change="updateMinReplica"
          :disabled="!isStopped">
          <el-option
            v-for="item in replicaRanges"
            :key="item"
            :label="item"
            :value="item" />
        </el-select>
      </div>
    </div>

    <el-divider />

    <!-- 修改可见性 -->
    <div class="flex xl:flex-col gap-[32px]">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-sm text-gray-700 leading-[20px] font-medium">
          {{ $t('endpoints.settings.changeVisibility') }}
        </div>
        <div class="text-sm text-gray-600 leading-[20px]">
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
        <p class="text-gray-700 text-sm">
          {{ $t('endpoints.settings.visibility') }}
        </p>
        <el-select
          v-model="visibilityName"
          @change="changeVisibility"
          placeholder="Select"
          size="large"
          class="!w-[512px] sm:!w-full"
        >
          <el-option
            v-for="item in visibilityOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value" />
        </el-select>
      </div>
    </div>

    <el-divider />

    <!-- 删除 -->
    <div class="flex xl:flex-col gap-[32px]">
      <div class="w-[380px] sm:w-full flex flex-col gap-[6px]">
        <div class="text-sm text-gray-700 leading-[20px] font-medium">
          {{ $t('endpoints.settings.deleteEndpoint') }}
        </div>
        <div class="text-sm text-gray-600 leading-[20px]">
          {{ $t('endpoints.settings.delTips') }}
          <span class="text-black font-medium">{{ $t('all.canNot') }}</span>
          {{ $t('endpoints.settings.delTips2') }}
          <span class="text-black font-medium break-words">{{
            endpointName
          }}</span>
          {{ $t('endpoints.settings.delTips3') }}
        </div>
        <div class="text-sm text-gray-600 leading-[20px]">
          {{ $t('all.enterPls') }}
          <span class="text-black font-medium break-words">
            {{ `${endpointName}/${endpointId}` }}
          </span>
          {{ $t('all.sureDel') }}
        </div>
      </div>
      <div class="flex flex-col gap-[8px]">
        <p class="text-gray-700 text-sm">
          {{ $t('endpoints.settings.namespaceName') }}
        </p>
        <el-input
          v-model="delDesc"
          clearable
          size="large"
          class="!w-[512px] sm:!w-full" />
        <div class="flex">
          <div
            id="confirmDelete"
            @click="clickDelete"
            class="text-gray-400 py-[8px] px-[12px] text-sm leading-[20px] rounded-md"
            :class="
              delDesc === `${endpointName}/${endpointId}`
                ? 'bg-error-600 text-white cursor-pointer active:shadow-box active:space-y-0 active:space-x-0 active:ring-4 active:ring-red-400 active:ring-opacity-25 active:bg-error-600 hover:text-white'
                : 'bg-gray-100'
            "
            @mouseover="handleMouseOver"
            @mouseleave="handleMouseLeave">
            {{ $t('endpoints.settings.confirmDel') }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { h, ref, computed, onMounted, watchEffect, watch, inject, nextTick } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import refreshJWT from '../../packs/refreshJWT.js'
  import useFetchApi from '../../packs/useFetchApi'
  import { useI18n } from 'vue-i18n'
  import useRepoDetailStore from '../../stores/RepoDetailStore'
  import EngineArgs from './EngineArgs.vue'
  import { fetchResourcesInCategory } from '../shared/deploy_instance/fetchResourceInCategory.js'

  const repoDetailStore = useRepoDetailStore()

  const props = defineProps({
    endpointId: Number,
    endpointName: String,
    appStatus: String,
    modelId: String,
    cloudResourceSku: String,
    framework: String,
    maxReplica: Number,
    minReplica: Number,
    clusterId: String,
    variables: Object,
  })

  const fetchRepoDetail = inject('fetchRepoDetail')
  const { t } = useI18n()
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
  const engineArgs = ref(props.variables)

  const visibilityName = computed(() => {
    return repoDetailStore.privateVisibility? 'Private' : 'Public'
  })

  watch(
    () => props.clusterId,
    (newVal) => {
      if (newVal) {
        fetchResources()
      }
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

  watchEffect(() => {
    currentResource.value = Number(props.cloudResourceSku)
    currentMaxReplica.value = props.maxReplica
    currentMinReplica.value = props.minReplica
  })

  const currentResourceDetail = computed(() => {
    return cloudResources.value
            .flatMap((category) => category.options)
            .find((item) => item.id == currentResource.value)
  })

  const filterFrameworks = computed(() => {
    if (!currentResource.value) return []
    if (!currentResourceDetail.value) return []
    if (!frameworks.value) return []
    return frameworks.value.filter((framework) => framework.compute_type == currentResourceDetail.value?.type)
  })

  const fetchFrameworks = async () => {
    const { data } = await useFetchApi(
      `/models/${props.modelId}/runtime_framework?deploy_type=1`
    ).json()
    if (data.value) {
      const body = data.value
      frameworks.value = body.data || []
      const currentFramework = body.data?.find((framework) => {
        return framework.frame_name.toLowerCase() === props.framework.toLowerCase() && framework.compute_type === currentResourceDetail.value?.type
      })
      currentFrameworkId.value = currentFramework?.id
    }
  }

  const fetchResources = async () => {
    const categoryResources = await fetchResourcesInCategory(props.clusterId)
    cloudResources.value = categoryResources
    nextTick(() => {
      fetchFrameworks()
    })
  }

  const stopEndpoint = async () => {
    const stopUrl = `/models/${props.modelId}/run/${props.endpointId}/stop`
    const { response, error } = await useFetchApi(stopUrl).put().json()

    if (!error.value) {
      // after stop, all instance will be turn off
      repoDetailStore.activeInstance = ''
      ElMessage({
        message: t('endpoints.settings.toggleStatusSuccess'),
        type: 'success'
      })
    } else {
      if (response.value.status === 401) {
        refreshJWT()
      } else {
        ElMessage({
          message: error.value.msg,
          type: 'warning'
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

  const updateCloudResource = (value) => {
    const payload = { resource_id: value }
    updateEndpoint(payload)
  }

  const updateFramework = (value) => {
    const payload = { runtime_framework_id: value }
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

  const updateArgs = () => {
    const payload = { engine_args: JSON.stringify(engineArgs.value) }
    updateEndpoint(payload)
  }

  const updateEndpoint = async (payload) => {
    const endpointUpdateEndpoint = `/models/${props.modelId}/run/${props.endpointId}`
    const options = {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }
    const { data, error } = await useFetchApi(endpointUpdateEndpoint, options)
      .put()
      .json()

    if (error.value) {
      ElMessage({ message: error.value.msg, type: 'warning' })
    } else {
      if (payload.hasOwnProperty('private')) {
        repoDetailStore.updateVisibility(payload.private)
      }
      fetchRepoDetail()
      ElMessage({ message: data.value.msg, type: 'success' })
    }
  }

  const deleteEndpoint = async () => {
    const endpointDeleteEndpoint = `/models/${props.modelId}/run/${props.endpointId}`

    const { error } = await useFetchApi(endpointDeleteEndpoint).delete().json()

    if (error.value) {
      ElMessage({ message: error.value.msg, type: 'warning' })
    } else {
      ElMessage({ message: t('all.delSuccess'), type: 'success' })
      setTimeout(() => {
        window.location.href = '/resource-console'
      }, 500)
      return true
    }
  }

  const restartEndpoint = async () => {
    const startUrl = `/models/${props.modelId}/run/${props.endpointId}/start`
    const { response, error } = await useFetchApi(startUrl).put().json()

    if (!error.value) {
      ElMessage({
        message: t('endpoints.settings.toggleStatusSuccess'),
        type: 'success'
      })
    } else {
      if (response.value.status === 401) {
        refreshJWT()
      } else {
        ElMessage({
          message: error.value.msg,
          type: 'warning'
        })
      }
    }
  }

  const handleMouseOver = () => {
    if (delDesc.value !== '') {
      document
        .getElementById('confirmDelete')
        .classList.replace('bg-error-600', 'bg-error-700')
    }
  }

  const handleMouseLeave = () => {
    document
      .getElementById('confirmDelete')
      .classList.replace('bg-error-700', 'bg-error-600')
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
    if (props.clusterId) {
      fetchResources()
    }
  })
</script>
