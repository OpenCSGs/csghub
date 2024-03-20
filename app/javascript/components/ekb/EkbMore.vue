<template>
  <div class="w-full bg-white">
    <div class="max-w-[1280px] m-auto py-[96px] px-[20px]">
      <div class="text-[#223B99] text-[16px] leading-[24px] mb-[10px]">
        {{ $t("ekb.moreP") }}
      </div>
      <div class="text-[36px] leading-[44px] text-[#101828] mb-[20px]">
        {{ $t("ekb.morePTitle") }}
      </div>
      <div
        class="max-w-[768px] text-[20px] text-[#475467] leading-[30px] font-light mb-[64px]"
      >
      {{ $t("ekb.morePText") }}
      </div>
      <div class="flex mlg:flex-col gap-[64px] items-center text-left">
        <div class="grow">
          <div
            class="max-w-[560px] cursor-pointer py-[16px] pl-[24px] border-l-[4px] border-l-[#F2F4F7] hover:border-l-[#3250BD]"
            v-for="item in data"
            :key="item.id"
          >
            <div class="text-[#101828] text-[20px] leading-[30px]">
              {{ item.title }}
            </div>
            <div class="text-[#101828] text-[16px] leading-[24px] font-light">
              {{ item.desc }}
            </div>
          </div>
        </div>
        <div class="grow flex items-center">
          <div class="w-[592px] md:w-full">
            <img class="w-full" src="/images/ekb/Mockupwrap.png" />
          </div>
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
          title: this.$t('ekb.moreDataTitle'),
          desc: this.$t('ekb.moreDataDesc')
        },
        {
          id: "2",
          title: this.$t('ekb.moreDataTitle2'),
          desc: this.$t('ekb.moreDataDesc2')
        },
        {
          id: "3",
          title: this.$t('ekb.moreDataTitle3'),
          desc: this.$t('ekb.moreDataDesc3')
        },
        {
          id: "4",
          title: this.$t('ekb.moreDataTitle4'),
          desc: this.$t('ekb.moreDataDesc4')
        },
      ],
    };
  }
};
</script>
