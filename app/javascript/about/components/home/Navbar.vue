<template>
  <div class="flex justify-center w-full bg-white border-b border-[#e1e1e1]">
    <div
      class="flex justify-between items-center h-[80px] bg-white text-[#303133] mx-auto w-full max-w-[1280px] ml-[20px] mr-[20px] xl:px-[20px] md:h-[60px]">
      <div>
<!--        <nuxt-link to="/">-->
<!--          <img :src="logo" class="w-[135px] md:w-[90px]" alt="OpenCsg">-->
<!--        </nuxt-link>-->
      </div>
      <div class="flex justify-center">
        <div class="cursor-pointer md:hidden" @click="changeLang">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-[24px] h-[24px]" viewBox="0 0 24 24" fill="none">
            <g clip-path="url(#clip0_853_19458)">
              <path
                d="M3.77262 9.36519H6.76677V11.9402C6.76677 12.2396 7.0063 12.539 7.3656 12.539C7.7249 12.539 7.96443 12.2995 7.96443 11.9402V9.36519H10.9586C11.3778 9.36519 11.7371 9.00589 11.7371 8.58671V4.87396C11.7371 4.45478 11.3778 4.09548 10.9586 4.09548H7.96443V2.41876C7.96443 2.11934 7.7249 1.81993 7.3656 1.81993C7.0063 1.81993 6.76677 2.05946 6.76677 2.41876V4.09548H3.77262C3.35344 4.09548 2.99414 4.45478 2.99414 4.87396V8.52683C2.99414 9.00589 3.35344 9.36519 3.77262 9.36519ZM7.96443 5.17338H10.2999C10.4795 5.17338 10.6592 5.35303 10.6592 5.53268V7.928C10.6592 8.10765 10.4795 8.2873 10.2999 8.2873H7.96443V5.17338ZM4.13192 5.53268C4.13192 5.35303 4.31157 5.17338 4.49122 5.17338H6.82666V8.22742H4.49122C4.31157 8.22742 4.13192 8.04777 4.13192 7.86812V5.53268ZM15.5696 20.5034H11.9766C11.7969 20.5034 11.6173 20.3238 11.6173 20.1441V17.8686C11.6173 17.6889 11.7969 17.5093 11.9766 17.5093H15.1504C15.4498 17.5093 15.6893 17.2698 15.6893 16.9703C15.6893 16.6709 15.4498 16.4314 15.1504 16.4314H11.9766C11.7969 16.4314 11.6173 16.2517 11.6173 16.0721V14.0361C11.6173 13.8564 11.7969 13.6768 11.9766 13.6768H15.3899C15.6893 13.6768 15.9289 13.4372 15.9289 13.1378C15.9289 12.8384 15.6893 12.5989 15.3899 12.5989H11.1981C10.7789 12.5989 10.4196 12.9582 10.4196 13.3774V20.6831C10.4196 21.1023 10.7789 21.4616 11.1981 21.4616H15.5696C15.869 21.4616 16.1085 21.222 16.1085 20.9226C16.1085 20.743 15.869 20.5034 15.5696 20.5034ZM20.0608 15.2936C19.7015 15.2936 19.4021 15.3535 19.1626 15.4733C18.923 15.593 18.6236 15.7727 18.444 16.0721V16.0122C18.444 15.6529 18.1446 15.4134 17.8451 15.4134C17.4858 15.4134 17.2463 15.7128 17.2463 16.0122V20.9825C17.2463 21.3418 17.5457 21.5813 17.8451 21.5813C18.1446 21.5813 18.444 21.2819 18.444 20.9825V17.6291C18.5038 17.15 18.6236 16.8506 18.923 16.611C19.1626 16.3715 19.4021 16.3116 19.7015 16.3116C20.5399 16.3116 20.9591 16.7907 20.9591 17.6889V20.9825C20.9591 21.3418 21.2585 21.5813 21.5579 21.5813C21.8573 21.5813 22.1567 21.2819 22.1567 20.9825V17.5692C22.1567 16.0122 21.4381 15.2936 20.0608 15.2936ZM11.9766 0.0234375H11.6173C11.3179 0.0234375 11.0185 0.322853 11.0185 0.622268C11.0185 0.981566 11.3179 1.2211 11.6173 1.2211H11.9766C17.905 1.2211 22.7555 6.07163 22.7555 12C22.7555 12.9582 22.6358 13.9163 22.3962 14.8146C22.2765 15.1738 22.5759 15.593 22.9951 15.593C23.2945 15.593 23.534 15.4134 23.5939 15.1738C23.8334 14.1558 24.0131 13.1378 24.0131 12.0599C23.9532 5.41291 18.5637 0.0234375 11.9766 0.0234375Z"
                fill="#303133"/>
              <path
                d="M12.3359 22.7792H11.9766C6.04819 22.7792 1.19766 17.9286 1.19766 12.0002C1.19766 11.0421 1.31743 10.084 1.55696 9.18571C1.67673 8.82641 1.37731 8.40723 0.958129 8.40723C0.658713 8.40723 0.419181 8.58688 0.359298 8.82641C0.119766 9.9043 0 10.9223 0 12.0002C0 18.5873 5.38947 23.9768 11.9766 23.9768H12.3359C12.6353 23.9768 12.9347 23.6774 12.9347 23.378C12.9347 23.0187 12.6353 22.7792 12.3359 22.7792Z"
                fill="#303133"/>
            </g>
            <defs>
              <clipPath id="clip0_853_19458">
                <rect class="w-[24px] h-[24px]" fill="white"/>
              </clipPath>
            </defs>
          </svg>
        </div>
        <div class="items-center">
          <div class="hidden md:block">
            <el-popover class="popperList w-[150px]" placement="bottom" v-model="popshow" trigger="click">
              <div @click="closePop">
