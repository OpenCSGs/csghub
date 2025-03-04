<template>
  <div
    class="w-[240px] md:hidden md:w-full px-5 pt-[24px] font-medium text-[#475467] border-r"
    :style="`background:linear-gradient(270deg, #FCFCFC 0%, #FFF 100%)`"
  >
    <div class="flex flex-col top-[104px] gap-1 md:flex-row text-[14px] leading-[24px]">
      <a
        href="/prompts/library"
        class="p-3 hover:bg-[#F9FAFB] rounded-[8px] cursor-pointer"
        :class="menuClass('/prompts/library')"
      >
        <div class="flex gap-2">
          <SvgIcon :name="menuIcon('/prompts/library')" />
          {{ $t('prompts.promptLibrary') }}
        </div>
      </a>
      <!-- <a
        href="/prompts/library"
        class="p-3 hover:bg-[#F9FAFB] rounded-[8px] cursor-pointer"
        :class="menuClass('/prompts/model-comparison')"
      >
        <div class="flex gap-2">
          <SvgIcon :name="menuIcon('/prompts/model-comparison')" />
          {{ $t('prompts.modelComparison') }}
        </div>
      </a> -->
    </div>
  </div>
</template>

<script setup>
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
