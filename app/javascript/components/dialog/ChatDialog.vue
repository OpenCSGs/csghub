<template>
  <div v-if="dialogVisible" class="h-[75vh] fixed flex flex-col justify-between top-2 right-0 mt-2 min-w-[438px] bg-white p-6 md:p-1 rounded-md shadow-md md:min-w-[300px] md:w-full sm:max-w-[375px]  z-20 border border-[[#EAECF0]]">
    <div class="flex gap-4 items-center border-b pb-6 mb-6 border-[#EAECF0] relative">
      <SvgIcon name="ekb_icon" />
      <div class="flex flex-col">
        <div class="text-[20px] leading-[30px] text-[#101828]">传奇兽</div>
        <div class="text-[14px] leading-[20px] text-[#475467] font-light">更加智能的大语言模型知识助手</div>
      </div>
      <SvgIcon @click="handleClose" name="close" class="absolute cursor-pointer right-0 top-0"/>
    </div>
    <div class="w-full h-full sm:max-w-[375px] overflow-hidden">
      <iframe v-if="chatSrc" :src="chatSrc" width="100%" height="100%" class="rounded-[10px]" />
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  const chatSrc = 'https://ekb.opencsg.com/chat?app_id=2dwvScahVOWtR9v4SfF3z0e5UWc&theme=light&lang=zh-CN'
  const dialogVisible = ref(false)

  const handleOpen = () =>{
    dialogVisible.value = true;
  }

  const handleClose = () => {
    dialogVisible.value = false;
  };
  defineExpose({
    handleOpen
  })
</script>
