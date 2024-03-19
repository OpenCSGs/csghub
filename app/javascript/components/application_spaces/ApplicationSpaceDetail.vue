<template>
  <div class="w-full bg-[#FAFCFF] pt-9 pb-[60px] xl:px-10 md:px-0 md:pb-6 md:h-auto">
    <div class="mx-auto max-w-[1280px]">
      <repo-header
        :private="applicationSpace.data.private"
        :license="applicationSpace.data.license"
        :name="applicationSpace.data.name"
        :nickname="applicationSpace.data.nickname"
        :desc="applicationSpace.data.description"
        :path="applicationSpace.data.path"
        :appStatus="applicationSpace.data.status"
        :avatar="avatar"
        :tags="tags"
        :owner-url="ownerUrl"
        repo-type="application_space"
      />
    </div>
  </div>
  <div class="mx-auto max-w-[1280px] mt-[-40px] xl:px-10 md:px-0">
    <repo-tabs
      :blob="blob.data"
      :local-repo-id="localRepoId"
      :repo-detail="applicationSpace.data"
      :last-commit="lastCommit.data"
      :branches="branches.data"
      :appStatus="applicationSpace.data.status"
      :sdk="applicationSpace.data.sdk"
      :appEndpoint="applicationSpace.data.endpoint"
      :current-branch="currentBranch"
      :current-path="currentPath"
      :default-tab="defaultTab"
      :actionName="actionName"
      :settingsVisibility="settingsVisibility"
      :can-write="canWrite"
      repo-type="application_space"
    />
  </div>
  <div>
    <el-drawer
      v-model="spaceLogsDrawer"
      title="I am the title"
      direction="btt"
      size="70%"
      :before-close="handleClose"
    >
      <span>Hi, there!</span>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import RepoHeader from '../shared/RepoHeader.vue';
import RepoTabs from '../shared/RepoTabs.vue'

const props = defineProps({
  applicationSpace: Object,
  files: Object,
  lastCommit: Object,
  branches: Object,
  localRepoId: String,
  currentBranch: String,
  currentPath: String,
  defaultTab: String,
  blob: Object,
  actionName: String,
  avatar: String,
  settingsVisibility: Boolean,
  tags: Object,
  ownerUrl: String,
  canWrite: Boolean
})

const spaceLogsDrawer = ref(true)
</script>

<style scoped>
body {
  background: #fff !important;
}
</style>
