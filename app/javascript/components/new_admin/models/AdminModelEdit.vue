<template>
  <!-- visibility -->
  <div class="my-[30px]">
    <h3 class="text-[18px] font-[500] mb-[8px]">Visibility</h3>
    <el-form-item>
      <el-select 
        v-model="model.private"
        placeholder="Select"
        size="large"
        class="w-full"
      >
        <el-option label="Private" :value="true" />
        <el-option label="Public" :value="false" />    
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button
        type="info"
        size="small"
        @click="updateModel({ private: model.private })"
        >Update</el-button
      >
    </el-form-item>
  </div>

  <hr />

  <!-- base_model -->
  <div class="my-[30px]">
    <h3 class="text-[18px] font-[500] mb-[8px]">Base Model</h3>
    <el-form-item>
      <el-autocomplete
        clearable
        v-model="model.base_model"
        :fetch-suggestions="fetchBaseModels"
        size="large"
      />
    </el-form-item>
    <el-form-item>
      <el-button
        type="info"
        size="small"
        @click="updateModel({ base_model: model.base_model })"
        >Update</el-button
      >
    </el-form-item>
  </div>
</template>


<script setup>
  import jwtFetch from '../../../packs/jwtFetch'
  import { ref, onMounted, inject } from 'vue'
  import { useRoute } from 'vue-router'
  import { ElMessage } from 'element-plus'

  const csghubServer = inject('csghubServer')
  const route = useRoute()
  const model = ref({
    private: null,
    base_model: ""
  })
  
  const updateModel = async (payload) => {
    const options = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }
    const res = await jwtFetch(`${csghubServer}/api/v1/models/${route.params.namespace}/${route.params.name}`, options)
    
    if (res.ok) {
      ElMessage({
        message: '更新成功！',
        type: 'success'
      })
    } else {
      res.json().then((error) => {
        ElMessage({
          message: error.msg,
          type: 'error'
        })
      })
    }
  }

  const fetchModel = async () => {
    const response = await jwtFetch(
      `${csghubServer}/api/v1/models/${route.params.namespace}/${route.params.name}`
    )
    if (response.ok) {
      const res_json = await response.json()
      model.value.private = res_json.data.private
      model.value.base_model = res_json.data.base_model
    } else {
      ElMessage.error('Failed to fetch model')
    }
  }

  const fetchBaseModels = async (query, cb) => {
    const res = await jwtFetch(`${csghubServer}/api/v1/runtime_framework/models?search=${query}`);
    if (!res.ok) {
      ElMessage({ message: t("all.fetchError"), type: "warning" });
    } else {
      res.json().then((body) => {
        const paths = body.data?.map((model) => {
          return { key: model.path, value: model.path };
        });
        cb(paths);
      });
    }
  };

  onMounted(() => {
    fetchModel()
  })
</script>