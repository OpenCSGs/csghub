<template>
  <div class="bg-white pt-[36px]">
    <div class="flex max-w-[1280px] m-auto">
      <div class="w-[752px] pr-[16px] border-r-[1px] border-[#EAECF0]">
        <a :href="backUrl" class="flex gap-[5px] text-[#475467] cursor-pointer hover-filter-primary px-[12px] py-[8px]">
          <span class="w-[20px] h-[20px]"><chevron-left /></span>
          <span class="text-[14px] font-[500] leading-[20px]">返回文章列表</span>
        </a>
        <div class="text-[48px] font-[500] leading-[60px] mt-[16px] text-[#101828]">
          {{ data.title }}
        </div>
        <div class="mt-[24px] text-[#475467] text-[20px] font-[300] leading-[30px] pb-[30px]">
          原文发布于 {{ dayjs(data.published_at).format("MM-DD") }} - {{ dayjs(data.created_at).format("MM-DD") }} 刊登于《社区文章》
        </div>
        <div class="mt-[24px] text-[30px] font-[500] leading-[38px] text-[#101828]">推荐语</div>
        <div class="mt-[20px] text-[#475467] text-[18px] font-[300] leading-[28px]">
          {{ data.recommendation }}
        </div>
        <div class="mt-[48px] text-[30px] font-[500] leading-[38px] text-[#101828]">
          摘要
        </div>
        <div class="mt-[20px] text-[#475467] text-[18px] font-[300] leading-[28px]">
          {{ data.description }}
        </div>
        <div class="my-[48px]">
          <div class="flex gap-[12px]">
            <a v-if="data.article_link" :href="data.article_link" class="flex gap-[4px] px-[14px] py-[10px] border-[1px] border-[#D0D5DD] rounded-[8px] cursor-pointer hover-filter-primary" target="_blank">
              <arrow-up-right width="20px" height="20px" />
              <span class="text-[14px] font-[500] leading-[20px]">
                查看 arXiv 页面
              </span>
            </a>
            <a v-if="data.pdf_link" :href="data.pdf_link" class="flex gap-[4px] px-[14px] py-[10px] border-[1px] border-[#D0D5DD] rounded-[8px] cursor-pointer hover-filter-primary" target="_blank">
              <arrow-up-right width="20px" height="20px" />
              <span class="text-[14px] font-[500] leading-[20px]">
                查看 PDF
              </span>
            </a>
          </div>
        </div>
      </div>
      <div class="p-[16px]">
        <div class="flex gap-[8px] items-center">
          <model-icon width="18px" height="18px"/>
          <div class="text-[16px] font-[500] leading-[24px] text-[#303133]">关联模型</div>
          <div class="text-[16px] font-[400] leading-[24px] text-[#909399]">{{ data.model_links.length }}</div>
        </div>
        <div class="flex flex-col gap-[16px]">

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import dayjs from "dayjs";
</script>
<script>
  import ChevronLeft from '../icons/ChevronLeft.vue';
  import ModelIcon from "../icons/ModelIcon.vue";

  export default {
    props: {
      dailyPaper: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        backUrl: `/daily_papers${window.location.search}`,
        data: this.dailyPaper,
        modelPage: 1,
        modelPageSize: 4,
        modelTotal: 0,
        modelList: [],
        dataSetPage: 1,
        dataSetPageSize: 4,
        dataSetTotal: 0,
        dataSetList: [],
      }
    },
    components: {
      ChevronLeft,
      ModelIcon
    },
    methods: {
      fetchModels() {
      }
    },
  }
</script>