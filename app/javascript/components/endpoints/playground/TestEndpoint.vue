<template>
  <div
    class="h-[77px] w-full p-4 bg-white border-b border-[#eaecf0] items-center gap-2 inline-flex rounded-tr-2xl"
  >
    <SvgIcon name="playground_test" />
    <div class="text-[#344053] text-base font-medium leading-normal">
      Test your endpoint
    </div>
  </div>

  <div class="p-4">
    <div class="text-[#344053] text-sm font-medium leading-tight mb-4">
      文本生成
    </div>
    <div
      class="min-h-[180px] px-3.5 py-3 bg-white rounded-lg shadow border border-[#cfd4dc] text-[#0f1728] text-base font-light leading-normal mb-4 overflow-auto"
    >
      {{ anwserContent }}
    </div>
    <div
      class="flex items-center justify-between p-3 gap-2 rounded-lg shadow border border-[#cfd4dc]"
      v-loading="loading"
    >
      <el-input
        v-model="message"
        inputStyle="outline: none"
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
          发送
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed } from 'vue'
  import { fetchEventSource } from '@microsoft/fetch-event-source'
  import { Typewriter } from '../../../packs/typewriter'
  import { useCookies } from 'vue3-cookies'
  import { ElMessage } from 'element-plus'

  const { cookies } = useCookies()

  const props = defineProps({
    form: Object,
    appEndpoint: String,
    modelId: String
  })

  const anwserContent = ref('')
  const message = ref('')
  const loading = ref(false)

  const typewriter = new Typewriter((str) => {
    console.log('str===', str)
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
    return props.form ? props.form : { max_tokens: 100 }
  })

  const handleSendMessage = () => {
    if (!canSendMessage.value) return

    loading.value = true

    resetAnwserContent()

    const endpoint = `http://s-wanghh2003-csg-wukong-1b-ab.spaces-stg.opencsg.com/v1/chat/completions`
    const payload = {
      model: 'wanghh2003/csg-wukong-1B',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: message.value }
      ],
      stream: true,
      ...extraParams.value
    }
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${cookies.get('user_token')}`
    }

    fetchEventSource(endpoint, {
      method: 'POST',
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
      console.log("everything's good")
      typewriter.start()
    }
  }

  const handleMessage = (msg) => {
    console.log('message')
    const { data } = msg
    console.log('onmessage === ', data)
    if (data === '[DONE]') {
      typewriter.done()
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
</style>
