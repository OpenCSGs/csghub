<template>
  <a
    :href="hrefUrl"
    class="group w-full cursor-pointer text-[#344054] p-4 border border-[#EAECF0] hover:shadow-md hover:border-[#99AFFF] rounded-lg"
    :style="`background: linear-gradient(90deg, #FCFCFD 0.23%, #FFF 99.77%);`"
    @mouseenter="hoverIcon"
    @mouseleave="resetIcon"
  >
    <div class="text-sm group-hover:text-[#3250BD] font-medium flex gap-2 mb-2">
      <SvgIcon :name="currentIcon" />{{ promptsData.name }}
    </div>
    <div class="text-sm mb-3 line-clamp line-clamp-2 text-[#667085]">
      {{ promptsData.description }}
    </div>
    <div class="flex gap-3 items-center">
      <div class="flex gap-2 items-center text-xs leading-[18px]" v-if="promptsData.user">
        <el-avatar :size="24" :src="promptsData.user.avatar || 'https://cdn.casbin.org/img/casbin.svg'"></el-avatar>
        {{  promptsData.user.username || ''}}
      </div>
      <SvgIcon v-if="promptsData.user" name="prompts_pipe" />
      <div class="text-xs flex gap-1 leading-[18px] text-[#667085]">
        <SvgIcon name="clock" />
        {{ $t('prompts.updateAt')
        }}{{ promptsData.updated_at.substring(0, 10) }}
      </div>
    </div>
  </a>
</template>

<script setup>
  import { ref, computed } from 'vue'

  const props = defineProps({
    promptsData: Object
  })
  const defaultIcon = 'prompts_file'
  const hoverIconName = 'prompts_file_selected'
  const currentIcon = ref(defaultIcon)

  const hoverIcon = () => {
    currentIcon.value = hoverIconName
  }

  const resetIcon = () => {
    currentIcon.value = defaultIcon
  }
  const hrefUrl = computed(() => {
    if (props.promptsData.path) {
      return `/prompts/library/${props.promptsData.path}`
    } else {
      return `/prompts/library/${props.promptsData.namespace}/${props.promptsData.name}`
    }
  })
</script>
