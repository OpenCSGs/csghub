<template>
  <div class="relative">
    <TabContainer :default-tab="defaultTab">
      <template #summary>
        <dataset-summary
          :introduction="datasetDetail.introduction"
          :download-count="datasetDetail.download_count"
          :http-clone-url="datasetDetail.http_clone_url"
          :ssh-clone-url="datasetDetail.ssh_clone_url"
        />
      </template>
      <template #files>
        <dataset-files
          :files="files"
          :last-commit="lastCommit"
          :branches="branches"
          :current-branch="currentBranch"
          :current-path="currentPath"
          :namespace-path="datasetDetail.path"
        />
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
  datasetDetail: Object,
  files: Object,
  lastCommit: Object,
  branches: Object,
  currentBranch: String,
  currentPath: String,
  defaultTab: String,
})
</script>
