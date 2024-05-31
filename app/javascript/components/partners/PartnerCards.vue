<template>
  <div class="max-w-[1280px] m-auto lg:overflow-hidden">
    <div
      class="flex items-center justify-between md:flex-col md:pt-16 md:items-start md:px-4"
    >
      <div class="pl-8 md:pl-0">
        <div
          class="text-[#101828] text-[60px] font-medium leading-[72px] max-w-[495px] lg:text-[36px] lg:leading-[44px]"
        >
          {{ $t('partner.title') }}
        </div>
        <div
          class="max-w-[480px] self-stretch text-[#475467] text-[20px] font-light leading-[30px] mt-8 lg:text-[18px] lg:leading-[28px]"
        >
          {{ $t('partner.desc') }}
        </div>
        <div
          @click="toActionPage"
          class="cursor-pointer inline-block px-[22px] py-4 mt-12 text-center text-[#FFF] text-[18px] font-medium rounded-[8px] bg-[#3250BD] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] md:w-full md:px-[18px] md:py-[12px] md:mt-8"
        >
          {{ $t('partner.action') }}
        </div>
      </div>
      <img
        src="/images/partners/PartnerCards.png"
        alt="Partners"
        class="w-[760px] h-auto mr-[-120px] lg:w-[560px] md:hidden"
      />
      <img
        src="/images/partners/PartnerCards-mobile.png"
        alt="Partners"
        class="w-full h-auto hidden md:block mt-16"
      />
    </div>
    <div
      class="mt-12 mb-20 px-8 flex items-start flex-wrap gap-x-8 gap-y-12 md:flex-col"
    >
      <a
        :href="partner.site"
        target="_blank"
        v-for="partner in partners"
        :key="partner.name"
        class="w-[384px] lg:w-[256px] md:w-full"
      >
        <div
          class="flex w-full h-[240px] lg:h-[160px] md:h-[240px] justify-center items-center rounded-[16px] bg-[#F2F4F7]"
        >
          <img
            :src="`/images/${partner.logo}`"
            :alt="partner.name"
            class="w-auto"
            :style="`height: ${partner.height}px`"
          />
        </div>
        <div class="mt-5 text-[#223B99] text-[14px] font-500 leading-[20px]">
          {{ partner.tags.split(',').join(' | ') }}
        </div>
        <div class="mt-5">
          <div class="flex items-center justify-between w-full">
            <div class="text-[#101828] text-[24px] font-500 leading-[32px]">
              {{ partner.name }}
            </div>
            <el-icon><TopRight /></el-icon>
          </div>
        </div>
        <div
          class="mt-2 w-full overflow-hidden text-[#475467] text-ellipsis line-clamp-2 text-base font-300 leading-[24px]"
        >
          {{ partner.desc }}
        </div>
      </a>
    </div>
  </div>
</template>
<script>
  import trackPageEvent from '../../packs/trackPageEvent'

  export default {
    props: {
      partners: Array
    },
    methods: {
      toActionPage() {
        trackPageEvent({ id: 'connect_partner', m: 'Connect' })
        window.location.href = '/partners/apply'
      }
    }
  }
</script>
