<template>
  <div>
    <div class="mx-auto max-w-[1280px] pt-[127px] md:py-[40px] md:mt-[40px]">
      <div class="text-[#000] text-5xl font-semibold mb-[32px] text-center md:text=[28px] md:mb-[8px]">
        Why Go <span>OpenCSG</span>
      </div>
      <div
        class="flex justify-between mb-[139px] xl:px-[20px] md:flex-col md:items-center md:justify-center md:mb-[40px] md:mt-[20px] md:gap-[20px]">
        <div class="flex items-center flex-col gap-4 max-w-[256px] md:gap-2">
          <img src="/images/about/integrate.png" class="feature-icon w-[140px] h-[140px]" alt="OpenCSG"/>
          <div class="text-[#000] text-[30px] font-semibold leading-[38px] md:text-[24px] mb-0">
            {{ $t('about.feature.Integration') }}
          </div>
          <div class="text-center text-[18px] leading-[26px] text-[#909399] md:text-[14px]">
            {{ $t('about.feature.IntegrationText') }}
          </div>
        </div>
        <div class="flex items-center flex-col gap-4 max-w-[256px] md:gap-2">
          <img src="/images/about/governance.png" class="feature-icon w-[140px] h-[140px]" alt="OpenCSG"/>
          <div class="text-[#000] text-[30px] font-semibold leading-[38px] md:text-[24px] mb-0">
            {{ $t('about.feature.Governance') }}
          </div>
          <div class="text-center  text-[18px] leading-[26px] text-[#909399] md:text-[14px]">
            {{ $t('about.feature.GovernanceText') }}
          </div>
        </div>
        <div class="flex items-center flex-col gap-4 max-w-[256px] md:gap-2">
          <img src="/images/about/empower.png" class="feature-icon w-[140px] h-[140px]" alt="OpenCSG"/>
          <div class="text-[#000] text-[30px] font-semibold leading-[38px] md:text-[24px] mb-0">
            {{ $t('about.feature.Empowerment') }}
          </div>
          <div class="text-center  text-[18px] leading-[26px] text-[#909399] md:text-[14px]">
            {{ $t('about.feature.EmpowermentText') }}
          </div>
        </div>
      </div>
      <div class="mx-auto max-w-full 2xl:w-[80%] xl:px-[20px] md:px-[20px] lg:w-[90%] sm:w-[380px] h-[600px] xl:h-[520px] lg:h-[400px] sm:h-[200px]">
        <el-carousel class="rounded-[8px] h-[600px] xl:h-[520px] lg:h-[400px] sm:h-[200px]"
                     :autoplay="true"
                     arrow="always"
        >
          <el-carousel-item class="" v-for="item in 10" :key="item">
            <div>
              <img :src="`/images/about/carousel/feature-${item}.png`" class="w-full rounded-[8px] h-[600px] xl:h-[520px] lg:h-[400px] sm:h-[200px]" alt="OpenCSG"/>
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>
  </div>
</template>
<style>
  .el-carousel__container {
    height: 100% !important;
  }
  .el-carousel__arrow {
    background-color: lightgray;
    opacity: 0.6;
  }
</style>
