import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export default useChatStore = defineStore('chat', () => {

  // states
  const dialogVisibility = ref(true)

  // getters
  const isVisibility = computed(() => !!dialogVisibility.value)

  // actions
  const updateVisibility = (input) => {
    dialogVisibility.value = input
  }

  return {
    dialogVisibility,
    isVisibility,
    updateVisibility
  }
})