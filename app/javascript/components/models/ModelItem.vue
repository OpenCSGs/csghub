<template>
  <a :href="`/models/${ model.path }`" class="p-4 min-w-[433px] sm:w-full border border-[#EAECF0] rounded-xl">
    <div class="flex items-center mb-[5px]">
      <div class="text-sm text-[#303133] font-medium">{{ model.path }}</div>
    </div>
    <div class="flex text-xs text-[#909399]">
      <p>更新时间：{{ model.updated_at.substring(0, 10) }}</p>
    </div>
  </a>
</template>

<script setup>
  const props = defineProps({
    model: Object,
  })
</script>
