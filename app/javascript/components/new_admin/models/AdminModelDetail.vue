<template>
  <div>
    <el-card>
      <template #header>
        <div class="card-header">
          <span>Model Detail</span>
        </div>
      </template>
      <ul class="max-w-[480px]">
        <li class="flex justify-between mb-4">
          <label>Name</label>
          <p>{{ model.name }}</p>
        </li>
        <li class="flex justify-between mb-4">
          <label>Owner</label>
          <p>{{ route.params.namespace }}</p>
        </li>
        <li class="flex justify-between mb-4">
          <label>Creator</label>
          <p>{{ model.user?.username || '' }}</p>
        </li>
        <li class="flex justify-between mb-4">
          <label>Visibility</label>
          <p>{{ model.private == false ? 'public' : 'private' }}</p>
        </li>
        <li class="flex justify-between mb-4">
          <label>Created At</label>
          <p>{{ dayjs(model.created_at).format('YYYY-MM-DD HH:mm:ss') }}</p>
        </li>
      </ul>
    </el-card>
  </div>
</template>

<script setup>
  import { ref, onMounted, inject } from 'vue'
  import { useRoute } from 'vue-router'
  import dayjs from 'dayjs'
  import { ElMessage } from 'element-plus'

  const route = useRoute()
  const csghubServer = inject('csghubServer')
  const model = ref({})

  const fetchModel = async () => {
    const response = await fetch(
      `${csghubServer}/api/v1/models/${route.params.namespace}/${route.params.name}`
    )
    if (response.ok) {
      const res_json = await response.json()
      model.value = res_json.data
    } else {
      ElMessage.error('Failed to fetch model')
    }
  }

  onMounted(() => {
    fetchModel()
  })
</script>
