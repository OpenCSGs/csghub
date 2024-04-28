<template>
  <a :href="detailLink"
     :class="`${repoType}-card focus:outline focus:outline-4 focus:outline-[#EAECF0] hover:shadow-md hover:active-${repoType}-card p-4 sm:w-full border border-gray-200 rounded-xl`">
    <div class="flex items-center mb-[5px]">
      <div :class="`${repoType}-path text-sm text-[#303133] font-medium text-ellipsis overflow-hidden whitespace-nowrap`">{{ getComputed.path }}</div>
    </div>
    <p v-if="getComputed.showDescription" class="h-[35px] leading-[18px] mb-[5px] text-[#909399] text-xs overflow-hidden text-ellipsis line-clamp-2">
      {{ repo.description }}
    </p>
    <div class="flex items-center gap-[8px] text-xs text-[#909399]">
      <span v-if="getComputed.taskTag" class="max-w-[80px] xl:max-w-full overflow-hidden text-ellipsis whitespace-nowrap">{{ getComputed.taskTag }}</span>
      <span v-if="getComputed.taskTag">
        <svg xmlns="http://www.w3.org/2000/svg" width="1" height="8" viewBox="0 0 1 8" fill="none">
          <path d="M0.5 0V8" stroke="#DCDFE6"/>
        </svg>
      </span>
      <span class="flex flex-wrap sm:hidden">{{$t('all.lastTime')}}：<span>{{ repo.updated_at.substring(0, 10) }}</span></span>
      <span class="sm:hidden">
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
    repoType: String,
    cardType: {
      type: String,
      default: 'index'
    }
  })

  const { t, locale } = useI18n()

  const detailLink = computed(() => {
    switch (props.repoType) {
      case 'model':
        return `/models/${props.repo.path}`
      case 'dataset':
        return `/datasets/${props.repo.path}`
      case 'space':
        return `/spaces/${props.repo.path}`
      case 'code':
        return `/codes/${props.repo.path}`
      default:
        return ''
    }
  })

  const getComputed = computed(() => {
    const nickName = props.repo.nickname !== undefined ? props.repo.nickname : ''
    const repoName = props.repo.name || props.repo.path.split('/')[1]
    const displayName = nickName || repoName
    const path = props.repo.path.split('/')[0] + '/' + displayName

    const visibility = props.repo.private ? t('all.private')  : t('all.public')
    const showDescription = props.cardType === 'index' || !!props.repo.description?.trim()

    let taskTag = (props.repo.tags || []).find(tag => tag.category === "task")
    if (locale.value === 'en') {
      taskTag = taskTag? taskTag["name"].replace(/-/g, ' ') : null
    }
    else {
      taskTag = taskTag? taskTag["show_name"] : null
    }

    return { path, visibility, taskTag, showDescription }
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
