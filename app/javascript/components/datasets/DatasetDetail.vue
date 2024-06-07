<template>
  <div class="w-full bg-[#FCFCFD] pt-9 pb-[60px] xl:px-10 md:px-0 md:pb-6 md:h-auto">
    <div class="mx-auto max-w-[1280px]">
      <repo-header
        :private="dataset.data.private"
        :license="dataset.data.license"
        :name="dataset.data.name"
        :nickname="dataset.data.nickname"
        :desc="dataset.data.description"
        :path="dataset.data.path"
        :avatar="avatar"
        :tags="tags"
        :owner-url="ownerUrl"
        :repoId="dataset.data.repository_id"
        :totalLikes="dataset.data.likes"
        :hasLike="dataset.data.user_likes"
        repo-type="dataset"
      />
    </div>
  </div>
  <div class="mx-auto max-w-[1280px] mt-[-40px] xl:px-10 md:px-0">
    <repo-tabs
      :blob="blob.data"
      :local-repo-id="localRepoId"
      :repo-detail="dataset.data"
      :last-commit="lastCommit.data"
      :branches="branches.data"
      :current-branch="currentBranch"
      :current-path="currentPath"
      :default-tab="defaultTab"
      :actionName="actionName"
      :settingsVisibility="settingsVisibility"
      :can-write="canWrite"
      :tags="tags"
      :tag-list="tagList"
      :userName="userName"
      :userToken="userToken"
      repo-type="dataset"
      :commitId="commitId"
    />
  </div>
</template>

<script setup>
  import RepoHeader from '../shared/RepoHeader.vue';
  import RepoTabs from '../shared/RepoTabs.vue'
  import useRepoDetailStore from '../../stores/RepoDetailStore'

  const props = defineProps({
    dataset: Object,
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
    tagList: Object,
    ownerUrl: String,
    canWrite: Boolean,
    userName: String,
    userToken: String,
    commitId: String
  })
  const repoDetailStore = useRepoDetailStore()
  repoDetailStore.initialize(props.dataset.data)
</script>

<style scoped>
  body {
    background: #fff !important;
  }
</style>
