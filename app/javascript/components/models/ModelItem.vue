<template>
  <a :href="`/models/${ model.path }`" class="p-4 min-w-[433px] sm:w-full sm:min-w-0 border border-[#EAECF0] rounded-xl">
    <div class="flex items-center mb-[5px]">
      <div class="text-sm text-[#303133] font-medium">{{ model.path }}</div>
    </div>
    <div class="flex items-center gap-[8px] text-xs text-[#909399]">
      <span>更新时间：{{ model.updated_at.substring(0, 10) }}</span>
      <span>
        <svg xmlns="http://www.w3.org/2000/svg" width="1" height="8" viewBox="0 0 1 8" fill="none">
          <path d="M0.5 0V8" stroke="#DCDFE6"/>
        </svg>
      </span>
      <span>下载量：{{ model.downloads }}</span>
    </div>
  </a>
</template>

<script setup>
  const props = defineProps({
    model: Object,
  })
</script>
