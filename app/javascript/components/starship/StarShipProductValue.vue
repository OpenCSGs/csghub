<template>
  <div class="bg-[#F9FAFB]">
    <div class="max-w-[1280px] m-auto py-24 px-8">
      <div class="text-[36px] leading-[44px] mb-5">
        {{ $t('starShip.value.title') }}
      </div>
      <div class="text-[20px] text-[#475467] leading-[30px] font-light mb-16">
        {{ $t('starShip.value.desc') }}
      </div>
      <div class="grid grid-cols-3 gap-[32px] md:grid-cols-1">
        <div
          class="flex flex-col items-start gap-[20px] md:mb-[0px] mb-16"
          v-for="item in data"
          :key="item.id"
        >
          <div
            class="px-[12px] py-[12px] rounded-[40px] bg-[#ACBDFF] border-[8px] border-[#CED8FF]"
          >
            <SvgIcon :name="item.icon" />
          </div>
          <div class="flex flex-col gap-[8px]">
            <div class="text-[20px] text-[#101828] leading-[30px]">
              {{ $t('starShip.value.' + item.title) }}
            </div>
            <div class="text-[16px] text-[#475467] leading-[24px] font-light">
              {{ $t('starShip.value.' + item.desc) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  const data = ref([
    {
      id: 1,
      icon: 'star_ship_users',
      title: 'vTitle',
      desc: 'vDesc'
    },
    {
      id: 2,
      icon: 'star_ship_tool',
      title: 'v2Title',
      desc: 'v2Desc'
    },
    {
      id: 3,
      icon: 'star_ship_code_square',
      title: 'v3Title',
      desc: 'v3Desc'
    },
    {
      id: 4,
      icon: 'star_ship_infinity',
      title: 'v4Title',
      desc: 'v4Desc'
    },
    {
      id: 5,
      icon: 'star_ship_target',
      title: 'v5Title',
      desc: 'v5Desc'
    }
  ])
</script>
