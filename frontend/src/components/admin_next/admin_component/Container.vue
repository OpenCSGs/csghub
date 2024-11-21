<template>
    <div class="container">
        <!-- 头部区域 -->
        <section class="header-section" :class="{ 'with-padding': withPadding }">
            <!-- 面包屑 -->
            <div class="breadcrumb-wrapper">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item :to="{ path: '/admin_panel' }">
                        <el-icon>
                            <House />
                        </el-icon>
                    </el-breadcrumb-item>
                    <template v-for="(item, index) in breadcrumbs" :key="index">
                        <el-breadcrumb-item :to="item.to">{{ item.text }}</el-breadcrumb-item>
                    </template>
                </el-breadcrumb>
            </div>

            <!-- 标题区域 -->
            <div class="title-section">
                <!-- 返回按钮 -->
                <el-icon v-if="showBack" class="back-icon" @click="$router.back()">
                    <ArrowLeft />
                </el-icon>

                <div class="title-content">
                    <h1 class="main-title text-gray-900 text-3xl">{{ title }}</h1>
                    <p v-if="subtitle" class="subtitle text-gray-600 text-md">{{ subtitle }}</p>
                </div>

                <!-- 右侧操作 -->
                <div v-if="$slots.headerActions" class="header-actions">
                    <slot name="headerActions"></slot>
                </div>
            </div>
        </section>

        <!-- 内容区域 -->
        <section class="content-section overflow-hidden" :class="{ 'with-padding': withPadding }">
            <slot></slot>
        </section>
    </div>
</template>

<script setup>
import { House, ArrowLeft } from '@element-plus/icons-vue'

defineProps({
    title: {
        type: String,
        required: true
    },
    subtitle: {
        type: String,
        default: ''
    },
    breadcrumbs: {
        type: Array,
        default: () => []
    },
    showBack: {
        type: Boolean,
        default: false
    },
    withPadding: {
        type: Boolean,
        default: true
    }
})
</script>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: white;
    min-width: 0;
    width: 100%;
    overflow-x: hidden;
}

.header-section {
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

.header-section.with-padding {
    padding: 2rem;
}

.breadcrumb-wrapper {
    display: flex;
    align-items: center;
    padding: 0.75rem 0;
    border-bottom: 1px solid #E5E7EB;
}

.title-section {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
}

.title-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.back-icon {
    font-size: 1.25rem;
    cursor: pointer;
    margin-right: 0.5rem;
    margin-top: 0.5rem;
}

.main-title {
    font-size: 1.875rem;
    font-weight: 500;
    line-height: 1;
    margin: 0;
    padding: 0;
}

.subtitle {
    font-size: 1rem;
    font-weight: 300;
    margin: 0;
    margin-top: 1rem;
    padding: 0;
}

.header-actions {
    margin-left: 1rem;
    display: flex;
    align-items: flex-start;
}

.content-section {
    flex: 1;
    min-width: 0;
    overflow-x: auto;
}

.content-section.with-padding {
    padding: 0 2rem 2rem 2rem;
}
</style>