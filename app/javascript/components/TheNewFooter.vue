<template>
  <div class="py-4 flex gap-[16px] justify-center items-center text-xs font-normal border-t w-full sm:text-[10px] xl:flex-col bg-white sm:hidden">
    <div class="flex items-center gap-[16px] mr-40 text-[14px] text-[#475467] cursor-pointer xl:mr-0 sm:flex-col sm:gap-[4px] sm:mr-0">
      <a href="https://opencsg.com" target="_blank">关于我们</a>
      <a href="https://opencsg.com/blog" target="_blank">新闻动态</a>
      <a href="https://portal.opencsg.com/docs" target="_blank">文档中心</a>
      <a href="https://opencsg.com" target="_blank">加入我们</a>
      <a @click="showDialog" target="_blank">联系我们</a>
      <a href="#" target="_blank">法律声明及隐私权政策</a>
    </div>
    <div class="flex items-center sm:flex-col lg:mt-[4px] lg:ml-[8px]">
      <div class="flex gap-x-1.5 mx-[5px]">
        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none">
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
              <rect class="h-4 w-4" fill="white" transform="translate(0.5)"/>
            </clipPath>
          </defs>
        </svg>
        <p><a href="https://12377.cn/" target="_blank">违法和不良信息举报中心</a></p>
      </div>
      <div class="flex gap-x-1.5 mx-[5px]">
        <p class="lg:hidden">｜</p>
        <img :src="emblemLogo" class="h-4 w-4" alt="OpenCSG Logo"/>
        <p><a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=11011202004415">
          京公网安备11011202004415号 </a></p>
      </div>
      <div class="flex gap-x-1.5 mx-[5px]">
        <p class="lg:hidden">｜</p>
        <p><a href="https://beian.miit.gov.cn/#/Integrated/index" target="_blank"> 京ICP备2023006263号-1 </a></p>
      </div>
    </div>
  </div>
  <div class="hidden sm:block p-[24px]">
    <div class="flex gap-[40px]">
      <div class="flex flex-none items-start flex-col gap-y-4 mr-[20px]">
        <p class="text-base font-semibold">关于我们</p>
        <div class="flex text-sm sm:text-[12px] font-normal items-start flex-col gap-y-2">
          <p><a href="https://opencsg.com" target="_blank">公司介绍</a></p>
          <p><a href="https://opencsg.com/blog" target="_blank">新闻动态</a></p>
          <p><a href="https://portal.opencsg.com/docs" target="_blank">文档中心</a></p>
          <p><a href="https://opencsg.com" target="_blank">加入我们</a></p>
        </div>
      </div>
      <div class="flex gap-x-[100px] mt-[5px] mlg:mt-0">
        <div class="flex flex-none items-start flex-col gap-y-4">
          <p class="text-base font-semibold">联系我们</p>
          <div class="flex text-sm sm:text-[12px] font-normal items-start flex-col gap-y-2 ">
            <p>商务合作：partner@opencsg.com</p>
            <p>简历投递：hr@opencsg.com</p>
            <p>媒体合作：pr@opencsg.com</p>
            <p>投资关系：ir@opencsg.com</p>
          </div>
        </div>
      </div>
    </div>
    <div class="border-t mt-[30px] mb-[4px] font-normal"></div>
    <div class="flex flex-col gap-[12px]">
      <div class="flex gap-[24px] text-[14px] font-normal">
        <p>法律声明及隐私权政策</p>
        <p>Cookies政策</p>
      </div>
      <div class="text-[14px] text-[#909399] font-normal">©2023 OpenCSG.com版权所有</div>
      <div class="flex flex-col gap-[4px] text-[12px] text-[#666666] font-normal">
        <div class="flex gap-x-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none">
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
                <rect class="h-4 w-4" fill="white" transform="translate(0.5)"/>
              </clipPath>
            </defs>
          </svg>
          <p><a href="https://12377.cn/" target="_blank">违法和不良信息举报中心</a></p>
        </div>
        <div class="flex gap-x-1.5">
          <img :src="emblemLogo" class="h-4 w-4" alt="OpenCSG Logo"/>
          <p><a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=11011202004415">
            京公网安备11011202004415号 </a></p>
        </div>
        <p class="text-[12px]"><a href="https://beian.miit.gov.cn/#/Integrated/index" target="_blank"> 京ICP备2023006263号-1 </a></p>
      </div>
    </div>
  </div>
  <ContactUs ref='child' />
</template>

<script>
import ContactUs from "./form/ContactUs.vue";

export default {
  props: {
    emblemLogo: String
  },
  components: {
    ContactUs,
  },
  data() {
    return {}
  },
  mounted() {
  },
  methods: {
    showDialog() {
      this.$refs.child.showDialog()
    }
  },
}
</script>