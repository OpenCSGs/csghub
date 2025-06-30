<template>
  <el-aside
    style="width: auto !important"
    class="border-r border-gray-200 bg-gray-50 sm:hidden relative"
  >
    <div
      class="aside-box pt-6"
      :style="{ width: isCollapse ? '80px' : '240px' }"
    >
      <el-menu
        :default-active="currentRoute"
        class="el-menu-vertical"
        :collapse="isCollapse"
        :collapse-transition="false"
      >
        <el-menu-item
          index="1"
          @click="handleClickMenu('/datapipelines')"
        >
          <SvgIcon
            name="dataflow_menuline"
            class="menuline w-1 h-5 mr-1 absolute left-0"
          />
          <div class="innerBox w-full px-3 py-2">
            <SvgIcon
              name="dataflow_menuIcon_tlp"
              class="w-5 h-5"
            />
            <span class="sle ml-2">{{
              t('dataPipelines.dataProcessing')
            }}</span>
          </div>
        </el-menu-item>
        <el-menu-item
          index="2"
          @click="handleClickMenu('/datapipelines/algTemplate')"
        >
          <SvgIcon
            name="dataflow_menuline"
            class="menuline w-1 h-5 mr-1 absolute left-0"
          />
          <div class="innerBox w-full px-3 py-2">
            <SvgIcon
              name="dataflow_menuIcon"
              class="w-5 h-5"
            />
            <span class="sle ml-2">{{
              t('dataPipelines.algorithmTemplate')
            }}</span>
          </div>
        </el-menu-item>
        <el-menu-item
          index="3"
          @click="handleClickMenu('/datapipelines/tools')"
        >
          <SvgIcon
            name="dataflow_menuline"
            class="menuline w-1 h-5 mr-1 absolute left-0"
          />
          <div class="innerBox w-full px-3 py-2">
            <SvgIcon
              name="dataflow_menuIcon_tools"
              class="w-5 h-5"
            />
            <span class="sle ml-2">{{ t('dataPipelines.toolsTit') }}</span>
          </div>
        </el-menu-item>
      </el-menu>
    </div>
    <SvgIcon
      :name="isCollapse ? 'dataflow_alignR' : 'dataflow_alignL'"
      class="w-5 h-5 absolute bottom-7.5 right-7.5 cursor-pointer"
      :class="{ alignRBtn: isCollapse }"
      @click="changeCollapse"
    />
  </el-aside>
</template>

<script setup>
  import { onMounted, onBeforeUnmount, computed, watch, ref } from 'vue'
  import { useGlobalStore } from '../../stores/useGlobalStore'
  import { useRouter, useRoute } from 'vue-router'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()
  const router = useRouter()
  const route = useRoute()
  const routes = router.getRoutes()
  const currentRoute = ref('1')
  const menuRoutes = {
    '/datapipelines': '1',
    '/datapipelines/newTask': '1',
    '/datapipelines/dataflowInfo': '1',
    '/datapipelines/algTemplate': '2',
    '/datapipelines/newTemplate': '2',
    '/datapipelines/tools': '3'
  }
  const handleClickMenu = (path) => {
    router.push(path)
  }
  watch(
    () => router.currentRoute.value.path,
    (newPath) => {
      currentRoute.value = menuRoutes[newPath] || '1'
    }
  )
  const globalStore = useGlobalStore()
  const isCollapse = computed(() => globalStore.isCollapse)
  const changeCollapse = () => {
    globalStore.toggleCollapse()
  }
  function handleResize() {
    globalStore.setCollapse(window.innerWidth < 1280)
  }
  onMounted(() => {
    handleResize()
    window.addEventListener('resize', handleResize)
    const currentPath = router.currentRoute.value.path
    currentRoute.value = menuRoutes[currentPath] || '1'
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize)
  })
  defineExpose()
</script>

<style scoped lang="less">
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
    &.closeLogo {
      justify-content: center;
      padding: 15.5px 20px;
    }
    .logo-img {
      width: 32px;
    }
    .logofull-img {
      width: 114px;
    }
    .logo-text {
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
  :deep(.el-menu) {
    background: transparent !important;
  }
  :deep(.el-scrollbar__view) {
    height: 90vh !important;
    overflow: hidden !important;
  }
  :deep(.aside-box) {
    height: calc(100% - 24px);
    overflow: hidden !important;
  }
</style>
