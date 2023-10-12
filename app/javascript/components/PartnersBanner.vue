<template>
    <div class="flex justify-center items-center sm:flex-col pl-[36px] pr-[20px] gap-x-[109px] bg-white max-w-[1280px] m-auto">
        <div class="grow-[1.5]">
            <div class="text-[48px] sm:text-[23px] sm:pt-[10px] text-[#303133] font-semibold mb-[18px]">OpenCSG Partner Network</div>
            <div class="text-[18px] sm:text-[18px] font-normal leading-[26px]">OpenCSG is a collaborative ecosystem initiative that connects partners and empowers them to build large-scale models for customers across various industries.</div>
        </div>
        <div class="grow flex justify-center">
            <img :src="bannerUrl" class="max-w-[298px]" />
        </div>
    </div>
  </template>
  <script>

export default {
    props: {
        bannerPic:String
    },
  
    data() {
      return {
        bannerUrl:this.bannerPic
      };
    },
    mounted() {},
  }
  </script>