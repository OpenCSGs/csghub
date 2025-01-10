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
    {{ name }}
  </span>
</template>

<script setup>
  import { computed } from 'vue';

  const props = defineProps({
    name: String,
    activeCategory: {
      type: String,
      default: ''
    }
  })

  const emit = defineEmits(['changeActiveItem'])

  const isActive = computed(() => {
    return props.name.toLowerCase() === props.activeCategory.toLowerCase()
  })
</script>