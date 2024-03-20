<template>
  <div>
    <EkbBanner />
    <EkbAsk />
    <EkbMore />
    <EkbAdvantages />
  </div>
</template>

<script>
import EkbBanner from "./EkbBanner.vue";
import EkbAsk from "./EkbAsk.vue";
import EkbMore from "./EkbMore.vue";
import EkbAdvantages from "./EkbAdvantages.vue";

export default {
  props: {},

  data() {
    return {};
  },

  components: {
    EkbBanner,
    EkbAsk,
    EkbMore,
    EkbAdvantages
  },

  mounted() {},
  methods: {},
};
</script>
