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
        <el-tooltip content="https://opencsg.com/docs/inferencefinetune/inference_tasks/text-to-image" placement="top" effect="dark">
          <SvgIcon name="info"  class="w-[12px] h-[12px] cursor-pointer" @click="toDocPage"/>
        </el-tooltip>
      </div>
      <div
        class="flex items-center justify-between gap-2 rounded-lg relative">
        <el-input
          v-model="message"
          class="input-with-border"
          inputStyle="outline: none"
          :disabled="loading"
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
              : 'bg-gray-100 cursor-not-allowed'
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

      <div class="grid grid-cols-3 gap-4 mt-4">
        <CsgButton
          class="btn btn-secondary-gray btn-sm w-full !h-[34px]"
          :name="$t('endpoints.playground.retry')"
          :disabled="!lastMessage || loading"
          @click="handleRetry"
        />

        <CsgButton
          class="btn btn-secondary-gray btn-sm w-full !h-[34px]"
          :name="$t('endpoints.playground.undo')"
          :disabled="!imageSrc || loading"
          @click="handleUndo"
        />

        <CsgButton
          class="btn btn-secondary-gray btn-sm w-full !h-[34px]"
          :name="$t('endpoints.playground.clear')"
          :disabled="loading"
          @click="handleClear"
        />
      </div>

      <div
        class="min-h-[180px] max-h-[480px] w-full overflow-x-auto px-3.5 py-3 mt-[12px] bg-gray-200 rounded-lg text-gray-700 flex items-center justify-center">
        <img
          v-if="imageSrc"
          :src="imageSrc"
          style="max-width: 90% !important"
          alt="Fetched Image" />
        <el-icon v-if="loading" class="is-loading w-8 h-8 text-gray-400"><Loading /></el-icon>
      </div>

      <div class="flex mt-4">
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
  import { ElMessage } from 'element-plus'
  import { Loading } from '@element-plus/icons-vue'

  const { cookies } = useCookies()

  const props = defineProps({
    form: Object,
    appEndpoint: String,
    modelId: String
  })

  const message = ref('')
  const lastMessage = ref('')
  const loading = ref(false)
  const inputFocus = ref(false)
  const compositionInput = ref(false)

  const imageSrc = ref('')

  const toDocPage = () => {
    window.open('https://opencsg.com/docs/inferencefinetune/inference_tasks/text-to-image', '_blank')
  }

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
    if (loading.value) return
    loading.value = true
    lastMessage.value = message.value
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
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch image');
      }

      const blob = await response.blob()
      const imageUrl = URL.createObjectURL(blob)
      imageSrc.value = imageUrl
      loading.value = false
      message.value = ''
    } catch (error) {
      ElMessage({
        message: error,
        type: 'warning'
      })
      loading.value = false
    }
  }

  const handleRetry = async () => {
    message.value = lastMessage.value
    imageSrc.value = ''
    await handleSendMessage()
  }

  const handleUndo = () => {
    message.value = ''
    imageSrc.value = ''
  }

  const handleClear = () => {
    message.value = ''
    imageSrc.value = ''
    lastMessage.value = ''
  }
</script>

<style scoped>
  :deep(.el-input .el-input__wrapper) {
    border: none;
    box-shadow: none;
    padding: 0;
  }

  :deep(.input-with-border .el-input__wrapper) {
    box-shadow: 0 0 0 1px var(--el-input-border-color, #dcdfe6) inset;
    border-radius: 4px;
    padding: 1px 11px;
  }

  :deep(.el-loading-spinner svg) {
    width: 50%;
  }

  :deep(.el-loading-mask) {
    border-radius: var(--border-radius-md);
  }
</style>
