<template>
  <div class="w-full h-[170px] bg-[#FAFCFF] pt-9 xl:px-10 md:px-0 md:pb-6 md:h-auto">
    <div class="mx-auto max-w-[1280px]">
      <dataset-header :license="dataset.detail.license" :name="dataset.detail.name" :path="dataset.detail.path" />
    </div>
  </div>
  <div class="mx-auto max-w-[1280px] mt-[-40px] xl:px-10 md:px-0">
    <dataset-tabs
      :introduction="dataset.detail.introduction"
      :download-count="dataset.detail.download_count"
      :files="files.tree"
      :last-commit="lastCommit.last_commit"
      :branches="branches.branches"
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
})
</script>

<style>
  body {
    background: #fff !important;
  }
</style>
