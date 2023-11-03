<template>
    <div>
      <div class="w-[294px] border rounded-[8px] bg-[#FAFAFA] border-[#DCDFE6] ml-[80px] md:ml-[20px] mr-[24px]">
        <div class="flex p-[16px] border-b border-[#DCDFE6]">
          <el-avatar :size="60" :src="avatar"> </el-avatar>
          <div class="ml-[10px]">
            <div class="text-[24px] leading-[32px] font-semibold">{{name}}</div>
            <div class="text-[16px] text-[#909399] leading-[24px]">@handle</div>
          </div>
        </div>
        <div class="flex flex-col">
          <div class="p-[16px] hover:bg-[#EBEDF0] border-b border-[#DCDFE6] text-[18px] text-[#606266] leading-[26px] cursor-pointer" :class="menuClass('/settings/profile')">Profile</div>
          <div class="p-[16px] hover:bg-[#EBEDF0] border-b border-[#DCDFE6] text-[18px] text-[#606266] leading-[26px] cursor-pointer" :class="menuClass('/settings/account')">Account</div>
          <div class="p-[16px] hover:bg-[#EBEDF0] border-b border-[#DCDFE6] text-[18px] text-[#606266] leading-[26px] cursor-pointer" :class="menuClass('/settings/accessTokens')">Access Tokens</div>
          <div class="p-[16px] hover:bg-[#EBEDF0] border-b border-[#DCDFE6] text-[18px] text-[#606266] leading-[26px] cursor-pointer" :class="menuClass('/settings/keys')">SSH and GPG Keys</div>
          <div class="p-[16px] hover:bg-[#EBEDF0] text-[18px] text-[#606266] leading-[26px] cursor-pointer" :class="menuClass('/settings/billing')">Billing</div>
        </div>
      </div>
    </div>
</template>
<script>
export default {
  props: {
    name: String,
    avatar: String,
  },
  data() {
    return {
    };
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
