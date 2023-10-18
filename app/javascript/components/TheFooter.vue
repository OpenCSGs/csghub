<template>
  <div class="flex justify-center items-center flex-col text-[#303133] bg-white">
    <div class="max-w-[914px] py-[60px] flex gap-x-[120px] sm:gap-x-[10px] justify-center items-center">
      <div class="flex gap-x-[100px]">
        <div class="my-2 justify-center items-center mlg:hidden">
          <img :src="footLogo" class="w-[103px] h-[120px]" alt="OpenCSG Logo"/>
        </div>
        <div class="flex flex-none items-start flex-col gap-y-4 mr-[20px]">
          <p class="text-base font-semibold">关于我们</p>
          <div class="flex text-sm sm:text-[12px] font-normal items-start flex-col gap-y-2">
            <p><a href="https://opencsg.com" target="_blank">公司介绍</a></p>
            <p><a href="https://opencsg.com/blog" target="_blank">新闻动态</a></p>
            <p><a href="https://opencsg.com" target="_blank">加入我们</a></p>
          </div>
        </div>
      </div>
      <div class="flex gap-x-[100px] mt-[5px]">
        <div class="flex flex-none items-start flex-col gap-y-4">
          <p class="text-base font-semibold">联系我们</p>
          <div class="flex text-sm sm:text-[12px] font-normal items-start flex-col gap-y-2 ">
            <p>商务合作：partner@opencsg.com</p>
            <p>简历投递：hr@opencsg.com</p>
            <p>媒体合作：pr@opencsg.com</p>
            <p>投资关系：ir@opencsg.com</p>
          </div>
        </div>
        <div class="my-2 rounded-lg mlg:w-full mlg:hidden text-center text-sm font-medium">
          <img :src="footCode" height=100 width=100 alt="OpenCSG Logo"/>
          <p class="mt-[8px]">微信公众号</p>
        </div>
      </div>
    </div>

    <div class="py-4 flex justify-center items-center text-xs font-normal border-t w-full sm:text-[10px] sm:flex-col">
      <div class="flex gap-x-1.5 mx-[5px] mb-[5px]">
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
        <p> 违法和不良信息举报中心</p>
      </div>
      <div class="flex gap-x-1.5 mx-[5px] mb-[5px]">
        <p class="lg:hidden">｜</p>
        <img :src="emblemLogo" class="h-4 w-4" alt="OpenCSG Logo"/>
        <p> 京公网安备11010502047940号</p>
      </div>
      <div class="flex gap-x-1.5 mx-[5px] mb-[5px]">
        <p class="lg:hidden">｜</p>
        <p> 京ICP备2021036779号-1</p>
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
