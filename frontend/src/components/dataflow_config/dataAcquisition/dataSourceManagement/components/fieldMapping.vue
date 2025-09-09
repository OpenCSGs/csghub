<template>
    <div class="mapping-container">
      <!-- 映射规则列表 -->
      <div
        v-for="(item, index) in mappingRules"
        :key="index"
        class="mapping-row"
      >
        <el-input
          v-model="item.sourceField"
          placeholder="文件字段"
          class="input-item"
        />
        <span class="separator">:</span>
        <el-input
          v-model="item.targetField"
          placeholder="目标字段"
          class="input-item"
        />
      </div>
      
      <span
        class="text-sm text-sm mt-[16px] ml-[10px]"
        @click="addMappingRule"
        style="color: #394FB6; cursor: pointer;">
        + 添加映射规则
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
  .mapping-container {
    width: 100%;
    padding: 20px 10px;
    background-color: #F7F9FA;
    border-radius: 6px;
  }
  .mapping-row {
    display: flex;
    align-items: center;
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