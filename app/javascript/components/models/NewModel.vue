<template>
  <div class="w-[640px] m-auto flex flex-col items-center md:w-full md:p-5">
    <div>
      <SvgIcon name="models" height="36" width="37" />
    </div>
    <h3 class="text-[#303133] text-xl font-semibold mt-6 mb-3">{{ t('models.newModel.title') }}</h3>
    <p class="text-[#606266] text-base font-medium md:text-center">{{ t('models.newModel.titleDesc') }}</p>
    <div class="mt-9">
      <el-form
        ref="dataFormRef"
        :model="dataForm"
        :rules="rules"
        class="w-full flex flex-col gap-[14px]"
        label-position="top"
      >
        <div class="w-full flex md:flex-col gap-[16px] items-center">
          <el-form-item :label="t('models.newModel.owner')" prop="owner" class="w-full">
            <el-select v-model="dataForm.owner" :placeholder="t('all.select')" size="large" style="width: 100%;">
              <el-option
                v-for="item in namespaces"
                :key="item[0]"
                :label="item[1]"
                :value="item[0]"
              />
            </el-select>
          </el-form-item>
          <el-form-item class="w-full" :label="t('models.newModel.modelName')" prop="name">
            <el-input v-model="dataForm.name" :placeholder="t('all.pleaseInput', { value: t('models.newModel.modelEnName') })" input-style="width: 100%" >
              <template #suffix>            
                <el-tooltip class="item" effect="dark" raw-content :content="`
                <p>${t('models.modelNameTips')}</p>
                <ul style='margin-left: 18px; list-style: disc; margin-top: 12px;'>
                  <li>${t('rule.lengthLimit', {min: 2, max: 64})}</li>
                  <li>${t('rule.startWithLetter')}</li>
                  <li>${t('rule.endWithLetterOrNumber')}</li>
                  <li>${t('rule.onlyLetterNumberAndSpecialStr')}</li>
                  <li>${t('rule.specialStrNotTogether')}</li>
                </ul>
                `" placement="top">
                  <el-icon class="cursor-pointer hover:text-[var(--Brand-300)]"><Warning /></el-icon>
                </el-tooltip>
              </template>
            </el-input>
          </el-form-item>
        </div>
        <div class="w-full flex md:flex-col gap-[16px] items-center justify-between">
          <el-form-item class="w-full" :label="t('models.newModel.modelNickName')" prop="nickname">
            <el-input v-model="dataForm.nickname" :placeholder="t('all.inputNickNamePlc')" />
          </el-form-item>
          <el-form-item label="License" prop="license" class="w-full">
            <el-select v-model="dataForm.license" :placeholder="t('all.select')" size="large" style="width: 100%;">
              <el-option
                v-for="item in licenses"
                :key="item[0]"
                :label="item[1]"
                :value="item[0]"
              />
            </el-select>
          </el-form-item>
        </div>
        <el-form-item class="w-full" :label="t('models.newModel.modelDesc')" prop="desc">
          <el-input 
            v-model="dataForm.desc"
            :rows="6"
            type="textarea"
            :placeholder="t('all.inputDescPlc')" />
        </el-form-item>
        <el-form-item class="w-full">
          <el-radio-group v-model="dataForm.visibility" class="!block">
            <el-radio class="w-full !border-2 mr-0 mb-[32px] !rounded-xl !h-auto !items-start !p-4" label="public" size="large" border>
              {{ t('models.newModel.public') }}
              <p class="whitespace-normal text-[#475467] font-light">{{ t('models.newModel.publicDesc') }}</p>
            </el-radio>
            <el-radio class="w-full !border-2 mr-0 !rounded-xl !h-auto !items-start !p-4" label="private" size="large" border>
              {{ t('models.newModel.private') }}
              <p class="whitespace-normal text-[#475467] font-light">{{ t('models.newModel.privateDesc') }}</p>
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <p class="mb-[18px] rounded bg-[#F0F3FF] text-[#4D6AD6] text-[13px] py-[9px] px-4">
          {{ t('models.newModel.tips') }}
        </p>
        <div class="flex justify-end">
          <el-form-item>
            <el-button
              :loading="loading"
              class="!text-center !h-9 !text-[16px] !text-white !bg-[#3250BD] !rounded-[8px] !border-[1px] !border-[#3250BD]"
              @click="handleSubmit"
            >
              {{ t('models.newModel.createModel') }}
            </el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue'
import csrfFetch from "../../packs/csrfFetch.js"
import InputTip from '../shared/inputs/InputTip.vue'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'

const { t } = useI18n();
const dataFormRef = ref(null)
const nameRule = inject('nameRule')

// Props
const props = defineProps({
  namespaces: {
    type: Array,
    default: () => []
  },
  licenses: {
    type: Array,
    default: () => []
  }
})


// State
const dataForm = ref({
  owner: props.namespaces[0][0],
  name: '',
  nickname: '',
  license: props.licenses[0][0],
  desc: '',
  visibility: 'public',
})

const loading = ref(false)

// Validation rules
const rules = ref({
  owner: [
    { required: true, message: t('all.pleaseSelect', { value: t('models.newModel.owner') }), trigger: 'change' }
  ],
  name: [
    { required: true, message: t('all.pleaseInput', { value: t('models.newModel.modelName') }), trigger: 'blur' },
    // limit 2-64 length
    { min: 2, max: 64, message: t('rule.lengthLimit', { min: 2, max: 64 }), trigger: 'blur' },
    // 以字母开头
    { pattern: /^[a-zA-Z]/, message: t('rule.startWithLetter'), trigger: 'blur' },
    // 以数字或字母结尾
    { pattern: /[a-zA-Z0-9]$/, message: t('rule.endWithLetterOrNumber'), trigger: 'blur' },
    // 只能包含字母、数字与-_.
    { pattern: /^[a-zA-Z0-9-_\.]+$/, message: t('rule.onlyLetterNumberAndSpecialStr'), trigger: 'blur' },
    // 特殊字符不能并列出现
    { pattern: /^(?!.*[-_.]{2,}).*$/, message: t('rule.specialStrNotTogether'), trigger: 'blur' },
    // 保险起见最后一步还是加上最终的正则吧
    { pattern: nameRule, message: t('rule.nameRule'), trigger: 'blur' },
  ],
  license: [
    { required: true, message: t('all.pleaseSelect', { value: t('models.newModel.license') }), trigger: 'change' }
  ],
})

// Methods
const handleSubmit = () => {
  loading.value = true
  dataFormRef.value.validate(async (valid) => {
    if (valid) {
      await createModel()
    } else {
      return false
    }
  }).finally(() => {
    loading.value = false
  })
}

const createModel = async () => {
  const params = Object.assign({}, dataForm.value)
  if (params.owner) {
    const [owner_id, owner_type] = params.owner.split('_')
    params.owner_id = owner_id
    params.owner_type = owner_type
    delete params.owner
  }
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  }
  const uploadEndpoint = '/internal_api/models'
  const response = await csrfFetch(uploadEndpoint, options)
  if (response.ok) {
    ElMessage({
      message: t('models.newModel.createSuccess'),
      type: 'success'
    })
    response.json()
      .then(res => {
        window.location.href = `/models/${res.path}`
      })
  } else {
    response.json()
      .then(res => {
        ElMessage({
          message: t('models.newModel.createFail') + `: ${res.message}`,
          type: 'error'
        })
      })
  }
};
</script>

<style scoped>
  :deep(.el-input) {
    height: 40px;

    @media screen and (max-width: 768px) {
      width: 100%;
    }
  }

  :deep(.el-radio__input) {
    margin-top: 10px;
  }

  :deep(.el-radio__label) {
    color: #344054 !important;
    font-weight: 400;
  }

  :deep(.el-radio.is-bordered.is-checked ) {
    border: 2px solid #3250BD;
  }

  :deep(.el-radio__input.is-checked .el-radio__inner) {
    background: #3250BD;
    border-color: #3250BD;
  }

  :deep(.el-select) {
    width: 240px;
    height: 40px;

    @media screen and (max-width: 768px) {
      width: 100%;
    }
  }

  :deep(.el-input .el-input__wrapper) {
    border-radius: 8px;
  }
</style>