<template>
  <UpdateUsername />
  <div
    class="border-b sticky top-0 z-[999]"
    :class="`bg-${theme} ${
      theme === 'black' ? 'border-gray-950' : 'border-gray-200'
    }`">
    <div
      class="page-responsive-width flex text-gray-700 justify-between items-center h-20 sm:h-15 gap-6 md:px-5">
      <!-- pc logo -->
      <div class="flex-shrink-0">
        <a href="/">
          <img
            :src="logo || '/images/OpenCSG_logo.svg'"
            alt="OpenCSG Logo"
            class="h-[40px] w-auto" />
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
            <span class="ml-1 text-sm">{{ currentLangName }}</span>
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
          popper-class="avatar-dropdown">
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
              class="absolute right-0 top-6" />
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
              class="absolute right-0 top-6" />
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
            <el-dropdown-menu
              style="
                max-height: 88vh;
                overflow-y: auto;
                overscroll-behavior: contain;
                scrollbar-width: thin;
                scrollbar-color: #d0d5dd transparent;
              ">
              <el-dropdown-item>
                <a :href="`/profile/${username}`">
                  <div class="flex flex-row items-center gap-2">
                    <el-avatar
                      :size="40"
                      :src="avatar"></el-avatar>
                    <div class="flex flex-col min-w-0">
                      <span
                        class="text-sm font-medium text-gray-700 truncate"
                        >{{ nickname }}</span
                      >
                      <span class="text-sm font-light text-gray-600 truncate"
                        >@{{ username }}</span
                      >
                    </div>
                  </div>
                </a>
              </el-dropdown-item>

              <a :href="`/profile/${username}`">
                <el-dropdown-item divided>
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
              <a
                v-if="!actionLimited"
                href="/resource-console">
                <el-dropdown-item>
                  <div class="flex items-center w-fit gap-2">
                    <SvgIcon name="navbar-resource-console" />
                    {{ $t('navbar.console') }}
                  </div>
                </el-dropdown-item>
              </a>
              <a
                v-if="isAdmin && !actionLimited"
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
              <a
                v-if="!actionLimited"
                href="/models/new">
                <el-dropdown-item divided>
                  <div class="flex items-center w-fit gap-2">
                    <SvgIcon name="navbar-new" />
                    {{ $t('navbar.newModel') }}
                  </div>
                </el-dropdown-item>
              </a>
              <a
                v-if="!actionLimited"
                href="/datasets/new">
                <el-dropdown-item>
                  <div class="flex items-center w-fit gap-2">
                    <SvgIcon name="navbar-new" />
                    {{ $t('navbar.newDataset') }}
                  </div>
                </el-dropdown-item>
              </a>
              <a
                v-if="!actionLimited"
                href="/codes/new">
                <el-dropdown-item>
                  <div class="flex items-center w-fit gap-2">
                    <SvgIcon name="navbar-new" />
                    {{ $t('navbar.newCode') }}
                  </div>
                </el-dropdown-item>
              </a>
              <a
                v-if="!actionLimited"
                href="/spaces/new">
                <el-dropdown-item>
                  <div class="flex items-center w-fit gap-2">
                    <SvgIcon name="navbar-new" />
                    {{ $t('navbar.newApplicationSpace') }}
                  </div>
                </el-dropdown-item>
              </a>
              <a
                v-if="!actionLimited"
                href="/mcp/servers/new">
                <el-dropdown-item>
                  <div class="flex items-center w-fit gap-2">
                    <SvgIcon name="navbar-new" />
                    {{ $t('navbar.newMcpServer') }}
                  </div>
                </el-dropdown-item>
              </a>
              <a
                v-if="!actionLimited"
                href="/collections/new">
                <el-dropdown-item>
                  <div class="flex items-center w-fit gap-2">
                    <SvgIcon name="navbar-new" />
                    {{ $t('navbar.newCollection') }}
                  </div>
                </el-dropdown-item>
              </a>
              <a
                v-if="!actionLimited"
                href="/notebooks/new">
                <el-dropdown-item>
                  <div class="flex items-center w-fit gap-2">
                    <SvgIcon name="navbar-new" />
                    {{ $t('navbar.newNotebook') }}
                  </div>
                </el-dropdown-item>
              </a>
              <a
                v-if="!actionLimited"
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
                  <div class="flex items-center w-full justify-between">
                    <div class="flex items-center w-fit gap-2">
                      <SvgIcon name="navbar-message" />
                      {{ $t('navbar.message') }}
                    </div>
                    <div
                      v-if="msgNum > 0"
                      class="flex items-center gap-[4px] py-[2px] px-[6px] border border-gray-300 rounded-sm shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] ml-[16px]">
                      <SvgIcon
                        name="dot-ico"
                        class="w-[8px] h-[8px]" />
                      {{ msgNum || 0 }}
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
              <a
                v-if="isAdmin && !!version"
                :href="releaseHistoryUrl"
                target="_blank">
                <el-dropdown-item>
                  <div class="w-full flex items-center justify-between">
                    <div class="flex items-center w-fit gap-2">
                      <SvgIcon name="navbar-package" />
                      {{ $t('navbar.releaseVersion') }}
                    </div>
                    <div class="text-xs font-light text-gray-500">
                      {{ version }}
                    </div>
                  </div>
                </el-dropdown-item>
              </a>
              <p @click="clearCookies">
                <el-dropdown-item divided>
                  <div class="flex items-center w-fit gap-2">
                    <SvgIcon name="navbar-logout" />
                    {{ $t('navbar.logout') }}
                  </div>
                </el-dropdown-item>
              </p>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

        <!-- not logged in -->
        <template v-else>
          <div class="md:hidden min-w-[91px]">
            <a
              href="/login"
              class="btn btn-primary btn-md"
              >{{ $t('navbar.loginRegister') }}</a
            >
          </div>
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
      text-color="gray-600">
      <MenuItems
        :isLoggedInBoolean="isLoggedIn"
        :starChainUrl="starChainUrl"
        :hasEmail="hasEmail" />
    </el-menu>
  </el-drawer>

  <el-alert
    v-if="initialized && isLoggedIn && !hasEmail && !canChangeUserName"
    :title="$t('navbar.emailMissing')"
    center
    show-icon
    type="warning">
    <a
      href="/settings/profile"
      class="underline text-sm">
      {{ $t('navbar.profileEdit') }}
    </a>
  </el-alert>

  <el-alert
    v-if="initialized && isLoggedIn && canChangeUserName && hasEmail"
    :title="$t('navbar.usernameNeedChange')"
    center
    show-icon
    type="warning">
    <a
      href="/settings/profile"
      class="underline text-sm">
      {{ $t('navbar.profileEdit') }}
    </a>
  </el-alert>

  <el-alert
    v-if="initialized && isLoggedIn && canChangeUserName && !hasEmail"
    :title="$t('navbar.emailAndUsernameMissing')"
    center
    show-icon
    type="warning">
    <a
      href="/settings/profile"
      class="underline text-sm">
      {{ $t('navbar.profileEdit') }}
    </a>
  </el-alert>

  <el-dialog
    v-model="hasNewMassage"
    width="400"
    custom-class="top-right-dialog"
    :modal="false"
    :close-on-click-modal="true"
    style="top: 20px !important; right: 20px !important; margin: 0 !important; position: fixed;"
  >
    <template #header>
      <div
        class="headerCont flex md:block items-start justify-start gap-[16px]">
        <SvgIcon
          name="alert-message"
          class="w-[40px] h-[40px] md:mb-[12px]" />
        <div>
          <p class="text-gray-900 text-sm font-medium mb-[4px]">
            {{ newMsg.title }}
          </p>
          <p class="text-gray-600 text-sm font-light line-clamp-2">
            {{ newMsg.content }}
          </p>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="flex items-center justify-start gap-[12px] text-xs">
        <CsgButton
          class="btn btn-link-gray btn-md"
          @click="closeNewMsgMask"
          :name="$t('navbar.later')" />
        <CsgButton
          class="btn btn-link-color btn-md"
          @click="newMsgShowInfo(1, newMsg)"
          :name="$t('navbar.showInfo')" />
      </div>
    </template>
  </el-dialog>

  <el-drawer
    v-model="showMsgList"
    :show-close="false"
    style="max-width: 480px"
    class="msgListCont"
    @close="showSettings = false"
    @click="showSettings = false">
    <template #header="{ close }">
      <div class="flex items-center justify-between">
        <div class="flex items-center justify-between">
          <div
            class="flex items-center w-fit gap-2 text-lg font-medium text-gray-900">
            {{ $t('navbar.message') }}
          </div>
          <div
            v-if="msgNum > 0"
            class="flex items-center gap-1 py-0.5 px-1.5 border border-gray-300 rounded-sm shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] ml-4">
            <SvgIcon
              name="dot-ico"
              class="w-2 h-2" />{{ msgNum || 0 }}
          </div>
        </div>
        <div class="flex items-center justify-end gap-4">
          <div class="relative">
            <CsgButton
              class="btn btn-secondary-gray btn-sm"
              svgName="filter-lines"
              :name="$t('navbar.msgSettings')"
              @click.stop="getMsgSettings" />
            <div
              class="settingsCont absolute z-10 bottom-[-11px] right-0 bg-white border-gray-200 rounded-sm"
              :class="{ hidden: !showSettings, block: showSettings }"
              @click.stop>
              <el-checkbox-group
                v-model="sub_notification_type"
                @change="setMsgSettings">
                <div
                  class="px-[16px] py-[10px] hover:bg-gray-50 cursor-pointer">
                  <el-checkbox
                    class="setttingCheckbox"
                    :label="$t('navbar.comment')"
                    value="comment"
                    size="large" />
                </div>
                <div
                  class="px-[16px] py-[10px] hover:bg-gray-50 cursor-pointer">
                  <el-checkbox
                    class="setttingCheckbox"
                    :label="$t('navbar.system')"
                    value="system"
                    size="large" />
                </div>
                <div
                  class="px-[16px] py-[10px] hover:bg-gray-50 cursor-pointer">
                  <el-checkbox
                    class="setttingCheckbox"
                    :label="$t('navbar.organization')"
                    value="organization"
                    size="large" />
                </div>
                <div
                  class="px-[16px] py-[10px] hover:bg-gray-50 cursor-pointer">
                  <el-checkbox
                    class="setttingCheckbox"
                    :label="$t('navbar.asset_management')"
                    value="asset_management"
                    size="large" />
                </div>
              </el-checkbox-group>
            </div>
          </div>
          <CsgButton
            class="btn btn-secondary-gray btn-md"
            svgName="close"
            @click="close" />
        </div>
      </div>
    </template>
    <div class="px-4 pb-1 pt-1">
      <el-input
        v-model="searchText"
        class="mb-3"
        size="large"
        clearable
        @change="resetList"
        :placeholder="$t('navbar.all')">
        <template #prefix>
          <el-icon><search /></el-icon>
        </template>
      </el-input>
      <div class="flex items-center justify-between gap-4">
        <el-select
          v-model="selectedFilter"
          style="flex: 1"
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
          size="large" />
      </div>
      <div
        v-if="msgList.length > 0"
        class="flex items-center justify-between">
        <div class="flex items-center gap-3 py-2">
          <el-checkbox
            class="unreadCheckbox"
            v-model="selectAll"
            @change="handleSelectAllChange"
          />
          <span class="text-md text-gray-700">{{ $t('navbar.checkAll') }}</span>
        </div>
        <div
          v-if="hasSelectedMessages"
          class="flex items-center justify-end gap-4">
          <CsgButton
            v-if="hasUnreadSelectedMessages"
            :disabled="buttonsDisabled"
            class="btn btn-link-color btn-md"
            @click="allRead()"
            :name="$t('navbar.allRead')" />
          <el-popconfirm
            class="box-item"
            :title="$t('navbar.clearTip')"
            placement="bottom"
            width="200"
            :confirm-button-text="$t('all.confirm')"
            :cancel-button-text="$t('all.cancel')"
            @confirm="allClear()">
            <template #reference>
              <CsgButton
                :disabled="buttonsDisabled"
                class="btn btn-link-color btn-md"
                :name="$t('navbar.allClear')" />
            </template>
          </el-popconfirm>
        </div>
      </div>
    </div>
    <div
      class="msg-list-container h-[calc(100vh-200px)] overflow-y-auto"
      ref="msgListContainer"
      @scroll="handleScroll"
      :style="{
        'height': `calc(100% - 170px)`,
        'overflow-y': 'auto',
        'padding-bottom': '20px'
      }">
      <div
        v-for="(item, index) in msgList"
        :key="index"
        class="p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer flex items-start gap-4">
        <el-checkbox
          v-model="item.checked"
          @change="handleItemCheckChange(item)"
          class="mt-2 unreadCheckbox" />
        <div
          @click="newMsgShowInfo(2, item, index)"
          class="flex-1">
          <div class="flex items-start justify-between gap-4">
            <div class="flex items-center justify-start gap-4">
              <SvgIcon
                :name="`${item.notification_type}-message`"
                class="w-10 h-10" />
              <div class="text-sm">
                <p
                  :class="
                    item.is_read
                      ? 'text-gray-500 font-normal'
                      : 'text-gray-700 font-medium'
                  "
                  class="line-clamp-1 hover:underline">
                  {{ item.title }}
                </p>
                <p
                  :class="
                    item.is_read
                      ? 'text-gray-500 font-light'
                      : 'text-gray-600 font-light'
                  "
                  class="line-clamp-1 hover:underline">
                  {{ item.click_action_url }}
                </p>
              </div>
            </div>
            <p class="text-sm text-gray-600 font-light whitespace-nowrap">
              {{ `${formatTime(item.created_at * 1000)}` }}
            </p>
          </div>
          <p class="mt-1 text-gray-600 text-sm font-light line-clamp-2">
            {{ item.content }}
          </p>
        </div>
      </div>
      <div
        v-if="loading"
        class="py-4 text-center text-gray-500">
        {{ $t('navbar.loading') }}
      </div>
      <div
        v-if="!msgList.length"
        class="py-4 text-center text-gray-500">
        {{ $t('navbar.noMoreData') }}
      </div>
    </div>
  </el-drawer>

  <el-drawer
    v-model="showUserSet"
    :show-close="false"
    style="max-width: 480px"
    class="msgListCont userSetCont">
    <template #header="{ close }">
      <div class="flex items-center justify-between">
        <div class="flex items-center justify-between gap-[8px]" @click="close">
          <SvgIcon
            name="arrow-left"
            class="w-[14px] h-[14px]" />
          <p class="text-lg font-medium text-gray-900">
            {{ $t('navbar.message') }}
          </p>
        </div>
        <CsgButton
          class="btn btn-secondary-gray btn-md"
          svgName="close"
          @click="close" />
      </div>
    </template>
    <div class="px-[16px] pb-[12px] pt-1">
      <el-form
        ref="userSetForm"
        :model="userSetForm"
        :rules="userSetFormRules"
        label-position="top"
        label-width="auto">
        <el-form-item
          :label="$t('navbar.userSetLabel1')"
          prop="sub_notification_type">
          <el-select
            v-model="userSetForm.sub_notification_type"
            multiple
            collapse-tags
            collapse-tags-tooltip
            size="large">
            <el-option
              v-for="item in userSetOptions"
              :key="item"
              :label="$t(`navbar.${item}`)"
              :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item
          label=""
          prop="is_do_not_disturb_enabled">
          <el-switch v-model="userSetForm.is_do_not_disturb_enabled" />
          {{ $t('navbar.userSetLabel2') }}
        </el-form-item>
        <div v-if="userSetForm.is_do_not_disturb_enabled" class="w-full flex items-center justify-between mt-[-12px]">
          <el-form-item
            class="flex-1"
            :label="$t('navbar.formTip2')"
            prop="do_not_disturb_start">
            <el-time-picker
              v-model="userSetForm.do_not_disturb_start"
              style="width: 100%;"
              value-format="HH:mm"
              format="HH:mm"
              placeholder="00:00"/>
          </el-form-item>
          <span class="mx-[8px]">-</span>
          <el-form-item
            class="flex-1"
            :label="$t('navbar.formTip1')"
            prop="do_not_disturb_end">
            <el-time-picker
              v-model="userSetForm.do_not_disturb_end"
              style="width: 100%;"
              value-format="HH:mm"
              format="HH:mm"
              placeholder="00:00"/>
          </el-form-item>
        </div>
        <el-form-item
          label=""
          prop="is_email_notification_enabled">
          <el-switch v-model="userSetForm.is_email_notification_enabled" />
          {{ $t('navbar.userSetLabel3') }}
        </el-form-item>
        <el-form-item
          class="mt-[-12px]"
          v-if="userSetForm.is_email_notification_enabled"
          :label="$t('navbar.userSetLabel4')"
          prop="email_address">
          <el-input v-model="userSetForm.email_address" />
        </el-form-item>
        <el-form-item
          :label="$t('navbar.userSetLabel5')"
          prop="message_ttl">
          <el-input
            v-model="userSetForm.message_ttl"
            size="large"
            @change="handleMessageTTLChange" />
          <p class="text-gray-600 text-sm mt-2 font-light">
            {{ $t('navbar.userSetLabel6') }}
          </p>
        </el-form-item>
      </el-form>
    </div>
    <div
      class="border-t border-gray-200 flex justify-end items-center gap-3 p-6">
      <CsgButton
            class="btn btn-secondary-gray btn-md flex-1"
            :name="$t('navbar.userSetCancel')"
            @click="resetForm" />
      <CsgButton
            class="btn btn-primary btn-md flex-1"
            :name="$t('navbar.userSetSub')"
            @click="subForm" />
    </div>
  </el-drawer>

  <el-dialog
    v-model="showMsgInfo"
    width="400">
    {{ msgInfo }}
  </el-dialog>

  <Broadcast v-if="showBroadcast" />
</template>

<script>
  import { inject } from 'vue'
  import { Search } from '@element-plus/icons-vue'
  import MenuItems from './MenuItems.vue'
  import useUserStore from '../../stores/UserStore.js'
  import useFetchApi from '../../packs/useFetchApi'
  import { mapActions, mapState } from 'pinia'
  import { useCookies } from 'vue3-cookies'
  import { ElMessage } from 'element-plus'
  import Broadcast from './Broadcast.vue'
  import UpdateUsername from '../popup/UpdateUsername.vue'
  import { logout } from '@/packs/auth'
  import { timeSince } from '@/packs/utils'
  import { useI18n } from 'vue-i18n'
  import csrfFetch from '@/packs/csrfFetch'

  export default {
    props: {
      logo: String,
      starChainUrl: String,
      isCompanyUser: String,
      companyVerified: String,
      phone: String,
      canCreateDailyPaper: Boolean
    },
    data() {
      const classParam = new URLSearchParams(window.location.search).get(
        'class'
      )
      const { cookies } = useCookies()

      return {
        currencyObj: {
          USD: '$',
          CNY: '¥'
        },
        selectAll: false,
        selectedItems: [],
        showUserSet: false,
        showSettings: false,
        showMsgList: false,
        hasNewMassage: false,
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
        version: '',
        cookies: useCookies().cookies,
        searchText: '',
        filterOptions: ['all'],
        userSetOptions:[],
        msgNum: 0,
        msgList: [],
        currentPage: 1,
        pageSize: 10,
        loading: false,
        noMore: false,
        onlyUnread: false,
        selectedFilter: 'all',
        nextTime: 0,
        newMsg: null,
        showMsgInfo: false,
        msgInfo: '',
        pollTimer: null,
        sub_notification_type: [],
        userSetForm: {
          do_not_disturb_end: '',
          do_not_disturb_start: '',
          email_address: '',
          is_do_not_disturb_enabled: true,
          is_email_notification_enabled: true,
          is_sms_notification_enabled: true,
          message_ttl: 0,
          sub_notification_type: []
        },
        userSetFormRules: {
          do_not_disturb_end: [
            {
              required: true,
              message: this.$t('navbar.formTip1'),
              trigger: 'blur'
            }
          ],
          do_not_disturb_start: [
            {
              required: true,
              message: this.$t('navbar.formTip2'),
              trigger: 'blur'
            }
          ],
          email_address: [
            {
              required: true,
              type: 'email',
              message: this.$t('navbar.formTip3'),
              trigger: ['blur', 'change']
            }
          ],
          message_ttl: [
            {
              type: 'number',
              min: 1,
              max: 365,
              message: this.$t('navbar.formTip4'),
              trigger: 'blur'
            }
          ],
          sub_notification_type: [
            {
              type: 'array',
              min: 1,
              message: this.$t('navbar.formTip5'),
              trigger: 'change'
            }
          ]
        },
        timezone:Intl.DateTimeFormat().resolvedOptions().timeZone
      }
    },
    components: {
      MenuItems,
      Broadcast,
      UpdateUsername,
      Search
    },
    computed: {
      ...mapState(useUserStore, [
        'email',
        'username',
        'nickname',
        'avatar',
        'initialized',
        'isAdmin',
        'isLoggedIn',
        'actionLimited',
        'hasEmail',
        'canChangeUsername'
      ]),
      currentLangName() {
        const locale = this.$i18n?.locale || 'zh'
        const langMap = {
          'zh': '简体中文',
          'zhHant': '繁體中文',
          'en': 'English'
        }
        return langMap[locale] || '简体中文'
      },
      showBroadcast() {
        return !window.location.pathname.includes('/lead_forms')
      },
      releaseHistoryUrl() {
        return 'https://opencsg.com/docs/releasenote/csghub_ee_history'
      },
      buttonsDisabled() {
        return !this.selectAll && this.selectedItems.length === 0
      },
      hasSelectedMessages() {
        return this.selectedItems.length > 0
      },
      hasUnreadSelectedMessages() {
        return this.selectedItems.some((item) => !item.is_read)
      },
      showEmailMissingOrPhoneMissing() {
        if (isEE()) return false
        if (isOverseas()) return false
        return (
          this.initialized &&
          this.isLoggedIn &&
          (!this.hasEmail || !this.hasPhone) &&
          !this.canChangeUsername
        )
      },
      showUsernameNeedChange() {
        if (isEE()) return false
        if (isOverseas()) return false
        return (
          this.initialized &&
          this.isLoggedIn &&
          this.canChangeUsername &&
          this.hasEmail &&
          this.hasPhone
        )
      },
      showUsernameAndEmailOrPhoneMissing() {
        if (isEE()) return false
        if (isOverseas()) return false
        return (
          this.initialized &&
          this.isLoggedIn &&
          this.canChangeUsername &&
          (!this.hasEmail || !this.hasPhone)
        )
      }
    },
    methods: {
      ...mapActions(useUserStore, { clearUserStore: 'clearStore' }),
      showDialog() {
        this.$refs.child.showDialog()
      },
      handleSelectAllChange(val) {
        this.msgList.forEach(item => {
          item.checked = val
        })
        this.updateSelectedItems()
      },
      handleItemCheckChange(item) {
        this.updateSelectedItems()
        this.selectAll = this.msgList.every(item => item.checked)
      },
      updateSelectedItems() {
        this.selectedItems = this.msgList.filter(item => item.checked)
      },
      async allRead() {
        let params = {}
        if(this.selectAll){
          params = {
            ids: this.msgList.map(item => item.id)
          }
        }else {
          params = {
            ids: this.selectedItems.map(item => item.id)
          }
        }
        const options = { body: JSON.stringify(params) }
        const { data, error } = await useFetchApi(
          `/notifications/read`,
          options
        )
          .put()
          .json()
        if (data.value) {
          this.resetList()
          this.getMsgNum()
          this.selectedItems = []
          this.selectAll = false
        } else {
          ElMessage.warning(error.value.msg)
        }
      },
      async allClear() {
        let params = {}
        if(this.selectAll){
          params = {
            ids: this.msgList.map(item => item.id)
          }
        }else {
          params = {
            ids: this.selectedItems.map(item => item.id)
          }
        }
        const options = { body: JSON.stringify(params) }
        const { data, error } = await useFetchApi(
          `/notifications`,
          options
        )
          .delete()
          .json()
        if (data.value) {
          this.resetList()
          this.getMsgNum()
          this.selectedItems = []
          this.selectAll = false
        } else {
          ElMessage.warning(error.value.msg)
        }
      },
      handleLocaleChange(locale) {
        location.href = `/${locale}/settings/locale`
      },
      async fetchUser() {
        const { data, error } = await useFetchApi(
          `/user/${this.uuid}?type=uuid`
        ).json()
        if (data.value) {
          this.userStore.initialize(data.value.data)
        } else {
          console.log(error.value.msg)
          this.clearCookies()
        }
      },
      handleMessageTTLChange() {
        this.userSetForm.message_ttl = Number(this.userSetForm.message_ttl) || 0
      },
      formatTime(time) {
        return timeSince(time)
      },
      newMsgShowInfo(type, msg, index) {
        if (type == 2 && !msg.is_read) {
          this.setMsgRead(msg.id, index)
        }
        if (type == 1) {
          this.closeNewMsgMask()
        }
        if (msg.click_action_url) {
          window.location.href = msg.click_action_url
        } else {
          this.msgInfo = msg.content
          this.showMsgInfo = true
        }
      },
      showMsgListHandle() {
        // this.getMsgSettings()
        this.resetList()
        this.showMsgList = true
      },

      async getMsgTypes() {
        if (!this.cookies.get('login_identity')) return
        const { data, error } = await useFetchApi(
          `/notifications/message-types`
        ).json()
        if (data.value) {
          this.filterOptions = [...this.filterOptions, ...data.value.data]
          this.userSetOptions = [...data.value.data]
        } else {
          this.filterOptions = []
          this.userSetOptions = []
        }
      },
      async getMsgSettings() {
        const { data, error } = await useFetchApi(
          `/notifications/setting?timezone=${this.timezone}`
        ).json()
        if (data.value) {
          this.userSetForm = { ...data.value.data,message_ttl:Number(data.value.data.message_ttl||0)/86400/1e9 }
          this.sub_notification_type = data.value.data.sub_notification_type
            ? [...data.value.data.sub_notification_type]
            : []
        } else {
          this.sub_notification_type = []
        }
        this.showUserSet = true
      },
      async setMsgSettings() {
        const options = {
          body: JSON.stringify({
            sub_notification_type: [...this.sub_notification_type]
          })
        }
        const { data, error } = await useFetchApi(
          `/notifications/setting`,
          options
        )
          .put()
          .json()
        if (data.value) {
          ElMessage.success(this.$t('navbar.settingsSuccess'))
        } else {
          ElMessage.warning(error.value.msg)
        }
      },
      async subForm() {
        try {
          await this.$refs.userSetForm.validate()
          const options = {
            body: JSON.stringify({
              ...this.userSetForm,
              message_ttl: Number(this.userSetForm.message_ttl || 0) * 86400 * 1e9,
              timezone: this.timezone,
              sub_notification_type: [...this.userSetForm.sub_notification_type] || [],
              do_not_disturb_end:this.userSetForm.do_not_disturb_end||'00:00',
              do_not_disturb_start:this.userSetForm.do_not_disturb_start||'00:00',
            })
          }
          
          const { data, error } = await useFetchApi(
            '/notifications/setting',
            options
          )
            .put()
            .json()
            
          if (data.value) {
            ElMessage.success(this.$t('navbar.settingsSuccess'))
            this.showUserSet = false
          } else {
            ElMessage.warning(error.value.msg)
          }
        } catch (error) {
          console.log('表单验证失败:', error)
        }
      },
      resetForm() {
        this.$refs.userSetForm.resetFields()
        this.showUserSet = false
      },
      async setMsgRead(id, index) {
        const options = { body: JSON.stringify({ ids: [id] }) }
        const { data, error } = await useFetchApi(
          `/notifications/read`,
          options
        )
          .put()
          .json()
        if (data.value) {
          this.msgList[index].is_read = true
          this.getMsgNum()
        } else {
          ElMessage.warning(error.value.msg)
        }
      },
      async getMsgNum() {
        const { data, error } = await useFetchApi(
          `/notifications/count`
        ).json()
        if (data.value) {
          this.msgNum = data.value.data
        } else {
          this.msgNum = 0
        }
      },
      closeNewMsgMask() {
        this.hasNewMassage = false
        this.getNewMsg()
      },
      formatNotification(notification) {
        if (notification.title && notification.content) {
          return {
            title: notification.title,
            content: notification.content
          }
        }

        switch (notification.template) {
          case 'user-verify':
            return {
              title: this.$t('notification.userVerify.title'),
              content:
                notification.payload.verify_status === 'approved'
                  ? this.$t('notification.userVerify.approved')
                  : this.$t('notification.userVerify.rejected')
            }

          case 'org-verify':
            return {
              title: this.$t('notification.orgVerify.title'),
              content:
                notification.payload.verify_status === 'approved'
                  ? this.$t('notification.orgVerify.approved')
                  : this.$t('notification.orgVerify.rejected')
            }

          case 'org-member': {
            const { operation, org_name, user_name, new_role } =
              notification.payload
            if (operation === 'add') {
              return {
                title: this.$t('notification.orgMember.changeTitle'),
                content: this.$t('notification.orgMember.memberAdded', {
                  user: user_name,
                  org: org_name
                })
              }
            } else if (operation === 'remove') {
              return {
                title: this.$t('notification.orgMember.changeTitle'),
                content: this.$t('notification.orgMember.memberRemoved', {
                  user: user_name,
                  org: org_name
                })
              }
            } else {
              return {
                title: this.$t('notification.orgMember.roleChangeTitle'),
                content: this.$t('notification.orgMember.roleUpdated', {
                  user: user_name,
                  role: new_role,
                  org: org_name
                })
              }
            }
          }

          case 'discussion':
            return {
              title: this.$t('notification.discussion.title', {
                type: notification.payload.repo_type
              }),
              content: this.$t('notification.discussion.content', {
                type: notification.payload.repo_type
              })
            }

          case 'recharge':
            let status = notification.payload.status
              ? this.$t(`notification.status.${notification.payload.status}`)
              : ''
            let currency = notification.payload.currency
              ? this.currencyObj[notification.payload.currency]
              : ''
            return {
              title: this.$t('notification.recharge.title', { status: status }),
              content: this.$t('notification.recharge.content', {
                orderNo: notification.payload.order_no,
                status: status,
                currency: currency,
                amount: notification.payload.amount || ''
              })
            }

          case 'low-balance':
            return {
              title: this.$t('notification.lowBalance.title'),
              content: this.$t('notification.lowBalance.content', {
                amount: notification.payload.amount,
                currency: window.currencyName
              })
            }

          case 'inviter-pending-award':
            return {
              title: this.$t('notification.invitationPending.title'),
              content: this.$t('notification.invitationPending.content', {
                amount: notification.payload.amount,
                currency: window.currencyName
              })
            }
          case 'inviter-award':
            return {
              title: this.$t('notification.invitationAward.title'),
              content: this.$t('notification.invitationAward.content', {
                amount: notification.payload.amount,
                currency: window.currencyName
              })
            }
          case 'invitee-award':
            return {
              title: this.$t('notification.inviteeAward.title'),
              content: this.$t('notification.inviteeAward.content', {
                amount: notification.payload.amount,
                currency: window.currencyName
              })
            }
          case 'invitation-award-cancelled':
            return {
              title: this.$t('notification.invitationCancel.title'),
              content: this.$t('notification.invitationCancel.content', {
                amount: notification.payload.amount,
                currency: window.currencyName
              })
            }

          case 'deployment':
            const { deploy_type, git_path, deploy_name, deploy_id } =
              notification.payload
            switch (deploy_type) {
              case 'space':
                return {
                  title: this.$t('notification.deployment.spaceTitle', {
                    path: git_path
                  }),
                  content: this.$t('notification.deployment.spaceContent', {
                    path: git_path
                  })
                }
              case 'inference':
                return {
                  title: this.$t('notification.deployment.inferenceTitle', {
                    deploy_name: deploy_name,
                    deploy_id: deploy_id
                  }),
                  content: this.$t('notification.deployment.inferenceContent', {
                    deploy_name: deploy_name,
                    deploy_id: deploy_id
                  })
                }
              case 'finetune':
                return {
                  title: this.$t('notification.deployment.finetuneTitle', {
                    deploy_name: deploy_name,
                    deploy_id: deploy_id
                  }),
                  content: this.$t('notification.deployment.finetuneContent', {
                    deploy_name: deploy_name,
                    deploy_id: deploy_id
                  })
                }
              case 'evaluation':
                return {
                  title: this.$t('notification.deployment.evaluationTitle', {
                    deploy_name: deploy_name
                  }),
                  content: this.$t(
                    'notification.deployment.evaluationContent',
                    { deploy_name: deploy_name }
                  )
                }
              case 'serverless':
                return {
                  title: this.$t('notification.deployment.serverlessTitle'),
                  content: this.$t('notification.deployment.serverlessContent')
                }
              default:
                return {
                  title: this.$t('notification.default.title'),
                  content: this.$t('notification.default.content')
                }
            }

          case 'asset-management': {
            const { operation, repo_path, repo_type } = notification.payload
            if (['create', 'delete', 'add'].includes(operation)) {
              return {
                title: this.$t(`notification.asset.${operation}Title`, {
                  type: repo_type,
                  path: repo_path
                }),
                content: this.$t(`notification.asset.${operation}Content`, {
                  type: repo_type,
                  path: repo_path
                })
              }
            }
          }

          default:
            return {
              title: this.$t('notification.default.title'),
              content: this.$t('notification.default.content')
            }
        }
      },
      async getNewMsg() {
        if (!this.cookies.get('login_identity')) return
        if (this.pollTimer) {
          clearTimeout(this.pollTimer)
          this.pollTimer = null
        }
        
        // 防止重复调用
        if (this.isPolling) {
          return
        }
        
        this.isPolling = true
        this.getMsgNum()
        const { data, error } = await useFetchApi(
          `/notifications/poll/1?timezone=${this.timezone}`
        ).json()
        this.isPolling = false
        if (data.value) {
          const rawMsg =
            data.value.data.data?.length > 0 ? data.value.data.data[0] : null

          if (rawMsg) {
            const formattedMsg = this.formatNotification(rawMsg)
            this.newMsg = {
              ...rawMsg,
              title: formattedMsg.title,
              content: formattedMsg.content
            }

            const pollTime = new Date(data.value.data.next_poll_time).getTime()
            const now = Date.now()

            const delay = Math.max(0, pollTime - now)

            this.pollTimer = setTimeout(() => {
              if (!this.hasNewMassage) {
                this.getNewMsg()
              }
            }, delay)

            if (this.newMsg.title || this.newMsg.content) {
              this.hasNewMassage = true
              this.showMsgList = false
            }
          } else {
            this.newMsg = { title: '', content: '' }
          }
        } else {
          this.pollTimer = setTimeout(() => {
            if (!this.hasNewMassage) {
              this.getNewMsg()
            }
          }, 300000)
        }
      },

      async getMsgList(reset = false) {
        if (this.loading || this.noMore) return

        // 防止短时间内重复调用
        if (this.msgListLoading) {
            return
        }

        this.loading = true
        this.msgListLoading = true

        try {
          const { data } = await useFetchApi(
            `/notifications?notification_type=${
              this.selectedFilter === 'all' ? '' : this.selectedFilter
            }&unread_only=${this.onlyUnread}&page=1&page_size=500`
          )
            .get()
            .json()

          if (data.value?.data) {
            this.msgNum = data.value.data.unread_count
            const allMessages = data.value.data.messages.map((msg) => {
              const formatted = this.formatNotification(msg)
              return {
                ...msg,
                title: formatted.title,
                content: formatted.content,
                checked: false
              }
            })

            if (this.searchText) {
              const searchTextLower = this.searchText.toLowerCase()
              this.allMsgCache = allMessages.filter(
                (msg) =>
                  msg.title.toLowerCase().includes(searchTextLower) ||
                  msg.content.toLowerCase().includes(searchTextLower)
              )
            } else {
              this.allMsgCache = allMessages
            }

            if (reset || !this.allMsgCache) {
              this.currentPage = 1
              this.noMore = false
            }

            // load first page
            this.loadMoreMessages()
          } else {
            this.noMore = true
            this.msgNum = 0
            this.allMsgCache = []
          }
        } catch (error) {
          console.error('获取消息失败:', error)
        } finally {
          this.loading = false
          this.msgListLoading = false
        }
      },

      loadMoreMessages() {
        const startIdx = (this.currentPage - 1) * this.pageSize
        const endIdx = startIdx + this.pageSize
        const newMessages = this.allMsgCache.slice(startIdx, endIdx)

        this.msgList = [...this.msgList, ...newMessages]
        this.currentPage++

        if (endIdx >= this.allMsgCache.length) {
          this.noMore = true
        }
      },

      handleScroll(e) {
        const container = e.target
        const scrollThreshold = 50
        const { scrollTop, scrollHeight, clientHeight } = container

        if (
          scrollTop > this.lastScrollTop &&
          scrollHeight - (scrollTop + clientHeight) < scrollThreshold &&
          !this.noMore
        ) {
          this.loadMoreMessages()
        }

        this.lastScrollTop = scrollTop
      },
      resetList() {
        this.msgList = []
        this.currentPage = 1
        this.noMore = false
        this.selectAll = false
        this.getMsgList(true)
      },

      async fetchSystemConfig() {
        const res = await csrfFetch('/internal_api/system_config')
        if (res.ok) {
          const body = await res.json()
        } else {
          console.log('Failed to fetch system config')
        }
      },
      clearCookies() {
        logout()
        window.location.href = '/'
      },
      async fetchVersion() {
        if (!this.isAdmin) return

        const { data } = await useFetchApi('/version').json()
        if (data.value) {
          this.version = data.value.data?.version
        } else {
          this.version = ''
        }
      }
    },
    async mounted() {
      if (this.uuid && !this.initialized) {
        await this.fetchUser()
      }
      this.$nextTick(() => {
        if (this.isLoggedIn) {
          this.getMsgTypes()
          this.getNewMsg()
          this.fetchVersion()
        }
      })
    },
    beforeUnmount() {
      if (this.pollTimer) {
        clearTimeout(this.pollTimer)
        this.pollTimer = null
      }
    },
    watch: {
      msgList(newVal) {
        if (newVal.length > this.selectedItems.length) {
          this.selectAll = false
        }
      },
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
  :deep(.unreadCheckbox) {
    .el-checkbox__label {
      font-size: 16px;
      color: #344054;
      margin-left: 12px;
      font-weight: 400;
      padding-left: 0;
    }
    .el-checkbox__inner {
      width: 20px !important;
      height: 20px !important;
      border-radius: 6px;
      border: 1px solid var(--Gray-300, #d0d5dd) !important;
    }
    .el-checkbox__inner:after {
      height: 10px;
      left: 6px;
      top: 2px;
      width: 5px;
    }
  }
  :deep(.setttingCheckbox) {
    .el-checkbox__label {
      font-size: 14px;
      color: #344054;
      margin-left: 8px;
      font-weight: 400;
    }
    .el-checkbox__inner {
      border-radius: 4px;
    }
  }
  .settingsCont {
    transform: translateY(100%);
    box-shadow: 0px 12px 16px -4px rgba(16, 24, 40, 0.08),
      0px 4px 6px -2px rgba(16, 24, 40, 0.03);
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