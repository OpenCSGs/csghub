<template>
  <div class="flex flex-col h-screen">
    <Navbar />
    <div class="page-responsive-width flex flex-1 overflow-hidden">
      <AdminMenu
        :isCollapse="isCollapse"
        @hideAdminMenu="hideAdminMenu" />
      <div class="flex-1 overflow-hidden">
        <el-scrollbar class="h-full">
          <!-- <router-view /> -->
          <router-view v-slot="{ Component }">
            <Component
              :is="Component"
              @showAdminMenu="showAdminMenu" />
          </router-view>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import {
    ElContainer,
    ElScrollbar,
    ElHeader,
    ElAside,
    ElMain
  } from 'element-plus'
  import AdminNavbar from './Navbar.vue'
  import { Navbar } from './index'
  import AdminMenu from './Menu.vue'

  const headerHeight = ref(72)
  const isCollapse = ref(false)

  const showAdminMenu = () => {
    isCollapse.value = false
  }

  const hideAdminMenu = () => {
    isCollapse.value = true
  }
</script>

<style scoped>
  /* .admin-layout {
    height: 100vh;
  } */

  /* :deep(.el-header) {
    padding: 0;
  } */

</style>
