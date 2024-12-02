<template>
  <a
    :href="hrefUrl"
    class="flex justify-between group w-full cursor-pointer text-[#344054] p-4 border border-[#EAECF0] hover:shadow-md hover:border-[#99AFFF] rounded-lg"
    :style="`background: linear-gradient(90deg, #FCFCFD 0.23%, #FFF 99.77%);`"
    >
    <div class="w-full overflow-hidden">
      <div class="text-sm group-hover:text-[#3250BD] whitespace-nowrap overflow-hidden overflow-ellipsis font-medium mb-2" :title="prompt.title">
        {{ prompt.title }}
      </div>
      <div class="text-sm mb-3 text-[#667085] w-auto overflow-hidden overflow-ellipsis line-clamp line-clamp-2" :title="prompt.content">
        {{ prompt.content }}
      </div>
      <div class="h-[20px] w-[291px] xl:w-full text-xs leading-[18px] flex gap-1 items-center overflow-hidden overflow-ellipsis line-clamp truncate">
        <!-- 循环渲染 PromptsTags 组件 -->
        <template
          v-for="(tag, index) in prompt.tags"
          :key="tag"
        >
          <PromptsTags :tag="tag" />
          <!-- 添加分隔符，避免在最后一个标签后添加 -->
          <span
            v-if="index < prompt.tags.length - 1"
            class="mx-1"
            ><SvgIcon name="prompts_pipe" /></span
          >
        </template>
      </div>
    </div>

    <div v-if="canManage">
      <el-dropdown>
      <span class="outline-none">
        <SvgIcon name="prompt_card_settgins" />
      </span>
      <template #dropdown>
        <el-dropdown-menu popper-class="z-[10000]">
          <el-dropdown-item>
            <div @click="redirectToEditPage" class="flex gap-4">            
              <SvgIcon name="edit" />
              {{ $t('prompts.edit') }}
            </div>
          </el-dropdown-item>
          <el-dropdown-item>
            <div @click="dialogVisible = true" class="flex gap-4">            
              <SvgIcon name="delete" />
              {{ $t('prompts.del') }}
            </div>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
      </el-dropdown>
    </div>
  </a>

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
        >
          {{ $t('all.cancel') }}
        </el-button>
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
</template>

<script setup>
  import { computed, ref } from 'vue'
  import { ElMessage } from 'element-plus'
  import { useI18n } from 'vue-i18n'
  import useFetchApi from '../../packs/useFetchApi'
  import PromptsTags from './PromptsTags.vue'

  const props = defineProps({
    prompt: Object,
    path: String,
    filePath: String,
    canManage: Boolean
  })

  const { t } = useI18n()
  const dialogVisible = ref(false)

  const emit = defineEmits(['setPromptsDetails'])
  const setPromptsDetails = (promptsDetails) => {
    emit('setPromptsDetails', promptsDetails, 'editPrompt')
  }

  const hrefUrl = computed(() => {
    return `/prompts/library/${props.path}/${props.prompt.file_path}`
  })
  
  const fetchPromptsDetails = async () => {
    const { data, error } = await useFetchApi(
      `/prompts/${props.path}/prompt/view/${props.prompt.file_path}`
    ).json()
    if (error.value) {
      ElMessage({ message: error.value.msg, type: 'warning' })
    } else {
      const res = data.value
      const promptsDetails = res.data || []
      setPromptsDetails(promptsDetails)
    }
  }

  const redirectToEditPage = () => {
    fetchPromptsDetails()
  } 

  const deletePrompt = async () => {
    const promptDeleteEndpoint = `/prompts/${props.path}/prompt/record/${props.filePath}`
    const { error } = await useFetchApi(promptDeleteEndpoint).delete().json();

    if (error.value) {
      ElMessage({ message: error.value.msg, type: 'warning' });
    } else {
      ElMessage({ message: t('all.delSuccess'), type: 'success' });
      setTimeout(() => {
        window.location.href = `/prompts/library/${props.path}`
      }, 500);
    }
  }
</script>
