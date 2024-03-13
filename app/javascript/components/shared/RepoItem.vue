<template>
  <a :href="detailLink"
     :class="`${repoType}-card hover:active-${repoType}-card p-4 sm:w-full border border-gray-200 rounded-xl`">
    <div class="flex items-center mb-[5px] w-[399px] sm:w-auto">
      <div :class="`${repoType}-path text-sm text-[#303133] font-medium text-ellipsis overflow-hidden whitespace-nowrap`">{{ repo.path }}</div>
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
      <span>{{$t('all.lastTime')}}：{{ model.updated_at.substring(0, 10) }}</span>
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
      <span>{{$t('all.downloadCount')}}：{{ repo.downloads }}</span>
    </div>
  </a>
</template>

<script setup>
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'

  const props = defineProps({
    repo: Object,
    repoType: String
  })

  const { t } = useI18n();

  const detailLink = computed(() => {
    switch (props.repoType) {
      case 'model':
        return `/models/${props.repo.path}`
      case 'dataset':
        return `/datasets/${props.repo.path}`
      default:
        return ''
    }
  }

  const getComputed = computed(() => {
    const displayName = props.model.nickname !== undefined && props.model.nickname.trim().length > 0 ? props.model.nickname : props.model.name
    const path = props.model.path.split('/')[0] + '/' + displayName

    const visibility = props.model.private ? t('all.private')  : t('all.public')

    let taskTag = (props.model.tags || []).find(tag => tag.category === "task")
    taskTag = taskTag? taskTag["show_name"] : null
    return { path: path, visibility: visibility, taskTag: taskTag }
  })
</script>

<style scoped>
  .dataset-card:hover .dataset-path {
    color: var(--blue-blue-5001-f-75-cb, #1F75CB);
  }

  .model-card:hover .model-path {
    color: var(--theme-dark-red-t-red-500-ad-4-a-3-b, #AD4A3B);
  }
</style>
