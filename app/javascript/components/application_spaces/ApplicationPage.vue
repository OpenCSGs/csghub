<template>
  <div class="py-[20px] overflow-scroll">
    <gradio-app :src="appEndpoint"></gradio-app>
  </div>
</template>

<script setup>
  const props = defineProps({
    appEndpoint: String
  })
</script>