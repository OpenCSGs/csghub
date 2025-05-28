<template>
  <div class="w-[640px] m-auto flex flex-col items-center md:w-full md:p-5">
    <div>
      <SvgIcon
        name="evaluation"
        width="32"
        height="32"
      />
    </div>
    <h3 class="text-gray-700 text-xl font-semibold mt-6 mb-3">
      {{ t('evaluation.new.title') }}
    </h3>
    <p class="text-gray-500 text-base font-medium md:text-center">
      {{ t('evaluation.new.desc') }}
    </p>
    <div class="w-full mt-9">
      <el-form
        ref="dataFormRef"
        :model="dataForm"
        :rules="rules"
        class="w-full flex flex-col gap-[14px]"
        label-position="top"
        v-loading="loading"
      >
        <div class="w-full flex md:flex-col gap-[16px] items-center">
          <!-- evaluation name -->
          <el-form-item
            class="w-full"
            :label="t('evaluation.new.name')"
            prop="name"
          >
            <el-input
              v-model="dataForm.name"
              :placeholder="
                t('all.pleaseInput', { value: t('evaluation.new.name') })
              "
              input-style="width: 100%"
            />
          </el-form-item>
        </div>

          <!-- model name -->
          <el-form-item
          :label="t('evaluation.new.evaluateModel')"
            class="w-full"
            prop="model_id"
          >
            <el-select
              filterable
              remote
              remote-show-suffix
              v-model="dataForm.model_id"
              :loading="fetchModelsLoading"
              :remote-method="fetchModels"
              :placeholder="
                t('all.pleaseInput', { value: t('evaluation.new.modelName') })
              "
              size="large"
              multiple
              :multiple-limit="3"
              class="ignore-height-select"
            >
              <el-option
                v-for="item in models"
                :key="item.key"
                :label="item.value"
                :value="item.value"
              />
            </el-select>
            <p class="text-gray-600 mt-2 font-light">
              {{ t('evaluation.new.evaluateAtMostThreeModels') }}
            </p>
          </el-form-item>
        <!-- des -->
        <el-form-item
          class="w-full"
          :label="t('evaluation.new.evaluationDesc')"
          prop="desc"
        >
          <el-input
            v-model="dataForm.desc"
            :rows="6"
            type="textarea"
            :placeholder="
              t('all.pleaseInput', {
                value: t('evaluation.new.evaluationDesc')
              })
            "
          />
        </el-form-item>

        <!-- dataset check -->
        <el-form-item
          class="w-full self-stretch inline-flex justify-start items-start gap-4 flex-wrap content-start"
        >
          <el-radio-group v-model="datasetCheck" class="w-full flex">
            <div class="flex-1">
              <el-radio value="1" size="large" class="text-gray-700 text-sm font-normal">{{ t('evaluation.new.systemRecommendedDataset') }}</el-radio>
              <div class="self-stretch justify-start pl-6">
                <span class="text-gray-600 text-sm font-light">
                  {{ t('evaluation.new.systemRecommendedDatasetTip') }}
                </span>
              </div>
            </div>
            <div>
              <el-radio value="2" size="large" class="flex-1 text-gray-700 text-sm font-normal">{{ t('evaluation.new.customDataset') }}</el-radio>
              <div class="self-stretch justify-start pl-6">
                <span class="text-gray-600 text-sm font-light">
                  {{ t('evaluation.new.customDatasetTip') }}
                </span>
                <span class="text-brand-600 text-sm font-light leading-snug cursor-pointer pl-1">
                  <a 
                    class="text-brand-600 hover:text-brand-700 hover:underline" 
                    target="_blank"
                    href="https://opencsg.com/docs/inferencefinetune/evaluation_with_custom_dataset"
                  >
                    {{ t('evaluation.new.customDatasetDocumentation') }}
                  </a>
                </span>
              </div>
            </div>
          </el-radio-group>
        </el-form-item>

        <!-- dataset -->
        <el-form-item
          v-show="datasetCheck === '1'"
          :label="t('evaluation.new.dataset')"
          class="w-full"
          prop="evaluation_dataset"
          v-loading="fetchDatasetsLoading"
        >
          <el-cascader
            v-model="dataForm.evaluation_dataset"
            :options="datasetOptions"
            :placeholder="
              t('all.pleaseSelect', { value: t('evaluation.new.dataset') })
            "
            size="large"
            tag-effect="plain"
            :props="{
              multiple: true,
              emitPath: false
            }"
            popper-class="evaluation-cascader"
            :show-all-levels="false"
            filterable
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item
        v-show="datasetCheck === '2'"
          :label="t('evaluation.new.customdataset')"
          class="w-full"
          prop="evaluation_custom_dataset"
          >
            <el-select
                filterable
                remote
                remote-show-suffix
                v-model="dataForm.evaluation_custom_dataset"
                :loading="fetchModelsLoading"
                :remote-method="fetchCustomDatasets"
                :placeholder="
                  t('all.pleaseSelect', { value: t('evaluation.new.customdataset') })
                "
                size="large"
                multiple
                class="ignore-height-select"
            >
              <el-option
                v-for="item in models"
                :key="item.key"
                :label="item.value"
                :value="item.value"
              />
            </el-select>
        </el-form-item>

        <!-- resource type -->
        <el-form-item
          :label="t('evaluation.new.resourceType')"
          class="w-full"
          prop="evaluation_resource_type"
        >
          <el-select
            v-model="dataForm.evaluation_resource_type"
            :placeholder="
              t('all.pleaseSelect', { value: t('evaluation.new.resourceType') })
            "
            size="large"
            style="width: 100%"
          >
            <el-option
              v-for="item in resourceTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <p class="text-gray-600 mt-2 font-light">
            {{
              dataForm.evaluation_resource_type === 'dedicated'
                ? t('evaluation.new.dedicatedResourceTip')
                : t('evaluation.new.sharedResourceTip')
            }}
          </p>
        </el-form-item>

        <!-- cluster -->
        <el-form-item
          :label="t('evaluation.new.cluster')"
          class="w-full"
          prop="evaluation_cluster"
          data-test="cluster-select"
          v-show="dataForm.evaluation_resource_type === 'dedicated'"
        >
          <el-select
            v-model="dataForm.evaluation_cluster"
            :placeholder="
              t('all.pleaseSelect', { value: t('evaluation.new.cluster') })
            "
            size="large"
            style="width: 100%"
            @change="fetchResources"
          >
            <el-option
              v-for="item in evaluationClusters"
              :key="item.cluster_id"
              :label="item.region"
              :value="item.cluster_id"
            />
          </el-select>
        </el-form-item>

        <!-- resource -->
        <el-form-item
          :label="t('evaluation.new.resource')"
          class="w-full"
          prop="cloud_resource"
          v-show="dataForm.evaluation_resource_type === 'dedicated'"
        >
          <el-select
            v-model="dataForm.cloud_resource"
            :placeholder="
              t('all.pleaseSelect', { value: t('evaluation.new.resource') })
            "
            size="large"
            style="width: 100%"
          >
            <el-option-group
              v-for="group in evaluationResources"
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
          <p class="text-gray-600 mt-2 font-light">
            {{ t('evaluation.new.resourceTip') }}
          </p>
        </el-form-item>

        <!-- framework -->
        <el-form-item
          :label="t('evaluation.new.framework')"
          class="w-full"
          prop="evaluation_framework"
        >
          <el-select
            ref="evaluationFrameworkSelectRef"
            v-model="frameworkVersion"
            @change="resetVersions"
            :placeholder="t('all.pleaseSelect')"
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
          <p class="text-gray-600 mt-2 font-light">
            {{ t('evaluation.new.frameworkTip1') }}
            <a
              href="https://opencsg.com/docs/inferencefinetune/evaluation_framework_intro"
              target="_blank"
              class="text-brand-600 hover:text-brand-700 hover:underline"
            >
              {{ t('evaluation.new.frameworkTip2') }}
            </a>
          </p>
        </el-form-item>
        <el-form-item
          :label="t('endpoints.new.frameworkVersion')"
          class="w-full"
        >
          <el-select
            v-model="dataForm.evaluation_framework"
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

        <!-- framework version -->
        <el-form-item
          :label="t('endpoints.new.frameworkVersion')"
          class="w-full"
        >
          <el-select
            v-model="dataForm.evaluation_framework"
            :placeholder="
              t('all.pleaseSelect', { value: t('endpoints.new.frameworkVersion') })
            "
            size="large"
            style="width: 100%"
          >
            <el-option
              v-for="item in frameworkVersionOptions"
              :key="item.id"
              :label='item.frame_version'
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <div class="flex justify-end gap-3">
          <a
            href="javascript:history.back();"
            class="btn btn-secondary-gray rounded-md text-sm font-medium flex items-center justify-center px-[14px] h-[42px]"
          >
            {{ t('all.cancel') }}
          </a>
          <el-form-item>
            <CsgButton
              class="btn btn-primary rounded-md text-sm font-medium flex items-center justify-center px-[14px] h-[42px]"
              :disabled="submitLoading"
              :name="t('evaluation.new.createEvaluation')"
              @click="handleSubmit"
            />
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted, watch, computed } from 'vue'
  import { ElInput, ElMessage } from 'element-plus'
  import useFetchApi from '../../packs/useFetchApi'
  import { useI18n } from 'vue-i18n'
  import { fetchResourcesInCategory } from '../shared/deploy_instance/fetchResourceInCategory'

  const props = defineProps({
    namespace: String
  })

  const frameworkVersion = ref('')
  const frameworkVersionOptions = ref([])
  const searchParams = new URLSearchParams(window.location.search)

  const { t } = useI18n()
  const models = ref([])
  const fetchModelsLoading = ref(false)
  const fetchDatasetsLoading = ref(false)
  const dataFormRef = ref(null)
  const dataForm = ref({
    model_id: searchParams.get('model_id') ? [searchParams.get('model_id')] : [],
    evaluation_resource_type: 'shared'
  })

  const evaluationFrameworks = ref([])
  const selectedFrameworkName = ref('')
  const evaluationResources = ref([])
  const evaluationClusters = ref([])
  const loading = ref(false)
  const submitLoading = ref(false)
  const datasetOptions = ref([])
  const evaluationFrameworkSelectRef = ref(null)
  const resourceTypes = ref([
    {
      value: 'shared',
      label: t('evaluation.new.sharedResource')
    },
    {
      value: 'dedicated',
      label: t('evaluation.new.dedicatedResource')
    }
  ])

  const rules = ref({
    name: [
      {
        required: true,
        message: t('all.pleaseInput', { value: t('evaluation.new.name') }),
        trigger: 'change'
      }
    ],
    model_id: [
      {
        required: true,
        message: t('all.pleaseInput', { value: t('evaluation.new.modelName') }),
        trigger: 'change'
      },
      {
        message: t('all.inputFormatError'),
        trigger: 'blur',
        validator: (rule, value, callback) => {
        if (Array.isArray(value)) {
          if (value.length === 0) {
            callback(new Error(t('all.pleaseInput', { value: t('evaluation.new.modelName') })))
            return
          }
          
          const isValid = value.every(item => 
            /^(?!\/)[a-zA-Z0-9-_\.]+\/[a-zA-Z0-9-_\.]+(?<!\/)$/.test(item)
          )
          
          if (!isValid) {
            callback(new Error(t('all.inputFormatError')))
          } else {
            callback()
          }
        }
      }
      }
    ],
    evaluation_dataset: [
      {
        required: true,
        validator: (rule, value, callback) => {
          if (datasetCheck.value === '1') {
            if (!value || (Array.isArray(value) && value.length === 0)) {
              callback(new Error(t('all.pleaseSelect', { value: t('evaluation.new.dataset') })))
            } else {
              callback()
            }
          } else {
            callback()
          }
        },
        trigger: 'change'
      }
    ],
    evaluation_custom_dataset: [
      {
        required: true,
        validator: (rule, value, callback) => {
          if (datasetCheck.value === '2') {
            if (!value || (Array.isArray(value) && value.length === 0)) {
              callback(new Error(t('all.pleaseSelect', { value: t('evaluation.new.customdataset') })))
            } else {
              callback()
            }
          } else {
            callback()
          }
        },
        trigger: 'change'
      }
    ]
  })

  const fetchDatasetOptions = async (framework) => {
    fetchDatasetsLoading.value = true
    try {
      const { data: tagsData } = await useFetchApi(
        '/tags?scope=dataset&category=evaluation'
      ).json()

      const options = await Promise.all(
        tagsData.value.data.map(async (tag) => {
          const { data: datasetsData } = await useFetchApi(
            `/datasets?tag_category=runtime_framework&tag_name=${framework.toLowerCase()}&tag_category=evaluation&tag_name=${
              tag.name
            }`
          ).json()

          const children =
            datasetsData.value.data?.map((dataset) => ({
              value: dataset.path,
              label: dataset.path
            })) || []

          return {
            label: tag.show_name || tag.name,
            value: tag.name,
            disabled: children.length === 0,
            children
          }
        })
      )

      datasetOptions.value = options
    } catch (error) {
      console.error('Error fetching dataset options:', error)
      ElMessage.error('Failed to load dataset options')
    } finally {
      fetchDatasetsLoading.value = false
    }
  }

  const fetchCustomDatasets = async (query) => {
    const { data, error } = await useFetchApi(
      `datasets?search=${query}`
    ).json()
    if (error.value) {
      ElMessage({ message: error.value.msg, type: 'warning' })
    } else {
      const body = data.value
      models.value = body.data?.map((model) => {
        return { key: model.path, value: model.path }
      })
    }
    fetchModelsLoading.value = false
  }

  const getSelectedEvaluationFrameworkText = () => {
    if (evaluationFrameworkSelectRef.value) {
      const selectedLabel = evaluationFrameworkSelectRef.value.selectedLabel
      return selectedLabel
    }
    return ''
  }

  const fetchModels = async (query, cb) => {
    fetchModelsLoading.value = true
    const { data, error } = await useFetchApi(
      `/models?tag_category=runtime_framework&tag_name=${getSelectedEvaluationFrameworkText()}&search=${query}`
    ).json()
    if (error.value) {
      ElMessage({ message: error.value.msg, type: 'warning' })
    } else {
      const body = data.value
      models.value = body.data?.map((model) => {
        return { key: model.path, value: model.path }
      })
    }
    fetchModelsLoading.value = false
  }

  const fetchClusters = async () => {
    loading.value = true
    const { data, error } = await useFetchApi('/cluster').json()
    if (error.value) {
      ElMessage({ message: error.value.msg, type: 'warning' })
    } else {
      const body = data.value
      dataForm.value.evaluation_cluster = body.data[0]?.cluster_id || ''
      evaluationClusters.value = body.data
      await fetchResources()
    }
    loading.value = false
  }

  const fetchResources = async () => {
    // evaluation can only use none cpu resources, so passing deploy type 2, means resoruces fit for finetune
    const categoryResources = await fetchResourcesInCategory(dataForm.value.evaluation_cluster, 4)
    const firstAvailableResource = categoryResources.flatMap(item => item.options).find((item) => item.is_available)
    evaluationResources.value = categoryResources
    if (firstAvailableResource) {
      dataForm.value.cloud_resource = `${firstAvailableResource.id}/${firstAvailableResource.order_detail_id}`
    } else {
      dataForm.value.cloud_resource = ''
    }
  }

  const datasetCheck = ref('1')

  const fetchRuntimeFramework = async () => {
    if (!dataForm.value.model_id || dataForm.value.model_id.length === 0) return
    const { data, error } = await useFetchApi(
      `/models/${dataForm.value.model_id[0]}/runtime_framework_v2?deploy_type=4`
    ).json()
    if (error.value) {
      frameworkVersionOptions.value = []
      dataForm.value.evaluation_framework = ''
      evaluationFrameworks.value = []
    } else {
      const body = data.value
      evaluationFrameworks.value = body.data || []
      if(evaluationFrameworks.value.length){
        frameworkVersionOptions.value = evaluationFrameworks.value[0].versions
        dataForm.value.evaluation_framework =
        frameworkVersionOptions.value[0]?.id || ''
        selectedFrameworkName.value =
        frameworkVersionOptions.value[0]?.frame_name || ''
      }else {
        frameworkVersionOptions.value = []
        dataForm.value.evaluation_framework = '' 
        selectedFrameworkName.value = ''
      }
    }
  }

  const resetVersions = async() => { 
    const currentResource = evaluationResources.value
      .flatMap(category => category.options)
      .find(item => item.id == dataForm.value.cloud_resource.split('/')[0])

    if(filterFrameworks.value.length){
      if(currentResource&&currentResource.type){
        frameworkVersionOptions.value = filterFrameworks.value[frameworkVersion.value].versions.filter((version) => version.compute_type == currentResource.type) || []
      }else {
        frameworkVersionOptions.value = filterFrameworks.value[frameworkVersion.value].versions
      }
      dataForm.value.evaluation_framework = frameworkVersionOptions.value[0]?.id || ''
    }else{
      frameworkVersionOptions.value = []
      dataForm.value.evaluation_framework = ''
    }

    if(dataForm.value.model_id.length > 0 || 
      dataForm.value.evaluation_dataset.length > 0 || 
      dataForm.value.evaluation_custom_dataset.length > 0) {
      ElMessage({
        message: t('evaluation.new.resetModelsDatsets'),
        type: 'warning',
        showClose: true,
        duration: 5000
      })
    }

    dataForm.value.model_id = []
    dataForm.value.evaluation_dataset = []
    dataForm.value.evaluation_custom_dataset = []
  }

  const filterFrameworks = computed(() => {
    if (!dataForm.value.cloud_resource) return evaluationFrameworks.value

    const currentResource = evaluationResources.value
      .flatMap(category => category.options)
      .find(item => item.id == dataForm.value.cloud_resource.split('/')[0])

    if (!currentResource) return []
    if (!evaluationFrameworks.value) return []

    return evaluationFrameworks.value.filter((framework) => framework.compute_types.includes(currentResource.type))
  })

  watch(() => filterFrameworks.value, (newValue) => {
    if (newValue) {
      if (filterFrameworks.value.length > 0) {
        frameworkVersion.value = 0
        const currentResource = evaluationResources.value
        .flatMap(category => category.options)
        .find(item => item.id == dataForm.value.cloud_resource.split('/')[0])

        if(!currentResource){
          frameworkVersionOptions.value = filterFrameworks.value[frameworkVersion.value].versions
          dataForm.value.evaluation_framework = frameworkVersionOptions.value[0]?.id || ''
        }else {
          frameworkVersionOptions.value = filterFrameworks.value[0].versions.filter((version) => version.compute_type == currentResource.type) || []
          dataForm.value.evaluation_framework = frameworkVersionOptions.value[0]?.id || ''
        }
      } else {
        frameworkVersion.value = ''
        frameworkVersionOptions.value = []
        dataForm.value.evaluation_framework = ''
      }
    }
  })

  watch(
    () => dataForm.value.evaluation_framework,
    async () => {
      selectedFrameworkName.value =
      frameworkVersionOptions.value.find(
          (framework) => framework.id === dataForm.value.evaluation_framework
        )?.frame_name || ''
      await fetchDatasetOptions(selectedFrameworkName.value)
    }
  )

  watch(
    () => dataForm.value.model_id,
    async () => {
        await fetchRuntimeFramework()
      }
  )

  watch(
    () => dataForm.value.evaluation_resource_type,
    async () => {
      if (dataForm.value.evaluation_resource_type === 'dedicated') {
        await fetchClusters()
      } else {
        evaluationResources.value = []
        dataForm.value.cloud_resource = ''
      }
    }
  )

  const handleSubmit = async () => {
    submitLoading.value = true
    dataFormRef.value
      .validate(async (valid) => {
        if (valid) {
          await createEvaluation()
        } else {
          return false
        }
      })
      .finally(() => {
        submitLoading.value = false
      })
  }

  const createEvaluation = async () => {
    const body = {
      task_name: dataForm.value.name,
      task_desc: dataForm.value.desc,
      model_ids: dataForm.value.model_id,
      runtime_framework_id: dataForm.value.evaluation_framework,
      share_mode: dataForm.value.evaluation_resource_type === 'shared'
    }

    if (datasetCheck.value === '1') {
      body.datasets = dataForm.value.evaluation_dataset;
    } else if (datasetCheck.value === '2') {
      body.custom_datasets = dataForm.value.evaluation_custom_dataset;
    }

    if (dataForm.value.evaluation_resource_type === 'dedicated') {
      body.resource_id = Number(dataForm.value.cloud_resource.split('/')[0])
    }

    const options = {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }
    const newEndpoint = '/evaluations'
    const { error } = await useFetchApi(newEndpoint, options).post().json()
    if (error.value) {
      ElMessage({
        message: t('evaluation.new.createFail') + `: ${error.value.msg}`,
        type: 'error'
      })
    } else {
      ElMessage({
        message: t('evaluation.new.createSuccess'),
        type: 'success'
      })
      window.location.href = '/resource-console'
      return false
    }
  }

  onMounted(() => {
    fetchRuntimeFramework()
  })
