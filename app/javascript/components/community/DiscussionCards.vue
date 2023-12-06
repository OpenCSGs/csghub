<template>
  <div class="flex flex-col gap-[16px]">
    <DiscussionCard v-for="card in cards"
      :key="card.id"
      :num="card.num"
      :title="card.title"
      :time="card.time"
      :user="card.user"
      :commentNum="card.commentNum"
      ></DiscussionCard>
  </div>
</template>
<script>
import DiscussionCard from "./DiscussionCard.vue";
export default {
  props: {
    cards:Array
  },
  components: {
    DiscussionCard
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {},
};
</script>
