<template>
  <a
    class="mcp-item-bg w-full max-w-[640px] min-w-80 p-4 rounded-lg outline outline-1 outline-offset-[-1px] outline-gray-200 inline-flex flex-col gap-2 overflow-hidden focus:outline focus:outline-4 focus:outline-gray-200 hover:shadow-md"
    :href="mcpUrl"
  >
    <div class="inline-flex items-center gap-2">
      <div class="flex-1 flex items-center gap-2">
        <div class="text-slate-700 text-sm font-medium leading-snug">
          {{ tool.name }}
        </div>
      </div>
    </div>
    <div class="inline-flex items-center gap-2">
      <SvgIcon
        name="space_mcp"
        width="16"
        height="16"
      />
      <div class="text-slate-700 text-sm font-normal leading-snug truncate">
        {{ tool.repo_path }}
      </div>
    </div>
    <div
      class="text-gray-500 text-sm font-normal leading-snug overflow-ellipsis line-clamp-2 h-10"
    >
      {{ tool.description || '\u00A0' }}
    </div>
    <div class="pt-0.5 inline-flex items-center gap-4 flex-wrap content-center">
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
      <div
        v-if="tool.license"
        class="rounded-2xl flex items-center gap-1"
      >
        <SvgIcon name="repo_header_license_icon" />
        <div class="flex items-center">
          <div class="text-gray-500 text-xs font-normal leading-none">
            {{ tool.license }}
          </div>
        </div>
      </div>
    </div>
  </a>
</template>

<script setup>
  import { computed } from 'vue'

  const props = defineProps({
    tool: {
      type: Object,
      required: true
    }
  })

  const mcpUrl = computed(() => {
    return `/mcp/servers/${props.tool.repo_path}/schema#tools`
  })

  const programLanguage = computed(() => {
    const tags = props.tool.tags || []
    return tags.find((tag) => tag.category === 'program_language')
  })
</script>

<style scoped>
  .mcp-item-bg {
    font-family: 'PingFang SC', sans-serif;
    background: linear-gradient(93deg, #fafeff 0%, #fff 100%);
  }
</style>
