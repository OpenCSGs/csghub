<template>
  <div class="flex flex-col gap-[16px]">
    <EmptyCommunity v-if="cards.length <= 0" @changeFlag="changeFlag" />
    <template v-else>
      <DiscussionDetails v-if="showDetail" :discussionId="currentDiscussion" @toggleDetails="toggleDetails" />
      <DiscussionCard v-else v-for="card in cards"  @click="showDetails(card)"
        :key="card.id"
        :discussionId="card.id"
        :num="card.num"
        :title="card.title"
        :time="card.created_at"
        :user="card.user"
        :commentNum="card.commentNum"/>
    </template>
  </div>
</template>
<script>
import EmptyCommunity from "./EmptyCommunity.vue";
import DiscussionCard from "./DiscussionCard.vue";
import DiscussionDetails from "./DiscussionDetails.vue";
export default {
  props: {
    cards: Array
  },
  components: {
    DiscussionCard,
    DiscussionDetails,
    EmptyCommunity
  },
  data() {
    return {
      showDetail: false,
      currentDiscussion: ''
    };
  },
  mounted() {
  },
  methods: {
    showDetails(card) {
      this.showDetail = true
      this.currentDiscussion = card.id
    },
    toggleDetails() {
      this.showDetail = false
    },
    changeFlag(flag){
      this.$emit('changeFlag',flag)
    }
  }
};
</script>
