<template>
    <div class="pt-6">
      <div class="w-[294px] rounded-[8px] mx-[24px]">
        <div class="flex p-[16px]">
          <el-avatar :size="60" :src="userStore.avatar"> </el-avatar>
          <div class="ml-[10px]">
            <div class="text-[18px] leading-[28px] font-semibold">
              <a :href="'/profile/' + userStore.username">
                {{ userStore.nickname || userStore.username }}
              </a>
            </div>
            <div class="text-[16px] text-[#909399] leading-[24px] font-light">@{{ userStore.username }}</div>
          </div>
        </div>
        <div class="flex flex-col">
          <!-- profile -->
          <a href="/settings/profile"
             class="p-[16px] hover:bg-[#F9FAFB] border-[#DCDFE6] text-[16px] text-[#606266] leading-[24px] cursor-pointer"
             :class="menuClass('/settings/profile')"
          >
              {{ $t('profile.menu.profile')}}
          </a>

          <!-- <div class="p-[16px] hover:bg-[#EBEDF0] border-b border-[#DCDFE6] text-[18px] text-[#606266] leading-[26px] opacity-40"
               :class="menuClass('/settings/account')"
          >
            {{ $t('profile.menu.accountInformation')}}
          </div> -->

          <!-- <div class="p-[16px] hover:bg-[#EBEDF0] border-b border-[#DCDFE6] text-[18px] text-[#606266] leading-[26px] opacity-40"
               :class="menuClass('/settings/accessTokens')"
          >
            {{ $t('profile.menu.accessToken')}}
          </div> -->

          <!-- access token -->
          <a v-if="hasEmail"
             href="/settings/access-token"
             class="p-[16px] hover:bg-[#F9FAFB] border-[#DCDFE6] text-[16px] text-[#606266] leading-[24px] cursor-pointer"
             :class="menuClass('/settings/access-token')"
          >
            {{ $t('profile.menu.gitToken')}}
          </a>

          <!-- starship api key -->
          <a v-if="hasEmail"
             href="/settings/starship-access-token"
             class="p-[16px] hover:bg-[#F9FAFB] border-[#DCDFE6] text-[16px] text-[#606266] leading-[24px] cursor-pointer"
             :class="menuClass('/settings/starship-access-token')"
          >
            {{ $t('profile.menu.starshipAccessToken')}}
          </a>

          <!-- sync access token -->
          <a v-if="hasEmail"
             href="/settings/sync-access-token"
             class="p-[16px] hover:bg-[#F9FAFB] border-[#DCDFE6] text-[16px] text-[#606266] leading-[24px] cursor-pointer"
             :class="menuClass('/settings/sync-access-token')"
          >
            {{ $t('profile.menu.syncAccessToken')}}
          </a>

          <!-- ssh key -->
          <a v-if="hasEmail"
             href="/settings/ssh-keys"
             class="p-[16px] hover:bg-[#F9FAFB] border-[#DCDFE6] text-[16px] text-[#606266] leading-[24px] cursor-pointer"
             :class="menuClass('/settings/ssh-keys')"
          >
            {{ $t('profile.menu.sshKey')}}
          </a>

        <a
          v-if="hasEmail"
          href="/settings/billing"
          class="p-[16px] hover:bg-[#F9FAFB] border-[#DCDFE6] text-[16px] text-[#606266] leading-[24px] cursor-pointer"
          :class="menuClass('/settings/billing')"
        >
          {{ $t('profile.menu.billing') }}
        </a>
        </div>
      </div>
    </div>
</template>

<script setup>
  import { computed } from 'vue'
  import useUserStore from '../../stores/UserStore'

  const userStore = useUserStore()

  const hasEmail = computed(() => {
    return !!userStore.email
  })

  const menuClass = (menuPath) => {
    if (menuPath === window.location.pathname) {
      return 'text-[#303133] font-semibold'
    } else {
      return ''
    }
  }
</script>
