<template>
  <div class="w-[640px] m-auto flex flex-col items-center md:w-full md:p-5">
    <div>
      <SvgIcon name="spaces" width="36" height="36" />
    </div>
    <h3 class="text-[#303133] text-xl font-semibold mt-6 mb-3">{{ t('application_spaces.new.title') }}</h3>
    <p class="text-[#606266] text-base font-medium md:text-center">{{ t('application_spaces.new.subTitle1') }}</p>
    <p class="text-[#606266] text-base font-medium md:text-center">
      {{ $t('application_spaces.new.subTitle2') }}
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
          <div class="w-full flex md:flex-col gap-[16px] items-center">
            <el-form-item :label="t('application_spaces.new.owner')" prop="owner" class="w-full">
              <el-select v-model="dataForm.owner" :placeholder="t('all.select')" size="large" style="width: 100%;">
                <el-option
                  v-for="item in namespaces"
                  :key="item[0]"
                  :label="item[1]"
                  :value="item[0]"
                />
              </el-select>
            </el-form-item>
            <el-form-item class="w-full" :label="t('application_spaces.new.spaceEnName')" prop="name">
              <el-input v-model="dataForm.name" :placeholder="t('all.pleaseInput', { value: t('application_spaces.new.spaceEnName') })" input-style="width: 100%" >
                <template #suffix>            
                  <el-tooltip class="item" effect="dark" raw-content :content="`
                  <p>${t('application_spaces.new.tip')}</p>
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
        </div>

        <div class="w-full flex md:flex-col gap-[16px] items-center justify-between">
          <el-form-item class="w-full" :label="t('application_spaces.new.nickname')" prop="nickname">
            <el-input v-model="dataForm.nickname" :placeholder="t('all.pleaseInput', { value: t('application_spaces.new.nickname') })" />
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

        <el-form-item class="w-full" :label="t('application_spaces.new.description')" prop="desc">
          <el-input 
            v-model="dataForm.desc"
            :rows="6"
            type="textarea"
            :placeholder="t('all.pleaseInput', { value: t('application_spaces.new.description') })" />
        </el-form-item>

        <el-form-item class="w-full !mb-0" :label="$t('application_spaces.new.coverImage')" >
          <div class="flex-1">
            <el-upload
              :class="`${!imageUploaded ? 'h-auto' : 'hide'}`"
              :limit="1"
              v-model:file-list="images"
              list-type="picture-card"
              :headers="{ 'X-CSRF-TOKEN': csrf_token }"
              accept="image/png, image/jpeg, image/gif, image/svg+xml"
              :data="{ namespace: 'application_space' }"
              action="/internal_api/upload"
              :before-upload="handleBeforeUpload"
              :on-remove="handleRemoveImage"
              :on-success="handleUploadSuccess"
            >
              <div class="flex flex-col items-center">
                <SvgIcon name="space_upload" />
                <div class="el-upload__text">
                  <div>{{ $t('application_spaces.new.coverImageDesc1') }}</div>
                  <div class="font-light text-[12px]">
                    {{ $t('application_spaces.new.coverImageDesc2') }}
                  </div>
                </div>
              </div>
            </el-upload>
          </div>
        </el-form-item>
        <el-divider class="!my-[18px]" />
        <el-form-item class="w-full sdk-container justify-between" :label="$t('application_spaces.new.sdk')" prop="sdk">
          <p class="text-[#475467] mb-[24px] font-light">{{ $t('application_spaces.new.sdkDesc') }}</p>
          <el-radio-group v-model="dataForm.sdk" class="!grid grid-cols-4 w-full gap-[24px]">
            <el-radio class="rounded-[8px] !border-[2px] !h-[120px] flex justify-center" label="gradio" size="large" border>
              <SvgIcon name="space_gradio" class="m-auto"/>
              <p class="font-semibold text-[16px]">Gradio</p>
            </el-radio>
            <el-radio class="rounded-[8px] !border-[2px] !h-[120px] flex justify-center" label="streamlit" size="large" border>
              <SvgIcon name="space_streamlit" class="m-auto"/>
              <p class="font-semibold text-[16px]">Streamlit</p>
            </el-radio>
            <el-radio
              v-if="isAdmin"
              class="rounded-[8px] !border-[2px] !h-[120px] flex justify-center"
              size="large"
              label="nginx"
              border
            >
              <SvgIcon name="space_nginx" width="24" height="24" class="m-auto"/>
              <p class="font-semibold text-[16px]">Nginx</p>
            </el-radio>
            <el-radio
              v-if="!isAdmin"
              class="rounded-[8px] !border-[2px] !h-[120px] flex justify-center"
              size="large"
              label="docker"
              disabled
              border
            >
              <SvgIcon name="space_docker" class="m-auto"/>
              <p class="font-semibold text-[16px]">Docker</p>
              <p class="text-[12px]">11 templates</p>
            </el-radio>
            <el-radio disabled class="rounded-[8px] !border-[2px] !h-[120px] flex justify-center" label="static" size="large" border>
              <SvgIcon name="space_static" class="m-auto"/>
              <p class="font-semibold text-[16px]">Static</p>
              <p class="text-[12px]">3 templates</p>
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item class="w-full !mb-0" :label="$t('application_spaces.new.cloudResource')">
          <el-select
            v-model="dataForm.cloud_resource"
            :placeholder="t('all.pleaseSelect', { value: t('application_spaces.new.cloudResource') })"
            size="large"
            style="width: 100%"
          >
            <el-option
              v-for="item in spaceResources"
              :key="item.name"
              :label="item.name"
              :value="item.id"
              :disabled="!item.is_available"
            />
          </el-select>
          <p class="text-[#475467] mt-[8px] font-light">
            {{ $t('application_spaces.new.cloudResourceDesc1') }}
          </p>
          <p class="text-[#475467] font-light">
            {{ $t('application_spaces.new.cloudResourceDesc2') }}
          </p>
        </el-form-item>
        <el-divider class="my-[18px]" />
        <el-form-item class="w-full">
          <el-radio-group v-model="dataForm.visibility" class="!block">
            <el-radio class="w-full !border-2 mr-0 mb-[32px] !rounded-xl !h-auto !items-start !p-4" label="public" size="large" border>
              {{ t('application_spaces.new.public') }}
              <p class="whitespace-normal text-[#475467] font-light">{{ t('application_spaces.new.publicDesc') }}</p>
            </el-radio>
            <el-radio class="w-full !border-2 mr-0 !rounded-xl !h-auto !items-start !p-4" label="private" size="large" border>
              {{ t('application_spaces.new.private') }}
              <p class="whitespace-normal text-[#475467] font-light">{{ t('application_spaces.new.privateDesc') }}</p>
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <p class="mb-[18px] rounded bg-[#F0F3FF] text-[#4D6AD6] text-[13px] py-[9px] px-4">
          {{ t('application_spaces.new.notes') }}
        </p>
        <div class="flex justify-end">
          <el-form-item>
            <el-button
              :loading="loading"
              class="!text-center !h-9 !text-[16px] !text-white !bg-[#3250BD] !rounded-[8px] !border-[1px] !border-[#3250BD]"
              @click="handleSubmit"
            >
              {{ t('application_spaces.new.create') }}
            </el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed, onMounted, inject } from 'vue'
  import { ElInput, ElMessage } from 'element-plus'
  import csrfFetch from '../../packs/csrfFetch'
  import { useI18n } from 'vue-i18n'
  import jwtFetch from '../../packs/jwtFetch'
  const dataFormRef = ref(null)
  const imageUploaded = ref(false)
  const images = ref([])
  const coverImage = ref('')

  const props = defineProps({
    licenses: Array,
    namespaces: Array,
    isAdmin: Boolean
  })

  const dataForm = ref({
    owner: props.namespaces[0][0],
    license: props.licenses[0][0],
    visibility: "private",
    sdk: "gradio"
  })
  const loading = ref(false)

  const csghubServer = inject('csghubServer')
  const { t } = useI18n()
  const nameRule = inject('nameRule')

  const rules = ref({
    owner: [
      { required: true, message: t('all.pleaseSelect', { value: t('application_spaces.new.owner') }), trigger: 'change' }
    ],
    name: [
      { required: true, message: t('all.pleaseInput', { value: t('application_spaces.new.name') }), trigger: 'blur' },
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
      { required: true, message: t('all.pleaseSelect', { value: t('application_spaces.new.license') }), trigger: 'change' }
    ],
  })
  const csrf_token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')

  onMounted(() => {
    const params = new URLSearchParams(window.location.search)
    const result = props.namespaces.find((item) => item[1] === params.get('orgName'));
    if (result) {
      dataForm.value.owner = result[0]
    }
    fetchSpaceResources()
  });

  const spaceResources = ref([])

  const fetchSpaceResources = async () => {
    const options = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    }
    const res = await jwtFetch(`${csghubServer}/api/v1/space_resources`, options)
    if (!res.ok) {
      ElMessage({ message: t('application_spaces.new.failedFetchResources'), type: 'warning' })
    } else {
      res.json().then((body) => {
        dataForm.value.cloud_resource = body?.data ? body.data[0]?.id : ''
        spaceResources.value = body.data
      })
    }
  }

  const handleBeforeUpload = (file) => {
    if (file.size / 1024 <= 2000) {
      return true
    } else {
      ElMessage({ message: '文件过大', type: 'warning' })
      return false
    }
  }

  const handleRemoveImage = () => {
    dataForm.value.cover_image = ''
    imageUploaded.value = false
  }

  const handleUploadSuccess = (res) => {
    dataForm.value.cover_image = res.url
    imageUploaded.value = true
  }

  const handleSubmit = () => {
  loading.value = true
  dataFormRef.value.validate(async (valid) => {
    if (valid) {
      await createApplicationSpace()
    } else {
      return false
    }
  }).finally(() => {
    loading.value = false
  })
}

