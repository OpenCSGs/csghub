<template>
  <div
    v-show="!isCollapse"
    class="w-[240px] flex-shrink-0 border-r border-gray-200 bg-gray-50">
    <el-scrollbar
      class="h-full"
      wrap-class="h-full">
      <el-menu
        class="left-0 w-60 h-full py-8 bg-[#f8f9fb] border-r border-[#eaecf0]"
        :default-active="activeIndex"
        router>
        <template
          v-for="item in menuRenderList"
          :key="item.name">
          <div class="menu-section-title">{{ item.name }}</div>
          <el-menu-item
            v-for="child in item.children"
            :key="child.name"
            :index="child.path"
            class="menu-item">
            <SvgIcon
              v-if="activeIndex === child.path"
              name="admin-menu-active-icon"
              width="4"
              height="20" />
            <div>
              <div class="menu-item-content">
                <SvgIcon
                  :name="child.icon"
                  width="20"
                  height="20" />
                <span>{{ child.name }}</span>
              </div>
            </div>
          </el-menu-item>
        </template>
      </el-menu>

      <!-- 折叠按钮 -->
      <div
        v-if="activeIndex !== '/admin_next'"
        class="collapse-btn"
        @click="emit('hideAdminMenu')">
        <SvgIcon
          name="admin-menu-to-left"
          width="20"
          height="20" />
      </div>
    </el-scrollbar>
  </div>
</template>

<script setup>
  import { ref, computed } from 'vue'
  import { menuRenderList } from '../router'
  import { useRoute } from 'vue-router'
  import SvgIcon from '../../shared/SvgIcon.vue'

  const props = defineProps({
    isCollapse: Boolean
  })

  const emit = defineEmits(['hideAdminMenu'])

  const route = useRoute()
  const activeIndex = computed(() => {
    return route.fullPath
  })
  // const isCollapse = ref(false)

  // const toggleCollapse = () => {
  //   isCollapse.value = !isCollapse.value
  // }
</script>

<style scoped lang="postcss">
  .menu-section-title {
    @apply text-[16px] text-[#0f1728] font-normal leading-normal mb-4 px-5;
    font-family: 'PingFang SC', sans-serif;
  }

  .menu-item-content {
    @apply flex items-center gap-2 transition-all duration-300;
  }

  .active-indicator {
    @apply w-[4px] h-[20px] bg-[#3250bd] rounded-tr-lg rounded-br-lg;
  }

  .collapse-btn {
    @apply absolute bottom-4 right-4 w-8 h-8 flex items-center justify-center cursor-pointer;
    z-index: 1000;
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
    @apply flex items-center px-5 gap-5 h-[40px] py-2 rounded-lg hover:bg-[#f0f3ff];
  }

  :deep(.el-menu-item.menu-item.is-active) {
    @apply flex items-center !px-0 gap-5 h-[40px] py-2 rounded-lg hover:bg-[#f0f3ff];
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

  :deep(.el-menu--collapse) {
    .el-menu-item span {
      display: none;
    }
  }
</style>
