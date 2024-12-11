<template>
  <div class="relative grow">
    <div
      class="relative justify-center items-start h-full mb-16 flex pb-5"
      v-loading="dataLoading"
    >
      <div
        v-if="!conversationId"
        class="py-4 pl-10 mt-40 md:mt-20 md:py-0 md:pl-1 min-w-[max-content] md:min-w-full"
      >
        <h2 class="text-lg font-semibold text-gray-800 mb-8 text-left">
          {{ $t('prompts.chatTip') }}
        </h2>
        <div class="flex flex-col gap-5">
          <div
            class="flex gap-1 border border-[#EAECF0] hover:bg-[#F0F3FF] h-auto cursor-pointer rounded-lg px-4 py-3"
            v-for="item in tips"
            :key="item"
            @click="updateInput(item)"
          >
            {{ item }}
            <SvgIcon width="16px" name="chevron_right" />
          </div>
        </div>
      </div>
      <div class="w-[88%] max-w-[800px] md:w-full relative mobile:w-full">
        <div
          id="chat"
          class="chat py-7 px-0 mobile:p-4"
        >
          <ul
            id="chat-ul"
            ref="scrollDom"
          >
            <div class="ai hidden mobile:flex">
              <div class="content">
                <img
                  class="avatar md:hidden"
                  src="/images/opencsg_avatar.png"
                  alt="头像"
                />
                <div class="flex flex-col gap-[6px]">
                  <p
                    class="py-3 px-5 border border-gray-300 rounded-t-none rounded-r-lg rounded-b-lg rounded-l-lg"
                    v-html="'开始问答'"
                  ></p>
                </div>
              </div>
            </div>
            <li
              v-for="(item, index) in QA_List"
              :key="index"
              class="mb-[20px]"
            >
              <div
                v-if="item.role === 'user'"
                class="user"
              >
                <div class="content">
                  <img
                    class="avatar md:hidden"
                    :src="
                      userStore.avatar ||
                      'https://cdn.casbin.org/img/casbin.svg'
                    "
                    alt="头像"
                  />
                  <div class="flex flex-col w-full">
                    <!-- <div style="text-align: left">{{ t('common.you') }}</div> -->
                    <p
                      class="question-text"
                      :style="`margin:0`"
                    >
                      {{ item.question || item.content }}
                    </p>
                  </div>
                </div>
              </div>
              <div
                v-else
                class="ai"
              >
                <div class="content">
                  <img
                    class="avatar md:hidden"
                    src="/images/opencsg_avatar.png"
                    alt="头像"
                  />
                  <div
                    class="flex flex-col flex-1"
                    style="width: -webkit-fill-available"
                  >
                    <!-- <div style="text-align: left">{{ llm_name }}</div> -->
                    <el-skeleton
                      v-show="index == QA_List.length - 1 && item.loading"
                      :rows="3"
                      animated
                      style="text-align: left"
                    />
                    <div class="question-text maxWidth">
                      <MarkdownViewer
                        style="background: #f9fafb"
                        v-if="item.answer || item.content"
                        :content="item.answer || item.content"
                      />
                    </div>
                  </div>
                </div>
                <div
                  class="h-5 flex flex-row-reverse mt-2"
                  v-show="!showLoading"
                >
                  <div
                    class="flex items-center max-w-[max-content] gap-2 mr-16 sm:mr-0"
                  >
                    <div
                      class="cursor-pointer flex items-center gap-1 px-3"
                      @click="reAnswer(item)"
                      v-if="item.showTools"
                    >
                      <SvgIcon name="prompts_reAnswer" />
                      <span class="text-xs leading-[18px] text-[#475467]">
                        {{ $t('prompts.reAnswer') }}
                      </span>
                    </div>
                    <div class="px-2">
                      <SvgIcon
                        class="cursor-pointer"
                        name="prompts_copy"
                        @click="copyContent(item)"
                      ></SvgIcon>
                    </div>
                    <div
                      class="px-2"
                      v-if="item.id"
                    >
                      <SvgIcon
                        :name="
                          item.user_like ? 'thumbs_up_selected' : 'thumbs_up'
                        "
                        class="cursor-pointer"
                        @click="like(item)"
                      ></SvgIcon>
                    </div>
                    <div
                      class="px-2"
                      v-if="item.id"
                    >
                      <SvgIcon
                        :name="
                          item.user_hate
                            ? 'thumbs_down_selected'
                            : 'thumbs_down'
                        "
                        class="cursor-pointer"
                        @click="unlike(item)"
                      ></SvgIcon>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="question-box w-full mobile:px-4 pb-5">
      <el-input
        v-model="question"
        class="chat-input"
        max-length="200"
        :placeholder="t('prompts.startChat')"
        @keyup.enter="send"
      >
        <template #suffix>
          <div class="send-plane flex">
            <div class="mobile:hidden"></div>
            <el-button
              text
              :disabled="showLoading"
              class="sendBtn"
              :class="{ isactive: question }"
              @click="send"
            >
              {{ $t('prompts.send') }}
              <SvgIcon
                :name="
                  question && conversationId
                    ? 'send_message_white'
                    : 'send_message'
                "
                class="w-[12px] h-[12px] ml-[4px]"
              />
            </el-button>
          </div>
        </template>
      </el-input>
      <div class="hidden mobile:flex justify-center"></div>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed, watch, nextTick, inject } from 'vue'
  import { useI18n } from 'vue-i18n'
  import useFetchApi from '../../packs/useFetchApi'
  import useUserStore from '../../stores/UserStore.js'
  import { fetchEventSource } from '@microsoft/fetch-event-source'
  import { copyToClipboard } from '../../packs/clipboard'
  import MarkdownViewer from '../shared/viewers/MarkdownViewer.vue'
  import { ElMessage } from 'element-plus'
  import { Typewriter } from '../../packs/typewriter'
  import { useCookies } from 'vue3-cookies'
  const { cookies } = useCookies()

  const { t } = useI18n()

  const props = defineProps({
    conversationId: String,
    messageList: Array
  })

  const tips = [
    t('prompts.tips.tip1'),
    t('prompts.tips.tip2'),
    t('prompts.tips.tip3')
  ]

  const emit = defineEmits(['upDateConversationId'])

  const csghubServer = inject('csghubServer')
  const userStore = useUserStore()

  const scrollDom = ref(null)

  const QA_List = ref([])

  const typewriter = new Typewriter((str) => {
    console.log('str===', str)
    if (str) {
      QA_List.value[QA_List.value.length - 1].content += str || ''
    }
  })

  //问答的上下文
  // const history = ref([]);
  const showLoading = ref(false)
  const dataLoading = ref(false)
  const question = ref('')

  watch(
    () => props.messageList,
    (newVal) => {
      QA_List.value = newVal
      scrollBottom()
    }
  )

  const updateInput = (tips) => {
    question.value = tips
    send()
  }

  const clearQAList = () => {
    QA_List.value = []
  }

  const reAnswer = (item) => {
    console.log('reAnswer')
    question.value = item.question
    send()
  }

  const send = async () => {
    if (!question.value.length) {
      return
    }
    if (!props.conversationId) {
      emit('upDateConversationId')
    }
    if (props.conversationId) {
      const q = question.value
      question.value = ''
      addQuestion(q)
      addAnswer(q)
      showLoading.value = true
      fetchEventSource(
        `${csghubServer}/api/v1/prompts/conversations/${props.conversationId}`,
        {
          method: 'POST',
          openWhenHidden: true,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${cookies.get('user_token')}`
          },
          body: JSON.stringify({
            message: q,
            uuid: props.conversationId
          }),
          onopen(e) {
            console.log(
              "e.headers.get('content-type')===",
              e.headers.get('content-type')
            )
            if (e.ok) {
              console.log("everything's good")
              // addAnswer(q);
              typewriter.start()
            }
          },
          onmessage(msg) {
            console.log('message')
            const { data } = msg
            console.log('onmessage === ', data)

            // const res = JSON.parse(msg.data)
            // console.log('onmessage === ', res)
            if (data === '[DONE]') {
              typewriter.done()
              showLoading.value = false
            } else {
              const res = JSON.parse(data)
              if (res?.msg_id) {
                QA_List.value[QA_List.value.length - 1].id = res.msg_id
              } else {
                const content = res?.choices[0]?.delta?.content
                typewriter.add(content)
                scrollBottom()
                QA_List.value[QA_List.value.length - 1].loading = false
              }
            }

            // if (res?.response) {
            //   // QA_List.value[QA_List.value.length - 1].answer += res.result.response;
            //   // typewriter.add(res?.response.replaceAll('\n', '<br/>'));
            //   typewriter.add(res?.response)
            //   scrollBottom()
            // }
          },
          onclose(e) {
            console.log('close')
            console.log(e)
            typewriter.done()
            QA_List.value[QA_List.value.length - 1].loading = false
            showLoading.value = false
            QA_List.value[QA_List.value.length - 1].showTools = true
            nextTick(() => {
              scrollBottom()
            })
          },
          onerror(err) {
            console.log('error')
            typewriter?.done()
            QA_List.value[QA_List.value.length - 1].loading = false
            showLoading.value = false
            QA_List.value[QA_List.value.length - 1].showTools = true
            ElMessage({ type: 'error', message: `${err.msg || '出错了'}` })
            nextTick(() => {
              scrollBottom()
            })
            throw err
          }
        }
      )
    }
  }

  const addQuestion = (q) => {
    QA_List.value.push({
      question: q,
      role: 'user'
    })
    scrollBottom()
  }

  const addAnswer = (question) => {
    QA_List.value.push({
      loading: true,
      answer: '',
      content: '',
      question,
      role: 'ai',
      copied: false,
      like: false,
      unlike: false,
      source: [],
      showTools: false
    })
  }

  const copyContent = (item) => {
    console.log(item)
    copyToClipboard(item.content)
  }

  const like = async (item) => {
    console.log(item)
    const payload = {
      uuid: props.conversationId,
      id: item.id
    }
    const url = `/prompts/conversations/${props.conversationId}/message/${item.id}/like`
    const options = {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }
    const { data, error } = await useFetchApi(url, options).put().json()
    if (error.value) {
      ElMessage({ message: error.value.msg, type: 'warning' })
    } else {
      ElMessage({ message: data.value.msg, type: 'success' })
    }
    item.user_like = !item.user_like
  }

  const unlike = async (item) => {
    console.log(item)
    const payload = {
      uuid: props.conversationId,
      id: item.id
    }
    const url = `/prompts/conversations/${props.conversationId}/message/${item.id}/hate`
    const options = {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }
    const { data, error } = await useFetchApi(url, options).put().json()
    if (error.value) {
      ElMessage({ message: error.value.msg, type: 'warning' })
    } else {
      ElMessage({ message: data.value.msg, type: 'success' })
    }
    item.user_hate = !item.user_hate
  }

  const scrollBottom = () => {
    nextTick(() => {
      scrollDom.value?.scrollIntoView(false)
    })
  }
  defineExpose({
    clearQAList,
    send
  })
</script>
<style scoped lang="less">
  .chat {
    margin: 0 auto;
    width: 100%;
    // min-width: 900px;
    // max-width: 1239px;
    height: calc(100vh - 54px - 48px - 28px - 28px - 32px - 50px - 65px);
    padding-bottom: 50px;
    overflow-y: auto;
    overflow-x: hidden;
    .avatar {
      width: 32px;
      height: 32px;
    }
    .content {
      width: calc(100% - 44px);
    }

    .user {
      display: flex;
      align-items: flex-start;
      margin-bottom: 16px;
      direction: rtl;
      text-align: right;
      .avatar {
        margin-left: 12px;
      }
      .content {
        display: flex;
        width: calc(100% - 44px);
        @media (max-width: 768px) {
          width: 100%;
        }
      }
      .question-text {
        max-width: max-content;
        text-align: left;
        padding: 12px;
        font-size: 14px;
        font-weight: normal;
        line-height: 1.2em;
        color: #3250bd;
        background: #f0f3ff;
        border-radius: 8px;
        word-wrap: break-word;
        margin-right: 12px;
        direction: ltr;
      }
    }

    .ai {
      margin: 16px 0 28px 0;
      .avatar {
        margin-right: 12px;
      }
      .content {
        display: flex;
        align-items: flex-start;
        width: calc(100% - 44px);
        @media (max-width: 768px) {
          width: 100%;
        }
        .question-text {
          text-align: left;
          flex: 1;
          padding: 12px;
          font-size: 14px;
          font-weight: normal;
          line-height: 22px;
          color: #344054;
          background: #f9fafb;
          border-radius: 8px;
          word-wrap: break-word;
        }
      }
    }
  }

  .question-box {
    position: absolute;
    left: 50%;
    bottom: 0;
    width: 90%;
    transform: translateX(-50%);
  }
  @media (max-width: 768px) {
    .user .question-text,
    .ai .question-text {
      overflow-wrap: anywhere;
      max-width: 100%;
      width: 100%;
    }
  }

  .el-button.is-text.sendBtn {
    border: 1px solid #eaecf0 !important;
    background: #f2f4f7 !important;
    color: #98a2b3 !important;
    &.isactive {
      border: 1px solid #3250bd !important;
      background: #3250bd !important;
      color: #fff !important;
    }
  }

  :deep(.chat-input.el-input .el-input__wrapper) {
    border-radius: 8px;
    border: 1px solid #d0d5dd;
    box-shadow: 0 1px 2px 0 rgba(16, 24, 40, 0.05);
    padding: 12px;
    line-height: 24px;
    font-size: 16px;
    color: #667085;
    .el-input__inner {
      text-indent: 24px;
    }
  }
  @media (max-width: 768px) {
    :deep(.chat-input.el-input .el-input__wrapper) {
      width: 100%;
      padding: 5px;
    }
    .question-box {
      width: 100%;
    }
  }
  /* Overall scrollbar style */
  ::-webkit-scrollbar {
    width: 3px; /* Width of the scrollbar */
  }
  /* Scrollbar track */
  ::-webkit-scrollbar-track {
    background-color: transparent; /* Color of the track */
  }
  /* Scrollbar thumb */
  ::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.3); /* Color of the thumb */
    border-radius: 3px; /* Border radius of the thumb */
  }
  /* Scrollbar thumb hover style */
  ::-webkit-scrollbar-thumb:hover {
    background-color: rgba(0, 0, 0, 0.5); /* Color of the thumb on hover */
  }
</style>
