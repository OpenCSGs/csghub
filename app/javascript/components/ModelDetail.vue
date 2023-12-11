<template>
  <div class="w-full h-[170px] bg-[#FAFCFF] pt-9 xl:px-10 md:px-0 md:pb-6">
    <div class="mx-auto max-w-[1280px]">
      <model-header :license="model.detail.license" :name="model.detail.name" :path="model.detail.path" />
    </div>
  </div>
  <div class="mx-auto max-w-[1280px] mt-[-40px] xl:px-10 md:px-0">
    <model-tabs
      :introduction="model.detail.introduction"
      :download-count="model.detail.download_count"
      :files="files.tree"
      :last-commit="lastCommit.last_commit"
      :branches="branches.branches"
    />
  </div>
</template>

<script setup>
import ModelHeader from './models/ModelHeader.vue';
import ModelTabs from './models/ModelTabs.vue';

const props = defineProps({
  model: Object,
  files: Object,
  lastCommit: Object,
  branches: Object,
})
</script>

<style scoped>
  body {
    background: #fff !important;
  }
</style>
