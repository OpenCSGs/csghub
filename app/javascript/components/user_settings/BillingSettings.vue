<template>
  <div
    class="flex justify-center md:flex-col px-[24px] rounded-[8px] md:px-[50px] sm:px-[20px] max-w-[1280px] m-auto bg-white"
  >
    <Menu
      class="max-w-[411px] md:mb-[24px]"
      :name="name"
      :email="email"
      :displayName="displayName"
      :avatar="avatar"
    >
    </Menu>

    <div class="grow flex flex-col gap-[24px] px-6 py-10 border-l min-h-[calc(100vh-153px)]">
      <BillingCard />
    </div>
  </div>
</template>

<script setup>
  import Menu from './Menu.vue'
  import BillingCard from './BillingCard.vue'

  const props = defineProps({
    name: String,
    displayName: String,
    avatar: String,
    email: String
  })
</script>
