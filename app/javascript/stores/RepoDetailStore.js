import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export default useRepoDetailStore = defineStore('repoDetail', () => {
  const isInitialized = ref(false)

  // states
  const privateVisibility = ref(null)

  // getters
  const isPrivate = computed(() => !!privateVisibility.value)

  // actions
  const updateVisibility = (input) => {
    privateVisibility.value = input
  }

  async function initialize(initialData) {
    if (!isInitialized.value) {
      privateVisibility.value = initialData.private
      isInitialized.value = true
    }
  }

  return {
    privateVisibility,
    isPrivate,
    updateVisibility,
    initialize
  }
})