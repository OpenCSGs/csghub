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
    class="sticky top-0 md:top-15 bg-whitet-0 z-10"
  />
  <!-- v-loading="loading" -->
  <div
    class="w-full text-gray-900 p-8 md:p-1 md:mt-5 md:px-12 sm:px-5"
    v-show="!isDataLoading"
  >
    <div class="text-2xl mb-3 font-medium">{{ promptsDetails.title }}</div>
    <div
      class="mb-5 flex flex-wrap gap-3 items-center md:flex-col md:items-start text-sm leading-6 font-normal"
    >
      <div class="flex flex-wrap gap-3 items-center">
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
      </div>
      <!-- prompts source -->
      <div v-if="promptsDetails.source" class="flex gap-1 ml-3 md:ml-0">
        <SvgIcon name="prompts_source" />
        <span>{{ $t('prompts.source') }}：{{ promptsDetails.source }}</span>
      </div>
    </div>
    <div class="border border-gray-200 min-h-[400px] md:h-auto rounded-lg">
      <div
        class="text-base font-medium flex md:gap-4 justify-between items-center py-3 px-5 border-b rounded-t-lg bg-gray-50"
      >
        {{ $t('prompts.promptContent') }}
        <div class="flex gap-3 sm:gap-5">
          <CsgButton
            v-if="promptsDetails.can_manage"
            class="btn btn-secondary-gray btn-sm w-fit"
            @click="dialogVisible = true"
            :name="t('prompts.del')"
            svgName="delete"
          />
          <CsgButton
            v-if="promptsDetails.can_manage"
            class="btn btn-secondary-gray btn-sm w-fit"
            @click="changeCurrentComponent('editPrompt')"
            :name="t('prompts.edit')"
            svgName="edit"
          />
          <CsgButton
            class="btn btn-secondary-gray btn-sm w-fit"
            @click="copyContent"
            :name="t('prompts.copy')"
            svgName="copy"
          />
        </div>
      </div>
      <div
        v-html="promptsDetails.content.replace(/\n/g, '<br>')"
        class="text-sm leading-[22px] font-normal text-gray-700 p-5"
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
        <div class="text-lg leading-6 text-gray-900">
          {{ $t('prompts.delTitle') }}
        </div>
        <span class="text-sm leading-6 text-gray-500 font-light">
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
  
  <LoadingSpinner 
    :loading="isDataLoading" 
    :text="$t('prompts.loading')" 
  />
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { copyToClipboard } from '../../packs/clipboard'
  import { ElMessage } from 'element-plus'
  import PromptsTags from './PromptsTags.vue'
  import PromptsBreadCrumbs from './PromptsBreadCrumbs.vue'
  import LoadingSpinner from '../shared/LoadingSpinner.vue'
  import useFetchApi from '../../packs/useFetchApi'
  import { ToNotFoundPage } from '../../packs/utils'

  const props = defineProps({
    namespace: String,
    name: String,
    filePath: String
  })

  const { t } = useI18n()
  const promptsDetails = ref({ content: '' })
  const dialogVisible = ref(false)
  const isDataLoading = ref(false)

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
    if (isDataLoading.value) {
      return false
    }
    isDataLoading.value = true
    
    try {
      const { response, data, error } = await useFetchApi(
        `/prompts/${props.namespace}/${props.name}/prompt/view/${props.filePath}`
      ).json()
      
      if (response.value.status === 404) {
        ToNotFoundPage()
        return false
      }
      
      if (error.value) {
        ElMessage.warning(error.value.msg)
        return false
      }
      
      if (!data.value) {
        return false
      }
      
      const res = data.value
      promptsDetails.value = res.data || []
      setPromptsDetails(promptsDetails.value)
      return true
    } catch (error) {
      return false
    } finally {
      isDataLoading.value = false
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
