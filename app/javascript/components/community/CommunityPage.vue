<template>
  <div class="py-[32px] md:px-[10px]">
    <DiscussionCards
      v-if="theFlag == 'show'"
      :cards="cards"
      @getDiscussion="getDiscussion"
      @updateDetails="updateDetails"
      @changeFlag="changeFlag"></DiscussionCards>
    <NewCommunityDiscussion
      v-if="theFlag == 'new'"
      :type="type"
      @getDiscussion="getDiscussion"
      @changeFlag="changeFlag"
      :localModelId="localModelId"></NewCommunityDiscussion>
  </div>
</template>

<script>
  import DiscussionCards from './DiscussionCards.vue'
  import NewCommunityDiscussion from './NewCommunityDiscussion.vue'
  export default {
    props: {
      localModelId: String,
      type: String
    },
    components: {
      DiscussionCards,
      NewCommunityDiscussion
    },
    data() {
      return {
        // cards:[],
        theFlag: 'show',
        cards: [],
        lastCommentId: ''
      }
    },
    mounted() {
      this.getDiscussion()
    },
    methods: {
      updateDetails(card) {
        this.lastCommentId = card.id
      },
      changeFlag(flag) {
        this.theFlag = flag
      },
      async getDiscussion() {
        const discussionCreateEndpoint = `/internal_api/discussions?discussionable_type=${this.type}&discussionable_id=${this.localModelId}`
        const response = await fetch(discussionCreateEndpoint)
        response.json().then((data) => {
          this.cards = data
        })
      }
    }
  }
</script>
