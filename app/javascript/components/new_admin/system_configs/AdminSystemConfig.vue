<template>
  <div class="mb-[30px]">
    <h3 class="text-[18px] font-[500] mb-[8px]">Application ENV</h3>
    <p class="text-[#606266]">{{ systemConfigs.application_env }}</p>
  </div>

  <hr />

  <!-- S3 configs -->
  <div class="my-[30px]">
    <h3 class="text-[18px] font-[500] mb-[8px]">S3 Configs</h3>
    <el-form-item>
      <textarea
        ref="s3ConfigsRef"
        class="system-config-obj-box"
        :value="stringifyObject(systemConfigs.s3_configs)"
        rows="5"
      ></textarea>
    </el-form-item>
    <el-form-item>
      <el-button
        type="info"
        size="small"
        @click="updateS3Configs"
        >Update</el-button
      >
    </el-form-item>
  </div>

  <hr />

  <!-- License info -->
  <div class="my-[30px]">
    <h3 class="text-[18px] font-[500] mb-[8px]">License info</h3>
    <el-form-item>
      <textarea
        ref="licenseInfoRef"
        class="system-config-obj-box"
        :value="stringifyObject(systemConfigs.license_info)"
        rows="5"
      ></textarea>
    </el-form-item>
    <el-form-item>
      <el-button
        type="info"
        size="small"
        @click="updateLicenseInfo"
        >Update</el-button
      >
    </el-form-item>
  </div>
</template>

<script setup>
  import csrfFetch from '../../../packs/csrfFetch'
  import { ref, onMounted } from 'vue'
  import { ElMessage } from 'element-plus'

  const systemConfigs = ref({
    application_env: '',
    s3_configs: {},
    license_info: {}
  })

  const s3ConfigsRef = ref(null)
  const updateS3Configs = () => {
    systemConfigs.value.s3_configs = JSON.parse(s3ConfigsRef.value.value)
    updateSystemConfig(systemConfigs.value)
  }

  const licenseInfoRef = ref(null)
  const updateLicenseInfo = () => {
    systemConfigs.value.license_info = JSON.parse(
      licenseInfoRef.value.value
    )
    updateSystemConfig(systemConfigs.value)
  }

  const stringifyObject = (obj) => JSON.stringify(obj, null, 2)

  const fetchSystemConfig = async () => {
    const res = await csrfFetch('/internal_api/admin/system_config')
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
    const res = await csrfFetch('/internal_api/admin/system_config/1', options)
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
