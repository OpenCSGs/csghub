<template>
  <div>
    <ComputingBanner />
    <ComputingPartner :partners="partners" />
    <ComputingPrice :starcloud-url="starcloudUrl" />
    <ComputingProblem />
  </div>
</template>

<script setup>
  import ComputingBanner from "./ComputingBanner.vue"
  import ComputingPrice from "./ComputingPrice.vue"
  import ComputingProblem from "./ComputingProblem.vue"
  import ComputingPartner from "./ComputingPartner.vue"
  import useWxShare from '../hooks/useWxShare'
  import { onMounted } from "vue"

  const props = defineProps({
    starcloudUrl: String,
    partners: Array
  })

  onMounted(() => {
    useWxShare({
      title: 'OpenCSG 算力服务',
      desc: '近百家可信智算合作伙伴，OpenCSG为您提供高性价比的算力服务',
      link: window.location.href
    })
  })
</script>
