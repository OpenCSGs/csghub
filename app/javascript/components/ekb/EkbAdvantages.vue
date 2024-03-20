<template>
  <div class="w-full bg-white">
    <div class="max-w-[1280px] m-auto py-[96px] px-[20px]">
      <div class="text-[#223B99] text-[16px] leading-[24px] mb-[10px]">
        {{ $t("ekb.adv") }}
      </div>
      <div class="text-[36px] leading-[44px] text-[#101828] mb-[20px]">
        {{ $t("ekb.advTitle") }}
      </div>
      <div
        class="max-w-[768px] text-[20px] text-[#475467] leading-[30px] font-light mb-[64px]"
      >
      {{ $t("ekb.advText") }}
      </div>
      <div class="flex gap-[24px] mlg:flex-col">
        <div
          class="flex flex-col gap-[20px] justify-between px-[24px] rounded-[8px] flex-1 py-[24px] bg-[#F9FAFB]"
          v-for="item in data"
          :key="item.id"
        >
          <div class="flex flex-col gap-[8px]">
            <div
              class="h-[48x] w-[48px] bg-[#3250BD] px-[12px] py-[12px] rounded-[10px] mb-[64px] md:mb-[20px]"
            >
              <img :src="item.icon" />
            </div>
            <div class="text-[#101828] text-[20px] leading-[30px]">
              {{ this.$i18n.locale === "zh" ? item.title : item.title_en }}
            </div>
            <div class="text-[#101828] text-[16px] leading-[24px] font-light">
              {{ this.$i18n.locale === "zh" ? item.desc : item.desc_en }}
            </div>
          </div>
          <div @click="goEKB()" class="text-[#223B99] text-[16px] leading-[24px] cursor-pointer">{{ $t('solution.knowledge.demo')}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {},

  data() {
    return {
      data: [
        {
          id: "1",
          icon: "/images/ekb/icon/book-open.svg",
          title: "大模型知识管理基座",
          title_en: "Comprehensive Enterprise Knowledge Management Platform",
          desc: "强大的企业知识、文档和数据资产的管理平台，全面管理企业知识库并提供一站式信息查询及解决方案。借助于与LLM结合的先进算法，可以理解和组织大量非结构化数据。",
          desc_en:
            "A powerful platform for managing enterprise knowledge, documents, and data assets. It comprehensively manages the enterprise knowledge base and provides a one-stop information inquiry and solution. With advanced algorithms combined with LLM, it can understand and organize large amounts of unstructured data.",
        },
        {
          id: "2",
          icon: "/images/ekb/icon/message-smile-square.svg",
          title: "无所不知的 AI 专家",
          title_en: "Omniscient AI Assistant",
          desc: "功能强大且智能的AI助理，如同一个随身的专家助手，能够理解用户的查询请求，随时提供信息，简化同步过程。是用户与企业知识库的桥梁，通过自然交互，便捷获取关键信息。",
          desc_en:
            "A powerful and intelligent AI assistant, like a portable expert assistant, able to understand user queries and provide information at any time, simplifying the synchronization process. It serves as a bridge between the user and the enterprise knowledge base, providing convenient access to key information through natural interaction.",
        },
        {
          id: "3",
          icon: "/images/ekb/icon/package.svg",
          title: "灵活的部署选项",
          title_en: "Flexible Deployment Options",
          desc: "支持多种部署方式，包括在线SaaS、私有云和公有云，也可完全私有化。结合OpenCSG一体机解决方案，可在客户自选兼容硬件上部署，大幅降低客户的使用成本。",
          desc_en:
            "Supporting multiple deployment options, including online SaaS, private cloud, public cloud, and full privatization. Combined with the OpenCSG integrated solution, it can be deployed on customer-selected compatible hardware, significantly reducing customer usage costs.",
        },
        {
          id: "4",
          icon: "/images/ekb/icon/chart-breakout-square.svg",
          title: "智能 AI 文档与数据分析",
          title_en: "Intelligent AI Document and Data Analysis",
          desc: "智能 AI 文档和高效数据分析模型，快速解决企业问题，用于智能客服和报表分析等领域。进行数据挖掘和模式分析，输出易于理解的报告，并提供数据可视化功能。",
          desc_en:
            "Intelligent AI document and efficient data analysis models, quickly resolving enterprise issues for intelligent customer service and report analysis. Conducting data mining and pattern analysis, producing easy-to-understand reports, and providing data visualization capabilities.",
        },
      ],
    };
  },

  components: {},

  mounted() {},
  methods: {
    goEKB(){
      window.open('https://ekb.opencsg.com/', '_blank'); 
    }
  },
};
</script>
