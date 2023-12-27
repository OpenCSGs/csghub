<template>
  <div class="relative">
    <DatasetClone :http-clone-url="datasetDetail.http_clone_url" :ssh-clone-url="datasetDetail.ssh_clone_url" />
    <TabContainer :default-tab="defaultTab" :settingsVisibility="settingsVisibility">
      <template #summary>
        <dataset-summary
          :introduction="datasetDetail.introduction"
          :download-count="datasetDetail.download_count"
          :http-clone-url="datasetDetail.http_clone_url"
          :ssh-clone-url="datasetDetail.ssh_clone_url"
          :readme="readme"
        />
      </template>
      <template #files v-if="actionName !== 'blob'">
        <dataset-files
          :files="files"
          :last-commit="lastCommit"
          :branches="branches"
          :current-branch="currentBranch"
          :current-path="currentPath"
          :namespace-path="datasetDetail.path"
        />
      </template>
      <template #files v-if="actionName === 'blob'">
        <dataset-blob
          :content="content"
          :last-commit="lastCommit"
          :branches="branches"
          :current-branch="currentBranch"
          :current-path="currentPath"
          :namespace-path="datasetDetail.path"
        />
      </template>
      <template #settings>
        <Settings :path="datasetPath" :default_branch="datasetDefaultBranch" :private="datasetPrivate"/>
      </template>
      <template v-if="settingsVisibility" #community>
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
import Settings from './DatasetSettings.vue'
import DatasetBlob from './DatasetBlob.vue'
import DatasetClone from './DatasetClone.vue';


const props = defineProps({
  localDatasetId: String,
  userId: String,
  datasetPath: String,
  datasetDefaultBranch: String,
  datasetPrivate: Boolean,
  datasetDetail: Object,
  files: Object,
  lastCommit: Object,
  branches: Object,
  currentBranch: String,
  currentPath: String,
  defaultTab: String,
  readme: String,
  content: String,
  actionName: String,
  settingsVisibility: Boolean
})
</script>
