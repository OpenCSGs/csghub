<template>
  <div class="w-[640px] m-auto flex flex-col items-center md:w-full md:p-5">
    <div>
      <SvgIcon
        name="spaces"
        width="36"
        height="36"
      />
    </div>
    <h3 class="text-[#303133] text-xl font-semibold mt-6 mb-3">
      {{ $t('application_spaces.new.title') }}
    </h3>
    <p class="text-[#606266] text-base font-medium md:text-center">
      {{ $t('application_spaces.new.subTitle1') }}
    </p>
    <p class="text-[#606266] text-base font-medium md:text-center">
      {{ $t('application_spaces.new.subTitle2') }}
    </p>
    <div class="mt-9">
      <!-- name -->
      <div class="w-full flex sm:flex-col gap-2 mb-9 md:gap-9">
        <div>
          <p class="text-[#303133] text-sm mb-2">{{ $t('application_spaces.new.owner') }}</p>
          <el-select
            v-model="owner"
            placeholder="选择"
            size="large"
          >
            <el-option
              v-for="item in namespaces()"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </div>
        <div class="md:hidden">
          <p class="h-8"></p>
          <p class="text-[#909399] text-xl font-light">/</p>
        </div>
        <div class="flex-1">
          <p class="text-[#303133] text-sm mb-2">{{ $t('application_spaces.new.name') }}</p>
          <el-input
            v-model="spaceName"
            :placeholder="$t('application_spaces.new.namePlaceholder')"
            input-style="width: 100%"
          >
            <template #suffix>
              <InputTip :content="$t('application_spaces.new.tip')" />
            </template>
          </el-input>
        </div>
      </div>

      <!-- nickname & license -->
      <div class="w-full flex sm:flex-col gap-2 mb-9 md:gap-9">
        <div class="flex-1">
          <p class="text-[#303133] text-sm mb-2">{{ $t('application_spaces.new.nickname') }}</p>
          <el-input
            v-model="spaceNickName"
            :placeholder="$t('application_spaces.new.nicknamePlaceholder')"
          />
        </div>
        <div>
          <p class="text-[#303133] text-sm mb-2">License</p>
          <el-select
            v-model="license"
            placeholder="选择"
            size="large"
          >
            <el-option
              v-for="item in licenses"
              :key="item[0]"
              :label="item[1]"
              :value="item[0]"
            />
          </el-select>
        </div>
      </div>

      <!-- desc -->
      <div class="w-full flex sm:flex-col mb-9">
        <div class="flex-1">
          <p class="text-[#303133] text-sm mb-2">{{ $t('application_spaces.new.description') }}</p>
          <el-input
            v-model="spaceDesc"
            :rows="6"
            type="textarea"
            :placeholder="$t('application_spaces.new.descriptionPlaceholder')"
          />
        </div>
      </div>

      <div class="w-full flex sm:flex-col mb-9">
        <div class="flex-1">
          <p class="text-[#303133] text-sm mb-2">{{ $t('application_spaces.new.coverImage') }}</p>
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
      </div>

      <hr class="mb-9" />

      <div class="mb-9 text-sm w-full">
        <p class="mb-2 text-[#303133] font-medium">{{ $t('application_spaces.new.sdk') }}</p>
        <p class="text-[#475467] mt-2 font-light">{{ $t('application_spaces.new.sdkDesc') }}</p>
        <div class="flex gap-[24px] mt-9 sm:flex-col">
          <div
            class="flex items-center justify-center flex-col border-[2px] rounded-[8px] w-[142px] h-[120px] cursor-pointer"
            :class="SDK === 'gradio' ? 'border-[#3250BD] text-[#344054]' : ''"
            @click="SDK = 'gradio'"
          >
            <SvgIcon name="space_gradio" />
            <p class="font-semibold text-[16px]">Gradio</p>
          </div>
          <div
            class="flex items-center justify-center flex-col border-[2px] rounded-[8px] w-[142px] h-[120px] cursor-pointer"
            :class="SDK === 'streamlit' ? 'border-[#3250BD] text-[#344054]' : ''"
            @click="SDK = 'streamlit'"
          >
            <SvgIcon name="space_streamlit" />
            <p class="font-semibold text-[16px]">Streamlit</p>
          </div>
          <div
            v-if="isAdmin"
            class="flex items-center justify-center flex-col border-[2px] rounded-[8px] w-[142px] h-[120px] cursor-pointer"
            :class="SDK === 'nginx' ? 'border-[#3250BD] text-[#344054]' : ''"
            @click="SDK = 'nginx'"
          >
            <SvgIcon
              name="space_nginx"
              width="24"
              height="24"
            />
            <p class="font-semibold text-[16px]">Nginx</p>
          </div>
          <div
            v-if="!isAdmin"
            class="flex items-center justify-center flex-col border-[2px] rounded-[8px] w-[142px] h-[120px] cursor-pointer"
            :class="SDK === 'docker' ? 'border-[#3250BD] text-[#344054]' : 'text-[#D0D5DD]'"
          >
            <SvgIcon name="space_docker" />
            <p class="font-semibold text-[16px]">Docker</p>
            <p class="text-[12px]">11 templates</p>
          </div>
          <div
            class="flex items-center justify-center flex-col border-[2px] rounded-[8px] w-[142px] h-[120px] cursor-pointer"
            :class="SDK === 'static' ? 'border-[#3250BD] text-[#344054]' : 'text-[#D0D5DD]'"
          >
            <SvgIcon name="space_static" />
            <p class="font-semibold text-[16px]">Static</p>
            <p class="text-[12px]">3 templates</p>
          </div>
        </div>
      </div>

      <div class="mb-9 text-sm w-full">
        <p class="mb-2 text-[#303133]">{{ $t('application_spaces.new.cloudResource') }}</p>
        <el-select
          v-model="spaceResource"
          placeholder="选择"
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
        <p class="text-[#475467] mt-2 font-light">
          {{ $t('application_spaces.new.cloudResourceDesc1') }}
        </p>
        <p class="text-[#475467] font-light">
          {{ $t('application_spaces.new.cloudResourceDesc2') }}
        </p>
      </div>

      <hr class="mb-9" />

      <div class="mb-9">
        <el-radio-group
          v-model="visibility"
          class="!block"
        >
          <el-radio
            class="w-full mr-0 mb-9 !rounded-xl !h-auto !items-start !p-4"
            label="public"
            size="large"
            border
          >
            {{ $t('application_spaces.new.public') }}
            <p class="whitespace-normal text-[#475467] font-light">
              {{ $t('application_spaces.new.publicDesc') }}
            </p>
          </el-radio>
          <el-radio
            class="w-full mr-0 !rounded-xl !h-auto !items-start !p-4"
            label="private"
            size="large"
            border
          >
            {{ $t('application_spaces.new.private') }}
            <p class="whitespace-normal text-[#475467] font-light">
              {{ $t('application_spaces.new.privateDesc') }}
            </p>
          </el-radio>
        </el-radio-group>
      </div>
      <hr class="mb-9" />
      <p class="mb-9 rounded bg-[#F0F3FF] text-[#4D6AD6] text-[13px] py-[9px] px-4">
        {{ $t('application_spaces.new.notes') }}
      </p>
      <div class="flex justify-end">
        <button
          class="bg-[#3250BD] w-[118px] ml-[10px] h-9 rounded-lg text-white flex items-center justify-center border disabled:text-[#98A2B3] disabled:bg-[#F2F4F7] disabled:border-[#EAECF0]"
          @click="createApplicationSpace"
          :disabled="!canCreateApplicationSpace || hasCreateApplicationSpace"
        >
          {{ $t('application_spaces.new.create') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed, onMounted, inject } from 'vue'
  import { ElInput, ElMessage } from 'element-plus'
  import csrfFetch from '../../packs/csrfFetch'
  import { useI18n } from 'vue-i18n'
  import InputTip from '../shared/inputs/InputTip.vue'
  import jwtFetch from '../../packs/jwtFetch'
  import useUserStore from '../../stores/UserStore'

  const userStore = useUserStore()

  const props = defineProps({
    licenses: Array,
    isAdmin: Boolean
  })

  const csghubServer = inject('csghubServer')
  const { t } = useI18n()
  const nameRule = inject('nameRule')

  const license = ref(props.licenses[0][0])
  const owner = ref('')
  const imageUploaded = ref(false)
  const spaceName = ref('')
  const spaceNickName = ref('')
  const spaceDesc = ref('')
  const visibility = ref('private')
  const SDK = ref('gradio')
  const images = ref([])
  const coverImage = ref('')
  const csrf_token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')
  const hasCreateApplicationSpace = ref(false)

  const namespaces = () => {
    let namespaces = userStore.orgs.map(org => org.path)
    namespaces.unshift(userStore.username)
    const params = new URLSearchParams(window.location.search);
    const orgName = params.get('orgName')
    owner.value = orgName || namespaces[0]
    return namespaces
  }

  onMounted(() => {
    fetchSpaceResources()
  })

  const canCreateApplicationSpace = computed(() => {
    return nameRule.test(spaceName.value)
  })

  const spaceResources = ref([])
  const spaceResource = ref('')

  const createApplicationSpace = async () => {
    try {
      const res = await submitApplicationSpaceForm()
      ElMessage.success(t('application_spaces.new.createSuccess'))
      toApplicationSpaceDetail(res.path)
    } catch (err) {
      ElMessage.warning(err.message)
    }
  }

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
        spaceResource.value = body.data[0]?.id || ''
        spaceResources.value = body.data
      })
    }
  }

  async function submitApplicationSpaceForm() {
    const modelCreateEndpoint = `/internal_api/spaces`
    const formData = new FormData()
    const [ownerId, ownerType] = owner.value.split('_')
    formData.append('owner_id', ownerId)
    formData.append('owner_type', ownerType)
    formData.append('name', spaceName.value)
    formData.append('nickname', spaceNickName.value)
    formData.append('desc', spaceDesc.value)
    formData.append('license', license.value)
    formData.append('visibility', visibility.value)
    formData.append('sdk', SDK.value)
    formData.append('cloud_resource', spaceResource.value)
    formData.append('cover_image', coverImage.value)

    const options = { method: 'POST', body: formData }
    hasCreateApplicationSpace.value = true

    const response = await csrfFetch(modelCreateEndpoint, options)
    if (!response.ok) {
      hasCreateApplicationSpace.value = false
      const data = await response.json()
      throw new Error(data.message)
    } else {
      hasCreateApplicationSpace.value = false
      return response.json()
    }
  }
  const toApplicationSpaceDetail = (path) => {
    window.location.pathname = `/spaces/${path}`
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
    coverImage.value = ''
    imageUploaded.value = false
  }

  const handleUploadSuccess = (res) => {
    coverImage.value = res.url
    imageUploaded.value = true
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
</style>
