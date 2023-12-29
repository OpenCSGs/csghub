<template>
  <div>
    <SolutionBanner />
    <SolutionKnowledgeBase />
    <SolutionStarAIO />
    <SolutionAIImg />
    <SolutionProgramming />
  </div>
</template>

<script>
import SolutionBanner from "./SolutionBanner.vue";
import SolutionKnowledgeBase from "./SolutionKnowledgeBase.vue";
import SolutionStarAIO from "./SolutionStarAIO.vue";
import SolutionAIImg from "./SolutionAIImg.vue";
import SolutionProgramming from "./SolutionProgramming.vue";

export default {
  props: {},

  data() {
    return {};
  },

  components: {
    SolutionBanner,
    SolutionKnowledgeBase,
    SolutionStarAIO,
    SolutionAIImg,
    SolutionProgramming
  },

  mounted() {},
};
</script>
