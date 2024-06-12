<template>
  <div class="menuItem min-h-max flex gap-[16px] py-[10px]">
    <div class="pt-[6px]">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M6 19C3.79086 19 2 17.2091 2 15C2 13.1358 3.27532 11.5694 5.00111 11.1257C5.00037 11.0839 5 11.042 5 11C5 7.13401 8.13401 4 12 4C15.6099 4 18.5815 6.73249 18.9594 10.2419C20.7284 10.8481 22 12.5255 22 14.5C22 16.9853 19.9853 19 17.5 19C13.7609 19 10.1876 19 6 19Z"
          stroke="#3250BD"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
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
