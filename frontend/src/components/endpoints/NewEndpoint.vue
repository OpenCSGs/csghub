<template>
  <div class="w-[640px] m-auto flex flex-col items-center md:w-full md:p-5">
    <div>
      <SvgIcon
        name="endpoint"
        width="36"
        height="36" />
    </div>
    <h3 class="text-gray-700 text-xl font-medium mt-6 mb-3">
      {{ t('endpoints.new.title') }}
    </h3>
    <p class="text-gray-500 text-md font-regular md:text-center">
      {{ t('endpoints.new.desc') }}
    </p>
    <div class="mt-9">
      <el-form
        ref="dataFormRef"
        :model="dataForm"
        :rules="rules"
        :validate-on-rule-change="false"
        class="w-full flex flex-col gap-[14px]"
        label-position="top">
        <div class="w-full flex md:flex-col gap-[16px] items-center">
          <el-form-item
            class="w-full"
            :label="t('endpoints.new.name')"
            prop="name">
            <el-input
              v-model="dataForm.name"
              :placeholder="
                t('all.pleaseInput', { value: t('endpoints.new.name') })
              "
              input-style="width: 100%">
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
                  placement="top">
                  <el-icon><Warning /></el-icon>
                </el-tooltip>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item
            :label="t('endpoints.new.modelId')"
            class="w-full"
            prop="model_id">
            <el-autocomplete
              clearable
              v-model="dataForm.model_id"
              :fetch-suggestions="fetchModels"
              :placeholder="t('all.pleaseInput', { value: t('endpoints.new.modelId') })"
              @select="loadRequiredData"
            />
          </el-form-item>
        </div>
        <div class="w-full flex md:flex-col gap-[16px] items-center">
          <el-form-item
            :label="t('endpoints.new.minReplica')"
            class="w-full"
            prop="min_replica">
            <el-select
              v-model="dataForm.min_replica"
              :placeholder="
                t('all.pleaseSelect', { value: t('endpoints.new.minReplica') })
              "
              size="large"
              style="width: 100%">
              <el-option
                v-for="item in replicaRanges"
                :disabled="item > dataForm.max_replica"
                :key="item"
                :label="item"
                :value="item" />
            </el-select>
          </el-form-item>

          <el-form-item
            :label="t('endpoints.new.maxReplica')"
            class="w-full"
            prop="max_replica">
            <el-select
              v-model="dataForm.max_replica"
              :placeholder="
                t('all.pleaseSelect', { value: t('endpoints.new.maxReplica') })
              "
              size="large"
              style="width: 100%">
              <el-option
                v-for="item in replicaRanges"
                :disabled="item < dataForm.min_replica"
                :key="item"
                :label="item"
                :value="item" />
            </el-select>
          </el-form-item>
        </div>

        <el-form-item
          :label="t('endpoints.new.cluster')"
          class="w-full"
          prop="endpoint_cluster">
          <el-select
            v-model="dataForm.endpoint_cluster"
            :placeholder="
              t('all.pleaseSelect', { value: t('endpoints.new.cluster') })
            "
            size="large"
            style="width: 100%"
            @change="fetchResources">
            <el-option
              v-for="item in endpointClusters"
              :key="item.cluster_id"
              :label="item.region"
              :value="item.cluster_id" />
          </el-select>
        </el-form-item>

        <el-form-item
          :label="t('endpoints.new.resource')"
          class="w-full"
          prop="cloud_resource">
          <el-select
            v-model="dataForm.cloud_resource"
            :placeholder="
              t('all.pleaseSelect', { value: t('endpoints.new.resource') })
            "
            size="large"
            style="width: 100%">
            <el-option
              v-for="item in endpointResources"
              :key="item.name"
              :label="item.name"
              :value="item.id"
              :disabled="!item.is_available" />
          </el-select>
          <p class="text-gray-600 mt-2 font-light">
            {{ t('endpoints.new.resourceTip1') }}
          </p>
          <p class="text-gray-600 font-light">
            {{ t('endpoints.new.resourceTip2') }}
          </p>
        </el-form-item>

        <!-- runtime framework -->
        <el-form-item
          :label="t('endpoints.new.framework')"
          class="w-full"
          prop="endpoint_framework">
          <el-select
            v-model="dataForm.endpoint_framework"
            :placeholder="
              t('all.pleaseSelect', { value: t('endpoints.new.framework') })
            "
            size="large"
            style="width: 100%">
            <el-option
              v-for="item in filterFrameworks"
              :key="item.id"
              :label="item.frame_name"
              :value="item.id" />
          </el-select>
        </el-form-item>

        <!-- quantization -->
        <el-form-item
          v-if="availableQuantizations.length > 0"
          :label="t('endpoints.new.quantization')"
          class="w-full"
          prop="quantization">
          <el-select
            v-model="dataForm.quantization"
            :placeholder="
              t('all.pleaseSelect', { value: t('endpoints.new.quantization') })
            "
            size="large"
            style="width: 100%">
            <el-option
              v-for="item in availableQuantizations"
              :key="item.path"
              :label="item.path"
              :value="item.path" />
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
  import { ref, onMounted, inject, computed } from 'vue'
  import { ElInput, ElMessage } from 'element-plus'
  import useFetchApi from '../../packs/useFetchApi'
  import { useI18n } from 'vue-i18n'
  import PublicAndPrivateRadioGroup from '../shared/form/PublicAndPrivateRadioGroup.vue'

  const props = defineProps({
    namespace: String
  })

  const searchParams = new URLSearchParams(window.location.search)

  const { t } = useI18n()
  const nameRule = inject('nameRule')
  const dataFormRef = ref(null)
  const dataForm = ref({
    model_id: searchParams.get('model_id') || '',
    visibility: 'public',
    min_replica: 1,
    max_replica: 1
  })
  const endpointFrameworks = ref([])
  const endpointClusters = ref([])
  const endpointResources = ref([])
  const loading = ref(false)
  const availableQuantizations = ref([])

  const replicaRanges = [1, 2, 3, 4, 5]

  const rules = ref({
    name: [
      {
        required: true,
        message: t('all.pleaseInput', { value: t('endpoints.new.name') }),
        trigger: 'blur'
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
        trigger: 'blur'
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
    const { data, error } = await useFetchApi(
      `/space_resources?cluster_id=${dataForm.value.endpoint_cluster}`
    ).json()
    if (error.value) {
      ElMessage({ message: error.value.msg, type: 'warning' })
    } else {
      const body = data.value
      const firstAvailableResource = body.data?.find(
        (resource) => resource.is_available
      )
      dataForm.value.cloud_resource = firstAvailableResource?.id || ''
      endpointResources.value = body.data
      if (!dataForm.value.cloud_resource) {
        dataForm.value.endpoint_framework = ''
      } else {
        updateRuntimeFramework()
      }
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
    updateRuntimeFramework()
    fetchQuantizations()
  }

  const updateRuntimeFramework = async () => {
    if (!dataForm.value.model_id) return
    const { data, error } = await useFetchApi(
      `/models/${dataForm.value.model_id}/runtime_framework?deploy_type=1`
    ).json()
    if (error.value) {
      dataForm.value.endpoint_framework = ''
      endpointFrameworks.value = []
    } else {
      const body = data.value
      endpointFrameworks.value = body.data
      dataForm.value.endpoint_framework = filterFrameworks.value[0]?.id || ''
    }
  }

  const filterFrameworks = computed(() => {
    if (!dataForm.value.cloud_resource) return []

    const currentResource = endpointResources.value.find(
      (resource) => resource.id == dataForm.value.cloud_resource
    )

    if (!currentResource) return []

    return endpointFrameworks.value.filter((framework) => {
      if (currentResource.type === 'npu') {
        return !!framework.frame_npu_image
      } else if (currentResource.type === 'gpu') {
        return !!framework.frame_image
      } else {
        return !!framework.frame_cpu_image
      }
    })
  })

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
      resource_id: dataForm.value.cloud_resource,
      min_replica: dataForm.value.min_replica,
      max_replica: dataForm.value.max_replica,
      runtime_framework_id: dataForm.value.endpoint_framework,
      secure_level: dataForm.value.visibility === 'public' ? 1: 2,
      cluster_id: dataForm.value.endpoint_cluster
    }

    if (availableQuantizations.value.length > 0) {
      params.entrypoint = dataForm.value.quantization
    }

    const options = {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    }
    const uploadEndpoint = `/models/${dataForm.value.model_id}/run`
    const { data, error } = await useFetchApi(uploadEndpoint, options).post().json()
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
    if (data.value.data) {
      availableQuantizations.value = data.value.data
      rules.value.quantization[0].required = true
    } else {
      console.log(error.value.msg)
    }
  }

  onMounted(() => {
    fetchClusters()
    if (dataForm.value.model_id) {
      fetchQuantizations()
    }
  })
</script>

<style scoped>
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