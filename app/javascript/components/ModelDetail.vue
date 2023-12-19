<template>
  <div class="w-full h-[170px] bg-[#FAFCFF] pt-9 xl:px-10 md:px-0 md:pb-6">
    <div class="mx-auto max-w-[1280px]">
      <model-header :license="model.data.license" :name="model.data.name" :path="model.data.path" />
    </div>
  </div>
  <div class="mx-auto max-w-[1280px] mt-[-40px] xl:px-10 md:px-0">
    <model-tabs
      :local-model-id="localModelId"
      :model-path="model.data.path"
      :model-default-branch="model.data.default_branch"
      :model-private="model.data.private"
      :model-detail="model.data"
      :files="files.data"
      :last-commit="lastCommit.data"
      :branches="branches.data"
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
  localModelId: String
})
</script>

<style scoped>
  body {
    background: #fff !important;
  }
</style>
