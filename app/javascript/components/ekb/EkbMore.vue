<template>
  <div class="w-full bg-white">
    <div class="max-w-[1280px] m-auto py-[96px] px-[20px]">
      <div class="text-[#223B99] text-[16px] leading-[24px] mb-[10px]">
        {{ $t("ekb.moreP") }}
      </div>
      <div class="text-[36px] leading-[44px] text-[#101828] mb-[20px]">
        {{ $t("ekb.morePTitle") }}
      </div>
      <div
        class="max-w-[768px] text-[20px] text-[#475467] leading-[30px] font-light mb-[64px]"
      >
      {{ $t("ekb.morePText") }}
      </div>
      <div class="flex mlg:flex-col gap-[64px] items-center text-left">
        <div class="grow">
          <div
            class="max-w-[560px] cursor-pointer py-[16px] pl-[24px] border-l-[4px] border-l-[#F2F4F7] hover:border-l-[#3250BD]"
            v-for="item in data"
            :key="item.id"
          >
            <div class="text-[#101828] text-[20px] leading-[30px]">
              {{ this.$i18n.locale === "zh" ? item.title : item.title_en }}
            </div>
            <div class="text-[#101828] text-[16px] leading-[24px] font-light">
              {{ this.$i18n.locale === "zh" ? item.desc : item.desc_en }}
            </div>
          </div>
        </div>
        <div class="grow flex items-center">
          <div class="w-[592px] md:w-full">
            <img class="w-full" src="/images/ekb/Mockupwrap.png" />
          </div>
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
          title: "多模态、多语言 全方位汇总输出",
          title_en:
            "Comprehensive Multi-Modal, Multilingual Integration and Output",
          desc: "系统支持多种格式，包括PDF、Word、Excel以及在线网页链接，极大便利了企业资料归集与整理。",
          desc_en:
            "The system supports various formats, including PDF, Word, Excel, and online web links, greatly facilitating the collection and organization of enterprise information.",
        },
        {
          id: "2",
          title: "智能文档识别与精确搜索",
          title_en: "Intelligent Document Recognition and Accurate Search",
          desc: "利用自动识别技术及OCR高精度提取，有效辨识不同格式文档并准确进行内容检索。",
          desc_en:
            "Utilizing automatic recognition technology and OCR for high-precision extraction, effectively identifying documents in different formats and accurately conducting content retrieval.",
        },
        {
          id: "3",
          title: "创建 API 接口支持",
          title_en: "Establishing API Interface Support",
          desc: "提供多AI模型选择，轻松对接钉钉、微信等第三方平台。",
          desc_en:
            "Providing a selection of multiple AI models for easy integration with third-party platforms such as DingTalk and WeChat.",
        },
        {
          id: "4",
          title: "问答机器人一键部署",
          title_en: "One-Click Deployment of Q&A Chatbots",
          desc: "支持用户快速设置智能客服、聊天机器人等，提升服务效率。",
          desc_en:
            "By utilizing intelligent AI documentation and data analysis capabilities, we help you achieve more efficient workflows while reducing labor costs.",
        },
      ],
    };
  },

  components: {},

  mounted() {},
};
</script>
