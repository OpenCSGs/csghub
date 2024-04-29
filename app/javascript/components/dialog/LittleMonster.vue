<template>
  <div class="fixed bottom-[50px] right-[30px] z-20">
    <ChatDialog ref="chatRef" />
    <img :src="monsterGif" class="w-[120px] sm:w-[60px]" @click="showChatDialog">
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
