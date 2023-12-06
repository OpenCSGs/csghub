<template>
  <div class="flex flex-col gap-[16px]">
    <div class="flex gap-[8px]">
      <div class="px-[8px] py-[8px] bg-[#F0F3FF] rounded-[8px]"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path opacity="0.12" d="M9 13.2C9 12.0799 9 11.5198 9.21799 11.092C9.40973 10.7157 9.71569 10.4097 10.092 10.218C10.5198 10 11.0799 10 12.2 10H18.8C19.9201 10 20.4802 10 20.908 10.218C21.2843 10.4097 21.5903 10.7157 21.782 11.092C22 11.5198 22 12.0799 22 13.2V20.3636C22 21.357 20.8103 21.8669 20.0909 21.1818C19.3906 20.5149 18.4606 20.1429 17.4935 20.1429H12.2C11.0799 20.1429 10.5198 20.1429 10.092 19.9249C9.71569 19.7331 9.40973 19.4272 9.21799 19.0508C9 18.623 9 18.063 9 16.9429V13.2Z" fill="#4D6AD6"/><path d="M9 14H7.25C7.00285 14 6.87928 14 6.75895 14.0097C6.27553 14.0487 5.80877 14.2043 5.39866 14.4631C5.29658 14.5276 5.19772 14.6017 5 14.75V14.75C4.48857 15.1336 4.23286 15.3254 4.03782 15.4003C3.21483 15.7164 2.29801 15.258 2.05709 14.4099C2 14.2089 2 13.8893 2 13.25V6.8C2 5.11984 2 4.27976 2.32698 3.63803C2.6146 3.07354 3.07354 2.6146 3.63803 2.32698C4.27976 2 5.11984 2 6.8 2H13.2C14.8802 2 15.7202 2 16.362 2.32698C16.9265 2.6146 17.3854 3.07354 17.673 3.63803C18 4.27976 18 5.11984 18 6.8V7V7.5M20.0909 21.1818V21.1818C20.8103 21.8669 22 21.357 22 20.3636V13.2C22 12.0799 22 11.5198 21.782 11.092C21.5903 10.7157 21.2843 10.4097 20.908 10.218C20.4802 10 19.9201 10 18.8 10H12.2C11.0799 10 10.5198 10 10.092 10.218C9.71569 10.4097 9.40973 10.7157 9.21799 11.092C9 11.5198 9 12.0799 9 13.2V16.9429C9 18.063 9 18.623 9.21799 19.0508C9.40973 19.4272 9.71569 19.7331 10.092 19.9249C10.5198 20.1429 11.0799 20.1429 12.2 20.1429H17.4935C18.4606 20.1429 19.3906 20.5149 20.0909 21.1818Z" stroke="#4D6AD6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
      <div>
        <div class="text-[#303133] text-[16px] leading-[24px] font-semibold flex items-center gap-[8px]">
          Discussion name
          <span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M13.3332 13.9997H2.6665M10.6665 2.66634C10.4998 3.83301 11.4998 4.83301 12.6665 4.66634M4.6665 10.6663L5.04654 9.1462C5.15323 8.71945 5.20657 8.50608 5.29235 8.30714C5.36851 8.13052 5.46355 7.96266 5.57582 7.80649C5.70227 7.63058 5.8578 7.47505 6.16884 7.16401L10.9999 2.333C11.053 2.27991 11.0796 2.25337 11.1031 2.23201C11.6116 1.76973 12.3882 1.76974 12.8968 2.23203C12.9203 2.2534 12.9468 2.27994 12.9999 2.33303V2.33303C13.053 2.38611 13.0795 2.41265 13.1009 2.43615C13.5631 2.9447 13.5631 3.7213 13.1009 4.22984C13.0795 4.25334 13.053 4.27988 12.9999 4.33297L8.16883 9.16402C7.85779 9.47506 7.70227 9.63058 7.52636 9.75703C7.37019 9.8693 7.20233 9.96434 7.02571 10.0405C6.82677 10.1263 6.6134 10.1796 6.18666 10.2863L4.6665 10.6663Z" stroke="#606266" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
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
        <div>
          <el-avatar :size="24" :src="avatar"></el-avatar>
          Username 1 minute ago·edited less than a minute ago
        </div>
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M7.66667 4.66634C8.58333 4.66634 9.33333 3.91634 9.33333 2.99967C9.33333 2.08301 8.58333 1.33301 7.66667 1.33301C6.75 1.33301 6 2.08301 6 2.99967C6 3.91634 6.75 4.66634 7.66667 4.66634Z" fill="#606266"/><path d="M7.66667 6.33301C6.75 6.33301 6 7.08301 6 7.99967C6 8.91634 6.75 9.66634 7.66667 9.66634C8.58333 9.66634 9.33333 8.91634 9.33333 7.99967C9.33333 7.08301 8.58333 6.33301 7.66667 6.33301Z" fill="#606266"/><path d="M6 12.9997C6 12.083 6.75 11.333 7.66667 11.333C8.58333 11.333 9.33333 12.083 9.33333 12.9997C9.33333 13.9163 8.58333 14.6663 7.66667 14.6663C6.75 14.6663 6 13.9163 6 12.9997Z" fill="#606266"/></svg>
        </div>
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
    <div class="border border-[#DCDFE6] rounded-[4px] bg-[#F5F7FA]">
      <div class="flex text-[14px] leading-[22px]">
        <div class="px-[20px] py-[9px] border-r" :class="activeTab=='Edit'?'bg-white':'border-b'" @click="activeTab='Edit'">Edit</div>
        <div class="px-[20px] py-[9px] border-r" :class="activeTab=='Preview'?'bg-white':'border-b'" @click="activeTab='Preview'">Preview</div>
        <div class="border-b w-full"></div>
      </div>
      <div class="px-[16px] py-[16px] bg-white">
        <el-input v-model="desc"
                  clearable
                  type="textarea"
                  placeholder="Add an extended description..."
                  class="w-full h-auto text-[#606266] mb-[10px]"/>
        <div class="flex gap-[8px] text-[#909399] text-[14px] leading-[22px]">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1.99992 11.9997L4.51355 9.48605C5.03457 8.96503 5.29507 8.70452 5.59611 8.60523C5.86095 8.51788 6.14652 8.51577 6.41263 8.5992C6.7151 8.69403 6.97943 8.95066 7.50809 9.46393L9.65733 11.5506M14.3333 11.7913L13.3834 10.8415C12.8554 10.3135 12.5914 10.0495 12.2869 9.95055C12.0192 9.86354 11.7307 9.86354 11.4629 9.95055C11.1585 10.0495 10.8943 10.3136 10.3661 10.8418C9.96312 11.2448 9.65733 11.5506 9.65733 11.5506M12.3333 14.2265L9.65733 11.5506M11.9999 5.33301C11.9999 6.06939 11.403 6.66634 10.6666 6.66634C9.93021 6.66634 9.33325 6.06939 9.33325 5.33301C9.33325 4.59663 9.93021 3.99967 10.6666 3.99967C11.403 3.99967 11.9999 4.59663 11.9999 5.33301ZM7.73325 14.6663H8.26658C10.5068 14.6663 11.6269 14.6663 12.4825 14.2304C13.2352 13.8469 13.8471 13.235 14.2306 12.4823C14.6666 11.6267 14.6666 10.5066 14.6666 8.26634V7.73301C14.6666 5.4928 14.6666 4.37269 14.2306 3.51705C13.8471 2.7644 13.2352 2.15248 12.4825 1.76898C11.6269 1.33301 10.5068 1.33301 8.26659 1.33301H7.73325C5.49304 1.33301 4.37294 1.33301 3.51729 1.76898C2.76464 2.15248 2.15272 2.7644 1.76923 3.51705C1.33325 4.37269 1.33325 5.4928 1.33325 7.73301V8.26634C1.33325 10.5066 1.33325 11.6267 1.76923 12.4823C2.15272 13.235 2.76464 13.8469 3.51729 14.2304C4.37294 14.6663 5.49304 14.6663 7.73325 14.6663Z" stroke="#606266" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <span>Upload images, audio, and videos by dragging in the text input, pasting, or <span class="underline cursor-pointer">clicking here</span>.</span>
        </div>
      </div>
      <div class="px-[16px] markdown-body py-[16px] bg-white" v-show="activeTab=='Preview'"  v-html="renderMarkdown(desc)"></div>
    </div>
    <div>
      <el-button type="primary" @click="create">Comment</el-button>
      <el-button @click="cancel">Cancel</el-button>
    </div>
  </div>
</template>
<script>
import CommunityTimeLine from './CommunityTimeLine.vue'
import MarkdownIt from "markdown-it";
export default {
  props: {
    discussionId: String,
  },
  components: {
    CommunityTimeLine
  },
  data() {
    return {
      activeTab:'Edit',
      desc:'',
      timelineData:[{ name:'Username',type:'change status',state:'closed',date: '2022-01-01', text: 'Event 1' },
                    { name:'Username',type:'change status',state:'open',date: '2022-02-15', text: 'Event 2' },
                    { name:'Username',type:'change title',title_from:'xxx',title_to:'xyx',date: '2022-03-10', text: 'Event 3' },]
    };
  },
  mounted() {},
  methods: {
    renderMarkdown(text) {
      const mdParser = new MarkdownIt();
      return mdParser.render(text);
    },
    create(){
      this.$emit("changeFlag",'show');
    },
    cancel(){
      this.$emit("changeFlag",'show');
    }
  },
};
</script>
