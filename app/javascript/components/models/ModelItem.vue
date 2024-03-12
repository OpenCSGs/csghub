<template>
  <a :href="`/models/${ model.path }`"
     class="model-card p-4 hover:active-model-card sm:w-full border border-gray-200 bg-white rounded-xl hover:active">
    <div class="flex items-center mb-[5px] w-[399px] sm:w-auto">
      <div :title="model.path"
           class="model-path text-sm text-[#303133] font-medium text-ellipsis overflow-hidden whitespace-nowrap">
        {{ getComputed.displayNam }}
      </div>
    </div>
    <p class="h-[40px] w-[399px] sm:w-auto leading-[18px] mb-[5px] text-[#909399] text-xs overflow-hidden overflow-ellipsis line-clamp-2">
      {{ model.description }}
    </p>
    <div class="flex items-center gap-[8px] text-xs text-[#909399]">
      <span v-if="getComputed.taskTag">{{ getComputed.taskTag }}</span>
      <span v-if="getComputed.taskTag">
        <svg xmlns="http://www.w3.org/2000/svg" width="1" height="8" viewBox="0 0 1 8" fill="none">
          <path d="M0.5 0V8" stroke="#DCDFE6"/>
        </svg>
      </span>
      <span>更新时间：{{ model.updated_at.substring(0, 10) }}</span>
      <span>
        <svg xmlns="http://www.w3.org/2000/svg" width="1" height="8" viewBox="0 0 1 8" fill="none">
          <path d="M0.5 0V8" stroke="#DCDFE6"/>
        </svg>
      </span>
      <span>{{ getComputed.visibility }}</span>
      <span>
        <svg xmlns="http://www.w3.org/2000/svg" width="1" height="8" viewBox="0 0 1 8" fill="none">
          <path d="M0.5 0V8" stroke="#DCDFE6"/>
        </svg>
      </span>
      <span>下载热度：{{ model.downloads }}</span>
    </div>
  </a>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  model: Object,
})

const getComputed = computed(() => {
  let displayNam = props.model.nickname !== undefined && props.model.nickname.trim().length > 0 ? props.model.nickname : props.model.name
  displayNam = props.model.path.split('/')[0] + '/' + displayNam

  const visibility = props.model.private ? '私有' : '公开'

  let taskTag = (props.model.tags || []).find(tag => tag.category === "task")
  taskTag = taskTag? taskTag["show_name"] : null
  return { displayNam: displayNam, visibility: visibility, taskTag: taskTag }
})
</script>

<style scoped>
.model-card:hover .model-path {
  color: var(--theme-dark-red-t-red-500-ad-4-a-3-b, #AD4A3B);
}
</style>
