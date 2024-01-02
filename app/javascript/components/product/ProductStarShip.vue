<template>
  <div class="py-[96px] md:py-[16px] text-center w-full">
    <div class="max-w-[1280px] m-auto">
      <div class="flex flex-col items-center mlg:px-[20px] mb-[64px]">
        <div class="mb-[12px] border-[#3250BD] leading-[20px] text-[14px] text-[#223B99] border-[1.5px] rounded-[16px] py-[4px] px-[12px]">产品 #2</div>
        <div class="text-[36px] leading-[44px] text-[#101828]">OpenCSG StarShip 星舰平台</div>
        <div class="my-[20px] max-w-[768px] text-[20px] text-[#606266] leading-[30px] text-left font-light text-center">StarShip 致力于为大模型应用开发团队提供一套完整的模型/数据管理及应用搭建平台，利用大模型技术打造软件工程2.0的新体验</div>
        <div class="flex gap-[16px] mb-[16px] product">
          <div @click="openDialog" class="cursor-pointer py-[12px] px-[18px] flex text-[14px] leading-[20px] text-[#344054] gap-[6px] border border-[#D0D5DD] rounded-[8px]"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><g clip-path="url(#clip0_661_4)"><path d="M9.99984 18.3337C14.6022 18.3337 18.3332 14.6027 18.3332 10.0003C18.3332 5.39795 14.6022 1.66699 9.99984 1.66699C5.39746 1.66699 1.6665 5.39795 1.6665 10.0003C1.6665 14.6027 5.39746 18.3337 9.99984 18.3337Z" stroke="#344054" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M7.9165 7.47144C7.9165 7.0737 7.9165 6.87483 7.99962 6.76381C8.07206 6.66705 8.18293 6.60652 8.30349 6.59791C8.44182 6.58803 8.60911 6.69557 8.94368 6.91065L12.8775 9.43954C13.1678 9.62618 13.313 9.71949 13.3631 9.83815C13.4069 9.94183 13.4069 10.0588 13.3631 10.1625C13.313 10.2812 13.1678 10.3745 12.8775 10.5611L8.94368 13.09C8.60911 13.3051 8.44182 13.4126 8.30349 13.4027C8.18293 13.3941 8.07206 13.3336 7.99962 13.2368C7.9165 13.1258 7.9165 12.927 7.9165 12.5292V7.47144Z" stroke="#344054" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></g><defs><clipPath id="clip0_661_4"><rect width="20" height="20" fill="white"/></clipPath></defs></svg>
            产品演示
          </div>
          <el-dialog v-model="dialogVisible"
                     @close="closeDialog"
                     :width="dialogWidth"
                     :style="{ borderRadius: '5px' }">
            <video ref="videoPlayer" style="width: 100%;" controls autoplay muted>
              <source :src="videoSrc" type="video/mp4" />
            </video>
          </el-dialog>
        </div>
        <div class="w-[768px] mlg:w-full mt-[16px] rounded-[10px] border-[4px] border-[#101828]">
          <el-image src="/images/product/demo.png" :fit="fit" :preview-src-list="['/images/product/demo.png']" />
        </div>
        <div class="flex md:flex-col md:gap-[16px] mt-[80px] text-left">
            <div class="max-w-[405px] cursor-pointer pt-[24px] px-[16px] border-t-[4px] border-t-[#F2F4F7] hover:border-t-[#3250BD]" v-for="item in data" :key="item.id">
              <div class="text-[#101828] text-[20px] leading-[30px] text-center">{{item.title}}</div>
              <div class="text-[#475467] text-[16px] leading-[24px] font-light pt-[8px] font-light break-normal">{{item.desc}}</div>
            </div>
          </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {

  },

  data() {
    return {
      videoSrc:'https://opencsg-public-resource.oss-accelerate.aliyuncs.com/video/starship.mp4',
      dialogVisible: false,
      data:[{id:"1",title:"开启您的LLM大模型社区构建之旅",desc:"利用OpenCSG CaaS（Community as a Service），您可以快速、轻松地构建大模型社区。共同推动LLM应用的创新，立即开启您的LLM社区构建之旅！"},
        {id:"2",title:"开放共建的AI生态",desc:"我们相信通过合作，可以共同推动LLM应用的发展和创新。使用100%核心开源的工具，您可根据自身需求定制和扩展平台功能。构建社区，共同打造一个繁荣的AI生态系统！"},
        {id:"3",title:"生产级可用的LLM应用服务",desc:"作为设计为生产级可用的工具，无论是部署到企业内部使用，还是通过社区分享给其他用户，都能得到稳定和可靠的服务。选择OpenCSG CaaS，让您的应用始终保持高效和可靠！"}]
    };
  },

  components: {},
  computed: {
    dialogWidth() {
      if (window.innerWidth < 768) {
        return '90%';
      } else {
        return '50%';
      }
    }
  },
  mounted() {},
  methods: {
    openDialog() {
      this.dialogVisible = true;
    },
    closeDialog() {
      this.$refs.videoPlayer.pause();
      this.dialogVisible = false;
    }
  }
};
</script>
<style>
  .product {
    .el-dialog__header {
     display: none;
    }
    .el-dialog__body {
      padding: 10px !important;
    }
  }
</style>
