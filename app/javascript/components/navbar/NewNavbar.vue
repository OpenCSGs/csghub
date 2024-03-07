<template>
  <div class="flex top-navbar-menu text-[#303133] justify-between items-center max-w-[1280px] m-auto xl:mx-[20px] h-[80px] sm:h-[60px]">
    <div class="flex">
      <div class="py-2 mr-[50px] xl:mr-[50px] sm:mr-[30px]">
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
        <el-menu-item index="/models" style="border:none" @click="routerLink('/models')">{{ $t('navbar.models') }}</el-menu-item>
        <el-menu-item index="/datasets" style="border:none" @click="routerLink('/datasets')">{{ $t('navbar.datasets') }}</el-menu-item>
        <el-sub-menu index="1" popper-class="popper-submenu">
          <template #title>{{ $t('navbar.product') }}</template>
          <el-menu-item @click="handleNavigation('/product','StarCloud')" index="StarCloud">
            <span>{{ $t('navbar.starCloud') }}</span>
          </el-menu-item>
          <el-menu-item @click="handleNavigation('/product','StarShip')" index="StarShip">
            <span>{{ $t('navbar.starShip') }}</span>
          </el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="2" popper-class="popper-submenu">
          <template #title>{{ $t('navbar.solution') }}</template>
          <el-menu-item @click="handleNavigation('/solution','KnowledgeBase')" index="KnowledgeBase">
            <span>{{ $t('navbar.EKB') }}</span>
          </el-menu-item>
          <el-menu-item @click="handleNavigation('/solution','StarAIO')" index="StarAIO">
            <span>{{ $t('navbar.starAIO') }}</span>
          </el-menu-item>
          <el-menu-item @click="handleNavigation('/solution','AIImg')" index="AIImg">
            <span>{{ $t('navbar.imagen') }}</span>
          </el-menu-item>
          <el-menu-item @click="handleNavigation('/solution','Programming')" index="Programming">
            <span>{{ $t('navbar.starCode') }}</span>
          </el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="3" popper-class="popper-submenu">
          <template #title>{{ $t('navbar.developer') }}</template>
          <a :href="csgHubUrl" target="_blank"><el-menu-item index="3-2">{{ $t('navbar.open') }}</el-menu-item></a>
          <a :href="llmInference" target="_blank"><el-menu-item index="3-2">{{ $t('navbar.llm_inference_open') }}</el-menu-item></a>
          <a :href="starChainUrl" target="_blank" v-if="isLoggedInBoolean"><el-menu-item index="3-3">StarChain</el-menu-item></a>
          <a href="/spaces"><el-menu-item index="/spaces">{{ $t('navbar.space') }}</el-menu-item></a>
          <a href="/docs" target="_blank"><el-menu-item index="/docs">{{ $t('navbar.docs') }}</el-menu-item></a>
        </el-sub-menu>
        <el-menu-item index="/computing" style="border:none" @click="routerLink('/computing')">{{ $t('navbar.computer') }}</el-menu-item>
        <el-sub-menu index="4" popper-class="popper-submenu">
          <template #title>{{ $t('navbar.enterprise') }}</template>
          <a href="/about"><el-menu-item index="/about">{{ $t('navbar.about') }}</el-menu-item></a>
          <a href="/partners"><el-menu-item index="/partners">{{ $t('navbar.partner') }}</el-menu-item></a>
          <a href="/experts"><el-menu-item index="/experts">{{ $t('navbar.expert') }}</el-menu-item></a>
        </el-sub-menu>
        <el-sub-menu index="5" popper-class="popper-submenu">
          <template #title>{{ $t('navbar.community') }}</template>
          <a href="/campaigns"><el-menu-item index="/campaigns">{{ $t('navbar.campaign') }}</el-menu-item></a>
          <a href="/daily_papers"><el-menu-item index="/daily_papers">{{ $t('navbar.dailyPaper') }}</el-menu-item></a>
        </el-sub-menu>
      </el-menu>
      <el-dropdown class="pr-4 sm:px-[15px]" @command="handleLocaleChange">
        <span class="flex items-center text-base outline-none">
          <svg preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24" width="1.2em" height="1.2em" data-v-12008bb2=""><path fill="currentColor" d="m18.5 10l4.4 11h-2.155l-1.201-3h-4.09l-1.199 3h-2.154L16.5 10h2zM10 2v2h6v2h-1.968a18.222 18.222 0 0 1-3.62 6.301a14.864 14.864 0 0 0 2.336 1.707l-.751 1.878A17.015 17.015 0 0 1 9 13.725a16.676 16.676 0 0 1-6.201 3.548l-.536-1.929a14.7 14.7 0 0 0 5.327-3.042A18.078 18.078 0 0 1 4.767 8h2.24A16.032 16.032 0 0 0 9 10.877a16.165 16.165 0 0 0 2.91-4.876L2 6V4h6V2h2zm7.5 10.885L16.253 16h2.492L17.5 12.885z"></path></svg>
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="zh">中文</el-dropdown-item>
            <el-dropdown-item command="en">English</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
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
              <el-dropdown-item> {{ $t('navbar.profile') }} </el-dropdown-item>
            </a>
            <a href="/settings/profile">
              <el-dropdown-item> {{ $t('navbar.setting') }} </el-dropdown-item>
            </a>
            <el-dropdown-item @click="showDialog" > {{ $t('navbar.contact') }} </el-dropdown-item>
            <a href="/models/new">
              <el-dropdown-item divided> + {{ $t('navbar.newModel') }} </el-dropdown-item>
            </a>
            <a href="/datasets/new">
              <el-dropdown-item> + {{ $t('navbar.newDataset') }} </el-dropdown-item>
            </a>
            <a href="/organizations/new">
              <el-dropdown-item divided> {{ $t('navbar.newOrg') }} </el-dropdown-item>
            </a>
            <a href="/daily_papers/new" v-if="canCreateDailyPaper">
              <el-dropdown-item> {{ $t('navbar.recommendation') }} </el-dropdown-item>
            </a>
            <a href="/logout">
              <el-dropdown-item divided>  {{ $t('navbar.logout') }} </el-dropdown-item>
            </a>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <button v-else class="min-w-[72px] sm:min-w-[46px] bg-[#303133] rounded-[100px] p-[2px] flex items-center justify-center text-[12px] font-500 text-white leading-[20px]">
        <a class="sm:hidden" href="/login">
          {{ $t('navbar.register') }}
        </a>
        <a class="hidden sm:block" href="/login">
          {{ $t('navbar.login') }}
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
    userName: String,
    canCreateDailyPaper: Boolean,
  },
  data() {
    const classParam = new URLSearchParams(window.location.search).get('class');
    return {
      csgHubUrl:'https://github.com/OpenCSGs/CSGHub',
      llmInference: 'https://github.com/OpenCSGs/llm-inference',
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
    handleLocaleChange(locale) {
      location.href = `/${locale}/settings/locale`
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
