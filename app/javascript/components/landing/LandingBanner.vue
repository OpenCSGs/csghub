<template>
    <div class="text-center w-full banner py-[96px] md:px-[16px]">
      <div class="sm:w-full max-w-[1280px] m-auto">
        <div class="relative mb-[24px] tracking-[-1.2px] md:tracking-[-0.72px] m-auto text-[60px] md:text-[36px] md:leading-[44px] text-[#101828] leading-[72px]">
          <span class="relative z-10 font-medium md:font-normal">让大模型 赋能 每一个人</span>
          <!-- underline svg -->
          <svg class="absolute bottom-0 left-[40%] md:hidden" xmlns="http://www.w3.org/2000/svg" width="264" height="24" viewBox="0 0 264 24" fill="none"><path d="M8 8H195.741L61.8999 16H256" stroke="#ACBDFF" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <svg class="absolute bottom-0 left-[37%] hidden md:block" xmlns="http://www.w3.org/2000/svg" width="98" height="20" viewBox="0 0 98 20" fill="none"><path d="M6 6H71.1038L24.6911 14H92" stroke="#ACBDFF" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
        <div class="text-[20px] font-light text-[#475467] leading-[30px] mb-[48px] md:mb-[32px]">
          大模型驱动全民，推动技术加速创新。
        </div>
        <span class="md:block md:mx-[20px] px-[22px] py-[16px] rounded-[8px] text-[#FFF] bg-[#32508D] border border-[32508D] cursor-pointer">加入社区</span>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {},
  
    data() {
      return {};
    },
  
    components: {},
  
    mounted() {},
  };
  </script>
  <style scoped>
    .banner{
      background-image: url('../images/BackgroundPattern.png');
      background-repeat: no-repeat;
      background-size: auto;
      background-position: top
    }
  </style>
  