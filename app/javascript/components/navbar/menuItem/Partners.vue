<template>
  <div class="menuItem min-h-max flex md:items-center gap-[16px] py-[10px]">
    <div class="pt-[6px] md:pt-0">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M18 15.8369C19.4559 16.5683 20.7042 17.742 21.6153 19.2096C21.7957 19.5003 21.8859 19.6456 21.9171 19.8468C21.9805 20.2558 21.7008 20.7585 21.32 20.9204C21.1325 21 20.9217 21 20.5 21M16 11.5322C17.4817 10.7959 18.5 9.26686 18.5 7.5C18.5 5.73314 17.4817 4.20411 16 3.46776M14 7.5C14 9.98528 11.9853 12 9.50002 12C7.01474 12 5.00002 9.98528 5.00002 7.5C5.00002 5.01472 7.01474 3 9.50002 3C11.9853 3 14 5.01472 14 7.5ZM2.55925 18.9383C4.15356 16.5446 6.66939 15 9.50002 15C12.3306 15 14.8465 16.5446 16.4408 18.9383C16.7901 19.4628 16.9647 19.725 16.9446 20.0599C16.9289 20.3207 16.758 20.64 16.5496 20.7976C16.2819 21 15.9138 21 15.1777 21H3.82238C3.08619 21 2.7181 21 2.45046 20.7976C2.24207 20.64 2.07111 20.3207 2.05545 20.0599C2.03535 19.725 2.20998 19.4628 2.55925 18.9383Z"
          stroke="#3250BD"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
    <div class="max-w-[247px] flex flex-col whitespace-normal">
      <div class="text-[#101828]">{{ $t('navbar.partner') }}</div>
      <div
        class="text-[14px] w-[247px] md:w-[unset] text-[#475467] font-light leading-[20px] md:hidden"
      >
      {{ $t('navbar.partnerText') }}
      </div>
    </div>
  </div>
</template>
<style scoped>
</style>
