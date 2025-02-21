<template>
  <div class="loading-container flex flex-col gap-4 py-4">
    <div class="loading-spinner"></div>
    <span>{{ loadingText }}</span>
  </div>
</template>

<script setup>

const props = defineProps({
  loadingText: {
    type: String,
    default: 'Loading...' // 如果没有传入 loadingText，使用默认值
  }
});
</script>

<style scoped>
.loading-container {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.loading-spinner {
  border: 5px solid rgba(0, 0, 0, 0.1);
  border-left-color: #3250BD;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-right: 10px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>