<template>
  <div class="pb-[96px] lg:pb-[64px] w-full bg-white">
    <div class="flex lg:flex-col justify-between max-w-[1280px] m-auto px-[32px]">
      <div class="flex flex-col">
        <div
          class="flex items-center justify-center will-change-contents w-[130px] mb-[12px] h-[28px] ml-[8px] border border-[#99AFFF] rounded-[16px] text-[14px] text-[#223B99] bg-[#CED8FF]">
          {{ $t('csghub.serve.recommend') }}
        </div>
        <div class="font-medium text-[36px] md:text-[30px] mb-[20px]">
          {{ $t('csghub.serve.headline') }}
        </div>
        <div class="font-light text-[20px] md:text-[18px] text-[#475467] mb-[32px]">
          {{ $t('csghub.serve.desc') }}
        </div>
        <div class="flex md:flex-col gap-[12px]">
          <a href="#" target="_blank"
            class="flex justify-center cursor-pointer md:w-[343px] mb-[48px] md:mb-[12px] py-[16px] px-[22px] text-[18px] leading-[28px] border rounded-[8px]">
            {{ $t("csghub.serve.doc") }}
          </a>
          <a href="#" target="_blank"
            class="flex cursor-pointer justify-center md:w-[343px] mb-[48px] py-[16px] px-[22px] text-[18px] leading-[28px] text-[#FFF] bg-[#3250BD] border border-[#3250BD] rounded-[8px]">
            {{ $t("csghub.serve.register") }}
          </a>
        </div>
      </div>
      <div class="w-[560px] lg:w-auto lg:h-auto h-[236px]">
        <el-image src="/images/csghub/serve.png" :preview-src-list="['/images/csghub/serve.png']" />
      </div>
    </div>
  </div>
</template>
