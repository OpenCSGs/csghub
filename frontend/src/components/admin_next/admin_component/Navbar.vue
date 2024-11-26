<template>
  <div class="w-full h-[80px] flex-shrink-0 border-b border-gray-200">
    <div class="2xl:w-[1280px] xl:w-[1024px] lg:w-[826px] md:w-[640px] sm:w-auto m-auto h-full flex justify-between items-center">
      <p class="font-[700] text-white"> OpenCSG Admin Panel </p>
      <a href="/" target="_blank" class="font-[500] text-white underline"> Open Site </a>
      <p class="text-white">{{ userName }} ( {{ userRoles }} )</p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  userName: String,
  userRoles: String
})
</script>