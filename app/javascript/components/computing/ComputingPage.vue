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
      title: 'OpenCSG 打造中国本土化 Huggingface plus',
      desc: '让大模型赋能每一个人,大模型驱动全民，推动技术创新，OpenCSG——平台有各个领域的大模型，提供模型探索体验、推理、训练、部署和应用的一站式服务，共建模型开源社区，发现、学习、定制和分享心仪的模型。',
      link: window.location.href
    })
  })
</script>
