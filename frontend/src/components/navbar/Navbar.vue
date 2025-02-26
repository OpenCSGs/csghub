<template>
  <div class="border-b sticky top-0 z-[999] csg-navbar bg-white border-gray-200">
    <div
      class="page-responsive-width flex text-gray-700 justify-between items-center h-20 sm:h-15 gap-6 md:px-5">
      <!-- pc logo -->
      <div class="flex">
        <a href="/">
          <img
            :src="logo"
            alt="OpenCSG Logo"
            class="w-[99px]" />
        </a>
      </div>
      <!-- pc menu -->
      <div
        class="flex items-center justify-end gap-1 flex-grow md:gap-0 md:hidden"
        id="pc-menu">
        <el-menu
          :default-active="activeIndex"
          mode="horizontal"
          :ellipsis="false"
          :popper-offset="26"
          style="
            --el-menu-base-level-padding: 12px;
            --el-menu-item-font-size: 16px;
            --el-menu-item-font-weight: 400;
            --el-menu-item-height: 46px;
            --el-menu-hover-text-color: var(--Brand-400);
            --el-menu-hover-bg-color: var(--Gray-50);
            --el-menu-item-hover-bg-color: var(--Gray-50);
          "
          class="w-full el-menu-nav flex items-center gap-1"
          text-color="'var(--Gray-600)'">
          <MenuItems
            :isLoggedInBoolean="isLoggedInBoolean"
            :starChainUrl="starChainUrl"
            :hasEmail="hasEmail" />
        </el-menu>
      </div>
      <!-- pc i18n/avatar/avatar dropdown menu -->
      <div class="flex gap-4 md:gap-2 items-center">
        <!-- i18n -->
        <el-dropdown @command="handleLocaleChange">
          <span class="flex items-center text-base outline-none">
            <SvgIcon name="navbar-language" />
            <el-icon class="el-icon--right">
              <arrow-down />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu popper-class="z-[10000]">
              <el-dropdown-item command="zh">中文</el-dropdown-item>
              <el-dropdown-item command="en">English</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

        <!-- logged in avatar dropdown -->
        <el-dropdown
          v-if="isLoggedInBoolean"
          class="pl-1">
          <!-- verified_company_user/company_user/user -->
          <span
            v-if="companyVerified"
            class="el-dropdown-link relative">
            <el-avatar
              :size="35"
              :src="userAvatar">
            </el-avatar>
            <SvgIcon name="verified_company" height="15px" width="15px" class="absolute right-0 top-[25px]" />
          </span>
          <span
            v-else-if="isCompanyUser"
            class="el-dropdown-link relative">
            <el-avatar
              :size="35"
              :src="userAvatar">
            </el-avatar>
            <SvgIcon name="company" height="15px" width="15px" class="absolute right-0 top-[25px]" />
          </span>
          <span
            v-else
            class="el-dropdown-link">
            <el-avatar
              :size="35"
              :src="userAvatar">
            </el-avatar>
          </span>
          <!-- avatar dropdown menu -->
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>
                <a :href="`/profile/${username}`">
                  <div class="flex flex-row items-center gap-2">
                    <el-avatar :size="40" :src="userAvatar"></el-avatar>
                    <div class="flex flex-col">
                    <span class="text-sm font-medium text-gray-700">{{ nickname }}</span>
                    <span class="text-sm font-light  text-gray-600">@{{ username }}</span>
                    </div>
                  </div>
                </a>
              </el-dropdown-item>
              <el-dropdown-item divided>
                <a :href="`/profile/${username}`">
                  <div class="flex items-center gap-2">
                    <SvgIcon name="navbar-profile" />
                    {{ $t('navbar.profile') }}
                  </div>
                </a>
              </el-dropdown-item>
              <a :href="`/profile/likes/${username}`">
                <el-dropdown-item>
                  <div class="flex items-center gap-2">
                    <SvgIcon name="navbar-collection" />
                    {{ $t('profile.myCollect') }}
                  </div>
                </el-dropdown-item>
              </a>
              <a href="/settings/profile">
                <el-dropdown-item>
                  <div class="flex items-center gap-2">
                    <SvgIcon name="navbar-setting" />
                    {{ $t('navbar.setting') }}
                  </div>
                </el-dropdown-item>
              </a>
              <a href="/resource-console">
                <el-dropdown-item>
                  <div class="flex items-center gap-2">
                    <SvgIcon name="navbar-resource-console" />
                    {{ $t('navbar.console') }}
                  </div>
                </el-dropdown-item>
              </a>
              <a v-if="isAdmin"
                  href="/admin_panel">
                  <el-dropdown-item>
                    <div class="flex items-center gap-2">
                      <SvgIcon name="navbar-admin" />
                      {{ $t('navbar.adminPanel') }}
                    </div>
                </el-dropdown-item>
              </a>
              <!-- <a
                :href="starcloudUrl"
                target="_blank">
                <el-dropdown-item> {{ $t('navbar.source') }} </el-dropdown-item>
              </a> -->
              <a v-if="hasEmail"
                 href="/models/new">
                <el-dropdown-item divided>
                  <div class="flex items-center gap-2">
                    <SvgIcon name="navbar-new" />
                    {{ $t('navbar.newModel') }}
                  </div>
                </el-dropdown-item>
              </a>
              <a v-if="hasEmail"
                 href="/datasets/new">
                <el-dropdown-item>
                  <div class="flex items-center gap-2">
                    <SvgIcon name="navbar-new" />
                    {{ $t('navbar.newDataset') }}
                  </div>
                </el-dropdown-item>
              </a>
              <a v-if="hasEmail"
                 href="/codes/new">
                <el-dropdown-item>
                  <div class="flex items-center gap-2">
                    <SvgIcon name="navbar-new" />
                    {{ $t('navbar.newCode') }}
                  </div>
                </el-dropdown-item>
              </a>
              <a v-if="hasEmail"
                 href="/spaces/new">
                <el-dropdown-item>
                  <div class="flex items-center gap-2">
                    <SvgIcon name="navbar-new" />
                    {{ $t('navbar.newApplicationSpace') }}
                  </div>
                </el-dropdown-item>
              </a>
              <a v-if="hasEmail"
                href="/collections/new">
                <el-dropdown-item>
                  <div class="flex items-center gap-2">
                    <SvgIcon name="navbar-new" />
                    {{ $t('navbar.newCollection') }}
                  </div>
                </el-dropdown-item>
              </a>
              <a v-if="hasEmail"
                 href="/organizations/new">
                <el-dropdown-item divided>
                  <div class="flex items-center gap-2">
                    <SvgIcon name="navbar-neworganization" />
                    {{ $t('navbar.newOrganization') }}
                  </div>
                </el-dropdown-item>
              </a>
              <a
                href="/daily_papers/new"
                v-if="canCreateDailyPaper">
                <el-dropdown-item>
                  <div class="flex items-center gap-2">
                    <SvgIcon name="navbar-daily-paper" />
                    {{ $t('navbar.recommendation') }}
                  </div>
                </el-dropdown-item>
              </a>
              <a @click="clearCookies">
                <el-dropdown-item divided>
                  <div class="flex items-center gap-2">
                    <SvgIcon name="navbar-logout" />
                    {{ $t('navbar.logout') }}
                  </div>
                </el-dropdown-item>
              </a>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <!-- not logged in -->
        <template v-else>
          <div
            class="md:hidden min-w-[91px]">
            <a href="/login" class="btn btn-primary btn-md">{{ $t('navbar.loginRegister') }}</a>
          </div>
          <a
            class="hidden md:block text-sm font-500"
            href="/login">
            {{ $t('navbar.loginRegister') }}
          </a>
        </template>
        <div class="hidden md:block">
          <div class="w-[40px] h-[40px]">
            <SvgIcon
              v-if="!mobileMenuVisibility"
              name="menu"
              class="p-[8px]"
              @click="mobileMenuVisibility = !mobileMenuVisibility" />
            <SvgIcon
              v-else
              name="close_menu"
              class="p-[8px]"
              @click="mobileMenuVisibility = !mobileMenuVisibility" />
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- mobile menu -->
  <el-drawer
    :z-index="998"
    v-model="mobileMenuVisibility"
    :size="320"
    :with-header="false"
    direction="rtl"
    style="--el-dialog-padding-primary: 12px 0px"
    class="mobile-menu">
    <el-menu
      :default-active="activeIndex"
      :ellipsis="false"
      class="w-full flex flex-col justify-center gap-4 pt-16"
      unique-opened
      style="
        --el-menu-base-level-padding: 12px;
        --el-menu-item-font-size: 16px;
        --el-menu-item-font-weight: 400;
        --el-menu-item-height: auto;
      "
      text-color="#475467"
    >
      <MenuItems
        :isLoggedInBoolean="isLoggedInBoolean"
        :starChainUrl="starChainUrl"
        :hasEmail="hasEmail"
      />
    </el-menu>
  </el-drawer>

  <el-alert
    v-if="!hasEmail && isLoggedInBoolean"
    :title="$t('navbar.emailMissing')"
    center
    show-icon
    type="warning"
  >
    <a href="/settings/profile" class="underline text-sm"> {{ $t('navbar.profileEdit') }} </a>
  </el-alert>

  <el-alert
    v-if="true"
    :title="$t('navbar.usernameNeedChange')"
    center
    show-icon
    type="warning"
  >
    <a href="/settings/profile" class="underline text-sm"> {{ $t('navbar.profileEdit') }} </a>
  </el-alert>

  <Broadcast />
