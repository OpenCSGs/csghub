<template>
  <div
    class="flex justify-center md:flex-col px-[24px] rounded-[8px] md:px-[50px] sm:px-[20px] max-w-[1280px] m-auto bg-white"
  >
    <Menu class="max-w-[411px] md:mb-[24px]" />
    <ProfileEdit class="grow" />
  </div>
</template>

<script setup>
  import Menu from './Menu.vue'
  import ProfileEdit from './ProfileEdit.vue'
</script>
