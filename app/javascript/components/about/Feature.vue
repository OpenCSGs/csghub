<template>
  <div class="bg-[#F9FAFB] flex flex-col justify-center py-[96px] md:py-[64px] text-center">
    <div class="max-w-[1280px] m-auto md:px-[16px]">
      <div class="text-[16px] leading-[24px] md:text-[14px] md:leading-[20px] text-[#223B99] mb-[8px]">
        {{ $t('landingPage.feature.subtitle') }}
      </div>
      <div class="text-[48px] leading-[60px] md:text-[30px] md:leading-[38px] text-[#101828] mb-[20px]">
        {{ $t('landingPage.feature.title') }}
      </div>
      <div class="text-[20px] leading-[30px] md:text-[18px] md:leading-[28px] text-[#475467] mb-[64px]" >
        {{ $t('landingPage.feature.desc') }}
      </div>
      <div class="grid grid-cols-3  md:grid-cols-1 gap-[32px] justify-items-center">
        <div class="flex flex-col items-center">
          <div class="mb-[16px] px-[12px] py-[12px] border border-[ #EAECF0] bg-[#FFF] rounded-[10px]">
            <SvgIcon name="feature_integration" width="24" height="24" />
          </div>
          <div class="text-[20px] mb-[8px] md:text-[18px] md:leading-[28px] text-[#101828] leading-[30px]">
            {{ $t('landingPage.feature.item_1_title') }}
          </div>
          <div class="text-[16px] text-[#475467] leading-[24px] font-light">
            {{ $t('landingPage.feature.item_1_desc') }}
          </div>
        </div>
        <div class="flex flex-col items-center">
          <div class="mb-[16px] px-[12px] py-[12px] border border-[ #EAECF0] bg-[#FFF] rounded-[10px]">
            <SvgIcon name="feature_governance" width="24" height="24" />
          </div>
          <div class="text-[20px] mb-[8px] md:text-[18px] md:leading-[28px] text-[#101828] leading-[30px]">
            {{ $t('landingPage.feature.item_2_title') }}
          </div>
          <div class="text-[16px] text-[#475467] leading-[24px] font-light">
            {{ $t('landingPage.feature.item_2_desc') }}
          </div>
        </div>
        <div class="flex flex-col items-center">
          <div class="mb-[16px] px-[12px] py-[12px] border border-[ #EAECF0] bg-[#FFF] rounded-[10px]">
            <SvgIcon name="feature_empowerment" width="24" height="24" />
          </div>
          <div class="text-[20px] mb-[8px] md:text-[18px] md:leading-[28px] text-[#101828] leading-[30px]">
            {{ $t('landingPage.feature.item_3_title') }}
          </div>
          <div class="text-[16px] text-[#475467] leading-[24px] font-light">
            {{ $t('landingPage.feature.item_3_desc') }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>