<template>
  <div class="team">
    <div class="m-auto max-w-[1280px] pt-[127px] md:py-[40px] md:px-[20px]">
      <div class="text-[30px] font-semibold text-[#303133] mb-[24px] leading-[38px] text-center">
        {{ $t('about.team.Introduction') }}
      </div>
      <div class="flex flex-wrap items-center gap-[24px] xl:justify-center md:flex-col">
        <div class="lg:h-auto xl:w-[320px] sm:w-[100%] xl:h-[450px] max-w-[410px] xl:w-[350px] flex-shrink-0 rounded-[8px] border border-[#DCDFE6] bg-white">
          <img src="/images/about/sam.png"  class="max-w-[410px] w-full max-h-[386px] xl:h-auto lg:h-auto  md:h-auto" alt="OpenCSG"/>
          <div class="mt-[20px] mr-0 mb-[4px] ml-[20px] text-[20px] font-semibold text-[#000] leading-[28px]">{{ $t('about.team.Sam') }}</div>
          <div class="text-[18px] text-[#909399] leading-[26px] ml-[20px] mb-[20px]">{{ $t('about.team.FounderCEO') }}</div>
        </div>
        <div class="lg:h-auto xl:w-[320px] sm:w-[100%] xl:h-[450px] max-w-[410px] xl:w-[350px] flex-shrink-0 rounded-[8px] border border-[#DCDFE6] bg-white">
          <img src="/images/about/wangwei.png" width="410" height="386" class="max-w-[410px] w-full max-h-[386px] xl:h-auto lg:h-auto md:h-auto" alt="OpenCSG"/>
          <div class="mt-[20px] mr-0 mb-[4px] ml-[20px] text-[20px] font-semibold text-[#000] leading-[28px]">{{ $t('about.team.WangWei') }}</div>
          <div class="text-[18px] text-[#909399] leading-[26px] ml-[20px] mb-[20px]">{{ $t('about.team.CoFounderCTO') }}</div>
        </div>
        <div class="lg:h-auto xl:w-[320px] sm:w-[100%] xl:h-[450px] max-w-[410px] xl:w-[350px] flex-shrink-0 rounded-[8px] border border-[#DCDFE6] bg-white">
          <img src="/images/about/jiaqing.png" width="410" height="386" class="max-w-[410px] w-full max-h-[386px] xl:h-auto lg:h-auto md:h-auto" alt="OpenCSG"/>
          <div class="mt-[20px] mr-0 mb-[4px] ml-[20px] text-[20px] font-semibold text-[#000] leading-[28px]">{{ $t('about.team.JiaQing') }}</div>
          <div class="text-[18px] text-[#909399] leading-[26px] ml-[20px] mb-[20px]">{{ $t('about.team.CoFounderCMO') }}</div>
        </div>
      </div>
    </div>
  </div>
</template>