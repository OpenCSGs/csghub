<template>
  <div class="w-[640px] m-auto flex flex-col items-center md:w-full md:p-5">
    <div>
      <SvgIcon
        name="endpoint"
        width="36"
        height="36" />
    </div>
    <h3 class="text-[#303133] text-xl font-semibold mt-6 mb-3">
      {{ t('endpoints.new.title') }}
    </h3>
    <p class="text-[#606266] text-base font-medium md:text-center">
      {{ t('endpoints.new.desc') }}
    </p>
    <div class="mt-9">
      <el-form
        ref="dataFormRef"
        :model="dataForm"
        :rules="rules"
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
            prop="model_path">
            <el-autocomplete
              clearable
              v-model="dataForm.model_path"
              :fetch-suggestions="fetchModels"
              :placeholder="
                t('all.pleaseInput', { value: t('endpoints.new.modelId') })
              "
              @change="updateRuntimeFramework" />
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
          <p class="text-[#475467] mt-2 font-light">
            {{ t('endpoints.new.resourceTip1') }}
          </p>
          <p class="text-[#475467] font-light">
            {{ t('endpoints.new.resourceTip2') }}
          </p>
        </el-form-item>

        <el-form-item
          :label="t('endpoints.new.framework')"
          class="w-full"
          prop="framework_id">
          <el-select
            v-model="dataForm.endpoint_framework"
            :placeholder="
              t('all.pleaseSelect', { value: t('endpoints.new.framework') })
            "
            size="large"
            style="width: 100%">
            <el-option
              v-for="item in endpointFrameworks"
              :key="item.id"
              :label="item.frame_name"
              :value="item.id" />
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
            <el-button
              :loading="loading"
              class="!text-center !h-9 !text-[16px] !text-white !bg-[#3250BD] !rounded-[8px] !border-[1px] !border-[#3250BD]"
              @click="handleSubmit">
              {{ t('endpoints.new.createEndpoint') }}
            </el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted, inject } from 'vue'
  import { ElInput, ElMessage } from 'element-plus'
  import jwtFetch from '../../packs/jwtFetch'
  import { useI18n } from 'vue-i18n'
  import PublicAndPrivateRadioGroup from '../shared/form/PublicAndPrivateRadioGroup.vue'

  const props = defineProps({
    namespace: String
  })

  const searchParams = new URLSearchParams(window.location.search)

  const { t } = useI18n()
  const csghubServer = inject('csghubServer')
  const nameRule = inject('nameRule')
  const dataFormRef = ref(null)
  const dataForm = ref({
    model_path: searchParams.get('model_id') || '',
    visibility: 'public',
    min_replica: 1,
    max_replica: 1
  })
  const endpointFrameworks = ref([])
  const endpointClusters = ref([])
  const endpointResources = ref([])
  const loading = ref(false)

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
    model_path: [
      {
        required: true,
        message: t('all.pleaseInput', { value: t('endpoints.new.modelId') }),
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
    ]
  })

  const fetchResources = async () => {
    const options = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    }
    const res = await jwtFetch(
      `${csghubServer}/api/v1/space_resources?cluster_id=${dataForm.value.endpoint_cluster}`,
      options
    )
    if (!res.ok) {
      ElMessage({ message: t('all.fetchError'), type: 'warning' })
    } else {
      res.json().then((body) => {
        const firstAvailableResource = body.data?.find(
          (resource) => resource.is_available
        )
        dataForm.value.cloud_resource = firstAvailableResource?.id || ''
        endpointResources.value = body.data
      })
    }
  }

  const fetchClusters = async () => {
    const options = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    }
    const res = await jwtFetch(`${csghubServer}/api/v1/cluster`, options)
    if (!res.ok) {
      ElMessage({ message: t('all.fetchError'), type: 'warning' })
    } else {
      res.json().then((body) => {
        dataForm.value.endpoint_cluster = body.data[0]?.cluster_id || ''
        endpointClusters.value = body.data
        fetchResources()
      })
    }
  }

  const fetchModels = async (query, cb) => {
    const res = await jwtFetch(
      `${csghubServer}/api/v1/runtime_framework/models?search=${query}`
    )
    if (!res.ok) {
      ElMessage({ message: t('all.fetchError'), type: 'warning' })
    } else {
      res.json().then((body) => {
        const paths = body.data?.map((model) => {
          return { key: model.path, value: model.path }
        })
        cb(paths)
      })
    }
  }

  const updateRuntimeFramework = async () => {
    const res = await jwtFetch(
      `${csghubServer}/api/v1/models/${dataForm.value.model_path}/runtime_framework`
    )
    if (!res.ok) {
      dataForm.value.endpoint_framework = ''
      endpointFrameworks.value = []
    } else {
      res.json().then((body) => {
        dataForm.value.endpoint_framework =
          body.data == null ? '' : body.data[0].id
        endpointFrameworks.value = body.data
      })
    }
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
      resource_id: dataForm.value.cloud_resource,
      min_replica: dataForm.value.min_replica,
      max_replica: dataForm.value.max_replica,
      runtime_framework_id: dataForm.value.endpoint_framework,
      secure_level: dataForm.value.visibility === 'public' ? 1: 2,
      cluster_id: dataForm.value.endpoint_cluster
    }
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    }
    const uploadEndpoint = `${csghubServer}/api/v1/models/${dataForm.value.model_path}/run`
    const response = await jwtFetch(uploadEndpoint, options)
    if (response.ok) {
      ElMessage({
        message: t('endpoints.new.createSuccess'),
        type: 'success'
      })
      response.json().then((res) => {
        window.location.href = `/endpoints/${dataForm.value.model_path}/${res.data.deploy_id}`
      })
    } else {
      response.json().then((res) => {
        ElMessage({
          message: t('endpoints.new.createFail') + `: ${res.msg}`,
          type: 'error'
        })
      })
    }
  }

  onMounted(() => {
    updateRuntimeFramework()
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