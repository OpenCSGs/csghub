<template>
  <div class="rounded-[16px] bg-white p-[36px]">
    <h3 class="text-[#303133] text-[20px] font-[600]">新建组织</h3>
    <div class="mt-[16px]">
      <div class="flex sm:flex-col gap-[16px] mb-[16px]">
        <div class="w-[284px]">
          <p class="text-[#303133] text-[14px] mb-[8px]">组织命名空间</p>
          <el-input v-model="input" placeholder="Please input" input-style="height: 40px" />
        </div>
        <div class="w-[284px]">
          <p class="text-[#303133] text-[14px] mb-[8px]">组织别名</p>
          <el-input v-model="input" placeholder="Please input" input-style="height: 40px" />
        </div>
      </div>
      <div class="flex sm:flex-col gap-[16px] mb-[16px]">
        <div class="w-[284px]">
          <p class="text-[#303133] text-[14px] mb-[8px]">组织头像</p>
          <el-input type='file' v-model="input" placeholder="Please input" input-style="height: 40px" />
        </div>
        <div class="w-[284px]">
          <p class="text-[#303133] text-[14px] mb-[8px]">组织类型</p>
          <el-input v-model="input" placeholder="Please input" input-style="height: 40px" />
        </div>
      </div>
      <div class="mb-[16px]">
        <p class="text-[#303133] text-[14px] mb-[8px]">组织主页</p>
        <el-input v-model="input" placeholder="Please input" input-style="height: 40px" />
      </div>
      <button class="bg-[#8AA2FF] w-full rounded-[4px] px-[20px] py-[9px] text-white">创建组织</button>
    </div>
  </div>
</template>

<script>
</script>