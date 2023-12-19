<template>
  <div class="relative">
    <ModelClone :clone-http-url="modelDetail.http_clone_url" :clone-ssh-url="modelDetail.ssh_clone_url" />
    <TabContainer>
      <template #summary>
        <model-summary :readme="readme" :download-count="modelDetail.download_count" />
      </template>
      <template #files>
        <model-files :files="files" :last-commit="lastCommit" :branches="branches" />
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
  readme: String
})
</script>
