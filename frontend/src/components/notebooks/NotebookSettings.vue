<template>
  <div
    class="border border-gray-200 rounded-md my-[32px] md:my-0 md:border-none px-[24px] py-[24px]">
    <!-- 暂停 -->
    <div class="flex xl:flex-col gap-[32px]">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-sm text-gray-700 leading-[20px] font-medium">
          {{ $t('notebooks.settings.stopNotebook') }}
        </div>
      </div>
      <div class="flex flex-col gap-[6px]">
        <div class="flex flex-col gap-[6px]">
          <CsgButton
            @click="stopNotebook"
            class="btn btn-secondary-gray btn-sm w-[100px]"
            :disabled="!initialized || isStopped"
            :loading="isStopLoading"
            :name="$t('notebooks.settings.stop')">
          </CsgButton>
        </div>
      </div>
    </div>

    <el-divider />

    <!-- 重启 -->
    <div class="flex xl:flex-col gap-[32px]">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-sm text-gray-700 leading-[20px] font-medium">
          {{ $t('notebooks.settings.restartNotebook') }}
        </div>
      </div>
      <div class="flex flex-col gap-[6px]">
        <CsgButton
          @click="restartNotebook"
          class="btn btn-secondary-gray btn-sm w-[100px]"
          :disabled="notInitialized"
          :loading="isRestartLoading"
          :name="$t('notebooks.settings.restart')">
        </CsgButton>
      </div>
    </div>

    <el-divider />

    <!-- cloud resource -->
    <div class="flex xl:flex-col gap-[32px]">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-sm text-gray-700 leading-[20px] font-medium">
          {{ $t('notebooks.settings.resource') }}
        </div>
        <div class="text-sm text-gray-600 leading-[20px]">
          {{ $t('notebooks.settings.resourceTip') }}
        </div>
      </div>
      <div class="flex flex-col gap-[6px]">
        <p class="text-gray-700 text-sm">
          {{ $t('notebooks.settings.currentCloudResource') }}
        </p>
        <!-- @change="updateCloudResource"
          :disabled="!isStopped" -->
        <el-select
          v-model="currentResource"
          :placeholder="$t('all.select')"
          size="large"
          class="!w-[512px] sm:!w-full"
          disabled>
          <el-option-group
            v-for="group in cloudResources"
            :key="group.label"
            :label="group.label"
          >
            <el-option
              v-for="item in group.options"
              :key="item.name"
              :label="item.label"
              :value="`${item.id}/${item.order_detail_id}`"
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
          {{ $t('notebooks.settings.framework') }}
        </div>
      </div>
      <div class="flex flex-col gap-[6px]">
        <p class="text-gray-700 text-sm">
          {{ $t('notebooks.settings.currentFramework') }}
        </p>
        <el-select
          v-model="currentFrameworkId"
          :placeholder="$t('all.select')"
          size="large"
          class="!w-[512px] sm:!w-full"
          disabled>
          <el-option
            v-for="item in runtimeFrameworkOptions"
            :key="item.frameVersion"
            :label="item.label"
            :value="item.frameVersion"
          />
        </el-select>
      </div>
    </div>

    <el-divider />

    <!-- max replica -->
    <div class="flex xl:flex-col gap-[32px]">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-sm text-gray-700 leading-[20px] font-medium">
          {{ $t('notebooks.settings.maxReplica') }}
        </div>
      </div>
      <div class="flex flex-col gap-[6px]">
        <p class="text-gray-700 text-sm">
          {{ $t('notebooks.settings.currentMaxReplica') }}
        </p>
        <el-select
          v-model="currentMaxReplica"
          :placeholder="$t('all.select')"
          size="large"
          class="!w-[512px] sm:!w-full"
          disabled>
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
          {{ $t('notebooks.settings.minReplica') }}
        </div>
      </div>
      <div class="flex flex-col gap-[6px]">
        <p class="text-gray-700 text-sm">
          {{ $t('notebooks.settings.currentMinReplica') }}
        </p>
        <el-select
          v-model="currentMinReplica"
          :placeholder="$t('all.select')"
          size="large"
          class="!w-[512px] sm:!w-full"
          @change="updateMinReplica"
          :disabled="!isStopped">
          <el-option
            v-for="item in minReplicaRanges"
            :key="item"
            :label="item"
            :value="item" />
        </el-select>
      </div>
    </div>

    <el-divider />

    <!-- 删除 -->
    <div class="flex xl:flex-col gap-[32px]">
      <div class="w-[380px] sm:w-full flex flex-col gap-[6px]">
        <div class="text-sm text-gray-700 leading-[20px] font-medium">
          {{ $t('notebooks.settings.deleteNotebook') }}
        </div>
        <div class="text-sm text-gray-600 leading-[20px]">
          {{ $t('notebooks.settings.delTips') }}
          <span class="text-black font-medium">{{ $t('all.canNot') }}</span>
          {{ $t('notebooks.settings.delTips2') }}
          <span class="text-black font-medium break-words">{{
            notebookName
          }}</span>
          {{ $t('notebooks.settings.delTips3') }}
        </div>
        <div class="text-sm text-gray-600 leading-[20px]">
          {{ $t('all.enterPls') }}
          <span class="text-black font-medium break-words">
            {{ `${notebookName}/${notebookId}` }}
          </span>
          {{ $t('all.sureDel') }}
        </div>
      </div>
      <div class="flex flex-col gap-[8px]">
        <p class="text-gray-700 text-sm">
          {{ $t('notebooks.settings.namespaceName') }}
        </p>
        <el-input
          v-model.trim="delDesc"
          clearable
          size="large"
          class="!w-[512px] sm:!w-full" />
        <div class="flex">
          <div
            id="confirmDelete"
            @click="clickDelete"
            class="text-gray-400 py-[8px] px-[12px] text-sm leading-[20px] rounded-md"
            :class="
              delDesc === `${notebookName}/${notebookId}`
                ? 'bg-error-600 text-white cursor-pointer active:shadow-box active:space-y-0 active:space-x-0 active:ring-4 active:ring-red-400 active:ring-opacity-25 active:bg-error-600 hover:text-white'
                : 'bg-gray-100'
            "
            @mouseover="handleMouseOver"
            @mouseleave="handleMouseLeave">
            {{ $t('notebooks.settings.confirmDel') }}
          </div>
        </div>
      </div>
    </div>
    <BalanceInsufficientDialog :errorMsg="apiErrorMsg" />
  </div>
