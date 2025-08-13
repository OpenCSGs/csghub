<template>
  <el-tooltip
    :content="`${$t(
      'repo.source.from'
    )} ${source}: <a href='${sourceUrl}' target='_blank' class='underline' rel='noopener noreferrer'>${sourcePath}</a>`"
    raw-content
    placement="top"
  >
    <el-avatar
      :src="iconSrc"
      :size="24"
      :class="[
        'cursor-pointer',
        { '!bg-white': repoType === 'model' }
      ]"
    />
  </el-tooltip>
</template>

<script setup>
  import { computed } from 'vue'

  const props = defineProps({
    repoType: String,
    source: String,
    sourcePath: String
  })

  const iconSrc = computed(() => {
    const baseSrc = '/images/icons/'
    if (props.source === 'HuggingFace') {
      return baseSrc + 'repo_source_huggingface.svg'
    } else if (props.source === 'ModelScope') {
      return baseSrc + 'repo_source_modelscope.svg'
    } else {
      return baseSrc + 'repo_source_opencsg.svg'
    }
  })

  const sourceUrl = computed(() => {
    if (props.source === 'HuggingFace') {
      if (props.repoType === 'model') {
        return `https://huggingface.co/${props.sourcePath}`
      } else {
        return `https://huggingface.co/${props.repoType}s/${props.sourcePath}`
      }
    } else if (props.source === 'ModelScope') {
      return `https://modelscope.cn/${props.repoType}s/${props.sourcePath}`
    } else {
      return `https://opencsg.com/${props.repoType}s/${props.sourcePath}`
    }
  })
</script>
