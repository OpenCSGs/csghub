<template>
  <UpdateUsername />
  <div
    class="border-b sticky top-0 z-[999]"
    :class="`bg-${theme} ${
      theme === 'black' ? 'border-gray-950' : 'border-gray-200'
    }`"
  >
    <div
      class="page-responsive-width flex text-gray-700 justify-between items-center h-20 sm:h-15 gap-6 md:px-5">
      <!-- pc logo -->
      <div class="flex">
        <a href="/">
          <img
            :src="logo || '/images/OpenCSG_logo.svg'"
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
            :isLoggedInBoolean="isLoggedIn"
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
              <el-dropdown-item command="zh">简体中文</el-dropdown-item>
              <el-dropdown-item command="zhHant">繁體中文</el-dropdown-item>
              <el-dropdown-item command="en">English</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

        <!-- logged in avatar dropdown -->
        <el-dropdown
          v-if="cookies.get('login_identity')"
          class="pl-1"
          placement="bottom-start"
          popper-class="avatar-dropdown"
        >
          <!-- verified_company_user/company_user/user -->
          <span
            v-if="false"
            class="el-dropdown-link relative">
            <el-avatar
              :size="36"
              :src="avatar">
            </el-avatar>
            <SvgIcon
              name="verified_company"
              height="15px"
              width="15px"
              class="absolute right-0 top-6"
            />
          </span>
          <span
            v-else-if="false"
            class="el-dropdown-link relative">
            <el-avatar
              :size="36"
              :src="avatar">
            </el-avatar>
            <SvgIcon
              name="company"
              height="15px"
              width="15px"
              class="absolute right-0 top-6"
            />
          </span>
          <span
            v-else
            class="el-dropdown-link">
            <el-avatar
              :size="36"
              :src="avatar">
            </el-avatar>
          </span>
          <!-- avatar dropdown menu -->
          <template #dropdown>
            <el-dropdown-menu style="max-height: 88vh; min-height: 360px; overflow-y: auto; overscroll-behavior: contain; scrollbar-width: thin; scrollbar-color: #D0D5DD transparent;">
              <el-dropdown-item>
                <a :href="`/profile/${username}`">
                  <div class="flex flex-row items-center gap-2">
                    <el-avatar :size="40" :src="avatar"></el-avatar>
                    <div class="flex flex-col min-w-0">
                      <span class="text-sm font-medium text-gray-700 truncate">{{ nickname }}</span>
                      <span class="text-sm font-light text-gray-600 truncate">@{{ username }}</span>
                    </div>
                  </div>
                </a>
              </el-dropdown-item>
              <a :href="`/profile/${username}`">
                <el-dropdown-item>
                  <div class="flex items-center w-fit gap-2">
                    <SvgIcon name="navbar-profile" />
                    {{ $t('navbar.profile') }}
                  </div>
                </el-dropdown-item>
              </a>
              <a :href="`/profile/likes/${username}`">
                <el-dropdown-item>
                  <div class="flex items-center w-fit gap-2">
                    <SvgIcon name="navbar-collection" />
                    {{ $t('profile.myCollect') }}
                  </div>
                </el-dropdown-item>
              </a>
              <a href="/settings/profile">
                <el-dropdown-item>
                  <div class="flex items-center w-fit gap-2">
                    <SvgIcon name="navbar-setting" />
                    {{ $t('navbar.setting') }}
                  </div>
                </el-dropdown-item>
              </a>
              <a
                v-if="!actionLimited"
                href="/datapipelines">
                <el-dropdown-item>
                  <div class="flex items-center w-fit gap-2">
                    <SvgIcon name="navbar-datapipelines" />
                    {{ $t('navbar.datapipelines') }}
                  </div>
                </el-dropdown-item>
              </a>
              <a v-if="!actionLimited"
                href="/resource-console">
                <el-dropdown-item>
                  <div class="flex items-center w-fit gap-2">
                    <SvgIcon name="navbar-resource-console" />
                    {{ $t('navbar.console') }}
                  </div>
                </el-dropdown-item>
              </a>
              <a v-if="isAdmin && !actionLimited"
                  href="/admin_panel">
                  <el-dropdown-item>
                    <div class="flex items-center w-fit gap-2">
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
              <a v-if="!actionLimited"
                 href="/models/new">
                <el-dropdown-item divided>
                  <div class="flex items-center w-fit gap-2">
                    <SvgIcon name="navbar-new" />
                    {{ $t('navbar.newModel') }}
                  </div>
                </el-dropdown-item>
              </a>
              <a v-if="!actionLimited"
                 href="/datasets/new">
                <el-dropdown-item>
                  <div class="flex items-center w-fit gap-2">
                    <SvgIcon name="navbar-new" />
                    {{ $t('navbar.newDataset') }}
                  </div>
                </el-dropdown-item>
              </a>
              <a v-if="!actionLimited"
                 href="/codes/new">
                <el-dropdown-item>
                  <div class="flex items-center w-fit gap-2">
                    <SvgIcon name="navbar-new" />
                    {{ $t('navbar.newCode') }}
                  </div>
                </el-dropdown-item>
              </a>
              <a v-if="!actionLimited"
                 href="/spaces/new">
                <el-dropdown-item>
                  <div class="flex items-center w-fit gap-2">
                    <SvgIcon name="navbar-new" />
                    {{ $t('navbar.newApplicationSpace') }}
                  </div>
                </el-dropdown-item>
              </a>
              <a v-if="!actionLimited"
                 href="/mcp/servers/new">
                <el-dropdown-item>
                  <div class="flex items-center w-fit gap-2">
                    <SvgIcon name="navbar-new" />
                    {{ $t('navbar.newMcpServer') }}
                  </div>
                </el-dropdown-item>
              </a>
              <a v-if="!actionLimited"
                href="/collections/new">
                <el-dropdown-item>
                  <div class="flex items-center w-fit gap-2">
                    <SvgIcon name="navbar-new" />
                    {{ $t('navbar.newCollection') }}
                  </div>
                </el-dropdown-item>
              </a>
              <a v-if="!actionLimited"
                 href="/organizations/new">
                <el-dropdown-item divided>
                  <div class="flex items-center w-fit gap-2">
                    <SvgIcon name="navbar-neworganization" />
                    {{ $t('navbar.newOrganization') }}
                  </div>
                </el-dropdown-item>
              </a>
              <div>
                <el-dropdown-item @click="showMsgListHandle">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <SvgIcon name="navbar-message" />
                      {{ $t('navbar.message') }}
                    </div>
                    <div v-if="msgNum>0" class="flex items-center gap-[4px] py-[2px] px-[6px] border border-gray-300 rounded-sm shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] ml-[16px]">
                      <SvgIcon name="dot-ico" class="w-[8px] h-[8px]" />
                      {{msgNum||0}}
                    </div>
                  </div>
                </el-dropdown-item>
              </div>
              <a
                href="/daily_papers/new"
                v-if="canCreateDailyPaper">
                <el-dropdown-item>
                  <div class="flex items-center w-fit gap-2">
                    <SvgIcon name="navbar-daily-paper" />
                    {{ $t('navbar.recommendation') }}
                  </div>
                </el-dropdown-item>
              </a>
              <a @click="clearCookies">
                <el-dropdown-item divided>
                  <div class="flex items-center w-fit gap-2">
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
      class="w-full flex flex-col justify-center pt-16"
      unique-opened
      style="
        --el-menu-base-level-padding: 12px;
        --el-menu-item-font-size: 16px;
        --el-menu-item-font-weight: 400;
        --el-menu-item-height: auto;
      "
      text-color="gray-600"
    >
      <MenuItems
        :isLoggedInBoolean="isLoggedIn"
        :starChainUrl="starChainUrl"
        :hasEmail="hasEmail"
      />
    </el-menu>
  </el-drawer>

  <el-alert
    v-if="initialized && isLoggedIn && !hasEmail && !canChangeUserName"
    :title="$t('navbar.emailMissing')"
    center
    show-icon
    type="warning"
  >
    <a href="/settings/profile" class="underline text-sm"> {{ $t('navbar.profileEdit') }} </a>
  </el-alert>

  <el-alert
    v-if="initialized && isLoggedIn && canChangeUserName && hasEmail"
    :title="$t('navbar.usernameNeedChange')"
    center
    show-icon
    type="warning"
  >
    <a href="/settings/profile" class="underline text-sm"> {{ $t('navbar.profileEdit') }} </a>
  </el-alert>

  <el-alert
    v-if="initialized && isLoggedIn && canChangeUserName && !hasEmail"
    :title="$t('navbar.emailAndUsernameMissing')"
    center
    show-icon
    type="warning"
  >
    <a href="/settings/profile" class="underline text-sm"> {{ $t('navbar.profileEdit') }} </a>
  </el-alert>

  <el-dialog
    v-model="hasNewMassage"
    width="400"
    custom-class="top-right-dialog"
    :modal="false"
    :close-on-click-modal="false"
    style="top: 20px !important; right: 20px !important; margin: 0 !important; position: fixed;"
  >
    <template #header>
      <div class="headerCont flex md:block items-start justify-start gap-[16px]">
        <SvgIcon name="alert-message" class="w-[40px] h-[40px] md:mb-[12px]" />
        <div>
          <p class="text-gray-900 text-sm font-medium mb-[4px]">{{ newMsg.title }}</p>
          <p class="text-gray-600 text-sm font-light line-clamp-2">{{ newMsg.content }}</p>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="flex items-center justify-start gap-[12px] text-xs">
        <CsgButton class="btn btn-link-gray btn-md" @click="closeNewMsgMask" :name="$t('navbar.later')"/>
        <CsgButton class="btn btn-link-color btn-md" @click="newMsgShowInfo(1,newMsg)" :name="$t('navbar.showInfo')"/>
      </div>
    </template>
  </el-dialog>

  <el-drawer v-model="showMsgList" :show-close="false" style="max-width: 480px;" class="msgListCont" @close="showSettings=false" @click="showSettings=false">
    <template #header="{ close }">
      <div class="flex items-center justify-between">
        <div class="flex items-center justify-between">
        <div class="flex items-center gap-2 text-lg font-medium text-gray-900">
          {{ $t('navbar.message') }}
        </div>
        <div v-if="msgNum>0" class="flex items-center gap-[4px] py-[2px] px-[6px] border border-gray-300 rounded-sm shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] ml-[16px]">
          <SvgIcon name="dot-ico" class="w-[8px] h-[8px]" />{{msgNum||0}}
        </div>
      </div>
      <div class="flex items-center justify-end gap-[12px]">
        <div class="relative">
          <CsgButton class="btn btn-secondary-gray btn-md" svgName='filter-lines' :name="$t('navbar.msgSettings')" @click.stop="showSettings= !showSettings"/>
          <div class="settingsCont absolute z-10 bottom-[-11px] right-0 bg-white border-gray-200 rounded-sm" :class="{ 'hidden': !showSettings, 'block': showSettings }" @click.stop>
            <el-checkbox-group v-model="sub_notification_type" @change="setMsgSettings">
              <div class="px-[16px] py-[10px] hover:bg-gray-50 cursor-pointer">
                <el-checkbox
                  class="setttingCheckbox"
                  :label="$t('navbar.comment')"
                  value="comment"
                  size="large"
                />
              </div>
              <div class="px-[16px] py-[10px] hover:bg-gray-50 cursor-pointer">
                <el-checkbox
                  class="setttingCheckbox"
                  :label="$t('navbar.system')"
                  value="system"
                  size="large"
                />
              </div>
              <div class="px-[16px] py-[10px] hover:bg-gray-50 cursor-pointer">
                <el-checkbox
                  class="setttingCheckbox"
                  :label="$t('navbar.organization')"
                  value="organization"
                  size="large"
                />
              </div>
              <div class="px-[16px] py-[10px] hover:bg-gray-50 cursor-pointer">
                <el-checkbox
                  class="setttingCheckbox"
                  :label="$t('navbar.asset_management')"
                  value="asset_management"
                  size="large"
                />
              </div>
            </el-checkbox-group>
          </div>
        </div>
        <CsgButton class="btn btn-secondary-gray btn-md" style="padding: 14px !important;" svgName="close" @click="close"/>
      </div>
      </div>
    </template>
    <div class="px-[16px] pb-[12px] pt-1">
      <el-input
        v-model="searchText"
        class="mb-3"
        size="large"
        clearable
        @change="resetList"
        :placeholder="$t('navbar.all')" >
        <template #prefix>
          <el-icon><search /></el-icon>
        </template>
      </el-input>
      <div class="flex items-center justify-between gap-[16px]">
        <el-select
            v-model="selectedFilter"
            style="flex:1;"
            size="large">
            <el-option
              v-for="item in filterOptions"
              :key="item"
              :label="$t(`navbar.${item}`)"
              :value="item" />
        </el-select>
        <el-checkbox
          class="unreadCheckbox"
          v-model="onlyUnread"
          :label="$t('navbar.onlyUnread')"
          size="large"
        />
      </div>
    </div>
      <div class="msg-list-container h-[calc(100vh-200px)] overflow-y-auto" 
        ref="msgListContainer"
        @scroll="handleScroll">
        <div
          v-for="(item, index) in msgList" 
          :key="index"
          @click="newMsgShowInfo(2,item,index)"
          class="p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer">
          <div class="flex items-start justify-between">
            <div class="flex items-center justify-start gap-[12px]">
              <span class="block w-[8px] h-[8px] rounded-full" :class="item.is_read?'':'bg-brand-500'"></span>
              <SvgIcon :name="`${item.notification_type}-message`" class="w-[40px] h-[40px]" />
              <div class="text-sm">
                <p class="text-gray-700 font-medium">{{ item.title }}</p>
                <p class="text-gray-600 font-light">{{ item.click_action_url }}</p>
              </div>
            </div>
            <p class="text-sm text-gray-600 font-light">{{ `${formatTime(item.created_at*1000)}` }}</p>
          </div>
          <p class="mt-[16px] text-gray-600 text-sm line-clamp-2">{{ item.content }}</p>
        </div>
        <div v-if="loading" class="py-4 text-center text-gray-500">
          {{$t('navbar.loading')}}
        </div>
        <div v-if="!msgList.length" class="py-4 text-center text-gray-500">
          {{$t('navbar.noMoreData')}}
        </div>
      </div>
  </el-drawer>

  <el-dialog
    v-model="showMsgInfo"
    width="400"
  >
  {{ msgInfo }}
  </el-dialog>

  <Broadcast />
</template>

<script>
  import { inject } from 'vue'
  import { Search } from '@element-plus/icons-vue'
  import ContactUs from '../form/ContactUs.vue'
  import MenuItems from './MenuItems.vue'
  import useUserStore from '../../stores/UserStore.js'
  import { inject } from 'vue'
  import useFetchApi from '../../packs/useFetchApi.js'
  import { mapActions, mapState } from 'pinia'
  import { useCookies } from "vue3-cookies"
  import { ElMessage } from 'element-plus'
  import Broadcast from './Broadcast.vue'
  import UpdateUsername from '../popup/UpdateUsername.vue'
  import { logout } from '@/packs/auth'
  import {timeSince} from '@/packs/utils'
  import { useI18n } from 'vue-i18n'
  import csrfFetch from '@/packs/csrfFetch'

  export default {
    props: {
      logo: String
    },
    data() {
      const classParam = new URLSearchParams(window.location.search).get(
        'class'
      )
      const { cookies } = useCookies()
      return {
        showSettings: false,
        showMsgList:false,
        hasNewMassage:false,
        isSaaS: isSaas(),
        isEE: isEE(),
        activeIndex: classParam
          ? `${window.location.pathname}?class=${classParam}`
          : window.location.pathname,
        mobileMenuVisibility: false,
        userStore: useUserStore(),
        isCompanyUser: false,
        companyVerified: false,
        canCreateDailyPaper: false,
        csghubServer: inject('csghubServer'),
        uuid: cookies.get('login_identity'),
        cookies: cookies,
        theme: THEME,
        cookies: useCookies().cookies,
        searchText:'',
        filterOptions:['all'],
        msgNum: 0,
        msgList: [],
        currentPage: 1,
        pageSize: 10,
        loading: false,
        noMore: false,
        onlyUnread: false,
        selectedFilter:'all',
        nextTime:0,
        newMsg:null,
        showMsgInfo:false,
        msgInfo:'',
        pollTimer:null,
        sub_notification_type:[]
      }
    },
    components: {
      MenuItems,
      Broadcast,
      UpdateUsername,
      Search
    },
    computed: {
      ...mapState(useUserStore, ['email', 'username', 'nickname', 'avatar', 'initialized','isAdmin', 'isLoggedIn', 'actionLimited', 'hasEmail', 'canChangeUsername'])
    },
    methods: {
      ...mapActions(useUserStore, {clearUserStore: 'clearStore'}),
      showDialog() {
        this.$refs.child.showDialog()
      },
      handleLocaleChange(locale) {
        location.href = `/${locale}/settings/locale`
      },
      async fetchUser() {
        const {data, error} = await useFetchApi(`/user/${this.uuid}?type=uuid`).json()
        if (data.value) {
          this.userStore.initialize(data.value.data)
        } else {
          ElMessage.warning(error.value.msg)
        }
      },
      formatTime(time) {
        return timeSince(time)
      },
      newMsgShowInfo(type,msg,index){ 
        if(type==2&&!msg.is_read){
          this.setMsgRead(msg.id,index)
        }
        if(type==1){
          this.closeNewMsgMask()
        }
        if(msg.click_action_url){
          window.location.href=msg.click_action_url
        }else {
          this.msgInfo=msg.content
          this.showMsgInfo=true
        }
      },
      showMsgListHandle(){
        this.getMsgSettings()
        this.resetList()
        this.showMsgList=true
      },

      async getMsgTypes() {
        const { data, error } = await useFetchApi(
          `/notifications/message-types`
        ).json()
        if (data.value) {
          this.filterOptions=[...this.filterOptions,...data.value.data]
        } else {
          this.filterOptions = []
        }
      },
      async getMsgSettings() {
        const { data, error } = await useFetchApi(
          `/notifications/setting`
        ).json()
        if (data.value) {
          this.sub_notification_type = data.value.data.sub_notification_type?[...data.value.data.sub_notification_type]:[]
        }else  {
          this.sub_notification_type = []
        }
      },
      async setMsgSettings() {
        const options = { body: JSON.stringify({sub_notification_type:[...this.sub_notification_type]}) }
        const { data, error } = await useFetchApi(
          `/notifications/setting`,options
        ).put().json()
        if (data.value) {
          ElMessage.success(this.$t('navbar.settingsSuccess'))
        }else  {
          ElMessage.warning(error.value.msg)
        }
      },
      async setMsgRead(id,index) {
        const options = { body: JSON.stringify({ids:[id]}) }
        const { data, error } = await useFetchApi(
          `/notifications/read`,options
        ).put().json()
        if (data.value) {
          this.msgList[index].is_read = true
        }else  {
          ElMessage.warning(error.value.msg)
        }
      },
      async getMsgNum() {
        const { data, error } = await useFetchApi(
          `/notifications/unread`
        ).json()
        if (data.value) {
          this.msgNum = data.value.data
        }else  {
          this.msgNum = 0
        }
      },
      closeNewMsgMask(){
        this.hasNewMassage = false
        this.getNewMsg()
      },
      async getNewMsg() {
        if (this.pollTimer) {
          clearTimeout(this.pollTimer)
          this.pollTimer = null
        }
        this.getMsgNum()
        const { data, error } = await useFetchApi(
          `/notifications/poll/1`
        ).json()
        if (data.value) {
          this.newMsg = data.value.data.data?.length > 0 ? data.value.data.data[0] : null
          
          const pollTime = new Date(data.value.data.next_poll_time).getTime()
          const now = Date.now()
          
          const delay = Math.max(0, pollTime - now)
          
          this.pollTimer = setTimeout(() => {
            if(!this.hasNewMassage){
              this.getNewMsg()
            }
          }, delay)
          
          if (this.newMsg) {
            this.hasNewMassage = true
            this.showMsgList = false
          }
        } else {
          this.pollTimer = setTimeout(() => {
            if(!this.hasNewMassage){
              this.getNewMsg()
            }
          }, 300000)
        }
      },
      async getMsgList() {
        if (this.loading || this.noMore) return
        
        this.loading = true
        
        try {
          const params = {
            Notification_type: this.selectedFilter=='all'?'':this.selectedFilter,
            page: this.currentPage,
            page_size: this.pageSize,
            title: this.searchText,
            unread_only: this.onlyUnread
          }

          const { data } = await useFetchApi('/notifications', {
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(params)
          }).post().json()

          if (data.value?.data) {
            this.msgNum = data.value.data.unread_count
            this.msgList = [...this.msgList, ...data.value.data.messages]
            this.currentPage++
            
            if (data.value.data.messages.length < this.pageSize) {
              this.noMore = true
            }
          } else {
            this.noMore = true
            this.msgNum = 0
          }
        } catch (error) {
          console.error('获取消息失败:', error)
        } finally {
          this.loading = false
        }
      },

      handleScroll(e) {
        const container = e.target
        const scrollThreshold = 50
        const { scrollTop, scrollHeight, clientHeight } = container
        
        if (scrollTop > this.lastScrollTop && 
            scrollHeight - (scrollTop + clientHeight) < scrollThreshold) {
          this.getMsgList()
        }
        
        this.lastScrollTop = scrollTop
      },

      resetList() {
        this.msgList = []
        this.currentPage = 1
        this.noMore = false
        this.getMsgList()
      },

      async fetchSystemConfig() {
        const res = await csrfFetch('/internal_api/system_config')
        if (res.ok) {
          const body = await res.json()
          this.systemConfigStore.initialize(body.system_configs)
        } else {
          console.log('Failed to fetch system config')
        }
      },
      clearCookies() {
        logout()
        window.location.href = '/'
      },
    },
    async mounted() {
      if (!this.systemConfigStore.initialized) {
        await this.fetchSystemConfig()
      }
      if (this.uuid && !this.initialized) {
        await this.fetchUser()
      }
      if (isEE()) {
        this.licenseStore.updateLicenseActive()
      }
      this.$nextTick(() => {
        if(this.isLoggedIn){
          this.getMsgTypes()
          this.getNewMsg()
        }
      })
    },
    beforeUnmount() {
      if (this.pollTimer) {
        clearTimeout(this.pollTimer);
        this.pollTimer = null;
      }
    },
    watch: {
      onlyUnread(newVal) {
        this.resetList()
      },
      selectedFilter(newVal) {
        this.resetList()
      }
    }
  }
</script>

<style lang="less" scoped>
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

  :deep(.top-right-dialog) {
    position: fixed;
    top: 80px !important;
    right: 20px !important;
    margin: 0 !important;
    transform: none !important;
  }
  :deep(.unreadCheckbox){
    .el-checkbox__label{
      font-size: 16px;
      color: #344054;
      margin-left: 12px;
      font-weight: 400;
      padding-left: 0;
    }
    .el-checkbox__inner{
      width: 20px !important;
      height: 20px !important;
      border-radius: 6px;
      border: 1px solid var(--Gray-300, #D0D5DD) !important;
    }
    .el-checkbox__inner:after{
      height: 10px;
      left: 6px;
      top: 2px;
      width: 5px;
    }
  }
  :deep(.setttingCheckbox){
    .el-checkbox__label{
      font-size: 14px;
      color: #344054;
      margin-left: 8px;
      font-weight: 400;
    }
    .el-checkbox__inner{
      border-radius: 4px;
    }
  }
  .settingsCont {
    transform: translateY(100%);
    box-shadow: 0px 12px 16px -4px rgba(16, 24, 40, 0.08), 0px 4px 6px -2px rgba(16, 24, 40, 0.03);
  }
  :deep(.avatar-dropdown) {
    width: 200px !important;
    max-height: 80vh;
    min-height: 360px;
    overflow-y: auto;
    overscroll-behavior: contain;
    border-radius: 12px !important;
    scrollbar-width: thin;
    scrollbar-color: #d0d5dd transparent;
  }
  :deep(.avatar-dropdown)::-webkit-scrollbar {
    width: 6px;
  }
  :deep(.avatar-dropdown)::-webkit-scrollbar-track {
    background: transparent;
  }
  :deep(.avatar-dropdown)::-webkit-scrollbar-thumb {
    background-color: #d0d5dd;
    border-radius: 3px;
  }
</style>