</template>

<script setup>
  import { h, ref, computed, onMounted, watchEffect, watch, inject, nextTick } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import refreshJWT from '../../packs/refreshJWT.js'
  import useFetchApi from '../../packs/useFetchApi'
  import { useI18n } from 'vue-i18n'
  import useRepoDetailStore from '../../stores/RepoDetailStore'
  import EngineArgs from '../endpoints/EngineArgs.vue'
  import { fetchResourcesInCategory } from '../shared/deploy_instance/fetchResourceInCategory.js'
  import BalanceInsufficientDialog from '../dialog/BalanceInsufficientDialog.vue'
  import CsgButton from '../shared/CsgButton.vue'

  const repoDetailStore = useRepoDetailStore()

  const props = defineProps({
    notebookId: Number,
    notebookName: String,
    appStatus: String,
    runtimeFrameworkId: String,
    maxReplica: Number,
    minReplica: Number,
    clusterId: String,
    sku: String,
  })

  const fetchRepoDetail = inject('fetchRepoDetail')
  const { t } = useI18n()
  const delDesc = ref('')
  const cloudResources = ref([])
  const minReplicaRanges = [0, 1]
  const replicaRanges = [1]
  const currentResource = ref(null)
  const currentFrameworkId = ref(null)
  const currentMinReplica = ref(null)
  const currentMaxReplica = ref(null)
  const apiErrorMsg = ref('')
  const runtimeFrameworkOptions = ref([])
  const isStopLoading = ref(false)
  const isRestartLoading = ref(false)

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
    currentResource.value = props.sku
    currentMaxReplica.value = props.maxReplica
    currentMinReplica.value = props.minReplica || 0
    if (props.runtimeFrameworkId) {
      currentFrameworkId.value = props.runtimeFrameworkId
    }
  })

  const fetchResources = async () => {
    if (!props.clusterId) return

    const categoryResources = await fetchResourcesInCategory(props.clusterId, 5)
    cloudResources.value = categoryResources
  }

  const stopNotebook = async () => {
    isStopLoading.value = true
    try {
      const stopUrl = `/notebooks/${props.notebookId}/stop`
      const { response, error } = await useFetchApi(stopUrl).put().json()

      if (!error.value) {
        repoDetailStore.activeInstance = ''
        ElMessage({
          message: t('notebooks.settings.toggleStatusSuccess'),
          type: 'success'
        })
        fetchRepoDetail(true)
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
    } finally {
      isStopLoading.value = false
    }
  }

  const updateCloudResource = (value) => {
    const [resourceId, orderDetailId] = value.split('/')
    const payload = { 
      resource_id: Number(resourceId),
      order_detail_id: Number(orderDetailId)
    }
    updateNotebook(payload)
  }

  const updateMinReplica = (value) => {
    const payload = { min_replica: value }
    updateNotebook(payload)
  }

  const updateArgs = () => {
    const payload = { engine_args: JSON.stringify(engineArgs.value) }
    updateNotebook(payload)
  }

  const updateNotebook = async (payload) => {
    const notebookUpdateEndpoint = `/notebooks/${props.notebookId}`
    const options = {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }
    const { data, error } = await useFetchApi(notebookUpdateEndpoint, options)
      .put()
      .json()
      
    if (error.value) {
      apiErrorMsg.value = `${Date.now()} ${error.value.msg || ''}`
    } else {
      if (payload.hasOwnProperty('private')) {
        repoDetailStore.updateVisibility(payload.private)
      }
      fetchRepoDetail(true)
      ElMessage({ message: data.value.msg, type: 'success' })
    }
  }

  const deleteNotebook = async () => {
    const notebookDeleteEndpoint = `/notebooks/${props.notebookId}`

    const { error } = await useFetchApi(notebookDeleteEndpoint).delete().json()

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

  const restartNotebook = async () => {
    isRestartLoading.value = true
    try {
      const startUrl = `/notebooks/${props.notebookId}/start`
      const { response, error } = await useFetchApi(startUrl).put().json()

      if (!error.value) {
        ElMessage({
          message: t('notebooks.settings.toggleStatusSuccess'),
          type: 'success'
        })
        fetchRepoDetail(true)
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
    } finally {
      isRestartLoading.value = false
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
    if (delDesc.value === `${props.notebookName}/${props.notebookId}`) {
      deleteNotebook().catch((err) => {
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
