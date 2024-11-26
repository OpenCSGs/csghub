<template>
  <div class="bg-white border-b border-gray-200">
    <Navbar
      logo="/images/opencsg_logo.png"
      is-logged-in="true"
      user-name="jared03"
      uuid="02ada5a2-15e1-47d4-8fbd-e52f0a7eb1e9"
      company-verified="false"
      is-company-user="false"
      canCreateDailyPaper="false" />
  </div>
</template>

<script setup>
  import Navbar from '@/components/navbar/Navbar.vue'
</script>

<style lang="less">
  .admin-layout .csg-navbar {
    border-bottom: 1px solid #eaecf0 !important;
  }
</style>
