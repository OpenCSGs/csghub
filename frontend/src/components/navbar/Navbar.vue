<template>
  <div class="border-b sticky top-0 z-[999] csg-navbar bg-white border-gray-200">
    <div
      class="page-responsive-width flex text-gray-700 justify-between items-center h-20 sm:h-15 gap-10 md:px-5">
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
      <div class="flex gap-4 md:gap-2 items-center">
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
                <div class="flex flex-row items-center gap-2">
                  <el-avatar :size="40" :src="userAvatar"></el-avatar>
                  <div class="flex flex-col">
                    <span class="text-sm font-medium text-gray-700">{{ nickname }}</span>
                    <span class="text-sm font-light  text-gray-600">@{{ username }}</span>
                  </div>
                </div>
              </el-dropdown-item>  
              <el-dropdown-item divided> 
                <a :href="`/profile/${username}`">
                  <div class="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13.3334 14C13.3334 13.0696 13.3334 12.6044 13.2186 12.2259C12.9601 11.3736 12.2931 10.7067 11.4408 10.4482C11.0623 10.3333 10.5971 10.3333 9.66675 10.3333H6.33342C5.40304 10.3333 4.93785 10.3333 4.55932 10.4482C3.70705 10.7067 3.04011 11.3736 2.78157 12.2259C2.66675 12.6044 2.66675 13.0696 2.66675 14M11.0001 5C11.0001 6.65685 9.65694 8 8.00008 8C6.34323 8 5.00008 6.65685 5.00008 5C5.00008 3.34315 6.34323 2 8.00008 2C9.65694 2 11.0001 3.34315 11.0001 5Z" stroke="#667085" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    {{ $t('navbar.profile') }}
                  </div>
                </a>
              </el-dropdown-item>
              <a :href="`/profile/likes/${username}`">
                <el-dropdown-item>
                  <div class="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4">
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M7.99535 3.42388C6.66245 1.8656 4.43975 1.44643 2.76972 2.87334C1.09968 4.30026 0.864564 6.68598 2.17605 8.3736C3.26646 9.77674 6.56643 12.7361 7.64799 13.6939C7.76899 13.801 7.82949 13.8546 7.90006 13.8757C7.96165 13.8941 8.02905 13.8941 8.09065 13.8757C8.16122 13.8546 8.22172 13.801 8.34272 13.6939C9.42427 12.7361 12.7242 9.77674 13.8147 8.3736C15.1261 6.68598 14.9197 4.28525 13.221 2.87334C11.5223 1.46144 9.32826 1.8656 7.99535 3.42388Z" stroke="#667085" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    {{ $t('profile.myCollect') }}
                  </div>
                </el-dropdown-item>
              </a>
              <a href="/settings/profile">
                <el-dropdown-item>
                  <div class="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M7.99992 10.0002C9.10449 10.0002 9.99992 9.10473 9.99992 8.00016C9.99992 6.89559 9.10449 6.00016 7.99992 6.00016C6.89535 6.00016 5.99992 6.89559 5.99992 8.00016C5.99992 9.10473 6.89535 10.0002 7.99992 10.0002Z"
                        stroke="#667085"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path 
                        d="M12.4848 9.81835C12.4041 10.0011 12.38 10.2039 12.4157 10.4005C12.4513 10.5971 12.545 10.7785 12.6848 10.9214L12.7211 10.9577C12.8338 11.0703 12.9232 11.204 12.9842 11.3511C12.9842 12.4266 12.8338 12.5603 12.7211 12.6729C12.6086 12.7856 12.4749 12.875 12.3277 12.936C12.1806 12.997 12.0228 13.0284 11.8636 13.0284C11.7043 13.0284 11.5465 12.997 11.3994 12.936C11.2522 12.875 11.1186 12.7856 11.006 12.6729L10.9696 12.6365C10.8268 12.4968 10.6454 12.4031 10.4488 12.3674C10.2522 12.3318 10.0494 12.3559 9.86659 12.4365C9.68733 12.5134 9.53445 12.6409 9.42677 12.8035C9.31909 12.9661 9.2613 13.1567 9.26052 13.3517V13.4547C9.26052 13.7762 9.13282 14.0845 8.9055 14.3118C8.67819 14.5391 8.36988 14.6668 8.0484 14.6668C7.72693 14.6668 7.41862 14.5391 7.1913 14.3118C6.96399 14.0845 6.83628 13.7762 6.83628 13.4547V13.4002C6.83159 13.1996 6.76666 13.005 6.64993 12.8418C6.53319 12.6786 6.37006 12.5543 6.18174 12.485C5.99894 12.4043 5.79617 12.3803 5.59956 12.4159C5.40296 12.4516 5.22154 12.5453 5.07871 12.685L5.04234 12.7214C4.92977 12.8341 4.79609 12.9235 4.64894 12.9845C4.50179 13.0455 4.34406 13.0769 4.18477 13.0769C4.02548 13.0769 3.86775 13.0455 3.7206 12.9845C3.57345 12.9235 3.43976 12.8341 3.32719 12.7214C3.21449 12.6088 3.12509 12.4751 3.06409 12.328C3.00309 12.1808 2.97169 12.0231 2.97169 11.8638C2.97169 11.7045 3.00309 11.5468 3.06409 11.3996C3.12509 11.2525 3.21449 11.1188 3.32719 11.0062L3.36356 10.9699C3.50327 10.827 3.597 10.6456 3.63265 10.449C3.6683 10.2524 3.64423 10.0496 3.56355 9.86683C3.48673 9.68758 3.35916 9.5347 3.19656 9.42702C3.03396 9.31933 2.84343 9.26155 2.6484 9.26077H2.54537C2.2239 9.26077 1.91559 9.13306 1.68827 8.90575C1.46096 8.67843 1.33325 8.37012 1.33325 8.04865C1.33325 7.72717 1.46096 7.41887 1.68827 7.19155C1.91559 6.96423 2.2239 6.83653 2.54537 6.83653H2.59992C2.80052 6.83183 2.99507 6.7669 3.15828 6.65017C3.32149 6.53344 3.44581 6.37031 3.51507 6.18198C3.59575 5.99918 3.61981 5.79641 3.58416 5.59981C3.54852 5.4032 3.45479 5.22179 3.31507 5.07895L3.27871 5.04259C3.16601 4.93001 3.0766 4.79633 3.0156 4.64918C2.9546 4.50203 2.92321 4.3443 2.92321 4.18501C2.92321 4.02572 2.9546 3.86799 3.0156 3.72084C3.0766 3.57369 3.16601 3.44001 3.27871 3.32744C3.39128 3.21474 3.52496 3.12533 3.67211 3.06433C3.81926 3.00333 3.97699 2.97194 4.13628 2.97194C4.29557 2.97194 4.4533 3.00333 4.60045 3.06433C4.7476 3.12533 4.88128 3.21474 4.99386 3.32744L5.03022 3.3638C5.17306 3.50352 5.35447 3.59725 5.55108 3.63289C5.74768 3.66854 5.95045 3.64448 6.13325 3.5638H6.18174C6.36099 3.48697 6.51387 3.35941 6.62155 3.19681C6.72923 3.03421 6.78702 2.84367 6.7878 2.64865V2.54562C6.7878 2.22414 6.9155 1.91584 7.14282 1.68852C7.37014 1.4612 7.67844 1.3335 7.99992 1.3335C8.32139 1.3335 8.6297 1.4612 8.85702 1.68852C9.08433 1.91584 9.21204 2.22414 9.21204 2.54562V2.60016C9.21282 2.79518 9.27061 2.98572 9.37829 3.14832C9.48597 3.31092 9.63885 3.43849 9.8181 3.51531C10.0009 3.59599 10.2037 3.62006 10.4003 3.58441C10.5969 3.54876 10.7783 3.45503 10.9211 3.31531L10.9575 3.27895C11.0701 3.16625 11.2038 3.07685 11.3509 3.01585C11.4981 2.95485 11.6558 2.92345 11.8151 2.92345C11.9744 2.92345 12.1321 2.95485 12.2792 3.01585C12.4264 3.07685 12.5601 3.16625 12.6726 3.27895C12.7853 3.39152 12.8748 3.52521 12.9357 3.67236C12.9967 3.81951 13.0281 3.97723 13.0281 4.13653C13.0281 4.29582 12.9967 4.45355 12.9357 4.6007C12.8748 4.74785 12.7853 4.88153 12.6726 4.9941L12.6363 5.03047C12.4966 5.1733 12.4028 5.35472 12.3672 5.55132C12.3315 5.74792 12.3556 5.9507 12.4363 6.1335V6.18198C12.5131 6.36124 12.6407 6.51411 12.8033 6.6218C12.9659 6.72948 13.1564 6.78726 13.3514 6.78804H13.4545C13.7759 6.78804 14.0842 6.91575 14.3116 7.14306C14.5389 7.37038 14.6666 7.67869 14.6666 8.00016C14.6666 8.32164 14.5389 8.62995 14.3116 8.85726C14.0842 9.08458 13.7759 9.21228 13.4545 9.21228H13.3999C13.2049 9.21306 13.0144 9.27085 12.8518 9.37853C12.6892 9.48621 12.5616 9.63909 12.4848 9.81835Z" 
                        stroke="#667085" 
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                    {{ $t('navbar.setting') }}
                  </div>
                </el-dropdown-item>
              </a>
              <a href="/resource-console">
                <el-dropdown-item>
                  <div class="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8.66674 1.3335L2.72904 8.45873C2.4965 8.73778 2.38023 8.8773 2.37846 8.99514C2.37691 9.09757 2.42256 9.19503 2.50224 9.25943C2.5939 9.3335 2.77552 9.3335 3.13876 9.3335H8.00007L7.3334 14.6668L13.2711 7.54159C13.5036 7.26255 13.6199 7.12302 13.6217 7.00519C13.6232 6.90275 13.5776 6.80529 13.4979 6.7409C13.4062 6.66683 13.2246 6.66683 12.8614 6.66683H8.00007L8.66674 1.3335Z" stroke="#667085" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    {{ $t('navbar.console') }}
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
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4">
                      <path d="M7.99992 3.3335V12.6668M3.33325 8.00016H12.6666" stroke="#667085" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    {{ $t('navbar.newModel') }}
                  </div>
                </el-dropdown-item>
              </a>
              <a v-if="hasEmail"
                 href="/datasets/new">
                <el-dropdown-item>
                  <div class="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4">
                      <path d="M7.99992 3.3335V12.6668M3.33325 8.00016H12.6666" stroke="#667085" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    {{ $t('navbar.newDataset') }}
                  </div>
                </el-dropdown-item>
              </a>
              <a v-if="hasEmail"
                 href="/codes/new">
                <el-dropdown-item>
                  <div class="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4">
                      <path d="M7.99992 3.3335V12.6668M3.33325 8.00016H12.6666" stroke="#667085" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    {{ $t('navbar.newCode') }}
                  </div>
                </el-dropdown-item>
              </a>
              <a v-if="hasEmail"
                 href="/spaces/new">
                <el-dropdown-item>
                  <div class="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4">
                      <path d="M7.99992 3.3335V12.6668M3.33325 8.00016H12.6666" stroke="#667085" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    {{ $t('navbar.newApplicationSpace') }}
                  </div>
                </el-dropdown-item>
              </a>
              <a v-if="hasEmail"
                href="/collections/new">
                <el-dropdown-item>
                  <div class="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4">
                      <path d="M7.99992 3.3335V12.6668M3.33325 8.00016H12.6666" stroke="#667085" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    {{ $t('navbar.newCollection') }}
                  </div>
                </el-dropdown-item>
              </a>
              <a v-if="hasEmail"
                 href="/organizations/new">
                <el-dropdown-item divided>
                  <div class="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12.6666 14V10M10.6666 12H14.6666M7.99992 10H5.33325C4.09074 10 3.46949 10 2.97943 10.203C2.32602 10.4736 1.80689 10.9928 1.53624 11.6462C1.33325 12.1362 1.33325 12.7575 1.33325 14M10.3333 2.19384C11.3105 2.58943 11.9999 3.54754 11.9999 4.66667C11.9999 5.78579 11.3105 6.7439 10.3333 7.13949M8.99992 4.66667C8.99992 6.13943 7.80601 7.33333 6.33325 7.33333C4.86049 7.33333 3.66659 6.13943 3.66659 4.66667C3.66659 3.19391 4.86049 2 6.33325 2C7.80601 2 8.99992 3.19391 8.99992 4.66667Z" stroke="#667085" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    {{ $t('navbar.newOrganization') }}
                  </div>
                </el-dropdown-item>
              </a>
              <a
                href="/daily_papers/new"
                v-if="canCreateDailyPaper">
                <el-dropdown-item>
                  <div class="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7.99992 3.3335V12.6668M3.33325 8.00016H12.6666" stroke="#667085" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    {{ $t('navbar.recommendation') }}
                  </div>
                </el-dropdown-item>
              </a>
              <a @click="clearCookies">
                <el-dropdown-item divided>
                  <div class="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10.6667 11.3333L14 8M14 8L10.6667 4.66667M14 8H6M6 2H5.2C4.0799 2 3.51984 2 3.09202 2.21799C2.7157 2.40973 2.40973 2.71569 2.21799 3.09202C2 3.51984 2 4.07989 2 5.2V10.8C2 11.9201 2 12.4802 2.21799 12.908C2.40973 13.2843 2.71569 13.5903 3.09202 13.782C3.51984 14 4.0799 14 5.2 14H6" stroke="#667085" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
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
            class="md:hidden">
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
    v-if="!hasEmail && isLoggedInBoolean"
    :title="$t('navbar.emailMissing')"
    center
    show-icon
    type="warning"></el-alert>
</template>

<script>
  import MenuItems from './MenuItems.vue'
  import useUserStore from '../../stores/UserStore.js'
  import { inject } from 'vue'
  import useFetchApi from '../../packs/useFetchApi.js'
  import { mapState } from 'pinia'
  import { useCookies } from "vue3-cookies"

  export default {
    props: {
      logo: String,
      isLoggedIn: String
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
      MenuItems
    },
    computed: {
      ...mapState(useUserStore, ['email', 'username', 'nickname', 'initialized']),
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
        const {data, _} = await useFetchApi(`/user/${this.uuid}?type=uuid`).json()
        if (data.value) {
          this.userAvatar = data.value.data.avatar
          this.userStore.initialize(data.value.data)
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
      height: auto;
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
</style>
