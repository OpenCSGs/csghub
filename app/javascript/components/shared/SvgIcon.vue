<template>
  <img
    :src="`/images/${path}/${name}.svg`"
    onerror="this.style.display='none'"
  />
</template>

<script setup>
  const props = defineProps({
    name: String,
    path: {
      type: String,
      default: "icons",
    },
  });
</script>
