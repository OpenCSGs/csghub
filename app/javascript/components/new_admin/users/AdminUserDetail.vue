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
          <label>Name</label>
          <p>{{ user.name }}</p>
        </li>
        <li class="flex justify-between mb-4">
          <label>Nickname</label>
          <p>{{ user.nickname }}</p>
        </li>
        <li class="flex justify-between mb-4">
          <label>Phone</label>
          <p>{{ user.phone }}</p>
        </li>
        <li class="flex justify-between mb-4">
          <label>Role</label>
          <p>{{ user.role }}</p>
        </li>
        <li class="flex justify-between mb-4">
          <label>Created At</label>
          <p>{{ dayjs(user.created_at).format('YYYY-MM-DD HH:mm:ss') }}</p>
        </li>
      </ul>
    </el-card>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import dayjs from "dayjs"

  const route = useRoute()

  const user = ref({})

  const fetchUser = async () => {
    const response = await fetch(`/internal_api/admin/users/${route.params.id}`)
    if (response.ok) {
      const data = await response.json()
      user.value = data
    }
  }

  onMounted(() => {
    fetchUser()
  })
</script>
