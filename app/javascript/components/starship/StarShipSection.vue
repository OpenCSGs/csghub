<template>
  <div class="max-w-[1280px] m-auto pt-24 md:pt-16 text-center">
    <div class="px-8">
      <div class="text-[16px] leading-[24px] text-[#223B99] mb-3">
        {{ $t('starShip.use') }}
      </div>
      <div class="text-[36px] leading-[44px] mb-6">
        {{ $t('starShip.section.title') }}
      </div>
      <div class="text-[20px] text-[#475467] max-w-[768px] m-auto leading-[30px] font-light mb-24">
        {{ $t('starShip.section.desc') }}
      </div>
    </div>
    <div
      class="flex mb-[100px] items-center relative lg:flex-col gap-16 px-8 md:px-0 lg:gap-1"
      v-for="(item, index) in sectionData"
      :key="item.id"
      :class="index % 2 == '1' ? 'flex-row-reverse' : ''"
    >
      <div class="flex flex-col w-1/2 lg:w-full items-start text-left md:mb-[0px] mb-16 md:px-8">
        <div
          class="px-[8px] py-[8px] rounded-[40px] bg-[#ACBDFF] mb-6 border-[8px] border-[#CED8FF]"
        >
          <SvgIcon :name="item.icon" />
        </div>
        <div class="flex flex-col">
          <div class="text-[30px] text-[#101828] leading-[38px] mb-4">
            {{ $t('starShip.section.' + item.title) }}
          </div>
          <div class="text-[18px] text-[#475467] leading-[28px] font-light mb-8">
            {{ $t('starShip.section.' + item.desc) }}
          </div>
        </div>
        <div class="flex flex-col gap-5 text-[#475467] text-[18px] leading-[28px] font-light">
          <div
            class="flex gap-3 items-start"
            v-for="(detail, index) in item.details"
            :key="index"
          >
            <SvgIcon name="check_circle" />
            {{ $t('starShip.section.' + detail) }}
          </div>
        </div>
      </div>
      <div class="m-auto w-1/2 lg:w-full bg-[#F2F4F7] p-10 md:px-4 md:py-6 md:mx-2">
        <img
          class="w-full relative z-10"
          :src="item.img"
        />
        <img
          src="images/star_ship/line_pattern.png"
          class="lg:hidden w-[300px] absolute"
          :class="index % 2 == '1' ? '-left-[96px] -bottom-[96px]' : '-right-[96px] -bottom-[96px]'"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  const sectionData = ref([
    {
      id: 1,
      icon: 'star_ship_code_snippet',
      img: 'images/star_ship/start_ship_section1.png',
      title: 'secTitle',
      desc: 'secDesc',
      details: ['secDetails', 'secDetails2', 'secDetails3']
    },
    {
      id: 2,
      icon: 'check',
      img: 'images/star_ship/start_ship_section2.png',
      title: 'sec2Title',
      desc: 'sec2Desc',
      details: ['sec2Details', 'sec2Details2', 'sec2Details3', 'sec2Details4']
    },
    {
      id: 3,
      icon: 'message_chat_circle',
      img: 'images/star_ship/start_ship_section3.png',
      title: 'sec3Title',
      desc: 'sec3Desc',
      details: ['sec3Details', 'sec3Details2']
    },
    {
      id: 4,
      icon: 'star_ship_users',
      img: 'images/star_ship/start_ship_section4.png',
      title: 'sec4Title',
      desc: 'sec4Desc',
      details: []
    },
    {
      id: 5,
      icon: 'start_ship_line_chart_up',
      img: 'images/star_ship/start_ship_banner.png',
      title: 'sec5Title',
      desc: 'sec5Desc',
      details: ['sec5Details', 'sec5Details2', 'sec5Details3', 'sec5Details4']
    }
  ])
</script>
