<template>
  <img
    :width="width"
    :height="height"
    :src="`/images/${path}/${name}.svg`"
    onerror="this.style.display='none'"
  />
</template>

<script setup>
  const props = defineProps({
    name: String,
    width:{
      type: String,
      default: "auto",
    },
    height:{
      type: String,
      default: "auto",
    },
    path: {
      type: String,
      default: "icons",
    },
  });
</script>
