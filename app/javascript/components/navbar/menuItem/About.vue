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
          d="M13 11H17.8C18.9201 11 19.4802 11 19.908 11.218C20.2843 11.4097 20.5903 11.7157 20.782 12.092C21 12.5198 21 13.0799 21 14.2V21M13 21V6.2C13 5.0799 13 4.51984 12.782 4.09202C12.5903 3.71569 12.2843 3.40973 11.908 3.21799C11.4802 3 10.9201 3 9.8 3H6.2C5.0799 3 4.51984 3 4.09202 3.21799C3.71569 3.40973 3.40973 3.71569 3.21799 4.09202C3 4.51984 3 5.0799 3 6.2V21M22 21H2M6.5 7H9.5M6.5 11H9.5M6.5 15H9.5"
          stroke="#3250BD"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
    <div class="max-w-[247px] flex flex-col whitespace-normal">
      <div class="text-[#101828] text-[16px]">{{ $t('navbar.about') }}</div>
      <div
        class="text-[14px] w-[247px] md:w-[unset] text-[#475467] font-light leading-[20px] md:hidden"
      >
        {{ $t('navbar.aboutText') }}
      </div>
    </div>
  </div>
</template>
<style scoped>
</style>
