<template>
  <div>
    <ProductBanner />
    <ProductStarCloud />
  </div>
</template>

<script>
import ProductBanner from "./ProductBanner.vue";
import ProductStarCloud from "./ProductStarCloud.vue";

export default {
  props: {},

  data() {
    return {};
  },

  components: {
    ProductBanner,
    ProductStarCloud
  },

  mounted() {},
};
</script>
