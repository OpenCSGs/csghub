<template>
  <Container
    type="skill"
    :title="$t('admin.skills.skillDetails')"
    subtitle=""
    :showBack="true"
    :breadcrumbs="[
      { text: $t('admin.skills.title'), to: `${BASE_URL}/skills` },
      { text: `Skills #${skill.id}` }
    ]"
  >
    <Card :title="`Skill #${skill.name}`">
      <ul class="">
        <li class="flex mb-4">
          <label class="admin-field-label">{{ $t('admin.name') }}</label>
          <p class="admin-field">{{ skill.name }}</p>
        </li>
        <li class="flex mb-4">
          <label class="admin-field-label">{{ $t('admin.owner') }}</label>
          <p class="admin-field">{{ route.params.namespace }}</p>
        </li>
        <li class="flex mb-4">
          <label class="admin-field-label">{{ $t('admin.creator') }}</label>
          <p class="admin-field">{{ skill.user?.username || '' }}</p>
        </li>
        <li class="flex mb-4">
          <label class="admin-field-label">{{ $t('admin.visibility') }}</label>
          <p class="admin-field">
            {{ skill.private == false ? 'public' : 'private' }}
          </p>
        </li>
        <li class="flex mb-4">
          <label class="admin-field-label">{{ $t('admin.weight') }}</label>
          <p class="admin-field">{{ skill.recom_op_weight || 1 }}</p>
        </li>
        <li class="flex mb-4">
          <label class="admin-field-label">{{
            $t('admin.sensiCheckStatus')
          }}</label>
          <p class="admin-field">{{ skill.sensitive_check_status }}</p>
        </li>
        <li class="flex mb-4">
          <label class="admin-field-label">{{ $t('admin.createdAt') }}</label>
          <p class="admin-field">
            {{ dayjs(skill.created_at).format('YYYY-MM-DD HH:mm:ss') }}
          </p>
        </li>
      </ul>
      <template #footer>
        <div class="flex gap-4">
          <CsgButton
            class="btn btn-primary btn-md"
            :name="$t('admin.skills.edit')"
            @click="redirectSkillEdit"
          />
          <CsgButton
            class="btn btn-primary btn-md"
            :name="$t('admin.skills.setWeight')"
            @click="showWeightDialog = true"
          />
        </div>
      </template>
    </Card>
    <el-dialog
      v-model="showWeightDialog"
      :title="$t('admin.skills.setSkillWeight')"
      width="30%"
      class="dialogWidth"
      style="border-radius: 0.5rem"
      left
    >
      <el-input
        v-model="weight"
        type="number"
        :placeholder="$t('admin.skills.weightPlaceholder')"
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
  import { ref, onMounted, inject } from 'vue'
  import { useRoute } from 'vue-router'
  import dayjs from 'dayjs'
  import { ElMessage } from 'element-plus'
  import useFetchApi from '../../../packs/useFetchApi'
  import { BASE_URL } from '../router'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()
  const route = useRoute()
  const skill = ref({})
  const showWeightDialog = ref(false)
  const weight = ref(1)

  const redirectSkillEdit = () => {
    window.location.href = `/admin_panel/skills/${route.params.namespace}/${route.params.name}/edit`
  }

  const updateWeight = async () => {
    const params = {
      repo_id: Number(skill.value.repository_id),
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
      fetchSkill()
    }
  }

  const fetchSkill = async () => {
    const { data, error } = await useFetchApi(
      `/skills/${route.params.namespace}/${route.params.name}?need_op_weight=true`
    ).json()
    if (data.value) {
      const res_json = data.value
      skill.value = res_json.data
    } else {
      ElMessage.error(error.value.msg || 'Failed to fetch skill')
    }
  }

  onMounted(() => {
    fetchSkill()
  })
</script>
