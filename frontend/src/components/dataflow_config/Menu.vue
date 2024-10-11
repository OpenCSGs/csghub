<template>
  <el-aside style="width: auto !important" class="border-r border-[#EAECF0] bg-[#F9FAFB] mobile:hidden relative">
    <div class="aside-box pt-[24px]" :style="{ width: isCollapse ? '80px' : '240px' }">
      <el-scrollbar>
        <el-menu
          default-active="1"
          class="el-menu-vertical"
          :collapse="isCollapse"
          @open="handleOpen"
          @close="handleClose"
          :collapse-transition="false"
          popper-class="menuPopperClass"
        >
        <el-menu-item
         index="1"
              @click="handleClickMenu('/dataflow')"
            >
              <SvgIcon name="menuline" class="menuline w-[4px] h-[20px] mr-[4px] absolute left-0" />
              <div class="innerBox w-full px-[12px] py-[8px]">
                <SvgIcon name="menuIcon2" class="w-[20px] h-[20px]" />
                <span class="sle ml-[8px]">数据处理</span>
              </div>
            </el-menu-item>
            <el-menu-item
             index="2"
              @click="handleClickMenu('/algTemplate')"
            >
              <SvgIcon name="menuline" class="menuline w-[4px] h-[20px] mr-[4px] absolute left-0" />
              <div class="innerBox w-full px-[12px] py-[8px]">
                <SvgIcon name="menuIcon1" class="w-[20px] h-[20px]" />
                <span class="sle ml-[8px]">算法模版</span>
              </div>
            </el-menu-item>
        </el-menu>
      </el-scrollbar>
    </div>
    <SvgIcon
      :name="isCollapse ? 'alignR' : 'alignL'"
      class="w-[20px] h-[20px] absolute bottom-[30px] right-[30px] cursor-pointer"
      :class="{ alignRBtn: isCollapse }"
      @click="changeCollapse"
    />
  </el-aside>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { useGlobalStore } from '../../stores/useGlobalStore';
import { useRouter, useRoute } from 'vue-router';

import { useI18n } from 'vue-i18n'

  const { t } = useI18n()

const user = JSON.parse(localStorage.getItem('user'));
const isSuperUser = user && user.is_superuser;
const router = useRouter();
const route = useRoute();
const routes = router.getRoutes();
const handleClickMenu = (path) => {
  router.push(path);
};
const menuRoutes = computed(() => {
  const mainRoute = router.getRoutes().find((r) => r.path === '/' && r.name === 'main');
  return mainRoute && mainRoute.children
    ? mainRoute.children.map((r) => ({
        ...r,
        children:
          r.children &&
          r.children.map((sub) => ({
            ...sub,
            path: `${r.path}/${sub.path}`,
          })),
      }))
    : [];
});
const getDefaultActive = () => {
  return route.path;
};
const globalStore = useGlobalStore();
const isCollapse = computed(() => globalStore.isCollapse);
const changeCollapse = () => {
  globalStore.toggleCollapse();
};
const handleOpen = (key, keyPath) => {
  console.log(key, keyPath);
  router.push(keyPath);
};
const toPath = (path) => {
  router.push(path);
};
const handleClose = (key, keyPath) => {
  console.log(key, keyPath);
};
function handleResize() {
  globalStore.setCollapse(window.innerWidth < 1280);
}
watch();

onMounted(() => {
  handleResize(); // 初始化侧边栏
  window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
});
defineExpose();
</script>

<style scoped lang="scss">
.sle {
  font-weight: 500 !important;
}
.alignRBtn {
  right: 50%;
  transform: translateX(50%);
}
.logo {
  padding: 16.5px 20px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  border-bottom: 1px solid #eaecf0;
  // margin-bottom: 12px;
  &.closeLogo {
    justify-content: center;
    padding: 15.5px 20px;
    .logo-img {
      // padding: 2.5px 0;
    }
  }
  .logo-img {
    width: 32px;
    // margin-right: 4px;
  }
  .logofull-img {
    width: 114px;
  }
  .logo-text {
    // color: var(--el-Text-color-primary, #303133);
    color: var(--el-Text-color-primary, #1c8b7f);
    font-size: 16px;
    font-weight: 700;
  }
}
.el-menu-vertical {
  border: none !important;
}
.innerBox {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
:deep(.el-menu-item) {
  padding: 0 20px;
  span {
    line-height: 24px;
    font-weight: 500;
  }
}
.menuline {
  display: none;
}
:deep(.el-sub-menu.is-active) {
  .menuline {
    display: block;
  }
}
:deep(.el-menu-item.is-active) {
  .menuline {
    display: block;
  }
  color: #3250bd;
  .innerBox {
    border-radius: var(--radius-8, 8px);
    background: var(--Brand-25, #f0f3ff);
  }
}
:deep(.el-menu--collapse) {
  width: 100% !important;
  .el-menu-item {
    // padding: 0 10px;
  }
  .el-sub-menu__title {
    position: static;
  }
  .innerBox,
  .el-sub-menu__title {
    width: auto;
    padding: 10px !important;
    justify-content: center;
  }
  span {
    display: none !important;
  }
  .el-sub-menu {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
:deep(.el-sub-menu__title) {
  padding: 0 10px 0 17px;
  .subItemIco {
    margin-left: 12px;
  }
}
:deep(.el-tooltip__trigger) {
  padding-left: 22px;
  .subItemIco {
    margin-left: 0;
  }
}
:deep(.el-menu-item) {
  &:hover {
    background: transparent;
    color: #3250bd;
  }
}
:deep(.el-sub-menu__title) {
  &:hover {
    background: transparent;
    color: #3250bd;
  }
}
:deep(.el-menu--collapse .el-sub-menu.is-active .el-sub-menu__title) {
  color: #3250bd;
}
</style>
