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
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M21.2104 15.8906C20.5742 17.395 19.5792 18.7208 18.3123 19.7519C17.0454 20.7829 15.5452 21.488 13.9428 21.8053C12.3405 22.1227 10.6848 22.0427 9.12055 21.5724C7.55627 21.102 6.13103 20.2556 4.96942 19.1072C3.80782 17.9588 2.94522 16.5433 2.45704 14.9845C1.96886 13.4257 1.86996 11.771 2.169 10.1652C2.46804 8.55934 3.1559 7.05119 4.17245 5.77259C5.189 4.49399 6.50329 3.48388 8.0004 2.83056M21.2392 8.17372C21.6395 9.14019 21.8851 10.1619 21.9684 11.2014C21.989 11.4582 21.9993 11.5866 21.9483 11.7023C21.9057 11.7989 21.8213 11.8903 21.7284 11.9405C21.6172 12.0006 21.4783 12.0006 21.2004 12.0006H12.8004C12.5204 12.0006 12.3804 12.0006 12.2734 11.9461C12.1793 11.8981 12.1028 11.8216 12.0549 11.7276C12.0004 11.6206 12.0004 11.4806 12.0004 11.2006V2.80056C12.0004 2.52269 12.0004 2.38376 12.0605 2.27254C12.1107 2.17964 12.2021 2.09525 12.2987 2.05265C12.4144 2.00166 12.5428 2.01195 12.7996 2.03254C13.839 2.11588 14.8608 2.36144 15.8272 2.76176C17.0405 3.26431 18.1429 4.0009 19.0715 4.92949C20.0001 5.85808 20.7367 6.96047 21.2392 8.17372Z" stroke="#344054" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
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
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M13 2L4.09344 12.6879C3.74463 13.1064 3.57023 13.3157 3.56756 13.4925C3.56524 13.6461 3.63372 13.7923 3.75324 13.8889C3.89073 14 4.16316 14 4.70802 14H12L11 22L19.9065 11.3121C20.2553 10.8936 20.4297 10.6843 20.4324 10.5075C20.4347 10.3539 20.3663 10.2077 20.2467 10.1111C20.1092 10 19.8368 10 19.292 10H12L13 2Z" stroke="#344054" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
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
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M11 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21H16.2C17.8802 21 18.7202 21 19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362C21 18.7202 21 17.8802 21 16.2V13M12 8H16V12M15.5 3.5V2M19.4393 4.56066L20.5 3.5M20.5103 8.5H22.0103M3 13.3471C3.65194 13.4478 4.31987 13.5 5 13.5C9.38636 13.5 13.2653 11.3276 15.6197 8" stroke="#344054" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
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