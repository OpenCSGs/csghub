<template>
  <div class="w-[640px] m-auto flex flex-col items-center md:w-full md:p-5">
    <div>
      <SvgIcon
        name="finetune_create"
        width="36"
        height="36" />
    </div>
    <h3 class="text-gray-700 text-xl font-semibold mt-6 mb-3">
      {{ t('finetune.new.title') }}
    </h3>
    <p class="text-[#606266] text-base font-medium md:text-center">
      {{ t('finetune.new.desc') }}
    </p>
    <div class="mt-9 w-full">
      <el-form
        ref="dataFormRef"
        :model="dataForm"
        :rules="rules"
        class="w-full flex flex-col gap-[14px]"
        label-position="top">
        <div class="w-full flex md:flex-col gap-[16px] items-center">
          <el-form-item
            class="w-full"
            :label="t('finetune.new.name')"
            prop="deploy_name">
            <el-input
              v-model="dataForm.deploy_name"
              :placeholder="
                t('all.pleaseInput', { value: t('finetune.new.name') })
              "
              input-style="width: 100%">
              <template #suffix>
                <el-tooltip
                  class="item"
                  effect="dark"
                  raw-content
                  :content="`
                  <p>${t('finetune.new.tip')}</p>
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
            :label="t('finetune.new.modelId')"
            class="w-full"
            prop="model_id">
            <el-autocomplete
              clearable
              v-model="dataForm.model_id"
              :fetch-suggestions="fetchModels"
              :placeholder="t('all.pleaseInput', { value: t('finetune.new.modelId') })"
              @select="updateRuntimeFramework"
            />
          </el-form-item>
        </div>

        <el-form-item
          :label="t('finetune.new.cluster')"
          class="w-full"
          prop="cluster_id">
          <el-select
            v-model="dataForm.cluster_id"
            :placeholder="
              t('all.pleaseSelect', { value: t('finetune.new.cluster') })
            "
            size="large"
            style="width: 100%"
            @change="fetchResources">
            <el-option
              v-for="item in finetuneClusters"
              :key="item.cluster_id"
              :label="item.region"
              :value="item.cluster_id" />
          </el-select>
          <div class="flex flex-col">
            <p class="text-gray-600] mt-2 font-light">
              {{ $t('finetune.new.clusterDec1') }}
            </p>
            <p class="text-gray-600] font-light">
              {{ $t('finetune.new.clusterDec2') }}
            </p>
          </div>
        </el-form-item>

        <el-form-item
          :label="t('finetune.new.resource')"
          class="w-full"
          prop="resource_id">
          <el-select
            v-model="dataForm.resource_id"
            :placeholder="
              t('all.pleaseSelect', { value: t('finetune.new.resource') })
            "
            size="large"
            style="width: 100%">
            <el-option
              v-for="item in finetuneResources"
              :key="item.name"
              :label="item.name"
              :value="item.id"
              :disabled="!item.is_available" />
          </el-select>
          <div class="flex flex-col">
            <p class="text-gray-600] mt-2 font-light">
              {{ t('finetune.new.resourceDec1') }}
            </p>
            <p class="text-gray-600] font-light">
              {{ t('finetune.new.resourceDec2') }}
            </p>
          </div>
        </el-form-item>

        <el-form-item
          :label="t('finetune.new.framework')"
          class="w-full"
          prop="runtime_framework_id">
          <el-select
            v-model="dataForm.runtime_framework_id"
            :placeholder="
              t('all.pleaseSelect', { value: t('finetune.new.framework') })
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

        <div class="flex justify-end">
          <el-form-item>
            <el-button
              :loading="loading"
              class="!text-center !h-9 !text-[16px] !text-white !bg-brand-600] !rounded-[8px] !border-[1px] !border-brand-600]"
              @click="handleSubmit">
              {{ t('finetune.new.createFinetune') }}
            </el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted, inject, computed } from 'vue'
  import { ElMessage } from 'element-plus'
  import useFetchApi from '../../packs/useFetchApi'
  import { useI18n } from 'vue-i18n'

  const props = defineProps({
    namespace: String
  })

  const searchParams = new URLSearchParams(window.location.search)


  const dataFormRef = ref(null)
  const dataForm = ref({
    'model_id': searchParams.get('model_id') || '',
    'cluster_id': '',
    'deploy_name': '',
    'resource_id': '',
    'runtime_framework_id': '',
    'secure_level': 2,
  })

  const { t } = useI18n()
  const nameRule = inject('nameRule')

  const finetuneResources = ref([])
  const finetuneFrameworks = ref([])
  const finetuneClusters = ref([])
  const loading = ref(false)

  const rules = ref({
    deploy_name: [
      {
        required: true,
        message: t('all.pleaseInput', { value: t('finetune.new.name') }),
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
        message: t('all.pleaseInput', { value: t('finetune.new.modelId') }),
        trigger: 'blur'
      }
    ],
  })

  const fetchResources = async () => {
    const { data, error } = await useFetchApi(
      `/space_resources?cluster_id=${dataForm.value.cluster_id}&deploy_type=2`
    ).json()
    if (error.value) {
      ElMessage({ message: error.value.msg, type: 'warning' })
    } else {
      const body = data.value
      const allGPUResources = body.data
      const firstAvailableResource = allGPUResources.find((item) => item.is_available)
      dataForm.value.resource_id = firstAvailableResource?.id || ''
      finetuneResources.value = allGPUResources
      if (!dataForm.value.resource_id) {
        dataForm.value.runtime_framework_id = ''
      } else {
        updateRuntimeFramework()
      }
    }
  }

  const updateRuntimeFramework = async () => {
    if (!dataForm.value.model_id) return
    const { data, error } = await useFetchApi(
      `/models/${dataForm.value.model_id}/runtime_framework?deploy_type=2`
    ).json()
    if (error.value) {
      dataForm.value.runtime_framework_id = ''
      finetuneFrameworks.value = []
    } else {
      const body = data.value
      finetuneFrameworks.value = body.data
      dataForm.value.runtime_framework_id = filterFrameworks.value[0]?.id || ''
    }
  }

  const filterFrameworks = computed(() => {
    if (!dataForm.value.resource_id) return []

    const currentResource = finetuneResources.value.find(
      (resource) => resource.id == dataForm.value.resource_id
    )

    if (!currentResource) return []

    return finetuneFrameworks.value.filter((framework) => {
      if (currentResource.type === 'npu') {
        return !!framework.frame_npu_image
      } else if (currentResource.type === 'gpu') {
        return !!framework.frame_image
      } else {
        return !!framework.frame_cpu_image
      }
    })
  })

  const fetchClusters = async () => {
    const { data, error } = await useFetchApi('/cluster').json()
    if (error.value) {
      ElMessage({ message: error.value.msg, type: 'warning' })
    } else {
      const body = data.value
      dataForm.value.cluster_id = body.data[0]?.cluster_id || ''
      finetuneClusters.value = body.data
      fetchResources()
    }
  }

  const fetchModels = async (query, cb) => {
    const { data, error } = await useFetchApi(`/runtime_framework/models?search=${query}&deploy_type=2`).json()
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

  const handleSubmit = () => {
    loading.value = true
    dataFormRef.value
      .validate(async (valid) => {
        if (valid) {
          await submitFinetuneForm()
        } else {
          return false
        }
      })
      .finally(() => {
        loading.value = false
      })
  }

  const submitFinetuneForm = async () => {
    const options = {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataForm.value)
    }
    const { data, error } = await useFetchApi(
      `/models/${dataForm.value.model_id}/finetune?current_user=${
        dataForm.value.model_id ? dataForm.value.model_id.split('/')[0] : ''
      }`,
      options
    ).post().json()
    if (error.value) {
      ElMessage({ message: error.value.msg, type: 'warning' })
    } else {
      const body = data.value
      if (body.data && body.data.deploy_id) {
        window.location.pathname = `/finetune/${dataForm.value.model_id}/${dataForm.value.deploy_name}/${body.data.deploy_id}`
      }
    }
  }

  onMounted(() => {
    fetchClusters()
  })
</script>

<style scoped>
  :deep(.el-input) {
    height: 40px;

    @media screen and (max-width: 768px) {
      width: 100%;
    }
  }

  :deep(.el-radio__input) {
    margin-top: 4px;
  }

  :deep(.el-radio__label) {
    color: #344054 !important;
    font-weight: 400;
  }

  :deep(.el-radio.is-bordered.is-checked) {
    border: 2px solid #3250bd;
  }

  :deep(.el-radio__input.is-checked .el-radio__inner) {
    background: #3250bd;
    border-color: #3250bd;
  }

  :deep(.el-select) {
    width: 240px;
    height: 40px;

    @media screen and (max-width: 768px) {
      width: 100%;
    }
  }

  :deep(.el-input .el-input__wrapper) {
    border-radius: 8px;
  }
</style>