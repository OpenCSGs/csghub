<template>
  <div class="relative">
    <repo-clone
      :repoType="repoType"
      :httpCloneUrl="repoDetail.repository.http_clone_url"
      :sshCloneUrl="repoDetail.repository.ssh_clone_url"
      :userName="userName"
      :userToken="userToken"
    />
    <tab-container :default-tab="defaultTab"
                   :settingsVisibility="settingsVisibility"
                   :repoType="repoType"
                   @tabChange="tabChange"
    >
      <template #summary>
        <InitializeGuide v-if="repoType === 'space' && appStatus === 'NoAppFile'"
                         :http-clone-url="repoDetail.repository.http_clone_url"
                         :ssh-clone-url="repoDetail.repository.ssh_clone_url"
                         :sdk="sdk"
                         :user-name="userName"
                         :user-token="userToken"
        />
        <ApplicationPage v-else-if="repoType === 'space' && appStatus === 'Running'"
                         :appEndpoint="appEndpoint"
        />
        <StoppedPage v-else-if="repoType === 'space' && (appStatus === 'Stopped' || appStatus === 'Sleeping')"
                     :appStatus="appStatus"
                     :canWrite="canWrite"
                     :path="repoDetail.path"
        />
        <BuildAndErrorPage v-else-if="repoType === 'space'"
                           :appStatus="appStatus"
                           :canWrite="canWrite"
                           @showSpaceLogs="showSpaceLogs"
        />
        <repo-summary v-else
                      :repo-type="repoType"
                      :namespace-path="repoDetail.path"
                      :download-count="repoDetail.downloads"
                      :currentBranch="currentBranch"
                      :widget-type="repoDetail.widget_type"
                      :inference-status="repoDetail.status"
        />
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
          :path="blob.path"
          :lfs="blob.lfs"
          :lfs-pointer-size="blob.lfs_pointer_size"
          :lfs-relative-path="blob.lfs_relative_path"
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
          :tag-list="tagList"
          :tags="tags" />
        <dataset-settings
          v-if="repoType === 'dataset'"
          :path="repoDetail.path"
          :dataset-nickname="repoDetail.nickname"
          :dataset-desc="repoDetail.description"
          :default_branch="repoDetail.default_branch"
          :tag-list="tagList"
          :tags="tags" />
        <application-space-settings
          v-if="repoType === 'space'"
          :path="repoDetail.path"
          :application-space-nickname="repoDetail.nickname"
          :application-space-desc="repoDetail.description"
          :default_branch="repoDetail.default_branch"
          :appStatus="appStatus"
          :cloudResource="repoDetail.hardware"
          @showSpaceLogs="showSpaceLogs" />
        <code-settings
          v-if="repoType === 'code'"
          :path="repoDetail.path"
          :code-nickname="repoDetail.nickname"
          :code-desc="repoDetail.description"
          :default_branch="repoDetail.default_branch" />
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
import CodeSettings from '../codes/CodeSettings.vue'
import UploadFile from '../shared/UploadFile.vue'
import NewFile from '../shared/NewFile.vue'
import Blob from '../shared/Blob.vue'
import EditFile from '../shared/EditFile.vue'
import InitializeGuide from '../application_spaces/InitializeGuide.vue'
import ApplicationPage from '../application_spaces/ApplicationPage.vue'
import StoppedPage from '../application_spaces/StoppedPage.vue'
import BuildAndErrorPage from '../application_spaces/BuildAndErrorPage.vue'
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
  tags: Object,
  tagList: String,
  actionName: String,
  settingsVisibility: Boolean,
  canWrite: Boolean,
  repoType: String,
  appStatus: String,
  appEndpoint: String,
  sdk: String,
  userName: String,
  userToken: String
})

const emit = defineEmits(['toggleSpaceLogsDrawer']);

onMounted(() => {
})

const repoTypeClass = computed(() => {
  if (props.repoType === 'space') {
    return 'ApplicationSpace'
  } else {
    return `${props.repoType.charAt(0).toUpperCase()}${props.repoType.slice(1).toLowerCase()}`;
  }
})

const decodedContent = props.blob?.content || ''

const showSpaceLogs = () => {
  emit('toggleSpaceLogsDrawer')
}

const tabChange = (tab) => {
  switch (tab) {
    case 'summary':
      location.href = `/${props.repoType}s/${props.repoDetail.path}`
      break
    case 'files':
      location.href = `/${props.repoType}s/${props.repoDetail.path}/files/main`
      break
    case 'community':
      location.href = `/${props.repoType}s/${props.repoDetail.path}/community`
      break
    case 'settings':
      location.href = `/${props.repoType}s/${props.repoDetail.path}/settings`
      break
    default:
      break
  }
}
</script>
