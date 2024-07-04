<template>
  <div class="mb-[30px]">
    <h3 class="text-[18px] font-[500] mb-[8px]">Application ENV</h3>
    <p class="text-[#606266]">{{ systemConfigs.application_env }}</p>
  </div>

  <hr />

  <div class="my-[30px]">
    <h3 class="text-[18px] font-[500] mb-[8px]">Feature Flags</h3>
    <el-form-item label="on_premise">
      <el-select
        v-model="systemConfigs.feature_flags.on_premise"
        size="small"
        style="width: 340px"
      >
        <el-option
          v-for="item in ['false', 'true']"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="info" size="small" @click="">Update</el-button>
    </el-form-item>
  </div>

  <hr />

  <div class="my-[30px]">
    <h3 class="text-[18px] font-[500] mb-[8px]">General Configs</h3>
    <el-form-item label="docs_url">
      <el-input
        v-model="systemConfigs.general_configs.docs_url"
        style="width: 580px"
        size="small"
      ></el-input>
    </el-form-item>
    <el-form-item label="starcloud_url">
      <el-input
        v-model="systemConfigs.general_configs.starcloud_url"
        style="width: 580px"
        size="small"
      ></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="info" size="small" @click="">Update</el-button>
    </el-form-item>
  </div>

  <hr />

  <div class="my-[30px]">
    <h3 class="text-[18px] font-[500] mb-[8px]">General Configs</h3>
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

  const fetchSystemConfig = async () => {
    const res = await csrfFetch('/internal_api/admin/system_config')
    if (res.ok) {
      body = await res.json()
      systemConfigs.value = body.system_configs
    } else {
      console.log('Failed to fetch system config')
    }
  }

  onMounted(() => {
    fetchSystemConfig()
  })
</script>