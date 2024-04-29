<template>
  <div class="fixed bottom-[50px] right-[30px] z-20">
    <ChatDialog ref="chatRef" />
    <el-popover placement="top-start" :width="204" trigger="hover">
      <h3 class="text-center mb-[3px]">联系小助手了解更多</h3>
      <img :src="littleAssistant" width="180" height="180" class="z-10">
      <template #reference>
        <img :src="monsterGif" class="w-[120px] sm:w-[60px]" @click="showChatDialog">
      </template>
    </el-popover>
  </div>
</template>
<script setup>
  import { ref, onMounted, inject, computed } from 'vue';
  import ChatDialog from './ChatDialog.vue'
  const chatRef =ref(null)

  const props = defineProps({
    littleAssistant: String,
    monsterGif: String,
  });

  const showChatDialog = () =>{
    chatRef.value.handleOpen()
  }

</script>
