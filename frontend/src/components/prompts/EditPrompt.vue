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
    currentComponent="editPrompt"
    class="sticky top-0 md:top-[60px] bg-[#FFFFFF] left-0 z-10"
  />  
  <div
    class="w-full text-[#101828] p-8 md:p-1 md:mt-5 md:px-[50px] sm:px-[20px] mb-[94px]"
  >
    <div class="text-2xl mb-3 font-medium">{{ $t('prompts.editPrompt') }}</div>
    <div class="flex mt-9 justify-center">
      <el-form
        ref="dataFormRef"
        :model="dataForm"
        :rules="rules"
        class="w-[640px]"
        label-position="top"
      >
        <div class="flex flex-col">
          <!-- title -->
          <el-form-item
            class="w-full"
            :label="t('prompts.new.title')"
            prop="title"
          >
            <el-input
              v-model="dataForm.title"
              :placeholder="
                t('all.pleaseInput', {
                  value: t('prompts.new.title')
                })
              "
              input-style="width: 100%"
              class="!h-[40px]"
            >
              <template #suffix>
                <el-tooltip
                  class="item"
                  effect="dark"
                  raw-content
                  :content="`
                <p>${t('prompts.new.titleTips')}</p>
                <ul style='margin-left: 18px; list-style: disc; margin-top: 12px;'>
                  <li>${t('rule.lengthLimit', { min: 2, max: 64 })}</li>
                  <li>${t('rule.specialStrNotTogether')}</li>
                </ul>
                `"
                  placement="top"
                >
                  <el-icon><Warning /></el-icon>
                </el-tooltip>
              </template>
            </el-input>
          </el-form-item>
          <!-- language -->
          <el-form-item
            :label="t('prompts.new.language')"
            prop="language"
            class="w-full"
          >
            <el-select
              v-model="dataForm.language"
              :placeholder="t('all.select')"
              size="large"
              style="width: 100%"
            >
              <el-option
                v-for="item in languages"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <!-- scene -->
          <el-form-item
            :label="t('prompts.new.scene')"
            prop="scene"
            class="w-full"
          >
            <el-select
              v-model="dataForm.scene"
              multiple
              style="width: 100%"
              size="large"
              :placeholder="t('all.select')"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                class="flex items-center"
              >
                <slot>
                  <PromptsTags :tag="item.value" />
                </slot>
              </el-option>
            </el-select>
          </el-form-item>
          <!-- source -->
          <el-form-item
            class="w-full"
            :label="t('prompts.new.origin')"
            prop="source"
          >
            <el-input
              v-model="dataForm.source"
              placeholder="https://www.opencsg.com"
              input-style="width: 100%"
              class="!h-[40px]"
            >
              <template #prefix>
                <SvgIcon name="network" />
              </template> 
            </el-input>
          </el-form-item>
          <!-- content -->
          <el-form-item
          class="w-full"
          :label="t('prompts.new.content')"
          prop="content"
        >
          <el-input
            v-model="dataForm.content"
            :rows="6"
            type="textarea"
            :placeholder="
              t('all.pleaseInput', { value: t('prompts.new.content') })
            "
          />
          </el-form-item>
          <el-divider />
          <div class="flex justify-end">
            <el-form-item>
              <el-button
                class="!text-center !h-9 !text-[16px] !rounded-[8px]"
                @click="cancelSubmit"
              >
                {{ t('all.cancel') }}
              </el-button>
              <el-button
                :loading="loading"
                :class="showButton ? '!text-center !h-9 !text-[16px] btn btn-primary !rounded-[8px]': '!text-center !h-9 !text-[16px] !bg-[#F2F4F7] !text-[#98A2B3] !rounded-[8px]'"
                @click="handleSubmit"
              >
                {{ t('all.confirm') }}
              </el-button>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
  import { ref, inject, computed } from 'vue'
  import PromptsBreadCrumbs from './PromptsBreadCrumbs.vue'
  import useFetchApi from '../../packs/useFetchApi'
  import { ElMessage } from 'element-plus'
  import { useI18n } from 'vue-i18n'
  import PromptsTags from './PromptsTags.vue'

  const props = defineProps({
    namespace: String,
    name: String,
    filePath: String,
    promptsDetails: Object
  })

  const { t, locale } = useI18n()
  const loading = ref(false)
  const nameRule = inject('nameRule')
  const dataFormRef = ref(null)
  const dataForm = ref({
    title: props.promptsDetails.title,
    language: props.promptsDetails.language,
    scene: props.promptsDetails.tags,
    source: props.promptsDetails.source,
    content: props.promptsDetails.content
  })
  const showButton = computed(() => {
    return dataForm.value.title && dataForm.value.content
  })

  const languages = ref([{
    value: 'zh', label: locale.value === 'zh' ? '中文' : 'Chinese'
  }, {
    value: 'en', label: locale.value === 'zh' ? '英文' : 'English'
  }])

  const options = ref([{
    value: 'Image',
    label: locale.value === 'zh' ? '图像生成' : 'Image Generation'
  }, {
    value: 'Video',
    label: locale.value === 'zh' ? '视频生成' : 'Video Generation'
  }, {
    value: 'Music',
    label: locale.value === 'zh' ? '音乐生成' : 'Music Generation'
  }, {
    value: 'Code',
    label: locale.value === 'zh' ? '代码生成' : 'Code Generation'
  }, {
    value: 'DataAnalysis',
    label: locale.value === 'zh' ? '数据分析' : 'Data Analysis'
  }, {
    value: 'Research',
    label: locale.value === 'zh' ? '研究' : 'Research'
  }, {
    value: 'Personalization',
    label: locale.value === 'zh' ? '个性化' : 'Personalization'
  }, {
    value: 'CreativeWriting',
    label: locale.value === 'zh' ? '创意写作' : 'Creative Writing'
  }, {
    value: 'TechnicalWriting',
    label: locale.value === 'zh' ? '技术写作' : 'Technical Writing' 
  }, {
    value: 'Design',
    label: locale.value === 'zh' ? '设计' : 'Design'
  }, {
    value: 'Marketing',
    label: locale.value === 'zh' ? '市场营销' : 'Marketing'
  }, {
    value: 'Education',
    label: locale.value === 'zh' ? '教育' : 'Education'
  },
  ])

  const rules = ref({
    title: [
      {
        required: true,
        message: t('all.pleaseInput', {
          value: t('prompts.new.promptName')
        }),
        trigger: 'blur'
      },
      {
        min: 2,
        max: 64,
        message: t('rule.lengthLimit', { min: 2, max: 64 }),
        trigger: 'blur'
      },
      {
        pattern: /^(?!.*[-_.]{2,}).*$/,
        message: t('rule.specialStrNotTogether'),
        trigger: 'blur'
      }
    ],
    content: [
    {
      required: true,
      message: t('all.pleaseInput', {
        value: t('prompts.new.promptContent')
      }),
      trigger: 'blur'
    }  
    ]
  })

  const handleSubmit = () => {
    loading.value = true
    dataFormRef.value
      .validate(async (valid) => {
        if (valid) {
          await updatePrompt()
        } else {
          return false
        }
      })
      .finally(() => {
        loading.value = false
      })
  }

  const updatePrompt = async () => {
    const params = {
      title: dataForm.value.title,
      language: dataForm.value.language,
      tags: dataForm.value.scene,
      source: dataForm.value.source,
      content: dataForm.value.content
    }
    const options = {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    }
    const newEndpoint = `/prompts/${props.namespace}/${props.name}/prompt/record/${props.promptsDetails.file_path}`
    const { data, error } = await useFetchApi(newEndpoint, options).put().json()
    if (data.value) {
      ElMessage({
        message: t('prompts.update.updateSuccess'),
        type: 'success'
      })
      window.location.href = `/prompts/library/${props.namespace}/${props.name}/${props.promptsDetails.file_path}`
    } else {
      ElMessage({
        message: t('prompts.update.updateFail') + `: ${error.value.msg}`,
        type: 'error'
      })
    }
  }

  const cancelSubmit = () => {
    location.reload()
  }
</script>
<style scoped>
  .btn[disabled] {
    cursor: not-allowed;
    pointer-events: none;
  }

  .btn-primary {
    background-color: var(--Brand-600);
    border: 1px solid var(--Brand-600);
    color: var(--Base-White);
  }
</style>
