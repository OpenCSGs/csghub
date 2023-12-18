<template>
  <a :href="`/models/${ dataset.path }`" class="p-4 w-[45%] border border-[#EAECF0] rounded-xl md:w-full">
    <div class="flex items-center mb-[5px]">
      <div class="text-sm text-[#303133] font-medium">{{ dataset.path }}</div>
    </div>
    <div class="flex text-xs text-[#909399]">
      <p>更新时间：{{ dataset.updated_at.substring(0, 10) }}</p>
    </div>
  </a>
</template>

<script setup>
  const props = defineProps({
    dataset: Object,
  })
</script>
