<template>
  <div class="mb-[30px]">
    <h3 class="text-[18px] font-[500] mb-[8px]">Application ENV</h3>
    <p class="text-gray-500">{{ systemConfigs.application_env }}</p>
  </div>
</template>

<script setup>
  import csrfFetch from '../../../packs/csrfFetch'
  import { ref, onMounted } from 'vue'
  import { ElMessage } from 'element-plus'

  const systemConfigs = ref({
    application_env: ''
  })

  const fetchSystemConfig = async () => {
    const res = await csrfFetch('/internal_api/admin_panel/system_config')
    if (res.ok) {
      body = await res.json()
      Object.keys(systemConfigs.value).forEach((key) => {
        systemConfigs.value[key] = body.system_configs[key] || {}
      })
    } else {
      console.log('Failed to fetch system config')
    }
  }

  const updateSystemConfig = async (payload) => {
    const options = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }
    const res = await csrfFetch('/internal_api/admin_panel/system_config/1', options)
    if (res.ok) {
      ElMessage({
        message: '更新成功！',
        type: 'success'
      })
    } else {
      res.json().then((error) => {
        ElMessage({
          message: error.msg,
          type: 'success'
        })
      })
    }
  }

  onMounted(() => {
    fetchSystemConfig()
  })
</script>
