<template>
  <div class="w-full h-[60px] border bg-gray-300">
    <div class="max-w-[1280px] m-auto h-full flex justify-between items-center">
      <p class="font-[700]"> OpenCSG Admin Pannel </p>
      <a href="/" target="_blank" class="font-[500] text-[#009900] underline"> Open Site </a>
      <p>{{ userName }} ( {{ userRoles }} )</p>
    </div>
  </div>
</template>

<script setup>
  const props = defineProps({
    userName: String,
    userRoles: String
  })
</script>