<template>
  <div v-if="showBanner.show" :class="bannerClass" class="min-h-[72px] w-full flex items-center py-4">
    <div class="page-responsive-width flex justify-between md:gap-6 md:items-start">
      <div class="flex items-center gap-4 md:flex-col md:items-start max-w-[80%]">
        <div v-if="isLight" class="flex justify-center items-center rounded-[10px] p-3 bg-white border border-gray-200">
          <SvgIcon name="broadcast-notice-light" />
        </div>
        <div v-else class="flex justify-center items-center rounded-[10px] p-3 bg-brand-600">
          <SvgIcon name="broadcast-notice-dark" />
        </div>
        <p :class="isLight ? 'text-gray-700' : 'text-white'" class="text-md font-500">{{ activeBroadcast.content }}</p>
      </div>
      <SvgIcon v-if="isLight" name="broadcast-close-light" @click="closeBanner" />
      <SvgIcon v-else="isLight" name="broadcast-close-dark" @click="closeBanner" />
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import useFetchApi from '@/packs/useFetchApi';
  import { ElMessage } from 'element-plus';
  import { computed, onMounted } from 'vue';
  import SvgIcon from '../shared/SvgIcon.vue';
  import { useStorage } from '@vueuse/core'


  const showBanner = useStorage('show_banner', {initialized: false, show: false}, sessionStorage)

  const activeBroadcast = ref({
    theme: '',
    status: '',
    bc_type: '',
    content: ''
  })

  const isLight = computed(() => {
    return activeBroadcast.value.theme === 'light'
  })

  const bannerClass = computed(() => {
    if (activeBroadcast.value.theme === 'light') {
      return 'bg-gray-25 border-b border-gray-300'
    } else {
      return 'bg-brand-700'
    }
  })

  const fetchActiveBroadcast = async () => {
    const { data, error } = await useFetchApi('/broadcasts/active').json()
    if (data.value && data.value.data) {
      activeBroadcast.value.theme = data.value.data.theme
      activeBroadcast.value.status = data.value.data.status
      activeBroadcast.value.bc_type = data.value.data.bc_type
      activeBroadcast.value.content = data.value.data.content
      if (!showBanner.value.initialized) {
        showBanner.value.initialized = true
        showBanner.value.show = true
      }
    } else {
      showBanner.value.initialized = false
      showBanner.value.show = false
      console.log(error.value?.msg || "no active broadcast")
    }
  }

  const closeBanner = () => {
    showBanner.value.show = false
  }

  onMounted(() => {
    fetchActiveBroadcast()
  })
</script>