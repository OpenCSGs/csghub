<template>
  <div class="w-full bg-[#FCFCFD] pt-9 pb-[60px] xl:px-10 md:px-0 md:pb-6 md:h-auto">
    <div class="mx-auto max-w-[1280px]">
      <repo-header
        :private="code.data.private"
        :license="code.data.license"
        :name="code.data.name"
        :nickname="code.data.nickname"
        :desc="code.data.description"
        :path="code.data.path"
        :tags="tags"
        :avatar="avatar"
        :owner-url="ownerUrl"
        :repoId="code.data.repository_id"
        :totalLikes="code.data.likes"
        :hasLike="code.data.user_likes"
        repo-type="code"
      />
    </div>
  </div>
  <div class="mx-auto max-w-[1280px] mt-[-40px] xl:px-10 md:px-0">
    <repo-tabs
      :blob="blob.data"
      :local-repo-id="localRepoId"
      :repo-detail="code.data"
      :last-commit="lastCommit.data"
      :branches="branches.data"
      :current-branch="currentBranch"
      :current-path="currentPath"
      :default-tab="defaultTab"
      :actionName="actionName"
      :settingsVisibility="settingsVisibility"
      :can-write="canWrite"
      :userName="userName"
      repo-type="code"
      :commitId="commitId"
    />
  </div>
</template>

<script setup>
  import RepoHeader from '../shared/RepoHeader.vue'
  import RepoTabs from '../shared/RepoTabs.vue'
  import useRepoDetailStore from '../../stores/RepoDetailStore'

  const props = defineProps({
    localRepoId: String,
    defaultTab: String,
    code: Object,
    lastCommit: Object,
    branches: Object,
    tags: Object,
    currentBranch: String,
    currentPath: String,
    blob: Object,
    actionName: String,
    settingsVisibility: Boolean,
    avatar: String,
    ownerUrl: String,
    canWrite: Boolean,
    userName: String,
    commitId: String
  })
  const repoDetailStore = useRepoDetailStore()
  repoDetailStore.initialize(props.code.data)
</script>

<style scoped>
  body {
    background: #fff !important;
  }
</style>
