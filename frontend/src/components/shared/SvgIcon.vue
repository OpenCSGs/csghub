<template>
  <img
    :width="width"
    :height="height"
    :src="`/images/${path}/${name}.svg`"
    onerror="this.style.display='none'"
    :class="{'disabled-icon': disabled}"
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
    disabled: {
      type: Boolean,
      default: false
    }
  });
</script>

<style scoped>
.disabled-icon {
  filter: invert(87%) sepia(4%) saturate(150%) hue-rotate(169deg) brightness(89%) contrast(87%);
}
</style>
