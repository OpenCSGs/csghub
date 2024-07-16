<template>
  <a
    :href="`/spaces/${repo.path}`"
    :class="`${widthStyle} focus:outline focus:outline-4 focus:outline-[#EAECF0] hover:shadow-md border border-gray-200 rounded-xl p-4`"
  >
    <div class="flex justify-between items-center mb-1">
      <div class="w-full flex items-center justify-between">
        <h3
          class="flex-1 text-[#303133] font-semibold leading-6 truncate mr-[8px]"
        >
          {{ getComputed.path }}
        </h3>
        <div class="flex gap-2">
          <span
            class="px-[8px] py-[3px] flex items-center justify-center border rounded-md text-[#344054] text-[12px]"
            >{{ getComputed.visibility }}</span
          >
          <AppStatus
            :appStatus="repo.status || 'NoAppFile'"
            :spaceResource="repo.hardware"
          />
        </div>
      </div>
    </div>
    <div class="text-sm leading-snug text-[#606266] flex justify-between">
      <p>
        <span class="mr-2">{{ repo.path.split('/')[0] }}</span>
        <span class="mr-2">·</span>
        <span>{{ repo.updated_at.substring(0, 10) }}</span>
      </p>
    </div>
    <div class="my-2">
      <img
        :src="coverImageUrl"
        class="w-full h-[144px] object-cover rounded cursor-pointer hover:opacity-50"
      />
    </div>
    <div
      class="h-[36px]"
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
          class="max-w-full h-[36px] text-[#606266] text-sm overflow-hidden text-ellipsis line-clamp-2"
        >
          {{ repo.description }}
        </p>
      </template>
    </el-popover>
    <div
      v-if="getComputed.taskTag"
      class="flex gap-2 my-2 overflow-x-auto no-scrollbar"
    >
      <span class="max-w-[80px] xl:max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
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
    widthStyle: {
      type: String,
      default: "xl:w-full"
    }
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
    const appStatus = props.repo.path === 'leaderboard/SuperClueRanking' ? 'Running' : props.repo.status

    const visibility = props.repo.private ? t('all.private') : t('all.public')

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
