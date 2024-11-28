<template>
  <button
    :class="class"
    :type="btnType"
  >
   {{ name }}
  </button>
</template>

<script setup>
  const props = defineProps({
    name: String,
    btnType: {
      type: String,
      default: "button"
    },
    class:{
      type: String,
      default: "",
    },
  });
</script>
