<template>
  <a
    class="mcp-item-bg w-full max-w-[640px] min-w-80 p-4 rounded-lg outline outline-1 outline-offset-[-1px] outline-gray-200 inline-flex flex-col gap-2 overflow-hidden focus:outline focus:outline-4 focus:outline-gray-200 hover:shadow-md"
    :href="mcpUrl"
  >
    <div class="inline-flex items-center gap-2">
      <div class="flex-1 flex items-center gap-2">
        <div class="text-slate-700 text-sm font-medium leading-snug">
          {{ mcp.nickname }}
        </div>
        <!-- <div
          v-if="mcp.is_official"
          class="px-1.5 py-0.5 bg-white rounded-md outline outline-1 outline-offset-[-1px] outline-gray-300 flex items-center"
        >
          <div
            class="text-center text-slate-700 text-xs font-normal leading-[18px]"
          >
            official
          </div>
        </div> -->
      </div>
      <!-- <div
        class="p-2 rounded-lg flex justify-center items-center gap-2 overflow-hidden"
      >
        <div class="w-3 h-3 relative overflow-hidden">
          <SvgIcon name="mcp_item_hybrid" />
        </div>
      </div> -->
    </div>
    <div class="inline-flex items-center gap-2">
      <SvgIcon
        name="space_mcp"
        width="16"
        height="16"
      />
      <div class="text-slate-700 text-sm font-normal leading-snug truncate">
        {{ displayPath }}
      </div>
    </div>
    <div
      class="text-gray-500 text-sm font-normal leading-snug overflow-ellipsis line-clamp-2 h-10"
    >
      {{ mcp.description || '\u00A0' }}
    </div>
    <div
      class="pt-0.5 inline-flex justify-between items-center flex-wrap content-center"
    >
      <div class="flex items-center gap-1">
        <SvgIcon name="clock" />
        <div class="text-gray-500 text-xs font-normal leading-none">
          {{ $t('all.lastTime') }}：{{ mcp.updated_at?.substring(0, 10) || '' }}
        </div>
      </div>
      <div
        v-if="showRightIcons"
        class="flex-1 flex justify-end gap-8 flex-wrap content-start"
      >
        <div class="flex items-center gap-1">
          <SvgIcon name="mcp_item_tools" />
          <div class="text-gray-500 text-xs font-normal leading-none">
            {{ mcp.tools_num }}
          </div>
        </div>
        <div class="flex items-center gap-1">
          <SvgIcon name="mcp_item_download" />
          <div class="text-gray-500 text-xs font-normal leading-none">
            {{ mcp.downloads }}
          </div>
        </div>
        <div class="flex items-center gap-1">
          <SvgIcon name="mcp_item_stars" />
          <div class="text-gray-500 text-xs font-normal leading-none">
            {{ mcp.star_num }}
          </div>
        </div>
        <!-- <div class="flex items-center gap-1">
          <SvgIcon name="mcp_item_github" />
          <div class="text-gray-500 text-xs font-normal leading-none">92</div>
        </div> -->
      </div>
    </div>
    <div class="pt-0.5 inline-flex items-center gap-4 flex-wrap content-center">
      <div
        v-if="taskTag"
        class="w-fit xl:max-w-full text-gray-500 text-xs font-normal overflow-hidden text-ellipsis whitespace-nowrap"
      >
        {{ taskTag }}
      </div>

      <div v-if="taskTag && (programLanguage || mcp.license)">
        <SvgIcon name="vertical_divider" />
      </div>
      <div
        v-if="programLanguage"
        class="flex items-start"
      >
        <div class="flex items-center gap-1">
          <SvgIcon name="mcp_item_typescript" />
          <div class="text-gray-500 text-xs font-normal leading-none">
            {{ programLanguage.show_name || programLanguage.name }}
          </div>
        </div>
      </div>
      <div v-if="programLanguage && mcp.license">
        <SvgIcon name="vertical_divider" />
      </div>
      <div
        v-if="mcp.license"
        class="rounded-2xl flex items-center gap-1"
      >
        <SvgIcon name="repo_header_license_icon" />
        <div class="flex items-center">
          <div class="text-gray-500 text-xs font-normal leading-none">
            {{ mcp.license }}
          </div>
        </div>
      </div>
    </div>
  </a>
</template>

<script setup>
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRepoTabStore } from '@/stores/RepoTabStore'

  const { setRepoTab } = useRepoTabStore()
  const { locale } = useI18n()

  const props = defineProps({
    mcp: {
      type: Object,
      required: true
    },
    showRightIcons: {
      type: Boolean,
      default: true
    }
  })

  const mcpUrl = computed(() => {
    setRepoTab({
      repoType: 'mcp',
      tab: 'summary'
    })
    return `/mcp/servers/${props.mcp.path}?tab=summary`
  })

  const programLanguage = computed(() => {
    const tags = props.mcp.tags || []
    return tags.find((tag) => tag.category === 'program_language')
  })

  const taskTag = computed(() => {
    const tags = props.mcp.tags || []
    const taskTag = tags.find((tag) => tag.category === 'task')
    if (locale.value === 'en') {
      return taskTag ? taskTag['name'].replace(/-/g, ' ') : null
    } else {
      return taskTag ? taskTag['show_name'] : null
    }
  })

  const displayPath = computed(() => {
    return props.mcp.github_path || props.mcp.path
  })
</script>

<style scoped>
  .mcp-item-bg {
    font-family: 'PingFang SC', sans-serif;
    background: linear-gradient(93deg, #fafeff 0%, #fff 100%);
  }
</style>
