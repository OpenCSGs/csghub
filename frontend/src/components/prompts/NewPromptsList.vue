<template>
  <PromptsBreadCrumbs
    :title="name"
    :namespace="namespace"
    :name="name"
    firstHref="/prompts/library"
    firstHrefName="prompts.promptLibrary"
    class="sticky top-0 md:top-[60px] bg-[#FFFFFF] left-0 z-10"
    currentComponent="newPromptsList"
  />
  <div
    class="w-full text-[#101828] p-8 md:p-1 md:mt-5 md:px-[50px] sm:px-[20px] mb-[94px] md:mb-[32px]"
  >
    <div class="text-2xl mb-3 font-medium">{{ $t('prompts.newList.title') }}</div>
    <div class="flex mt-9 justify-center">
      <el-form
        ref="dataFormRef"
        :model="dataForm"
        :rules="rules"
        class="w-[640px] flex flex-col"
        label-position="top"
      >
        <div class="w-full flex md:flex-col gap-[16px] md:gap-0 items-center">
          <!-- Owner -->
          <el-form-item
            :label="t('prompts.newList.owner')"
            prop="owner"
            class="w-full"
          >
            <el-select
              v-model="dataForm.owner"
              :placeholder="t('all.select')"
              size="large"
              style="width: 100%"
            >
              <el-option
                v-for="item in namespaces()"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <!-- Prompt English name of the vocabulary -->
          <el-form-item
            class="w-full"
            :label="t('prompts.newList.PromptsEnName')"
            prop="name"
          >
            <el-input
              v-model="dataForm.name"
              :placeholder="
                t('all.pleaseInput', {
                  value: t('prompts.newList.PromptsEnName')
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
                <p>${t('prompts.newList.titleTips')}</p>
                <ul style='margin-left: 18px; list-style: disc; margin-top: 12px;'>
                  <li>${t('rule.lengthLimit', { min: 2, max: 64 })}</li>
                  <li>${t('rule.startWithLetter')}</li>
                  <li>${t('rule.endWithLetterOrNumber')}</li>
                  <li>${t('rule.onlyLetterNumberAndSpecialStr')}</li>
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
        </div>
        <div
          class="w-full flex md:flex-col gap-[16px] md:gap-0 items-center justify-between"
        >
          <!-- nickname -->
          <el-form-item
            class="w-full"
            :label="t('prompts.newList.promptsNickName')"
            prop="nickname"
          >
            <el-input
              v-model="dataForm.nickname"
              :placeholder="
                t('all.pleaseInput', {
                  value: t('prompts.newList.promptsNickName')
                })
              "
              class="!h-[40px]"
            />
          </el-form-item>
          <!-- License -->
          <el-form-item
            label="License"
            prop="license"
            class="w-full"
          >
            <el-select
              v-model="dataForm.license"
              :placeholder="t('all.select')"
              size="large"
              style="width: 100%"
            >
              <el-option
                v-for="item in licenses"
                :key="item[0]"
                :label="item[1]"
                :value="item[0]"
              />
            </el-select>
          </el-form-item>
        </div>
        <!-- Desc -->
        <el-form-item
          class="w-full"
          :label="t('prompts.newList.promptsDesc')"
          prop="desc"
        >
          <el-input
            v-model="dataForm.desc"
            :rows="6"
            type="textarea"
            :placeholder="
              t('all.pleaseInput', { value: t('prompts.newList.promptsDesc') })
            "
          />
        </el-form-item>
        <el-divider />
        <el-form-item class="w-full">
          <PublicAndPrivateRadioGroup
            v-model="dataForm.visibility"
            :publicDesc="t('prompts.newList.publicDesc')"
            :privateDesc="t('prompts.newList.privateDesc')"
          />
        </el-form-item>
        <el-divider />
        <div class="flex justify-end">
            <div class="flex gap-3">
              <CsgButton
                :name="t('all.cancel')"
                class="btn btn-secondary-gray btn-md w-fit"
                @click="cancelSubmit"
              />
              <CsgButton
                :loading="loading"
                :name="t('prompts.newList.createPrompts')"
                class="btn btn-primary btn-md w-fit"
                @click="handleSubmit"
              />
            </div>
          </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
  import { ref, inject, computed, onMounted } from 'vue'
  import PromptsBreadCrumbs from './PromptsBreadCrumbs.vue'
  import useFetchApi from '../../packs/useFetchApi'
  import { ElMessage } from 'element-plus'
  import { useI18n } from 'vue-i18n'
  import PublicAndPrivateRadioGroup from '../shared/form/PublicAndPrivateRadioGroup.vue'
  import useUserStore from '../../stores/UserStore'

  const props = defineProps({
    namespace: String,
    name: String,
    licenses: {
      type: Array,
      default: () => []
    }
  })

  const userStore = useUserStore()
  const nameRule = inject('nameRule')
  const { t } = useI18n()
  const dataFormRef = ref(null)
  const dataForm = ref({
    owner: '',
    name: '',
    nickname: '',
    license: props.licenses[0][0] || '',
    desc: '',
    visibility: 'public'
  })
  const loading = ref(false)
  const showButton = computed(() => {
    return dataForm.value.name && dataForm.value.owner && dataForm.value.license
  })

  const rules = ref({
    owner: [
      {
        required: true,
        message: t('all.pleaseSelect', { value: t('models.newModel.owner') }),
        trigger: 'change'
      }
    ],
    name: [
      {
        required: true,
        message: t('all.pleaseInput', {
          value: t('prompts.newList.promptsName')
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
        pattern: /^[a-zA-Z]/,
        message: t('rule.startWithLetter'),
        trigger: 'blur'
      },
      {
        pattern: /[a-zA-Z0-9]$/,
        message: t('rule.endWithLetterOrNumber'),
        trigger: 'blur'
      },
      {
        pattern: /^[a-zA-Z0-9-_\.]+$/,
        message: t('rule.onlyLetterNumberAndSpecialStr'),
        trigger: 'blur'
      },
      {
        pattern: /^(?!.*[-_.]{2,}).*$/,
        message: t('rule.specialStrNotTogether'),
        trigger: 'blur'
      },
      { pattern: nameRule, message: t('rule.nameRule'), trigger: 'blur' }
    ],
    license: [
      {
        required: true,
        message: t('all.pleaseSelect', { value: t('models.newModel.license') }),
        trigger: 'change'
      }
    ]
  })

  const handleSubmit = () => {
    loading.value = true
    dataFormRef.value
      .validate(async (valid) => {
        if (valid) {
          await createPromptsList()
        } else {
          return false
        }
      })
      .finally(() => {
        loading.value = false
      })
  }

  const namespaces = () => {
    let namespaces = userStore.orgs.map((org) => org.path)
    namespaces.unshift(userStore.username)
    const params = new URLSearchParams(window.location.search)
    const orgName = params.get('orgName')
    dataForm.value.owner = orgName || namespaces[0]
    return namespaces
  }

  const createPromptsList = async () => {
    const params = {
      name: dataForm.value.name,
      nickname: dataForm.value.nickname,
      namespace: dataForm.value.owner,
      license: dataForm.value.license,
      description: dataForm.value.desc,
      private: dataForm.value.visibility === 'private'
    }
    const options = {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    }
    const newEndpoint = '/prompts'
    const { data, error } = await useFetchApi(newEndpoint, options).post().json()
    if (data.value) {
      ElMessage({
        message: t('prompts.newList.createSuccess'),
        type: 'success'
      })
      const res = data.value
      window.location.href = `/prompts/library/${res.data.path}`
      // window.location.href = '/prompts/library'
    } else {
      ElMessage({
        message: t('prompts.newList.createFail') + `: ${error.value.msg}`,
        type: 'error'
      })
    }
  }

  const cancelSubmit = () => {
    window.location.href = '/prompts/library'
  }

  onMounted(() => {
    console.log(props.licenses);
    console.log(props.name);
  })
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
