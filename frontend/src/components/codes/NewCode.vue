<template>
  <div class="w-[640px] m-auto flex flex-col items-center md:w-full md:p-5">
    <div>
      <SvgIcon
        name="codes"
        height="36"
        width="37"
      />
    </div>
    <h3 class="text-gray-700 text-xl font-medium mt-6 mb-3">
      {{ t('codes.newCode.title') }}
    </h3>
    <p class="text-gray-500 text-md font-regular md:text-center">
      {{ t('codes.newCode.titleDesc') }}
    </p>
    <div class="mt-9">
      <el-form
        ref="dataFormRef"
        :model="dataForm"
        :rules="rules"
        class="w-full flex flex-col gap-[14px]"
        label-position="top"
      >
        <div class="w-full flex md:flex-col gap-[16px] items-center">
          <el-form-item
            :label="t('codes.newCode.owner')"
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
          <el-form-item
            class="w-full"
            :label="t('codes.newCode.codeEnName')"
            prop="name"
          >
            <el-input
              v-model="dataForm.name"
              :placeholder="
                t('all.pleaseInput', { value: t('codes.newCode.codeEnName') })
              "
              input-style="width: 100%"
            >
              <template #suffix>
                <el-tooltip
                  class="item"
                  effect="dark"
                  raw-content
                  :content="`
                  <p>${t('codes.codeNameTips')}</p>
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
          class="w-full flex md:flex-col gap-[16px] items-center justify-between"
        >
          <el-form-item
            class="w-full"
            :label="t('codes.newCode.codeNickName')"
            prop="nickname"
          >
            <el-input
              v-model="dataForm.nickname"
              :placeholder="
                t('all.pleaseInput', { value: t('codes.newCode.codeNickName') })
              "
            />
          </el-form-item>
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
        <el-form-item
          class="w-full"
          :label="t('codes.newCode.codeDesc')"
          prop="desc"
        >
          <el-input
            v-model="dataForm.desc"
            :rows="6"
            type="textarea"
            :placeholder="
              t('all.pleaseInput', { value: t('codes.newCode.codeDesc') })
            "
          />
        </el-form-item>
        <el-form-item class="w-full">
          <PublicAndPrivateRadioGroup
            v-model="dataForm.visibility"
            :publicDesc="t('codes.newCode.publicDesc')"
            :privateDesc="t('codes.newCode.privateDesc')"
          />
        </el-form-item>
        <p
          class="mb-[18px] rounded-md bg-brand-25 text-brand-500 text-[13px] py-[9px] px-4"
        >
          {{ t('codes.newCode.tips') }}
        </p>
        <div class="flex justify-end">
          <el-form-item>
            <button
              :loading="loading"
              class="btn btn-primary btn-md"
              @click="handleSubmit"
            >
              {{ t('codes.newCode.createCode') }}
            </button>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
  import { ref, inject } from 'vue'
  import useFetchApi from '../../packs/useFetchApi'
  import { ElMessage } from 'element-plus'
  import { useI18n } from 'vue-i18n'
  import useUserStore from '../../stores/UserStore'
  import PublicAndPrivateRadioGroup from '../shared/form/PublicAndPrivateRadioGroup.vue'

  const userStore = useUserStore()

  const { t } = useI18n()
  const dataFormRef = ref(null)
  const nameRule = inject('nameRule')

  // Props
  const props = defineProps({
    licenses: {
      type: Array,
      default: () => []
    }
  })

  // State
  const dataForm = ref({
    owner: '',
    name: '',
    nickname: '',
    license: props.licenses[0][0],
    desc: '',
    visibility: 'public'
  })

  const loading = ref(false)

  // Validation rules
  const rules = ref({
    owner: [
      {
        required: true,
        message: t('all.pleaseSelect', { value: t('codes.newCode.owner') }),
        trigger: 'change'
      }
    ],
    name: [
      {
        required: true,
        message: t('all.pleaseInput', { value: t('codes.newCode.codeName') }),
        trigger: 'blur'
      },
      // limit 2-64 length
      {
        min: 2,
        max: 64,
        message: t('rule.lengthLimit', { min: 2, max: 64 }),
        trigger: 'blur'
      },
      // 以字母开头
      {
        pattern: /^[a-zA-Z]/,
        message: t('rule.startWithLetter'),
        trigger: 'blur'
      },
      // 以数字或字母结尾
      {
        pattern: /[a-zA-Z0-9]$/,
        message: t('rule.endWithLetterOrNumber'),
        trigger: 'blur'
      },
      // 只能包含字母、数字与-_.
      {
        pattern: /^[a-zA-Z0-9-_\.]+$/,
        message: t('rule.onlyLetterNumberAndSpecialStr'),
        trigger: 'blur'
      },
      // 特殊字符不能并列出现
      {
        pattern: /^(?!.*[-_.]{2,}).*$/,
        message: t('rule.specialStrNotTogether'),
        trigger: 'blur'
      },
      // 保险起见最后一步还是加上最终的正则吧
      { pattern: nameRule, message: t('rule.nameRule'), trigger: 'blur' }
    ],
    license: [
      {
        required: true,
        message: t('all.pleaseSelect', { value: t('codes.newCode.license') }),
        trigger: 'change'
      }
    ]
  })

  // Methods
  const namespaces = () => {
    let namespaces = userStore.orgs.map((org) => org.path)
    namespaces.unshift(userStore.username)
    const params = new URLSearchParams(window.location.search)
    const orgName = params.get('orgName')
    dataForm.value.owner = orgName || namespaces[0]
    return namespaces
  }

  const handleSubmit = () => {
    loading.value = true
    dataFormRef.value
      .validate(async (valid) => {
        if (valid) {
          await createCode()
        } else {
          return false
        }
      })
      .finally(() => {
        loading.value = false
      })
  }

  const createCode = async () => {
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
    const newEndpoint = '/codes'
    const { data, error } = await useFetchApi(newEndpoint, options).post().json()
    if (data.value) {
      ElMessage({
        message: t('codes.newCode.createSuccess'),
        type: 'success'
      })
      window.location.href = `/codes/${data.value.data.path}`
    } else {
      ElMessage({
        message: t('codes.newCode.createFail') + `: ${error.value.msg}`,
        type: 'error'
      })
    }
  }
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

  :deep(.el-radio.is-bordered.is-checked) {
    border: 2px solid #3250bd;
  }

  :deep(.el-radio__input.is-checked .el-radio__inner) {
    background: #3250bd;
    border-color: #3250bd;
  }

  :deep(.el-select) {
    width: 240px;
    height: 40px;

    @media screen and (max-width: 768px) {
      width: 100%;
    }
  }
  :deep(.el-input .el-input__wrapper) {
    border-radius: var(--border-radius-md);
  }
</style>
