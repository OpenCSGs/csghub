<template>
  <div>
    <el-card>
      <template #header>
        <div class="card-header">
          <span>User Detail</span>
        </div>
      </template>
      <ul class="max-w-[480px]">
        <li class="flex justify-between mb-4">
          <label>Uuid</label>
          <p>{{ user.uuid }}</p>
        </li>
        <li class="flex justify-between mb-4">
          <label>Name</label>
          <p>{{ user.username }}</p>
        </li>
        <li class="flex justify-between mb-4">
          <label>Nickname</label>
          <p>{{ user.nickname }}</p>
        </li>
        <li class="flex justify-between mb-4">
          <label>Avatar</label>
          <p>{{ user.avatar }}</p>
        </li>
        <li class="flex justify-between mb-4">
          <label>Email</label>
          <p>{{ user.email }}</p>
        </li>
        <li class="flex justify-between mb-4">
          <label>Phone</label>
          <p>{{ user.phone }}</p>
        </li>
        <li class="flex justify-between mb-4">
          <label>Roles</label>
          <p>{{ user.roles }}</p>
        </li>
        <li class="flex justify-between mb-4">
          <label>Created At</label>
          <p>{{ dayjs(user.created_at).format('YYYY-MM-DD HH:mm:ss') }}</p>
        </li>
      </ul>
      <template #footer>
        <el-button @click="dialogFormVisible = true">Edit</el-button>
      </template>
    </el-card>

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
  </div>
</template>

<script setup>
  import { ref, onMounted, inject } from 'vue'
  import { useRoute } from 'vue-router'
  import jwtFetch from '../../../packs/jwtFetch.js'
  import dayjs from 'dayjs'
  import { ElMessage } from 'element-plus'

  const route = useRoute()
  const csghubServer = inject('csghubServer')

  const user = ref({})

  const dialogFormVisible = ref(false)

  const form = ref({
    roles: String
  })

  const fetchUser = async () => {
    const response = await jwtFetch(`${csghubServer}/api/v1/user/${route.params.id}`)
    if (response.ok) {
      const result = await response.json()
      user.value = result.data
      form.value.roles = result.data.roles
    } else {
      ElMessage.error('Failed to fetch user')
    }
  }

  const submitUserForm = async () => {
    const response = await jwtFetch(`${csghubServer}/api/v1/user/${user.value.username}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ roles: form.value.roles })
    })
    if (response.ok) {
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
