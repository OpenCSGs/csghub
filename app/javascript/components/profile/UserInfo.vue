<template>
    <div>
      <div>
       <el-avatar :size="120" :src="avatar"> </el-avatar>
      </div>
      <div class="text-[24px] leading-[32px] font-semibold">{{name}}</div>
      <!-- <div class="text-[16px] text-[#909399] leading-[24px] mb-[24px]">@handle</div> -->
      <div class="flex text-[#606266] text-[16px] leading-[24px] gap-[24px] mb-[16px]">
        <div class="w-[64px]">角色</div>
        <div>{{user}}</div>
      </div>
      <div class="flex text-[#606266] text-[16px] leading-[24px] gap-[24px] mb-[16px]">
        <div class="w-[64px]">电话</div>
        <div>{{phone}}</div>
      </div>
      <div class="flex text-[#606266] text-[16px] leading-[24px] gap-[24px] mb-[16px]">
        <div class="w-[64px]">邮箱</div>
        <div>{{email}}</div>
        <!-- <div class="px-[12px] py-[2px] border border-[#DCDFE6] rounded-[4px] text-[12px] leading-[20px] font-medium">验证</div> -->
      </div>
      <div class="flex mb-[24px] text-[#606266] text-[16px] leading-[24px] gap-[24px]">
        <div class="w-[64px]">最后登录</div>
        <div>{{time}}</div>
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
    email: String,
    lastTime: String,
    roles:String
  },
  data() {
    return {
        time:this.lastTime?this.lastTime.slice(0, -6):'',
        user:this.roles?JSON.parse(this.roles)[0]:[]
    };
  },
  mounted() {},
};
</script>
