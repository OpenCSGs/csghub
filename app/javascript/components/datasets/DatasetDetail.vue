<template>
  <div class="w-full bg-[#FAFCFF] pt-9 pb-[60px] xl:px-10 md:px-0 md:pb-6 md:h-auto">
    <div class="mx-auto max-w-[1280px]">
      <dataset-header
        :private="dataset.data.private"
        :license="dataset.data.license"
        :name="dataset.data.name"
        :path="dataset.data.path"
        :avatar="avatar"
        :tags="tags"
        :owner-url="ownerUrl"
      />
    </div>
  </div>
  <div class="mx-auto max-w-[1280px] mt-[-40px] xl:px-10 md:px-0">
    <dataset-tabs
      :blob="blob.data"
      :local-dataset-id="localDatasetId"
      :dataset-path="dataset.data.path"
      :dataset-nickname="localDataset.nickname"
      :dataset-desc="localDataset.desc"
      :dataset-default-branch="dataset.data.default_branch"
      :dataset-private="dataset.data.private"
      :dataset-detail="dataset.data"
      :last-commit="lastCommit.data"
      :branches="branches.data"
      :current-branch="currentBranch"
      :current-path="currentPath"
      :default-tab="defaultTab"
      :actionName="actionName"
      :settingsVisibility="settingsVisibility"
      :can-write="canWrite"
    />
  </div>
</template>

<script setup>
import DatasetHeader from './DatasetHeader.vue';
import DatasetTabs from './DatasetTabs.vue';

const props = defineProps({
  dataset: Object,
  localDataset: Object,
  files: Object,
  lastCommit: Object,
  branches: Object,
  localDatasetId: String,
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
</script>

<style scoped>
body {
  background: #fff !important;
}
</style>
