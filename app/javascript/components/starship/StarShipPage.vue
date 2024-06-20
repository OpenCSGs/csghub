<template>
  <div class="w-full overflow-hidden">
    <StarShipBanner />
    <StarShipSection />
    <StarShipProductValue />
  </div>
</template>

<script setup>
  import StarShipBanner from './StarShipBanner.vue'
  import StarShipSection from './StarShipSection.vue'
  import StarShipProductValue from './StarShipProductValue.vue'
  import useWxShare from '../hooks/useWxShare'
  import { onMounted } from "vue"

  onMounted(() => {
    useWxShare({
      title: 'StarShip 介绍',
      desc: '基于大模型的企业智能数字员工平台',
      link: window.location.href
    })
  })
</script>
