<template>
  <div>
    <div
      class="h-[77px] w-full p-4 bg-white border-b border-gray-200 items-center gap-2 inline-flex rounded-tr-2xl">
      <SvgIcon name="playground_test" />
      <div class="text-gray-700 text-base font-medium leading-normal">
        {{ $t('endpoints.playground.test') }}
      </div>
    </div>

    <div class="p-4">
      <div
        class="text-gray-700 text-sm font-medium leading-tight mb-4 flex items-center gap-2">
        <SvgIcon name="extraction" />
        Feature Extraction
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
            Compute
          </div>
        </div>
      </div>
      <div
        v-loading="loading"
        v-if="listData.length > 0"
        class="min-h-[180px] w-full mt-[12px] rounded-lg shadow text-gray-700 grid grid-cols-4 md:grid-cols-2 sm:grid-cols-1 items-center justify-around gap-0 max-h-[500px] overflow-auto">
        <div
          v-for="(item, index) in listData"
          :key="index"
          class="flex items-center justify-between">
          <p class="px-[24px] py-[8px] font-gray-600 text-sm text-right flex-1">
            {{ index+1 }}
          </p>
          <p
            class="px-[24px] py-[8px] font-gray-600 text-sm text-right bg-gray-50 flex-1">
            {{ item }}
          </p>
        </div>
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
  import { ElMessage } from 'element-plus'

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
  const listData = ref([])

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
    const data = {
      input: message.value
    }

    try {
      const response = await fetch(props.appEndpoint + '/v1/embeddings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders.value
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch embedding')
      }
      const list = await response.json()
      listData.value = list.data[0].embedding
      loading.value = false
    } catch (error) {
      ElMessage({
        message: error,
        type: 'warning'
      })
      loading.value = false
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
