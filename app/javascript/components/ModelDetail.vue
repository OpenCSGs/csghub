<template>
  <div class="w-full h-[170px] bg-[#FAFCFF] pt-9 sm:pb-6">
    <div class="mx-auto max-w-[1280px]">
      <model-header />
    </div>
  </div>
  <div class="mx-auto max-w-[1280px] mt-[-40px]">
    <model-tabs :download-count="downloadCount" :introduction="introduction" />
  </div>
</template>

<script setup>
import ModelHeader from './models/ModelHeader.vue';
import ModelTabs from './models/ModelTabs.vue';

const props = defineProps({
  downloadCount: Number,
  introduction: String,
})
</script>
