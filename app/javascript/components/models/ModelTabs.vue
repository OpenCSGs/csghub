<template>
  <div class="relative">
    <ModelClone :clone-http-url="modelDetail.http_clone_url" :clone-ssh-url="modelDetail.ssh_clone_url" />
    <TabContainer :default-tab="defaultTab" :settingsVisibility="settingsVisibility">
      <template #summary>
        <model-summary :namespace-path="modelDetail.path" :download-count="modelDetail.downloads" />
      </template>
      <template #files v-if="actionName === 'blob'">
        <model-blob
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
        <new-upload-file
          :current-branch="currentBranch"
          :repo-name="modelDetail.name"
          :namespace-path="modelDetail.path"
        />
      </template>
      <template #files v-if="actionName === 'show' || actionName === 'files'">
        <model-files
          :branches="branches"
          :current-branch="currentBranch"
          :current-path="currentPath"
          :namespace-path="modelDetail.path"
          :can-write="canWrite"
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
import ModelClone from './ModelClone.vue'
import TabContainer from '../shared/TabContainer.vue'
import ModelSummary from './ModelSummary.vue'
import ModelFiles from './ModelFiles.vue'
import CommunityPage from '../community/CommunityPage.vue'
import Settings from './ModelSettings.vue'
import ModelBlob from './ModelBlob.vue'
import NewUploadFile from '../shared/file/NewUploadFile.vue'
import NewFile from '../shared/NewFile.vue'

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
