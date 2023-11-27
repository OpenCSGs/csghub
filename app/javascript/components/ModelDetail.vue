<template>
  <div class="w-full h-[170px] bg-[#FAFCFF] pt-9 sm:pb-6">
    <div class="mx-auto max-w-[1280px]">
      <model-header :license="model.detail.license" :name="model.detail.name" :path="model.detail.path" />
    </div>
  </div>
  <div class="mx-auto max-w-[1280px] mt-[-40px]">
    <model-tabs :introduction="model.detail.introduction" :files="files.tree" :last-commit="lastCommit.last_commit" />
  </div>
</template>

<script setup>
import ModelHeader from './models/ModelHeader.vue';
import ModelTabs from './models/ModelTabs.vue';

const props = defineProps({
  model: Object,
  files: Object,
  lastCommit: Object,
})
</script>
