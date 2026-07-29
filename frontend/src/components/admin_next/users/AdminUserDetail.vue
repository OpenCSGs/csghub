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
        <CsgButton
          class="btn btn-danger btn-md"
          :name="$t('admin.users.destroyConfirmBtn')"
          @click="destroyUser" />
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
  import { useRoute, useRouter } from 'vue-router'
  import useFetchApi from '../../../packs/useFetchApi'
  import dayjs from 'dayjs'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { BASE_URL } from '../router'
  import useUserStore from '../../../stores/UserStore'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()

  const userStore = useUserStore()
  const route = useRoute()
  const router = useRouter()

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

  const destroyUser = () => {
    ElMessageBox.confirm(
      t('admin.users.deleteUserConfirm', '此操作将永久删除该用户, 是否继续?'),
      t('admin.users.deleteUserTitle', '提示'),
      {
        confirmButtonText: t('admin.users.confirm', '确定'),
        cancelButtonText: t('admin.users.cancel', '取消'),
        type: 'warning',
      }
    ).then(async () => {
      const res = await useFetchApi(`/user/${user.value.username}?current_user=${userStore.username}`).delete().json()

      if (res.data?.value) {
        ElMessage.success(t('admin.users.destroySuccess', '删除成功!'))
        router.push('/admin_panel/users')
      } else {
        if(res.error?.value?.msg) {
          ElMessage.error(res.error.value?.msg)
        } else {
          ElMessage.error(res.error.value?.msg || t('admin.users.destroyFailed', '删除失败!'))
        }
      }
    }).catch(() => {
      ElMessage({
        type: 'info',
        message: t('admin.users.deleteCanceled', '已取消删除'),
      });
    });
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
