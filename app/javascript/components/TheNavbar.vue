<template>
  <div
    class="flex text-[#303133] justify-between items-center max-w-[1280px] m-auto xl:mx-[20px]"
  >
    <div class="flex">
      <div class="py-2 mr-[100px] sm:mr-[30px]">
        <a href="/">
          <img :src="logo" height="32" width="99" alt="OpenCSG Logo" />
        </a>
      </div>
    </div>
    <div class="flex justify-between items-center pl-4">
      <ul class="flex justify-between items-center">
        <li class="px-5 mlg:!hidden"> <space></space> </li>
        <li class="px-5 mlg:!hidden"> <model></model> </li>
        <li class="px-5 mlg:!hidden"> <dataset></dataset> </li>
        <li v-if="isLoggedInBoolean" class="px-5 mlg:!hidden lg:!hidden"> <starchain :star-chain-url="starChainUrl"></starchain> </li>
        <li class="px-5 mlg:!hidden lg:!hidden"> <partner></partner> </li>
        <li class="px-5 mlg:!hidden lg:!hidden xl:!hidden"> <expert></expert> </li>
        <li class="px-5 mlg:!hidden lg:!hidden xl:!hidden"> <docs></docs> </li>
      </ul>
      <el-dropdown class="!hidden xl:!block pr-8 sm:px-2">
        <span class="el-dropdown-link">
          <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="m242-200 200-280-200-280h98l200 280-200 280h-98Zm238 0 200-280-200-280h98l200 280-200 280h-98Z"/></svg>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item class="!hidden mlg:!flex"> <space></space> </el-dropdown-item>
            <el-dropdown-item class="!hidden mlg:!flex"> <model></model> </el-dropdown-item>
            <el-dropdown-item class="!hidden mlg:!flex"> <dataset></dataset> </el-dropdown-item>
            <el-dropdown-item v-if="isLoggedInBoolean" class="!hidden lg:!flex"> <starchain :star-chain-url="starChainUrl"></starchain> </el-dropdown-item>
            <el-dropdown-item class="!hidden lg:!flex"> <partner></partner> </el-dropdown-item>
            <el-dropdown-item class="!hidden xl:!flex"> <expert></expert> </el-dropdown-item>
            <el-dropdown-item class="!hidden xl:!flex"> <docs></docs> </el-dropdown-item>
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
            <el-dropdown-item>{{ phone }}</el-dropdown-item>
            <el-dropdown-item @click="showDialog"
              >联系我们</el-dropdown-item
            >
            <el-dropdown-item divided>
              <a :href="logout" @click="cleanUpAuthing"> Logout </a>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <button v-else class="bg-[#303133] rounded-[100px] py-[2px] px-[12px] flex items-center justify-center text-[12px] font-500 text-white leading-[20px]">
        <a href="/login">
          登录/注册
        </a>
      </button>
    </div>

  </div>
  <ContactUs ref='child' />
</template>

<script>
import ContactUs from "./form/ContactUs.vue";
import Space from "./sub/navbarItems/space.vue";
import Model from "./sub/navbarItems/model.vue";
import Dataset from "./sub/navbarItems/dataset.vue";
import Starchain from "./sub/navbarItems/starchain.vue";
import Partner from "./sub/navbarItems/partner.vue";
import Expert from "./sub/navbarItems/expert.vue";
import Docs from "./sub/navbarItems/docs.vue";
export default {
  props: {
    logout: String,
    logo: String,
    avatar: String,
    starChainUrl: String,
    isCompanyUser: String,
    companyVerified: String,
    phone: String,
    isLoggedIn: String
  },
  data() {
    return {
      isLoggedInBoolean: JSON.parse(this.isLoggedIn.toLowerCase())
    }
  },
  components: {
    ContactUs,
    Space,
    Model,
    Dataset,
    Starchain,
    Partner,
    Expert,
    Docs
  },
  methods: {
    showDialog() {
      this.$refs.child.showDialog()
    },
    cleanUpAuthing() {
      localStorage.removeItem("_guard_i18nextLng");
      localStorage.removeItem("_authing_token");
      localStorage.removeItem("_authing_user");
      localStorage.removeItem("__authing__multiple_accounts");
    }
  },
  mounted() {
  }
}
</script>

<style>
.el-dropdown {
  color: #303133;
}
.el-dropdown-link {
  &:focus {
    outline: none;
  }
}
</style>
