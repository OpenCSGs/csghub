<template>
  <a
    :href="`/spaces/${repo.path}`"
    class="xl:w-full focus:outline focus:outline-4 focus:outline-gray-200 hover:shadow-md border border-gray-200 rounded-lg p-4 md:!w-full"
    :style="`width: ${itemWidth};`"
  >
    <div class="flex justify-between items-center mb-1">
      <div class="w-full flex items-center justify-between">
        <h3 class="flex-1 text-gray-700 text-md font-normal leading-6 truncate mr-[8px]">
          {{ getComputed.path }}
        </h3>
        <div class="flex gap-2">
          <span
            v-if="getComputed.visibility"
            class="px-[8px] py-[3px] flex items-center justify-center border rounded-md text-gray-700 text-xs"
            >{{ getComputed.visibility }}</span
          >
          <AppStatus
            v-if="!isCollection"
            :appStatus="repo.status || 'NoAppFile'"
            :spaceResource="repo.hardware"
          />
        </div>
      </div>
    </div>
    <div class="text-sm leading-snug text-gray-500 flex justify-between">
      <p>
        <span class="mr-2">{{ repo.path.split('/')[0] }}</span>
        <span class="mr-2">·</span>
        <span>{{ repo.updated_at.substring(0, 10) }}</span>
      </p>
    </div>
    <div
      class="my-2"
      :class="isCollection ? 'hidden' : ''"
    >
      <img
        :src="coverImageUrl"
        class="w-full h-[144px] object-cover rounded-sm cursor-pointer hover:opacity-50"
      />
    </div>
    <div v-if="!isCollection">
      <div
        class="h-11 text-gray-500 text-sm overflow-hidden"
        v-if="!repo.description"
      ></div>
      <el-popover
        :width="384"
        trigger="hover"
        placement="bottom"
        effect="dark"
        :content="repo.description"
        v-else
      >
        <template #reference>
          <p
            class="max-w-full h-[36px] text-gray-500 text-sm overflow-hidden text-ellipsis line-clamp-2"
          >
            {{ repo.description }}
          </p>
        </template>
      </el-popover>
    </div>

    <div
      v-if="getComputed.taskTag"
      class="flex gap-2 my-2 overflow-x-auto no-scrollbar"
    >
      <span class="w-fit xl:max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
        {{ getComputed.taskTag }}
      </span>
      <span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1"
          height="8"
          viewBox="0 0 1 8"
          fill="none"
        >
          <path
            d="M0.5 0V8"
            stroke="#DCDFE6"
          />
        </svg>
      </span>
    </div>
  </a>
</template>

<script setup>
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import AppStatus from './AppStatus.vue'

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

  const coverImageUrl = computed(() => {
    if (props.repo.cover_image_url) {
      return props.repo.cover_image_url
    } else {
      return '/images/default_cover_image.png'
    }
  })

  const { t, locale } = useI18n()

  const getComputed = computed(() => {
    const displayName =
      props.repo.nickname !== undefined && props.repo.nickname.trim().length > 0
        ? props.repo.nickname
        : props.repo.name
    const path = props.repo.path.split('/')[0] + '/' + displayName

    const visibility = props.repo.private ? t('all.private') : ''

    let taskTag = (props.repo.tags || []).find((tag) => tag.category === 'task')
    if (locale.value === 'en') {
      taskTag = taskTag ? taskTag['name'].replace(/-/g, ' ') : null
    } else {
      taskTag = taskTag ? taskTag['show_name'] : null
    }
    return { path, visibility, taskTag }
  })
</script>

<style scoped>
  .application_space-card:hover .application_space-path {
    color: var(--blue-blue-5001-f-75-cb, #1f75cb);
  }
</style>
