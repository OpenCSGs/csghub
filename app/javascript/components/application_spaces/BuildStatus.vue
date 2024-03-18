<template>
  <div class="flex items-center gap-[6px] border border-[#99AFFF] bg-[#CED8FF] rounded-[6px] py-[2px] px-[8px]">
    <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" fill="none">
      <circle cx="4" cy="4" r="3" fill="#4D6AD6"/>
    </svg>
    <p class="text-[14px] text-[#223B99] font-[400] leading-[20px]"> {{ statusName }} </p>
  </div>
</template>

<script setup>
  const props = defineProps({
    statusName: String
  })
</script>