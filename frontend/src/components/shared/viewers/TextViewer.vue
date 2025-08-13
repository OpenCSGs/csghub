<template>
  <div class="whitespace-pre-wrap break-words">{{ content }}</div>
</template>

<script setup>
  const props = defineProps({
    content: String,
  })
</script>
