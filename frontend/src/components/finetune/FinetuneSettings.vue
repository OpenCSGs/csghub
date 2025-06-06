<template>
  <div
    class="border border-gray-200 rounded-md my-[32px] md:my-0 md:border-none px-[24px] py-[24px]"
  >
    <!-- 英文名称 -->
    <div class="flex xl:flex-col gap-[32px]">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-sm text-gray-700 leading-[20px] font-medium">
          {{ $t('finetune.detail.settings.enName') }}
        </div>
        <div class="text-sm text-gray-600 font-light leading-[20px]">
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
      </div>
    </div>

    <el-divider />

    <!-- 别名 -->
    <div class="flex xl:flex-col gap-[32px]">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-sm text-gray-700 leading-[20px] font-medium">
          {{ $t('finetune.detail.settings.cnName') }}
        </div>
        <div class="text-sm text-gray-600 font-light leading-[20px]">
          {{ $t('finetune.detail.settings.cnNameTip1') }}
        </div>
      </div>
      <div class="flex flex-col gap-[6px]">
        <el-input
          v-model="cnName"
          clearable
          disabled
          size="large"
          class="!w-[512px] sm:!w-full"
        />
      </div>
    </div>

    <el-divider />

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
            @click="changeStatus('stop')"
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
          @click="changeStatus('start')"
          class="btn btn-secondary-gray btn-sm w-[100px]"
          :disabled="notInitialized"
          :name="$t('endpoints.settings.restart')">
        </CsgButton>
      </div>
    </div>

    <el-divider />

    <!-- 区域 -->
    <div class="flex xl:flex-col gap-[32px]">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-sm text-gray-700 leading-[20px] font-medium">
          {{ $t('finetune.detail.settings.region') }}
        </div>
        <div class="text-sm text-gray-600 font-light leading-[20px]">
          {{ $t('finetune.detail.settings.regionTip1') }}
        </div>
        <div class="text-sm text-gray-600 font-light leading-[20px]">
          {{ $t('finetune.detail.settings.regionTip2') }}
        </div>
      </div>
      <div class="flex flex-col gap-[6px]">
        <p class="text-gray-700 text-sm">
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

    <!-- 空间云资源 -->
    <div class="flex xl:flex-col gap-[32px]">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-sm text-gray-700 leading-[20px] font-medium">
          {{ $t('finetune.detail.settings.resources') }}
        </div>
        <div class="text-sm text-gray-600 font-light leading-[20px]">
          {{ $t('finetune.detail.settings.resourcesTip1') }}
        </div>
        <div class="text-sm text-gray-600 font-light leading-[20px]">
          {{ $t('finetune.detail.settings.resourcesTip2') }}
        </div>
      </div>
      <div class="flex flex-col gap-[6px]">
        <p class="text-gray-700 text-sm">
          {{ $t('finetune.detail.settings.resourcesTip3') }}
        </p>
        <el-select
          v-model="currentResource"
          :placeholder="$t('all.select')"
          size="large"
          class="!w-[512px] sm:!w-full"
          disabled
        >
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
              :disabled="!item.is_available" />
          </el-option-group>
        </el-select>
      </div>
    </div>

    <el-divider />

    <!-- 删除 -->
    <div class="flex xl:flex-col gap-[32px]">
      <div class="w-[380px] sm:w-full flex flex-col gap-[6px]">
        <div class="text-sm text-gray-700 leading-[20px] font-medium">
          {{ $t('finetune.detail.settings.delete') }}
        </div>
        <div class="text-sm text-gray-600 font-light leading-[20px]">
          {{ $t('finetune.detail.settings.deleteTip1') }}
          <span class="text-black font-medium break-words">{{
            props.modelId
          }}</span>
          {{ $t('finetune.detail.settings.deleteTip2') }}
        </div>
        <div class="text-sm text-gray-600 leading-[20px]">
          {{ $t('all.enterPls') }}
          <span class="text-black font-medium break-words">
            {{ `${finetuneName}/${finetuneId}` }}
          </span>
          {{ $t('all.sureDel') }}
        </div>
      </div>
      <div class="flex flex-col gap-[8px]">
        <p class="text-gray-700 text-sm">
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
            class="text-gray-400 py-[8px] px-[12px] text-sm leading-[20px] rounded-md"
            :class="
              delDesc === `${finetuneName}/${finetuneId}`
                ? 'bg-error-600 text-white cursor-pointer active:shadow-box active:space-y-0 active:space-x-0 active:ring-4 active:ring-red-400 active:ring-opacity-25 active:bg-error-600 hover:text-white'
                : 'bg-gray-100'
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
  import { ref, computed, onMounted, watch } from 'vue'
  import { ElMessage } from 'element-plus'
  import useFetchApi from '@/packs/useFetchApi'
  import { useI18n } from 'vue-i18n'
  import { fetchResourcesInCategory } from '../shared/deploy_instance/fetchResourceInCategory'

  const props = defineProps({
    finetune: Object,
    finetuneId: Number,
    finetuneName: String,
    appStatus: String,
    modelId: String,
    framework: String,
  })

  const { t } = useI18n()
  const delDesc = ref('')
  const cloudResources = ref([])
  const currentFrameworkId = ref('')
  const cnName = ref('')
  const finetuneClusters = ref([])
  const frameworks = ref([])

