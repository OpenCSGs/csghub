<template>
  <div>
    <el-card>
      <template #header>
        <div class="card-header">
          <span>Dataset Detail</span>
        </div>
      </template>
      <ul class="max-w-[480px]">
        <li class="flex justify-between mb-4">
          <label>Name</label>
          <p>{{ dataset.name }}</p>
        </li>
        <li class="flex justify-between mb-4">
          <label>Owner</label>
          <p>{{ route.params.namespace }}</p>
        </li>
        <li class="flex justify-between mb-4">
          <label>Creator</label>
          <p>{{ dataset.user?.username || '' }}</p>
        </li>
        <li class="flex justify-between mb-4">
          <label>Visibility</label>
          <p>{{ dataset.private == false ? 'public' : 'private' }}</p>
        </li>
        <li class="flex justify-between mb-4">
          <label>Created At</label>
          <p>{{ dayjs(dataset.created_at).format('YYYY-MM-DD HH:mm:ss') }}</p>
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
  const dataset = ref({})

  const fetchData = async () => {
    const response = await fetch(
      `${csghubServer}/api/v1/datasets/${route.params.namespace}/${route.params.name}`
    )
    if (response.ok) {
      const res_json = await response.json()
      dataset.value = res_json.data
    } else {
      ElMessage.error(response.msg || 'Failed to fetch dataset')
    }
  }

  onMounted(() => {
    fetchData()
  })
</script>
