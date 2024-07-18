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
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />        
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button
        type="info"
        size="small"
        @click="updateModelVisibility(model.private)"
        >Update</el-button
      >
    </el-form-item>
  </div>

  <hr />

  <!-- base information -->
  <div class="my-[30px]">
    <h3 class="text-[18px] font-[500] mb-[8px]">Base Information</h3>
    <el-form-item>
      <textarea
        ref="generalConfigsRef"
        class="system-config-obj-box"
        :value="model.base_model"
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
</template>


<script setup>
  import jwtFetch from '../../../packs/jwtFetch'
  import { ref, onMounted, inject } from 'vue'
  import { useRoute } from 'vue-router'
  import { ElMessage } from 'element-plus'

  const csghubServer = inject('csghubServer')

  const updateModelVisibility = () => {
      if (!!this.theModelDesc.trim()) {
        const payload = {desc: this.theModelDesc}
        updateModel(payload)
      } else {
        ElMessage({ message: this.$t('models.edit.needModelDesc'), type: "warning" })
      }
    },

  const updateModel = async (payload) => {
    console.log(payload);
    const options = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }
    const res = await jwtFetch(`${csghubServer}/api/v1/models/${namespace}/${repo_name}`, options)


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

  options = ref([{value: true, label: 'Private'},
                 {value: false, label:  'Public'}])

  const route = useRoute()
  const model = ref({
    private: false,
    base_model: ""
  })

  const fetchModel = async () => {
    const response = await jwtFetch(
      `${csghubServer}/api/v1/models/${route.params.namespace}/${route.params.name}`
    )
    if (response.ok) {
      const res_json = await response.json()
      model.value = res_json.data
      // model.value.visibility = model.private == false ? 'public' : 'private'
    } else {
      ElMessage.error('Failed to fetch model')
    }
  }

  onMounted(() => {
    fetchModel()
  })
</script>