</script>

<style>
  .evaluation-cascader .el-cascader-menu:first-of-type .el-checkbox {
    display: none;
  }

  .evaluation-cascader .el-cascader-menu {
    width: 100%;
  }

  .evaluation-cascader .el-cascader-menu:first-of-type {
    width: auto;
  }

  .evaluation-cascader .el-cascader-panel {
    width: 640px;
  }

  @media screen and (max-width: 768px) {
    .evaluation-cascader .el-cascader-panel {
      width: calc(100vw - 40px);
    }
  }
</style>

<style scoped>
  :deep(.el-input) {
    height: 40px;

    @media screen and (max-width: 768px) {
      width: 100%;
    }
  }

  :deep(.el-select) {
    height: 40px;
  }

  :deep(.ignore-height-select.el-select) {
    height: auto !important;
  }

  :deep(.ignore-height-select.el-select) {
    height: auto !important;
  }

  :deep(.el-input .el-input__wrapper) {
    border-radius: var(--border-radius-md);
  }

  :deep(.el-cascader .el-input) {
    height: auto;
  }

  :deep(.el-cascader .el-input.is-focus .el-input__wrapper) {
    box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.05),
      0px 0px 0px 4px rgba(77, 106, 214, 0.24);
    border: 1px solid var(--Brand-300);
  }

  :deep(.el-cascader .el-tag) {
    line-height: 20px;
    font-size: 14px;
    border-radius: var(--border-radius-sm);
    color: var(--gray-700);
  }
</style>
