<template>
  <div class="mb-[30px]">
    <h3 class="text-[18px] font-[500] mb-[8px]">Application ENV</h3>
    <p class="text-[#606266]">{{ systemConfigs.application_env }}</p>
  </div>

  <hr />

  <!-- feature flags -->
  <div class="my-[30px]">
    <h3 class="text-[18px] font-[500] mb-[8px]">Feature Flags</h3>
    <el-form-item>
      <textarea
        ref="featureFlagsRef"
        class="system-config-obj-box"
        :value="stringifyObject(systemConfigs.feature_flags)"
        rows="5"
      ></textarea>
    </el-form-item>
    <el-form-item>
      <el-button
        type="info"
        size="small"
        @click="updateFeatureFlags"
        >Update</el-button
      >
    </el-form-item>
  </div>

  <hr />

  <!-- general configs -->
  <div class="my-[30px]">
    <h3 class="text-[18px] font-[500] mb-[8px]">General Configs</h3>
    <el-form-item>
      <textarea
        ref="generalConfigsRef"
        class="system-config-obj-box"
        :value="stringifyObject(systemConfigs.general_configs)"
        rows="5"
      ></textarea>
    </el-form-item>
    <el-form-item>
      <el-button
        type="info"
        size="small"
        @click="updateGeneralConfigs"
        >Update</el-button
      >
    </el-form-item>
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

  <!-- Oidc configs -->
  <div class="my-[30px]">
    <h3 class="text-[18px] font-[500] mb-[8px]">OIDC Configs</h3>
    <el-form-item>
      <textarea
        ref="oidcConfigsRef"
        class="system-config-obj-box"
        :value="stringifyObject(systemConfigs.oidc_configs)"
        rows="5"
      ></textarea>
    </el-form-item>
    <el-form-item>
      <el-button
        type="info"
        size="small"
        @click="updateOidcConfigs"
        >Update</el-button
      >
    </el-form-item>
  </div>

  <hr />

  <!-- Starhub configs -->
  <div class="my-[30px]">
    <h3 class="text-[18px] font-[500] mb-[8px]">Starhub Configs</h3>
    <el-form-item>
      <textarea
        ref="starhubConfigsRef"
        class="system-config-obj-box"
        :value="stringifyObject(systemConfigs.starhub_configs)"
        rows="5"
      ></textarea>
    </el-form-item>
    <el-form-item>
      <el-button
        type="info"
        size="small"
        @click="updateStarhubConfigs"
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
    feature_flags: {},
    general_configs: {},
    license_configs: {},
    oidc_configs: {},
    s3_configs: {},
    starhub_configs: {}
  })

  const featureFlagsRef = ref()
  const updateFeatureFlags = () => {
    systemConfigs.value.feature_flags = JSON.parse(featureFlagsRef.value.value)
    updateSystemConfig(systemConfigs.value)
  }

  const generalConfigsRef = ref(null)
  const updateGeneralConfigs = () => {
    systemConfigs.value.general_configs = JSON.parse(
      generalConfigsRef.value.value
    )
    updateSystemConfig(systemConfigs.value)
  }

  const s3ConfigsRef = ref(null)
  const updateS3Configs = () => {
    systemConfigs.value.s3_configs = JSON.parse(s3ConfigsRef.value.value)
    updateSystemConfig(systemConfigs.value)
  }

  const oidcConfigsRef = ref(null)
  const updateOidcConfigs = () => {
    systemConfigs.value.oidc_configs = JSON.parse(oidcConfigsRef.value.value)
    updateSystemConfig(systemConfigs.value)
  }

  const starhubConfigsRef = ref(null)
  const updateStarhubConfigs = () => {
    systemConfigs.value.starhub_configs = JSON.parse(
      starhubConfigsRef.value.value
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
    console.log(payload);
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
