<template>
  <div class="menuItem min-h-max flex gap-[16px] py-[10px]">
    <div class="pt-[6px]">
      <SvgIcon name="navbar_csghub" />      
    </div>
    <div class="max-w-[247px] flex flex-col whitespace-normal">
      <div class="text-[#101828] flex gap-[8px] items-center">
        {{ $t('navbar.csgHub') }}
        <SvgIcon name="hot_fire" width="16" height="16" />
      </div>
      <div
        class="text-[14px] text-[#475467] font-light leading-[20px] md:hidden"
      >
      {{ $t('navbar.csgHubText') }}
      </div>
    </div>
  </div>
</template>
