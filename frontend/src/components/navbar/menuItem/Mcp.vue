<template>
  <div class="menuItem min-h-max flex md:items-center gap-[16px] py-[10px]">
    <div class="pt-[6px] md:pt-0">
      <SvgIcon name="space_mcp" />
    </div>
    <div class="max-w-[247px] flex flex-col whitespace-normal">
      <div class="text-[#101828] text-[16px]">{{ $t('navbar.mcpText') }}</div>
      <div
        class="text-[14px] w-[247px] md:w-[unset] text-[#475467] font-light leading-[20px] md:hidden"
      >
        {{ $t('navbar.mcpText') }}
      </div>
    </div>
  </div>
</template>
