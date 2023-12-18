<template>
  <div class="flex flex-col gap-[16px]">
    <EmptyCommunity v-if="cards.length <= 0" @changeFlag="changeFlag" />
    <template v-else>
      <DiscussionDetails v-if="showDetail" 
        :discussionId="currentDiscussion"
        :title="currentTitle"
        :userName="currentUserName"
        :time="currentTime"
        @toggleDetails="toggleDetails" />
      <DiscussionCard v-else v-for="card in cards"  @click="showDetails(card)"
        :key="card.id"
        :discussionId="card.id"
        :num="card.num"
        :title="card.title"
        :time="card.time"
        :user="card.user.name"
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
      this.currentDiscussion = card.id
      this.currentTitle = card.title
      this.currentUserName = card.user.name
      this.currentTime = card.time
      this.showDetail = true
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
