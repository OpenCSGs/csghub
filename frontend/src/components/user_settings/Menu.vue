<template>
  <div class="pt-6">
    <div class="w-[294px] rounded-md mx-[24px] md:w-full md:mx-0">
      <div
        @click="clickProfile"
        class="flex p-[16px] cursor-pointer"
        id="user_settings_avatar_div">
        <el-avatar
          :size="60"
          :src="userStore.avatar">
        </el-avatar>
        <div class="ml-[10px]">
          <div class="text-lg leading-[28px] font-semibold">
            {{ userStore.nickname || userStore.username }}
          </div>
          <div class="text-md text-gray-500 leading-[24px] font-light">
            @{{ userStore.username }}
          </div>
        </div>
      </div>
      <div class="flex flex-col gap-1 md:hidden">
        <!-- profile -->
        <a
          href="/settings/profile"
          class="px-3 py-2.5 text-md text-gray-500 rounded-sm hover:bg-gray-50 leading-6 cursor-pointer"
          :class="menuClass('/settings/profile')">
          {{ $t('profile.accountSetting') }}
        </a>

        <!-- access token -->
        <a
          v-if="hasEmail"
          href="/settings/access-token"
          class="px-3 py-2.5 text-md text-gray-500 rounded-sm hover:bg-gray-50 leading-6 cursor-pointer"
          :class="menuClass('/settings/access-token')">
          {{ $t('profile.menu.gitToken') }}
        </a>

        <!-- ssh key -->
        <a
          v-if="hasEmail"
          href="/settings/ssh-keys"
          class="px-3 py-2.5 text-md text-gray-500 rounded-sm hover:bg-gray-50 leading-6 cursor-pointer"
          :class="menuClass('/settings/ssh-keys')">
          {{ $t('profile.menu.sshKey') }}
        </a>
      </div>
      <!-- mobile tabs -->
      <div class="profileTabs hidden md:block">
        <el-tabs
          v-model="activeTab"
          @tabClick="handleTabClick">
          <el-tab-pane
            :label="$t('profile.accountSetting')"
            name="/settings/profile"></el-tab-pane>
          <el-tab-pane
            v-if="hasEmail"
            :label="$t('profile.menu.gitToken')"
            name="/settings/access-token"></el-tab-pane>
          <el-tab-pane
            v-if="hasEmail"
            :label="$t('profile.menu.sshKey')"
            name="/settings/ssh-keys"></el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>

  <el-dialog
    v-model="showDialog"
    width="350"
    :style="{ borderRadius: '10px' }">
    <template #header>
      {{ $t('profile.menu.warningTip') }}
    </template>
    <div class="flex justify-center flex-col m-auto w-full relative">
      {{ $t('profile.menu.warningTipDesc') }}
    </div>
    <template #footer>
      <div class="dialog-footer flex justify-between">
        <el-button
          id="user_settings_dialog_cancel"
          class="flex-1 mr-3 text-gray-700"
          size="large"
          @click="showDialog = false"
          >{{ $t('organization.members.cancel') }}</el-button
        >
        <el-button
          id="user_settings_dialog_confirm"
          class="flex-1"
          size="large"
          color="#3250BD"
          type="primary"
          :loading="loading"
          @click="handleConfirm">
          {{ $t('organization.members.confirm') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
  import { computed, ref } from 'vue'
  import useUserStore from '../../stores/UserStore'

  const props = defineProps({
    hasSave: {
      type: Boolean,
      default: true
    }
  })

  const userStore = useUserStore()
  const hasEmail = computed(() => {
    return !!userStore.email
  })
  const showDialog = ref(false)
  const activeTab = ref(window.location.pathname)

  const menuClass = (menuPath) => {
    return [
      menuPath === window.location.pathname ? 'bg-gray-50 text-gray-700' : 'bg-white',
    ]
  }

  const handleTabClick = (tab) => {
    location.href = tab.paneName
  }

  const clickProfile = () => {
    if (props.hasSave) {
      window.location.href = '/profile/' + userStore.username
    } else {
      showDialog.value = true
    }
  }

  const handleConfirm = () => {
    window.location.href = '/profile/' + userStore.username
  }
</script>
<style>
  .profileTabs .el-tabs__nav-scroll {
    @media screen and (max-width: 768px) {
      padding-left: 0px !important;
    }
  }

</style>
