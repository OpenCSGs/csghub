<template>
  <div class="border border-gray-200 rounded-xl mt-6">
    <div
      class="h-[76px] w-full p-4 bg-white border-b border-gray-200 flex items-center gap-2 rounded-t-2xl"
    >
      <SvgIcon name="playground_api" />
      <div class="text-gray-700 text-base font-medium leading-normal">
        {{ $t('application_spaces.sendRequest') }}
      </div>
    </div>

    <div class="p-4">
      <div class="h-[34px] w-full justify-between items-center inline-flex">
        <div class="justify-start items-center gap-4 flex">
          <div
            class="text-center text-xs font-normal leading-[18px] flex items-center gap-1 px-2 py-[3px] border border-gray-300 rounded-sm cursor-pointer"
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
  </div>
</template>

<script setup>
  import { ref, computed, onMounted, watch } from 'vue'
  import CodeViewer from '@/components/shared/viewers/CodeViewer.vue'
  import { copyToClipboard } from '@/packs/clipboard'
  import useFetchApi from '@/packs/useFetchApi'
  import useUserStore from '@/stores/UserStore'

  const props = defineProps({
    appEndpoint: String
  })

  const userStore = useUserStore()
  const codeExtension = ref('py')
  const codeContent = ref('')
  const useToken = ref(false)
  const accessToken = ref('')

  const changeLanguage = (ext) => {
    codeExtension.value = ext
  }

  const pythonHeadersWithToken = computed(
    () => `auth_token = "${accessToken.value}"
    # WARNING: Avoid hardcoding tokens in production. Use environment variables instead.
    headers = {
        'Authorization': f'Bearer {auth_token}',
    }`
  )

  const pythonContent = computed(
    () => `import asyncio
from mcp.client.session import ClientSession
from mcp.client.sse import sse_client
async def client_logic():
    url = "${props.appEndpoint}/sse"
    ${useToken.value ? pythonHeadersWithToken.value : 'headers = {}'}
    async with sse_client(url=url, headers=headers) as (read, write):
        async with ClientSession(read, write) as session:
            await session.initialize()
            # List available tools
            listToolsResp = await session.list_tools()
            print('list tools => ', listToolsResp.tools)
            # List available prompts
            listPromptResp = await session.list_prompts()
            print('list prompts => ', listPromptResp.prompts)
            # List available resources
            listResoureResp = await session.list_resources()
            print('list resources => ', listResoureResp.resources)
            # List available resource templates
            listResoureTempResp = await session.list_resource_templates()
            print('list resource templates => ', listResoureTempResp.resourceTemplates)
            # Invoke a tool with parameters and get the response
            modelsResp = await session.call_tool("top_models", {"num": 3})
            print('invoke top_models response => ', modelsResp.content, modelsResp.isError)
            # Send a ping to the server to keep the connection alive
            await session.send_ping()
def client_main():
    asyncio.run(client_logic())
if __name__ == "__main__":
    client_main()
`
  )

  const copyCode = () => {
    copyToClipboard(codeContent.value)
  }

  const fetchUserToken = async () => {
    if (!userStore.username) return

    const { data } = await useFetchApi(
      `/user/${userStore.username}/tokens?app=git`
    ).json()

    if (data.value) {
      const body = data.value
      if (body.data) {
        accessToken.value = body.data[0].token
      }
    }
  }

  watch(
    () => useToken.value,
    () => {
      codeContent.value = pythonContent.value
    }
  )

  onMounted(() => {
    codeContent.value = pythonContent.value
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
