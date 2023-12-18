<template>
  <div class="relative">
    <ModelClone :clone-http-url="modelDetail.http_clone_url" :clone-ssh-url="modelDetail.ssh_clone_url" />
    <TabContainer :default-tab="defaultTab">
      <template #summary>
        <model-summary :introduction="modelDetail.introduction" :download-count="modelDetail.download_count" />
      </template>
      <template #files>
        <model-files
          :files="files"
          :last-commit="lastCommit"
          :branches="branches"
          :current-branch="currentBranch"
          :current-path="currentPath"
          :namespace-path="modelDetail.path"
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
import ModelClone from './ModelClone.vue'
import TabContainer from '../shared/TabContainer.vue'
import ModelSummary from './ModelSummary.vue'
import ModelFiles from './ModelFiles.vue'

const props = defineProps({
  modelDetail: Object,
  files: Object,
  lastCommit: Object,
  branches: Object,
  currentBranch: String,
  currentPath: String,
  defaultTab: String,
})
</script>
