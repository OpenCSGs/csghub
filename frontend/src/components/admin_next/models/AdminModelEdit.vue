<template>
  <Container
    type="model"
    :title="$t('admin.models.modelEdit')"
    subtitle=""
    :showBack="true"
    :breadcrumbs="[
      { text: $t('admin.models.title'), to: `${BASE_URL}/models` },
      { text: `Model #${theModel.id}` }
    ]"
  >
    <Card :title="`Model #${theModel.name}`">
      <div class="mb-4">
        <div class="flex">
          <div class="admin-field-label">{{ $t('admin.visibility') }}</div>
          <el-switch
            v-model="model.private"
            :active-text="model.private ? 'Private' : 'Public'"
          >
          </el-switch>
        </div>
      </div>
      <template #footer>
        <div class="flex gap-4">
          <CsgButton
            class="btn btn-primary btn-md"
            name="Update"
            @click="updateModel({ private: model.private, base_model: model.base_model })"
          />
        </div>
      </template>
    </Card>
  </Container>
</template>

<script setup>
  import { Container, Pagination, Table, Card } from '../admin_component'
  import useFetchApi from '../../../packs/useFetchApi'
  import { ref, onMounted, inject } from 'vue'
  import { useRoute } from 'vue-router'
  import { ElMessage } from 'element-plus'
  import { useI18n } from 'vue-i18n'
  import { BASE_URL } from '../router'

  const { t } = useI18n()
  const route = useRoute()
  const theModel = ref('')
  const model = ref({
    private: null
  })

  const updateModel = async (payload) => {
    const options = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }
    const { data, error } = await useFetchApi(
      `/models/${route.params.namespace}/${route.params.name}`,
      options
    ).json()

    if (data.value) {
      ElMessage({
        message: t('admin.updateSuccess'),
        type: 'success'
      })
    } else {
      ElMessage({
        message: error.value.msg,
        type: 'error'
      })
    }
  }

  const fetchModel = async () => {
    const { data } = await useFetchApi(
      `/models/${route.params.namespace}/${route.params.name}`
    ).json()
    if (data.value) {
      const res_json = data.value
      model.value.private = res_json.data.private
      model.value.base_model = res_json.data.base_model
      theModel.value = res_json.data
    } else {
      ElMessage.error('Failed to fetch model')
    }
  }

  onMounted(() => {
    fetchModel()
  })
</script>
