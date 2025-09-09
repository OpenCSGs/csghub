<template>
  <a :href="detailLink"
     :class="[
       `${repoType}-card`,
       repoType === 'model' ? 'bg-gradient-to-r from-[#fafefe] to-white' : '',
       repoType === 'dataset' ? 'bg-gradient-to-r from-[#fbfaff] to-white' : '',
       repoType === 'code' ? 'bg-gradient-to-r from-[#F9FAFA] to-white' : ''
     ]"
     class="flex flex-col justify-between focus:outline focus:outline-4 focus:outline-gray-200 hover:shadow-md p-4 gap-1 md:w-full border border-gray-200 rounded-md flex-grow xl:basis-full min-w-[250px] xl:max-w-full h-fit  cursor-pointer"
     :style="isCollection ? 'width:100%' : ''"
  >
    <div class="flex items-center justify-between mb-1 gap-2 w-full">
      <SvgIcon v-if="repoType === 'model'" name="models" width="18" height="18" />
      <SvgIcon v-if="repoType === 'dataset'" name="datasets" width="18" height="18" />
      <SvgIcon v-if="repoType === 'code'" name="codes" width="18" height="18" />
      <SvgIcon v-if="repoType === 'space'" name="spaces" width="18" height="18" />
      <div :class="`${repoType}-path`"
           class="text-sm font-medium text-gray-700 text-ellipsis overflow-hidden whitespace-nowrap w-full flex items-center gap-2"
      >
        <div :class="showNewTag ? 'max-w-[80%] overflow-hidden text-ellipsis' : 'w-full'">{{ getComputed.path }}</div>
        <div v-if="showNewTag">
          <el-tooltip :content="$t(`${repoType}s.newTips`)" placement="top">
            <NewTag />
          </el-tooltip>
        </div>
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
            class="w-fit xl:max-w-full overflow-hidden text-ellipsis whitespace-nowrap flex items-center gap-1"
      >
            <img v-if="getComputed.taskTagIconPath && taskTagIconExists" :src="getComputed.taskTagIconPath" class="w-3 h-3 text-gray-500 filter-gray" alt="" />
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
  import RepoItemSyncIcon from './RepoItemSyncIcon.vue';
  import { computed, ref, watch } from 'vue'
  import { useI18n } from 'vue-i18n'
  import NewTag from './NewTag.vue'
  import { isWithinTwoWeeks } from '../../packs/datetimeUtils'
  import { useRepoTabStore } from '../../stores/RepoTabStore'

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
  const taskTagIconExists = ref(false)
  const { setRepoTab } = useRepoTabStore()
  const showNewTag = computed(() => {
    return ((props.repoType === 'model' || props.repoType === 'dataset')) && (isWithinTwoWeeks(props.repo.created_at) || isWithinTwoWeeks(props.repo.updated_at));
  });

  const repoTypeIcon = computed(() => {
    const icons = {
      model: 'models',
      dataset: 'datasets',
      code: 'codes',
      space: 'spaces'
    }
    return icons[props.repoType]
  })

  const timeInfo = computed(() =>
    `${t('all.lastTime')}：${props.repo.updated_at.substring(0, 10)}`
  )

  const getReturnParams = () => {
    const { searchParams } = new URL(window.location.href)
    const returnParams = new URLSearchParams()
    
    const paramsToKeep = ['page', 'search', 'sort', 'filter', 'source', 'sdk', 'tag', 'tag_type']
    paramsToKeep.forEach(param => {
      const value = searchParams.get(param)
      if (value) {
        returnParams.set(param, value)
      }
    })
    
    return returnParams.toString()
  }

  const detailLink = computed(() => {
    const returnParams = getReturnParams()
    const returnQuery = returnParams ? `&return=${encodeURIComponent('?' + returnParams)}` : ''
    
    switch (props.repoType) {
      case 'model':
        setRepoTab({
          repoType: 'model',
          tab: 'summary'
        })
        return `/models/${props.repo.path}?tab=summary${returnQuery}`
      case 'dataset':
        setRepoTab({
          repoType: 'dataset',
          tab: 'summary'
        })
        return `/datasets/${props.repo.path}?tab=summary${returnQuery}`
      case 'space':
        setRepoTab({
          repoType: 'space',
          tab: 'summary'
        })
        return `/spaces/${props.repo.path}?tab=summary${returnQuery}`
      case 'code':
        setRepoTab({
          repoType: 'code',
          tab: 'summary'
        })
        return `/codes/${props.repo.path}?tab=summary${returnQuery}`
      case 'prompt':
        return `/prompts/library/${props.repo.path}${returnQuery ? '?' + returnQuery.substring(1) : ''}`
      default:
        return ''
    }
  })

  const getComputed = computed(() => {
    const displayName = props.repo.nickname !== undefined && props.repo.nickname.trim().length > 0 ? props.repo.nickname : props.repo.name
    const path = props.repo.hf_path || props.repo.ms_path || props.repo.csg_path || props.repo.path

    const visibility = props.repo.private ? t('all.private') : ''
    const showDescription = props.cardType === 'index' || !!props.repo.description?.trim()

    let taskTag = (props.repo.tags || []).find(tag => tag.category === "task")
    if (locale.value === 'en') {
      taskTag = taskTag? taskTag["name"].replace(/-/g, ' ') : null
    }
    else {
      taskTag = taskTag? taskTag["show_name"] : null
    }
    
    // 获取标签对应的图标路径
    let taskTagIconPath = null
    if (taskTag) {
      // 直接使用标签的name属性，因为图标文件名与标签名完全匹配
      const tagNameForIcon = (props.repo.tags || []).find(tag => tag.category === "task")?.name
      
      if (tagNameForIcon) {
        // 设置图标路径，图标文件名与标签名完全一致
        taskTagIconPath = `/images/tags/${tagNameForIcon}.svg`
      }
    }

    return { path, visibility, taskTag, showDescription, taskTagIconPath }
  })

  // 检查图标是否存在的函数
  const checkIconExists = (iconPath) => {
    if (!iconPath) {
      taskTagIconExists.value = false
      return
    }
    
    const img = new Image()
    img.onload = () => { 
      taskTagIconExists.value = true 
    }
    img.onerror = () => { 
      taskTagIconExists.value = false 
    }
    img.src = iconPath
  }

  watch(() => getComputed.value.taskTagIconPath, (newIconPath) => {
    checkIconExists(newIconPath)
  }, { immediate: true }) // immediate: true to run on initial load
</script>

<style scoped>
.filter-gray {
  filter: invert(56%) sepia(11%) saturate(207%) hue-rotate(176deg) brightness(93%) contrast(84%);
}
</style>