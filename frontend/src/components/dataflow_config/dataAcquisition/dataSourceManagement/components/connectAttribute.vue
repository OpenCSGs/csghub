<template>
    <div class="connect-attribute">
      <!-- 连接属性 -->
      <div
        v-for="(item, index) in mappingRules"
        :key="index"
        class="connect-row"
      >
        <el-form label-position="top">
          <el-row :gutter="20" class="mt-[16px]">
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <el-form-item>
                <template #label>
                  <p class="text-gray-500 text-xs mt-[12px]">属性名</p>
                </template>
                <el-input
                  v-model="item.sourceField"
                  placeholder="请输入属性名"
                  clearable />
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
              <el-form-item>
                <template #label>
                  <p class="text-gray-500 text-xs mt-[12px]">属性值</p>
                </template>
                <el-input
                  v-model="item.targetField"
                  placeholder="请输入属性值"
                  clearable />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      
      <span
        class="text-sm text-sm mt-[16px] ml-[10px]"
        @click="addMappingRule"
        style="color: #394FB6; cursor: pointer;">
        + 添加属性
      </span>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  // 响应式数据：存储映射规则列表
  const mappingRules = ref([
    { sourceField: '', targetField: '' },
    { sourceField: '', targetField: '' }
  ])
  
  // 新增一条空的映射规则
  const addMappingRule = () => {
    mappingRules.value.push({ sourceField: '', targetField: '' })
  }
  </script>
  
  <style scoped>
  .connect-attribute {
    width: 100%;
    padding: 0px 20px 15px 20px;
    background-color: #F7F9FA;
    border-radius: 6px;
  }
  .connect-row {
    margin-bottom: 12px;
  }
  .input-item {
    width: 50%;
    margin: 0 8px;
  }
  .separator {
    margin: 0 4px;
  }
  .add-btn {
    margin-top: 12px;
  }
  </style>