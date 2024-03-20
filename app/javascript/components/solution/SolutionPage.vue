<template>
  <div>
    <SolutionBanner />
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
    const classParam = new URLSearchParams(window.location.search).get('class');
    return {
      scrollToClass: classParam ?  classParam : ''
    };
  },

  components: {
    SolutionBanner,
    SolutionKnowledgeBase,
    SolutionStarAIO,
    SolutionAIImg,
    SolutionProgramming
  },

  mounted() {
    this.scrollToContent()
  },
  methods: {
    scrollToContent() {
      const element = document.getElementsByClassName(this.scrollToClass);
      if (element.length > 0) {
        element[0].scrollIntoView({ behavior: "smooth" });
      }
    }
  },
};
</script>
