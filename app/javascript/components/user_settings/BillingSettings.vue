<template>
  <div
    class="flex justify-center md:flex-col px-[24px] py-[36px] my-[24px] rounded-[8px] md:px-[50px] sm:px-[20px] max-w-[1280px] m-auto bg-white"
  >
    <Menu
      class="max-w-[411px] md:mb-[24px]"
      :name="name"
      :email="email"
      :displayName="displayName"
      :avatar="avatar"
    >
    </Menu>

    <div class="grow py-6">
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