const currentResource = computed(() => {
    return Number(props.finetune.sku)
  })

  const currentResourceDetail = computed(() => {
    return cloudResources.value.find((resource) => {
      return resource.id === currentResource.value
    })
  })

  const currentCid = computed(() => {
    return props.finetune.clusterId
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
    return ['NoAppFile', 'Running'].includes(props.appStatus)
  })

  const isStopped = computed(() => {
    return ['Stopped'].includes(props.appStatus)
  })

  watch(currentCid, (newVal) => {
    if (newVal) {
      fetchResources()
    }
  })

  const changeStatus = async (type) => {
    const { error } = await useFetchApi(
      `/models/${props.modelId}/finetune/${props.finetuneId}/${type}`
    ).put().json()
    if (error.value) {
      ElMessage({
        message: error.value.msg,
        type: 'warning'
      })
    } else {
      ElMessage({
        message: t('all.updateSuccess'),
        type: 'success'
      })
    }
  }

  const fetchClusters = async () => {
    const { data, error } = await useFetchApi('/cluster').json()
    if (error.value) {
      ElMessage({ message: error.value.msg, type: 'warning' })
    } else {
      const body = data.value
      finetuneClusters.value = body.data
    }
  }

  const fetchResources = async () => {
    // finetune can only use none cpu resources, so passing deploy type 2, means resoruces fit for finetune
    const categoryResources = await fetchResourcesInCategory(currentCid.value, 2)
    cloudResources.value = categoryResources
    fetchFrameworks()
  }

  const fetchFrameworks = async () => {
    const { data, error } = await useFetchApi(
      `/models/${props.modelId}/runtime_framework?deploy_type=2`
    ).json()
    if (error.value) {
      ElMessage.warning(error.value.msg)
    } else {
      const body = data.value
      frameworks.value = body.data || []
      const currentFramework = body.data?.find((framework) => {
        return framework.frame_name.toLowerCase() === props.framework.toLowerCase() && framework.compute_type === currentResourceDetail.value?.type
      })
      currentFrameworkId.value = currentFramework?.id || ''
    }
  }

  const deleteFinetune = async () => {
    const options = {
      headers: { 'Content-Type': 'application/json' }
    }
    const { error } = await useFetchApi(
      `/models/${props.modelId}/finetune/${props.finetuneId}`,
      options
    ).delete().json()
    if (error.value) {
      ElMessage({
        message: error.value.msg,
        type: 'warning'
      })
    } else {
      ElMessage({ message: t('all.delSuccess'), type: 'success' })
      setTimeout(() => {
        window.location.href = '/resource-console'
      }, 500)
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
    fetchClusters()
    if (currentCid.value) {
      fetchResources()
    }
  })
</script>
