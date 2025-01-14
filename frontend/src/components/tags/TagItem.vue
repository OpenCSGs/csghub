<template>
  <span
    class="text-sm text-gray-700 px-[8px] py-[3px] rounded-sm cursor-pointer flex items-center gap-[4px] border border-gray-200"
    :data-tag_name="tag.name"
    :style="setTagColor()"
    @click="emit('handleTagClick', activeCategory, tag.name)">
    {{ tagName }}
  </span>
</template>

<script setup>
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'

  const props = defineProps({
    activeCategory: String,
    tag: Object,
    active: Boolean
  })

  const emit = defineEmits(['handleTagClick'])
  const { locale } = useI18n()

  const setTagColor = () => {
    if (props.active) {
      return 'color: white; background-color: #4D6AD6'
    } else {
      return `color: #303133`
    }
  }

  const tagName = computed(() => {
    if (locale.value === 'en') {
      return props.tag.name.replace(/-/g, ' ')
    } else {
      return props.tag.show_name || props.tag.zh_name || props.tag.name.replace(/-/g, ' ')
    }
  })
</script>