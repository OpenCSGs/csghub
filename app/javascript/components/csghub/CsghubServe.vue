<template>
  <div class="pb-[96px] w-full bg-white">
    <div class="flex justify-between max-w-[1280px] m-auto px-[32px]">
      <div class="flex flex-col">
        <div class="flex items-center justify-center w-[80px] mb-[12px] h-[28px] ml-[8px] border border-[#99AFFF] rounded-[16px] text-[14px] text-[#223B99] bg-[#CED8FF]">
          {{ $t('csghub.serve.recommend') }}
        </div>
        <div class="font-medium text-[36px] mb-[20px]">
          {{ $t('csghub.serve.headline') }}
        </div>
        <div class="font-light text-[20px] text-[#475467] mb-[32px]">
          {{ $t('csghub.serve.desc') }}
        </div>
        <div class="flex gap-[12px]">
          <a href="#" target="_blank"
            class="cursor-pointer mb-[48px] inline-block py-[16px] px-[22px] text-[18px] leading-[28px] border rounded-[8px]"
          >
            {{ $t("csghub.serve.doc") }}
          </a>
          <a href="#" target="_blank"
            class="cursor-pointer mb-[48px] inline-block py-[16px] px-[22px] text-[18px] leading-[28px] text-[#FFF] bg-[#3250BD] border border-[#3250BD] rounded-[8px]"
          >
            {{ $t("csghub.serve.register") }}
          </a>
        </div>
      </div>
      <div class="w-[560px] h-[236px]">
        <el-image
              src="/images/product/serve.png"
              :preview-src-list="['/images/product/serve.png']"
        />
      </div>
    </div>
  </div>
</template>
