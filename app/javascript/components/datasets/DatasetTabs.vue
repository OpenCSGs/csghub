<template>
  <div class="relative">
    <TabContainer>
      <template #summary>
        <dataset-summary :introduction="introduction" :download-count="downloadCount" />
      </template>
      <template #files>
        <dataset-files :files="files" :last-commit="lastCommit" :branches="branches" />
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
import TabContainer from '../shared/TabContainer.vue'
import DatasetSummary from './DatasetSummary.vue'
import DatasetFiles from './DatasetFiles.vue'

const props = defineProps({
  introduction: String,
  downloadCount: Number,
  files: Object,
  lastCommit: Object,
  branches: Object,
})
</script>
