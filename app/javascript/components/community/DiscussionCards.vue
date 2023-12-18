<template>
  <div class="flex flex-col gap-[16px]">
    <DiscussionCard v-for="card in cards"  @click="updateDetails(card)"
      :key="card.id"
      :commentId="card.id"
      :num="card.num"
      :title="card.title"
      :time="card.created_at"
      :user="card.user"
      :commentNum="card.commentNum"
      @changeFlag="changeFlag"></DiscussionCard>
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
    return {
      type:'Discussion',
      commentData:[]
    };
  },
  mounted() {},
  methods: {
    updateDetails(card){
      console.log(card);
      this.$emit("updateDetails",card)
      this.getComment(card.id)
    },
    changeFlag(flag) {
      this.$emit("changeFlag",flag);
    },
    
    async getComment(commentId){
      const commentCreateEndpoint = `/internal_api/comments?commentable_type=${this.type}&commentable_id=${commentId}`
      const response = await fetch(commentCreateEndpoint);
      response.json().then((data) => {
        console.log(data);
        this.commentData=data
      })
    }
  },
};
</script>
