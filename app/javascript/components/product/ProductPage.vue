<template>
  <div>
    <ProductBanner />
    <ProductStarCloud />
    <ProductStarShip />
  </div>
</template>

<script>
import ProductBanner from "./ProductBanner.vue";
import ProductStarCloud from "./ProductStarCloud.vue";
import ProductStarShip from "./ProductStarShip.vue";

export default {
  props: {},

  data() {
    const classParam = new URLSearchParams(window.location.search).get('class');
    return {
      scrollToClass: classParam ?  classParam : ''
    };
  },

  components: {
    ProductStarShip,
    ProductBanner,
    ProductStarCloud
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
