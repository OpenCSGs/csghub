<template>
  <div class="relative">
    <repo-clone repo-type="model" :clone-http-url="modelDetail.repository.http_clone_url" :clone-ssh-url="modelDetail.repository.ssh_clone_url" />
    <TabContainer :default-tab="defaultTab" :settingsVisibility="settingsVisibility">
      <template #summary>
        <repo-summary repo-type="model" :namespace-path="modelDetail.path" :download-count="modelDetail.downloads" />
      </template>
      <template #files v-if="actionName === 'blob'">
        <blob
          :content="content"
          :last-commit="lastCommit"
          :branches="branches"
          :current-branch="currentBranch"
          :current-path="currentPath"
          :namespace-path="modelDetail.path"
        />
      </template>
      <template #files v-if="actionName === 'new_file'">
        <new-file
          :current-branch="currentBranch"
          :repo-name="modelDetail.name"
          :namespace-path="modelDetail.path"
          originalCodeContent=""
        />
      </template>
      <template #files v-if="actionName === 'upload_file'">
        <upload-file
          :current-branch="currentBranch"
          :repo-name="modelDetail.name"
          :namespace-path="modelDetail.path"
        />
      </template>
      <template #files v-if="actionName === 'show' || actionName === 'files'">
        <repo-files
          :branches="branches"
          :current-branch="currentBranch"
          :current-path="currentPath"
          :namespace-path="modelDetail.path"
          :can-write="canWrite"
          repo-type="model"
        />
      </template>
      <template #community>
        <CommunityPage type="Model" :localModelId="localModelId" ></CommunityPage>
      </template>
      <template v-if="settingsVisibility" #settings>
        <Settings
          :path="modelPath"
          :model-nickname="modelNickname"
          :model-desc="modelDesc"
          :default_branch="modelDefaultBranch"
          :private="modelPrivate" />
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
import RepoClone from '../shared/RepoClone.vue'
import TabContainer from '../shared/TabContainer.vue'
import RepoSummary from '../shared/RepoSummary.vue'
import RepoFiles from '../shared/RepoFiles.vue'
import CommunityPage from '../community/CommunityPage.vue'
import Settings from './ModelSettings.vue'
import UploadFile from '../shared/UploadFile.vue'
import NewFile from '../shared/NewFile.vue'
import Blob from '../shared/Blob.vue'

const props = defineProps({
  localModelId: String,
  modelPath: String,
  modelNickname: String,
  modelDesc: String,
  modelDefaultBranch: String,
  modelPrivate: Boolean,
  modelDetail: Object,
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
