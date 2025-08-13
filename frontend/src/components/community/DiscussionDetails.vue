<template>
  <div class="flex flex-col gap-[16px]">
    <div class="flex gap-[8px] items-center">
      <div class="px-[8px] py-[8px] bg-brand-25 rounded-md"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path opacity="0.12" d="M9 13.2C9 12.0799 9 11.5198 9.21799 11.092C9.40973 10.7157 9.71569 10.4097 10.092 10.218C10.5198 10 11.0799 10 12.2 10H18.8C19.9201 10 20.4802 10 20.908 10.218C21.2843 10.4097 21.5903 10.7157 21.782 11.092C22 11.5198 22 12.0799 22 13.2V20.3636C22 21.357 20.8103 21.8669 20.0909 21.1818C19.3906 20.5149 18.4606 20.1429 17.4935 20.1429H12.2C11.0799 20.1429 10.5198 20.1429 10.092 19.9249C9.71569 19.7331 9.40973 19.4272 9.21799 19.0508C9 18.623 9 18.063 9 16.9429V13.2Z" fill="#4D6AD6"/><path d="M9 14H7.25C7.00285 14 6.87928 14 6.75895 14.0097C6.27553 14.0487 5.80877 14.2043 5.39866 14.4631C5.29658 14.5276 5.19772 14.6017 5 14.75V14.75C4.48857 15.1336 4.23286 15.3254 4.03782 15.4003C3.21483 15.7164 2.29801 15.258 2.05709 14.4099C2 14.2089 2 13.8893 2 13.25V6.8C2 5.11984 2 4.27976 2.32698 3.63803C2.6146 3.07354 3.07354 2.6146 3.63803 2.32698C4.27976 2 5.11984 2 6.8 2H13.2C14.8802 2 15.7202 2 16.362 2.32698C16.9265 2.6146 17.3854 3.07354 17.673 3.63803C18 4.27976 18 5.11984 18 6.8V7V7.5M20.0909 21.1818V21.1818C20.8103 21.8669 22 21.357 22 20.3636V13.2C22 12.0799 22 11.5198 21.782 11.092C21.5903 10.7157 21.2843 10.4097 20.908 10.218C20.4802 10 19.9201 10 18.8 10H12.2C11.0799 10 10.5198 10 10.092 10.218C9.71569 10.4097 9.40973 10.7157 9.21799 11.092C9 11.5198 9 12.0799 9 13.2V16.9429C9 18.063 9 18.623 9.21799 19.0508C9.40973 19.4272 9.71569 19.7331 10.092 19.9249C10.5198 20.1429 11.0799 20.1429 12.2 20.1429H17.4935C18.4606 20.1429 19.3906 20.5149 20.0909 21.1818Z" stroke="#4D6AD6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
      <div>
        <div v-show="!isEdit" class="pl-0.5 text-gray-700 text-md leading-6 font-medium flex items-center gap-2">
          {{theTitle}}
          <el-tooltip 
            v-if="canEdit"
            :content="$t('community.discussionDetail.editTitle')" 
            placement="top">
            <span @click="editTitle" class="cursor-pointer"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M13.3332 13.9997H2.6665M10.6665 2.66634C10.4998 3.83301 11.4998 4.83301 12.6665 4.66634M4.6665 10.6663L5.04654 9.1462C5.15323 8.71945 5.20657 8.50608 5.29235 8.30714C5.36851 8.13052 5.46355 7.96266 5.57582 7.80649C5.70227 7.63058 5.8578 7.47505 6.16884 7.16401L10.9999 2.333C11.053 2.27991 11.0796 2.25337 11.1031 2.23201C11.6116 1.76973 12.3882 1.76974 12.8968 2.23203C12.9203 2.2534 12.9468 2.27994 12.9999 2.33303V2.33303C13.053 2.38611 13.0795 2.41265 13.1009 2.43615C13.5631 2.9447 13.5631 3.7213 13.1009 4.22984C13.0795 4.25334 13.053 4.27988 12.9999 4.33297L8.16883 9.16402C7.85779 9.47506 7.70227 9.63058 7.52636 9.75703C7.37019 9.8693 7.20233 9.96434 7.02571 10.0405C6.82677 10.1263 6.6134 10.1796 6.18666 10.2863L4.6665 10.6663Z" stroke="#606266" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
          </el-tooltip>
          <el-tooltip 
            v-if="canDelete"
            :content="$t('community.discussionDetail.deleteDiscussion')" 
            placement="top">
            <span @click="deleteDiscussion" class="cursor-pointer"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M5.333 4V2.667a1.333 1.333 0 0 1 1.334-1.334h2.666a1.333 1.333 0 0 1 1.334 1.334V4m2 0v9.333a1.333 1.333 0 0 1-1.334 1.334H4.667a1.333 1.333 0 0 1-1.334-1.334V4h8.667Z" stroke="#606266" stroke-linecap="round" stroke-linejoin="round"/><path d="M6.667 7.333v4M9.333 7.333v4" stroke="#606266" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
          </el-tooltip>
        </div>
        <div v-show="isEdit"  class="text-gray-700 text-md leading-6 font-medium flex items-center gap-2">
          <input type="text"
                 ref="inputTitle"
                 v-model="theTitle"
                 @change="saveTitle"
                 @blur="isEdit=false">
        </div>
        <div class="text-gray-500 flex gap-2 text-sm leading-5">
          <a :href="`/profile/${userName}`" class="hover:text-brand-600 hover:underline cursor-pointer">{{userName}}</a>
          <div>·</div>
          <a>{{ time }}</a>
        </div>
      </div>
    </div>
    <div class="border border-gray-200 border-b-0.5 rounded-lg" v-for="comment in commentData" :key="comment.id">
      <div class="flex justify-between gap-1 border-b rounded-t-lg border-gray-200 items-center px-3 py-2 bg-gray-100">
        <div class="flex items-center gap-2 text-md leading-5 text-gray-700 font-normal">
          <el-avatar :size="24" :src="comment.user.avatar"></el-avatar>
          <div class="flex items-center gap-1">
            <a :href="`/profile/${comment.user.name}`" class="hover:text-brand-600 hover:underline cursor-pointer">{{comment.user.name}}</a>
            <div>·</div>
            <el-tooltip 
              :content="formatFullTime(comment.created_at)" 
              placement="top">
              <div class="cursor-help">{{formatTime(comment.created_at)}}</div>
            </el-tooltip>
          </div>
        </div>
        <el-dropdown>
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M7.66667 4.66634C8.58333 4.66634 9.33333 3.91634 9.33333 2.99967C9.33333 2.08301 8.58333 1.33301 7.66667 1.33301C6.75 1.33301 6 2.08301 6 2.99967C6 3.91634 6.75 4.66634 7.66667 4.66634Z" fill="#606266"/><path d="M7.66667 6.33301C6.75 6.33301 6 7.08301 6 7.99967C6 8.91634 6.75 9.66634 7.66667 9.66634C8.58333 9.66634 9.33333 8.91634 9.33333 7.99967C9.33333 7.08301 8.58333 6.33301 7.66667 6.33301Z" fill="#606266"/><path d="M6 12.9997C6 12.083 6.75 11.333 7.66667 11.333C8.58333 11.333 9.33333 12.083 9.33333 12.9997C9.33333 13.9163 8.58333 14.6663 7.66667 14.6663C6.75 14.6663 6 13.9163 6 12.9997Z" fill="#606266"/></svg>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="quote(comment.content)">
                <SvgIcon name="discussion-replay-icon" class="w-4 h-4" />
                <span class="ml-1">{{ $t('community.discussionDetail.reply') }}</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

      </div>
      <div class="px-3 py-3 rounded-b-lg text-gray-700 text-md font-normal markdown-body" v-html="renderMarkdown(comment.content)"></div>
    </div>
    <!-- <CommunityTimeLine :timelineData="timelineData"></CommunityTimeLine> -->
    <CommunityMDTextarea ref="mdTextarea" :desc="desc"  @inputChange="handleInputChange"></CommunityMDTextarea>
    <div class="flex flex-row gap-2 px-1">
      <CsgButton 
        class="btn btn-primary btn-sm"
        type="primary" 
        @click="create"
        :name="$t('community.discussionDetail.comment')"
      />
      <CsgButton 
        class="btn btn-secondary-gray btn-sm"
        @click="cancel"
        :name="$t('community.discussionDetail.cancel')"
      />
    </div>
  </div>
