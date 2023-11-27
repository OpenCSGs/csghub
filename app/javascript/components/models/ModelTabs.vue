<template>
  <div class="relative">
    <div class="flex items-center absolute top-0 right-0 sm:relative sm:pl-5 sm:pb-4">
      <div class="rounded border border-[#DCDFE6] flex items-center justify-center w-[46px] h-8 mr-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M6.70833 4.08317C7.51042 4.08317 8.16667 3.42692 8.16667 2.62484C8.16667 1.82275 7.51042 1.1665 6.70833 1.1665C5.90625 1.1665 5.25 1.82275 5.25 2.62484C5.25 3.42692 5.90625 4.08317 6.70833 4.08317Z" fill="#606266"/>
          <path d="M6.70833 5.5415C5.90625 5.5415 5.25 6.19775 5.25 6.99984C5.25 7.80192 5.90625 8.45817 6.70833 8.45817C7.51042 8.45817 8.16667 7.80192 8.16667 6.99984C8.16667 6.19775 7.51042 5.5415 6.70833 5.5415Z" fill="#606266"/>
          <path d="M5.25 11.3748C5.25 10.5728 5.90625 9.9165 6.70833 9.9165C7.51042 9.9165 8.16667 10.5728 8.16667 11.3748C8.16667 12.1769 7.51042 12.8332 6.70833 12.8332C5.90625 12.8332 5.25 12.1769 5.25 11.3748Z" fill="#606266"/>
        </svg>
      </div>
      <div class="rounded border border-[#DCDFE6] flex items-center justify-center w-[158px] h-8">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M4.6665 3.5L1.1665 7L4.6665 10.5M9.33317 3.5L12.8332 7L9.33317 10.5" stroke="#606266" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <div class="ml-2 text-[#606266] font-medium">Use with library</div>
      </div>
    </div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="模型介绍" name="summary">
        <model-summary :introduction="introduction" />
      </el-tab-pane>
      <el-tab-pane label="模型文件" name="files">
        <model-files :files="files" :last-commit="lastCommit" />
      </el-tab-pane>
      <el-tab-pane label="社区" name="community">community</el-tab-pane>
      <el-tab-pane label="设置" name="settings">settings</el-tab-pane>
    </el-tabs>
  </div>
</template>

<style>
  .el-tabs__header {
    margin-bottom: 0;
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
import ModelSummary from './ModelSummary.vue'
import ModelFiles from './ModelFiles.vue'

const props = defineProps({
  files: Array,
  introduction: String,
  lastCommit: Object,
})

const activeName = ref('summary')

const handleClick = (tab, event) => {
  // console.log(tab, event)
}
</script>
