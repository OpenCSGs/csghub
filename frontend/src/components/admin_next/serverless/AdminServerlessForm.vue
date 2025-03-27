<template>
  <Container
    :title="breadcrumbsTitle"
    :showBack="true"
    :breadcrumbs="[
      {
        text: `Model #${route.params.name}`,
        to: `/admin_panel/models/${route.params.namespace}/${route.params.name}`
      },
      { text: breadcrumbsTitle }
    ]"
  >
    <el-form
      ref="dataFormRef"
      :model="dataForm"
      :rules="rules"
      class="w-full flex flex-col gap-[14px]"
      label-position="top"
    >
      <el-form-item
        :label="$t('admin.serverless.cluster')"
        prop="cluster_id"
        class="w-full"
      >
        <el-select
          v-model="dataForm.cluster_id"
          class="w-full"
          filterable
        >
          <el-option
            v-for="cluster in clusters"
            :key="cluster.cluster_id"
            :label="cluster.region"
            :value="cluster.cluster_id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        :label="$t('admin.serverless.deployName')"
        prop="deploy_name"
        class="w-full"
      >
        <el-input v-model="dataForm.deploy_name" />
      </el-form-item>
      <el-form-item
        :label="$t('admin.serverless.env')"
        prop="env"
        class="w-full"
      >
        <el-input v-model="dataForm.env" />
      </el-form-item>
      <el-form-item
        :label="$t('admin.serverless.maxReplica')"
        prop="max_replica"
        class="w-full"
      >
        <el-input-number
          v-model="dataForm.max_replica"
          :min="0"
          controls-position="right"
        />
      </el-form-item>
      <el-form-item
        :label="$t('admin.serverless.minReplica')"
        prop="min_replica"
        class="w-full"
      >
        <el-input-number
          v-model="dataForm.min_replica"
          :min="0"
          controls-position="right"
        />
      </el-form-item>
      <el-form-item
        :label="$t('admin.serverless.resource')"
        prop="resource_id"
        class="w-full"
      >
        <el-select
          v-model="dataForm.resource_id"
          class="w-full"
        >
          <el-option
            v-for="resource in resources"
            :key="resource.id"
            :label="resource.name"
            :value="resource.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        :label="$t('admin.serverless.runtimeFramework')"
        prop="runtime_framework_id"
        class="w-full"
      >
        <el-select
          v-model="dataForm.runtime_framework_id"
          class="w-full"
        >
          <el-option
            v-for="framework in runtimeFrameworks"
            :key="framework.id"
            :label="`${framework.frame_name} (${framework.frame_version})`"
            :value="framework.id"
          >
            <div class="flex flex-col">
              <span>{{ framework.frame_name }}</span>
              <span class="text-gray-400 text-sm"
                >Version: {{ framework.frame_version }}</span
              >
            </div>
          </el-option>
        </el-select>
      </el-form-item>

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
            :key="item.path"
            :label="item.path"
            :value="item.path"
          />
        </el-select>
      </el-form-item>
      <el-form-item class="w-full">
        <div class="flex justify-end w-full">
          <CsgButton
            class="btn btn-primary btn-md"
            :name="$t('admin.serverless.submit')"
            @click="handleSubmit"
          />
        </div>
      </el-form-item>
    </el-form>
  </Container>
</template>

