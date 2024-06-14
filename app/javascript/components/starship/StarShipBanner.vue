<template>
  <div class="max-w-[1280px] m-auto pt-16 pb-24 md:pb-16 text-center px-8 star_ship_banner">
    <div class="text-[72px] leading-[90px] md:text-[36px] md:leading-[44px] mb-6">
      {{ $t('starShip.title') }}
    </div>
    <div
      class="text-[20px] text-[#475467] leading-[30px] md:text-[18px] md:leading-[28px] font-light mb-12 md:mb-8"
    >
      {{ $t('starShip.desc') }}
    </div>
    <div class="flex items-center justify-center mb-[73px]">
      <div
        class="cursor-pointer md:w-full py-4 px-[22px] text-[18px] leading-[28px] text-[#FFF] bg-[#3250BD] border border-[#3250BD] rounded-[8px]"
        @click="goApply"
      >
        {{ $t('product.starShip.trailApply') }}
      </div>
    </div>
    <div class="max-w-[800px] m-auto">
      <img
        class="w-full"
        src="images/star_ship/start_ship_banner.png"
      />
    </div>
  </div>
</template>

<script setup>
  const goApply = () => {
    window.open('https://opencsg.com/lead_forms/form/S3s2wpq1pjvT_Starship_Free_Trail', '_blank')
  }
</script>
<style scoped>
  .star_ship_banner {
    mask-image: linear-gradient(
      var(--mask-direction, to bottom),
      transparent,
      #000 5%,
      #000 95%,
      transparent
    );
    background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 1)),
      url('../images/dot_grid.png');
    background-repeat: repeat;
    background-size: auto;
    background-position: top;
  }
</style>
