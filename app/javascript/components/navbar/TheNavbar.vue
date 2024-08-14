<template>
  <div
    class="flex text-[#303133] justify-between items-center max-w-[1280px] m-auto xl:mx-[20px] h-[80px] sm:h-[60px]">
    <!-- 平台 logo -->
    <div class="flex">
      <div class="py-2 mr-[100px] sm:mr-[30px]">
        <a href="/">
          <img
            :src="logo"
            alt="OpenCSG Logo"
            class="w-[135px] sm:w-[90px]" />
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
        <li class="px-5 mlg:!hidden lg:!hidden"><collection></collection></li>
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
            <el-dropdown-item class="!hidden lg:!flex">
              <collection></collection>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <el-dropdown
        class="pr-4 sm:px-[15px]"
        @command="handleLocaleChange">
        <span class="flex items-center text-base outline-none">
          <svg
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 24 24"
            width="1.2em"
            height="1.2em"
            data-v-12008bb2="">
            <path
              fill="currentColor"
              d="m18.5 10l4.4 11h-2.155l-1.201-3h-4.09l-1.199 3h-2.154L16.5 10h2zM10 2v2h6v2h-1.968a18.222 18.222 0 0 1-3.62 6.301a14.864 14.864 0 0 0 2.336 1.707l-.751 1.878A17.015 17.015 0 0 1 9 13.725a16.676 16.676 0 0 1-6.201 3.548l-.536-1.929a14.7 14.7 0 0 0 5.327-3.042A18.078 18.078 0 0 1 4.767 8h2.24A16.032 16.032 0 0 0 9 10.877a16.165 16.165 0 0 0 2.91-4.876L2 6V4h6V2h2zm7.5 10.885L16.253 16h2.492L17.5 12.885z"></path>
          </svg>
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
        class="pl-1">
        <span
          v-if="JSON.parse(companyVerified.toLowerCase())"
          class="el-dropdown-link relative">
          <el-avatar
            :size="35"
            :src="userAvatar">
          </el-avatar>
          <SvgIcon name="verified_company" />
        </span>
        <span
          v-else-if="JSON.parse(isCompanyUser.toLowerCase())"
          class="el-dropdown-link relative">
          <el-avatar
            :size="35"
            :src="userAvatar">
            <SvgIcon name="company" />
          </el-avatar>
        </span>
        <span
          v-else
          class="el-dropdown-link">
          <el-avatar
            :size="35"
            :src="userAvatar">
          </el-avatar>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <a :href="userProfile">
              <el-dropdown-item> {{ $t('navbar.profile') }} </el-dropdown-item>
            </a>
            <a :href="`/profile/likes/${userName}`">
              <el-dropdown-item>
                {{ $t('profile.myCollect') }}
              </el-dropdown-item>
            </a>
            <a href="/settings/profile">
              <el-dropdown-item>
                {{ $t('navbar.editProfile') }}
              </el-dropdown-item>
            </a>
            <a
              v-if="hasEmail"
              href="/models/new">
              <el-dropdown-item divided>
                + {{ $t('navbar.newModel') }}
              </el-dropdown-item>
            </a>
            <a
              v-if="hasEmail"
              href="/datasets/new">
              <el-dropdown-item>
                + {{ $t('navbar.newDataset') }}
              </el-dropdown-item>
            </a>
            <a
              v-if="hasEmail"
              href="/codes/new">
              <el-dropdown-item>
                + {{ $t('navbar.newCode') }}
              </el-dropdown-item>
            </a>
            <a
              v-if="hasEmail"
              href="/spaces/new">
              <el-dropdown-item>
                + {{ $t('navbar.newApplicationSpace') }}
              </el-dropdown-item>
            </a>
            <a href="/collections/new">
              <el-dropdown-item>
                + {{ $t('navbar.newCollection') }}
              </el-dropdown-item>
            </a>
            <a
              v-if="hasEmail"
              href="/organizations/new">
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
        class="bg-[#303133] rounded-[100px] py-[2px] px-[12px] flex items-center justify-center text-[12px] font-500 text-white leading-[20px]">
        <a
          class="sm:hidden"
          href="/login">
          {{ $t('navbar.loginRegister') }}
        </a>
        <a
          class="hidden sm:block"
          href="/login">
          {{ $t('navbar.login') }}
        </a>
      </button>
    </div>
  </div>

  <el-alert
    v-if="!hasEmail && isLoggedInBoolean && userTokenValid"
    :title="$t('navbar.emailMissing')"
    center
    show-icon
    type="warning"></el-alert>
</template>

<script setup>
  import Model from './model.vue'
  import Dataset from './dataset.vue'
  import Space from './space.vue'
  import CodeNav from './CodeNav.vue'
  import Collection from './Collection.vue'
  import { ref, onMounted, watch } from 'vue'
  import useFetchApi from '../../packs/useFetchApi'
  import useUserStore from '../../stores/UserStore.js'
  import { useCookies } from 'vue3-cookies'

  const { cookies } = useCookies()

  const props = defineProps({
    logo: String,
    starChainUrl: String,
    isCompanyUser: String,
    companyVerified: String,
    phone: String,
    isLoggedIn: String,
    userName: String
  })

  const userTokenValid = cookies.get('user_token_valid') === 'true'
  const hasEmail = ref(true)
  const userStore = useUserStore()

  watch(
    () => userStore.email,
    (email, _) => {
      hasEmail.value = !!email ? true : false
    }
  )

  const isLoggedInBoolean = ref(JSON.parse(props.isLoggedIn.toLowerCase()))
  const userProfile = ref(`/profile/${props.userName}`)
  const userAvatar = ref(props.avatar)

  const handleLocaleChange = (locale) => {
    location.href = `/${locale}/settings/locale`
  }

  const fetchUser = async () => {
    const { data } = await useFetchApi(`/user/${props.userName}`).json()
    if (data.value) {
      const body = data.value
      userAvatar.value = body.data.avatar
      userStore.initialize(body.data)
    }
  }

  onMounted(() => {
    if (props.userName) {
      fetchUser()
    }
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
