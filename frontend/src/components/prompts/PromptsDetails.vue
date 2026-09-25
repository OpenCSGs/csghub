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
        v-html="formattedContent"
        class="text-sm leading-[22px] font-normal text-gray-700 p-5 prompt-content-view"
      >
      </div>
    </div>

    <!-- Variable Playground Section -->
    <div
      v-if="detectedVariables.length > 0"
      class="mt-6 border border-gray-200 rounded-lg bg-white overflow-hidden shadow-xs variable-playground"
    >
      <div
        class="py-3 px-5 border-b bg-gray-50 flex justify-between items-center flex-wrap gap-2"
      >
        <div class="flex items-center gap-2">
          <SvgIcon name="prompts_source" class="w-4 h-4 text-brand-600" />
          <span class="text-base font-medium text-gray-900">{{ $t('prompts.variablePlayground') }}</span>
          <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {{ detectedVariables.length }} {{ $t('prompts.detectedVariables') }}
          </span>
        </div>
        <div class="flex items-center gap-2">
          <CsgButton
            class="btn btn-secondary-gray btn-sm reset-variables-btn"
            @click="resetVariables"
            :name="$t('prompts.resetVariables')"
            svgName="refresh"
          />
          <CsgButton
            class="btn btn-primary btn-sm copy-substituted-btn"
            @click="copySubstitutedContent"
            :name="$t('prompts.copySubstituted')"
            svgName="copy"
          />
        </div>
      </div>

      <div class="p-5 flex flex-col gap-4">
        <p class="text-xs text-gray-500">{{ $t('prompts.variablePlaygroundDesc') }}</p>

        <!-- Variable inputs grid -->
        <div class="grid grid-cols-2 md:grid-cols-1 gap-4 variable-inputs-grid">
          <div
            v-for="varName in detectedVariables"
            :key="varName"
            class="flex flex-col gap-1.5 variable-input-item"
          >
            <label class="text-xs font-medium text-gray-700 font-mono">
              &#123;&#123;{{ varName }}&#125;&#125;
            </label>
            <el-input
              v-model="variableInputs[varName]"
              :placeholder="`${$t('prompts.enterValue')} ${varName}...`"
              clearable
              size="default"
              class="variable-input-field"
            />
          </div>
        </div>

        <!-- Substituted preview box -->
        <div class="mt-2 flex flex-col gap-1.5">
          <div class="text-xs font-medium text-gray-700 flex justify-between items-center">
            <span>{{ $t('prompts.substitutedPreview') }}</span>
          </div>
          <div
            class="p-4 bg-gray-50 border border-gray-200 rounded-md text-sm leading-[22px] text-gray-800 whitespace-pre-wrap font-sans substituted-preview-box"
          >
            {{ substitutedContent }}
          </div>
        </div>
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
  import { ref, computed, watch, onMounted } from 'vue'
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
  const variableInputs = ref({})

  const detectedVariables = computed(() => {
    const content = promptsDetails.value?.content || ''
    const matches = content.match(/\{\{([a-zA-Z0-9_-]+)\}\}/g)
    if (!matches) return []
    const vars = matches.map(m => m.replace(/[{}]/g, '').trim())
    return [...new Set(vars)]
  })

  watch(
    detectedVariables,
    (newVars) => {
      const updated = { ...variableInputs.value }
      newVars.forEach((v) => {
        if (updated[v] === undefined) {
          updated[v] = ''
        }
      })
      variableInputs.value = updated
    },
    { immediate: true }
  )

  const substitutedContent = computed(() => {
    const raw = promptsDetails.value?.content || ''
    return raw.replace(/\{\{([a-zA-Z0-9_-]+)\}\}/g, (match, varName) => {
      const val = variableInputs.value[varName]
      return val !== undefined && val !== '' ? val : match
    })
  })

  const escapeHtml = (unsafe) => {
    return (unsafe || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
  }

  const formattedContent = computed(() => {
    const raw = promptsDetails.value?.content || ''
    const escaped = escapeHtml(raw)
    const highlighted = escaped.replace(
      /\{\{([a-zA-Z0-9_-]+)\}\}/g,
      '<span class="inline-block bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded text-xs font-mono font-medium border border-blue-200 mx-0.5">&#123;&#123;$1&#125;&#125;</span>'
    )
    return highlighted.replace(/\n/g, '<br>')
  })

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

  const copySubstitutedContent = (event) => {
    if (event) {
      event.preventDefault()
    }
    copyToClipboard(substitutedContent.value)
    ElMessage({
      message: t('prompts.copySubstitutedSuccess'),
      type: 'success'
    })
  }

  const resetVariables = () => {
    const cleared = {}
    detectedVariables.value.forEach((v) => {
      cleared[v] = ''
    })
    variableInputs.value = cleared
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
