<template>
  <div
    class="h-[77px] w-full p-4 bg-white border-b border-gray-200 items-center gap-2 inline-flex rounded-tr-2xl"
  >
    <SvgIcon name="playground_test" />
    <div class="text-gray-700 text-base font-medium leading-normal">
      {{ $t('endpoints.playground.test') }}
    </div>
  </div>

  <div class="p-4">
    <div
      class="text-gray-700 text-sm font-medium leading-tight mb-4 flex items-center gap-2"
    >
      <SvgIcon name="text_generation" />
      {{ $t('endpoints.playground.generation') }}
      <el-tooltip content="https://opencsg.com/docs/inferencefinetune/inference_tasks/text-generation" placement="top" effect="dark">
        <SvgIcon name="info"  class="w-[12px] h-[12px] cursor-pointer" @click="toDocPage"/>
      </el-tooltip>
    </div>
    <div
      class="max-h-[480px] min-h-[180px] px-3.5 py-3 bg-white rounded-lg border border-gray-200 text-gray-700 text-base font-light leading-normal mb-4 overflow-auto"
    >
      <div class="flex flex-col gap-4">
        <!-- Empty State Prompt Templates -->
        <div v-if="chatMessages.length === 0" class="flex flex-col items-center justify-center py-6 text-center" data-testid="empty-chat-state">
          <div class="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center mb-3">
            <SvgIcon name="playground_test" class="w-5 h-5 text-brand-600" />
          </div>
          <p class="text-xs text-gray-500 mb-4 max-w-sm">
            {{ $t('endpoints.playground.selectPromptOrType') }}
          </p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full text-left">
            <button
              v-for="(prompt, idx) in samplePrompts"
              :key="idx"
              type="button"
              @click="useSamplePrompt(prompt)"
              class="p-3 text-xs bg-gray-50 hover:bg-brand-50 hover:border-brand-200 border border-gray-200 rounded-lg transition-all text-left flex items-start gap-2.5 cursor-pointer group"
              data-testid="sample-prompt-btn"
            >
              <span class="text-base leading-none">{{ prompt.icon }}</span>
              <div class="flex-1 min-w-0">
                <div class="font-medium text-gray-800 group-hover:text-brand-700 transition-colors">{{ prompt.title }}</div>
                <div class="text-gray-500 text-2xs truncate mt-0.5">{{ prompt.text }}</div>
              </div>
            </button>
          </div>
        </div>

        <template v-for="(item, index) in chatMessages" :key="index">
          <!-- user question -->
          <div class="flex justify-end" data-testid="user-message">
            <div class="max-w-[80%] bg-brand-600 rounded-lg px-3 py-2 question text-white">
              <MarkdownViewer :content="item.question" />
            </div>
          </div>
          <!-- AI answer -->
          <div class="flex justify-start" data-testid="ai-message">
            <div class="max-w-[80%] bg-gray-50 rounded-lg px-3 py-2 answer relative group">
              <MarkdownViewer :content="item.answer" />
              <button
                type="button"
                @click="copyAnswer(item.answer)"
                class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 bg-white border border-gray-200 rounded text-gray-500 hover:text-gray-800 transition-opacity cursor-pointer shadow-xs"
                :title="$t('all.copy')"
                data-testid="copy-answer-btn"
              >
                <SvgIcon name="copy" class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </template>
      </div>
    </div>
    <div
      class="flex items-center justify-between gap-2 rounded-lg relative"
    >
      <el-input
        v-model="message"
        class="input-with-border"
        inputStyle="outline: none"
        :disabled="loading"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown.enter="handleSendMessage"
        @compositionend="compositionEnd"
        @compositionstart="compositionStart"
      ></el-input>

      <div
        class="h-[34px] px-3 py-2 rounded-lg border border-gray-200 justify-center items-center gap-1 inline-flex flex-shrink-0"
        :class="
          canSendMessage
            ? 'bg-brand-600 cursor-pointer'
            : 'bg-gray-100 cursor-not-allowed'
        "
        @click="handleSendMessage"
      >
        <div
          class="text-xs font-normal flex items-center justify-center gap-1"
          :class="canSendMessage ? 'text-white' : 'text-gray-400'"
        >
          <SvgIcon name="send_message" />
          {{ $t('endpoints.playground.send') }}
        </div>
      </div>
    </div>
    <div class="flex items-center justify-end text-2xs text-gray-400 mt-1 px-1">
      <span data-testid="char-counter">{{ message.length }} {{ $t('endpoints.playground.characters') }}</span>
    </div>
    <div class="grid grid-cols-3 gap-4 mt-4">
      <CsgButton
        class="btn btn-secondary-gray btn-sm w-full !h-[34px]"
        :disabled="chatMessages.length === 0 || loading"
        :name="$t('endpoints.playground.retry')"
        @click="handleRetry"
      />

      <CsgButton
        class="btn btn-secondary-gray btn-sm w-full !h-[34px]"
        :disabled="chatMessages.length === 0 || loading"
        :name="$t('endpoints.playground.undo')"
        @click="handleUndo"
      />

      <CsgButton
        class="btn btn-secondary-gray btn-sm w-full !h-[34px]"
        :disabled="chatMessages.length === 0 || loading"
        :name="$t('endpoints.playground.clear')"
        @click="handleClear"
      />
    </div>
    <div class="flex mt-4">
      <SvgIcon name="exclamation_point" class="place-self-start" />
      <p class="ml-[4px] text-xs leading-[18px] text-gray-500">{{ $t('widgets.liabilityExemption') }}</p>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { fetchEventSource } from '@microsoft/fetch-event-source'
  import { Typewriter } from '../../../packs/typewriter'
  import { useCookies } from 'vue3-cookies'
  import { ElMessage } from 'element-plus'
  import { copyToClipboard } from '../../../packs/clipboard'
  import MarkdownViewer from '../../shared/viewers/MarkdownViewer.vue'
  import useUserStore from '@/stores/UserStore'
  import { ToLoginPage } from '@/packs/utils'

  const props = defineProps({
    form: Object,
    appEndpoint: String,
    modelId: String
  })

  const { t } = useI18n()
  const { cookies } = useCookies()
  const userStore = useUserStore()

  const anwserContent = ref('')
  const message = ref('')
  const loading = ref(false)
  const inputFocus = ref(false)
  const compositionInput = ref(false)
  const chatMessages = ref([])

  const samplePrompts = computed(() => [
    {
      icon: '💡',
      title: t('endpoints.playground.explainConcept'),
      text: t('endpoints.playground.explainConceptPrompt')
    },
    {
      icon: '💻',
      title: t('endpoints.playground.codeGen'),
      text: t('endpoints.playground.codeGenPrompt')
    },
    {
      icon: '📝',
      title: t('endpoints.playground.summarize'),
      text: t('endpoints.playground.summarizePrompt')
    },
    {
      icon: '🎨',
      title: t('endpoints.playground.creativeTask'),
      text: t('endpoints.playground.creativeTaskPrompt')
    }
  ])

  const useSamplePrompt = (prompt) => {
    if (prompt && prompt.text) {
      message.value = prompt.text
    }
  }

  const copyAnswer = (text) => {
    if (!text) return
    copyToClipboard(text)
  }

  const toDocPage = () => {
    window.open('https://opencsg.com/docs/inferencefinetune/inference_tasks/text-generation', '_blank')
  }
  const handleFocus = () => {
    inputFocus.value = true
  }

  const handleBlur = () => {
    inputFocus.value = false
  }

  const handleRetry = () => {
    if (chatMessages.value.length === 0 || loading.value) return
    const lastMessage = chatMessages.value[chatMessages.value.length - 1]
    message.value = lastMessage.question
    handleSendMessage()
  }

  const handleUndo = () => {
    if (chatMessages.value.length === 0) return
    chatMessages.value.pop()
  }

  const handleClear = () => {
    chatMessages.value = []
  }

  const compositionEnd = (event) => {
    event.preventDefault()
    compositionInput.value = true
  }

  const compositionStart = (event) => {
    event.preventDefault()
    compositionInput.value = true
  }

  const typewriter = new Typewriter((str) => {
    if (str && chatMessages.value.length > 0) {
      // update the last message
      const lastMessage = chatMessages.value[chatMessages.value.length - 1]
      lastMessage.answer += str
    }
  })

  const resetAnwserContent = () => {
    anwserContent.value = ''
  }

  const isLoggedIn = computed(() => userStore.isLoggedIn)

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
    if (!isLoggedIn.value) {
      ToLoginPage()
      return
    }

    if (!canSendMessage.value) return

    loading.value = true
    
    const currentQuestion = message.value
    
    chatMessages.value.push({
      question: currentQuestion,
      answer: ''
    })

    const endpoint = `${props.appEndpoint}/v1/chat/completions`
    const payload = {
      model: props.modelId,
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: currentQuestion }
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
      message.value = ''
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

  defineExpose({
    message,
    chatMessages,
    samplePrompts,
    useSamplePrompt,
    copyAnswer,
    handleClear,
    handleUndo,
    handleRetry,
    handleSendMessage,
    loading
  })
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

  .question {
    .markdown-body {
      color: #ffffff; 
      background-color: transparent;
    }
  }

  .answer {
    .markdown-body {
      background-color: transparent;
    }
  }
</style>
