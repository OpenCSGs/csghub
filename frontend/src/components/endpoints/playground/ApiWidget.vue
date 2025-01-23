<template>
  <div
    class="h-[77px] w-full p-4 bg-white border-b border-gray-200 items-center gap-2 inline-flex rounded-tr-2xl"
  >
    <SvgIcon name="playground_api" />
    <div class="text-gray-700 text-base font-medium leading-normal">
      {{ $t('endpoints.playground.api') }}
    </div>
  </div>

  <div class="p-4">
    <div class="h-[34px] w-full justify-between items-center inline-flex">
      <div class="justify-start items-center gap-4 flex">
        <div
          class="text-center text-xs font-normal leading-[18px] flex items-center gap-1 px-2 py-[3px] border  border-gray-300 rounded-sm cursor-pointer"
          :class="
            codeExtension === 'py'
              ? 'bg-gray-900 text-white'
              : 'bg-white text-gray-700'
          "
          @click="changeLanguage('py')"
        >
          <SvgIcon name="python" />
          Python
        </div>
        <div
          class="text-center text-xs font-normal leading-[18px] flex items-center gap-1 px-2 py-[3px] border  border-gray-300 rounded-sm cursor-pointer"
          :class="
            codeExtension === 'js'
              ? 'bg-gray-900 text-white'
              : 'bg-white text-gray-700'
          "
          @click="changeLanguage('js')"
        >
          <SvgIcon name="javascript" />
          JavaScript
        </div>
        <div
          class="text-center text-xs font-normal leading-[18px] flex items-center gap-1 px-2 py-[3px] border  border-gray-300 rounded-sm cursor-pointer"
          :class="
            codeExtension === 'bash'
              ? 'bg-gray-900 text-white'
              : 'bg-white text-gray-700'
          "
          @click="changeLanguage('bash')"
        >
          <SvgIcon name="curl" />
          cURL
        </div>
      </div>
      <el-checkbox
        v-model="useToken"
        :label="$t('endpoints.playground.useToken')"
        size="large"
      />
    </div>
    <div
      class="rounded-xl border border-gray-200 px-4 py-6 mt-4 relative group"
    >
      <CodeViewer
        :content="codeContent"
        :extension="codeExtension"
      />
      <div
        class="absolute bg-white text-xs text-gray-700 right-6 top-6 px-[16px] py-[8px] border rounded-lg shadow cursor-pointer items-center gap-1 hidden group-hover:flex"
        @click="copyCode"
      >
        <SvgIcon name="copy" />
        Copy
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed, onMounted, watch } from 'vue'
  import CodeViewer from '../../shared/viewers/CodeViewer.vue'
  import { copyToClipboard } from '../../../packs/clipboard'
  import useFetchApi from '../../../packs/useFetchApi'
  import useUserStore from '../../../stores/UserStore'

  const props = defineProps({
    modelId: String,
    appEndpoint: String,
    form: Object,
    private: Boolean
  })

  const userStore = useUserStore()
  const codeExtension = ref('py') // py, js, bash
  const codeContent = ref('')
  const useToken = ref(props.private)
  const accessToken = ref('')

  const changeLanguage = (ext) => {
    codeExtension.value = ext
  }

  const pythonHeaders = `
headers = {
    'Content-Type': 'application/json'
}`

  const pythonHeadersWithToken = computed(
    () => `
auth_token = "${accessToken.value}"

headers = {
    'Authorization': f'Bearer {auth_token}',
    'Content-Type': 'application/json'
}`
  )

  const pythonContent = computed(
    () => `import requests
import json
import re

url = "${endpointUrl.value}"
${useToken.value ? pythonHeadersWithToken.value : pythonHeaders}

data = {
    "model": "${props.modelId}",
    "messages": [
        {
            "role": "system",
            "content": "You are a helpful assistant."
        },
        {
            "role": "user",
            "content": "What is deep learning?"
        }
    ],
    "stream": True,
    "temperature": ${props.form.temperature},
    "max_tokens": ${props.form.max_tokens},
    "top_k": ${props.form.top_k},
    "top_p": ${props.form.top_p},
    "repetition_penalty": ${props.form.repetition_penalty}
}

response = requests.post(url=url, json=data, headers=headers, stream=True)
response.raise_for_status()

if response.status_code == 200:
    for line in response.iter_lines():
        if line:
            try:
                decoded_line = re.sub(r'^data:', '', line.decode('utf-8'))
                data = json.loads(decoded_line)
                if ("choices" in data) and data['choices'][0]['delta'] and ("content" in data['choices'][0]['delta']):
                    print(data['choices'][0]['delta'])
            except json.JSONDecodeError:
                pass
`
  )

  const jsHeaders = `
  headers: {
    "Content-Type": "application/json"
  },
`

  const jsHeadersWithToken = computed(
    () => `
  headers: {
    "Authorization": "Bearer ${accessToken.value}",
    "Content-Type": "application/json"
  },`
  )

  const jsContent = computed(
    () =>
      `fetch("${endpointUrl.value}", {
  method: "POST",
  ${useToken.value ? jsHeadersWithToken.value : jsHeaders}
  body: JSON.stringify({
    model: "${props.modelId}",
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant."
      },
      {
        role: "user",
        content: "What is deep learning?"
      }
    ],
    stream: true,
    temperature: ${props.form.temperature},
    max_tokens: ${props.form.max_tokens},
    top_k: ${props.form.top_k},
    top_p: ${props.form.top_p},
    repetition_penalty: ${props.form.repetition_penalty}
  })
})
.then(response => response.text())
.then(data => {
  console.log(data)
})`
  )

  const curlHeaders = `-H "Content-Type: application/json" \\`

  const curlHeadersWithToken = computed(
    () => `-H "Content-Type: application/json" \\
-H "Authorization: Bearer ${accessToken.value}" \\`
  )

  const curlContent = computed(
    () => `curl -X POST \\
"${endpointUrl.value}" \\
${useToken.value ? curlHeadersWithToken.value : curlHeaders}
-d '{ "model": "${props.modelId}", "messages": [{ "role": "system", "content": "You are a helpful assistant." }, {"role": "user", "content": "What is deep learning?" }], "stream": true, "max_tokens": ${props.form.max_tokens}, "temperature": ${props.form.temperature}, "repetition_penalty": ${props.form.repetition_penalty}, "top_p": ${props.form.top_p}, "top_k": ${props.form.top_k}}'
`
  )

  const setCodeContent = () => {
    switch (codeExtension.value) {
      case 'py':
        codeContent.value = pythonContent.value
        break
      case 'js':
        codeContent.value = jsContent.value
        break
      case 'bash':
        codeContent.value = curlContent.value
        break
      default:
        codeContent.value = pythonContent.value
        break
    }
  }

  const copyCode = () => {
    copyToClipboard(codeContent.value)
  }

  const endpointUrl = computed(
    () => `${props.appEndpoint}/v1/chat/completions`
  )

  watch(
    () => props.appEndpoint,
    () => {
      setCodeContent()
    }
  )

  watch(
    () => codeExtension.value,
    () => {
      setCodeContent()
    }
  )

  watch(
    () => props.form,
    () => {
      setCodeContent()
    },
    { deep: true }
  )

  watch(
    () => useToken.value,
    () => {
      setCodeContent()
    }
  )

  watch(
    () => userStore.username,
    () => {
      fetchUserToken()
    }
  )

  const fetchUserToken = async () => {
    if (!userStore.username) return

    const { data } = await useFetchApi(
      `/user/${userStore.username}/tokens?app=git`
    ).json()

    if (data.value) {
      const body = data.value
      if (body.data) {
        accessToken.value = body.data[0].token
        setCodeContent()
      }
    }
  }

  onMounted(() => {
    setCodeContent()
    if (userStore.initialized) {
      fetchUserToken()
    }
  })
</script>

<style scoped>
  :deep(.el-checkbox__label) {
    color: #344054;
    font-weight: 400;
  }
</style>
