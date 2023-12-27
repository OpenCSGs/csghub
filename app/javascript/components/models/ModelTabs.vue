<template>
  <div class="relative">
    <ModelClone :clone-http-url="modelDetail.http_clone_url" :clone-ssh-url="modelDetail.ssh_clone_url" />
    <TabContainer :default-tab="defaultTab">
      <template #summary>
        <model-summary :readme="readme" :download-count="modelDetail.download_count" />
      </template>
      <template #files v-if="actionName !== 'blob'">
        <model-files
          :files="files"
          :last-commit="lastCommit"
          :branches="branches"
          :current-branch="currentBranch"
          :current-path="currentPath"
          :namespace-path="modelDetail.path"
        />
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
      <template #community>
        <CommunityPage type="Model" :userId="userId" :localModelId="localModelId" ></CommunityPage>
      </template>
      <template #settings>
        <Settings :path="modelPath" :default_branch="modelDefaultBranch" :private="modelPrivate" />
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

const props = defineProps({
  localModelId: String,
  userId: String,
  modelPath: String,
  modelDefaultBranch: String,
  modelPrivate: Boolean,
  modelDetail: Object,
  files: Object,
  lastCommit: Object,
  branches: Object,
  currentBranch: String,
  currentPath: String,
  defaultTab: String,
  readme: String,
  content: String,
  actionName: String
})
</script>
