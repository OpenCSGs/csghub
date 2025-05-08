<template>
  <div>
    <a
      href="javascript:void(0)"
      class="text-brand-700 underline"
      @click="showDetail"
    >
      {{ tool.name }}
    </a>
  </div>
</template>

<script setup>
  const props = defineProps({
    tool: Object
  })

  const emit = defineEmits(['showToolDetail'])

  const showDetail = () => {
    emit('showToolDetail', props.tool)
  }
</script>
