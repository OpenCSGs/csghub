<template>
  <div class="StarShip py-[96px] md:py-[16px] text-center w-full">
    <div class="max-w-[1280px] m-auto">
      <div class="flex flex-col items-center mlg:px-[20px] mb-[64px]">
        <div class="mb-[12px] border-[#3250BD] leading-[20px] text-[14px] text-[#223B99] border-[1.5px] rounded-[16px] py-[4px] px-[12px]">{{ $t('product.starShip.product2') }}</div>
        <div class="text-[36px] leading-[44px] text-[#101828]">{{ $t('product.starShip.headline') }}</div>
        <div class="my-[20px] max-w-[768px] text-[20px] text-[#606266] leading-[30px] text-left font-light text-center">{{ $t('product.starShip.desc') }}</div>
        <div class="flex gap-[16px] mb-[16px] product">
          <div @click="openDialog" class="cursor-pointer py-[12px] px-[18px] flex text-[14px] leading-[20px] text-[#344054] gap-[6px] border border-[#D0D5DD] rounded-[8px]"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><g clip-path="url(#clip0_661_4)"><path d="M9.99984 18.3337C14.6022 18.3337 18.3332 14.6027 18.3332 10.0003C18.3332 5.39795 14.6022 1.66699 9.99984 1.66699C5.39746 1.66699 1.6665 5.39795 1.6665 10.0003C1.6665 14.6027 5.39746 18.3337 9.99984 18.3337Z" stroke="#344054" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M7.9165 7.47144C7.9165 7.0737 7.9165 6.87483 7.99962 6.76381C8.07206 6.66705 8.18293 6.60652 8.30349 6.59791C8.44182 6.58803 8.60911 6.69557 8.94368 6.91065L12.8775 9.43954C13.1678 9.62618 13.313 9.71949 13.3631 9.83815C13.4069 9.94183 13.4069 10.0588 13.3631 10.1625C13.313 10.2812 13.1678 10.3745 12.8775 10.5611L8.94368 13.09C8.60911 13.3051 8.44182 13.4126 8.30349 13.4027C8.18293 13.3941 8.07206 13.3336 7.99962 13.2368C7.9165 13.1258 7.9165 12.927 7.9165 12.5292V7.47144Z" stroke="#344054" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></g><defs><clipPath id="clip0_661_4"><rect width="20" height="20" fill="white"/></clipPath></defs></svg>
            {{ $t('product.starShip.demo') }}
          </div>
          <VideoDialog ref="videoDialogRef" :videoSrc="videoSrc" />
        </div>
        <div class="w-[768px] mlg:w-full mt-[16px] rounded-[10px] border-[4px] border-[#101828]">
          <el-image src="/images/product/demo.png" :preview-src-list="['/images/product/demo.png']" />
        </div>
        <div class="flex md:flex-col md:gap-[16px] mt-[80px] text-left">
            <div class="max-w-[405px] cursor-pointer pt-[24px] px-[16px] border-t-[4px] border-t-[#F2F4F7] hover:border-t-[#3250BD]" v-for="item in data" :key="item.id">
              <div class="text-[#101828] text-[20px] leading-[30px] text-center">{{ this.$i18n.locale === 'zh' ? item.title: item.title_en }}</div>
              <div class="text-[#475467] text-[16px] leading-[24px] font-light pt-[8px] font-light break-normal">{{ this.$i18n.locale === 'zh' ? item.desc: item.desc_en }}</div>
            </div>
          </div>
      </div>
    </div>
  </div>
</template>
<script>
import VideoDialog from "../dialog/VideoDialog.vue"
export default {
  props: {},
  data() {
    return {
      videoSrc:'https://opencsg-public-resource.oss-accelerate.aliyuncs.com/video/starship.mp4',
      data:[
        {
          id:"1",
          title:"开启您的LLM大模型社区构建之旅",
          title_en:"Embark on a journey to build your LLM big model community",
          desc:"利用OpenCSG CaaS（Community as a Service），您可以快速、轻松地构建大模型社区。共同推动LLM应用的创新，立即开启您的LLM社区构建之旅！",
          desc_en:"With OpenCSG CaaS (Community as a Service), you can quickly and easily build a large model community. Jointly promote innovation in LLM applications and start your journey of building your LLM community now!"
          },
        {
          id:"2",
          title:"开放共建的AI生态",
          title_en:"An open and collaborative AI ecosystem",
          desc:"我们相信通过合作，可以共同推动LLM应用的发展和创新。使用100%核心开源的工具，您可根据自身需求定制和扩展平台功能。构建社区，共同打造一个繁荣的AI生态系统！",
          desc_en:"We believe that through cooperation, we can jointly promote the development and innovation of LLM applications. By using 100% core open source tools, you can customize and expand platform features according to your own needs. Build a community and work together to create a prosperous AI ecosystem!"
        },
        {
          id:"3",
          title:"生产级可用的LLM应用服务",
          title_en:"Production level available LLM application services",
          desc:"作为设计为生产级可用的工具，无论是部署到企业内部使用，还是通过社区分享给其他用户，都能得到稳定和可靠的服务。选择OpenCSG CaaS，让您的应用始终保持高效和可靠！",
          desc_en:"As a tool designed for production level usability, stable and reliable services can be obtained whether deployed for internal use within the enterprise or shared with other users through the community. Choose OpenCSG CaaS to keep your application efficient and reliable at all times!"
        }
    ]
    };
  },

  components: {
    VideoDialog
  },
  computed: {},
  mounted() {},
  methods: {
    openDialog() {
      this.$refs.videoDialogRef.openDialog();
    }
  }
};
</script>
