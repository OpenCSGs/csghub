<template>
  <Container title="用户详情" subtitle="" :breadcrumbs="[{ text: '用户管理' }]">
    <Card :title="`User #${user.username}`">
      <!-- <template #header>
        <div class="flex items-start gap-4 p-10 self-stretch">
          <span>User Detail</span>
        </div>
      </template> -->
      <ul class="">
        <li class="flex mb-4">
          <label class="w-[15%]">Uuid</label>
          <p>{{ user.uuid }}</p>
        </li>
        <li class="flex mb-4">
          <label class="w-[15%]">Name</label>
          <p>{{ user.username }}</p>
        </li>
        <li class="flex mb-4">
          <label class="w-[15%]">Nickname</label>
          <p>{{ user.nickname }}</p>
        </li>
        <li class="flex mb-4">
          <label class="w-[15%]">Avatar</label>
          <p>{{ user.avatar }}</p>
        </li>
        <li class="flex mb-4">
          <label class="w-[15%]">Email</label>
          <p>{{ user.email }}</p>
        </li>
        <li class="flex mb-4">
          <label class="w-[15%]">Phone</label>
          <p>{{ user.phone }}</p>
        </li>
        <li class="flex mb-4">
          <label class="w-[15%]">Roles</label>
          <p>{{ user.roles }}</p>
        </li>
        <li class="flex mb-4">
          <label class="w-[15%]">Created At</label>
          <p>{{ dayjs(user.created_at).format('YYYY-MM-DD HH:mm:ss') }}</p>
        </li>
      </ul>
      <template #footer>
        <el-button plain class="btn-primary btn-md" @click="dialogFormVisible = true">Edit</el-button>
      </template>
    </Card>

    <!-- user edit dialog -->
    <el-dialog
      v-model="dialogFormVisible"
      :title="`${user.username}`"
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
        <div class="dialog-footer">
          <el-button @click="dialogFormVisible = false">Cancel</el-button>
          <el-button
            type="primary"
            @click="submitUserForm"
          >
            Confirm
          </el-button>
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
    const { data } = await useFetchApi(`/user/${user.value.username}`, {
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
