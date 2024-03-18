<template>
  <div class="relative">
    <repo-clone :repo-type="repoType" :http-clone-url="repoDetail.repository.http_clone_url" :ssh-clone-url="repoDetail.repository.ssh_clone_url" />
    <tab-container :default-tab="defaultTab"
                   :settingsVisibility="settingsVisibility"
                   :repoType="repoType"
    >
      <template #summary>
        <InitializeGuide v-if="repoType === 'application_space' && appStatus === 'NoAppFile'"
                         :http-clone-url="repoDetail.repository.http_clone_url"
                         :ssh-clone-url="repoDetail.repository.ssh_clone_url"
                         :sdk="sdk"
        />
        <ApplicationPage v-else-if="repoType === 'application_space' && appStatus === 'Running'"
                         :appEndpoint="appEndpoint"
         />
        <repo-summary v-else
                      :repo-type="repoType"
                      :namespace-path="repoDetail.path"
                      :download-count="repoDetail.downloads" />
      </template>
      <template #files v-if="actionName === 'blob'">
        <blob
          :content="decodedContent"
          :last-commit="blob.commit"
          :branches="branches"
          :current-branch="currentBranch"
          :current-path="currentPath"
          :namespace-path="repoDetail.path"
          :size="blob.size"
          :can-write="canWrite"
        />
      </template>
      <template #files v-if="actionName === 'new_file'">
        <new-file
          :current-branch="currentBranch"
          :repo-name="repoDetail.name"
          :namespace-path="repoDetail.path"
          originalCodeContent=""
        />
      </template>
      <template #files v-if="actionName === 'edit_file'">
        <edit-file
          :current-branch="currentBranch"
          :current-path="currentPath"
          :repo-name="repoDetail.name"
          :namespace-path="repoDetail.path"
          :originalCodeContent="decodedContent"
          :sha="blob.sha"
        />
      </template>
      <template #files v-if="actionName === 'upload_file'">
        <upload-file
          :current-branch="currentBranch"
          :repo-name="repoDetail.name"
          :namespace-path="repoDetail.path"
        />
      </template>
      <template #files v-if="actionName === 'show' || actionName === 'files'">
        <repo-files
          :branches="branches"
          :current-branch="currentBranch"
          :current-path="currentPath"
          :namespace-path="repoDetail.path"
          :can-write="canWrite"
          :repo-type="repoType"
        />
      </template>
      <template #community>
        <community-page :type="repoTypeClass" :localModelId="localRepoId" ></community-page>
      </template>
      <template v-if="settingsVisibility" #settings>
        <model-settings
          v-if="repoType === 'model'"
          :path="repoDetail.path"
          :model-nickname="repoDetail.nickname"
          :model-desc="repoDetail.description"
          :default_branch="repoDetail.default_branch"
          :private="repoDetail.private" />
        <dataset-settings
          v-if="repoType === 'dataset'"
          :path="repoDetail.path"
          :dataset-nickname="repoDetail.nickname"
          :dataset-desc="repoDetail.description"
          :default_branch="repoDetail.default_branch"
          :private="repoDetail.private" />
        <application-space-settings
          v-if="repoType === 'application_space'"
          :path="repoDetail.path"
          :application-space-nickname="repoDetail.nickname"
          :application-space-desc="repoDetail.description"
          :default_branch="repoDetail.default_branch"
          :appStatus="appStatus"
          :private="repoDetail.private" />
      </template>
    </tab-container>
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
import ModelSettings from '../models/ModelSettings.vue'
import DatasetSettings from '../datasets/DatasetSettings.vue'
import ApplicationSpaceSettings from '../application_spaces/ApplicationSpaceSettings.vue'
import UploadFile from '../shared/UploadFile.vue'
import NewFile from '../shared/NewFile.vue'
import Blob from '../shared/Blob.vue'
import EditFile from '../shared/EditFile.vue'
import InitializeGuide from '../application_spaces/initializeGuide.vue'
import ApplicationPage from '../application_spaces/applicationPage.vue'
import { computed, onMounted } from 'vue'

const props = defineProps({
  localRepoId: String,
  repoDetail: Object,
  lastCommit: Object,
  branches: Object,
  currentBranch: String,
  currentPath: String,
  defaultTab: String,
  blob: Object,
  actionName: String,
  settingsVisibility: Boolean,
  canWrite: Boolean,
  repoType: String,
  appStatus: String,
  appEndpoint: String,
  sdk: String
})

onMounted(() => {
  console.log(props)
})

const repoTypeClass = computed(() => {
  return `${props.repoType.charAt(0).toUpperCase()}${props.repoType.slice(1).toLowerCase()}`;
})

const decodedContent = props.blob?.content || ''
</script>
