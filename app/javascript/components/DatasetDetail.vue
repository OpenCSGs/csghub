<template>
  <div class="w-full h-[170px] bg-[#FAFCFF] pt-9 xl:px-10 md:px-0 md:pb-6 md:h-auto">
    <div class="mx-auto max-w-[1280px]">
      <dataset-header :license="dataset.data.license" :name="dataset.data.name" :path="dataset.data.path"/>
    </div>
  </div>
  <div class="mx-auto max-w-[1280px] mt-[-40px] xl:px-10 md:px-0">
    <dataset-tabs
      :dataset-path="dataset.data.path"
      :dataset-default-branch="dataset.data.default_branch"
      :dataset-private="dataset.data.private"
      :dataset-detail="dataset.data"
      :files="files.data"
      :last-commit="lastCommit.data"
      :branches="branches.data"
      :current-branch="currentBranch"
      :current-path="currentPath"
      :default-tab="defaultTab"
      :readme="readme.data"
    />
  </div>
</template>

<script setup>
import DatasetHeader from './datasets/DatasetHeader.vue';
import DatasetTabs from './datasets/DatasetTabs.vue';

const props = defineProps({
  dataset: Object,
  files: Object,
  lastCommit: Object,
  branches: Object,
  currentBranch: String,
  currentPath: String,
  defaultTab: String,
  readme: Object
})
</script>

<style scoped>
body {
  background: #fff !important;
}
</style>
