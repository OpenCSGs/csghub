<template>
  <div class="hidden md:flex md:flex-col">
    <SvgIcon
      v-if="!mobileMenuVisibility"
      name="prompts_layout_left"
      width="20px"
      class="cursor-pointer"
      @click="mobileMenuVisibility = !mobileMenuVisibility"
    />
    <!-- mobile menu -->
    <el-drawer
      :z-index="998"
      v-model="mobileMenuVisibility"
      :size="320"
      :with-header="false"
      direction="ltr"
      style="--el-dialog-padding-primary: 12px 0px"
      class="mobile-menu"
    >
      <el-menu
        :default-active="activeIndex"
        :ellipsis="false"
        class="w-full flex flex-col gap-[8px] justify-center gap-[16px] pt-[60px]"
        unique-opened
        style="
          --el-menu-base-level-padding: 12px;
          --el-menu-item-font-size: 16px;
          --el-menu-item-font-weight: 500;
          --el-menu-item-height: auto;
        "
        text-color="#475467"
      >
        <a
          href="/prompts/library"
          class="p-3 hover:bg-[#F9FAFB] cursor-pointer md:pt-8 sm:pt-3"
          :class="menuClass('/prompts/library')"
        >
          <div class="flex gap-2">
            <SvgIcon :name="menuIcon('/prompts/library')" />
            {{ $t('prompts.promptLibrary') }}
          </div>
        </a>
        <!-- <a
          href="/prompts/library"
          class="p-3 hover:bg-[#F9FAFB] cursor-pointer"
          :class="menuClass('/prompts/model-comparison')"
        >
          <div class="flex gap-2">
            <SvgIcon :name="menuIcon('/prompts/model-comparison')" />
            {{ $t('prompts.modelComparison') }}
          </div>
        </a> -->
      </el-menu>
    </el-drawer>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  const mobileMenuVisibility = ref(false)
  
  const menuClass = (menuPath) => {
    if (window.location.pathname.includes(menuPath)) {
      return 'text-[#3250BD] bg-[#F0F3FF]'
    } else {
      return ''
    }
  }

  const menuIcon = (menuPath) => {
    // 解析菜单路径，去掉前缀和尾部的斜杠，并将斜杠和连字符替换为下划线
    const iconName = menuPath.replace(/^\/|\/$/g, '').replace(/[\/\-]/g, '_')
    // 判断当前路径是否包含清理后的菜单路径
    const isSelected = window.location.pathname.includes(
      menuPath.replace(/^\/|\/$/g, '')
    )
    // 根据是否选中，添加后缀
    const stateSuffix = isSelected ? '_selected' : ''
    // 返回生成的图标名称
    return `${iconName}${stateSuffix}`
  }
</script>
