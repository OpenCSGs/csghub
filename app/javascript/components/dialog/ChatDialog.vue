<template>
  <el-dialog
    v-model="dialogVisible"
    width="98%"
    top="10vh"
    :show-close="true"
    :close-on-click-modal="false"
    :before-close="handleClose"
    :style="{ borderRadius: '10px' }"
    class="max-w-[438px] md:w-full chatDialog"
  >
    <template #header="{ close }">
      <div class="flex gap-4 items-center pt-6">
        <SvgIcon name="ekb_icon" />
        <div class="flex flex-col">
          <div class="text-[20px] leading-[30px] text-[#101828]">传奇兽</div>
          <div class="text-[14px] leading-[20px] text-[#475467] font-light">更加智能的大语言模型知识助手</div>
        </div>
      </div>
      <div class="flex w-full my-6 bg-[#EAECF0] h-[1px]"></div>
    </template>
    <div class="w-full h-full min-h-[600px] md:min-h-[400px]">
      <iframe  v-if="chatSrc" :src="chatSrc" width="100%" class="min-h-[600px] md:min-h-[400px] rounded-[10px]" />
    </div>
  </el-dialog>
</template>

<script setup>
  import { ref, onMounted, inject, computed } from 'vue';
  import useChatDialogStore from '../../stores/ChatStore.js';
  const chatStore = useChatDialogStore();
  const chatSrc = 'https://ekb.opencsg.com/chat?app_id=2dwvScahVOWtR9v4SfF3z0e5UWc&theme=light&lang=zh-CN'
  
  const props = defineProps({
    isShow: String
  });

  const dialogVisible = computed({
    get: () => chatStore.isVisibility,
    set: (value) => chatStore.updateVisibility(value),
  });

  const openDialog = () => {
    dialogVisible.value = true;
  };

  const handleClose = () => {
    dialogVisible.value = false;
  };
</script>
<style>
.chatDialog {
  .el-dialog__header {
    padding: 0 !important;
  }
  .el-dialog__body {
    padding: 0 !important;
  }
}
</style>
