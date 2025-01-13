<template>
  <span
    class="mr-1 py-2 px-3 rounded-sm text-sm font-medium text-gray-500 cursor-pointer hover:bg-gray-50"
    data-type="Task"
    :class="
      isActive
        ? 'py-2 px-3 text-gray-700 text-sm font-medium bg-gray-50'
        : ''
    "
    @click="emit('changeActiveItem', name)">
    {{ showName() }}
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
    }
  })

  const { locale } = useI18n()

  const emit = defineEmits(['changeActiveItem'])

  const isActive = computed(() => {
    return props.name.toLowerCase() === props.activeCategory.toLowerCase()
  })

  const showName = () => {
    if (locale.value === 'zh') {
      return (props.zhName || props.name)
    } else {
      return props.name
    }
  }
</script>