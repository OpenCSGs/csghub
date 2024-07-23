<template>
  <div
    class="flex text-[#303133] justify-between items-center max-w-[1280px] m-auto xl:mx-[20px] h-[80px] sm:h-[60px]"
  >
    <!-- 平台 logo -->
    <div class="flex">
      <div class="py-2 mr-[100px] sm:mr-[30px]">
        <a href="/">
          <img
            :src="logo"
            alt="OpenCSG Logo"
            class="w-[135px] sm:w-[90px]"
          />
        </a>
      </div>
    </div>

    <div class="flex justify-between items-center pl-4">
      <!-- desktop 导航栏 -->
      <ul class="flex justify-between items-center">
        <li class="px-5 mlg:!hidden"><model></model></li>
        <li class="px-5 mlg:!hidden lg:!hidden"><dataset></dataset></li>
        <li class="px-5 mlg:!hidden lg:!hidden"><code-nav></code-nav></li>
        <li class="px-5 mlg:!hidden lg:!hidden"><space></space></li>
      </ul>

      <!-- mobile 导航栏 -->
      <el-dropdown class="!hidden lg:!block pr-8 sm:px-[15px]">
        <span class="el-dropdown-link">
          <el-icon><ArrowDownBold /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item class="!hidden mlg:!flex">
              <model></model>
            </el-dropdown-item>
            <el-dropdown-item class="!hidden lg:!flex">
              <dataset></dataset>
            </el-dropdown-item>
            <el-dropdown-item class="!hidden lg:!flex">
              <code-nav></code-nav>
            </el-dropdown-item>
            <el-dropdown-item class="!hidden lg:!flex">
              <space></space>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <el-dropdown
        class="pr-4 sm:px-[15px]"
        @command="handleLocaleChange"
      >
        <span class="flex items-center text-base outline-none">
          <SvgIcon name="i18n_language" />
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

      <!-- logged in: 用户头像和下拉 -->
      <el-dropdown
        v-if="isLoggedInBoolean"
        class="pl-1"
      >
        <span
          v-if="JSON.parse(companyVerified.toLowerCase())"
          class="el-dropdown-link relative"
        >
          <el-avatar
            :size="35"
            :src="userAvatar"
          >
          </el-avatar>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            class="absolute bottom-0 right-0"
          >
            <rect
              x="0.5"
              y="0.5"
              width="14"
              height="14"
              rx="7"
              fill="white"
            />
            <path
              d="M7.5 1C3.88208 1 1 3.88208 1 7.5C1 11.1179 3.88208 14 7.5 14C11.1179 14 14 11.1179 14 7.5C14 3.88208 11.1179 1 7.5 1ZM11.3019 11.3632H3.57547V10.5047H4.92453V7.00943H5.78302V10.5047H7.31604V5.66038H8.17453V7.62264H10.6274V8.48113H8.17453V10.5047H11.3019V11.3632ZM11.3632 7.00943C9.89151 6.21226 8.60377 5.23113 7.5 3.9434C6.51887 5.10849 5.23113 6.15094 3.63679 7.00943L3.14623 6.15094C4.74057 5.35377 6.08962 4.37264 7.1934 3.14623H7.86792C9.03302 4.43396 10.3821 5.41509 11.8538 6.15094L11.3632 7.00943Z"
              fill="#67C23A"
            />
            <rect
              x="0.5"
              y="0.5"
              width="14"
              height="14"
              rx="7"
              stroke="white"
            />
          </svg>
        </span>
        <span
          v-else-if="JSON.parse(isCompanyUser.toLowerCase())"
          class="el-dropdown-link relative"
        >
          <el-avatar
            :size="35"
            :src="userAvatar"
          >
          </el-avatar>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            class="absolute bottom-0 right-0"
          >
            <rect
              x="0.5"
              y="0.5"
              width="14"
              height="14"
              rx="7"
              fill="black"
              fill-opacity="0.8"
            />
            <path
              d="M7.5 1C3.88208 1 1 3.88208 1 7.5C1 11.1179 3.88208 14 7.5 14C11.1179 14 14 11.1179 14 7.5C14 3.88208 11.1179 1 7.5 1ZM11.3019 11.3632H3.57547V10.5047H4.92453V7.00943H5.78302V10.5047H7.31604V5.66038H8.17453V7.62264H10.6274V8.48113H8.17453V10.5047H11.3019V11.3632ZM11.3632 7.00943C9.89151 6.21226 8.60377 5.23113 7.5 3.9434C6.51887 5.10849 5.23113 6.15094 3.63679 7.00943L3.14623 6.15094C4.74057 5.35377 6.08962 4.37264 7.1934 3.14623H7.86792C9.03302 4.43396 10.3821 5.41509 11.8538 6.15094L11.3632 7.00943Z"
              fill="white"
            />
            <rect
              x="0.5"
              y="0.5"
              width="14"
              height="14"
              rx="7"
              stroke="#DCDFE6"
            />
          </svg>
        </span>
        <span
          v-else
          class="el-dropdown-link"
        >
          <el-avatar
            :size="35"
            :src="userAvatar"
          >
          </el-avatar>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <a :href="userProfile">
              <el-dropdown-item> {{ $t('navbar.profile') }} </el-dropdown-item>
            </a>
            <a :href="`/profile/likes/${this.userName}`">
              <el-dropdown-item>
                {{ $t('profile.myCollect') }}
              </el-dropdown-item>
            </a>
            <a href="/settings/profile">
              <el-dropdown-item>
                {{ $t('navbar.editProfile') }}
              </el-dropdown-item>
            </a>
            <a href="/models/new">
              <el-dropdown-item divided>
                + {{ $t('navbar.newModel') }}
              </el-dropdown-item>
            </a>
            <a href="/datasets/new">
              <el-dropdown-item>
                + {{ $t('navbar.newDataset') }}
              </el-dropdown-item>
            </a>
            <a href="/codes/new">
              <el-dropdown-item>
                + {{ $t('navbar.newCode') }}
              </el-dropdown-item>
            </a>
            <a href="/spaces/new">
              <el-dropdown-item>
                + {{ $t('navbar.newApplicationSpace') }}
              </el-dropdown-item>
            </a>
            <a href="/organizations/new">
              <el-dropdown-item divided>
                {{ $t('navbar.newOrganization') }}
              </el-dropdown-item>
            </a>
            <a href="/logout">
              <el-dropdown-item divided>
                {{ $t('navbar.logout') }}
              </el-dropdown-item>
            </a>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <!-- not logged in: 登录注册按钮 -->
      <button
        v-else
        class="bg-[#303133] rounded-[100px] py-[2px] px-[12px] flex items-center justify-center text-[12px] font-500 text-white leading-[20px]"
      >
        <a
          class="sm:hidden"
          href="/login"
        >
          {{ $t('navbar.loginRegister') }}
        </a>
        <a
          class="hidden sm:block"
          href="/login"
        >
          {{ $t('navbar.login') }}
        </a>
      </button>
    </div>
  </div>
</template>

<script setup>
  import Model from './model.vue'
  import Dataset from './dataset.vue'
  import Space from './space.vue'
  import CodeNav from './CodeNav.vue'
  import { ref, inject, onMounted } from 'vue'
  import jwtFetch from '../../packs/jwtFetch.js'

  const props = defineProps({
    logo: String,
    avatar: String,
    starChainUrl: String,
    isCompanyUser: String,
    companyVerified: String,
    phone: String,
    isLoggedIn: String,
    userName: String
  })

  const isLoggedInBoolean = ref(JSON.parse(props.isLoggedIn.toLowerCase()))
  const userProfile = ref(`/profile/${props.userName}`)
  const userAvatar = ref(props.avatar)
  const csghubServer = inject('csghubServer')

  const handleLocaleChange = (locale) => {
    location.href = `/${locale}/settings/locale`
  }

  onMounted(() => {
    jwtFetch(`${csghubServer}/api/v1/user/${props.userName}`, {
        method: 'GET',
      })
        .then((res) => res.json())
        .then((body) => {
          userAvatar.value = body.data.avatar
        })
  })
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
