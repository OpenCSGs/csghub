<template>
  <div class="w-[640px] m-auto flex flex-col items-center md:w-full md:p-5">
    <div>
      <SvgIcon
        name="endpoint"
        width="36"
        height="36"
      />
    </div>
    <h3 class="text-gray-700 text-xl font-medium mt-6 mb-3">
      {{ t('endpoints.new.title') }}
    </h3>
    <div class="flex items-end sm:flex-col sm:items-center sm:text-center">
      <p class="text-gray-500 text-md font-regular">
        {{ t('endpoints.new.desc') }}
      </p>
      <CsgButton
        :name="t('endpoints.new.guide')"
        class="btn-link-color"
        @click="handleGuideClick"
      />
      <Vue3Lottie
        :animationData="animationData"
        :width="36"
        :height="36"
        :loop="1"
        :autoPlay="true"
        style="display: inline-block"
      />
    </div>
    <div class="mt-9">
      <el-form
        ref="dataFormRef"
        :model="dataForm"
        :rules="rules"
        :validate-on-rule-change="false"
        class="w-full flex flex-col gap-4"
        label-position="top"
      >
        <div class="w-full flex md:flex-col gap-4 items-start">
          <el-form-item
            class="w-full"
            :label="t('endpoints.new.name')"
            prop="name"
          >
            <el-input
              v-model="dataForm.name"
              :placeholder="
                t('all.pleaseInput', { value: t('endpoints.new.name') })
              "
              input-style="width: 100%"
            >
              <template #suffix>
                <el-tooltip
                  class="item"
                  effect="dark"
                  raw-content
                  :content="`
                  <p>${t('endpoints.new.tip')}</p>
                  <ul style='margin-left: 18px; list-style: disc; margin-top: 12px;'>
                    <li>${t('rule.lengthLimit', { min: 2, max: 64 })}</li>
                    <li>${t('rule.startWithLetter')}</li>
                    <li>${t('rule.endWithLetterOrNumber')}</li>
                    <li>${t('rule.onlyLetterNumberAndSpecialStr')}</li>
                    <li>${t('rule.specialStrNotTogether')}</li>
                  </ul>
                  `"
                  placement="top"
                >
                  <el-icon><Warning /></el-icon>
                </el-tooltip>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item
            :label="t('endpoints.new.modelId')"
            class="w-full"
            prop="model_id"
          >
            <el-autocomplete
              clearable
              v-model="dataForm.model_id"
              :fetch-suggestions="fetchModels"
              :placeholder="
                t('all.pleaseInput', { value: t('endpoints.new.modelId') })
              "
              @select="loadRequiredData"
            />
          </el-form-item>
        </div>
        <div class="w-full flex md:flex-col gap-4 items-start">
          <el-form-item
            :label="t('endpoints.new.minReplica')"
            class="w-full"
            prop="min_replica"
          >
            <el-select
              v-model="dataForm.min_replica"
              :placeholder="
                t('all.pleaseSelect', { value: t('endpoints.new.minReplica') })
              "
              size="large"
              style="width: 100%"
            >
              <el-option
                v-for="item in minReplicaRanges"
                :disabled="item > dataForm.max_replica"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
            <p
              v-if="dataForm.min_replica === 0"
              class="text-gray-600 font-light mt-2"
            >
              {{ t('endpoints.new.autoShutdownTip') }}
            </p>
          </el-form-item>

          <el-form-item
            :label="t('endpoints.new.maxReplica')"
            class="w-full"
            prop="max_replica"
          >
            <el-select
              v-model="dataForm.max_replica"
              :placeholder="
                t('all.pleaseSelect', { value: t('endpoints.new.maxReplica') })
              "
              size="large"
              style="width: 100%"
            >
              <el-option
                v-for="item in replicaRanges"
                :disabled="item < dataForm.min_replica"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
        </div>

        <el-form-item
          :label="t('endpoints.new.cluster')"
          class="w-full"
          prop="endpoint_cluster"
        >
          <div class="w-full flex flex-row sm:flex-col items-start sm:items-start justify-start gap-4 sm:gap-4 mb-8">
            <el-select
              v-model="dataForm.endpoint_cluster"
              :placeholder="
                t('all.pleaseSelect', { value: t('endpoints.new.cluster') })
              "
              size="large"
              style="width: 100%"
              @change="fetchResources"
            >
              <el-option
                v-for="item in endpointClusters"
                :key="item.cluster_id"
                :label="item.region"
                :value="item.cluster_id"
              />
            </el-select>
            <div v-if="Array.isArray(typeList)&&typeList.length>0" class="w-full sm:w-auto flex items-center justify-start gap-1 flex-wrap">
              <p v-for="item in typeList" :key="item" class="px-3 py-2 cursor-pointer text-md font-medium rounded-sm" :class="activeType==item?'bg-gray-50 text-gray-700':'bg-white text-gray-500'" @click="setActiveType(item)">{{item}}</p>
            </div>
          </div>
          <div class="w-full grid grid-cols-3 items-center gap-6 mb-6 md:grid-cols-2 sm:grid-cols-1">
            <div v-for="item in selResourceList" :key="item.id" class="group flex flex-col items-center gap-2 text-center p-4 rounded-2xl border bg-white relative overflow-hidden" :class="[item.is_available ? 'cursor-pointer' : 'cursor-not-allowed', getCardBorderClass(item)]" @click="changeCloudResource(item)">
              <i class="block w-6 h-1 rounded-xs shadow-sm" :class="getIndicatorClass(item)"/>
              <div v-if="isResourceInsufficient(item)" class="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div class="opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 ease-out text-sm text-warning-700 px-2.5 py-0.5 bg-warning-50 border border-warning-700 rounded-xl">
                  {{ t('endpoints.lowMemory') }}
                </div>
              </div>
              <p class="text-md font-medium" :class="item.is_available?'text-gray-700':'text-gray-500'">{{item.resources[activeType.toLowerCase()]?.type}}</p>
              <p class="text-md font-normal leading-5 min-h-[2lh] line-clamp-2 break-words" :class="item.is_available?'text-gray-700':'text-gray-500'">{{item.name}}</p>
              <p class="text-gray-500 text-md">{{item.priceValue}}</p>
            </div>
          </div>
          <p
            v-if="minGpuMemory"
            class="text-gray-600 font-light w-full"
          >
            {{ t('endpoints.gpuMemoryRecommendation') }}{{ minGpuMemory }}GB
          </p>
          <p class="text-gray-600 font-light">
            {{ t('endpoints.new.resourceTip1') }}
          </p>
          <p class="text-gray-600 font-light">
            {{ t('endpoints.new.resourceTip2') }}
          </p>
        </el-form-item>

        

        <!-- runtime framework -->
        <el-form-item
          class="w-full"
          prop="endpoint_framework"
        >
          <template #label>
            <div class="flex gap-2 items-center">
              <span>{{ $t('endpoints.new.framework') }}</span>
              <el-tooltip class="item" effect="dark" :content="t('endpoints.new.frameworkInputTip')" placement="top">
                <SvgIcon name="input_tip" width="16" height="16" />
              </el-tooltip>
            </div>
          </template>

          <el-select
            v-model="frameworkVersion"
            @change="resetVersions"
            :placeholder="
              t('all.pleaseSelect', { value: t('endpoints.new.framework') })
            "
            size="large"
            style="width: 100%"
          >
            <el-option
              v-for="(item ,index) in filterFrameworks"
              :key="item.id"
              :label="`${item.frame_name} (${item.compute_types.join(',')})`"
              :value="index"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          :label="t('endpoints.new.frameworkVersion')"
          class="w-full"
        >
          <el-select
            v-model="dataForm.endpoint_framework"
            @change="setCurrentEngineArgs"
            :placeholder="
              t('all.pleaseSelect', { value: t('endpoints.new.frameworkVersion') })
            "
            size="large"
            style="width: 100%"
          >
            <el-option
              v-for="item in frameworkVersionOptions"
              :key="item.id"
              :label='`${item.frame_name} ${item.driver_version}`'
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <EngineArgs
          v-if="Object.keys(currentEngineArgs).length > 0"
          :engineArgs="currentEngineArgs"
          @update:changedArgs="updateChangedEngineArgs"
        /> 

        <!-- quantization -->
        <el-form-item
          v-if="availableQuantizations.length > 0"
          :label="t('endpoints.new.quantization')"
          class="w-full"
          prop="quantization"
        >
          <el-select
            v-model="dataForm.quantization"
            :placeholder="
              t('all.pleaseSelect', { value: t('endpoints.new.quantization') })
            "
            size="large"
            style="width: 100%"
          >
            <el-option
              v-for="item in availableQuantizations"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item class="w-full">
          <PublicAndPrivateRadioGroup
            v-model="dataForm.visibility"
            :publicDesc="t('endpoints.new.publicDesc')"
            :privateDesc="t('endpoints.new.privateDesc')"
          />
        </el-form-item>

        <div class="flex justify-end">
          <el-form-item>
            <CsgButton
              :loading="loading"
              class="btn btn-primary btn-md"
              :name="t('endpoints.new.createEndpoint')"
              @click="handleSubmit"
            />
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted, inject, computed, watch } from 'vue'
  import { ElInput, ElMessage } from 'element-plus'
  import useFetchApi from '../../packs/useFetchApi'
  import { useI18n } from 'vue-i18n'
  import PublicAndPrivateRadioGroup from '../shared/form/PublicAndPrivateRadioGroup.vue'
  import EngineArgs from './EngineArgs.vue'
  import { fetchResourcesInType } from '../shared/deploy_instance/fetchResourceInCategory'
  import { Vue3Lottie } from 'vue3-lottie'
  import lightAnimation from '../../assets/animations/light.json'

  const props = defineProps({
    namespace: String
  })

  const searchParams = new URLSearchParams(window.location.search)

  const frameworkVersion = ref('')
  const frameworkVersionOptions = ref([])

  const { t } = useI18n()
  const nameRule = inject('nameRule')
  const dataFormRef = ref(null)
  const dataForm = ref({
    model_id: searchParams.get('model_id') || '',
    visibility: 'public',
    min_replica: 0,
    max_replica: 1
  })
  const endpointFrameworks = ref([])
  const endpointClusters = ref([])
  const endpointResources = ref([])
  const loading = ref(false)
  const availableQuantizations = ref([])
  const currentEngineArgs = ref({})
  const changedEngineArgs = ref({})
  const minGpuMemory = ref(0)
  const apiErrorMsg = ref('')
  const animationData = ref(lightAnimation)
  const lottieRef = ref(null)
  const isPlaying = ref(false)
  const typeList = ref([])
  const activeType = ref('')
  const selResourceList = ref([])

  const minReplicaRanges = [0, 1, 2, 3, 4, 5]
  const replicaRanges = [1, 2, 3, 4, 5]

  const rules = ref({
    name: [
      {
        required: true,
        message: t('all.pleaseInput', { value: t('endpoints.new.name') }),
        trigger: 'change'
      },
      // limit 2-64 length
      {
        min: 2,
        max: 64,
        message: t('rule.lengthLimit', { min: 2, max: 64 }),
        trigger: 'blur'
      },
      // 以字母开头
      {
        pattern: /^[a-zA-Z]/,
        message: t('rule.startWithLetter'),
        trigger: 'blur'
      },
      // 以数字或字母结尾
      {
        pattern: /[a-zA-Z0-9]$/,
        message: t('rule.endWithLetterOrNumber'),
        trigger: 'blur'
      },
      // 只能包含字母、数字与-_.
      {
        pattern: /^[a-zA-Z0-9-_\.]+$/,
        message: t('rule.onlyLetterNumberAndSpecialStr'),
        trigger: 'blur'
      },
      // 特殊字符不能并列出现
      {
        pattern: /^(?!.*[-_.]{2,}).*$/,
        message: t('rule.specialStrNotTogether'),
        trigger: 'blur'
      },
      // 保险起见最后一步还是加上最终的正则吧
      { pattern: nameRule, message: t('rule.nameRule'), trigger: 'blur' }
    ],
    model_id: [
      {
        required: true,
        message: t('all.pleaseInput', { value: t('endpoints.new.modelId') }),
        trigger: 'change'
      },
      // Make sure to include a / in the string, but not at the beginning or end
      {
        pattern: /^(?!\/)[a-zA-Z0-9-_\.]+\/[a-zA-Z0-9-_\.]+(?<!\/)$/,
        message: t('all.inputFormatError'),
        trigger: 'blur'
      }
    ],
    min_replica: [
      {
        required: true,
        message: t('all.pleaseSelect', {
          value: t('endpoints.new.minReplica')
        }),
        trigger: 'change'
      }
    ],
    max_replica: [
      {
        required: true,
        message: t('all.pleaseSelect', {
          value: t('endpoints.new.maxReplica')
        }),
        trigger: 'change'
      }
    ],
    endpoint_framework: [
      {
        required: true,
        message: t('all.pleaseSelect', {
          value: t('endpoints.new.framework')
        }),
        trigger: 'change'
      }
    ],
    quantization: [
      {
        required: false,
        message: t('all.pleaseSelect', {
          value: t('endpoints.new.quantization')
        }),
        trigger: 'blur'
      }
    ]
  })

  const fetchResources = async () => {
    const categoryResources = await fetchResourcesInType(dataForm.value.endpoint_cluster)
    const firstAvailableResource = categoryResources.flatMap(item => item.options).find((item) => item.is_available)
    endpointResources.value = categoryResources
    typeList.value = categoryResources.map(item=>item.label)
    activeType.value = typeList.value[0]||''
    selResourceList.value = endpointResources.value.find(item=>item.label == activeType.value)?.options||[]
    if (firstAvailableResource) {
      dataForm.value.cloud_resource = `${firstAvailableResource.id}/${firstAvailableResource.order_detail_id}`
      resetCurrentRuntimeFramework()
    } else {
      dataForm.value.cloud_resource = ''
      dataForm.value.endpoint_framework = ''
    }
  }

  const fetchClusters = async () => {
    const { data, error } = await useFetchApi('/cluster').json()
    if (error.value) {
      ElMessage({ message: error.value.msg, type: 'warning' })
    } else {
      const body = data.value
      dataForm.value.endpoint_cluster = body.data[0]?.cluster_id || ''
      endpointClusters.value = body.data
      fetchResources()
    }
  }

  const setActiveType = (type)=>{
    activeType.value = type
    selResourceList.value = endpointResources.value.find(item=>item.label == activeType.value)?.options||[]
  }

  const fetchModels = async (query, cb) => {
    const { data, error } = await useFetchApi(
      `/runtime_framework/models?search=${query}&deploy_type=1`
    ).json()
    if (error.value) {
      ElMessage({ message: error.value.msg, type: 'warning' })
    } else {
      const body = data.value
      const paths = body.data?.map((model) => {
        return { key: model.path, value: model.path }
      })
      cb(paths)
    }
  }

  const loadRequiredData = () => {
    fetchRuntimeFramework()
    fetchQuantizations()
  }

  const changeCloudResource = (item)=>{
    if (!item?.is_available) return
    dataForm.value.cloud_resource = `${item.id}/${item.order_detail_id}`
    resetCurrentRuntimeFramework()
  }

  const resetCurrentRuntimeFramework = async () => {
    // if we have current runtime framework
    if (frameworkVersionOptions.value.includes(Number(dataForm.value.endpoint_framework))) {
      return
    } else {
      dataForm.value.endpoint_framework = frameworkVersionOptions.value[0]?.id || ''
    }
  }

  const fetchRuntimeFramework = async () => {
    if (!dataForm.value.model_id) return
    
    try {
      const response = await useFetchApi(
        `/models/${dataForm.value.model_id}/runtime_framework_v2?deploy_type=1`
      ).json()
      
      if (!response) {
        console.error('Invalid API response')
      }

      const { data, error } = response
      
      if (error?.value) {
        frameworkVersionOptions.value = []
        dataForm.value.endpoint_framework = ''
        endpointFrameworks.value = []
      } else {
        const body = data?.value || {}
        endpointFrameworks.value = body.data || []
        
        if(endpointFrameworks.value.length > 0) {
          frameworkVersionOptions.value = endpointFrameworks.value[0].versions || []
          dataForm.value.endpoint_framework = frameworkVersionOptions.value[0]?.id || ''
        } else {
          frameworkVersionOptions.value = []
          dataForm.value.endpoint_framework = ''
        }
        setCurrentEngineArgs(dataForm.value.endpoint_framework)
      }
    } catch (err) {
      console.error('获取运行时框架失败:', err)
      frameworkVersionOptions.value = []
      dataForm.value.endpoint_framework = ''
      endpointFrameworks.value = []
    }
  }

  const resetVersions = () => { 
    const currentResource = endpointResources.value
        .flatMap((category) => category.options)
        .find((item) => item.id == dataForm.value.cloud_resource.split('/')[0])

    frameworkVersionOptions.value = filterFrameworks.value[frameworkVersion.value].versions.filter((version) => version.compute_type == currentResource.type) || []
    dataForm.value.endpoint_framework = frameworkVersionOptions.value[0]?.id || ''
    setCurrentEngineArgs(dataForm.value.endpoint_framework)
  }

  watch(() => dataForm.value.cloud_resource, (newValue) => {
    if (newValue && endpointFrameworks.value.length > 0) {
      if (filterFrameworks.value.length > 0) {
        frameworkVersionOptions.value = filterFrameworks.value[0].versions
        dataForm.value.endpoint_framework = frameworkVersionOptions.value[0]?.id || ''
        setCurrentEngineArgs(dataForm.value.endpoint_framework)
      } else {
        dataForm.value.endpoint_framework = ''
        currentEngineArgs.value = {}
      }
    }
  })


  const filterFrameworks = computed(() => {
    if (!dataForm.value.cloud_resource) return []

    const currentResource = endpointResources.value
      .flatMap((category) => category.options)
      .find((item) => item.id == dataForm.value.cloud_resource.split('/')[0])

    if (!currentResource) return []
    if (!endpointFrameworks.value) return []

    return endpointFrameworks.value.filter((framework) => framework.compute_types.includes(currentResource.type))
  })

  watch(() => filterFrameworks.value, (newValue) => {
    if (newValue) {
      if (filterFrameworks.value.length > 0) {
        frameworkVersion.value = 0
        const currentResource = endpointResources.value
        .flatMap((category) => category.options)
        .find((item) => item.id == dataForm.value.cloud_resource.split('/')[0])

        frameworkVersionOptions.value = filterFrameworks.value[0].versions.filter((version) => version.compute_type == currentResource.type) || []
        dataForm.value.endpoint_framework = frameworkVersionOptions.value[0]?.id || ''
        setCurrentEngineArgs(dataForm.value.endpoint_framework)
      } else {
        frameworkVersion.value = ''
        frameworkVersionOptions.value = []
        dataForm.value.endpoint_framework = ''
        currentEngineArgs.value = {}
      }
    }
  })

  const updateChangedEngineArgs = (changes) => {
    changedEngineArgs.value = changes
  }

  const setCurrentEngineArgs = (frameworkId) => {
    if (!frameworkVersionOptions.value.length > 0) return
    const currentFramework = frameworkVersionOptions.value.find(
      (framework) => framework.id === frameworkId
    )
    const engineArgs = JSON.parse(currentFramework.engine_args || '[]')
    currentEngineArgs.value = engineArgs.reduce((obj, item) => {
      obj[item.name] = item.value
      return obj
    }, {})
    changedEngineArgs.value = {}
  }

  const handleSubmit = () => {
    loading.value = true
    dataFormRef.value
      .validate(async (valid) => {
        if (valid) {
          await createEndpoint()
        } else {
          return false
        }
      })
      .finally(() => {
        loading.value = false
      })
  }

  const createEndpoint = async () => {
    const params = {
      deploy_name: dataForm.value.name,
      hardware: dataForm.value.cloud_resource,
      resource_id: Number(dataForm.value.cloud_resource.split('/')[0]),
      min_replica: dataForm.value.min_replica,
      max_replica: dataForm.value.max_replica,
      runtime_framework_id: dataForm.value.endpoint_framework,
      secure_level: dataForm.value.visibility === 'public' ? 1 : 2,
      cluster_id: dataForm.value.endpoint_cluster,
      order_detail_id: Number(dataForm.value.cloud_resource.split('/')[1])
    }

    if (availableQuantizations.value.length > 0) {
      params.entrypoint = dataForm.value.quantization
    }

    if (Object.keys(changedEngineArgs.value).length > 0) {
      params.engine_args = JSON.stringify(changedEngineArgs.value)
    }

    const options = {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    }
    const uploadEndpoint = `/models/${dataForm.value.model_id}/run`
    const { data, error } = await useFetchApi(uploadEndpoint, options)
      .post()
      .json()
    if (data.value) {
      ElMessage({
        message: t('endpoints.new.createSuccess'),
        type: 'success'
      })
      const res = data.value
      window.location.href = `/endpoints/${dataForm.value.model_id}/${res.data.deploy_id}`
    } else {
      ElMessage({
        message: t('endpoints.new.createFail') + `: ${error.value.msg}`,
        type: 'error'
      })
    }
  }

  const fetchQuantizations = async () => {
    const quantizationEndpoint = `/models/${dataForm.value.model_id}/quantizations`
    const { data, error } = await useFetchApi(quantizationEndpoint).json()
    if (error.value) {
      console.log(error.value.msg)
    } else if (data.value.data) {
      availableQuantizations.value = packQuantizations(data.value.data)
      rules.value.quantization[0].required = true
    }
  }

  const packQuantizations = (quantizations) => {
    return quantizations.map((item) => {
      return {
        label: getQuantizationLabel(item),
        value: item.path
      }
    })
  }

  const MEMORY_UNITS = {
    GB: 1024 ** 3,
    MB: 1024 ** 2
  }

  const formatMemory = (bytes) => {
    if (bytes >= MEMORY_UNITS.GB) {
      return `${Math.round(bytes/MEMORY_UNITS.GB)} GB`
    }
    return `${Math.max(1, Math.round(bytes/MEMORY_UNITS.MB))} MB`
  }

  const getQuantizationLabel = (item) => {
    return `${item.name} - ${t('endpoints.gpuMemoryRequired')}${formatMemory(item.size)}`
  }

  const handleGuideClick = () => {
    window.open('https://opencsg.com/docs/inferencefinetune/inference_intro', '_blank')
  }

  const playAnimation = () => {
    if (lottieRef.value) {
      lottieRef.value.goToAndStop(0, true) // 重置到第一帧
      lottieRef.value.play()
      isPlaying.value = true
    }
  }

  const pauseAnimation = () => {
    if (lottieRef.value) {
      lottieRef.value.pause()
      isPlaying.value = false
    }
  }

  const handleAnimationClick = () => {
    window.open('https://opencsg.com/docs/inferencefinetune/inference_intro', '_blank')
  }

  // indicator color logic for resource cards
  // - unavailable resource -> gray-400
  // - otherwise compare recommended minGpuMemory:
  //   small requirement -> brand-700; large requirement -> warning-700
  //   if backend provides more precise GPU memory per resource in item.resources, you can enhance here
  const getResourceGpuMemoryGB = (item) => {
    try {
      const spec = item?.resources?.[activeType.value?.toLowerCase?.()] || {}
      const candidates = [
        spec.gpu_memory_gb,
        spec.memory_gb,
        spec.vram_gb,
        spec.gpu_memory,
        spec.vram,
        spec.memory
      ]
      const val = candidates.find(v => v !== undefined && v !== null)
      if (typeof val === 'number') return val
      if (typeof val === 'string') {
        const m = val.match(/([\d.]+)/)
        return m ? Number(m[1]) : null
      }
      return null
    } catch (_) {
      return null
    }
  }

  const getIndicatorClass = (item) => {
    if (!item?.is_available) return 'bg-gray-400'
    const recommend = Number(minGpuMemory?.value || 0)
    const resourceMem = getResourceGpuMemoryGB(item)
    if (recommend && resourceMem) {
      return recommend > resourceMem ? 'bg-warning-700' : 'bg-brand-700'
    }
    if (!recommend || recommend <= 8) return 'bg-brand-700'
    return 'bg-warning-700'
  }

  const isResourceInsufficient = (item) => {
    const recommend = Number(minGpuMemory?.value || 0)
    if (!recommend || recommend <= 0) return false
    const resourceMem = getResourceGpuMemoryGB(item)
    if (recommend && resourceMem) {
      return recommend > resourceMem
    }
    // fallback: 当缺少资源显存字段时，按阈值 8GB 判断
    return recommend > 8
  }

  const getCardBorderClass = (item) => {
    if (!item?.is_available) return 'border-gray-300'
    const insuff = isResourceInsufficient(item)
    const isSelected = dataForm.value.cloud_resource == `${item.id}/${item.order_detail_id}`
    if (isSelected && insuff) return 'border border-[2px] border-warning-700'
    if (isSelected) return 'border border-[2px] border-brand-500'
    // 未选中时，无论是否显存不足，都走默认灰色（有资源默认灰-400）
    return 'border-gray-400'
  }

  onMounted(() => {
    fetchClusters()
    if (dataForm.value.model_id) {
      fetchRuntimeFramework()
      fetchQuantizations()
    }
  })
</script>

<style scoped>
  .fixCenter {
    top:50%;
    left:50%;
    transform:translate(-50%,-50%)
  }
  :deep(.el-input) {
    height: 40px;

    @media screen and (max-width: 768px) {
      width: 100%;
    }
  }

  :deep(.el-select) {
    width: 240px;
    height: 40px;

    @media screen and (max-width: 768px) {
      width: 100%;
    }
  }

  :deep(.el-input .el-input__wrapper) {
    border-radius: var(--border-radius-md);
  }
</style>
