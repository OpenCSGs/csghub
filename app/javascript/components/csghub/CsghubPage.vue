<template>
  <div>
    <CsghubBanner />
    <CsghubIntroduce />
    <CsghubPrice />
    <CsghubServe />
  </div>
</template>

<script>
import CsghubBanner from "./CsghubBanner.vue";
import CsghubIntroduce from "./CsghubIntroduce.vue";
import CsghubPrice from "./CsghubPrice.vue";
import CsghubServe from "./CsghubServe.vue";

export default {
  props: {},

  data() {
    const classParam = new URLSearchParams(window.location.search).get('class');
    return {
      scrollToClass: classParam ?  classParam : ''
    };
  },

  components: {
    CsghubBanner,
    CsghubIntroduce,
    CsghubPrice,
    CsghubServe
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
