<template>
  <Container
    type="model"
    :title="$t('admin.models.modelDetails')"
    subtitle=""
    :showBack="true"
    :breadcrumbs="[
      { text: $t('admin.models.title'), to: `${BASE_URL}/models` },
      { text: `Model #${model.id}` }
    ]"
  >
    <Card :title="`Model #${model.name}`">
      <ul class="">
        <li class="flex mb-4">
          <label class="admin-field-label">{{ $t('admin.name') }}</label>
          <p class="admin-field">{{ model.name }}</p>
        </li>
        <li class="flex mb-4">
          <label class="admin-field-label">{{ $t('admin.owner') }}</label>
          <p class="admin-field">{{ route.params.namespace }}</p>
        </li>
        <li class="flex mb-4">
          <label class="admin-field-label">{{ $t('admin.creator') }}</label>
          <p class="admin-field">{{ model.user?.username || '' }}</p>
        </li>
        <li class="flex mb-4">
          <label class="admin-field-label">{{ $t('admin.visibility') }}</label>
          <p class="admin-field">
            {{ model.private == false ? 'public' : 'private' }}
          </p>
        </li>
        <li class="flex mb-4">
          <label class="admin-field-label">{{ $t('admin.weight') }}</label>
          <p class="admin-field">{{ model.recom_op_weight || 1 }}</p>
        </li>
        <li class="flex mb-4">
          <label class="admin-field-label">{{
            $t('admin.sensiCheckStatus')
          }}</label>
          <p class="admin-field">{{ model.sensitive_check_status }}</p>
        </li>
        <li
          v-if="sourceUrl"
          class="flex mb-4"
        >
          <label class="admin-field-label">{{ $t('admin.origin') }}</label>
          <p class="admin-field">{{ sourceUrl }}</p>
        </li>
        <li class="flex mb-4">
          <label class="admin-field-label">{{ $t('admin.createdAt') }}</label>
          <p class="admin-field">
            {{ dayjs(model.created_at).format('YYYY-MM-DD HH:mm:ss') }}
          </p>
        </li>
        <li
          v-if="lastUpdatedAt"
          class="flex mb-4"
        >
          <label class="admin-field-label">{{ $t('admin.updatedAt') }}</label>
          <p class="admin-field">
            {{ dayjs(lastUpdatedAt).format('YYYY-MM-DD HH:mm:ss') }}
          </p>
        </li>
        <li
          v-if="lastMessage"
          class="flex mb-4"
        >
          <label class="admin-field-label">{{ $t('admin.lastMessage') }}</label>
          <p class="admin-field">{{ lastMessage }}</p>
        </li>
      </ul>
      <template #footer>
        <div class="flex gap-[16px]">
          <div class="flex gap-4">
            <CsgButton
              class="btn btn-primary btn-md"
              name="Edit"
              @click="redirectModelEdit"
            />
            <CsgButton
              class="btn btn-primary btn-md"
              :name="$t('admin.models.setWeight')"
              @click="showWeightDialog = true"
            />
          </div>
          <CsgButton
            v-if="canSync"
            class="btn btn-primary btn-md"
            :name="$t('admin.models.sync')"
            @click="syncModelMirror"
          />
          <div v-if="model.widget_type === 'generation'">
            <CsgButton
              v-if="hasServerless"
              class="btn btn-primary btn-md"
              :name="$t('admin.serverless.detailTitle')"
              @click="toServerlessDetail"
            />
            <CsgButton
              v-else
              class="btn btn-primary btn-md"
              :name="$t('admin.serverless.newTitle')"
              @click="toServerlessCreate"
            />
          </div>
        </div>
      </template>
    </Card>
    <el-dialog
      v-model="showWeightDialog"
      :title="$t('admin.models.setModelWeight')"
      width="30%"
      class="dialogWidth"
      style="border-radius: 0.5rem"
      left
    >
      <el-input
        v-model="weight"
        type="number"
        :placeholder="$t('admin.models.weightPlaceholder')"
      />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showWeightDialog = false">{{
            $t('all.cancel')
          }}</el-button>
          <el-button
            type="primary"
            @click="updateWeight"
          >
            {{ $t('all.update') }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </Container>
</template>

<script setup>
  import { Container, Pagination, Table, Card } from '../admin_component'
  import { ref, onMounted, computed } from 'vue'
  import { useRoute } from 'vue-router'
  import dayjs from 'dayjs'
  import { ElMessage } from 'element-plus'
  import useFetchApi from '../../../packs/useFetchApi'
  import { BASE_URL } from '../router'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()
  const route = useRoute()
  const model = ref({})
  const showWeightDialog = ref(false)
  const weight = ref(1)
  const lastUpdatedAt = ref(null)
  const lastMessage = ref(null)
  const canSync = ref(false)
  const sourceUrl = ref(null)
  const endpoint = ref(null)

  const fetchModel = async () => {
    const { data, error } = await useFetchApi(
      `/models/${route.params.namespace}/${route.params.name}?need_op_weight=true`
    ).json()

    if (error.value) {
      ElMessage.error('Failed to fetch model')
    } else {
      const body_data = data.value.data
      model.value = body_data
    }
  }

  const redirectModelEdit = () => {
    window.location.href = `/admin_panel/models/${route.params.namespace}/${route.params.name}/edit`
  }

  const updateWeight = async () => {
    const params = {
      repo_id: Number(model.value.repository_id),
      weight: Number(weight.value)
    }
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    }
    const { data, error } = await useFetchApi(`/recom/opweight`, options).json()

    if (error.value) {
      ElMessage({ message: error.value.msg, type: 'warning' })
    } else {
      showWeightDialog.value = false
      ElMessage({ message: t('admin.updateSuccess'), type: 'success' })
      fetchModel()
    }
  }

  const getModelMirror = async () => {
    const { data, error } = await useFetchApi(
      `/models/${route.params.namespace}/${route.params.name}/mirror`
    ).json()
    if (data) {
      const body_data = data.value.data
      lastUpdatedAt.value = body_data.last_updated_at
      lastMessage.value = body_data.last_message || ' '
      sourceUrl.value = body_data['source_url']
      canSync.value = body_data['status'] != 'finished'
    }
  }

  const syncModelMirror = async () => {
    const { data, error } = await useFetchApi(
      `/models/${route.params.namespace}/${route.params.name}/mirror/sync`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' } }
    ).json()

    if (error.value) {
      ElMessage.error('同步失败！')
    } else {
      ElMessage.success('同步成功！')
    }
  }

  const fetchServerless = async () => {
    const url = `/models/${route.params.namespace}/${route.params.name}/serverless`
    const { data } = await useFetchApi(url).json()

    if (data.value) {
      endpoint.value = data.value.data
    }
  }

  const hasServerless = computed(() => {
    return !!endpoint.value
  })

  const toServerlessCreate = () => {
    window.location.href = `/admin_panel/serverless/${route.params.namespace}/${route.params.name}/new`
  }

  const toServerlessDetail = () => {
    window.location.href = `/admin_panel/serverless/${route.params.namespace}/${route.params.name}/${endpoint.value?.deploy_id}`
  }

  onMounted(() => {
    fetchModel()
    fetchServerless()
    getModelMirror()
  })
</script>
