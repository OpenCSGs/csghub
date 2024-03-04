<template>
  <div class="flex flex-col gap-[16px]">
    <div class="flex gap-[8px] items-center">
      <div class="px-[8px] py-[8px] bg-[#F0F3FF] rounded-[8px]"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path opacity="0.12" d="M9 13.2C9 12.0799 9 11.5198 9.21799 11.092C9.40973 10.7157 9.71569 10.4097 10.092 10.218C10.5198 10 11.0799 10 12.2 10H18.8C19.9201 10 20.4802 10 20.908 10.218C21.2843 10.4097 21.5903 10.7157 21.782 11.092C22 11.5198 22 12.0799 22 13.2V20.3636C22 21.357 20.8103 21.8669 20.0909 21.1818C19.3906 20.5149 18.4606 20.1429 17.4935 20.1429H12.2C11.0799 20.1429 10.5198 20.1429 10.092 19.9249C9.71569 19.7331 9.40973 19.4272 9.21799 19.0508C9 18.623 9 18.063 9 16.9429V13.2Z" fill="#4D6AD6"/><path d="M9 14H7.25C7.00285 14 6.87928 14 6.75895 14.0097C6.27553 14.0487 5.80877 14.2043 5.39866 14.4631C5.29658 14.5276 5.19772 14.6017 5 14.75V14.75C4.48857 15.1336 4.23286 15.3254 4.03782 15.4003C3.21483 15.7164 2.29801 15.258 2.05709 14.4099C2 14.2089 2 13.8893 2 13.25V6.8C2 5.11984 2 4.27976 2.32698 3.63803C2.6146 3.07354 3.07354 2.6146 3.63803 2.32698C4.27976 2 5.11984 2 6.8 2H13.2C14.8802 2 15.7202 2 16.362 2.32698C16.9265 2.6146 17.3854 3.07354 17.673 3.63803C18 4.27976 18 5.11984 18 6.8V7V7.5M20.0909 21.1818V21.1818C20.8103 21.8669 22 21.357 22 20.3636V13.2C22 12.0799 22 11.5198 21.782 11.092C21.5903 10.7157 21.2843 10.4097 20.908 10.218C20.4802 10 19.9201 10 18.8 10H12.2C11.0799 10 10.5198 10 10.092 10.218C9.71569 10.4097 9.40973 10.7157 9.21799 11.092C9 11.5198 9 12.0799 9 13.2V16.9429C9 18.063 9 18.623 9.21799 19.0508C9.40973 19.4272 9.71569 19.7331 10.092 19.9249C10.5198 20.1429 11.0799 20.1429 12.2 20.1429H17.4935C18.4606 20.1429 19.3906 20.5149 20.0909 21.1818Z" stroke="#4D6AD6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
      <div>
        <div v-show="!isEdit" class="text-[#303133] text-[16px] leading-[24px] font-semibold flex items-center gap-[8px]">
          {{theTitle}}
          <span @click="editTitle"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M13.3332 13.9997H2.6665M10.6665 2.66634C10.4998 3.83301 11.4998 4.83301 12.6665 4.66634M4.6665 10.6663L5.04654 9.1462C5.15323 8.71945 5.20657 8.50608 5.29235 8.30714C5.36851 8.13052 5.46355 7.96266 5.57582 7.80649C5.70227 7.63058 5.8578 7.47505 6.16884 7.16401L10.9999 2.333C11.053 2.27991 11.0796 2.25337 11.1031 2.23201C11.6116 1.76973 12.3882 1.76974 12.8968 2.23203C12.9203 2.2534 12.9468 2.27994 12.9999 2.33303V2.33303C13.053 2.38611 13.0795 2.41265 13.1009 2.43615C13.5631 2.9447 13.5631 3.7213 13.1009 4.22984C13.0795 4.25334 13.053 4.27988 12.9999 4.33297L8.16883 9.16402C7.85779 9.47506 7.70227 9.63058 7.52636 9.75703C7.37019 9.8693 7.20233 9.96434 7.02571 10.0405C6.82677 10.1263 6.6134 10.1796 6.18666 10.2863L4.6665 10.6663Z" stroke="#606266" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
        </div>
        <div v-show="isEdit"  class="text-[#303133] text-[16px] leading-[24px] font-semibold flex items-center gap-[8px]">
          <input type="text"
                 ref="inputTitle" 
                 v-model="theTitle" 
                 @change="saveTitle" 
                 @blur="isEdit=false">
        </div>
        <div class="text-[#606266] flex gap-[8px] text-[14px] leading-[22px]">
          <div>{{userName}}</div>
          <div>·</div>
          <div>{{time}}</div>
          <!-- <div>2023-9-21</div>
          <div>21:05:08</div> -->
        </div>
      </div>
    </div>
    <div class="border border-[#EBEEF5] border-b-[2px] rounded-[4px]" v-for="comment in commentData" :key="comment.id">
      <div class="flex justify-between gap-[4px] border-b border-[#EBEEF5] items-center px-[12px] py-[9px] bg-[#F5F7FA]">
        <div class="flex items-center gap-[8px]">
          <el-avatar :size="24" :src="comment.user.avatar"></el-avatar>
          {{comment.user.name}} {{comment.time}}
        </div>
        <el-dropdown>
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M7.66667 4.66634C8.58333 4.66634 9.33333 3.91634 9.33333 2.99967C9.33333 2.08301 8.58333 1.33301 7.66667 1.33301C6.75 1.33301 6 2.08301 6 2.99967C6 3.91634 6.75 4.66634 7.66667 4.66634Z" fill="#606266"/><path d="M7.66667 6.33301C6.75 6.33301 6 7.08301 6 7.99967C6 8.91634 6.75 9.66634 7.66667 9.66634C8.58333 9.66634 9.33333 8.91634 9.33333 7.99967C9.33333 7.08301 8.58333 6.33301 7.66667 6.33301Z" fill="#606266"/><path d="M6 12.9997C6 12.083 6.75 11.333 7.66667 11.333C8.58333 11.333 9.33333 12.083 9.33333 12.9997C9.33333 13.9163 8.58333 14.6663 7.66667 14.6663C6.75 14.6663 6 13.9163 6 12.9997Z" fill="#606266"/></svg>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="quote(comment.content)">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><g opacity="0.12"><path d="M6.66658 11.2C6.66658 11.9467 6.66658 12.3201 6.52126 12.6053C6.39343 12.8562 6.18946 13.0602 5.93857 13.188C5.65336 13.3333 5.27999 13.3333 4.53325 13.3333H3.46659C2.71985 13.3333 2.34648 13.3333 2.06126 13.188C1.81038 13.0602 1.60641 12.8562 1.47858 12.6053C1.33325 12.3201 1.33325 11.9467 1.33325 11.2L1.33325 10.1333C1.33325 9.3866 1.33325 9.01323 1.47858 8.72801C1.60641 8.47713 1.81038 8.27316 2.06126 8.14532C2.34648 8 2.71985 8 3.46659 8H4.53325C5.27999 8 5.65336 8 5.93857 8.14532C6.18946 8.27316 6.39343 8.47713 6.52126 8.72801C6.66658 9.01323 6.66658 9.3866 6.66658 10.1333V11.2Z" fill="#2F384C"/><path d="M14.6666 11.2C14.6666 11.9467 14.6666 12.3201 14.5213 12.6053C14.3934 12.8562 14.1895 13.0602 13.9386 13.188C13.6534 13.3333 13.28 13.3333 12.5333 13.3333L11.4666 13.3333C10.7198 13.3333 10.3465 13.3333 10.0613 13.188C9.81038 13.0602 9.60641 12.8562 9.47858 12.6053C9.33325 12.3201 9.33325 11.9467 9.33325 11.2V10.1333C9.33325 9.3866 9.33325 9.01323 9.47858 8.72801C9.60641 8.47713 9.81038 8.27316 10.0613 8.14532C10.3465 8 10.7198 8 11.4666 8L12.5333 8C13.28 8 13.6534 8 13.9386 8.14532C14.1895 8.27316 14.3934 8.47713 14.5213 8.72801C14.6666 9.01323 14.6666 9.3866 14.6666 10.1333V11.2Z" fill="#2F384C"/></g><path d="M1.33325 10.6665L1.33325 7.98414C1.33325 7.00577 1.33325 6.51659 1.44377 6.05624C1.54176 5.6481 1.70338 5.25792 1.92269 4.90003C2.17006 4.49636 2.51596 4.15046 3.20777 3.45865L3.99992 2.6665M9.33325 10.6665V7.98414C9.33325 7.00577 9.33325 6.51659 9.44377 6.05624C9.54176 5.6481 9.70338 5.25792 9.92269 4.90003C10.1701 4.49636 10.516 4.15046 11.2078 3.45865L11.9999 2.6665M12.5333 13.3332H11.4666C10.7198 13.3332 10.3465 13.3332 10.0613 13.1878C9.81038 13.06 9.60641 12.856 9.47858 12.6052C9.33325 12.3199 9.33325 11.9466 9.33325 11.1998V10.1332C9.33325 9.38643 9.33325 9.01307 9.47858 8.72785C9.60641 8.47697 9.81038 8.27299 10.0613 8.14516C10.3465 7.99984 10.7198 7.99984 11.4666 7.99984L12.5332 7.99984C13.28 7.99984 13.6534 7.99984 13.9386 8.14516C14.1895 8.27299 14.3934 8.47697 14.5213 8.72785C14.6666 9.01307 14.6666 9.38643 14.6666 10.1332V11.1998C14.6666 11.9466 14.6666 12.3199 14.5213 12.6052C14.3934 12.856 14.1895 13.06 13.9386 13.1878C13.6534 13.3332 13.28 13.3332 12.5333 13.3332ZM4.53325 7.99984H3.46659C2.71985 7.99984 2.34648 7.99984 2.06126 8.14516C1.81038 8.27299 1.60641 8.47697 1.47858 8.72785C1.33325 9.01307 1.33325 9.38643 1.33325 10.1332L1.33325 11.1998C1.33325 11.9466 1.33325 12.3199 1.47858 12.6052C1.60641 12.856 1.81038 13.06 2.06126 13.1878C2.34648 13.3332 2.71985 13.3332 3.46659 13.3332H4.53325C5.27999 13.3332 5.65336 13.3332 5.93857 13.1878C6.18946 13.06 6.39343 12.856 6.52126 12.6052C6.66658 12.3199 6.66658 11.9466 6.66658 11.1998V10.1332C6.66658 9.38643 6.66658 9.01307 6.52126 8.72785C6.39343 8.47697 6.18946 8.27299 5.93857 8.14516C5.65336 7.99984 5.27999 7.99984 4.53325 7.99984Z" stroke="#2F384C" stroke-linecap="round" stroke-linejoin="round"/></svg>
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
import { format } from 'timeago.js';
import csrfFetch from "../../packs/csrfFetch";
import { ElMessage } from 'element-plus'
import MarkdownIt from "markdown-it";
import { createI18n } from 'vue-i18n'

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
    editTitle() {
      this.isEdit = true;
      this.$nextTick(() => {
        this.$refs.inputTitle.focus();
      });
    },
    saveTitle() {
      this.isEdit = false;
      this.updateDiscussion(this.discussionId).then((data) => {
        this.$emit("getDiscussion")
        ElMessage({
          message: this.$t('community.discussionDetail.updateSuccess'),
          type: 'success'
        })
      })
      .catch(err => {
        ElMessage({
          message: err.message,
          type: 'warning'
        })
      })

      // if(this.title!=this.oldTitle){
      //   let data={name:'username',type:'change title',title_from:this.oldTitle,title_to:this.title,date:new Date().toISOString()}
      //   this.timelineData.push(data)
      // }
    },
    handleInputChange(value) {
      this.desc = value;
    },
    quote(content){
      console.log(content);
      console.log(this.desc);
      this.desc = '> '+content
      this.$refs.mdTextarea.quote(this.desc);
    },
    renderMarkdown(text) {
      const mdParser = new MarkdownIt();
      return mdParser.render(text);
    },
    async create(){
      if (this.desc === '') {
        ElMessage({ message: this.$t('community.discussionDetail.warn'), type: "warning" });
        return;
      }
      this.createComment(this.discussionId).then((data) => {
        ElMessage({ message: this.$t('community.discussionDetail.addSuccess'), type: "success" });
        this.getComment(this.discussionId)
      })
      .catch(err => {
        ElMessage({ message: err.message, type: 'warning' });
      })
      // let data={name:'username',type:'desc',desc:this.desc,date:new Date().toISOString()}
      // this.timelineData.push(data)
      this.$refs.mdTextarea.clearTextarea();
    },
    cancel(){
      this.$emit("toggleDetails");
    },

    async updateDiscussion(id) {
      const discussionUpdateEndpoint = `/internal_api/discussions/${id}`;
      const formData = new FormData()
      formData.append("title", this.theTitle);
      const options = {
        method: 'PUT',
        body: formData
      };
      const response = await csrfFetch(discussionUpdateEndpoint, options)

      if (!response.ok) {
        return response.json().then(data => { throw new Error(data.message) })
      } else {
        return response.json();
      }
    },
    async getComment(discussionId){
      const commentCreateEndpoint = `/internal_api/comments?commentable_type=Discussion&commentable_id=${discussionId}`
      const response = await fetch(commentCreateEndpoint);
      response.json().then((data) => {
        console.log(data);
        this.commentData=data
      })
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
