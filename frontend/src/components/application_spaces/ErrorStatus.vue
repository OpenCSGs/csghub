<template>
  <div class="flex items-center gap-1 bg-white/60 border border-gray-300 rounded-md py-[5px] px-2 backdrop-blur-sm">
    <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" fill="none">
      <circle cx="4" cy="4" r="3" fill="#F04438"/>
    </svg>
    <p class="text-xs text-gray-700 font-normal leading-tight">{{ statusName }}</p>
  </div>
</template>

<script setup>
  const props = defineProps({
    statusName: String
  })
</script>