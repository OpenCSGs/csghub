<template>
  <button
    :class="class"
    type="button"
  >
   {{ name }}
  </button>
</template>

<script setup>
  const props = defineProps({
    name: String,
    class:{
      type: String,
      default: "auto",
    },
  });
</script>