<script setup>
  import { Container } from '../admin_component'
  import { ref, onMounted, computed } from 'vue'
  import useFetchApi from '../../../packs/useFetchApi'
  import { ElMessage } from 'element-plus'
  import { useRoute, useRouter } from 'vue-router'
  import { BASE_URL } from '../router'
  import { useI18n } from 'vue-i18n'
  import { watch } from 'vue'

  const { t } = useI18n()
  const router = useRouter()
  const route = useRoute()

  const clusters = ref([])
  const resources = ref([])
  const runtimeFrameworks = ref([])
  const availableQuantizations = ref([])

  const breadcrumbsTitle = computed(() =>
    route.params.id
      ? t('admin.serverless.editTitle')
      : t('admin.serverless.newTitle')
  )

  const dataForm = ref({
    cluster_id: '',
    deploy_name: '',
    env: '',
    max_replica: 0,
    min_replica: 0,
    resource_id: '',
    runtime_framework_id: ''
  })

  const dataFormRef = ref(null)
  const rules = ref({
    cluster_id: [
      { required: true, message: 'Cluster is required', trigger: 'blur' }
    ],
    resource_id: [
      { required: true, message: 'Resource is required', trigger: 'blur' }
    ],
    runtime_framework_id: [
      {
        required: true,
        message: 'Runtime Framework is required',
        trigger: 'blur'
      }
    ],
    deploy_name: [
      { required: true, message: 'Deploy name is required', trigger: 'blur' }
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

  const handleSubmit = () => {
    dataFormRef.value.validate((valid) => {
      if (valid) {
        createOrUpdate()
      } else {
        return false
      }
    })
  }

  const createOrUpdate = () => {
    if (route.params.id) {
      update()
    } else {
      create()
    }
  }

  const create = async () => {
    const { data } = await useFetchApi(
      `/models/${route.params.namespace}/${route.params.name}/serverless`,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataForm.value)
      }
    )
      .post()
      .json()
    if (data.value) {
      ElMessage({
        message: t('admin.createSuccess'),
        type: 'success'
      })
      router.push(
        `/admin_panel/models/${route.params.namespace}/${route.params.name}`
      )
    } else {
      ElMessage.error('Failed to create Serverless')
    }
  }

  const update = async () => {
    const { data } = await useFetchApi(
      `/models/${route.params.namespace}/${route.params.name}/serverless/${route.params.id}`,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataForm.value)
      }
    )
      .put()
      .json()
    if (data.value) {
      ElMessage({
        message: t('admin.updateSuccess'),
        type: 'success'
      })
      router.push(
        `/admin_panel/serverless/${route.params.namespace}/${route.params.name}/${route.params.id}`
      )
    } else {
      ElMessage.error('Failed to update Serverless')
    }
  }

  const fetchServerless = async () => {
    const id = route.params.id
    const { data } = await useFetchApi(
      `/models/${route.params.namespace}/${route.params.name}/serverless/${route.params.id}`
    ).json()
    if (data.value) {
      const result = data.value.data
      const maxReplica = result.max_replica || 0
      const minReplica = result.min_replica || 0
      const runtimeFrameworkId = runtimeFrameworks.value.find(
        (item) => item.frame_name === result.runtime_framework
      )?.id
      const resourceId = resources.value.find(
        (item) => item.resources === result.hardware
      )?.id
      dataForm.value = {
        ...result,
        max_replica: maxReplica,
        min_replica: minReplica,
        runtime_framework_id: runtimeFrameworkId,
        resource_id: resourceId
      }
    } else {
      ElMessage.error('Failed to fetch serverless')
    }
  }

  const fetchClusters = async () => {
    const { data, error } = await useFetchApi('/cluster').json()
    if (error.value) {
      ElMessage({ message: error.value.msg, type: 'warning' })
    } else {
      const body = data.value
      clusters.value = body.data
      await fetchResources()
    }
  }

  const fetchResources = async () => {
    const { data, error } = await useFetchApi(
      `/space_resources?cluster_id=${dataForm.value.cluster_id}`
    ).json()
    if (error.value) {
      ElMessage({ message: error.value.msg, type: 'warning' })
    } else {
      const body = data.value
      resources.value = body.data
    }
  }

  const fetchRuntimeFrameworks = async () => {
    const { data } = await useFetchApi('/models/runtime_framework').json()
    if (data.value) {
      runtimeFrameworks.value = data.value.data
    } else {
      ElMessage.error('Failed to fetch runtime frameworks')
    }
  }

  watch(
    () => dataForm.value.cluster_id,
    async () => {
      await fetchResources()
    }
  )

  const fetchQuantizations = async () => {
    const quantizationEndpoint = `/models/${route.params.namespace}/${route.params.name}/quantizations`
    const { data, error } = await useFetchApi(quantizationEndpoint).json()
    if (error.value) {
      console.log(error.value.msg)
    } else if (data.value.data) {
      availableQuantizations.value = data.value.data
      rules.value.quantization[0].required = true
    }
  }

  onMounted(async () => {
    await fetchClusters()
    await fetchRuntimeFrameworks()
    await fetchQuantizations()
    if (breadcrumbsTitle.value === t('admin.serverless.editTitle')) {
      fetchServerless()
    }
  })
</script>

<style>
  .el-form-item {
    margin-bottom: 24px;
  }
  .el-form-item__label {
    margin-bottom: 6px;
  }
  :deep(.el-input__wrapper) {
    border-radius: 8px;
  }
</style>
