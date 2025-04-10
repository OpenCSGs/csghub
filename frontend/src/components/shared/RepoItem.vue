<template>
  <a :href="detailLink"
     :class="[
       `${repoType}-card`,
       repoType === 'model' ? 'bg-gradient-to-r from-[#fafefe] to-white' : '',
       repoType === 'dataset' ? 'bg-gradient-to-r from-[#fbfaff] to-white' : '',
       repoType === 'code' ? 'bg-gradient-to-r from-[#F9FAFA] to-white' : ''
     ]"
     class="flex flex-col justify-between focus:outline focus:outline-4 focus:outline-gray-200 hover:shadow-md p-4 gap-1 md:w-full border border-gray-200 rounded-md flex-grow xl:basis-full min-w-[250px] xl:max-w-full h-fit"
     :style="isCollection ? 'width:100%' : ''"
  >
    <div class="flex items-center justify-between mb-1 gap-2 w-full">
      <SvgIcon v-if="repoType === 'model'" name="models" width="18" height="18" />
      <SvgIcon v-if="repoType === 'dataset'" name="datasets" width="18" height="18" />
      <SvgIcon v-if="repoType === 'code'" name="codes" width="18" height="18" />
      <SvgIcon v-if="repoType === 'space'" name="spaces" width="18" height="18" />
      <div :class="`${repoType}-path`"
           class="text-sm font-medium text-gray-700 text-ellipsis overflow-hidden whitespace-nowrap w-full"
      >
        {{ getComputed.path }}
      </div>
      <RepoItemSyncIcon
        :source="repo.source"
        :syncStatus="repo.sync_status"
        :httpCloneUrl="repo.repository && repo.repository.http_clone_url"
      />
    </div>

    <p v-if="getComputed.showDescription"
      class="w-full min-h-[18px] leading-[18px] mb-1.5 text-gray-500 text-sm font-normal overflow-hidden text-ellipsis line-clamp-1 text-left"
      :class="isCollection ? 'hidden' : ''"
     >
      {{ repo.description || '\u00A0' }}
    </p>

    <div class="flex flex-nowrap overflow-hidden text-ellipsis items-center gap-2 text-xs text-gray-500">
      <span v-if="getComputed.taskTag"
            class="w-fit xl:max-w-full overflow-hidden text-ellipsis whitespace-nowrap"
      >
            {{ getComputed.taskTag }}
      </span>

      <span v-if="getComputed.taskTag">
        <SvgIcon name="vertical_divider" />
      </span>

      <div class="overflow-hidden text-ellipsis whitespace-nowrap flex gap-1 items-center">
        <SvgIcon name="clock" />
        {{$t('all.lastTime')}}：{{ repo.updated_at.substring(0, 10) }}
      </div>

      <template v-if="getComputed.visibility">
        <span> <SvgIcon name="vertical_divider" /> </span>
        <span class="visibility-label">{{ getComputed.visibility }}</span>
      </template>

      <span> <SvgIcon name="vertical_divider" /> </span>

      <span class="whitespace-nowrap flex gap-1 items-center">
        <SvgIcon name="download2" />
        {{ repo.downloads }}
      </span>
    </div>
  </a>
</template>

<script setup>
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import RepoItemSyncIcon from './RepoItemSyncIcon.vue'
  import { isSaas } from '../../packs/config';

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

  const getComputed = computed(() => {
    const displayName = props.repo.nickname !== undefined && props.repo.nickname.trim().length > 0 ? props.repo.nickname : props.repo.name
    const path = isSaas()? props.repo.path.split('/')[0] + '/' + displayName : props.repo.hf_path || props.repo.ms_path || props.repo.csg_path || props.repo.path

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