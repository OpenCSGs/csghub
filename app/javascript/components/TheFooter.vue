<template>
  <div class="flex justify-center items-center flex-col text-[#303133]" style="background: #FFFFFF">
    <div class="px-64 py-4 flex justify-center items-center max-w-[1280px]">
      <div class="flex justify-between items-center px-4">
        <div class="my-2">
          <img :src="footLogo" class="w-[103px] h-[120px]" alt="OpenCSG Logo"/>
        </div>
        <div class="flex flex-none ml-[100px] items-start flex-col gap-y-4">
          <p class="text-base font-semibold">关于我们</p>
          <div class="flex text-sm font-normal items-start flex-col gap-y-2">
            <p>公司介绍</p>
            <p>新闻动态</p>
            <p>文档中心</p>
            <p>加入我们</p>
          </div>
        </div>
        <div class="flex flex-none ml-[120px] items-start flex-col gap-y-4">
          <p class="text-base font-semibold">联系我们</p>
          <div class="flex text-sm font-normal items-start flex-col gap-y-2 ">
            <p>商务合作：Partner@opencsg.com</p>
            <p>简历投递：hr@opencsg.com</p>
            <p>媒体合作：pr@opencsg.com</p>
            <p>投资关系：ir@opencsg.com</p>
          </div>
        </div>
        <div class="ml-[100px] px-2 py-2 my-2 rounded-lg">
          <img :src="footCode" height=103 width=103 alt="OpenCSG Logo"/>
        </div>
      </div>
    </div>

    <div class="px-64 py-4 flex justify-center items-center text-xs font-normal gap-x-1.5 border-t w-full">
      <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none" class="flex-none grid grid-rows-2">
        <g clip-path="url(#clip0_9_14638)">
          <path
              d="M4.92677 7.8571L7.7286 10.6589L5.32493 13.0626L0.759148 8.49681C0.413879 8.15154 0.413579 7.59184 0.758477 7.2462L6.99128 1H11.7839L4.92677 7.8571Z"
              fill="#0096E0"/>
          <path
              d="M12.0732 7.85726L9.2714 5.05544L11.6751 2.65176L16.2409 7.21755C16.5861 7.56281 16.5864 8.12251 16.2415 8.46815L10.0087 14.7144H5.21613L12.0732 7.85726Z"
              fill="#D6000F"/>
        </g>
        <defs>
          <clipPath id="clip0_9_14638">
            <rect width="16" height="16" fill="white" transform="translate(0.5)"/>
          </clipPath>
        </defs>
      </svg>
        <dic class="grid grid-cols-2 lg:grid-cols-1 flex-none auto-cols-auto">
          <p >违法和不良信</p>
          <p >息举报中心</p>
        </dic>
      <p>｜</p>
      <img :src="emblemLogo" height=16 width=16 alt="OpenCSG Logo" class="flex-none"/>
      <p class="flex-none"> 京公网安备11010502047940号</p>
      <p>｜</p>
      <div class="grid grid-cols-2 lg:grid-cols-1 flex-none auto-rows-min">
      <p> 京ICP备2021</p>
        <p>036779号-1</p>
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
      return { }
    },
    mounted() {
    }
  }
</script>