</template>
<script>
import CommunityTimeLine from './CommunityTimeLine.vue'
import CommunityMDTextarea from './CommunityMDTextarea.vue'
import { format } from 'timeago.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import MarkdownIt from "markdown-it"
import useFetchApi from '../../packs/useFetchApi'
import { beiJingTimeParser } from '../../packs/utils'
import useUserStore from '../../stores/UserStore'

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
                    { name:'Username',type:'change title',title_from:'xxx',title_to:'xyx',date: '2023-04-10', text: 'Event 3' },],
      userStore: useUserStore()
    };
  },
  computed: {
    canEdit() {
      return this.userStore.username === this.userName || this.userStore.isAdmin
    },
    canDelete() {
      return this.userStore.username === this.userName || this.userStore.isAdmin
    }
  },
  mounted() {
    this.getComment(this.discussionId)
  },
  methods: {
    formatTime(timestamp) {
      try {
        const parsedTime = beiJingTimeParser(timestamp);
        // 支持多语言的时间格式化
        const locale = this.$i18n?.locale || 'zh';
        let timeagoLocale = 'zh_CN'; // 默认简体中文
        
        if (locale === 'en' || locale === 'en-US') {
          timeagoLocale = 'en_US';
        } else if (locale === 'zhHant' || locale === 'zh_TW' || locale === 'zh-TW' || locale === 'zh_Hant' || locale === 'zh-Hant') {
          timeagoLocale = 'zh_TW';
        } else {
          timeagoLocale = 'zh_CN';
        }
        
        return format(parsedTime, timeagoLocale);
      } catch (error) {
        console.error("Error formatting time:", error);
        return timestamp; // Fallback to the original timestamp on error
      }
    },
    formatFullTime(timestamp) {
      try {
        const parsedTime = beiJingTimeParser(timestamp);
        return parsedTime.toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        });
      } catch (error) {
        console.error("Error formatting full time:", error);
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
    deleteDiscussion() {
      ElMessageBox.confirm(
        this.$t('community.discussionDetail.deleteConfirm'),
        this.$t('community.discussionDetail.deleteTitle'),
        {
          confirmButtonText: this.$t('community.discussionDetail.confirmDelete'),
          cancelButtonText: this.$t('community.discussionDetail.cancel'),
          type: 'warning',
        }
      ).then(() => {
        this.confirmDeleteDiscussion()
      }).catch(() => {
      })
    },
    async confirmDeleteDiscussion() {
      const deleteEndpoint = `/discussions/${this.discussionId}`
      const options = {
        method: 'DELETE'
      }
      const {data, error} = await useFetchApi(deleteEndpoint, options).json()
      if (data.value) {
        ElMessage.success(this.$t('community.discussionDetail.deleteSuccess'))
        this.$emit("refreshDiscussions")
      } else {
        ElMessage.warning(error.value.msg)
      }
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
          description: this.desc || '',
          type: 'general',
          status: 'open'
        })
      }
      const {data, error} = await useFetchApi(discussionUpdateEndpoint, options).json()
      if (data.value) {
        this.$emit("getDiscussion")
        ElMessage.success(this.$t('community.discussionDetail.updateSuccess'))
      } else {
        ElMessage.warning(error.value?.msg || '更新失败，请重试')
        this.theTitle = this.oldTitle
      }
    },
    async getComment(discussionId){
      const commentCreateEndpoint = `/discussions/${discussionId}/comments`
      const {data, error} = await useFetchApi(commentCreateEndpoint).json()
      if (data.value) {
        this.commentData = data.value.data
      } else {
        ElMessage.warning(error.value?.msg || '获取评论失败')
      }
    },
    async createComment(discussionId){
      if (!discussionId) {
        ElMessage.warning('讨论ID不能为空')
        return
      }
      
      if (!this.desc || this.desc.trim() === '') {
        ElMessage.warning('评论内容不能为空')
        return
      }

      const commentCreateEndpoint = `/discussions/${discussionId}/comments`
      const commentJsonData = {
        content: this.desc.trim(),
        type: 'comment',
        status: 'active',
        discussion_id: discussionId
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
        this.getComment(this.discussionId)
        this.$refs.mdTextarea.clearTextarea()
        this.desc = ''
        ElMessage.success(this.$t('community.discussionDetail.addSuccess'))
      } else {
        console.error('创建评论失败:', error.value)
        ElMessage.warning(error.value?.msg || '创建评论失败，请重试')
      }
    }
  }
}
</script>