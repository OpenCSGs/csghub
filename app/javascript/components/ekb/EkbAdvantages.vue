<template>
  <div class="w-full bg-white">
    <div class="max-w-[1280px] m-auto py-[96px] px-[20px]">
      <div class="text-[#223B99] text-[16px] leading-[24px] mb-[10px]">
        {{ $t("ekb.adv") }}
      </div>
      <div class="text-[36px] leading-[44px] text-[#101828] mb-[20px]">
        {{ $t("ekb.advTitle") }}
      </div>
      <div
        class="max-w-[768px] text-[20px] text-[#475467] leading-[30px] font-light mb-[64px]"
      >
      {{ $t("ekb.advText") }}
      </div>
      <div class="flex gap-[24px] mlg:flex-col">
        <div
          class="flex flex-col gap-[20px] justify-between px-[24px] rounded-[8px] flex-1 py-[24px] bg-[#F9FAFB]"
          v-for="item in data"
          :key="item.id"
        >
          <div class="flex flex-col gap-[8px]">
            <div
              class="h-[48x] w-[48px] bg-[#3250BD] px-[12px] py-[12px] rounded-[10px] mb-[64px] md:mb-[20px]"
            >
              <img :src="item.icon" />
            </div>
            <div class="text-[#101828] text-[20px] leading-[30px]">
              {{ item.title }}
            </div>
            <div class="text-[#101828] text-[16px] leading-[24px] font-light">
              {{ item.desc }}
            </div>
          </div>
          <a  href="https://ekb.opencsg.com/" target="_blank" class="text-[#223B99] text-[16px] leading-[24px] cursor-pointer">{{ $t('solution.knowledge.demo')}}</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: [
        {
          id: "1",
          icon: "/images/ekb/icon/book-open.svg",
          title: this.$t('ekb.advDataTitle'),
          desc: this.$t('ekb.advDataDesc')
        },
        {
          id: "2",
          icon: "/images/ekb/icon/message-smile-square.svg",
          title: this.$t('ekb.advDataTitle2'),
          desc: this.$t('ekb.advDataDesc2')
        },
        {
          id: "3",
          icon: "/images/ekb/icon/package.svg",
          title: this.$t('ekb.advDataTitle3'),
          desc: this.$t('ekb.advDataDesc3')
        },
        {
          id: "4",
          icon: "/images/ekb/icon/chart-breakout-square.svg",
          title: this.$t('ekb.advDataTitle4'),
          desc: this.$t('ekb.advDataDesc4')
        },
      ],
    };
  }
};
</script>
