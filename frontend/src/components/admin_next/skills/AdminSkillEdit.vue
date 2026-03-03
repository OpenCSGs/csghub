<template>
  <Container
    type="skill"
    :title="$t('admin.skills.skillEdit')"
    subtitle=""
    :showBack="true"
    :breadcrumbs="[
      { text: $t('admin.skills.title'), to: `${BASE_URL}/skills` },
      { text: `Skill #${theSkill.id}` }
    ]"
  >
    <Card :title="`Skill #${theSkill.name}`">
      <div class="mb-4">
        <div class="flex">
          <div class="admin-field-label">{{ $t('admin.visibility') }}</div>
          <el-switch
            v-model="skill.private"
            :active-text="skill.private ? 'Private' : 'Public'"
          >
          </el-switch>
        </div>
      </div>
      <template #footer>
        <div class="flex gap-4">
          <CsgButton
            class="btn btn-primary btn-md"
            name="Update Visibility"
            @click="updateSkill({ private: skill.private })"
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
  const theSkill = ref('')
  const skill = ref({
    private: null
  })

  const updateSkill = async (payload) => {
    const options = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }
    const { data, error } = await useFetchApi(
      `/skills/${route.params.namespace}/${route.params.name}`,
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

  const fetchSkill = async () => {
    const { data } = await useFetchApi(
      `/skills/${route.params.namespace}/${route.params.name}`
    ).json()
    if (data.value) {
      const res_json = data.value
      skill.value.private = res_json.data.private
      theSkill.value = res_json.data
    } else {
      ElMessage.error('Failed to fetch skill')
    }
  }

  onMounted(() => {
    fetchSkill()
  })
</script>
