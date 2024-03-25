<template>
  <div class="py-[96px] md:py-[64px] md:mb-[32px] text-center w-full banner bg-white">
    <div class="flex justify-center items-center flex-col max-w-[1280px] m-auto xl:px-[20px]">
      <div class="max-w-[850px] m-auto md:mb-[12px] font-medium text-[48px] md:text-[36px] md:text-[48px] md:leading-[50px] text-[#101828] leading-[90px]">
        {{ $t('computing.banner.headline') }}
      </div>
      <div class="mb-[48px] md:mb-[24px] text-[20px] md:text-[18px] font-light text-[#475467] leading-[30px]">
        {{ $t('computing.banner.desc') }}
      </div>
      <!-- <div class="flex justify-center items-center bg-[#F9FAFB] p-[6px] gap-[4px] rounded-[12px] border border-[#EAECF0] text-[#344054]">
        <div class="bg-white py-[8px] px-[12px] md:px-[38px] rounded-[6px] border cursor-pointer">{{ $t('computing.banner.option1') }}</div>
        <div class="flex justify-center items-center gap-[8px] py-[8px] px-[12px] text-[#667085]"><p class="cursor-pointer">{{ $t('computing.banner.option2') }}</p>
          <div class="py-[2px] px-[10px] text-[14px] rounded-[16px] border border-[#EAECF0] text-[#344054]">{{ $t('computing.banner.option3') }}</div>
        </div>
      </div> -->
    </div>
  </div>
</template>
