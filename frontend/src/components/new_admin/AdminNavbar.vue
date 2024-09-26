<template>
  <div class="w-full h-[60px] bg-[#1C7A6C]">
    <div class="max-w-[1280px] m-auto h-full flex justify-between items-center">
      <p class="font-[700] text-[#D1DDD0]"> OpenCSG Admin Panel </p>
      <a href="/" target="_blank" class="font-[500] text-[#D1DDD0] underline"> Open Site </a>
      <p class="text-[#D1DDD0]">{{ userName }} ( {{ userRoles }} )</p>
    </div>
  </div>
</template>

<script setup>
  const props = defineProps({
    userName: String,
    userRoles: String
  })
</script>