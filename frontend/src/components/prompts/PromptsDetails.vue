<!-- prompts详情页 -->
<template>
  <PromptsBreadCrumbs
    :title="promptsDetails.title"
    :namespace="namespace"
    :name="name"
    firstHref="/prompts/library"
    firstHrefName="prompts.promptLibrary"
    :filePath="filePath"
    :path="`${namespace}/${name}`"
    :pathTitle="name"
    class="sticky top-0 md:top-[60px] bg-[#FFFFFF] left-0 z-10"
  />
  <div
    class="w-full text-[#101828] p-8 md:p-1 md:mt-5 md:px-[50px] sm:px-[20px]"
    v-loading="loading"
  >
    <div class="text-2xl mb-3 font-medium">{{ promptsDetails.title }}</div>
    <div
      class="mb-5 flex flex-wrap gap-3 items-center text-[12px] leading-[18px] font-normal"
    >
      <template
        v-for="(tag, index) in promptsDetails.tags"
        :key="tag"
      >
        <PromptsTags :tag="tag" />
        <!-- 添加分隔符，避免在最后一个标签后添加 -->
        <span
          v-if="index < promptsDetails.tags.length - 1"
          class="mx-1"
        >
          <SvgIcon name="prompts_pipe" />
        </span>
      </template>
      <div v-if="promptsDetails.source" class="flex gap-1 hover:underline hover:text-[#3250BD]">
        <SvgIcon name="prompts_source" />
        <span>{{ promptsDetails.source }}</span>
      </div>
    </div>
    <div class="border border-[#EAECF0] min-h-[400px] md:h-auto rounded-lg">
      <div
        class="text-base font-medium flex md:gap-[16px] justify-between items-center py-3 px-5 border-b rounded-t-lg bg-[#F9FAFB]"
      >
        {{ $t('prompts.promptContent') }}
        <div class="flex gap-[12px]">
          <span
            v-if="promptsDetails.can_manage"
            class="hover:bg-[#F0F3FF] h-[26px] w-[70px] text-[12px] leading-[18px] rounded-[4px] cursor-pointer py-1 px-3 text-[#475467] font-normal bg-[#FFFFFF] flex border border-[#D0D5DD] gap-1"
            @click="dialogVisible = true"
          >
            <SvgIcon name="delete" />
            {{ $t('prompts.del') }}
          </span>
          <span
            v-if="promptsDetails.can_manage"
            class="hover:bg-[#F0F3FF] h-[26px] w-[70px] text-[12px] leading-[18px] rounded-[4px] cursor-pointer py-1 px-3 text-[#475467] font-normal bg-[#FFFFFF] flex border border-[#D0D5DD] gap-1"
            @click="changeCurrentComponent('editPrompt')"
          >
            <SvgIcon name="edit" />
            {{ $t('prompts.edit') }}
          </span>
          <span
            class="hover:bg-[#F0F3FF] h-[26px] w-[70px] text-[12px] leading-[18px] rounded-[4px] cursor-pointer py-1 px-3 text-[#475467] font-normal bg-[#FFFFFF] flex border border-[#D0D5DD] gap-1"
            @click="copyContent"
          >
            <SvgIcon name="copy" />
            {{ $t('prompts.copy') }}
          </span>
        </div>
      </div>
      <div
        v-html="promptsDetails.content.replace(/\n/g, '<br>')"
        class="text-sm leading-[22px] font-normal text-[#344054] p-5"
      >
      </div>
    </div>

    <!-- delete dialog -->
    <el-dialog
      v-model="dialogVisible"
      top="30vh"
      :style="{ borderRadius: '10px' }"
      width="450"
      class="invite_dialog"
    >
      <template #header>
        <div class="flex justify-between">
          <SvgIcon name="delete_prompt" />
          <img
            src="/images/invite_bg.png"
            class="w-[200px] absolute top-0 left-0"
          />
        </div>
      </template>
      <!-- dialog content -->
      <div class="relative">
        <div class="text-[18px] leading-[28px] text-[#101828]">
          {{ $t('prompts.delTitle') }}
        </div>
        <span class="text-[14px] leading-[20px] text-[#475467] font-light">
          {{ $t('prompts.delContent') }}
        </span>
      </div>
      <template #footer>
        <span class="flex justify-between mt-[30px]">
          <el-button
            class="w-[50%]"
            size="large"
            @click="dialogVisible = false"
            >{{ $t('all.cancel') }}</el-button
          >
          <el-button
            class="w-[50%]"
            size="large"
            type="danger"
            @click="deletePrompt"
          >
            {{ $t('prompts.del') }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { copyToClipboard } from '../../packs/clipboard'
  import { ElMessage } from 'element-plus'
  import PromptsTags from './PromptsTags.vue'
  import PromptsBreadCrumbs from './PromptsBreadCrumbs.vue'
  import useFetchApi from '../../packs/useFetchApi'

  const props = defineProps({
    namespace: String,
    name: String,
    filePath: String
  })

  const { t } = useI18n()
  const loading = ref(true)
  const promptsDetails = ref({ content: '' })
  const dialogVisible = ref(false)

  const emit = defineEmits(['changeCurrentComponent', 'setPromptsDetails'])
  const changeCurrentComponent = (currentComponent) => {
    emit('changeCurrentComponent', currentComponent)
  }

  const setPromptsDetails = (promptsDetails) => {
    emit('setPromptsDetails', promptsDetails)
  }

  const copyContent = (event) => {
    event.preventDefault()
    copyToClipboard(promptsDetails.value.content)
  }

  const fetchPromptsDetails = async () => {
    const { data, error } = await useFetchApi(
      `/prompts/${props.namespace}/${props.name}/prompt/view/${props.filePath}`
    ).json()
    if (error.value) {
      ElMessage({ message: error.value.msg, type: 'warning' })
      loading.value = false
    } else {
      const res = data.value
      promptsDetails.value = res.data || []
      setPromptsDetails(promptsDetails.value)
      loading.value = false
    }
  }

  const deletePrompt = async () => {
    const promptDeleteEndpoint = `/prompts/${props.namespace}/${props.name}/prompt/record/${promptsDetails.value.file_path}`
    const { error } = await useFetchApi(promptDeleteEndpoint).delete().json();

    if (error.value) {
      ElMessage({ message: error.value.msg, type: 'warning' });
    } else {
      ElMessage({ message: t('all.delSuccess'), type: 'success' });
      setTimeout(() => {
        window.location.href = `/prompts/library/${props.namespace}/${props.name}`
      }, 500);
    }
  }

  onMounted(() => {
    fetchPromptsDetails()
  })
</script>
