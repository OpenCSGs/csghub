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

          <el-form-item
            :label="t('evaluation.new.modelName')"
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
            >
              <el-option
                v-for="item in models"
                :key="item.key"
                :label="item.value"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </div>

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

        <el-form-item
          :label="t('evaluation.new.framework')"
          class="w-full"
          prop="evaluation_framework"
        >
          <el-select
            v-model="dataForm.evaluation_framework"
            :placeholder="t('all.pleaseSelect')"
            size="large"
            style="width: 100%"
          >
            <el-option
              v-for="item in evaluationFrameworks"
              :key="item.id"
              :label="item.frame_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item
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
  import { ref, onMounted, watch } from 'vue'
  import { ElInput, ElMessage } from 'element-plus'
  import useFetchApi from '../../packs/useFetchApi'
  import { useI18n } from 'vue-i18n'

  const props = defineProps({
    namespace: String
  })

  const searchParams = new URLSearchParams(window.location.search)

  const { t } = useI18n()
  const models = ref([])
  const fetchModelsLoading = ref(false)
  const fetchDatasetsLoading = ref(false)
  const dataFormRef = ref(null)
  const dataForm = ref({
    model_id: searchParams.get('model_id') || '',
    evaluation_resource_type: 'shared'
  })

  const evaluationFrameworks = ref([])
  const selectedFrameworkName = ref('')
  const evaluationResources = ref([])
  const evaluationClusters = ref([])
  const loading = ref(false)
  const submitLoading = ref(false)
  const datasetOptions = ref([])
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

  const payModeMapping = {
    free: t('all.free'),
    minute: t('all.minutePay'),
    month: t('all.yearMonthPay'),
    year: t('all.yearMonthPay')
  }

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
        pattern: /^(?!\/)[a-zA-Z0-9-_\.]+\/[a-zA-Z0-9-_\.]+(?<!\/)$/,
        message: t('all.inputFormatError'),
        trigger: 'blur'
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

  const fetchModels = async (query, cb) => {
    fetchModelsLoading.value = true
    const { data, error } = await useFetchApi(
      `/runtime_framework/models?search=${query}&deploy_type=4`
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
    const { data, error } = await useFetchApi(
      `/space_resources?cluster_id=${dataForm.value.evaluation_cluster}`
    ).json()
    if (error.value) {
      ElMessage({ message: error.value.msg, type: 'warning' })
    } else {
      const body = data.value
      const allResources = body.data
      const firstAvailableResource = body.data?.find(
        (resource) =>
          resource.is_available && ['npu', 'gpu'].includes(resource.type)
      )
      dataForm.value.cloud_resource = firstAvailableResource
        ? `${firstAvailableResource.id}/${firstAvailableResource.order_detail_id}`
        : ''
      const categories = {}
      allResources.forEach((item) => {
        if (item.type === 'cpu') return
        const category = payModeMapping[item.pay_mode] || 'Others'
        if (!categories[category]) {
          categories[category] = []
        }
        if (item.pay_mode == 'minute') {
          item.label = `${item.name} ${item.price / 100}${t('all.hourUnit')}`
        } else if (item.pay_mode == 'month') {
          item.label = `${item.name} ${item.price / 100}${t('all.monthUnit')}`
        } else if (item.pay_mode == 'year') {
          item.label = `${item.name} ${item.price / 100}${t('all.yearUnit')}`
        } else {
          item.label = item.name
        }
        categories[category].push(item)
      })
      const options = Object.keys(categories).map((category) => ({
        label: category,
        options: categories[category]
      }))
      evaluationResources.value = options
    }
  }

  const fetchRuntimeFramework = async () => {
    if (!dataForm.value.model_id) return
    const { data, error } = await useFetchApi(
      `/models/${dataForm.value.model_id}/runtime_framework?deploy_type=4`
    ).json()
    if (error.value) {
      dataForm.value.evaluation_framework = ''
      evaluationFrameworks.value = []
    } else {
      const body = data.value
      evaluationFrameworks.value = body.data
      dataForm.value.evaluation_framework =
        evaluationFrameworks.value[0]?.id || ''
      selectedFrameworkName.value =
        evaluationFrameworks.value[0]?.frame_name || ''
    }
  }

  watch(
    () => dataForm.value.evaluation_framework,
    async () => {
      selectedFrameworkName.value =
        evaluationFrameworks.value.find(
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

  const handleSubmit = async () => {
    submitLoading.value = true
    const body = {
      task_name: dataForm.value.name,
      task_desc: dataForm.value.desc,
      model_id: dataForm.value.model_id,
      runtime_framework_id: dataForm.value.evaluation_framework,
      datasets: dataForm.value.evaluation_dataset,
      share_mode: dataForm.value.evaluation_resource_type === 'shared'
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
    submitLoading.value = false
  }

  onMounted(() => {
    fetchRuntimeFramework()
    fetchClusters()
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
