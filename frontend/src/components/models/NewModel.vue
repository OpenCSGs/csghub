<template>
  <div class="w-[640px] m-auto flex flex-col items-center md:w-full md:p-5">
    <div>
      <SvgIcon
        name="models"
        height="36"
        width="37"
      />
    </div>
    <h3 class="text-gray-700 text-xl font-semibold mt-6 mb-3">
      {{ t('models.newModel.title') }}
    </h3>
    <p class="text-gray-500 text-base font-medium md:text-center">
      {{ t('models.newModel.titleDesc') }}
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
            :label="t('models.newModel.owner')"
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
            :label="t('models.newModel.modelEnName')"
            prop="name"
          >
            <el-input
              v-model="dataForm.name"
              :placeholder="
                t('all.pleaseInput', {
                  value: t('models.newModel.modelEnName')
                })
              "
              input-style="width: 100%"
            >
              <template #suffix>
                <el-tooltip
                  class="item"
                  effect="dark"
                  raw-content
                  :content="`
                <p>${t('models.modelNameTips')}</p>
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
            :label="t('models.newModel.modelNickName')"
            prop="nickname"
          >
            <el-input
              v-model="dataForm.nickname"
              :placeholder="
                t('all.pleaseInput', {
                  value: t('models.newModel.modelNickName')
                })
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
                v-for="item in licenseList"
                :key="item.name"
                :label="item.name"
                :value="item.name"
              />
            </el-select>
          </el-form-item>
        </div>
        <el-form-item
          class="w-full"
          :label="t('models.newModel.modelDesc')"
          prop="desc"
        >
          <el-input
            v-model="dataForm.desc"
            :rows="6"
            type="textarea"
            :placeholder="
              t('all.pleaseInput', { value: t('models.newModel.modelDesc') })
            "
          />
        </el-form-item>
        <el-form-item class="w-full">
          <PublicAndPrivateRadioGroup
            v-model="dataForm.visibility"
            :publicDesc="t('models.newModel.publicDesc')"
            :privateDesc="t('models.newModel.privateDesc')"
          />
        </el-form-item>
        <p
          class="mb-[18px] rounded-sm bg-brand-25 text-brand-500 text-[13px] py-[9px] px-4"
        >
          {{ t('models.newModel.tips') }}
        </p>
        <div class="flex justify-end">
          <el-form-item>
            <CsgButton
              :loading="loading"
              class="btn btn-primary btn-md"
              :name="t('models.newModel.createModel')"
              @click="handleSubmit"
            />
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
  import { ref, inject, onMounted } from 'vue'
  import PublicAndPrivateRadioGroup from '../shared/form/PublicAndPrivateRadioGroup.vue'
  import useFetchApi from '../../packs/useFetchApi'
  import { ElMessage } from 'element-plus'
  import { useI18n } from 'vue-i18n'
  import useUserStore from '../../stores/UserStore.js'

  const userStore = useUserStore()

  const { t } = useI18n()
  const dataFormRef = ref(null)
  const nameRule = inject('nameRule')
  const licenseList = ref([])

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
    license: '',
    desc: '',
    visibility: 'public'
  })

  const loading = ref(false)

  // Validation rules
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
          value: t('models.newModel.modelName')
        }),
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
        message: t('all.pleaseSelect', { value: t('models.newModel.license') }),
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
          await createModel()
        } else {
          return false
        }
      })
      .finally(() => {
        loading.value = false
      })
  }

  const createModel = async () => {
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
    const newEndpoint = '/models'
    const { data, error } = await useFetchApi(newEndpoint, options).post().json()
    if (data.value) {
      ElMessage({
        message: t('models.newModel.createSuccess'),
        type: 'success'
      })
      const res = data.value
      window.location.href = `/models/${res.data.path}`
    } else {
      ElMessage({
        message: t('models.newModel.createFail') + `: ${error.value.msg}`,
        type: 'error'
      })
    }
  }

  const getLicenses = async () => {
    try {
      const { data } = await useFetchApi(`/tags?category=license&scope=model`).json();
      licenseList.value = data.value.data;
      dataForm.value.license = licenseList.value[0]?.name||'';
    } catch (error) {
      console.error(error);
    }
  };

  onMounted(() => {
    getLicenses();
  });
</script>

<style scoped>
  :deep(.el-input) {
    height: 40px;

    @media screen and (max-width: 768px) {
      width: 100%;
    }
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
