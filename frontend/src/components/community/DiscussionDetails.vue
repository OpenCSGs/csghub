<template>
  <div class="flex flex-col gap-[16px]">
    <div class="flex justify-between items-center">
      <div class="flex items-center gap-2">
        <div class="text-gray-700 text-md leading-6 font-medium flex items-center gap-2">
          <div v-show="!isEdit" class="text-gray-700 text-md leading-6 font-medium flex items-center gap-2">
            <div>{{ title }}</div>
            <el-tooltip content="Edit title" placement="top">
              <div v-if="canEdit" @click="editTitle" class="cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8.5 1.5H5.5C4.11929 1.5 3 2.61929 3 4V12C3 13.3807 4.11929 14.5 5.5 14.5H10.5C11.8807 14.5 13 13.3807 13 12V9" stroke="#606266" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12.5 2.5L13.5 3.5L6.5 10.5H5.5V9.5L12.5 2.5Z" stroke="#606266" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
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
    </div>
    
    <!-- 评论列表 -->
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
      </div>
      <div class="px-3 py-3 rounded-b-lg text-gray-700 text-md font-normal markdown-body" v-html="renderMarkdown(comment.content)"></div>
    </div>
    
    <!-- 评论输入框 -->
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
    title: String,
    userName: String,
    createUserId: String,
    time: String,
    discussionData: Object
  },
  components: {
    CommunityTimeLine,
    CommunityMDTextarea
  },
  data() {
    return {
      isEdit: false,
      activeTab: 'Edit',
      commentData: [],
      desc: '',
      theTitle: this.title,
      oldTitle: this.title,
      updateTime: format('2023-12-1', 'zh_CN'),
      timelineData: [{ name: 'Username', type: 'change status', state: 'closed', date: '2022-01-01', text: 'Event 1' },
                     { name: 'Username', type: 'change status', state: 'open', date: '2023-03-15', text: 'Event 2' },
                     { name: 'Username', type: 'change title', title_from: 'xxx', title_to: 'xyx', date: '2023-04-10', text: 'Event 3' }],
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
  watch: {
    discussionId: {
      handler(newId, oldId) {
        if (newId && newId !== oldId) {
          this.getComment(newId)
        }
      },
      immediate: false
    },
    title: {
      handler(newTitle) {
        this.theTitle = newTitle
        this.oldTitle = newTitle
      },
      immediate: true
    }
  },
  mounted() {
    if (this.discussionId) {
      this.getComment(this.discussionId)
    }
  },
  methods: {
    formatTime(timestamp) {
      try {
        const parsedTime = beiJingTimeParser(timestamp);
        const locale = this.$i18n?.locale || 'zh';
        let timeagoLocale = 'zh_CN';
        
        if (locale === 'en' || locale === 'en-US') {
          timeagoLocale = 'en_US';
        } else if (locale === 'zhHant' || locale === 'zh_TW' || locale === 'zh-TW' || locale === 'zh_Hant' || locale === 'zh-Hant') {
          timeagoLocale = 'zh_TW';
        } else {
          timeagoLocale = 'zh_CN';
        }
        
        return format(parsedTime, timeagoLocale);
      } catch (error) {
        return timestamp;
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
        return timestamp;
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
    quote(content) {
      this.desc = content.split('\n').map(line => '> ' + line).join('\n');
      requestAnimationFrame(() => {
        const textareaEl = this.$refs.mdTextarea.$el;
        if (textareaEl) {
          textareaEl.scrollIntoView({ 
            block: 'center'
          });
          
          requestAnimationFrame(() => {
            this.$refs.mdTextarea.quote(this.desc);
          });
        }
      });
    },
    renderMarkdown(text) {
      const mdParser = new MarkdownIt()
      return mdParser.render(text)
    },
    async create() {
      if (this.desc === '') {
        ElMessage({ message: this.$t('community.discussionDetail.warn'), type: "warning" })
        return
      }
      this.createComment(this.discussionId)
    },
    cancel() {
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
    async getComment(discussionId) {
      if (!discussionId) {
        return
      }
      const commentCreateEndpoint = `/discussions/${discussionId}/comments`
      const {data, error} = await useFetchApi(commentCreateEndpoint).json()
      if (data.value) {
        this.commentData = data.value.data
      } else {
        ElMessage.warning(error.value?.msg || '获取评论失败')
      }
    },
    async createComment(discussionId) {
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
        
        // 添加这一行：通知父组件刷新讨论列表，更新评论数量
        this.$emit("getDiscussion")
      } else {
        ElMessage.warning(error.value?.msg || '创建评论失败，请重试')
      }
    }
  }
}
</script>