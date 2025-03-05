<template>
  <Container :title="$t('admin.users.userDetailTitle')" subtitle="" :showBack="true" :breadcrumbs="[{ text: $t('admin.users.title'), to: `${BASE_URL}/users` }, {text: `User #${user.uuid}`}]">
    <Card :title="`User #${user.username}`">
      <ul class="">
        <li class="flex mb-4">
          <label class="admin-field-label">Uuid</label>
          <p class="admin-field">{{ user.uuid }}</p>
        </li>
        <li class="flex mb-4">
          <label class="admin-field-label">Name</label>
          <p class="admin-field">{{ user.username }}</p>
        </li>
        <li class="flex mb-4">
          <label class="admin-field-label">Nickname</label>
          <p class="admin-field">{{ user.nickname }}</p>
        </li>
        <li class="flex mb-4">
          <label class="admin-field-label">Avatar</label>
          <p class="admin-field">{{ user.avatar }}</p>
        </li>
        <li class="flex mb-4">
          <label class="admin-field-label">Email</label>
          <p class="admin-field">{{ user.email }}</p>
        </li>
        <li class="flex mb-4">
          <label class="admin-field-label">Phone</label>
          <p class="admin-field">{{ user.phone }}</p>
        </li>
        <li class="flex mb-4">
          <label class="admin-field-label">Roles</label>
          <p class="admin-field">{{ user.roles }}</p>
        </li>
        <li class="flex mb-4">
          <label class="admin-field-label">Created At</label>
          <p class="admin-field">{{ dayjs(user.created_at).format('YYYY-MM-DD HH:mm:ss') }}</p>
        </li>
      </ul>
      <template #footer>
        <CsgButton class="btn btn-primary btn-md" name="Edit" @click="dialogFormVisible = true" />
      </template>
    </Card>

    <!-- user edit dialog -->
    <el-dialog
      v-model="dialogFormVisible"
      :title="`User #${user.username}`"
      width="500"
    >
      <el-form :model="form">
        <el-form-item label="Roles">
          <el-select
            v-model="form.roles"
            multiple
            placeholder="Please select the roles"
          >
            <el-option
              label="Super User"
              value="super_user"
            />
            <el-option
              label="Admin"
              value="admin"
            />
            <el-option
              label="Personal User"
              value="personal_user"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer flex justify-end gap-2">
          <CsgButton class="btn btn-secondary-gray btn-md" :name="$t('admin.users.editCancelBtn')" @click="dialogFormVisible = false" />
          <CsgButton class="btn btn-primary btn-md" :name="$t('admin.users.editConfirmBtn')" @click="submitUserForm" />
        </div>
      </template>
    </el-dialog>
  </Container>
</template>

<script setup>
  import { Container, Pagination, Table, Card } from '../admin_component'
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import useFetchApi from '../../../packs/useFetchApi'
  import dayjs from 'dayjs'
  import { ElMessage } from 'element-plus'
  import { BASE_URL } from '../router'

  const route = useRoute()

  const user = ref({})

  const dialogFormVisible = ref(false)

  const form = ref({
    roles: String
  })

  const fetchUser = async () => {
    const { data } = await useFetchApi(`/user/${route.params.id}`).json()
    if (data.value) {
      const result = data.value
      user.value = result.data
      form.value.roles = result.data.roles
    } else {
      ElMessage.error('Failed to fetch user')
    }
  }

  const submitUserForm = async () => {
    const { data } = await useFetchApi(`/user/${user.value.uuid}`, {
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ roles: form.value.roles })
    }).put().json()
    if (data.value) {
      ElMessage.success('User updated successfully')
      dialogFormVisible.value = false
      fetchUser()
    } else {
      ElMessage.error('Failed to update user')
    }
  }

  onMounted(() => {
    fetchUser()
  })
</script>

<style scoped>
  :deep(.el-form-item__label) {
    line-height: 32px !important;
  }
  :deep(.el-dialog__body) {
    padding: 0 !important;
  }
  :deep(.el-dialog__header) {
    padding-bottom: 47px;
  }
</style>