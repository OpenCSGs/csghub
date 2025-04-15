<template>
  <div class="flex flex-col gap-[16px]">
    <div class="flex gap-[8px] items-center">
      <div class="px-[8px] py-[8px] bg-brand-25 rounded-md"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path opacity="0.12" d="M9 13.2C9 12.0799 9 11.5198 9.21799 11.092C9.40973 10.7157 9.71569 10.4097 10.092 10.218C10.5198 10 11.0799 10 12.2 10H18.8C19.9201 10 20.4802 10 20.908 10.218C21.2843 10.4097 21.5903 10.7157 21.782 11.092C22 11.5198 22 12.0799 22 13.2V20.3636C22 21.357 20.8103 21.8669 20.0909 21.1818C19.3906 20.5149 18.4606 20.1429 17.4935 20.1429H12.2C11.0799 20.1429 10.5198 20.1429 10.092 19.9249C9.71569 19.7331 9.40973 19.4272 9.21799 19.0508C9 18.623 9 18.063 9 16.9429V13.2Z" fill="#4D6AD6"/><path d="M9 14H7.25C7.00285 14 6.87928 14 6.75895 14.0097C6.27553 14.0487 5.80877 14.2043 5.39866 14.4631C5.29658 14.5276 5.19772 14.6017 5 14.75V14.75C4.48857 15.1336 4.23286 15.3254 4.03782 15.4003C3.21483 15.7164 2.29801 15.258 2.05709 14.4099C2 14.2089 2 13.8893 2 13.25V6.8C2 5.11984 2 4.27976 2.32698 3.63803C2.6146 3.07354 3.07354 2.6146 3.63803 2.32698C4.27976 2 5.11984 2 6.8 2H13.2C14.8802 2 15.7202 2 16.362 2.32698C16.9265 2.6146 17.3854 3.07354 17.673 3.63803C18 4.27976 18 5.11984 18 6.8V7V7.5M20.0909 21.1818V21.1818C20.8103 21.8669 22 21.357 22 20.3636V13.2C22 12.0799 22 11.5198 21.782 11.092C21.5903 10.7157 21.2843 10.4097 20.908 10.218C20.4802 10 19.9201 10 18.8 10H12.2C11.0799 10 10.5198 10 10.092 10.218C9.71569 10.4097 9.40973 10.7157 9.21799 11.092C9 11.5198 9 12.0799 9 13.2V16.9429C9 18.063 9 18.623 9.21799 19.0508C9.40973 19.4272 9.71569 19.7331 10.092 19.9249C10.5198 20.1429 11.0799 20.1429 12.2 20.1429H17.4935C18.4606 20.1429 19.3906 20.5149 20.0909 21.1818Z" stroke="#4D6AD6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
      <div>
        <div v-show="!isEdit" class="text-gray-700 text-md leading-[24px] font-semibold flex items-center gap-[8px]">
          {{theTitle}}
          <span @click="editTitle"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M13.3332 13.9997H2.6665M10.6665 2.66634C10.4998 3.83301 11.4998 4.83301 12.6665 4.66634M4.6665 10.6663L5.04654 9.1462C5.15323 8.71945 5.20657 8.50608 5.29235 8.30714C5.36851 8.13052 5.46355 7.96266 5.57582 7.80649C5.70227 7.63058 5.8578 7.47505 6.16884 7.16401L10.9999 2.333C11.053 2.27991 11.0796 2.25337 11.1031 2.23201C11.6116 1.76973 12.3882 1.76974 12.8968 2.23203C12.9203 2.2534 12.9468 2.27994 12.9999 2.33303V2.33303C13.053 2.38611 13.0795 2.41265 13.1009 2.43615C13.5631 2.9447 13.5631 3.7213 13.1009 4.22984C13.0795 4.25334 13.053 4.27988 12.9999 4.33297L8.16883 9.16402C7.85779 9.47506 7.70227 9.63058 7.52636 9.75703C7.37019 9.8693 7.20233 9.96434 7.02571 10.0405C6.82677 10.1263 6.6134 10.1796 6.18666 10.2863L4.6665 10.6663Z" stroke="#606266" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
        </div>
        <div v-show="isEdit"  class="text-gray-700 text-md leading-[24px] font-semibold flex items-center gap-[8px]">
          <input type="text"
                 ref="inputTitle"
                 v-model="theTitle"
                 @change="saveTitle"
                 @blur="isEdit=false">
        </div>
        <div class="text-gray-500 flex gap-[8px] text-sm leading-[22px]">
          <div>{{userName}}</div>
          <div>·</div>
          <div>{{time}}</div>
          <!-- <div>2023-9-21</div>
          <div>21:05:08</div> -->
        </div>
      </div>
    </div>
    <div class="border border-gray-200 border-b-[2px] rounded-xs" v-for="comment in commentData" :key="comment.id">
      <div class="flex justify-between gap-[4px] border-b border-gray-200 items-center px-[12px] py-[9px] bg-gray-100">
        <div class="flex items-center gap-[8px]">
          <el-avatar :size="24" :src="comment.user.avatar"></el-avatar>
          {{comment.user.name}} {{formatTime(comment.created_at)}}
        </div>
        <el-dropdown>
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M7.66667 4.66634C8.58333 4.66634 9.33333 3.91634 9.33333 2.99967C9.33333 2.08301 8.58333 1.33301 7.66667 1.33301C6.75 1.33301 6 2.08301 6 2.99967C6 3.91634 6.75 4.66634 7.66667 4.66634Z" fill="#606266"/><path d="M7.66667 6.33301C6.75 6.33301 6 7.08301 6 7.99967C6 8.91634 6.75 9.66634 7.66667 9.66634C8.58333 9.66634 9.33333 8.91634 9.33333 7.99967C9.33333 7.08301 8.58333 6.33301 7.66667 6.33301Z" fill="#606266"/><path d="M6 12.9997C6 12.083 6.75 11.333 7.66667 11.333C8.58333 11.333 9.33333 12.083 9.33333 12.9997C9.33333 13.9163 8.58333 14.6663 7.66667 14.6663C6.75 14.6663 6 13.9163 6 12.9997Z" fill="#606266"/></svg>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="quote(comment.content)">
                <SvgIcon name="discussion-replay-icon" class="w-[16px] h-[16px]" />
                <span class="ml-[4px]">{{ $t('community.discussionDetail.reply') }}</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

      </div>
      <div class="px-[12px] py-[12px] markdown-body" v-html="renderMarkdown(comment.content)"></div>
    </div>
    <!-- <CommunityTimeLine :timelineData="timelineData"></CommunityTimeLine> -->
    <CommunityMDTextarea ref="mdTextarea" :desc="desc"  @inputChange="handleInputChange"></CommunityMDTextarea>
    <div>
      <el-button type="primary" @click="create">{{ $t('community.discussionDetail.comment') }}</el-button>
      <el-button @click="cancel">{{ $t('community.discussionDetail.cancel') }}</el-button>
    </div>
  </div>
