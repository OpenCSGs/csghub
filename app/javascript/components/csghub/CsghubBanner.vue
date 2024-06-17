<template>
  <div class="py-[96px] md:py-[64px] text-center w-full banner bg-white md:bg-[#F9FAFB]">
    <div class="flex flex-col items-center max-w-[1280px] m-auto">
      <div
        class="mb-[24px] max-w-[1216px] m-auto text-[72px] md:text-[48px] md:leading-[60px] text-[#101828] leading-[90px]">
        {{ $t('csghub.banner.headline1') }}<br />{{ $t('csghub.banner.headline2') }}
      </div>
      <div class="text-[20px] font-light text-[#475467] leading-[30px] mb-[48px]">
        {{ $t('csghub.banner.solution1') }}<br />{{ $t('csghub.banner.solution2') }}
      </div>
      <a href="#" target="_blank"
        class="cursor-pointer mb-[48px] inline-block py-[16px] px-[22px] text-[18px] leading-[28px] text-[#FFF] bg-[#3250BD] border border-[#3250BD] rounded-[8px]">
        {{ $t("csghub.banner.join") }}
      </a>
      <div class="w-[768px] mlg:w-full mt-[16px] rounded-[10px] px-[32px]">
        <el-image src="/images/csghub/demo.png" :preview-src-list="['/images/csghub/demo.png']" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.banner {
  background-image: url('../images/CsghubBackgroundPattern.png');
  background-repeat: no-repeat;
  background-size: 100%;
  background-position: top
}
</style>
