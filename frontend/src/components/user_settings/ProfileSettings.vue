<template>
  <div
    class="flex justify-center md:flex-col px-[24px] rounded-[8px] md:px-[50px] sm:px-[20px] max-w-[1280px] m-auto bg-white"
  >
    <Menu :hasSave="hasSave" class="max-w-[411px] md:mb-[24px]" />
    <ProfileEdit @update-has-save="updateHasSave" class="grow" />
  </div>
</template>

<script setup>
  import Menu from './Menu.vue'
  import ProfileEdit from './ProfileEdit.vue'
  import { ref } from 'vue'

  const hasSave = ref(true)
  const updateHasSave = (value) => {
    hasSave.value = value
  }
</script>
