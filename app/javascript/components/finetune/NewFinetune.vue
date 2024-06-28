<template>
  <div class="w-[640px] m-auto flex flex-col items-center md:w-full md:p-5">
    <div>
      <SvgIcon
        name="finetune_create"
        width="32"
        height="32"
      />
    </div>
    <h3 class="text-[#303133] text-xl font-semibold mt-6 mb-3">{{ $t('finetune.new.title') }}</h3>
    <p class="text-[#606266] text-base font-medium md:text-center">
      {{ $t('finetune.new.desc') }}
    </p>
    <div class="mt-9 w-full">
      <div class="w-full flex sm:flex-col gap-2 mb-9 md:gap-9">
        <div class="flex-1">
          <p class="text-[#303133] text-sm mb-2">{{ $t('finetune.new.name') }}</p>
          <el-input
            v-model="finetuneName"
            :placeholder="$t('finetune.new.nameTip')"
            input-style="width: 100%"
          />
        </div>
        <div class="flex-1">
          <p class="text-[#303133] text-sm mb-2">{{ $t('finetune.new.modelId') }}</p>
          <el-autocomplete
            clearable
            v-model="modelId"
            :fetch-suggestions="fetchModels"
            :placeholder="$t('finetune.new.modelIdTip')"
          />
        </div>
      </div>

      <div class="mb-9 text-sm w-full">
        <p class="mb-2 text-[#303133]">{{ $t('finetune.new.cluster') }}</p>
        <el-select
          v-model="finetuneCluster"
          :placeholder="$t('finetune.new.clusterTip')"
          size="large"
          style="width: 100%"
        >
          <el-option
            v-for="item in finetuneClusters"
            :key="item.cluster_id"
            :label="item.region"
            :value="item.cluster_id"
          />
        </el-select>
        <p class="text-[#475467] mt-2 font-light">
          {{ $t('finetune.new.clusterDec1') }}
        </p>
        <p class="text-[#475467] font-light">{{ $t('finetune.new.clusterDec2') }}</p>
      </div>

      <div class="mb-9 text-sm w-full">
        <p class="mb-2 text-[#303133]">{{ $t('finetune.new.resource') }}</p>
        <el-select
          v-model="finetuneResource"
          :placeholder="$t('finetune.new.resourceTip')"
          size="large"
          style="width: 100%"
        >
          <el-option
            v-for="item in finetuneResources"
            :key="item.name"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <p class="text-[#475467] mt-2 font-light">
          {{ $t('finetune.new.resourceDec1') }}
        </p>
        <p class="text-[#475467] font-light">
          {{ $t('finetune.new.resourceDec2') }}
        </p>
      </div>

      <div class="mb-9 text-sm w-full">
        <p class="mb-2 text-[#303133]">{{ $t('endpoints.new.framework') }}</p>
        <el-select
          v-model="finetuneFramework"
          :placeholder="$t('all.select')"
          size="large"
          style="width: 100%"
        >
          <el-option
            v-for="item in finetuneFrameworks"
            :key="item.id"
            :label="item.frame_name"
            :value="item.id"
          />
        </el-select>
      </div>

      <div class="flex justify-end">
        <button
          class="bg-[#3250BD] px-[14px] h-9 rounded-lg text-white flex items-center justify-center border disabled:text-[#98A2B3] disabled:bg-[#F2F4F7] disabled:border-[#EAECF0]"
          :disabled="!canCreate || hasCreateFinetune"
          @click="createFinetune"
        >
        {{ $t('finetune.new.createFinetune') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed, onMounted, inject, watch } from 'vue'
  import { ElInput, ElMessage } from 'element-plus'
  import jwtFetch from '../../packs/jwtFetch'
  import { useI18n } from 'vue-i18n'

  const props = defineProps({
    namespace: String
  })

  const searchParams = new URLSearchParams(window.location.search)

  const { t } = useI18n()
  const csghubServer = inject('csghubServer')
  const nameRule = inject('nameRule')

  const finetuneName = ref('')
  const modelId = ref(searchParams.get('model_id') || '')
  const visibility = ref('private')
  const hasCreateFinetune = ref(false)
  const finetuneResources = ref([])
  const finetuneResource = ref('')
  const finetuneFrameworks = ref([])
  const finetuneFramework = ref('')
  const finetuneClusters = ref([])
  const finetuneCluster = ref('')

  const canCreate = computed(() => {
    const modelIdRegex = /^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/
    return nameRule.test(finetuneName.value) && modelIdRegex.test(modelId.value)
  })

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
      ElMessage({ message: t('all.fetchError'), type: 'warning' })
    } else {
      res.json().then((body) => {
        finetuneResource.value = body.data[0]?.id || ''
        finetuneResources.value = body.data
      })
    }
  }

  const fetchFrameworks = async () => {
    const options = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    }

    try {
      const res = await jwtFetch(
        `${csghubServer}/api/v1/models/runtime_framework?deploy_type=2`,
        options
      )
      if (res.ok) {
        res.json().then((body) => {
          finetuneFramework.value = body.data[0]?.id || ''
          finetuneFrameworks.value = body.data
        })
      }
    } catch (err) {
      console.log(err)
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
        finetuneCluster.value = body.data[0]?.cluster_id || ''
        finetuneClusters.value = body.data
      })
    }
  }

  const fetchModels = async (query, cb) => {
    const res = await jwtFetch(`${csghubServer}/api/v1/models?search=${query}`)
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

  const createFinetune = async () => {
    try {
      const res = await submitFinetuneForm()
      ElMessage.success(t('endpoints.new.createSuccess'))
    } catch (err) {
      ElMessage.warning(err.message)
    }
  }

  const submitFinetuneForm = async () => {
    hasCreateFinetune.value = true

    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cluster_id: finetuneCluster.value,
        deploy_name: finetuneName.value,
        resource_id: finetuneResource.value,
        runtime_framework_id: finetuneFramework.value,
        secure_level: 2
      })
    }
    const res = await jwtFetch(
      `${csghubServer}/api/v1/models/${modelId.value}/finetune?current_user=${
        modelId.value ? modelId.value.split('/')[0] : ''
      }`,
      options
    )
    if (!res.ok) {
      ElMessage({ message: t('all.fetchError'), type: 'warning' })
    } else {
      hasCreateFinetune.value = false
      res.json().then((body) => {
        if (body.data && body.data.deploy_id) {
          window.location.pathname = `/finetune/${modelId.value}/${finetuneName.value}/${body.data.deploy_id}`
        }
      })
    }
  }

  onMounted(() => {
    fetchResources()
    fetchFrameworks()
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