</template>

<script>
  import MenuItems from './MenuItems.vue'
  import useUserStore from '../../stores/UserStore.js'
  import { inject } from 'vue'
  import useFetchApi from '../../packs/useFetchApi.js'
  import { mapState } from 'pinia'
  import { useCookies } from "vue3-cookies"
  import { ElMessage } from 'element-plus'
  import Broadcast from './Broadcast.vue'

  export default {
    props: {
      logo: String,
      isLoggedIn: String,
      starChainUrl: String
    },
    data() {
      const classParam = new URLSearchParams(window.location.search).get(
        'class'
      )
      const { cookies } = useCookies()
      return {
        activeIndex: classParam
          ? `${window.location.pathname}?class=${classParam}`
          : window.location.pathname,
        isLoggedInBoolean: !!cookies.get('login_identity'),
        mobileMenuVisibility: false,
        userAvatar: this.avatar,
        userStore: useUserStore(),
        isCompanyUser: false,
        companyVerified: false,
        canCreateDailyPaper: false,
        csghubServer: inject('csghubServer'),
        uuid: cookies.get('login_identity'),
        hasEmail: true
      }
    },
    components: {
      MenuItems,
      Broadcast
    },
    computed: {
      ...mapState(useUserStore, ['email', 'username', 'nickname', 'initialized','isAdmin']),
    },
    watch: {
      initialized(_) {
        this.hasEmail = !!this.email
      },
      email(newEmail, _) {
        this.hasEmail = !!newEmail
      }
    },
    methods: {
      showDialog() {
        this.$refs.child.showDialog()
      },
      handleLocaleChange(locale) {
        location.href = `/${locale}/settings/locale`
      },
      async fetchUser() {
        const {data, error} = await useFetchApi(`/user/${this.uuid}?type=uuid`).json()
        if (data.value) {
          this.userAvatar = data.value.data.avatar
          this.userStore.initialize(data.value.data)
        } else {
          ElMessage.warning(error.value.msg)
        }
      },
      clearCookies() {
        const { cookies } = useCookies()
        cookies.keys().forEach((cookie) => {
          cookies.remove(cookie)
        })
        window.location.href = '/'
      },
    },
    mounted() {
      if (this.uuid) {
        this.fetchUser()
      }
    }
  }
</script>

<style scoped>
  .el-menu-nav {
    border: none !important;
  }
  .navbar {
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
  }
  .popper-submenu .el-menu {
    min-width: 200px;
    padding: var(--el-menu-base-level-padding);
    .el-menu-item {
      font-size: 16px;
      height: 46px;
      line-height: 24px;
    }
  }
  :deep(.el-dropdown-menu__item) {
    padding: 8px !important;
    margin-left: 8px !important;
    margin-right: 8px !important;
  }
  :deep(.el-dropdown-menu__item:hover) {
    background-color: rgb(249 250 251) !important;
    border-radius: 6px !important;
    color: #182230 !important;
  }
  :deep(.el-alert__icon) {
    height: 14px !important;
    width: 14px !important;
  }
  :deep(.el-alert__content) {
    flex-direction: row;
    font-size: 14px !important;
    gap: 8px;
  }
  :deep(.el-alert__title) {
    font-size: 14px !important;
  }
  :deep(.el-alert__description) {
    font-size: 14px !important;
  }
</style>
