<template>
  <div class="w-full bg-[#FAFCFF] pt-9 pb-[60px] xl:px-10 md:px-0 md:pb-6 md:h-auto">
    <div class="mx-auto max-w-[1280px]">
      <model-header
        :private="model.data.private"
        :license="model.data.license"
        :name="model.data.name"
        :nickname="model.data.nickname"
        :desc="model.data.description"
        :path="model.data.path"
        :tags="tags"
        :avatar="avatar"
        :owner-url="ownerUrl"
      />
    </div>
  </div>
  <div class="mx-auto max-w-[1280px] mt-[-40px] xl:px-10 md:px-0">
    <model-tabs
      :blob="blob.data"
      :local-model-id="localModelId"
      :model-path="model.data.path"
      :model-nickname="localModel.nickname"
      :model-desc="localModel.desc"
      :model-default-branch="model.data.default_branch"
      :model-private="model.data.private"
      :model-detail="model.data"
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
    />
  </div>
</template>

<script setup>
import ModelHeader from './ModelHeader.vue'
import ModelTabs from './ModelTabs.vue'
import { onMounted, ref } from 'vue';

const props = defineProps({
  localModelId: String,
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
  canWrite: Boolean
})
onMounted(() => {
  console.log(props.tagList);
  console.log(props.settingsVisibility);
  })
</script>

<style scoped>
  body {
    background: #fff !important;
  }
</style>
