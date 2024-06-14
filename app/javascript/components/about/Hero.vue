<template>
  <div class="bg-white pb-[80px] md:pb-0">
    <div
        class="2xl:h-[75vh] xl:h-[100%] flex items-center mx-auto max-w-[1280px] gap-[104px] xl:flex-col xl:gap-[20px] xl:py-[40px] xl:px-[20px]">
      <div class="h-auto">
        <img src="/images/about/hero.png" class="w-[600px]" alt="OpenCSG"/>
      </div>
      <div class="xl:flex xl:flex-col xl:items-center text-center">
        <div class="text-[48px] font-semibold text-[#303133] mb-[24px] md:text-[28px] md:text-center">
          {{ $t('landingPage.hero.headTitle') }}
        </div>
        <div class="text-[20px] leading-[28px] text-[#60626] mb-[24px] md:text-[14px]">
          {{ $t('landingPage.hero.headDesc') }}
        </div>
        <div class="flex justify-center gap-[8px]">
          <a href="https://opencsg.com/" target="_blank"
            class="flex w-[230px] h-[48px] justify-center items-center rounded-[40px] text-[#fff] bg-[#000] text-[20px] leading-[28px] font-semibold no-underline">
            {{ $t('landingPage.joinus.JoinUS') }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>


