<template>
  <div class="flex flex-col gap-[16px]">
    <div class="flex gap-[8px] text-sm leading-[22px] font-medium">
      <SvgIcon height="24px" weight="24px" name="discussions" />
      {{ $t('community.newDiscussion.new') }}
    </div>
    <div>
      <FormLabel
        :labelName="$t('community.newDiscussion.title')"
        :required="true" />
      <el-input
        type="text"
        v-model="title"
        maxlength="200"
        show-word-limit
        clearable
        :placeholder="$t('community.newDiscussion.create')"
        class="w-full h-[40px] text-gray-500">
      </el-input>
    </div>
    <FormLabel
      :labelName="$t('community.newDiscussion.content')"
      :required="true" />
    <CommunityMDTextarea
      :desc="desc"
      @inputChange="handleInputChange"></CommunityMDTextarea>
    <div class="flex gap-[8px]">
      <button
        class="btn btn-primary btn-sm"
        @click="create"
        >{{ $t('community.newDiscussion.create') }}</button>
      <button
        class="btn btn-secondary-gray btn-sm"
        @click="cancel">{{
        $t('community.newDiscussion.cancel')
      }}</button>
    </div>
  </div>
</template>

<script>
  import FormLabel from '../form/sub/FormLabel.vue'
  import MarkdownIt from 'markdown-it'
  import CommunityMDTextarea from './CommunityMDTextarea.vue'
  import { ElMessage } from 'element-plus'
  import useFetchApi from '../../packs/useFetchApi'

  export default {
    props: {
      repoType: String,
      repoPath: String
    },
    components: {
      FormLabel,
      CommunityMDTextarea
    },
    data() {
      return {
        title: '',
        desc: '',
        activeTab: 'Edit'
      }
    },
    mounted() {},
    methods: {
      handleInputChange(value) {
        this.desc = value
      },
      renderMarkdown(text) {
        const mdParser = new MarkdownIt()
        return mdParser.render(text)
      },
      create() {
        if (this.title.trim() === '' || this.desc.trim() === '') {
          ElMessage({
            message: this.$t('community.newDiscussion.warn'),
            type: 'warning'
          })
          return
        }
        this.createDiscussion()
      },
      cancel() {
        this.$emit('changeFlag', 'show')
      },
      async createDiscussion() {
        const discussionCreateEndpoint = `/${this.repoType}s/${this.repoPath}/discussions`
        const discussionJsonData = {
          title: this.title
        }
        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(discussionJsonData)
        }
        const { data, error } = await useFetchApi(discussionCreateEndpoint, options).json()
        if (data.value) {
          this.createComment(data.value.data.id)
          ElMessage.success(this.$t('community.newDiscussion.success'))
        } else {
          ElMessage.warning(error.value.msg)
        }
      },
      async createComment(discussionId) {
        const commentCreateEndpoint = `/discussions/${discussionId}/comments`
        const commentJsonData = {
          commentable_type: 'Discussion',
          commentable_id: discussionId,
          content: this.desc
        }
        const commentOptions = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(commentJsonData)
        }
        const {data, error} = await useFetchApi(commentCreateEndpoint, commentOptions).json()
        if (data.value) {
          this.$emit('changeFlag', 'show')
          this.$emit('getDiscussion')
        } else {
          ElMessage.warning(error.value.msg)
        }
      }
    }
  }
</script>
