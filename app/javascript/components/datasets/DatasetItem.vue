<template>
  <a :href="`/datasets/${ dataset.path }`"
     class="dataset-card hover:active-dataset-card p-4 sm:w-full border border-gray-200 bg-white rounded-xl">
    <div class="flex items-center mb-[5px] w-[399px] sm:w-auto">
      <div class="dataset-path text-sm text-[#303133] font-medium text-ellipsis overflow-hidden whitespace-nowrap">{{ dataset.path }}</div>
    </div>
    <div class="flex items-center gap-[8px] text-xs text-[#909399]">
      <span>更新时间：{{ dataset.updated_at && dataset.updated_at.substring(0, 10) }}</span>
      <span>
        <svg xmlns="http://www.w3.org/2000/svg" width="1" height="8" viewBox="0 0 1 8" fill="none">
          <path d="M0.5 0V8" stroke="#DCDFE6"/>
        </svg>
      </span>
      <span>{{ visibility }}</span>
      <span>
        <svg xmlns="http://www.w3.org/2000/svg" width="1" height="8" viewBox="0 0 1 8" fill="none">
          <path d="M0.5 0V8" stroke="#DCDFE6"/>
        </svg>
      </span>
      <span>下载热度：{{ dataset.downloads }}</span>
    </div>
  </a>
</template>

<script setup>
  import { computed } from 'vue'

  const props = defineProps({
    dataset: Object,
  })

  const visibility = computed(() => {
    return props.dataset.private ? '私有' : '公开'
  })
</script>

<style scoped>
  .dataset-card:hover .dataset-path {
    color: var(--blue-blue-5001-f-75-cb, #1F75CB);
  }
</style>
