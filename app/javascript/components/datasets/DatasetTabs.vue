<template>
  <div class="relative">
    <TabContainer>
      <template #summary>
        <dataset-summary
          :introduction="datasetDetail.introduction"
          :download-count="datasetDetail.download_count"
          :http-clone-url="datasetDetail.http_clone_url"
          :ssh-clone-url="datasetDetail.ssh_clone_url"
        />
      </template>
      <template #files>
        <dataset-files :files="files" :last-commit="lastCommit" :branches="branches" />
      </template>
      <template #community>
        <CommunityPage type="Dataset" :localModelId="localDatasetId" ></CommunityPage>
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
import CommunityPage from '../community/CommunityPage.vue'

const props = defineProps({
  localDatasetId: String,
  datasetDetail: Object,
  files: Object,
  lastCommit: Object,
  branches: Object,
})
</script>
