<template>
  <div class="flex items-center gap-[6px] border border-[#ABEFC6] bg-[#ECFDF3] rounded-[6px] py-[2px] px-[8px]">
    <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" fill="none">
      <circle cx="4" cy="4" r="3" fill="#17B26A"/>
    </svg>
    <p class="text-[12px] text-[#067647] font-[400] leading-[18px]"> {{ statusName }} </p>
  </div>
</template>

<script setup>
  const props = defineProps({
    statusName: String
  })
</script>