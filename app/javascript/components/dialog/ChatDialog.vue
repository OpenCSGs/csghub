、
<template>
  <el-dialog
    v-model="dialogVisible"
    width="80%"
    :show-close="true"
    :close-on-click-modal="false"
    :before-close="handleClose"
    class="max-w-[438px] w-[80%]"
  >
    <template #header="{ close }">
      <div class="flex justify-between">
        <div class="px-[12px] py-[12px] rounded-[10px] border-[2px] border-[#EAECF0]">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M19 21V15M16 18H22M12 15H8C6.13623 15 5.20435 15 4.46927 15.3045C3.48915 15.7105 2.71046 16.4892 2.30448 17.4693C2 18.2044 2 19.1362 2 21M15.5 3.29076C16.9659 3.88415 18 5.32131 18 7C18 8.67869 16.9659 10.1159 15.5 10.7092M13.5 7C13.5 9.20914 11.7091 11 9.5 11C7.29086 11 5.5 9.20914 5.5 7C5.5 4.79086 7.29086 3 9.5 3C11.7091 3 13.5 4.79086 13.5 7Z" stroke="#344054" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>1
        <img src="/images/invite_bg.png" class="w-[200px] absolute top-0 left-0" />
      </div>
    </template>
    <div class="flex">iframe</div>
  </el-dialog>
</template>

<script setup>
  import { ref, onMounted, inject, computed } from 'vue';
  import useChatDialogStore from '../../stores/ChatStore.js';
  const chatStore = useChatDialogStore();

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
  console.log(props.dialog);
</script>
