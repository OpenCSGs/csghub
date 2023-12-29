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
    return {};
  },

  components: {
    ProductStarShip,
    ProductBanner,
    ProductStarCloud
  },

  mounted() {},
};
</script>
