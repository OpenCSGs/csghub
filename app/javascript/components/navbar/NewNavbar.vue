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
        <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10.7607 13.1667H16.739M10.7607 13.1667L9.1665 16.5M10.7607 13.1667L13.1484 8.17419C13.3408 7.77189 13.437 7.57075 13.5686 7.50718C13.6831 7.4519 13.8166 7.4519 13.931 7.50718C14.0627 7.57075 14.1589 7.77189 14.3513 8.17419L16.739 13.1667M16.739 13.1667L18.3332 16.5M1.6665 3.16667H6.6665M6.6665 3.16667H9.58317M6.6665 3.16667V1.5M9.58317 3.16667H11.6665M9.58317 3.16667C9.16972 5.63107 8.21033 7.86349 6.80446 9.73702M8.33317 10.6667C7.82273 10.4373 7.30204 10.1184 6.80446 9.73702M6.80446 9.73702C5.67736 8.87314 4.66881 7.68886 4.1665 6.5M6.80446 9.73702C5.46722 11.5191 3.72603 12.9765 1.6665 14" stroke="#344054" stroke-width="1.67" stroke-linecap="round" stroke-linejoin="round"/>
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
import csrfFetch from "../../packs/csrfFetch";

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
      this.submitLang()
    },
    submitLang() {
      const response = csrfFetch(`/internal_api/internationalize?flag=${this.$i18n.locale}`, { method: 'GET' })
    }
  },
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
