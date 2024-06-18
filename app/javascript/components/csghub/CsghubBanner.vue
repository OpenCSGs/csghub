<template>
  <div class="py-[96px] px-[32px] md:py-[64px] text-center w-full banner bg-white m-auto max-w-[1280px]">
    <div class="flex flex-col items-center">
      <div
        class="mb-[24px] max-w-[1216px] m-auto text-[72px] md:text-[36px] md:leading-[60px] text-[#101828] leading-[90px]">
        {{ $t('csghub.banner.headline1') }}<br />{{ $t('csghub.banner.headline2') }}
      </div>
      <div class="text-[18px] font-light text-[#475467] leading-[30px] mb-[48px]">
        {{ $t('csghub.banner.solution') }}
      </div>
      <a href="/login"
        class="cursor-pointer mb-[48px] md:w-full inline-block py-[16px] px-[22px] text-[18px] leading-[28px] text-[#FFF] bg-[#3250BD] border border-[#3250BD] rounded-[8px]">
        {{ $t("csghub.banner.join") }}
      </a>
      <div class="w-[768px] mlg:w-full mt-[16px] rounded-[10px]">
        <el-image src="/images/csghub/demo.png" :preview-src-list="['/images/csghub/demo.png']" />
      </div>
    </div>
  </div>
</template>

<style scoped>
  .banner {
    mask-image: linear-gradient(
      var(--mask-direction, to bottom),
      transparent,
      #000 5%,
      #000 95%,
      transparent
    );
    background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 1)),
      url('../images/CsghubBackgroundPattern.png');
    background-repeat: repeat;
    background-size: auto;
    background-position: top;
  }
</style>
