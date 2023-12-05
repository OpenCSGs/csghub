<template>
  <div class="relative">
    <el-tabs v-model="activeName">
      <el-tab-pane label="介绍" name="summary">
        <slot name="summary"></slot>
      </el-tab-pane>
      <el-tab-pane label="文件" name="files">
        <slot name="files"></slot>
      </el-tab-pane>
      <el-tab-pane label="社区" name="community" class="min-h-[300px]">community</el-tab-pane>
      <el-tab-pane label="设置" name="settings" class="min-h-[300px]">settings</el-tab-pane>
    </el-tabs>
  </div>
</template>

<style>
  .el-tabs__header {
    margin-bottom: 0;
    z-index: 0;
  }

  .el-tabs__nav-wrap:after {
    height: 1px;
  }

  .el-tabs__nav-scroll {
    @media screen and (max-width: 768px) {
      padding-left: 20px;
    }
  }
</style>

<script setup>
import { ref } from 'vue'

const activeName = ref('summary')
</script>
