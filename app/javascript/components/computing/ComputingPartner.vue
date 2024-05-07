<template>
  <div class="max-w-[1280px] m-auto py-[96px]">
    <div class="mb-[32px]">
      <h3 class="text-center text-[#101828] text-[36px] font-[500] leading-[44px] mb-[8px]">近百家可信智算合作伙伴</h3>
      <p class="text-center text-[#667085] text-[16px] font-[300] leading-[24px]">*仅展示部分合作伙伴</p>
    </div>

    <div class="grid grid-cols-4 xl:grid-cols-3 mlg:grid-cols-1 gap-[20px]">
      <div v-for="partner in partners"
           class="computing-partner-card flex flex-col gap-[8px] items-center justify-center hover:bg-[#F9FAFB] px-[36px] py-[24px]"
      >
        <img :src="`/images/${partner.logo}`"
             :alt="partner.name"
             class="w-auto h-[44px]" />
        <p class="computing-partner-level text-[#344054] text-[16px] leading-[24px] opacity-0">{{ partner.level }}</p>
      </div>
    </div>

    <div class="grid grid-cols-3 xl:grid-cols-2 mlg:grid-cols-1 gap-[20px] mt-[60px] p-[24px] bg-[#F9FAFB] rounded-[16px]">
      <div class="flex flex-col items-center justify-center gap-[20px] px-[36px] py-[24px]">
        <img src="/images/computing/partners/strategy.png" alt="strategy" width="100" height="100" />
        <p>战略可信智算合作伙伴</p>
      </div>
      <div class="flex flex-col items-center justify-center gap-[20px] px-[36px] py-[24px]">
        <img src="/images/computing/partners/gold.png" alt="strategy" width="100" height="100" />
        <p>金牌可信智算合作伙伴</p>
      </div>
      <div class="flex flex-col items-center justify-center gap-[20px] px-[36px] py-[24px]">
        <img src="/images/computing/partners/silver.png" alt="strategy" width="100" height="100"/>
        <p>银牌可信智算合作伙伴</p>
      </div>
    </div>
  </div>
</template>

<script setup>
  const props = defineProps({
    partners: Array
  })
</script>

<style scoped>
  .computing-partner-card:hover .computing-partner-level {
    opacity: 100;
  }
</style>