<template>
  <span
    class="mr-1 py-2 px-3 rounded-sm text-sm font-medium text-gray-500 cursor-pointer hover:bg-gray-50 relative"
    data-type="Task"
    :class="
      isActive
        ? 'py-2 px-3 text-gray-700 text-sm font-medium bg-gray-50'
        : ''
    "
    @click="emit('changeActiveItem', name)">
    {{ showName() }}
    <span
      v-if="hasSelectedTags"
      class="absolute w-1.5 h-1.5 top-1.5 right-1.5 rounded-full"
      style="background-color: #4d6ad6;">
    </span>
  </span>
</template>

<script setup>
  import { computed } from 'vue';
  import { useI18n } from 'vue-i18n';

  const props = defineProps({
    name: String,
    zhName: String,
    activeCategory: {
      type: String,
      default: ''
    },
    activeTags: {
      type: Object,
      default: () => ({})
    }
  })

  const { locale } = useI18n()

  const emit = defineEmits(['changeActiveItem'])

  const isActive = computed(() => {
    return props.name.toLowerCase() === props.activeCategory.toLowerCase()
  })

  const hasSelectedTags = computed(() => {
    const tags = props.activeTags[props.name]
    return Array.isArray(tags) && tags.length > 0
  })

  const showName = () => {
    if (locale.value === 'en') {
      return props.name
    } else {
      return (props.zhName || props.name)
    }
  }
</script>