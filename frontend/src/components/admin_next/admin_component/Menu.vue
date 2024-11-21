<template>
  <el-menu class="left-0 w-60 h-full px-5 py-8 bg-[#f8f9fb] border-r border-[#eaecf0]" :default-active="activeIndex"
    router>
    <template v-for="item in menuRenderList" :key="item.name">
      <div class="menu-section-title">{{ item.name }}</div>
      <el-menu-item v-for="child in item.children" :key="child.name" :index="child.path" class="menu-item">
        <div class="menu-item-content">
          <SvgIcon :name="child.icon" width="20" height="20" />
          <span :class="{ 'text-[#3250bd]': activeIndex === child.path }">{{ child.name }}</span>
        </div>
      </el-menu-item>
    </template>
  </el-menu>
</template>

<script setup>
import { ref } from 'vue'
import { menuRenderList } from '../router'
import { useRoute } from 'vue-router'
import {
  Setting,
  User,
  Connection,
  List,
  DataLine,
  Document,
  ChatLineRound,
  DocumentCopy,
  Warning,
  Picture,
  Message
} from '@element-plus/icons-vue'

const route = useRoute()
const activeIndex = ref(route.path)

const advancedItems = [
  { title: '模型管理', path: '/admin_next/models', icon: List },
  { title: '数据集管理', path: '/admin_next/datasets', icon: DataLine },
  { title: '代码管理', path: '/admin_next/codes', icon: Document },
  { title: '组织管理', path: '/admin_next/organizations', icon: Document },
  { title: '话题管理', path: '/admin_next/topics', icon: ChatLineRound },
  { title: '论文管理', path: '/admin_next/papers', icon: Picture },
  { title: '错误日志', path: '/admin_next/error-logs', icon: Warning },
  { title: '系统图片', path: '/admin_next/system-images', icon: Picture },
  { title: '邮件组', path: '/admin_next/mail-groups', icon: Message },
]
</script>

<style scoped lang="postcss">
.menu-section-title {
  @apply text-[16px] text-[#0f1728] font-normal leading-normal mb-4;
  font-family: 'PingFang SC', sans-serif;
}

.menu-item {
  @apply h-[40px] px-3 py-2 rounded-lg;
  @apply hover:bg-[#f0f3ff];
}

.menu-item-content {
  @apply flex items-center gap-2;
}

.active-indicator {
  @apply w-[4px] h-[20px] bg-[#3250bd] rounded-tr-lg rounded-br-lg;
}
</style>
<style scoped>
:deep(.el-menu) {
  overflow-x: hidden;
  border-right: none;
  background-color: transparent;
  scrollbar-color: var(--el-bg-color-overlay) transparent;
  scrollbar-width: thin;
  transition: scrollbar-color 0.3s ease-in-out;
}

:deep(.el-menu)::-webkit-scrollbar {
  width: 2px;
}

:deep(.el-menu)::-webkit-scrollbar-track {
  background: transparent;
}

:deep(.el-menu)::-webkit-scrollbar-thumb {
  background-color: var(--el-bg-color-overlay);
  border-radius: 3px;
}

:deep(.el-menu-item.menu-item) {
  height: 40px;
  line-height: 40px;
  margin: 2px 0;
  padding: 8px 12px !important;
}

:deep(.el-menu-item.is-active) {
  background-color: #f0f3ff;
}

:deep(.el-menu-item span) {
  @apply text-[#475466] text-[14px] font-medium;
  font-family: 'PingFang SC', sans-serif;
}

:deep(.el-menu-item.is-active span) {
  @apply text-[#3250bd];
}

:deep(.el-menu-item:not(.is-active):hover) {
  background-color: #f0f3ff;
}
</style>
