<template>
  <div>
    <div class="mx-auto max-w-[1280px] pt-[127px] md:py-[40px] md:mt-[40px]">
      <div class="text-[#000] text-5xl font-semibold mb-[32px] text-center md:text=[28px] md:mb-[8px]">
        Why Go <span>OpenCSG</span>
      </div>
      <div
        class="flex justify-between mb-[139px] xl:px-[20px] md:flex-col md:items-center md:justify-center md:mb-[40px] md:mt-[20px] md:gap-[20px]">
        <div class="flex items-center flex-col gap-4 max-w-[256px] md:gap-2">
          <img src="/images/about/home/integrate.png" class="feature-icon w-[140px] h-[140px]" alt="OpenCSG"/>
          <div class="text-[#000] text-[30px] font-semibold leading-[38px] md:text-[24px] mb-0">
            整合
          </div>
          <div class="text-center text-[18px] leading-[26px] text-[#909399] md:text-[14px]">
            通过运用自然语言实现混合云资源的整合利用，自然语言处理技术能够简化工作流程，降低IT基础设施成本同时提高团队之间的协作效率
          </div>
        </div>
        <div class="flex items-center flex-col gap-4 max-w-[256px] md:gap-2">
          <img src="/images/about/home/governance.png" class="feature-icon w-[140px] h-[140px]" alt="OpenCSG"/>
          <div class="text-[#000] text-[30px] font-semibold leading-[38px] md:text-[24px] mb-0">
              治理
          </div>
          <div class="text-center  text-[18px] leading-[26px] text-[#909399] md:text-[14px]">
            使大模型更易于使用，为垂直行业定制解决方案，使得每个公司及个人都能够拥有自己的大模型
          </div>
        </div>
        <div class="flex items-center flex-col gap-4 max-w-[256px] md:gap-2">
          <img src="/images/about/home/empower.png" class="feature-icon w-[140px] h-[140px]" alt="OpenCSG"/>
          <div class="text-[#000] text-[30px] font-semibold leading-[38px] md:text-[24px] mb-0">
            赋能
          </div>
          <div class="text-center  text-[18px] leading-[26px] text-[#909399] md:text-[14px]">
            通过利用自然语言发挥大模型的潜力从而彻底改变软件开发的方式，赋能每个人设计、创建、实施、并快速集成软件产品到现有系统；
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
              <img :src="`/images/about/home/carousel/feature-${item}.png`" class="w-full rounded-[8px] h-[600px] xl:h-[520px] lg:h-[400px] sm:h-[200px]" alt="OpenCSG"/>
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
