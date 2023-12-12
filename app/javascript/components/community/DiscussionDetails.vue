<template>
  <div class="flex flex-col gap-[16px]">
    <div class="flex gap-[8px]">
      <div class="px-[8px] py-[8px] bg-[#F0F3FF] rounded-[8px]"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path opacity="0.12" d="M9 13.2C9 12.0799 9 11.5198 9.21799 11.092C9.40973 10.7157 9.71569 10.4097 10.092 10.218C10.5198 10 11.0799 10 12.2 10H18.8C19.9201 10 20.4802 10 20.908 10.218C21.2843 10.4097 21.5903 10.7157 21.782 11.092C22 11.5198 22 12.0799 22 13.2V20.3636C22 21.357 20.8103 21.8669 20.0909 21.1818C19.3906 20.5149 18.4606 20.1429 17.4935 20.1429H12.2C11.0799 20.1429 10.5198 20.1429 10.092 19.9249C9.71569 19.7331 9.40973 19.4272 9.21799 19.0508C9 18.623 9 18.063 9 16.9429V13.2Z" fill="#4D6AD6"/><path d="M9 14H7.25C7.00285 14 6.87928 14 6.75895 14.0097C6.27553 14.0487 5.80877 14.2043 5.39866 14.4631C5.29658 14.5276 5.19772 14.6017 5 14.75V14.75C4.48857 15.1336 4.23286 15.3254 4.03782 15.4003C3.21483 15.7164 2.29801 15.258 2.05709 14.4099C2 14.2089 2 13.8893 2 13.25V6.8C2 5.11984 2 4.27976 2.32698 3.63803C2.6146 3.07354 3.07354 2.6146 3.63803 2.32698C4.27976 2 5.11984 2 6.8 2H13.2C14.8802 2 15.7202 2 16.362 2.32698C16.9265 2.6146 17.3854 3.07354 17.673 3.63803C18 4.27976 18 5.11984 18 6.8V7V7.5M20.0909 21.1818V21.1818C20.8103 21.8669 22 21.357 22 20.3636V13.2C22 12.0799 22 11.5198 21.782 11.092C21.5903 10.7157 21.2843 10.4097 20.908 10.218C20.4802 10 19.9201 10 18.8 10H12.2C11.0799 10 10.5198 10 10.092 10.218C9.71569 10.4097 9.40973 10.7157 9.21799 11.092C9 11.5198 9 12.0799 9 13.2V16.9429C9 18.063 9 18.623 9.21799 19.0508C9.40973 19.4272 9.71569 19.7331 10.092 19.9249C10.5198 20.1429 11.0799 20.1429 12.2 20.1429H17.4935C18.4606 20.1429 19.3906 20.5149 20.0909 21.1818Z" stroke="#4D6AD6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
      <div>
        <div v-if="!isEdit" class="text-[#303133] text-[16px] leading-[24px] font-semibold flex items-center gap-[8px]">
          {{title}}
          <span @click="editTitle"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M13.3332 13.9997H2.6665M10.6665 2.66634C10.4998 3.83301 11.4998 4.83301 12.6665 4.66634M4.6665 10.6663L5.04654 9.1462C5.15323 8.71945 5.20657 8.50608 5.29235 8.30714C5.36851 8.13052 5.46355 7.96266 5.57582 7.80649C5.70227 7.63058 5.8578 7.47505 6.16884 7.16401L10.9999 2.333C11.053 2.27991 11.0796 2.25337 11.1031 2.23201C11.6116 1.76973 12.3882 1.76974 12.8968 2.23203C12.9203 2.2534 12.9468 2.27994 12.9999 2.33303V2.33303C13.053 2.38611 13.0795 2.41265 13.1009 2.43615C13.5631 2.9447 13.5631 3.7213 13.1009 4.22984C13.0795 4.25334 13.053 4.27988 12.9999 4.33297L8.16883 9.16402C7.85779 9.47506 7.70227 9.63058 7.52636 9.75703C7.37019 9.8693 7.20233 9.96434 7.02571 10.0405C6.82677 10.1263 6.6134 10.1796 6.18666 10.2863L4.6665 10.6663Z" stroke="#606266" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
        </div>
        <div v-else  class="text-[#303133] text-[16px] leading-[24px] font-semibold flex items-center gap-[8px]">
          <input type="text" v-model="title" @blur="saveTitle" autofocus>
        </div>
        <div class="text-[#606266] flex gap-[8px] text-[14px] leading-[22px]">
          <div>Username</div>
          <div>·</div>
          <div>2023-9-21</div>
          <div>21:05:08</div>
        </div>
      </div>
    </div>
    <div class="border border-[#EBEEF5] border-b-[2px] rounded-[4px]">
      <div class="flex justify-between gap-[4px] border-b border-[#EBEEF5] items-center px-[12px] py-[9px] bg-[#F5F7FA]">
        <div class="flex items-center gap-[8px]">
          <el-avatar :size="24" :src="avatar"></el-avatar>
          Username {{updateTime}}
        </div>
        <el-dropdown>
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M7.66667 4.66634C8.58333 4.66634 9.33333 3.91634 9.33333 2.99967C9.33333 2.08301 8.58333 1.33301 7.66667 1.33301C6.75 1.33301 6 2.08301 6 2.99967C6 3.91634 6.75 4.66634 7.66667 4.66634Z" fill="#606266"/><path d="M7.66667 6.33301C6.75 6.33301 6 7.08301 6 7.99967C6 8.91634 6.75 9.66634 7.66667 9.66634C8.58333 9.66634 9.33333 8.91634 9.33333 7.99967C9.33333 7.08301 8.58333 6.33301 7.66667 6.33301Z" fill="#606266"/><path d="M6 12.9997C6 12.083 6.75 11.333 7.66667 11.333C8.58333 11.333 9.33333 12.083 9.33333 12.9997C9.33333 13.9163 8.58333 14.6663 7.66667 14.6663C6.75 14.6663 6 13.9163 6 12.9997Z" fill="#606266"/></svg>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path opacity="0.12" d="M10.3335 3L6.1691 7.16431C5.85805 7.47536 5.70252 7.63088 5.57607 7.80679C5.4638 7.96296 5.36875 8.13083 5.2926 8.30745C5.20681 8.50639 5.15347 8.71976 5.04678 9.14652L4.66675 10.6666L6.18691 10.2866C6.61365 10.1799 6.82702 10.1266 7.02596 10.0408C7.20257 9.96464 7.37043 9.8696 7.5266 9.75734C7.70251 9.63089 7.85803 9.47537 8.16907 9.16433L8.16907 9.16433L12.3334 5C12.3334 5 11.3336 4.66667 11.0002 4.33333C10.6669 4 10.3335 3 10.3335 3Z" fill="#2F384C"/>
                  <path d="M13.3334 14.0002H2.66675M10.6667 2.66683C10.5001 3.8335 11.5001 4.8335 12.6667 4.66683M4.66675 10.6668L5.04678 9.14669C5.15347 8.71994 5.20681 8.50657 5.2926 8.30763C5.36875 8.13101 5.46379 7.96315 5.57606 7.80697C5.70252 7.63106 5.85804 7.47554 6.16909 7.1645L11.0002 2.33349C11.0533 2.2804 11.0798 2.25386 11.1033 2.2325C11.6119 1.77022 12.3885 1.77023 12.897 2.23252C12.9205 2.25388 12.9471 2.28043 13.0001 2.33351V2.33351C13.0532 2.3866 13.0798 2.41314 13.1011 2.43664C13.5634 2.94519 13.5634 3.72179 13.1011 4.23033C13.0797 4.25383 13.0532 4.28037 13.0001 4.33345L8.16907 9.1645C7.85803 9.47555 7.70251 9.63107 7.5266 9.75752C7.37043 9.86978 7.20257 9.96483 7.02595 10.041C6.82702 10.1268 6.61365 10.1801 6.1869 10.2868L4.66675 10.6668Z" stroke="#2F384C" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Edit
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

      </div>
      <div class="px-[12px] py-[12px]">
        Content<br>
        Content<br>
        Content<br>
        Content<br>
        Content<br>
      </div>
    </div>
    <CommunityTimeLine :timelineData="timelineData"></CommunityTimeLine>
    <CommunityMDTextarea ref="mdTextarea" :desc="desc"  @inputChange="handleInputChange"></CommunityMDTextarea>
    <div>
      <el-button type="primary" @click="create">Comment</el-button>
      <el-button @click="cancel">Cancel</el-button>
    </div>
  </div>
