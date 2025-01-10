<template>
  <span
    class="text-sm text-gray-700 px-[8px] py-[3px] rounded-sm cursor-pointer flex items-center gap-[4px] border border-gray-200"
    :data-tag_name="tag.name"
    :style="setTagColor()"
    @click="emit('handleTagClick', activeCategory, tag.name)">
    {{ tag.name }}
  </span>
</template>

<script setup>
  const props = defineProps({
    activeCategory: String,
    tag: Object,
    active: Boolean
  })

  const emit = defineEmits(['handleTagClick'])

  const setTagColor = () => {
    if (props.active) {
      return 'color: white; background-color: #4D6AD6'
    } else {
      return `color: #303133`
    }
  }
</script>