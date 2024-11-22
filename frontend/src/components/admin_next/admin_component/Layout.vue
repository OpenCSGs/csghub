<template>
    <div class="admin-layout flex flex-col h-screen">
        <Navbar />
        <div class="flex flex-1 overflow-hidden">
            <AdminMenu />
            <div class="flex-1 overflow-hidden">
                <el-scrollbar class="h-full">
                    <router-view />
                </el-scrollbar>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue'
import { ElContainer, ElScrollbar, ElHeader, ElAside, ElMain } from 'element-plus'
import AdminNavbar from './Navbar.vue'
import { Navbar } from './index'
import AdminMenu from './Menu.vue'

const headerHeight = ref(72)

</script>

<style scoped>
.admin-layout {
    height: 100vh;
}

:deep(.el-header) {
    padding: 0;
}

/* :deep(.el-aside) {
    width: auto;
} */
</style>
