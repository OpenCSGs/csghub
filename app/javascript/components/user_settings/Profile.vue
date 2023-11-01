<template>
  <div class="px-[54px] md:px-[50px] sm:px-[20px]">
    <div>
      <el-avatar :size="120" :src="avatar"> </el-avatar>
    </div>
    <div class="text-[24px] leading-[32px] font-semibold">{{ name }}</div>
    <div class="text-[16px] px-[3px] bg-[#90939950] rounded-[5px] max-w-[max-content] leading-[24px] mb-[16px]">
      {{ loginIdentity }}
    </div>
    <a href="/settings/profile" class="px-[12px] py-[5px] border border-[#DCDFE6] rounded-[4px] text-[14px] leading-[22px] font-medium">Edit profile</a>
    <div class="mt-[16px]">{{ phone }}</div>
    <div class="mt-[16px]">{{ email }}</div>
    <div class="my-[16px]">
      <div class="text-[20px] leading-[32px] font-semibold mb-[8px]">
        Research interests
      </div>
      <div class="text-[#909399]">None yet</div>
    </div>
    <div class="my-[16px]">
      <div class="text-[20px] leading-[32px] font-semibold mb-[8px]">
        Organizations
      </div>
      <div class="text-[#909399]">None yet</div>
    </div>
    <div class="flex mb-[24px] text-[#606266] text-[16px] leading-[24px] gap-[24px]">
      <div class="w-[64px]">最后登录</div>
      <div>{{ theLastLoginTime }}</div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    name: String,
    phone: String,
    avatar: String,
    email: String,
    lastLoginTime: String,
    loginIdentity: String,
    roles: String,
  },
  data() {
    return {
      theLastLoginTime: this.lastLoginTime ? this.lastLoginTime.slice(0, -6) : "",
    };
  },
  mounted() {},
};
</script>