const createApplicationSpace = async () => {
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
  const uploadEndpoint = '/internal_api/spaces'
  const response = await csrfFetch(uploadEndpoint, options)
  if (response.ok) {
    ElMessage({
      message: t('application_spaces.new.createSuccess'),
      type: 'success'
    })
    response.json()
      .then(res => {
        window.location.href = `/spaces/${res.path}`
      })
  } else {
    response.json()
      .then(res => {
        ElMessage({
          message: t('application_spaces.new.createFail') + `: ${res.message}`,
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
    margin-top: 4px;
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
  :deep(.hide .el-upload.el-upload--picture-card) {
    display: none;
  }

  :deep(.el-input .el-input__wrapper) {
    border-radius: 8px;
  }
  :deep(.sdk-container .el-radio.is-bordered.el-radio--large .el-radio__inner) {
    display: none;
  }
  :deep(.sdk-container .el-radio) {
    margin-right: unset;
  }
  :deep(.sdk-container .el-radio.is-disabled .el-radio__label) {
    color: #D0D5DD !important;
  }
  :deep(.sdk-container .el-radio.is-disabled.is-bordered) {
    border-style: dashed;
    border-color: #EAECF0 !important;
  }
  :deep(.el-form-item__content) {
    line-height: unset;
  }
  :deep(.sdk-container label) {
    margin-bottom: 0;
  }
</style>
