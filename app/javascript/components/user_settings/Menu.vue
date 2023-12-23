<template>
    <div>
      <div class="w-[294px] border rounded-[8px] bg-[#FAFAFA] border-[#DCDFE6] mx-[24px]">
        <div class="flex p-[16px] border-b border-[#DCDFE6]">
          <el-avatar :size="60" :src="avatar"> </el-avatar>
          <div class="ml-[10px]">
            <div class="text-[24px] leading-[32px] font-semibold">
              <a :href="'/profile/' + displayName">
                {{displayName}}
              </a>
            </div>
            <div class="text-[16px] text-[#909399] leading-[24px]">@{{name}}</div>
          </div>
        </div>
        <div class="flex flex-col">
          <a href="/settings/profile" class="p-[16px] hover:bg-[#EBEDF0] border-b border-[#DCDFE6] text-[18px] text-[#606266] leading-[26px] cursor-pointer"
               :class="menuClass('/settings/profile')"
          >
              个人资料
          </a>
          <div class="p-[16px] hover:bg-[#EBEDF0] border-b border-[#DCDFE6] text-[18px] text-[#606266] leading-[26px] opacity-40"
               :class="menuClass('/settings/account')"
          >
            账户信息
          </div>
          <div class="p-[16px] hover:bg-[#EBEDF0] border-b border-[#DCDFE6] text-[18px] text-[#606266] leading-[26px] opacity-40"
               :class="menuClass('/settings/accessTokens')"
          >
            Access Token
          </div>
          <a href="/settings/git-token" class="p-[16px] hover:bg-[#EBEDF0] border-b border-[#DCDFE6] text-[18px] text-[#606266] leading-[26px] cursor-pointer"
               :class="menuClass('/settings/git-token')"
          >
              Git Token
          </a>
          <a href="/settings/ssh-keys" class="p-[16px] hover:bg-[#EBEDF0] border-b border-[#DCDFE6] text-[18px] text-[#606266] leading-[26px] cursor-pointer"
               :class="menuClass('/settings/ssh-keys')"
          >
              SSH Keys
          </a>
          <div class="p-[16px] hover:bg-[#EBEDF0] text-[18px] text-[#606266] leading-[26px] opacity-40"
               :class="menuClass('/settings/billing')"
          >
            账单
          </div>
        </div>
      </div>
    </div>
</template>
<script>
export default {
  props: {
    name: String,
    displayName: String,
    avatar: String,
  },
  data() {
    return {};
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