</template>
<script>
import CommunityTimeLine from './CommunityTimeLine.vue'
import CommunityMDTextarea from './CommunityMDTextarea.vue'
import { format } from 'timeago.js';
export default {
  props: {
    discussionId: String,
  },
  components: {
    CommunityTimeLine,
    CommunityMDTextarea
  },
  data() {
    return {
      isEdit:false,
      activeTab:'Edit',
      desc:'',
      title:"Discussion name",
      oldTitle:'Discussion name',
      updateTime:format('2023-12-1', 'zh_CN'),
      timelineData:[{ name:'Username',type:'change status',state:'closed',date: '2022-01-01', text: 'Event 1' },
                    { name:'Username',type:'change status',state:'open',date: '2023-03-15', text: 'Event 2' },
                    { name:'Username',type:'change title',title_from:'xxx',title_to:'xyx',date: '2023-04-10', text: 'Event 3' },]
    };
  },
  mounted() {},
  methods: {
    editTitle() {
      this.isEdit = true;
    },
    saveTitle() {
      this.isEdit = false;
      if(this.title!=this.oldTitle){
        let data={name:'username',type:'change title',title_from:this.oldTitle,title_to:this.title,date:new Date().toISOString()}
        this.timelineData.push(data)
      }
    },
    handleInputChange(value) {
      this.desc = value;
    },
    create(){
      let data={name:'username',type:'desc',desc:this.desc,date:new Date().toISOString()}
      this.timelineData.push(data)
      this.$refs.mdTextarea.clearTextarea();
    },
    cancel(){
      this.$emit("changeFlag",'show');
    }
  },
};
</script>
