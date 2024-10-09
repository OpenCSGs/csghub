<template>
  <div>
    <div class="timeline-item flex flex-col gap-[10px] px-[12px]" :class="['timeline-item', {'first-item': index === 0}]" v-for="(item,index) in thetimelineData" :key="item.date">
      <div class="timeline-line"></div>
      <div class="flex gap-[10px] items-center" v-if="item.type!='desc'">
        <span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path opacity="0.12" d="M6 8.80033C6 8.05359 6 7.68022 6.14532 7.395C6.27316 7.14412 6.47713 6.94015 6.72801 6.81232C7.01323 6.66699 7.3866 6.66699 8.13333 6.66699H12.5333C13.2801 6.66699 13.6534 6.66699 13.9387 6.81232C14.1895 6.94015 14.3935 7.14412 14.5213 7.395C14.6667 7.68022 14.6667 8.05359 14.6667 8.80033V13.5761C14.6667 14.2383 13.8735 14.5783 13.3939 14.1215C12.9271 13.6769 12.3071 13.4289 11.6623 13.4289H8.13333C7.3866 13.4289 7.01323 13.4289 6.72801 13.2836C6.47713 13.1557 6.27316 12.9518 6.14532 12.7009C6 12.4157 6 12.0423 6 11.2956V8.80033Z" fill="#E6A23C"/><path d="M6.00016 9.33301H4.8335C4.66873 9.33301 4.58635 9.33301 4.50613 9.33947C4.18385 9.36545 3.87268 9.46918 3.59927 9.64176C3.53121 9.68472 3.46531 9.73415 3.3335 9.83301V9.83301C2.99254 10.0887 2.82207 10.2166 2.69205 10.2665C2.14338 10.4773 1.53217 10.1716 1.37156 9.60627C1.3335 9.47229 1.3335 9.2592 1.3335 8.83301V4.53301C1.3335 3.4129 1.3335 2.85285 1.55148 2.42503C1.74323 2.0487 2.04919 1.74274 2.42552 1.55099C2.85334 1.33301 3.41339 1.33301 4.5335 1.33301H8.80016C9.92027 1.33301 10.4803 1.33301 10.9081 1.55099C11.2845 1.74274 11.5904 2.0487 11.7822 2.42503C12.0002 2.85285 12.0002 3.4129 12.0002 4.53301V4.66634V4.99967M13.3941 14.1209V14.1209C13.8737 14.5776 14.6668 14.2377 14.6668 13.5754V8.79967C14.6668 8.05294 14.6668 7.67957 14.5215 7.39435C14.3937 7.14347 14.1897 6.9395 13.9388 6.81167C13.6536 6.66634 13.2802 6.66634 12.5335 6.66634H8.1335C7.38676 6.66634 7.01339 6.66634 6.72818 6.81167C6.47729 6.9395 6.27332 7.14347 6.14549 7.39435C6.00016 7.67957 6.00016 8.05294 6.00016 8.79968V11.2949C6.00016 12.0416 6.00016 12.415 6.14549 12.7002C6.27332 12.9511 6.47729 13.1551 6.72818 13.2829C7.01339 13.4282 7.38676 13.4282 8.13349 13.4282H11.6625C12.3072 13.4282 12.9272 13.6763 13.3941 14.1209Z" stroke="#E6A23C" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
        <span>{{item.name}}</span>
        <span>{{item.type=='change status'?'changed discussion status to '+ item.state:item.type=='change title'?'changed discussion title from '+ item.title_from +' to ' + item.title_to:''}}</span>
        <span>{{formatDate(item.date,'zh_CN')}}</span>
      </div>
      <div v-else class="border border-gray-200 border-b-[2px] rounded-[4px]">
        <div class="flex justify-between gap-[4px] border-b border-gray-200 items-center px-[12px] py-[9px] bg-gray-100">
          <div class="flex items-center gap-[8px]">
            <el-avatar :size="24" :src="avatar"></el-avatar>
            Username {{formatDate(item.date,'zh_CN')}}
          </div>
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M7.66667 4.66634C8.58333 4.66634 9.33333 3.91634 9.33333 2.99967C9.33333 2.08301 8.58333 1.33301 7.66667 1.33301C6.75 1.33301 6 2.08301 6 2.99967C6 3.91634 6.75 4.66634 7.66667 4.66634Z" fill="#606266"/><path d="M7.66667 6.33301C6.75 6.33301 6 7.08301 6 7.99967C6 8.91634 6.75 9.66634 7.66667 9.66634C8.58333 9.66634 9.33333 8.91634 9.33333 7.99967C9.33333 7.08301 8.58333 6.33301 7.66667 6.33301Z" fill="#606266"/><path d="M6 12.9997C6 12.083 6.75 11.333 7.66667 11.333C8.58333 11.333 9.33333 12.083 9.33333 12.9997C9.33333 13.9163 8.58333 14.6663 7.66667 14.6663C6.75 14.6663 6 13.9163 6 12.9997Z" fill="#606266"/></svg>
          </div>
        </div>
        <div class="px-[12px] py-[12px] markdown-body"  v-html="renderMarkdown(item.desc)"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import MarkdownIt from "markdown-it"
  import { format } from 'timeago.js'
  export default {
    props: {
      timelineData:Array
    },
    components: {},
    data() {
      return {
        thetimelineData:this.timelineData
      }
    },
    mounted() {},
    methods: {
      renderMarkdown(text) {
        const mdParser = new MarkdownIt()
        return mdParser.render(text)
      },
      formatDate(date){
        return format(date, 'zh_CN')
      }
    },
  }
</script>

<style>
  .timeline-line{
    margin:10px 12px 0;
    height:8px;
    width:1px;
    background:#DCDFE6;
  }
  .timeline-item.first-item .timeline-line {
    display:none
  }
</style>