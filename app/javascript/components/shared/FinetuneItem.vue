<template>
  <a
    :href="detailLink"
    :class="`${repoType}-card  hover:active-${repoType}-card `"
    class="focus:outline focus:outline-4 focus:outline-[#EAECF0] hover:shadow-md p-4 mlg:w-full border border-gray-200 rounded-xl"
  >
    <div class="flex items-center justify-between mb-[5px]">
      <div
        :class="`${repoType}-path`"
        class="text-sm text-[#303133] font-medium text-ellipsis overflow-hidden whitespace-nowrap"
      >
        {{ repo.deploy_name }}
      </div>
      <div class="flex gap-2">
        <AppStatus
          :appStatus="repo.status || 'NoAppFile'"
          :spaceResource="repo.hardware"
        />
      </div>
    </div>

    <div
      class="flex flex-nowrap overflow-hidden text-ellipsis items-center gap-[8px] text-xs text-[#909399]"
    >
      <div class="overflow-hidden text-ellipsis whitespace-nowrap">
        {{ repo.model_id }} {{ repo.updated_at.substring(0, 10) }}
      </div>
    </div>
  </a>
</template>

<script setup>
  import { computed } from 'vue'
  import AppStatus from '../application_spaces/AppStatus.vue'

  const props = defineProps({
    repo: Object,
    repoType: String,
    cardType: {
      type: String,
      default: 'index'
    }
  })

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
</script>
