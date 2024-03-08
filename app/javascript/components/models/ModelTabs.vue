<template>
  <div class="relative">
    <ModelClone :clone-http-url="modelDetail.repository.http_clone_url" :clone-ssh-url="modelDetail.repository.ssh_clone_url" />
    <TabContainer :default-tab="defaultTab" :settingsVisibility="settingsVisibility">
      <template #summary>
        <model-summary :namespace-path="modelDetail.path"
                       :download-count="modelDetail.downloads"
                       :currentBranch="currentBranch"
                       :widget-type="modelDetail.widget_type"
                       :inference-status="modelDetail.status"
        />
      </template>
      <template #files v-if="actionName === 'blob'">
        <model-blob
          :content="decodedContent"
          :last-commit="blob.commit"
          :branches="branches"
          :current-branch="currentBranch"
          :current-path="currentPath"
          :namespace-path="modelDetail.path"
          :size="blob.size"
          :can-write="canWrite"
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
      <template #files v-if="actionName === 'edit_file'">
        <edit-file
          :current-branch="currentBranch"
          :current-path="currentPath"
          :repo-name="modelDetail.name"
          :namespace-path="modelDetail.path"
          :originalCodeContent="decodedContent"
          :sha="blob.sha"
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
import UploadFile from '../shared/UploadFile.vue'
import NewFile from '../shared/NewFile.vue'
import EditFile from '../shared/EditFile.vue'

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
  blob: Object,
  actionName: String,
  settingsVisibility: Boolean,
  canWrite: Boolean
})

const decodedContent = props.blob?.content || ''
</script>
