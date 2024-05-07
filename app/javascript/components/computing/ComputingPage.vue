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

  const props = defineProps({
    starcloudUrl: String,
    partners: Array
  })
</script>
