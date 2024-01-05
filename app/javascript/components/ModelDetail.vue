<template>
  <div class="w-full bg-[#FAFCFF] pt-9 pb-[60px] xl:px-10 md:px-0 md:pb-6 md:h-auto">
    <div class="mx-auto max-w-[1280px]">
      <model-header
        :private="model.data.private"
        :license="model.data.license"
        :name="model.data.name"
        :path="model.data.path"
        :tags="tags"
        :avatar="avatar"
      />
    </div>
  </div>
  <div class="mx-auto max-w-[1280px] mt-[-40px] xl:px-10 md:px-0">
    <model-tabs
      :content="content.data"
      :local-model-id="localModelId"
      :user-id="userId"
      :model-path="model.data.path"
      :model-default-branch="model.data.default_branch"
      :model-private="model.data.private"
      :model-detail="model.data"
      :last-commit="lastCommit.data"
      :branches="branches.data"
      :current-branch="currentBranch"
      :current-path="currentPath"
      :default-tab="defaultTab"
      :readme="readme.data"
      :actionName="actionName"
      :settingsVisibility="settingsVisibility"
    />
  </div>
</template>

<script setup>
import ModelHeader from './models/ModelHeader.vue'
import ModelTabs from './models/ModelTabs.vue'

const props = defineProps({
  localModelId: String,
  userId: String,
  defaultTab: String,
  model: Object,
  lastCommit: Object,
  branches: Object,
  tags: Object,
  currentBranch: String,
  currentPath: String,
  readme: Object,
  content: Object,
  actionName: String,
  settingsVisibility: Boolean,
  avatar: String
})
</script>

<style scoped>
  body {
    background: #fff !important;
  }
</style>
