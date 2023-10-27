<template>
    <div>
      <div class="pl-[54px]">
        <div>
         <el-avatar :size="120" :src="avatar"> </el-avatar>
        </div>
        <div class="text-[24px] leading-[32px] font-semibold mb-[41px]">{{name}}</div>
      <!-- <div class="text-[16px] text-[#909399] leading-[24px] mb-[24px]">@handle</div> -->
        <div class="flex flex-col gap-[16px]">
          <div class="max-w-[73px] text-[16px] text-[#606266] leading-[24px] cursor-pointer" :class="this.active=='/settings/profile'?'text-[#303133] font-semibold':''">Profile</div>
          <div class="max-w-[73px] text-[16px] text-[#606266] leading-[24px] cursor-pointer" :class="this.active=='/settings/account'?'text-[#303133] font-semibold':''">Account</div>
          <div class="max-w-[73px] text-[16px] text-[#606266] leading-[24px] cursor-pointer" :class="this.active=='/settings/password'?'text-[#303133] font-semibold':''">Password</div>
          <div class="max-w-[73px] text-[16px] text-[#606266] leading-[24px] cursor-pointer" :class="this.active=='/settings/lastLogin'?'text-[#303133] font-semibold':''">最后登录</div>
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
        active:''
    };
  },
  mounted() {
    if (window.location.pathname) {
      this.active = window.location.pathname
    }
  },
};
</script>
