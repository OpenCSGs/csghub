<template>
  <a :href="detailLink"
     :class="`${repoType}-card`"
     class="focus:outline focus:outline-4 focus:outline-gray-200 hover:shadow-sm p-4 md:w-full border border-gray-200 rounded-md flex-grow xl:basis-full min-w-[250px] xl:max-w-full"
     :style="isCollection ? 'width:100%' : ''"
  >
    <div class="flex items-center justify-between mb-1 w-full">
      <div :class="`${repoType}-path`"
           class="text-sm font-medium text-gray-700 text-ellipsis overflow-hidden whitespace-nowrap"
      >
        {{ getComputed.path }}
      </div>
      <div class="flex gap-1">
        <el-tooltip
          effect="light"
          :content="$t('repo.source.needSync')"
          placement="top"
        >
          <SvgIcon v-if="!!needSyncIcon" :name="needSyncIcon" />
        </el-tooltip>
        <el-tooltip
          effect="light"
          :content="syncTooltip"
          placement="top"
        >
          <SvgIcon v-if="!!sourceIcon && !needSyncIcon" :name="sourceIcon" />
        </el-tooltip>
      </div>
    </div>

    <p v-if="getComputed.showDescription"
      class="w-full h-9 leading-[18px] mb-1.5 text-gray-500 text-sm overflow-hidden text-ellipsis line-clamp-2 text-left"
      :class="isCollection ? 'hidden' : ''"
     >
      {{ repo.description }}
    </p>

    <div class="flex flex-nowrap overflow-hidden text-ellipsis items-center gap-2 text-xs text-gray-500">
      <span v-if="getComputed.taskTag"
            class="max-w-[80px] xl:max-w-full overflow-hidden text-ellipsis whitespace-nowrap"
      >
            {{ getComputed.taskTag }}
      </span>

      <span v-if="getComputed.taskTag">
        <SvgIcon name="vertical_divider" />
      </span>

      <div class="overflow-hidden text-ellipsis whitespace-nowrap">
        {{$t('all.lastTime')}}：{{ repo.updated_at.substring(0, 10) }}
      </div>

      <template v-if="getComputed.visibility">
        <span> <SvgIcon name="vertical_divider" /> </span>
        <span class="visibility-label">{{ getComputed.visibility }}</span>
      </template>

      <span> <SvgIcon name="vertical_divider" /> </span>

      <span class="whitespace-nowrap">{{$t('all.downloadCount')}}：{{ repo.downloads }}</span>
    </div>
  </a>
</template>

<script setup>
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'

  const props = defineProps({
    repo: Object,
    repoType: String,
    isCollection: Boolean,
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
      case 'prompt':
        return `/prompts/library/${props.repo.path}`
      default:
        return ''
    }
  })

  const sourceIcon = computed(() => {
    if (props.repo.source !== 'opencsg') return ''

    return props.repo.sync_status === 'completed'
      ? 'repo_opencsg_completed'
      : 'repo_opencsg_sync'
  })

  const needSyncIcon = computed(() => {
    if (props.repo.source !== 'opencsg') return ''

    return props.repo.sync_status !== 'completed'
      && !!props.repo.repository.http_clone_url
      ? 'repo_opencsg_need_sync'
      : ''
  })

  const syncTooltip = computed(() => {
    if (props.repo.source !== 'opencsg') return ''

    return props.repo.sync_status === 'completed'
      ? t('repo.source.syncCompleted')
      : t('repo.source.remoteResource')
  })

  const getComputed = computed(() => {
    const displayName = props.repo.nickname !== undefined && props.repo.nickname.trim().length > 0 ? props.repo.nickname : props.repo.name
    const path = props.repo.path.split('/')[0] + '/' + displayName

    const visibility = props.repo.private ? t('all.private') : ''
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

  .code-card:hover .code-path {
    color: var(--blue-blue-5001-f-75-cb, #1F75CB);
  }
</style>
