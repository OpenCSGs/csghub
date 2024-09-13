<template>
  <div
    class="h-[77px] w-full p-4 bg-white border-b border-[#eaecf0] items-center gap-2 inline-flex rounded-tr-2xl"
  >
    <SvgIcon name="playground_test" />
    <div class="text-[#344053] text-base font-medium leading-normal">
      {{ $t('endpoints.playground.test') }}
    </div>
  </div>

  <div class="p-4">
    <div
      class="text-[#344053] text-sm font-medium leading-tight mb-4 flex items-center gap-2"
    >
      <SvgIcon name="text_generation" />
      {{ $t('endpoints.playground.generation') }}
    </div>
    <div
      class="min-h-[180px] px-3.5 py-3 bg-white rounded-lg shadow border border-[#cfd4dc] text-[#0f1728] text-base font-light leading-normal mb-4 overflow-auto"
    >
      <MarkdownViewer :content="anwserContent" />
    </div>
    <div
      class="flex items-center justify-between p-3 gap-2 rounded-lg shadow border relative"
      :class="
        inputFocus
          ? 'border-[#6483f8] [box-shadow:rgba(16,_24,_40,_0.05)_0px_1px_2px,_rgba(77,_106,_214,_0.24)_0px_0px_0px_4px]'
          : 'border-[#cfd4dc]'
      "
      v-loading="loading"
    >
      <el-input
        v-model="message"
        inputStyle="outline: none"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown.enter="handleEnterPress"
        @compositionend="compositionEnd"
        @compositionstart="compositionStart"
      ></el-input>

      <div
        class="h-[34px] px-3 py-2 rounded-lg shadow border border-[#eaecf0] justify-center items-center gap-1 inline-flex flex-shrink-0"
        :class="
          canSendMessage
            ? 'bg-[#3250bd] cursor-pointer'
            : 'bg-[#f2f3f6] cursor-not-allowed'
        "
        @click="handleSendMessage"
      >
        <div
          class="text-xs font-normal flex items-center justify-center gap-1"
          :class="canSendMessage ? 'text-[#fff]' : 'text-[#98a1b2]'"
        >
          <SvgIcon name="send_message" />
          {{ $t('endpoints.playground.send') }}
        </div>
      </div>
    </div>

    <div class="flex mt-[8px]"> 
      <SvgIcon name="exclamation_point" class="place-self-start" /> 
      <p class="ml-[4px] text-[12px] leading-[18px] text-[#667085]">{{ $t('widgets.liabilityExemption') }}</p>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed } from 'vue'
  import { fetchEventSource } from '@microsoft/fetch-event-source'
  import { Typewriter } from '../../../packs/typewriter'
  import { useCookies } from 'vue3-cookies'
  import { ElMessage } from 'element-plus'
  import MarkdownViewer from '../../shared/viewers/MarkdownViewer.vue'

  const { cookies } = useCookies()

  const props = defineProps({
    form: Object,
    appEndpoint: String,
    modelId: String
  })

  const anwserContent = ref('')
  const message = ref('')
  const loading = ref(false)
  const inputFocus = ref(false)
  const compositionInput = ref(false)

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

  const typewriter = new Typewriter((str) => {
    if (str) {
      anwserContent.value += str
    }
  })

  const resetAnwserContent = () => {
    anwserContent.value = ''
  }

  const canSendMessage = computed(() => {
    return !!message.value && !loading.value
  })

  const extraParams = computed(() => {
    return props.form
      ? props.form
      : {
          temperature: 0.2,
          max_tokens: 200,
          top_k: 10,
          top_p: 0.95,
          repetition_penalty: 1.0
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

  const handleSendMessage = () => {
    if (!canSendMessage.value) return

    loading.value = true

    resetAnwserContent()

    const endpoint = `${props.appEndpoint}/v1/chat/completions`
    const payload = {
      model: props.modelId,
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: message.value }
      ],
      stream: true,
      ...extraParams.value
    }
    const headers = {
      'Content-Type': 'application/json',
      ...authHeaders.value
    }

    fetchEventSource(endpoint, {
      method: 'POST',
      openWhenHidden: true,
      headers,
      body: JSON.stringify(payload),
      onopen: handleOpen,
      onmessage: handleMessage,
      onclose: handleClose,
      onerror: handleError
    })
  }

  const handleOpen = (e) => {
    if (e.ok) {
      typewriter.start()
    }
  }

  const handleMessage = (msg) => {
    const { data } = msg
    console.log('onmessage === ', data)
    if (data === '[DONE]') {
      typewriter.done()
      loading.value = false
      return
    }
    const res = JSON.parse(data)
    const response = res?.choices[0]?.delta?.content
    if (response) {
      typewriter.add(response)
    }
  }

  const handleClose = (e) => {
    typewriter.done()
    loading.value = false
  }

  const handleError = (err) => {
    typewriter?.done()
    loading.value = false
    ElMessage({ type: 'error', message: `${err.msg || '出错了'}` })
    throw err
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
    border-radius: 8px;
  }
</style>
