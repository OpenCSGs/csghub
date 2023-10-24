<template>
    <div>
      <div>
       <el-avatar :size="120" :src="avatar"> </el-avatar>
      </div>
      <div class="text-[24px] leading-[32px] font-semibold">User Name</div>
      <div class="text-[16px] text-[#909399] leading-[24px] mb-[24px]">@handle</div>
      <div class="flex text-[#606266] text-[16px] leading-[24px] gap-[24px] mb-[16px]">
        <div class="w-[64px]">角色</div>
        <div>Developer</div>
      </div>
      <div class="flex text-[#606266] text-[16px] leading-[24px] gap-[24px] mb-[16px]">
        <div class="w-[64px]">电话</div>
        <div>185 8585 8585</div>
      </div>
      <div class="flex text-[#606266] text-[16px] leading-[24px] gap-[24px] mb-[16px]">
        <div class="w-[64px]">邮箱</div>
        <div>username@163.com</div>
        <div class="px-[12px] py-[2px] border border-[#DCDFE6] rounded-[4px] text-[12px] leading-[20px] font-medium">验证</div>
      </div>
      <div class="flex mb-[24px] text-[#606266] text-[16px] leading-[24px] gap-[24px]">
        <div class="w-[64px]">最后登录</div>
        <div>2023.08.24 12:00:00</div>
      </div>
      <span class="px-[12px] py-[5px] border border-[#DCDFE6] rounded-[4px] text-[14px] leading-[22px] font-medium">Edit profile</span>
    </div>
</template>
<script>
export default {
  props: {
    name: String,
    phone: String,
    avatar: String,
    mail: String,
    lastTime: String,
  },
  data() {
    return {};
  },
  mounted() {},
};
</script>
