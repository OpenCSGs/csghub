<template>
  <div class="w-[640px] m-auto flex flex-col items-center md:w-full md:p-5">
    <div>
      <SvgIcon
        name="spaces"
        width="36"
        height="36"
      />
    </div>
    <h3 class="text-gray-700 text-xl font-medium mt-6 mb-3">
      {{ t('application_spaces.new.title') }}
    </h3>
    <p class="text-gray-500 text-md font-regular md:text-center">
      {{ t('application_spaces.new.subTitle1') }}
    </p>
    <p class="text-gray-500 text-md font-regular md:text-center">
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
            <el-form-item
              :label="t('application_spaces.new.owner')"
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
              :label="t('application_spaces.new.spaceEnName')"
              prop="name"
            >
              <el-input
                v-model="dataForm.name"
                :placeholder="
                  t('all.pleaseInput', {
                    value: t('application_spaces.new.spaceEnName')
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
                  <p>${t('application_spaces.new.tip')}</p>
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
                    <el-icon
                      class="cursor-pointer hover:text-[var(--Brand-300)]"
                      ><Warning
                    /></el-icon>
                  </el-tooltip>
                </template>
              </el-input>
            </el-form-item>
          </div>
        </div>

        <div
          class="w-full flex md:flex-col gap-[16px] items-center justify-between"
        >
          <el-form-item
            class="w-full"
            :label="t('application_spaces.new.nickname')"
            prop="nickname"
          >
            <el-input
              v-model="dataForm.nickname"
              :placeholder="
                t('all.pleaseInput', {
                  value: t('application_spaces.new.nickname')
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
          :label="t('application_spaces.new.description')"
          prop="desc"
        >
          <el-input
            v-model="dataForm.desc"
            :rows="6"
            type="textarea"
            :placeholder="
              t('all.pleaseInput', {
                value: t('application_spaces.new.description')
              })
            "
          />
        </el-form-item>

        <el-form-item
          class="w-full !mb-0"
          :label="$t('application_spaces.new.coverImage')"
        >
          <div class="flex-1">
            <el-upload
              :class="`${!imageUploaded ? 'h-auto' : 'hide'}`"
              :limit="1"
              v-model:file-list="images"
              list-type="picture-card"
              :headers="{}"
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
                  <div class="font-light text-xs">
                    {{ $t('application_spaces.new.coverImageDesc2') }}
                  </div>
                </div>
              </div>
            </el-upload>
          </div>
        </el-form-item>
        <el-divider class="!my-[18px]" />
        <el-form-item
          class="w-full sdk-container justify-between"
          :label="$t('application_spaces.new.sdk')"
          prop="sdk"
        >
          <p class="text-gray-600 mb-[24px] font-light">
            {{ $t('application_spaces.new.sdkDesc') }}
          </p>
          <el-radio-group
            v-model="dataForm.sdk"
            class="!grid grid-cols-4 w-full gap-[24px]"
          >
            <el-radio
              class="rounded-md !border-[2px] !h-[120px] flex justify-center"
              label="gradio"
              size="large"
              border
            >
              <SvgIcon
                name="space_gradio"
                class="m-auto"
              />
              <p class="font-semibold text-md">Gradio</p>
            </el-radio>
            <el-radio
              class="rounded-md !border-[2px] !h-[120px] flex justify-center"
              label="streamlit"
              size="large"
              border
            >
              <SvgIcon
                name="space_streamlit"
                class="m-auto"
              />
              <p class="font-semibold text-md">Streamlit</p>
            </el-radio>
            <el-radio
              v-if="userStore.isAdmin"
              class="rounded-md !border-[2px] !h-[120px] flex justify-center"
              size="large"
              label="nginx"
              border
            >
              <SvgIcon
                name="space_nginx"
                width="24"
                height="24"
                class="m-auto"
              />
              <p class="font-semibold text-md">Nginx</p>
            </el-radio>
            <el-radio
              class="rounded-md !border-[2px] !h-[120px] flex justify-center"
              size="large"
              label="docker"
              @click="fetchDockerTemplates"
              border
            >
              <SvgIcon
                name="space_docker"
                class="m-auto"
              />
              <p class="font-semibold text-md">Docker</p>
              <!-- <p class="text-xs">11 templates</p> -->
            </el-radio>
            <el-radio
              disabled
              class="rounded-md !border-[2px] !h-[120px] flex justify-center"
              label="static"
              size="large"
              border
            >
              <SvgIcon
                name="space_static"
                class="m-auto"
              />
              <p class="font-semibold text-md">Static</p>
              <p class="text-xs">3 templates</p>
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <div v-if="dataForm.sdk === 'docker'">
          <p class="text-gray-600 mb-1.5 font-light">
            {{ $t('application_spaces.new.chooseTemplate') }}
          </p>

          <el-radio-group
            v-model="dockerTemplate"
            class="flex flex-wrap gap-2 mb-6"
          >
            <el-radio-button v-for="template in dockerTemplates"
              :label="template.name"
              :value="template.name"
              size="large"
              border
            />
          </el-radio-group>

          <div v-if="dockerTemplate" class="mb-6">
            <div v-if="currentDockerTemplates.secrets">
              <p class="text-gray-700 text-sm leading-5">{{ t('application_spaces.new.spaceSecrets') }}</p>
              <div
                v-for="secret in JSON.parse(currentDockerTemplates.secrets)"
                :key="secret.name">
                <div class="flex justify-between items-center my-2 pl-4">
                  <label :for="secret.name" class="text-gray-600 mb-1.5 font-light text-xs w-[40%]">{{ secret.name }}</label>
                  <el-input v-model="dockerSecrets[secret.name]" size="small"></el-input>
                </div>
              </div>
            </div>

            <div v-if="currentDockerTemplates.variables">
              <p class="text-gray-700 text-sm leading-5">{{ t('application_spaces.new.spaceVariables') }}</p>
              <div v-for="variable in JSON.parse(currentDockerTemplates.variables)" :key="variable.name">
                <div class="flex justify-between items-center my-2 pl-4">
                  <label :for="variable.name" class="text-gray-600 mb-1.5 font-light text-xs w-[40%]">{{ variable.name }}</label>
                  <el-input v-model="dockerVariables[variable.name]" size="small"></el-input>
                </div>
              </div>
            </div>
          </div>

          <!-- <div class="flex flex-wrap">
            <div v-for="template in dockerTemplates"
              class="border  hover:border-brand-600 peer-checked:border-brand-600 cursor-pointer py-2.5 rounded-lg w-[150px] font-medium flex justify-center items-center">
              {{ template.name }}
            </div>
          </div> -->
        </div>
        <el-form-item
          :label="t('endpoints.new.cluster')"
          class="w-full"
          prop="space_cluster">
          <el-select
            v-model="dataForm.space_cluster"
            :placeholder="
              t('all.pleaseSelect', { value: t('application_spaces.new.cluster') })
            "
            size="large"
            style="width: 100%"
            @change="fetchSpaceResources">
            <el-option
              v-for="item in spaceClusters"
              :key="item.cluster_id"
              :label="item.region"
              :value="item.cluster_id" />
          </el-select>
        </el-form-item>
        <el-form-item
          class="w-full !mb-0"
          :label="$t('application_spaces.new.cloudResource')"
        >
          <el-select
            v-model="dataForm.cloud_resource"
            :placeholder="
              t('all.pleaseSelect', {
                value: t('application_spaces.new.cloudResource')
              })
            "
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
          <p class="text-gray-600 mt-[8px] font-light">
            {{ $t('application_spaces.new.cloudResourceDesc1') }}
          </p>
          <p class="text-gray-600 font-light">
            {{ $t('application_spaces.new.cloudResourceDesc2') }}
          </p>
        </el-form-item>
        <el-divider class="my-[18px]" />
        <el-form-item class="w-full">
          <PublicAndPrivateRadioGroup
            v-model="dataForm.visibility"
            :publicDesc="t('application_spaces.new.publicDesc')"
            :privateDesc="t('application_spaces.new.privateDesc')"
          />
        </el-form-item>
        <p
          class="mb-[18px] rounded-md bg-brand-25 text-brand-500 text-[13px] py-[9px] px-4"
        >
          {{ t('application_spaces.new.notes') }}
        </p>
        <div class="flex justify-end">
          <el-form-item>
            <CsgButton
              :loading="loading"
              @click="handleSubmit"
              class="btn btn-primary btn-md"
              :name="t('application_spaces.new.create')"
            />
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted, inject, computed } from 'vue'
  import { ElInput, ElMessage } from 'element-plus'
  import { useI18n } from 'vue-i18n'
  import useFetchApi from '../../packs/useFetchApi'
  import useUserStore from '../../stores/UserStore'
  import PublicAndPrivateRadioGroup from '../shared/form/PublicAndPrivateRadioGroup.vue'

  const props = defineProps({
    licenses: Array
  })

  const userStore = useUserStore()
  const dataFormRef = ref(null)
  const imageUploaded = ref(false)
  const images = ref([])
  const { t } = useI18n()
  const nameRule = inject('nameRule')
  const dockerTemplates = ref([])
  const dockerTemplate = ref('')
  const dockerVariables = ref({})
  const dockerSecrets = ref({})

  const currentDockerTemplates = computed(() => {
    const currentTemplate = dockerTemplates.value.find((template) => template.name === dockerTemplate.value)
    if (currentTemplate && currentTemplate.variables) {
      dockerVariables.value = JSON.parse(currentTemplate.variables).reduce((accumulator, current) => {
        accumulator[current.name] = current.value
        return accumulator
      }, {})
    }
    if (currentTemplate && currentTemplate.secrets) {
      dockerSecrets.value = JSON.parse(currentTemplate.secrets).reduce((accumulator, current) => {
        accumulator[current.name] = current.value
        return accumulator
      }, {})
    }
    return (currentTemplate || {})
  })

  const dataForm = ref({
    owner: '',
    license: props.licenses[0][0],
    visibility: 'public',
    sdk: 'gradio'
  })
  const loading = ref(false)

  const rules = ref({
    owner: [
      {
        required: true,
        message: t('all.pleaseSelect', {
          value: t('application_spaces.new.owner')
        }),
        trigger: 'change'
      }
    ],
    name: [
      {
        required: true,
        message: t('all.pleaseInput', {
          value: t('application_spaces.new.name')
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
        message: t('all.pleaseSelect', {
          value: t('application_spaces.new.license')
        }),
        trigger: 'change'
      }
    ]
  })

  const namespaces = () => {
    let namespaces = userStore.orgs.map((org) => org.path)
    namespaces.unshift(userStore.username)
    const params = new URLSearchParams(window.location.search)
    const orgName = params.get('orgName')
    dataForm.value.owner = orgName || namespaces[0]
    return namespaces
  }

  const spaceResources = ref([])
  const spaceClusters = ref([])

  const fetchClusters = async () => {
    const { data, error } = await useFetchApi('/cluster').json()
    if (error.value) {
      ElMessage({ message: error.value.msg, type: 'warning' })
    } else {
      const body = data.value
      dataForm.value.space_cluster = body.data[0]?.cluster_id || ''
      spaceClusters.value = body.data
      fetchSpaceResources()
    }
  }

  const fetchSpaceResources = async () => {
    const { data, error } = await useFetchApi(`/space_resources?cluster_id=${dataForm.value.space_cluster}`).json()

    if (error.value) {
      ElMessage({
        message: error.value.msg || t('application_spaces.new.failedFetchResources'),
        type: 'warning'
      })
    } else {
      const body = data.value
      const firstAvailableResource = body.data.find(
        (item) => item.is_available
      )
      dataForm.value.cloud_resource = firstAvailableResource?.id || ''
      spaceResources.value = body.data
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
    dataFormRef.value
      .validate(async (valid) => {
        if (valid) {
          await createApplicationSpace()
        } else {
          return false
        }
      })
      .finally(() => {
        loading.value = false
      })
  }

  const createApplicationSpace = async () => {
    const params = {
      name: dataForm.value.name,
      nickname: dataForm.value.nickname,
      namespace: dataForm.value.owner,
      license: dataForm.value.license,
      description: dataForm.value.desc,
      sdk: dataForm.value.sdk,
      cover_image_url: dataForm.value.cover_image,
      hardware: dataForm.value.cloud_resource,
      resource_id: dataForm.value.cloud_resource,
      cluster_id: dataForm.value.space_cluster,
      private: dataForm.value.visibility === 'private'
    }

    if (dataForm.value.sdk === 'docker') {
      params.template = dockerTemplate.value
      params.variables = JSON.stringify(dockerVariables.value)
      params.secrets = JSON.stringify(dockerSecrets.value)
    }

    const options = {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    }
    const newEndpoint = '/spaces'
    const { data, error } = await useFetchApi(newEndpoint, options).post().json()
    if (data.value) {
      ElMessage({
        message: t('application_spaces.new.createSuccess'),
        type: 'success'
      })
      window.location.href = `/spaces/${data.value.data.path}`
    } else {
      ElMessage({
        message: t('application_spaces.new.createFail') + `: ${error.value.msg}`,
        type: 'error'
      })
    }
  }

  const fetchDockerTemplates = async () => {
    try {
      const { data, error } = await useFetchApi('space_templates/docker').json()
      if (data.value) {
        dockerTemplates.value = data.value.data
      } else {
        ElMessage.warning(error.value.msg)
      }
    } catch (error) {
      ElMessage.warning(error)
    }
  }

  onMounted(() => {
    fetchClusters()
  })
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
    color: var(--Gray-700) !important;
    font-weight: 400;
  }

  :deep(.el-radio.is-bordered.is-checked) {
    border: 2px solid var(--Brand-600);
  }

  :deep(.el-radio__input.is-checked .el-radio__inner) {
    background: var(--Brand-600);
    border-color: var(--Brand-600);
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
    border-radius: var(--border-radius-md);
  }
  :deep(.sdk-container .el-radio.is-bordered.el-radio--large .el-radio__inner) {
    display: none;
  }
  :deep(.sdk-container .el-radio) {
    margin-right: unset;
  }
  :deep(.sdk-container .el-radio.is-disabled .el-radio__label) {
    color: var(--Gray-300) !important;
  }
  :deep(.sdk-container .el-radio.is-disabled.is-bordered) {
    border-style: dashed;
    border-color: var(--Gray-200) !important;
  }
  :deep(.el-form-item__content) {
    line-height: unset;
  }
  :deep(.sdk-container label) {
    margin-bottom: 0;
  }
</style>
