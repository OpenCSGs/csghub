<template>
  <div
    class="h-[34px] px-3 py-2 bg-white rounded-lg shadow border border-[#cfd4dc] justify-center items-center gap-1 inline-flex">
    <div class="px-0.5 justify-center items-center flex">
      <div
        class="text-[#344053] text-xs font-normal font-['PingFang SC'] leading-[18px]">
        下一页
      </div>
    </div>
    <ElIcon>
      <Right />
    </ElIcon>
  </div>
</template>

<script setup>
  import { ElIcon } from 'element-plus'
  import { Right } from '@element-plus/icons-vue'
</script>
