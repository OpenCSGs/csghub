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
      <el-input
        :value="stringifyObject(systemConfigs.feature_flags)"
        type="textarea"
        rows="7"
        style="width: 580px"
      ></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="info" size="small" @click="">Update</el-button>
    </el-form-item>
  </div>

  <hr />

  <!-- general configs -->
  <div class="my-[30px]">
    <h3 class="text-[18px] font-[500] mb-[8px]">General Configs</h3>
    <el-form-item>
      <el-input
        :value="stringifyObject(systemConfigs.general_configs)"
        type="textarea"
        rows="7"
        style="width: 580px"
      ></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="info" size="small" @click="">Update</el-button>
    </el-form-item>
  </div>

  <hr />

  <!-- S3 configs -->
  <div class="my-[30px]">
    <h3 class="text-[18px] font-[500] mb-[8px]">S3 Configs</h3>
    <el-form-item>
      <el-input
        :value="stringifyObject(systemConfigs.s3_configs)"
        type="textarea"
        rows="7"
        style="width: 580px"
      ></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="info" size="small" @click="">Update</el-button>
    </el-form-item>
  </div>
</template>

<script setup>
  import csrfFetch from '../../../packs/csrfFetch';
  import { ref, onMounted } from 'vue'

  const systemConfigs = ref({
    feature_flags: {},
    general_configs: {},
    license_configs: {},
    oidc_configs: {},
    s3_configs: {},
    starhub_configs: {},
  })

  const stringifyObject = (obj) => {
    return JSON.stringify(obj).replace(/,/g, ',\n').replace('{', '{\n').replace('}', '\n}')
  }

  const fetchSystemConfig = async () => {
    const res = await csrfFetch('/internal_api/admin/system_config')
    if (res.ok) {
      body = await res.json()
      systemConfigs.value.feature_flags = body.system_configs.feature_flags || {}
      systemConfigs.value.general_configs = body.system_configs.general_configs || {}
      systemConfigs.value.license_configs = body.system_configs.license_configs || {}
      systemConfigs.value.oidc_configs = body.system_configs.oidc_configs || {}
      systemConfigs.value.s3_configs = body.system_configs.s3_configs || {}
      systemConfigs.value.starhub_configs = body.system_configs.starhub_configs || {}
    } else {
      console.log('Failed to fetch system config')
    }
  }

  onMounted(() => {
    fetchSystemConfig()
  })
</script>