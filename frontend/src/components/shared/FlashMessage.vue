<template>
  <div v-if="message" class="flash-message">
    <el-alert :title="message" :type="type" class="justify-center" />
  </div>
</template>

<script setup>
const props = defineProps({
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'info'
  }
});
</script>