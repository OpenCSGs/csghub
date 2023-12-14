<template>
  <div class="relative">
    <ModelClone />
    <TabContainer>
      <template #summary>
        <model-summary :introduction="introduction" :download-count="downloadCount" />
      </template>
      <template #files>
        <model-files :files="files" :last-commit="lastCommit" :branches="branches" />
      </template>
      <template #settings>
        <Settings :path="modelPath" />
      </template>
    </TabContainer>
  </div>
</template>

<style>
  .clone-tabs .el-tabs__header {
    padding-left: 12px;
  }
</style>

<script setup>
import ModelClone from './ModelClone.vue'
import TabContainer from '../shared/TabContainer.vue'
import ModelSummary from './ModelSummary.vue'
import ModelFiles from './ModelFiles.vue'
import Settings from '../settings/settings.vue'

const props = defineProps({
  introduction: String,
  downloadCount: Number,
  modelPath: String,
  files: Object,
  lastCommit: Object,
  branches: Object,
})
</script>
