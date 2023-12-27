<template>
  <div class="bg-white mt-auto">
    <div class="flex justify-center items-center flex-col text-[#303133] bg-white">
      <div class="flex max-w-[914px] py-[60px] gap-x-[120px] justify-center md:gap-x-[20px] pb-[30px]">
        <div class="flex gap-x-[100px]">
          <div class="md:hidden">
            <img :src="footLogo" class="w-[103px] h-[120px]" alt="OpenCSG Logo"/>
          </div>
          <div class="flex flex-none items-start flex-col gap-[16px] mr-[20px]">
            <p class="text-[16px] leading-[24px] font-semibold">关于我们</p>
            <div class="text-[14px] leading-[20px] flex flex-col gap-y-[8px]">
              <p><a href="https://opencsg.com" class="no-underline text-[#303133]" target="_blank">公司介绍</a></p>
              <p><a href="https://opencsg.com/blog" class="no-underline text-[#303133]" target="_blank">新闻动态</a></p>
              <p><a href="https://opencsg.com" class="no-underline text-[#303133]" target="_blank">加入我们</a></p>
            </div>
          </div>
        </div>
        <div class="flex gap-x-[100px]">
          <div class="flex flex-none items-start flex-col gap-y-[16px] mr-[20px]">
            <p class="text-[16px] leading-[24px] font-semibold">联系我们</p>
            <div class="flex text-[14px] leading-[20px] flex-col gap-y-[8px]">
              <p>商务合作：partner@opencsg.com</p>
              <p>简历投递：hr@opencsg.com</p>
              <p>媒体合作：pr@opencsg.com</p>
              <p>投资关系：ir@opencsg.com</p>
            </div>
          </div>
          <div class="md:hidden">
            <img :src="footCode" class="mt-[8px] font-medium text-[14px] align-center w-[103px] h-[103px]" alt="OpenCSG code"/>
            <p class="mt-[8px] font-medium text-[14px] text-center">微信公众号</p>
          </div>
        </div>
      </div>
      <div class="pb-[40px] hidden md:block">
        <img :src="footCode" class="w-[120px] h-[120px]" alt="OpenCSG code"/>
        <p class="mt-[8px] font-medium text-[14px] text-center">微信公众号</p>
      </div>
      <div class="py-[16px] text-[12px] leading-[16px] flex justify-center items-center w-full border border-[#e5e7eb] md:flex-col">
        <div class="flex gap-x-[6px] mx-[5px] mb-[5px]">
          <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none">
            <g clip-path="url(#clip0_9_14638)">
              <path d="M4.92677 7.8571L7.7286 10.6589L5.32493 13.0626L0.759148 8.49681C0.413879 8.15154 0.413579 7.59184 0.758477 7.2462L6.99128 1H11.7839L4.92677 7.8571Z"
                    fill="#0096E0"/>
              <path d="M12.0732 7.85726L9.2714 5.05544L11.6751 2.65176L16.2409 7.21755C16.5861 7.56281 16.5864 8.12251 16.2415 8.46815L10.0087 14.7144H5.21613L12.0732 7.85726Z"
                    fill="#D6000F"/>
            </g>
            <defs>
              <clipPath id="clip0_9_14638">
                <rect class="h-4 w-4" fill="white" transform="translate(0.5)"/>
              </clipPath>
            </defs>
          </svg>
          <p><a href="https://12377.cn/" target="_blank"> 违法和不良信息举报中心</a></p>
        </div>
        <div class="flex gap-x-[6px] mx-[5px] mb-[5px]">
          <p class="md:hidden">｜</p>
          <img :src="emblemLogo" width="16" height="16" alt="">
          <p><a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=11011202004415" target="_blank"> 京公网安备11011202004415号</a></p>
        </div>
        <div class="flex gap-x-[6px] mx-[5px] mb-[5px]">
          <p class="md:hidden">｜</p>
          <p><a href="https://beian.miit.gov.cn/#/Integrated/index" target="_blank"> 京ICP备2023006263号-1</a></p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    footCode: String,
    footLogo: String,
    emblemLogo: String
  },
  data() {
    return {}
  },
  mounted() {
  }
}
</script>

