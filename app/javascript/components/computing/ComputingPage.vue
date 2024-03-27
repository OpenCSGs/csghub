<template>
  <div>
    <ComputingBanner />
    <ComputingPrice :starcloud-url="starcloudUrl" />
    <ComputingProblem />
  </div>
</template>
<script>
import ComputingBanner from "./ComputingBanner.vue"
import ComputingPrice from "./ComputingPrice.vue"
import ComputingProblem from "./ComputingProblem.vue"
export default {
  props: {
    starcloudUrl: String
  },
  components: {
    ComputingBanner,
    ComputingPrice,
    ComputingProblem
  },
}
</script>
