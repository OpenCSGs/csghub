<template>
  <div class="flex flex-col gap-[16px]">
    <div class="flex gap-[8px] text-[14px] leading-[22px] font-medium">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path opacity="0.12" d="M9 13.2C9 12.0799 9 11.5198 9.21799 11.092C9.40973 10.7157 9.71569 10.4097 10.092 10.218C10.5198 10 11.0799 10 12.2 10H18.8C19.9201 10 20.4802 10 20.908 10.218C21.2843 10.4097 21.5903 10.7157 21.782 11.092C22 11.5198 22 12.0799 22 13.2V20.3636C22 21.357 20.8103 21.8669 20.0909 21.1818C19.3906 20.5149 18.4606 20.1429 17.4935 20.1429H12.2C11.0799 20.1429 10.5198 20.1429 10.092 19.9249C9.71569 19.7331 9.40973 19.4272 9.21799 19.0508C9 18.623 9 18.063 9 16.9429V13.2Z" fill="#4D6AD6"/><path d="M9 14H7.25C7.00285 14 6.87928 14 6.75895 14.0097C6.27553 14.0487 5.80877 14.2043 5.39866 14.4631C5.29658 14.5276 5.19772 14.6017 5 14.75V14.75C4.48857 15.1336 4.23286 15.3254 4.03782 15.4003C3.21483 15.7164 2.29801 15.258 2.05709 14.4099C2 14.2089 2 13.8893 2 13.25V6.8C2 5.11984 2 4.27976 2.32698 3.63803C2.6146 3.07354 3.07354 2.6146 3.63803 2.32698C4.27976 2 5.11984 2 6.8 2H13.2C14.8802 2 15.7202 2 16.362 2.32698C16.9265 2.6146 17.3854 3.07354 17.673 3.63803C18 4.27976 18 5.11984 18 6.8V7V7.5M20.0909 21.1818V21.1818C20.8103 21.8669 22 21.357 22 20.3636V13.2C22 12.0799 22 11.5198 21.782 11.092C21.5903 10.7157 21.2843 10.4097 20.908 10.218C20.4802 10 19.9201 10 18.8 10H12.2C11.0799 10 10.5198 10 10.092 10.218C9.71569 10.4097 9.40973 10.7157 9.21799 11.092C9 11.5198 9 12.0799 9 13.2V16.9429C9 18.063 9 18.623 9.21799 19.0508C9.40973 19.4272 9.71569 19.7331 10.092 19.9249C10.5198 20.1429 11.0799 20.1429 12.2 20.1429H17.4935C18.4606 20.1429 19.3906 20.5149 20.0909 21.1818Z" stroke="#4D6AD6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
      {{ $t('community.newDiscussion.new') }}
    </div>
    <div>
      <FormLabel :labelName="this.$t('community.newDiscussion.title')" :required="true" />
      <el-input v-model="title"
                  :maxLength="200"
                  show-word-limit
                  clearable
                  :placeholder="this.$t('community.newDiscussion.create')"
                  class="w-full h-[40px] text-[#606266]">
                  <template #suffix>
        <span>{{ title.length }} / 200</span>
      </template>
    </el-input>
    </div>
    <FormLabel :labelName="this.$t('community.newDiscussion.content')" :required="true" />
    <CommunityMDTextarea :desc="desc"  @inputChange="handleInputChange"></CommunityMDTextarea>
    <div>
      <el-button type="primary" @click="create">{{ $t('community.newDiscussion.create') }}</el-button>
      <el-button @click="cancel">{{ $t('community.newDiscussion.cancel') }}</el-button>
    </div>
  </div>
</template>
<script>
import FormLabel from "../form/sub/FormLabel.vue"
import MarkdownIt from 'markdown-it';
import CommunityMDTextarea from './CommunityMDTextarea.vue'
import csrfFetch from "../../packs/csrfFetch";
import { ElMessage } from 'element-plus'
export default {
  props: {
    localRepoId: String,
    type:String
  },
  components: {
    FormLabel,
    CommunityMDTextarea
  },
  data() {
    return {
      title:'',
      desc:'',
      activeTab:'Edit'
    };
  },
  mounted() {},
  methods: {
    handleInputChange(value) {
      this.desc = value;
    },
    renderMarkdown(text) {
      const mdParser = new MarkdownIt();
      return mdParser.render(text);
    },
    create() {
      if (this.title.trim() === '' || this.desc.trim() === '') {
        ElMessage({ message: this.$t('community.newDiscussion.warn'), type: "warning" });
        return;
      }
      this.createDiscussion().then(discussion => {
        ElMessage({ message: this.$t('community.newDiscussion.success'), type: "success" });
        this.createComment(discussion.id).catch(err => {
          ElMessage({ message: (this.$t('community.newDiscussion.comment') + err.message), type: 'warning' });
          return
        })
        this.$emit("changeFlag", 'show');
        this.$emit("getDiscussion");
        // 此处应重新获取最新的 discussions
      })
      .catch(err => {
        ElMessage({ message: err.message, type: 'warning' });
      })
    },
    cancel(){
      this.$emit("changeFlag",'show');
    },
    async createDiscussion(){
      const discussionCreateEndpoint = "/internal_api/discussions"
      const discussionJsonData = {
        discussionable_type: this.type,
        discussionable_id: this.localRepoId,
        title: this.title
      }
      const option = {
        method:'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(discussionJsonData)
      }
      const response = await csrfFetch(discussionCreateEndpoint, option)
      if (response.ok) {
        return response.json();
      } else {
        return response.json().then(data => { throw new Error(data.message) })
      }
    },
    async createComment(discussionId){
      const commentCreateEndpoint = "/internal_api/comments"
      const newComment = {
        content: this.desc,
      };
      const commentJsonData = {
        commentable_type:'Discussion',
        commentable_id:discussionId,
        comment:newComment
      }
      const commentOption = {
        method:'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commentJsonData)
      }
      const response = await csrfFetch(commentCreateEndpoint, commentOption);
      if (response.ok) {
        return response.json();
      } else {
        return response.json().then(data => { throw new Error(data.message) })
      }
    }
  },
};
</script>
