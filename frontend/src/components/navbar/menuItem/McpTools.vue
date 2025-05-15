<template>
  <div class="menuItem min-h-max flex md:items-center gap-4 py-2.5">
    <div class="pt-0.5 md:pt-0">
      <SvgIcon name="space_mcp" width="20px" />
    </div>
    <div class="max-w-[247px] flex flex-col whitespace-normal">
      <div class="text-gray-900 text-md">{{ $t('navbar.mcpTools') }}</div>
      <div
        class="text-sm w-[247px] md:w-[unset] text-gray-600 font-light leading-5 md:hidden"
      >
        {{ $t('navbar.mcpToolsText') }}
      </div>
    </div>
  </div>
</template>