</template>
<script>
import CommunityTimeLine from './CommunityTimeLine.vue'
import CommunityMDTextarea from './CommunityMDTextarea.vue'
import { format } from 'timeago.js'
import { ElMessage } from 'element-plus'
import MarkdownIt from "markdown-it"
import useFetchApi from '../../packs/useFetchApi'
import { beiJingTimeParser } from '../../packs/utils'

export default {
  props: {
    discussionId: String,
    title:String,
    userName:String,
    createUserId:String,
    time:String
  },
  components: {
    CommunityTimeLine,
    CommunityMDTextarea
  },
  data() {
    return {
      isEdit:false,
      activeTab:'Edit',
      commentData:[],
      desc:'',
      theTitle:this.title,
      oldTitle:this.title,
      updateTime:format('2023-12-1', 'zh_CN'),
      timelineData:[{ name:'Username',type:'change status',state:'closed',date: '2022-01-01', text: 'Event 1' },
                    { name:'Username',type:'change status',state:'open',date: '2023-03-15', text: 'Event 2' },
                    { name:'Username',type:'change title',title_from:'xxx',title_to:'xyx',date: '2023-04-10', text: 'Event 3' },]
    };
  },
  mounted() {
    this.getComment(this.discussionId)
  },
  methods: {
    formatTime(timestamp) {
      try {
        const parsedTime = beiJingTimeParser(timestamp);
        return format(parsedTime, this.$i18n.locale === 'en' ? 'en_US' : 'zh_CN');
      } catch (error) {
        console.error("Error formatting time:", error);
        return timestamp; // Fallback to the original timestamp on error
      }
    },
    editTitle() {
      this.isEdit = true
      this.$nextTick(() => {
        this.$refs.inputTitle.focus()
      });
    },
    saveTitle() {
      this.isEdit = false;
      this.updateDiscussion(this.discussionId)
    },
    handleInputChange(value) {
      this.desc = value;
    },
    quote(content){
      this.desc = '> '+content
      this.$refs.mdTextarea.quote(this.desc)
    },
    renderMarkdown(text) {
      const mdParser = new MarkdownIt()
      return mdParser.render(text)
    },
    async create(){
      if (this.desc === '') {
        ElMessage({ message: this.$t('community.discussionDetail.warn'), type: "warning" })
        return
      }
      this.createComment(this.discussionId)
    },
    cancel(){
      this.$emit("toggleDetails");
    },

    async updateDiscussion(id) {
      const discussionUpdateEndpoint = `/discussions/${id}`
      const options = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: this.theTitle,
        })
      }
      const {data, error} = await useFetchApi(discussionUpdateEndpoint, options).json()
      if (data.value) {
        this.$emit("getDiscussion")
        ElMessage.success(this.$t('community.discussionDetail.updateSuccess'))
      } else {
        ElMessage.warning(error.value.msg)
        this.editTitle()
      }
    },
    async getComment(discussionId){
      const commentCreateEndpoint = `discussions/${discussionId}/comments`
      const {data, error} = await useFetchApi(commentCreateEndpoint).json()
      if (data.value) {
        this.commentData = data.value.data
      } else {
        ElMessage.warning(error.value.msg)
      }
    },
    async createComment(discussionId){
      const commentCreateEndpoint = `discussions/${discussionId}/comments`
      const commentJsonData = {
        commentable_type: 'Discussion',
        commentable_id: discussionId,
        content: this.desc
      }
      const commentOptions = {
        method:'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commentJsonData)
      }
      const {data, error} = await useFetchApi(commentCreateEndpoint, commentOptions).json()
      if (data.value) {
        this.getComment(this.discussionId)
        ElMessage.success(this.$t('community.discussionDetail.addSuccess'))
      } else {
        ElMessage.warning(error.value.msg)
      }
    }
  }
}
</script>
