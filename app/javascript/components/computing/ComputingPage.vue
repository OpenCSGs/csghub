<template>
  <div>
    <ComputingBanner />
    <ComputingPrice />
    <ComputingProblem />
  </div>
</template>

<script>
import ComputingBanner from "./ComputingBanner.vue"
import ComputingPrice from "./ComputingPrice.vue"
import ComputingProblem from "./ComputingProblem.vue"
export default {
  components: {
    ComputingBanner,
    ComputingPrice,
    ComputingProblem
  },
}
</script>
