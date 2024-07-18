<template>
  <div class="w-full bg-[#FCFCFD] pt-9 pb-[60px] xl:px-10 md:px-0 md:pb-6 md:h-auto border-b border-[#EBEEF5]">
    <div class="mx-auto max-w-[1280px]">
      <repo-header
        :license="model.data.license"
        :name="model.data.name"
        :nickname="model.data.nickname"
        :desc="model.data.description"
        :path="model.data.path"
        :tags="tags"
        :avatar="avatar"
        :owner-url="ownerUrl"
        :repoId="model.data.repository_id"
        :totalLikes="model.data.likes"
        :hasLike="model.data.user_likes"
        repo-type="model"
      />
    </div>
  </div>
  <div class="mx-auto max-w-[1280px] mt-[-40px] xl:px-10 md:px-0">
    <repo-tabs
      :blob="blob.data"
      :local-repo-id="localRepoId"
      :repo-detail="model.data"
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
      :commitId="commitId"
      repo-type="model"
      :admin="admin"
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
    model: Object,
    tagList: Object,
    localModel: Object,
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
    commitId: String,
    admin: Boolean
  })
  const repoDetailStore = useRepoDetailStore()
  repoDetailStore.initialize(props.model.data)
</script>

<style scoped>
  body {
    background: #fff !important;
  }
</style>