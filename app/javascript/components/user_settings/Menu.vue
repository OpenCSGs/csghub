<template>
    <div class="pt-6">
      <div class="w-[294px] rounded-[8px] mx-[24px]">
        <div class="flex p-[16px]">
          <el-avatar :size="60" :src="avatar"> </el-avatar>
          <div class="ml-[10px]">
            <div class="text-[18px] leading-[28px] font-semibold">
              <a :href="'/profile/' + displayName">
                {{displayName}}
              </a>
            </div>
            <div class="text-[16px] text-[#909399] leading-[24px] font-light">@{{name}}</div>
          </div>
        </div>
        <div class="flex flex-col">
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

          <a v-if="hasEmail"
             href="/settings/access-token"
             class="p-[16px] hover:bg-[#F9FAFB] border-[#DCDFE6] text-[16px] text-[#606266] leading-[24px] cursor-pointer"
             :class="menuClass('/settings/access-token')"
          >
            {{ $t('profile.menu.gitToken')}}
          </a>

          <a href="/settings/starship-access-token"
             class="p-[16px] hover:bg-[#F9FAFB] border-[#DCDFE6] text-[16px] text-[#606266] leading-[24px] cursor-pointer"
             :class="menuClass('/settings/starship-access-token')"
          >
            {{ $t('profile.menu.starshipAccessToken')}}
          </a>

          <a href="/settings/sync-access-token"
             class="p-[16px] hover:bg-[#F9FAFB] border-[#DCDFE6] text-[16px] text-[#606266] leading-[24px] cursor-pointer"
             :class="menuClass('/settings/sync-access-token')"
          >
            {{ $t('profile.menu.syncAccessToken')}}
          </a>

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
<script>
export default {
  props: {
    name: String,
    loginIdentity: String,
    displayName: String,
    avatar: String,
    email: String
  },
  data() {
    return {
      hasEmail: this.email.length !== 0
    }
  },
  mounted() {},
  methods: {
    menuClass(menuPath) {
      if (menuPath === window.location.pathname) {
        return 'text-[#303133] font-semibold'
      } else {
        return ''
      }
    }
  }
};
</script>
