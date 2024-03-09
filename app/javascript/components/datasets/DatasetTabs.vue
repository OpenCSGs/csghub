<template>
  <div class="relative">
    <repo-clone repo-type="dataset" :http-clone-url="datasetDetail.repository.http_clone_url" :ssh-clone-url="datasetDetail.repository.ssh_clone_url"/>
    <TabContainer :default-tab="defaultTab" :settingsVisibility="settingsVisibility">
      <template #summary>
        <repo-summary
          repo-type="dataset"
          :download-count="datasetDetail.downloads"
          :namespace-path="datasetDetail.path"
        />
      </template>
      <template #files v-if="actionName === 'blob'">
        <blob
          :content="content"
          :last-commit="lastCommit"
          :branches="branches"
          :current-branch="currentBranch"
          :current-path="currentPath"
          :namespace-path="datasetDetail.path"
        />
      </template>
      <template #files v-if="actionName === 'new_file'">
        <new-file
          :current-branch="currentBranch"
          :repo-name="datasetDetail.name"
          :namespace-path="datasetDetail.path"
          originalCodeContent=""
        />
      </template>
      <template #files v-if="actionName === 'upload_file'">
        <upload-file
          :current-branch="currentBranch"
          :repo-name="datasetDetail.name"
          :namespace-path="datasetDetail.path"
        />
      </template>
      <template #files v-if="actionName === 'show' || actionName === 'files'">
        <dataset-files
          :branches="branches"
          :current-branch="currentBranch"
          :current-path="currentPath"
          :namespace-path="datasetDetail.path"
          :can-write="canWrite"
        />
      </template>
      <template #community>
        <CommunityPage type="Dataset" :localModelId="localDatasetId"></CommunityPage>
      </template>
      <template v-if="settingsVisibility" #settings>
        <Settings
          :path="datasetPath"
          :dataset-nickname="datasetNickname"
          :dataset-desc="datasetDesc"
          :default_branch="datasetDefaultBranch"
          :private="datasetPrivate"/>
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
import RepoSummary from '../shared/RepoSummary.vue'
import DatasetFiles from './DatasetFiles.vue'
import CommunityPage from '../community/CommunityPage.vue'
import Settings from './DatasetSettings.vue'
import RepoClone from '../shared/RepoClone.vue'
import UploadFile from '../shared/UploadFile.vue'
import NewFile from '../shared/NewFile.vue'
import Blob from '../shared/Blob.vue'

const props = defineProps({
  localDatasetId: String,
  datasetPath: String,
  datasetNickname: String,
  datasetDesc: String,
  datasetDefaultBranch: String,
  datasetPrivate: Boolean,
  datasetDetail: Object,
  lastCommit: Object,
  branches: Object,
  currentBranch: String,
  currentPath: String,
  defaultTab: String,
  content: String,
  actionName: String,
  settingsVisibility: Boolean,
  canWrite: Boolean
})
</script>
