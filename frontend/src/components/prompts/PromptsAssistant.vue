<template>
  <div class="grow w-full">
    <PromptsBreadCrumbs
      firstHref="/prompts/optimization-assistant"
      firstHrefName="prompts.optimizationAssistant"
      class="sticky top-0 md:top-[60px] bg-[#FFFFFF] md:pl-9 left-0 z-10"
    />
    <div
      class="w-full text-[#101828] p-8 md:px-[50px] sm:px-[20px] md:py-[32px]"
    >
      <div
        class="md:flex md:justify-between text-2xl md:text-lg mb-3 font-medium"
      >
        {{ $t('prompts.optimizationAssistant') }}
        <!-- mobile button -->
        <div class="gap-4 hidden md:flex md:items-center">
          <div
            class="gap-1 h-[32px] border border-[#D0D5DD] px-3 py-2 flex rounded-lg cursor-pointer"
          >
            <span
              class="flex items-center gap-1 text-[#344054] text-xs outline-none group-hover:flex"
              @click="mobileMenuVisibility = !mobileMenuVisibility"
            >
              <SvgIcon
                name="prompts_history"
                width="12"
              />
              {{ $t('prompts.history') }}
            </span>
            <el-drawer
              :z-index="998"
              v-model="mobileMenuVisibility"
              :size="'100%'"
              :with-header="true"
              direction="ltr"
              style="--el-dialog-padding-primary: 12px 0px"
            >
              <div class="md:pt-12 pt-10 relative">
                <div
                  class="border p-2 rounded-full absolute md:top-2 sm:top-0 left-2 cursor-pointer"
                  @click="mobileMenuVisibility = false"
                >
                  <SvgIcon
                    name="close_menu"
                    width="16"
                  />
                </div>
                <!-- history -->
                <div
                  class="flex flex-col justify-center"
                  v-for="item in conversationsHistory"
                  :key="item.id"
                >
                  <div
                    class="hover:bg-[#F9FAFB] mb-1 flex items-center justify-between text-base outline-none group p-3 rounded-lg cursor-pointer"
                    :class="
                      activeConversationId === item.conversation_id
                        ? 'bg-[#F0F3FF]'
                        : ''
                    "
                    @click="handleConversation(item)"
                  >
                    <div
                      class="max-w-[165px] text-sm leading-[22px] overflow-hidden text-ellipsis whitespace-nowrap"
                    >
                      {{ item.title }}
                    </div>
                    <div class="flex gap-1">
                      <div
                        class="flex items-center text-sm text-[#667085] group-hover:hidden"
                      >
                        {{ formatDate(item.updated_at) }}
                      </div>
                      <div @click="handleEdit(item, 'edit')">
                        <span class="flex gap-2"
                          ><SvgIcon
                            width="16px"
                            name="edit"
                          />{{ $t('prompts.edit') }}</span
                        >
                      </div>
                      <div @click="handleEdit(item, 'del')">
                        <span class="flex gap-2"
                          ><SvgIcon
                            width="16px"
                            name="trash"
                          />{{ $t('prompts.del') }}</span
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-drawer>
          </div>
          <div
            class="gap-1 flex items-center h-[32px] border border-[#D0D5DD] px-[9px] py-3 rounded-lg cursor-pointer"
            @click="createConversation"
          >
            <SvgIcon
              name="plus_gray"
              width="12px"
              height="12px"
            />
          </div>
        </div>
      </div>
      <div class="flex border border-[#EAECF0] md:border-none rounded-lg">
        <div class="flex flex-col w-full p-5 max-w-[290px] border-r md:hidden">
          <div
            class="flex hover:bg-[#223B99] px-3 py-2 font-normal mb-4 text-[#FFFFFF] border border-[#3250BD] justify-center items-center gap-[6px] rounded-lg bg-[#3250BD] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] cursor-pointer"
            @click="createConversation"
          >
            <SvgIcon name="plus" />
            {{ $t('prompts.newConversation') }}
          </div>
          <div class="text-sm text-[#667085] leading-[22px] mb-2">
            {{ $t('prompts.historyChat') }}
          </div>
          <!-- history -->
          <div
            class="flex flex-col"
            v-for="item in conversationsHistory"
            :key="item.id"
          >
            <div
              class="hover:bg-[#F9FAFB] mb-1 flex items-center justify-between text-base outline-none group p-3 rounded-lg cursor-pointer"
              :class="
                activeConversationId === item.conversation_id
                  ? 'bg-[#F0F3FF]'
                  : ''
              "
              @click="handleConversation(item)"
            >
              <div class="max-w-[165px] text-sm leading-[22px]">
                {{ item.title }}
              </div>
              <div class="flex gap-1">
                <div class="text-sm text-[#667085] group-hover:hidden">
                  {{ formatDate(item.updated_at) }}
                </div>
                <el-dropdown>
                  <span
                    class="hidden items-center text-base outline-none group-hover:flex"
                  >
                    <el-icon class="el-icon--right">
                      <more-filled />
                    </el-icon>
                  </span>
                  <template #dropdown>
                    <el-dropdown-menu popper-class="z-[10000]">
                      <el-dropdown-item @click="handleEdit(item, 'edit')">
                        <span class="flex gap-2"
                          ><SvgIcon
                            width="16px"
                            name="edit"
                          />{{ $t('prompts.edit') }}</span
                        >
                      </el-dropdown-item>
                      <el-dropdown-item @click="handleEdit(item, 'del')">
                        <span class="flex gap-2"
                          ><SvgIcon
                            width="16px"
                            name="trash"
                          />{{ $t('prompts.del') }}</span
                        >
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </div>
          </div>
        </div>
        <el-dialog
          :title="$t('prompts.edit')"
          v-model="dialogVisible"
          top="10vh"
          :style="{ borderRadius: '10px' }"
          width="375px"
          class="prompts_assistant_edit_dialog"
        >
          <div>
            <el-form
              :model="form"
              ref="formRef"
              :rules="rules"
              @submit.prevent
            >
              <el-form-item prop="title">
                {{ $t('prompts.title') }}
                <el-input
                  v-model="form.title"
                  :placeholder="t('prompts.titlePlaceholder')"
                  @keyup.enter="rename"
                ></el-input>
              </el-form-item>
            </el-form>
          </div>
          <template #footer>
            <el-button @click="dialogVisible = false">{{
              $t('all.cancel')
            }}</el-button>
            <el-button
              type="primary"
              @click="rename"
              >{{ $t('all.confirm') }}</el-button
            >
          </template>
        </el-dialog>
        <PromptsChat
          ref="childChat"
          :conversationId="activeConversationId"
          :messageList="messageList"
          @upDateConversationId="upDateConversationId"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted, nextTick } from 'vue'
  import PromptsChat from './PromptsChat.vue'
  import PromptsBreadCrumbs from './PromptsBreadCrumbs.vue'
  import dayjs from 'dayjs'
  import useFetchApi from '../../packs/useFetchApi'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { v4 as uuidv4 } from 'uuid'
  import { useI18n } from 'vue-i18n'
  const { t } = useI18n()

  const mobileMenuVisibility = ref(false)
  const conversationsHistory = ref([])
  const messageList = ref([])
  const activeConversationId = ref('')
  const childChat = ref(null)
  const dialogVisible = ref(false)
  const form = ref({ title: '' })
  const formRef = ref(null)

  const rules = {
    title: [
      { required: true, message: '请输入新标题', trigger: 'blur' },
      {
        min: 1,
        max: 50,
        message: '标题长度在 1 到 50 个字符之间',
        trigger: 'blur'
      }
    ]
  }

  const upDateConversationId = async () => {
    await createConversation()
    nextTick(() => {
      childChat.value.send()
    })
  }

  const formatDate = (date) => {
    return dayjs(date).format('MM-DD')
  }

  const handleConversation = async (item) => {
    mobileMenuVisibility.value = false
    activeConversationId.value = item.conversation_id
    await getQAList()
  }

  const handleEdit = (item, edit) => {
    if (edit === 'edit') {
      form.value.title = item.title // 设置当前标
      form.value.uuid = item.conversation_id // 设置当前标
      dialogVisible.value = true // 打开对话框
    } else if (edit === 'del') {
      deleteConversation(item)
    }
  }

  const rename = async () => {
    formRef.value.validate((valid) => {
      if (valid) {
        fetchEditTitle()
      } else {
        return false
      }
    })
  }

  const getQAList = async () => {
    const { data, error } = await useFetchApi(
      `/prompts/conversations/${activeConversationId.value}`
    ).json()

    if (error.value) {
      ElMessage.error(error.value)
    } else {
      const res = data.value
      messageList.value = res.data.messages || []
    }
  }

  const fetchEditTitle = async () => {
    const url = `/prompts/conversations/${form.value.uuid}`
    const options = {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value)
    }
    const { data, error } = await useFetchApi(url, options).put().json()
    if (error.value) {
      ElMessage({ message: error.value.msg, type: 'warning' })
    } else {
      ElMessage({ message: data.value.msg, type: 'success' })
      fetchConversations()
      dialogVisible.value = false
    }
  }

  const deleteConversation = (item) => {
    ElMessageBox.confirm(`确认删除 ${item.title} ?`, 'Warning', {
      confirmButtonText: t('all.confirm'),
      cancelButtonText: t('all.cancel'),
      type: 'warning'
    })
      .then(() => {
        fetchDeleteConversation(item)
      })
      .catch(() => {})
  }

  const fetchDeleteConversation = async (item) => {
    const url = `/prompts/conversations/${item.conversation_id}`

    const { error } = await useFetchApi(url).delete().json()

    if (error.value) {
      ElMessage({ message: error.value.msg, type: 'warning' })
    } else {
      ElMessage({ message: t('all.delSuccess'), type: 'success' })
      activeConversationId.value = ''
      childChat.value.clearQAList()
      fetchConversations()
      return true
    }
  }

  const createConversation = async () => {
    const randomUUID = uuidv4()
    const params = {
      title: 'New Conversation',
      uuid: randomUUID
    }
    const options = {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    }
    const url = '/prompts/conversations'
    const { data, error } = await useFetchApi(url, options).post().json()
    if (data.value) {
      ElMessage({
        message: 'Success',
        type: 'success'
      })
      const res = data.value
      activeConversationId.value = res.data.conversation_id
      await fetchConversations()
      await getQAList()
    } else {
      ElMessage({
        message: 'Failed',
        type: 'error'
      })
    }
  }
  const fetchConversations = async () => {
    const { data, error } = await useFetchApi('/prompts/conversations').json()
    if (error.value) {
      ElMessage.error(error.value)
    } else {
      const res = data.value
      conversationsHistory.value = res.data
    }
  }
  onMounted(() => {
    fetchConversations()
  })
</script>
<style scoped>
  @media (max-width: 768px) {
    .prompts_assistant_edit_dialog {
      width: 350px;
    }
  }
  :deep(.el-dialog__body) {
    padding: 0 !important;
  }
</style>
