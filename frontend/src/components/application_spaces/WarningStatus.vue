<template>
  <div class="flex items-center gap-[6px] border border-warning-200 bg-warning-50 rounded-sm py-[2px] px-[8px]">
    <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" fill="none">
      <circle cx="4" cy="4" r="3" fill="#F79009"/>
    </svg>
    <p class="text-xs text-warning-700 font-[400] leading-[18px]"> {{ statusName }} </p>
  </div>
</template>

<script setup>
  const props = defineProps({
    statusName: String
  })
</script>