<template>
  <div class="menuItem min-h-max flex gap-[16px] py-[10px]">
    <div class="pt-[6px]">
      <SvgIcon name="news" />
    </div>
    <div class="max-w-[247px] flex flex-col whitespace-normal">
      <div class="text-[#101828]">{{ $t('navbar.news') }}</div>
      <div
        class="text-[14px] text-[#475467] font-light leading-[20px] md:hidden"
      >
        {{ $t('navbar.newsText') }}
      </div>
    </div>
  </div>
</template>
<style scoped>
</style>
<script>
  import SvgIcon from '../../shared/SvgIcon.vue'
</script>
