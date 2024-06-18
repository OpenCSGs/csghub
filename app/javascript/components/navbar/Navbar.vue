<template>
  <div class="flex top-navbar-menu text-[#303133] justify-between items-center max-w-[1280px] m-auto xl:mx-[20px] h-[80px] sm:h-[60px]">
    <div class="flex">
      <div class="py-2 mr-[50px] xl:mr-[50px] sm:mr-[30px]">
        <a href="/">
          <img :src="logo" alt="OpenCSG Logo" class="w-[135px] sm:w-[90px] sm:hidden" />
          <img src="/images/opencsg_mobile_logo.png" alt="OpenCSG Logo" class="hidden w-auto h-[40px] sm:block" />
        </a>
      </div>
    </div>
    <div class="flex items-center justify-end gap-4 w-full md:gap-0 xl:w-[30%]">
      <el-menu
        :default-active="activeIndex"
        mode="horizontal"
        :ellipsis="true"
        class="w-full el-menu-nav"
        text-color="#475467"
        active-text-color="black"
      >
        <!-- model -->
        <el-menu-item index="/models" style="border:none" @click="routerLink('/models')">{{ $t('navbar.models') }}</el-menu-item>

        <!-- dataset -->
        <el-menu-item index="/datasets" style="border:none" @click="routerLink('/datasets')">{{ $t('navbar.datasets') }}</el-menu-item>

        <!-- code -->
        <el-menu-item  index="/codes" style="border:none" @click="routerLink('/codes')">{{ $t('navbar.codes') }}</el-menu-item>

        <!-- application space -->
        <el-menu-item  index="/spaces" style="border:none" @click="routerLink('/spaces')">{{ $t('navbar.spaces') }}</el-menu-item>

        <!-- hardware -->
        <el-menu-item index="/computing" style="border:none" @click="routerLink('/computing')">{{ $t('navbar.computer') }}</el-menu-item>

        <!-- product -->
        <el-sub-menu style="height: auto;" index="1" popper-class="popper-submenu">
          <template #title>{{ $t('navbar.product') }}</template>
          <el-menu-item style="height: auto;" @click="routerLink('/csghub')" index="CsgHub">
            <ProductCsgHub />
          </el-menu-item>
          <el-menu-item style="height: auto;" @click="routerLink('/starship')" index="StarShip">
            <StarShip />
          </el-menu-item>
          <el-menu-item style="height: auto;" @click="routerLink('/ekb')" index="KnowledgeBase">
            <EKB />
          </el-menu-item>
          <el-menu-item style="height: auto;" @click="handleNavigation('/solution','StarAIO')" index="StarAIO">
            <StarAIO />
          </el-menu-item>
          <el-menu-item style="height: auto;" @click="handleNavigation('/solution','AIImg')" index="AIImg">
            <Imagen />
          </el-menu-item>
          <el-menu-item style="height: auto;" @click="handleNavigation('/solution','Programming')" index="Programming">
            <StarCode />
          </el-menu-item>
          <el-menu-item style="height: auto;" @click="handleNavigation('/solution')" index="Programming">
            <AllSolution />
          </el-menu-item>
        </el-sub-menu>

        <!-- open source -->
        <el-sub-menu style="height: auto;" index="3" popper-class="popper-submenu">
          <template #title>{{ $t('navbar.developer') }}</template>
          <a :href="csgHubUrl" target="_blank"><el-menu-item style="height: auto;" index="3-1"><CSGHub /></el-menu-item></a>
          <a :href="llmInference" target="_blank"><el-menu-item style="height: auto;" index="3-2"><Inference /></el-menu-item></a>
          <a :href="llmFinetune" target="_blank"><el-menu-item style="height: auto;" index="3-3"><LlmFinetune /></el-menu-item></a>
          <a :href="OpenSourceStarCloudUrl" target="_blank"><el-menu-item style="height: auto;" index="3-4"><OpenSourceStarCloud /></el-menu-item></a>
          <a :href="starChainUrl" target="_blank" v-if="isLoggedInBoolean"><el-menu-item style="height: auto;" index="3-5"><StarChain /></el-menu-item></a>
        </el-sub-menu>

        <!-- community -->
        <el-sub-menu style="height: auto;" index="5" popper-class="popper-submenu">
          <template #title>{{ $t('navbar.community') }}</template>
          <a href="/daily_papers"><el-menu-item style="height: auto;" index="5-2"><DailyPapers /></el-menu-item></a>
          <a href="/campaigns"><el-menu-item style="height: auto;" index="5-1"><Campaigns /></el-menu-item></a>
          <a href="/partners"><el-menu-item style="height: auto;" index="4-2"><Partners /></el-menu-item></a>
          <a href="/experts"><el-menu-item style="height: auto;" index="4-3"><Experts /></el-menu-item></a>
          <!-- <a href="/spaces"><el-menu-item style="height: auto;" index="/spaces"><Space /></el-menu-item></a> -->
          <a href="https://blog.opencsg.com/" target="_blank"><el-menu-item style="height: auto;" index="4-4"><News /></el-menu-item></a>
          <a href="/docs" target="_blank"><el-menu-item style="height: auto;" index="/docs"><Doc /></el-menu-item></a>
        </el-sub-menu>
      </el-menu>

      <!-- i18n -->
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

      <!-- avatar dropdown -->
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
            <a :href="`/profile/likes/${ this.userName }`">
              <el-dropdown-item> {{ $t('profile.myCollect')}} </el-dropdown-item>
            </a>
            <a href="/settings/profile">
              <el-dropdown-item> {{ $t('navbar.setting') }} </el-dropdown-item>
            </a>
            <el-dropdown-item @click="showDialog" > {{ $t('navbar.contact') }} </el-dropdown-item>
            <a :href="starcloudUrl" target="_blank">
              <el-dropdown-item> {{ $t('navbar.source') }} </el-dropdown-item>
            </a>
            <a href="/models/new">
              <el-dropdown-item divided> + {{ $t('navbar.newModel') }} </el-dropdown-item>
            </a>
            <a href="/datasets/new">
              <el-dropdown-item> + {{ $t('navbar.newDataset') }} </el-dropdown-item>
            </a>
            <a href="/codes/new">
              <el-dropdown-item > + {{ $t('navbar.newCode') }} </el-dropdown-item>
            </a>
            <a href="/spaces/new">
              <el-dropdown-item> + {{ $t('navbar.newApplicationSpace') }} </el-dropdown-item>
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
import ContactUs from "../form/ContactUs.vue"
import StarCloud from "./menuItem/StarCloud.vue"
import ProductCsgHub from "./menuItem/ProductCsgHub.vue"
import StarShip from "./menuItem/StarShip.vue"
import EKB from "./menuItem/EKB.vue"
import StarAIO from "./menuItem/StarAIO.vue"
import Imagen from "./menuItem/Imagen.vue"
import StarCode from "./menuItem/StarCode.vue"
import AllSolution from "./menuItem/AllSolution.vue"
import CSGHub from "./menuItem/CSGHub.vue"
import Inference from "./menuItem/Inference.vue"
import LlmFinetune from "./menuItem/LlmFinetune.vue"
import OpenSourceStarCloud from "./menuItem/OpenSourceStarCloud.vue"
import StarChain from "./menuItem/StarChain.vue"
import Space from "./menuItem/Space.vue"
import Doc from "./menuItem/Doc.vue"
import News from "./menuItem/News.vue"
import About from "./menuItem/About.vue"
import Partners from "./menuItem/Partners.vue"
import Experts from "./menuItem/Experts.vue"
import Campaigns from "./menuItem/Campaigns.vue"
import DailyPapers from "./menuItem/DailyPapers.vue"

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
    userId: String,
    canCreateDailyPaper: Boolean,
    starcloudUrl: String
  },
  data() {
    const classParam = new URLSearchParams(window.location.search).get('class');
    return {
      csgHubUrl:'https://github.com/OpenCSGs/CSGHub',
      llmInference: 'https://github.com/OpenCSGs/llm-inference',
      llmFinetune: 'https://github.com/OpenCSGs/llm-finetune',
      OpenSourceStarCloudUrl:'https://github.com/OpenCSGs/llm-scheduler-ui',
      activeIndex: classParam ?  classParam : window.location.pathname,
      isLoggedInBoolean: JSON.parse(this.isLoggedIn.toLowerCase()),
      userProfile: `/profile/${this.userId}`
    }
  },
  components: {
    ContactUs,
    StarCloud,
    StarShip,
    EKB,
    StarAIO,
    Imagen,
    StarCode,
    AllSolution,
    CSGHub,
    Inference,
    StarChain,
    Space,
    Doc,
    News,
    About,
    Experts,
    Partners,
    Campaigns,
    DailyPapers,
    LlmFinetune,
    ProductCsgHub
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
.el-menu-nav {
  border: none !important;
}
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
  min-width: 200px;
  .el-menu-item {
    font-size: 16px;
    height:auto;
    line-height:24px;
  }
}
</style>
