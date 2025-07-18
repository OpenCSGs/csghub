<template>
  <div class="py-[32px] md:px-[10px]">
    <template v-if="!loading">
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
    </template>
    <el-skeleton v-else class="mt-4" :rows="5" animated />
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
        lastCommentId: '',
        loading: true
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
        if (this.repoPath === '') return

        let discussionCreateEndpoint = `/${this.repoType}s/${this.repoPath}/discussions`
        if (this.repoType === 'mcp') {
          discussionCreateEndpoint = `/mcpserver/${this.repoPath}/discussions`
        }

        const { data, error } = await useFetchApi(discussionCreateEndpoint).json()
        if (data.value) {
          const discussions = data.value.data.discussions || []
          this.cards = discussions.sort((a, b) => b.id - a.id)
          this.loading = false
        } else {
          ElMessage({
            message: error.value.msg,
            type: 'warning'
          })
          this.loading = false
        }
      }
    },
    mounted() {
      this.getDiscussion()
    }
  }
</script>
