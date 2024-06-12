<template>
  <div class="py-[96px] text-center w-full banner bg-white">
    <div class="max-w-[1280px] m-auto">
      <div class="mb-[12px] text-[16px] text-[#475467] leading-[24px]">
        Smart. Simple. Scalable.
      </div>
      <div class="mb-[24px] max-w-[1216px] m-auto text-[72px] md:text-[48px] md:leading-[60px] text-[#101828] leading-[90px]">
        {{ $t('product.banner.headline1') }}<br/>{{ $t('product.banner.headline2') }}
      </div>
      <div class="text-[20px] font-light text-[#475467] leading-[30px]">
        {{ $t('product.banner.solution') }}
      </div>
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
