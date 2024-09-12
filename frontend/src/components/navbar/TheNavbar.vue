<template>
  <div class="bg-white sticky top-0 z-[999]">
    <div
      class="flex text-[#303133] justify-between items-center max-w-[1320px] px-[20px] m-auto h-[80px] sm:h-[60px] gap-[40px]">
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
        class="flex items-center justify-end gap-4 w-[calc(100%-99px-40px-40px-158px)] md:gap-0 md:hidden"
        id="pc-menu">
        <el-menu
          :default-active="activeIndex"
          mode="horizontal"
          :ellipsis="false"
          :popper-offset="26"
          style="
            --el-menu-base-level-padding: 12px;
            --el-menu-item-font-size: 14px;
            --el-menu-item-font-weight: 500;
            --el-menu-item-height: 36px;
            --el-menu-hover-text-color: var(--Brand-400);
          "
          class="w-full el-menu-nav flex items-center gap-[16px]"
          text-color="#475467">
          <MenuItems
            :isLoggedInBoolean="isLoggedInBoolean"
            :starChainUrl="starChainUrl"
            :hasEmail="hasEmail" />
        </el-menu>
      </div>
      <!-- pc i18n/avatar/avatar dropdown menu -->
      <div class="flex gap-[16px] md:gap-[8px] items-center">
        <!-- i18n -->
        <el-dropdown @command="handleLocaleChange">
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
            v-if="JSON.parse(companyVerified.toLowerCase())"
            class="el-dropdown-link relative">
            <el-avatar
              :size="35"
              :src="userAvatar">
            </el-avatar>
            <SvgIcon name="verified_company" height="15px" width="15px" class="absolute right-0 top-[25px]" />
          </span>
          <span
            v-else-if="JSON.parse(isCompanyUser.toLowerCase())"
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
              <a :href="userProfile">
                <el-dropdown-item>
                  {{ $t('navbar.profile') }}
                </el-dropdown-item>
              </a>
              <a :href="`/profile/likes/${this.userName}`">
                <el-dropdown-item>
                  {{ $t('profile.myCollect') }}
                </el-dropdown-item>
              </a>
              <a href="/settings/profile">
                <el-dropdown-item>
                  {{ $t('navbar.setting') }}
                </el-dropdown-item>
              </a>
              <a href="/resource-console">
                <el-dropdown-item>
                  {{ $t('navbar.console') }}
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
                  + {{ $t('navbar.newModel') }}
                </el-dropdown-item>
              </a>
              <a v-if="hasEmail"
                 href="/datasets/new">
                <el-dropdown-item>
                  + {{ $t('navbar.newDataset') }}
                </el-dropdown-item>
              </a>
              <a v-if="hasEmail"
                 href="/codes/new">
                <el-dropdown-item>
                  + {{ $t('navbar.newCode') }}
                </el-dropdown-item>
              </a>
              <a v-if="hasEmail"
                 href="/spaces/new">
                <el-dropdown-item>
                  + {{ $t('navbar.newApplicationSpace') }}
                </el-dropdown-item>
              </a>
              <a v-if="hasEmail"
                href="/collections/new">
                <el-dropdown-item>
                  + {{ $t('navbar.newCollection') }}
                </el-dropdown-item>
              </a>
              <a v-if="hasEmail"
                 href="/organizations/new">
                <el-dropdown-item divided>
                  {{ $t('navbar.newOrganization') }}
                </el-dropdown-item>
              </a>
              <a
                href="/daily_papers/new"
                v-if="canCreateDailyPaper">
                <el-dropdown-item>
                  {{ $t('navbar.recommendation') }}
                </el-dropdown-item>
              </a>
              <a @click="clearCookies">
                <el-dropdown-item divided>
                  {{ $t('navbar.logout') }}
                </el-dropdown-item>
              </a>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <!-- not logged in -->
        <template v-else>
          <div
            class="px-[14px] py-[10px] text-[16px] font-500 leading-[24px] md:hidden btn btn-primary">
            <a href="/login">{{ $t('navbar.loginRegister') }}</a>
          </div>
          <a
            class="hidden md:block text-[14px] font-500"
            href="/login">
            {{ $t('navbar.loginRegister') }}
          </a>
        </template>
        <div class="flex md:block hidden">
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
      class="w-full flex flex-col gap-[8px] justify-center gap-[16px] pt-[60px]"
      unique-opened
      style="
        --el-menu-base-level-padding: 12px;
        --el-menu-item-font-size: 16px;
        --el-menu-item-font-weight: 500;
        --el-menu-item-height: auto;
      "
      text-color="#475467">
      <MenuItems
        :isLoggedInBoolean="isLoggedInBoolean"
        :starChainUrl="starChainUrl"
        :hasEmail="hasEmail" />
    </el-menu>
  </el-drawer>

  <el-alert
    v-if="!hasEmail && isLoggedInBoolean && userTokenValid()"
    :title="$t('navbar.emailMissing')"
    center
    show-icon
    type="warning"></el-alert>
</template>

<script>
  import MenuItems from './MenuItems.vue'
  import useUserStore from '../../stores/UserStore.js'
  import { inject } from 'vue'
  import jwtFetch from '../../packs/jwtFetch.js'
  import { mapState } from 'pinia'
  import { useCookies } from "vue3-cookies"

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
      const classParam = new URLSearchParams(window.location.search).get(
        'class'
      )
      return {
        activeIndex: classParam
          ? `${window.location.pathname}?class=${classParam}`
          : window.location.pathname,
        isLoggedInBoolean: JSON.parse(this.isLoggedIn.toLowerCase()),
        userProfile: `/profile/${this.userName}`,
        mobileMenuVisibility: false,
        userAvatar: this.avatar,
        userStore: useUserStore(),
        csghubServer: inject('csghubServer'),
        hasEmail: true
      }
    },
    components: {
      MenuItems
    },
    computed: {
      ...mapState(useUserStore, ['email']),
    },
    watch: {
      email(newEmail, _) {
        this.hasEmail = !!newEmail
      }
    },
    methods: {
      userTokenValid() {
        const { cookies } = useCookies()
        return cookies.get('user_token_valid') === 'true'
      },
      showDialog() {
        this.$refs.child.showDialog()
      },
      handleLocaleChange(locale) {
        location.href = `/internal_api/${locale}/settings/locale`
      },
      async fetchUser() {
        jwtFetch(`${this.csghubServer}/api/v1/user/${this.userName}`, {
          method: 'GET',
        }).then((res) => res.json())
          .then((body) => {
          this.userAvatar = body.data.avatar
          this.userStore.initialize(body.data)
        })
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
      if (this.userName) {
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
      height: auto;
      line-height: 24px;
    }
  }
</style>
