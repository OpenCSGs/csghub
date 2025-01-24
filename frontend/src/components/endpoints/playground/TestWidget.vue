<template>
  <div>
    <div
      class="h-[77px] w-full p-4 bg-white border-b border-gray-200 items-center gap-2 inline-flex rounded-tr-2xl">
      <SvgIcon name="playground_test" />
      <div class="text-gray-700 text-base font-medium leading-normal">
        {{ $t('endpoints.playground.wgTit') }}
      </div>
    </div>

    <div class="p-4">
      <div
        class="text-gray-700 text-sm font-medium leading-tight mb-4 flex items-center gap-2">
        <SvgIcon name="text_generation" />
        {{ $t('endpoints.playground.wgDec') }}
      </div>
      <div
        class="flex items-center justify-between p-3 gap-2 rounded-lg shadow border relative"
        :class="
          inputFocus
            ? 'border-brand-300 [box-shadow:rgba(16,_24,_40,_0.05)_0px_1px_2px,_rgba(77,_106,_214,_0.24)_0px_0px_0px_4px]'
            : ' border-gray-300'
        "
        v-loading="loading">
        <el-input
          v-model="message"
          inputStyle="outline: none"
          @focus="handleFocus"
          @blur="handleBlur"
          @keydown.enter="handleEnterPress"
          @compositionend="compositionEnd"
          @compositionstart="compositionStart"></el-input>

        <div
          class="h-[34px] px-3 py-2 rounded-lg shadow border border-gray-200 justify-center items-center gap-1 inline-flex flex-shrink-0"
          :class="
            canSendMessage
              ? 'bg-brand-600 cursor-pointer'
              : 'bg-[#f2f3f6] cursor-not-allowed'
          "
          @click="handleSendMessage">
          <div
            class="text-xs font-normal flex items-center justify-center gap-1"
            :class="canSendMessage ? 'text-white' : 'text-gray-400'">
            <SvgIcon name="send_message" />
            {{ $t('endpoints.playground.wgBtn') }}
          </div>
        </div>
      </div>
      <div
        class="min-h-[180px] w-full overflow-x-auto px-3.5 py-3 mt-[12px] bg-gray-200 rounded-lg shadow text-gray-700 flex items-center justify-center">
        <img
          v-if="imageSrc"
          :src="imageSrc"
          alt="Fetched Image" />
      </div>

      <div class="flex mt-[8px]">
        <SvgIcon
          name="exclamation_point"
          class="place-self-start" />
        <p class="ml-[4px] text-xs leading-[18px] text-gray-500">
          {{ $t('widgets.liabilityExemption') }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed } from 'vue'
  import { useCookies } from 'vue3-cookies'

  const { cookies } = useCookies()

  const props = defineProps({
    form: Object,
    appEndpoint: String,
    modelId: String
  })

  const message = ref('')
  const loading = ref(false)
  const inputFocus = ref(false)
  const compositionInput = ref(false)

  const imageSrc = ref('')

  const handleFocus = () => {
    inputFocus.value = true
  }

  const handleBlur = () => {
    inputFocus.value = false
  }

  const compositionEnd = (event) => {
    event.preventDefault()
    compositionInput.value = true
  }

  const compositionStart = (event) => {
    event.preventDefault()
    compositionInput.value = true
  }

  const handleEnterPress = (event) => {
    event.preventDefault()
    if (compositionInput.value) return

    handleSendMessage()
  }

  const canSendMessage = computed(() => {
    return !!message.value && !loading.value
  })

  const extraParams = computed(() => {
    if (props.form) {
      return Object.fromEntries(
        Object.entries(props.form).filter(
          ([key, value]) => value !== null && value !== ''
        )
      )
    } else {
      return {}
    }
  })

  const authHeaders = computed(() => {
    const userToken = cookies.get('user_token')

    return userToken
      ? {
          Authorization: `Bearer ${userToken}`
        }
      : {}
  })

  const handleSendMessage = async () => {
    const data = {
      inputs: message.value,
      parameters: { ...extraParams.value }
    }

    try {
      const response = await fetch(props.appEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'image/png',
          ...authHeaders.value
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      // 处理响应为 Blob（图片流）
      const blob = await response.blob() // 获取 Blob 对象

      // 创建一个 URL 对象并将其设置为 img 的 src
      const imageUrl = URL.createObjectURL(blob) // 创建图片 URL
      imageSrc.value = imageUrl // 设置 img 的 src
    } catch (error) {
      console.error('Error fetching image:', error)
    }
  }
</script>

<style scoped>
  :deep(.el-input .el-input__wrapper) {
    border: none;
    box-shadow: none;
    padding: 0;
  }

  :deep(.el-loading-spinner svg) {
    width: 50%;
  }

  :deep(.el-loading-mask) {
    border-radius: var(--border-radius-md);
  }
</style>
