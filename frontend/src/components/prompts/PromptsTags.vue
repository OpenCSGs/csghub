<template>
  <div
    class="flex items-center gap-1 h-[20px] whitespace-nowrap"
    :style="{ color: textColor }"
  >
    <SvgIcon :name="`prompts_${tag}`" />
    {{ $t(tagName) }}
  </div>
</template>

<script setup>
  import { computed } from 'vue'

  const props = defineProps({
    tag: String
  })
  const tagColors = {
    Image: '#EAAA08',
    Video: '#6172F3',
    Music: '#EF6820',
    Code: '#2E90FA',
    DataAnalysis: '#0BA5EC',
    Research: '#15B79E',
    Personalization: '#7A5AF8',
    CreativeWriting: '#06AED4',
    TechnicalWriting: '#17B26A',
    Design: '#FF4405',
    Marketing: '#4E5BA6',
    Education: '#66C61C'
  }
  const tagName = computed(() => `prompts.tag.${props.tag}`)
  const textColor = computed(() => tagColors[props.tag])
</script>
