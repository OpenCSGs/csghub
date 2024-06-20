<template>
  <div class="w-full overflow-hidden">
    <CsghubBanner />
    <CsghubIntroduce />
    <CsghubPrice />
    <CsghubServe />
  </div>
</template>

<script setup>
  import CsghubBanner from "./CsghubBanner.vue";
  import CsghubIntroduce from "./CsghubIntroduce.vue";
  import CsghubPrice from "./CsghubPrice.vue";
  import CsghubServe from "./CsghubServe.vue";
  import useWxShare from '../hooks/useWxShare'
  import { onMounted } from "vue"

  onMounted(() => {
    useWxShare({
      title: 'CSGHub 介绍',
      desc: '开源开放的针对大模型原生设计的资产管理平台',
      link: window.location.href
    })
  })
</script>
