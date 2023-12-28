<template>
  <div class="py-[96px] text-center w-full bg-white">
    <div class="max-w-[1280px] m-auto">
      <div class="flex flex-col items-center mb-[64px]">
        <div class="mb-[12px] border-[#3250BD] leading-[20px] text-[14px] text-[#223B99] border-[1.5px] rounded-[16px] py-[4px] px-[12px]">解决方案 #1</div>
        <div class="text-[36px] leading-[44px] text-[#101828]">OpenCSG EKB AI 智能企业知识库</div>
        <div class="my-[20px] max-w-[768px] text-[20px] text-[#606266] leading-[30px] font-light">EKB AI 将文档结构化并转换为数字资，实现信息数字化存储和管理，夯实企业资产的数字化转型基础。</div>
        <div class="flex gap-[16px]">
          <div class="cursor-pointer py-[8px] px-[12px] flex text-[14px] leading-[20px] text-[#344054] gap-[6px] border border-[#D0D5DD] rounded-[8px]"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><g clip-path="url(#clip0_661_4)"><path d="M9.99984 18.3337C14.6022 18.3337 18.3332 14.6027 18.3332 10.0003C18.3332 5.39795 14.6022 1.66699 9.99984 1.66699C5.39746 1.66699 1.6665 5.39795 1.6665 10.0003C1.6665 14.6027 5.39746 18.3337 9.99984 18.3337Z" stroke="#344054" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M7.9165 7.47144C7.9165 7.0737 7.9165 6.87483 7.99962 6.76381C8.07206 6.66705 8.18293 6.60652 8.30349 6.59791C8.44182 6.58803 8.60911 6.69557 8.94368 6.91065L12.8775 9.43954C13.1678 9.62618 13.313 9.71949 13.3631 9.83815C13.4069 9.94183 13.4069 10.0588 13.3631 10.1625C13.313 10.2812 13.1678 10.3745 12.8775 10.5611L8.94368 13.09C8.60911 13.3051 8.44182 13.4126 8.30349 13.4027C8.18293 13.3941 8.07206 13.3336 7.99962 13.2368C7.9165 13.1258 7.9165 12.927 7.9165 12.5292V7.47144Z" stroke="#344054" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></g><defs><clipPath id="clip0_661_4"><rect width="20" height="20" fill="white"/></clipPath></defs></svg>
            产品演示
          </div>
          <div class="cursor-pointer py-[8px] px-[12px] text-[14px] leading-[20px] text-[#FFF] bg-[#3250BD] border border-[#3250BD] rounded-[8px]">立即体验</div>
        </div>
      </div>
      <div class="flex md:flex-col gap-[64px] px-[32px] text-left">
        <div class="grow">
          <div class="max-w-[560px] cursor-pointer py-[16px] pl-[24px] border-l-[4px] border-l-[#F2F4F7] hover:border-l-[#3250BD]" v-for="item in data" :key="item.id">
            <div class="text-[#101828] text-[20px] leading-[30px]">{{item.title}}</div>
            <div class="text-[#101828] text-[16px] leading-[24px] font-light">{{item.desc}}</div>
          </div>
        </div>
        <div class="grow">
          <div class="bg-[#DADCDF] w-[592px] h-[528px] md:w-full">demo</div>
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
      data:[{id:"1",title:"基于企业知识、文档和数据资产的大模型知识管理平台 ",desc:"我们的平台旨在全面管理您企业的知识、文档和数据资产，为您提供一个综合性的管理解决方案。"},
            {id:"2",title:"全知全能无处不在的 AI 助理",desc:"我们强大而智能的 AI 助理就像您的随身专家助手，随时随地为您提供所需的帮助和支持。"},
            {id:"3",title:"助力企业资产数字化转型",desc:"我们致力于协助企业顺利进行资产的数字化转型，提高效率和竞争力。"},
            {id:"4",title:"智能 AI 文档+数据分析，增效减员提速",desc:"运用智能 AI 文档和数据分析功能，我们帮助您实现更高效的工作流程，同时减少人力成本。"},
            {id:"5",title:"金融级私有化加密部署，保证企业私有数据安全",desc:"我们采用金融级私有化加密部署技术，确保您企业的私有数据始终得到最高级别的安全保护，防止泄密风险。"}]
    };
  },

  components: {},

  mounted() {},
};
</script>
