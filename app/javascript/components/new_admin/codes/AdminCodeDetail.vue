<template>
  <div>
    <el-card>
      <template #header>
        <div class="card-header">
          <span>Code Detail</span>
        </div>
      </template>
      <ul class="max-w-[480px]">
        <li class="flex justify-between mb-4">
          <label>Name</label>
          <p>{{ code.name }}</p>
        </li>
        <li class="flex justify-between mb-4">
          <label>Owner</label>
          <p>{{ route.params.namespace }}</p>
        </li>
        <li class="flex justify-between mb-4">
          <label>Creator</label>
          <p>{{ user.username }}</p>
        </li>
        <li class="flex justify-between mb-4">
          <label>Visibility</label>
          <p>{{ code.private == false ? 'public' : 'private' }}</p>
        </li>
        <li class="flex justify-between mb-4">
          <label>Created At</label>
          <p>{{ dayjs(code.created_at).format('YYYY-MM-DD HH:mm:ss') }}</p>
        </li>
      </ul>
    </el-card>
  </div>
</template>

<script setup>
  import { ref, onMounted, inject } from 'vue'
  import { useRoute } from 'vue-router'
  import dayjs from "dayjs"
  import { ElMessage } from 'element-plus'

  const route = useRoute()
  const csghubServer = inject('csghubServer')
  const code = ref({})
  const user = ref({})

  const fetchcode = async () => {
    const response = await fetch(`${csghubServer}/api/v1/codes/${route.params.namespace}/${route.params.name}`)
    if (response.ok) {
      const res_json = await response.json()
      code.value = res_json.data
      user.value = code.value.user
      delete code.value.user
    } else {
      ElMessage.error('Failed to fetch code')
    }
  }

  onMounted(() => {
    fetchcode()
  })
</script>