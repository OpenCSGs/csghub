<template>
    <div class="pt-6">
      <div class="w-[294px] rounded-[8px] mx-[24px]">
        <div @click="clickProfile" class="flex p-[16px] cursor-pointer">
          <el-avatar :size="60" :src="userStore.avatar"> </el-avatar>
          <div class="ml-[10px]">
            <div class="text-[18px] leading-[28px] font-semibold">
              {{ userStore.nickname || userStore.username }}
            </div>
            <div class="text-[16px] text-gray-500 leading-[24px] font-light">@{{ userStore.username }}</div>
          </div>
        </div>
        <div class="flex flex-col">
          <!-- profile -->
          <a href="/settings/profile"
             class="p-[16px] hover:bg-gray-50 border-gray-200 text-[16px] text-gray-500 leading-[24px] cursor-pointer"
             :class="menuClass('/settings/profile')"
          >
              {{ $t('profile.menu.profile')}}
          </a>

          <!-- <div class="p-[16px] hover:bg-gray-100 border-b border-gray-200 text-[18px] text-gray-500 leading-[26px] opacity-40"
               :class="menuClass('/settings/account')"
          >
            {{ $t('profile.menu.accountInformation')}}
          </div> -->

          <!-- <div class="p-[16px] hover:bg-gray-100 border-b border-gray-200 text-[18px] text-gray-500 leading-[26px] opacity-40"
               :class="menuClass('/settings/accessTokens')"
          >
            {{ $t('profile.menu.accessToken')}}
          </div> -->

          <!-- access token -->
          <a v-if="hasEmail"
             href="/settings/access-token"
             class="p-[16px] hover:bg-gray-50 border-gray-200 text-[16px] text-gray-500 leading-[24px] cursor-pointer"
             :class="menuClass('/settings/access-token')"
          >
            {{ $t('profile.menu.gitToken')}}
          </a>

          <!-- starship api key -->
          <a v-if="hasEmail"
             href="/settings/starship-access-token"
             class="p-[16px] hover:bg-gray-50 border-gray-200 text-[16px] text-gray-500 leading-[24px] cursor-pointer"
             :class="menuClass('/settings/starship-access-token')"
          >
            {{ $t('profile.menu.starshipAccessToken')}}
          </a>

          <!-- sync access token -->
          <a v-if="hasEmail"
             href="/settings/sync-access-token"
             class="p-[16px] hover:bg-gray-50 border-gray-200 text-[16px] text-gray-500 leading-[24px] cursor-pointer"
             :class="menuClass('/settings/sync-access-token')"
          >
            {{ $t('profile.menu.syncAccessToken')}}
          </a>

          <!-- ssh key -->
          <a v-if="hasEmail"
             href="/settings/ssh-keys"
             class="p-[16px] hover:bg-gray-50 border-gray-200 text-[16px] text-gray-500 leading-[24px] cursor-pointer"
             :class="menuClass('/settings/ssh-keys')"
          >
            {{ $t('profile.menu.sshKey')}}
          </a>

          <!-- <div class="p-[16px] hover:bg-gray-100 text-[18px] text-gray-500 leading-[26px] opacity-40"
               :class="menuClass('/settings/billing')"
          >
            {{ $t('profile.menu.billing')}}
          </div> -->
        </div>
      </div>
    </div>
    <el-dialog
      v-model="showDialog"
      width="350"
      :style="{ borderRadius: '10px' }"
    >
      <template #header> 
        {{ $t('profile.menu.warningTip') }}
      </template>
      <div class="flex justify-center flex-col m-auto w-full relative">
        {{ $t('profile.menu.warningTipDesc') }}
      </div>
      <template #footer>
        <div class="dialog-footer flex justify-between">
          <el-button class="flex-1 mr-3 text-gray-700" size="large" @click="showDialog = false">{{ $t('organization.members.cancel') }}</el-button>
          <el-button class="flex-1" size="large" color="#3250BD" type="primary" :loading="loading" @click="handleConfirm">
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

  const menuClass = (menuPath) => {
    if (menuPath === window.location.pathname) {
      return 'text-gray-700 font-semibold'
    } else {
      return ''
    }
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
