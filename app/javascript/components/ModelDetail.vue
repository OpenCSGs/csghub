<template>
  <div class="w-full h-[170px] bg-[#FAFCFF] pt-9 xl:px-10 md:px-0 md:pb-6">
    <div class="mx-auto max-w-[1280px]">
      <model-header
        :private="model.data.private"
        :license="model.data.license"
        :name="model.data.name"
        :path="model.data.path"
        :avatar="avatar"
      />
    </div>
  </div>
  <div class="mx-auto max-w-[1280px] mt-[-40px] xl:px-10 md:px-0">
    <model-tabs
      :content="content.data"
      :local-model-id="localModelId"
      :model-path="model.data.path"
      :model-default-branch="model.data.default_branch"
      :model-private="model.data.private"
      :model-detail="model.data"
      :files="files.data"
      :last-commit="lastCommit.data"
      :branches="branches.data"
      :current-branch="currentBranch"
      :current-path="currentPath"
      :default-tab="defaultTab"
      :readme="readme.data"
      :actionName="actionName"
    />
  </div>
</template>

<script setup>
import ModelHeader from './models/ModelHeader.vue'
import ModelTabs from './models/ModelTabs.vue'

const props = defineProps({
  localModelId: String,
  defaultTab: String,
  model: Object,
  files: Object,
  lastCommit: Object,
  branches: Object,
  currentBranch: String,
  currentPath: String,
  readme: Object,
  content: Object,
  actionName: String,
  avatar: String
})
</script>

<style scoped>
  body {
    background: #fff !important;
  }
</style>
