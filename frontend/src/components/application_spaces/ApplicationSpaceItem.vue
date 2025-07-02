<template>
  <a
    :href="detailLink"
    class="xl:w-full focus:outline focus:outline-4 focus:outline-gray-200 hover:shadow-md border border-gray-200 rounded-lg overflow-hidden"
    :style="`width: ${itemWidth};`"
  >
    <!-- Cover with Overlay -->
    <div class="relative bg-gray-900 h-[150px]">
      
      <!-- Dark gradient overlay -->
      <div class="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-gray-900/30"></div>
      
      <!-- Decorative overlay -->
      <svg class="absolute left-0 top-0 w-full h-full" viewBox="0 0 412 150" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g>
          <path d="M411 80.5337L411 142C411 146.418 407.418 150 403 150L8.99998 150C4.5817 150 0.999987 146.418 0.999988 142L0.999998 80.5337C83.1626 15.6052 246.431 196.126 411 80.5337Z"
            :class="['stroke-none blur-3xl', stableGradientColor]"
          />
        </g>
      </svg>
      
      <!-- Content overlay on image -->
      <div class="absolute inset-0 flex flex-col justify-between p-4">
        <!-- Top section with badges -->
        <div class="flex justify-between items-start">
          <AppStatus
            v-if="!isCollection"
            :appStatus="repo.status || 'NoAppFile'"
            :spaceResource="repo.hardware"
          />
          <div class="flex gap-2">
            <span
              v-if="!isCollection && getComputed.visibility"
              class="px-2 py-1 bg-white/60 border border-gray-200/60 rounded-md text-gray-700 text-xs backdrop-blur-sm"
            >
              {{ getComputed.visibility }}
            </span>
          </div>
        </div>
        
        <!-- Bottom section with title and description -->
        <div class="text-white flex flex-col">
          <h3 class="text-lg font-medium truncate line-clamp-1">
            {{ getComputed.path }}
          </h3>
          <p v-if="repo.description" class="text-sm text-white truncate line-clamp-1">
            {{ repo.description }}
          </p>
        </div>
        <!-- Author and date section -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <!-- User avatar -->
            <el-avatar
              :size="24"
              :src="avatarUrl"
              class="flex-shrink-0"
            ></el-avatar>
            <span class="text-sm text-white truncate">{{ repo.path.split('/')[0] }}</span>
          </div>
          <span class="text-sm text-white">{{ repo.updated_at.substring(0, 10) }}</span>
        </div>
      </div>
    </div>
  </a>
</template>

<script setup>
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import AppStatus from './AppStatus.vue'
  import { useRepoTabStore } from '@/stores/RepoTabStore'

  const { setRepoTab } = useRepoTabStore()

  const props = defineProps({
    repo: Object,
    repoType: String,
    width: String,
    isCollection: Boolean
  })

  const itemWidth = computed(() => {
    if (props.width) return `${props.width}px`
    if (props.isCollection) return '100%'
    return ''
  })

  const avatarUrl = computed(() => {
    // 首先尝试使用repo中的各种头像字段
    if (props.repo.namespace?.Avatar) {
      return props.repo.namespace.Avatar
    }
    if (props.repo.user?.avatar) {
      return props.repo.user.avatar
    }
    if (props.repo.avatar) {
      return props.repo.avatar
    }
    
    // 如果都没有头像数据，直接使用默认头像
    // 这与其他组件的模式保持一致
    return 'https://cdn.casbin.org/img/casbin.svg'
  })

  const { t, locale } = useI18n()

  const gradientColors = [
    'fill-amber-500',    
    'fill-rose-500',     
    'fill-purple-500',   
    'fill-blue-500',     
    'fill-emerald-500',  
    'fill-cyan-500',     
    'fill-indigo-500',   
    'fill-fuchsia-500', 
    'fill-gray-500',
    'fill-yellow-500',
    'fill-green-500',
    'fill-red-500',
    'fill-orange-500',
    'fill-teal-500',
    'fill-violet-500',
    'fill-sky-500',
  ]

  const stableGradientColor = computed(() => {
    const seed = props.repo.id || props.repo.path.length
    return gradientColors[seed % gradientColors.length]
  })

  const getComputed = computed(() => {
    const displayName =
      props.repo.nickname && props.repo.nickname.trim().length > 0
        ? props.repo.nickname
        : props.repo.name

    const visibility = props.repo.private ? t('all.private') : ''

    let taskTag = (props.repo.tags || []).find((tag) => tag.category === 'task')
    if (locale.value === 'en') {
      taskTag = taskTag ? taskTag['name'].replace(/-/g, ' ') : null
    } else {
      taskTag = taskTag ? taskTag['show_name'] : null
    }
    return { path: displayName, visibility, taskTag }
  })

  const detailLink = computed(() => {
    setRepoTab({
      repoType: 'space',
      tab: 'summary',
    })
    return `/spaces/${props.repo.path}?tab=summary`
  })
</script>

<style scoped>
  .application_space-card:hover .application_space-path {
    color: var(--blue-blue-5001-f-75-cb, #1f75cb);
  }
</style>
