<template>
  <div class="flex top-navbar-menu text-[#303133] justify-between items-center max-w-[1280px] m-auto xl:mx-[20px] h-[80px] sm:h-[60px]">
    <div class="flex">
      <div class="py-2 mr-[100px] xl:mr-[50px] sm:mr-[30px]">
        <a href="/">
          <img :src="logo" alt="OpenCSG Logo" class="w-[135px] sm:w-[90px]" />
        </a>
      </div>
    </div>
    <div class="flex items-center justify-end gap-4 w-full md:gap-0 md:w-[50%]">
      <el-menu
        :default-active="activeIndex"
        mode="horizontal"
        :ellipsis="true"
        class="w-full"
        text-color="#475467"
        active-text-color="black"
      >
        <el-menu-item index="/models" style="border:none" @click="routerLink('/models')">模型</el-menu-item>
        <el-menu-item index="/datasets" style="border:none" @click="routerLink('/datasets')">数据集</el-menu-item>
        <el-sub-menu index="1" popper-class="popper-submenu">
          <template #title>产品</template>
          <el-menu-item @click="handleNavigation('/product','StarCloud')" index="StarCloud">
            <span>StarCloud 星云平台</span>
          </el-menu-item>
          <el-menu-item @click="handleNavigation('/product','StarShip')" index="StarShip">
            <span>StarShip 星舰平台</span>
          </el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="2" popper-class="popper-submenu">
          <template #title>方案</template>
          <el-menu-item @click="handleNavigation('/solution','KnowledgeBase')" index="KnowledgeBase">
            <span>EKB AI 智能企业知识库</span>
          </el-menu-item>
          <el-menu-item @click="handleNavigation('/solution','StarAIO')" index="StarAIO">
            <span>StarAIO 大模型一体机</span>
          </el-menu-item>
          <el-menu-item @click="handleNavigation('/solution','AIImg')" index="AIImg">
            <span>Imagen AI 智能图像助手</span>
          </el-menu-item>
          <el-menu-item @click="handleNavigation('/solution','Programming')" index="Programming">
            <span>StarCode AI 智能编程助手</span>
          </el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="3" popper-class="popper-submenu">
          <template #title>开发者</template>
          <a :href="csgHubUrl" target="_blank"><el-menu-item index="3-2">开源CSGHub</el-menu-item></a>
          <a :href="starChainUrl" target="_blank" v-if="isLoggedInBoolean"><el-menu-item index="3-3">StarChain</el-menu-item></a>
          <a href="/spaces"><el-menu-item index="/spaces">应用空间</el-menu-item></a>
          <a href="/docs" target="_blank"><el-menu-item index="/docs">文档中心</el-menu-item></a>
        </el-sub-menu>
        <el-menu-item index="/computing" style="border:none" @click="routerLink('/computing')">算力</el-menu-item>
        <el-sub-menu index="4" popper-class="popper-submenu">
          <template #title>公司</template>
          <a href="/about"><el-menu-item index="/about">公司介绍</el-menu-item></a>
          <a href="/partners"><el-menu-item index="/partners">合作伙伴</el-menu-item></a>
          <a href="/experts"><el-menu-item index="/experts">技术专家</el-menu-item></a>
        </el-sub-menu>
       <el-menu-item index="/campaigns" style="border:none" @click="routerLink('/campaigns')">活动</el-menu-item>
      </el-menu>
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
      <el-dropdown v-if="isLoggedInBoolean" class="pl-1">
        <span v-if="JSON.parse(companyVerified.toLowerCase())" class="el-dropdown-link relative">
          <el-avatar :size="35" :src="avatar">
          </el-avatar>
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none" class="absolute bottom-0 right-0">
            <rect x="0.5" y="0.5" width="14" height="14" rx="7" fill="white"/>
            <path d="M7.5 1C3.88208 1 1 3.88208 1 7.5C1 11.1179 3.88208 14 7.5 14C11.1179 14 14 11.1179 14 7.5C14 3.88208 11.1179 1 7.5 1ZM11.3019 11.3632H3.57547V10.5047H4.92453V7.00943H5.78302V10.5047H7.31604V5.66038H8.17453V7.62264H10.6274V8.48113H8.17453V10.5047H11.3019V11.3632ZM11.3632 7.00943C9.89151 6.21226 8.60377 5.23113 7.5 3.9434C6.51887 5.10849 5.23113 6.15094 3.63679 7.00943L3.14623 6.15094C4.74057 5.35377 6.08962 4.37264 7.1934 3.14623H7.86792C9.03302 4.43396 10.3821 5.41509 11.8538 6.15094L11.3632 7.00943Z" fill="#67C23A"/>
            <rect x="0.5" y="0.5" width="14" height="14" rx="7" stroke="white"/>
          </svg>
        </span>
        <span v-else-if="JSON.parse(isCompanyUser.toLowerCase())" class="el-dropdown-link relative">
          <el-avatar :size="35" :src="avatar">
          </el-avatar>
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none" class="absolute bottom-0 right-0">
            <rect x="0.5" y="0.5" width="14" height="14" rx="7" fill="black" fill-opacity="0.8"/>
            <path d="M7.5 1C3.88208 1 1 3.88208 1 7.5C1 11.1179 3.88208 14 7.5 14C11.1179 14 14 11.1179 14 7.5C14 3.88208 11.1179 1 7.5 1ZM11.3019 11.3632H3.57547V10.5047H4.92453V7.00943H5.78302V10.5047H7.31604V5.66038H8.17453V7.62264H10.6274V8.48113H8.17453V10.5047H11.3019V11.3632ZM11.3632 7.00943C9.89151 6.21226 8.60377 5.23113 7.5 3.9434C6.51887 5.10849 5.23113 6.15094 3.63679 7.00943L3.14623 6.15094C4.74057 5.35377 6.08962 4.37264 7.1934 3.14623H7.86792C9.03302 4.43396 10.3821 5.41509 11.8538 6.15094L11.3632 7.00943Z" fill="white"/>
            <rect x="0.5" y="0.5" width="14" height="14" rx="7" stroke="#DCDFE6"/>
          </svg>
        </span>
        <span v-else class="el-dropdown-link">
          <el-avatar :size="35" :src="avatar">
          </el-avatar>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <a :href="userProfile">
              <el-dropdown-item> 个人信息 </el-dropdown-item>
            </a>
            <a href="/settings/profile">
              <el-dropdown-item> 账号设置 </el-dropdown-item>
            </a>
            <el-dropdown-item @click="showDialog" > 联系我们 </el-dropdown-item>
            <a href="/models/new">
              <el-dropdown-item divided> + 新建模型 </el-dropdown-item>
            </a>
            <a href="/datasets/new">
              <el-dropdown-item> + 新建数据集 </el-dropdown-item>
            </a>
            <a href="/organizations/new">
              <el-dropdown-item divided> 新建组织 </el-dropdown-item>
            </a>
            <a href="/logout">
              <el-dropdown-item divided>  退出登录 </el-dropdown-item>
            </a>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <button v-else class="min-w-[72px] sm:min-w-[46px] bg-[#303133] rounded-[100px] p-[2px] flex items-center justify-center text-[12px] font-500 text-white leading-[20px]">
        <a class="sm:hidden" href="/login">
          登录/注册
        </a>
        <a class="hidden sm:block" href="/login">
          登录
        </a>
      </button>
    </div>
  </div>
  <ContactUs ref='child' />
