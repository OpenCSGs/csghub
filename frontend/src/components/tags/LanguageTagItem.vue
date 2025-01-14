<template>
  <span
    class="text-sm text-gray-700 px-2 py-1 rounded-xs cursor-pointer flex items-center gap-1"
    :data-tag_name="tag.name"
    :style="setLanguageTagColor()"
    @click="emit('handleTagClick', 'language', tag.name)">
    <svg
      :stroke="setSvgColor()"
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M11 6C11 8.76142 8.76142 11 6 11M11 6C11 3.23858 8.76142 1 6 1M11 6C11 4.89543 8.76142 4 6 4C3.23858 4 1 4.89543 1 6M11 6C11 7.10457 8.76142 8 6 8C3.23858 8 1 7.10457 1 6M6 11C3.23858 11 1 8.76142 1 6M6 11C7.10457 11 8 8.76142 8 6C8 3.23858 7.10457 1 6 1M6 11C4.89543 11 4 8.76142 4 6C4 3.23858 4.89543 1 6 1M1 6C1 3.23858 3.23858 1 6 1"
        stroke-width="0.75"
        stroke-linecap="round"
        stroke-linejoin="round" />
    </svg>
    {{
      tag.show_name
        ? $t(`languages.${tag.show_name}`)
        : tag.name
    }}
  </span>
</template>

<script setup>
  const props = defineProps({
    tag: Object,
    active: Boolean
  })

  const emit = defineEmits(['handleTagClick'])

  const setLanguageTagColor = () => {
    if (props.active) {
      return 'color: white; background-color: #0DAF66'
    } else {
      return `color: #087443; background-color: #F6FEF9`
    }
  }

  const setSvgColor = () => {
    if (props.active) {
      return '#FAFEF5'
    }
    return '#3B7C0F'
  }
</script>
