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
      :repoType="repoType"
      :repoPath="repoPath"
      @getDiscussion="getDiscussion"
      @changeFlag="changeFlag"></NewCommunityDiscussion>
  </div>
</template>

<script>
  import DiscussionCards from './DiscussionCards.vue'
  import NewCommunityDiscussion from './NewCommunityDiscussion.vue'
  import useFetchApi from '../../packs/useFetchApi'
  import { ElMessage } from 'element-plus'

  export default {
    props: {
      repoType: String,
      repoPath: String
    },
    components: {
      DiscussionCards,
      NewCommunityDiscussion
    },
    data() {
      return {
        theFlag: 'show',
        cards: [],
        lastCommentId: ''
      }
    },
    watch: {
      repoPath(newPath, _) {
        this.getDiscussion()
      }
    },
    methods: {
      updateDetails(card) {
        this.lastCommentId = card.id
      },
      changeFlag(flag) {
        this.theFlag = flag
      },
      async getDiscussion() {
        let discussionCreateEndpoint = `/${this.repoType}s/${this.repoPath}/discussions`
        if (this.repoType === 'mcp') {
          discussionCreateEndpoint = `/mcpserver/${this.repoPath}/discussions`
        }
        const { data, error } = await useFetchApi(discussionCreateEndpoint).json()
        if (data.value) {
          const discussions = data.value.data.discussions || []
          this.cards = discussions.sort((a, b) => b.id - a.id)
        } else {
          ElMessage({
            message: error.value.msg,
            type: 'warning'
          })
        }
      }
    },
    mounted() {
      this.getDiscussion()
    }
  }
</script>
