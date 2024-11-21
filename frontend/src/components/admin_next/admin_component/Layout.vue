<template>
    <div class="admin-layout">
        <el-container>
            <el-header :style="{ height: `${headerHeight}px` }">
                <AdminNavbar />
            </el-header>
            <el-container :style="{ height: `calc(100vh - ${headerHeight}px)` }">
                <el-aside class="overflow-hidden w-auto h-full">
                    <el-scrollbar class="h-full" wrap-class="h-full">
                        <AdminMenu :style="{ minHeight: `calc(100vh - ${headerHeight}px)` }" />
                    </el-scrollbar>
                </el-aside>
                <el-main class="admin-main">
                    <el-scrollbar class="h-full">
                        <router-view />
                    </el-scrollbar>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>
<script setup>
import { ref } from 'vue'
import { ElContainer, ElScrollbar, ElHeader, ElAside, ElMain } from 'element-plus'
import AdminNavbar from './Navbar.vue'
import AdminMenu from './Menu.vue'

const headerHeight = ref(72)

</script>

<style scoped>
.admin-main {
    flex: 1;
}

:deep(.el-header) {
    padding: 0;
}

/* :deep(.el-aside) {
    width: auto;
} */
</style>