</template>

<script>
import ContactUs from "../form/ContactUs.vue";

export default {
  props: {
    logo: String,
    avatar: String,
    starChainUrl: String,
    isCompanyUser: String,
    companyVerified: String,
    phone: String,
    isLoggedIn: String,
    userName: String
  },
  data() {
    const classParam = new URLSearchParams(window.location.search).get('class');
    return {
      csgHubUrl:'https://github.com/OpenCSGs/CSGHub',
      activeIndex: classParam ?  classParam : window.location.pathname,
      isLoggedInBoolean: JSON.parse(this.isLoggedIn.toLowerCase()),
      userProfile: `/profile/${this.userName}`
    }
  },
  components: {
    ContactUs,
  },
  methods: {
    routerLink(path){
      window.location.href = path
    },
    handleNavigation(path,className){
      window.location.href = path + '?class=' + className;
    },
    showDialog() {
      this.$refs.child.showDialog()
    },
    changeLang() {
      if (this.$i18n.locale === 'zh') {
        this.$i18n.locale = 'en'
      } else {
        this.$i18n.locale = 'zh'
      }
    },
  },
  mounted() {}
}
</script>

<style>
.top-navbar-menu{
  .el-dropdown {
    color: #303133;
  }
 .el-dropdown-link {
    &:focus {
      outline: none;
    }
  }
  .el-menu--horizontal.el-menu {
    border-bottom: none;
  }
  .el-sub-menu__title {
    border-bottom: unset !important;
    font-size: 16px;
  }
  .el-menu-item {
    font-size: 16px;
  }
}
.popper-submenu .el-menu{
  min-width: 150px;
  .el-menu-item {
    font-size: 16px;
  }
}
</style>