<!--                <nuxt-link-->
<!--                  :class="this.$route.path == '/' ? 'activeMenu block' : 'menuItem'"-->
<!--                           to="/">{{$t('Overview')}}-->
<!--                </nuxt-link>-->
              </div>
              <div @click="closePop">
                <div
                  :class="this.$route.path == '/Models' ? 'activeMenu block' : 'menuItem'"
                  @click="goModels">{{$t('Models') }}
                </div>
              </div>
              <div @click="closePop">
                <div
                  :class="this.$route.path == '/MarketPlace' ? 'activeMenu block' : 'menuItem'"
                  @click="goMarketPlace">{{$t('MarketPlace') }}
                </div>
              </div>
              <div @click="closePop">
                <div
                  :class="this.$route.path == '/Scheme' ? 'activeMenu block' : 'menuItem'"
                  @click="goScheme">{{$t('Scheme') }}
                </div>
              </div>
              <div @click="closePop">
                <div
                  :class="this.$route.path == '/Train' ? 'activeMenu block' : 'menuItem'"
                  @click="goTrain">{{$t('Train') }}
                </div>
              </div>
              <div @click="closePop">
                <div
                  :class="this.$route.path == '/Pricing' ? 'activeMenu block' : 'menuItem'"
                  @click="goPricing">{{$t('Pricing') }}
                </div>
              </div>
              <div @click="goBlog" class="menuItem block">{{ $t('Blog') }}
              </div>
              <el-button class="hidden menu border-0 mx-auto backdrop-blur-[15px] bg-transparent" slot="reference">
                <svg xmlns="http://www.w3.org/2000/svg" class="md:align-baseline w-[20px] h-[20px]" viewBox="0 0 1024 1024">
                  <path fill="currentColor"
                        d="M27 193.6c-8.2-8.2-12.2-18.6-12.2-31.2s4-23 12.2-31.2S45.6 119 58.2 119h912.4c12.6 0 23 4 31.2 12.2s12.2 18.6 12.2 31.2s-4 23-12.2 31.2s-18.6 12.2-31.2 12.2H58.2c-12.6 0-23-4-31.2-12.2zm974.8 285.2c8.2 8.2 12.2 18.6 12.2 31.2s-4 23-12.2 31.2s-18.6 12.2-31.2 12.2H58.2c-12.6 0-23-4-31.2-12.2S14.8 522.6 14.8 510s4-23 12.2-31.2s18.6-12.2 31.2-12.2h912.4c12.6 0 23 4 31.2 12.2zm0 347.4c8.2 8.2 12.2 18.6 12.2 31.2s-4 23-12.2 31.2s-18.6 12.2-31.2 12.2H58.2c-12.6 0-23-4-31.2-12.2S14.8 870 14.8 857.4s4-23 12.2-31.2S45.6 814 58.2 814h912.4c12.6 0 23 4.2 31.2 12.2z"/>
                </svg>
              </el-button>
            </el-popover>
          </div>
        </div>
      </div>
    </div>
    <ContactUS :dialogFormVisible="dialogFormVisible" @closeDialog="closeDialog"/>
  </div>
</template>

<script>
import ContactUS from '../ContactUs.vue'

export default {
  name: 'Header',
  props: {
    logo: String
  },
  components: {
    ContactUS
  },
  data() {
    return {
      path: '',
      showInfo: true,
      popshow: false,
      dialogFormVisible: false,
      menu: [{name: '我们', path: '/'}, {name: '模型', path: '/Models'}, {name: '应用', path: '/MarketPlace'}, {
        name: '方案',
        path: '/Scheme'
      }, {name: '培训', path: '/Train'}, {name: '价格', path: '/Pricing'},]
    }
  },
  mounted() {
    var lang = navigator.language || navigator.userLanguage;//常规浏览器语言和IE浏览器
    lang = lang.substr(0, 2);//截取lang前2位字符
    if (lang == 'zh') {
      this.$i18n.locale = 'zh';
    } else {
      this.$i18n.locale = 'en'
    }
  },
  methods: {
    closePop() {
      this.popshow = false;
    },
    closeDialog() {
      this.dialogFormVisible = false;
    },
    changeLang() {
      if (this.$i18n.locale == 'zh') {
        this.$i18n.locale = 'en'
      } else {
        this.$i18n.locale = 'zh'
      }
    },
    goBlog() {
      window.location.href = 'https://opencsg.com/blog/'
    },
    goScheme() {
      window.location.href = 'https://opencsg.com/Scheme/'
    },
    goTrain() {
      window.location.href = 'https://opencsg.com/Train/'
    },
    goMarketPlace() {
      window.location.href = 'https://opencsg.com/MarketPlace/'
    },
    goModels() {
      window.location.href = 'https://opencsg.com/Models/'
    },
    goPricing() {
      window.location.href = 'https://opencsg.com/Pricing/'
    },
    goInfo() {
      window.location.href = 'https://opencsg.com/blog/news/8/'
    }
  }
}
</script>

<style>
.menuItem {
  @apply text-[#303133] px-[20px] text-[16px] leading-[24px] cursor-pointer text-center;
}

.activeMenu {
  @apply text-[#303133] px-[20px] text-[16px] leading-[24px] cursor-pointer font-medium no-underline text-center;
}

.popperList {
  @apply text-[#303133] px-[20px] text-[16px] leading-[24px] cursor-pointer py-[6px] text-center;
}
</style>
