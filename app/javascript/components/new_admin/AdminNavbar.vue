<template>
  <div class="w-full h-[60px] border">
    <div class="max-w-[1280px] m-auto h-full flex justify-between items-center">
      <p> OpenCSG Admin Pannel </p>
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