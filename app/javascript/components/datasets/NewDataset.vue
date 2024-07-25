<template>
  <div class="w-[640px] m-auto flex flex-col items-center md:w-full md:p-5">
    <div>
      <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36" fill="none">
        <path opacity="0.12" d="M18 33C25.4558 33 31.5 30.9853 31.5 28.5V7.5C31.5 7.5 30.75 12 18 12C5.25 12 4.5 7.5 4.5 7.5V28.5C4.5 30.9853 10.5442 33 18 33Z" fill="#1F75CB"/>
        <path d="M31.5 18C31.5 20.4853 25.4558 22.5 18 22.5C10.5442 22.5 4.5 20.4853 4.5 18M31.5 7.5C31.5 9.98528 25.4558 12 18 12C10.5442 12 4.5 9.98528 4.5 7.5M31.5 7.5C31.5 5.01472 25.4558 3 18 3C10.5442 3 4.5 5.01472 4.5 7.5M31.5 7.5V28.5C31.5 30.9853 25.4558 33 18 33C10.5442 33 4.5 30.9853 4.5 28.5V7.5" stroke="#1F75CB" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
    <h3 class="text-[#303133] text-xl font-semibold mt-6 mb-3">{{ $t('datasets.newDataset.title') }}</h3>
    <p class="text-[#606266] text-base font-medium md:text-center">{{ $t('datasets.newDataset.titleDesc') }}</p>
    <div class="mt-9">
      <!-- 数据集名称选择 -->
      <div class="w-full flex sm:flex-col gap-2 mb-9 md:gap-9">
        <div>
          <p class="text-[#303133] text-sm mb-2">{{ $t('datasets.newDataset.owner') }}</p>
          <el-select v-model="owner" :placeholder="$t('all.select')" size="large">
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
          <p class="text-[#303133] text-sm mb-2">{{ $t('datasets.newDataset.datasetName') }}</p>
          <el-input v-model="datasetName" :placeholder="$t('rule.nameRule')" input-style="width: 100%">
          <template #suffix>
              <InputTip :content="$t('datasets.newDataset.tip')" />
            </template>
          </el-input>
        </div>
      </div>

      <div class="w-full flex sm:flex-col gap-2 mb-9 md:gap-9">
        <div class="flex-1">
          <p class="text-[#303133] text-sm mb-2">{{ $t('datasets.newDataset.datasetNickName') }}</p>
          <el-input v-model="datasetNickName" :placeholder="$t('all.inputNickNamePlc')" />
        </div>
        <div class="">
          <p class="text-[#303133] text-sm mb-2">License</p>
          <el-select v-model="license" :placeholder="$t('all.select')" size="large">
            <el-option
              v-for="item in licenses"
              :key="item[0]"
              :label="item[1]"
              :value="item[0]"
            />
          </el-select>
        </div>
      </div>

      <div class="w-full flex sm:flex-col mb-9">
        <div class="flex-1">
          <p class="text-[#303133] text-sm mb-2">{{ $t('datasets.newDataset.datasetDesc') }}</p>
          <el-input v-model="datasetDesc"
                    :rows="6"
                    type="textarea"
                    :placeholder="this.$t('all.inputDescPlc')" />
        </div>
      </div>

      <hr class="mb-9" />
      <div class="mb-9">
        <el-radio-group v-model="visibility" class="!block">
          <el-radio class="w-full mr-0 mb-9 !rounded-xl !h-auto !items-start !p-4 bg-[#F9FAFB]" label="public" size="large" border disabled>
            {{ $t('datasets.newDataset.public') }}
            <p class="whitespace-normal text-[#475467] font-light">{{ $t('datasets.newDataset.publicDesc') }}</p>
          </el-radio>
          <el-radio class="w-full mr-0 !rounded-xl !h-auto !items-start !p-4" label="private" size="large" border>
            {{ $t('datasets.newDataset.private') }}
            <p class="whitespace-normal text-[#475467] font-light">{{ $t('datasets.newDataset.privateDesc') }}</p>
          </el-radio>
        </el-radio-group>
      </div>
      <hr class="mb-9" />
      <p class="mb-9 rounded bg-[#F0F3FF] text-[#4D6AD6] text-[13px] py-[9px] px-4">
        <span> {{ $t('datasets.newDataset.tips') }}</span>
        <br />
        <span> {{ $t('datasets.newDataset.tips2') }}</span>
      </p>
      <div class="flex justify-end">
        <button
          class="bg-[#3250BD] w-[118px] h-9 rounded-lg text-white flex items-center justify-center border disabled:text-[#98A2B3] disabled:bg-[#F2F4F7] disabled:border-[#EAECF0]"
          @click="createDataset"
          :disabled="!canCreateDataset || hasCreateDataset"
        >
        {{ $t('datasets.newDataset.createDataset') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed, onMounted, inject } from 'vue'
  import { ElInput, ElMessage } from 'element-plus'
  import csrfFetch from "../../packs/csrfFetch.js"
  import { useI18n } from 'vue-i18n'
  import InputTip from '../shared/inputs/InputTip.vue'
  import useUserStore from '../../stores/UserStore.js'

  const userStore = useUserStore()

  const props = defineProps({
    licenses: Array,
  })

  const { t } = useI18n();
  const nameRule = inject('nameRule')

  const license = ref(props.licenses[0][0])
  const owner = ref('')
  const datasetName = ref('')
  const datasetNickName = ref('')
  const datasetDesc = ref('')
  const visibility = ref('private')
  const hasCreateDataset = ref(false)

  const canCreateDataset = computed(() => { return nameRule.test(datasetName.value) })

  const namespaces = () => {
    let namespaces = userStore.orgs.map(org => org.path)
    namespaces.unshift(userStore.username)
    const params = new URLSearchParams(window.location.search);
    const orgName = params.get('orgName')
    owner.value = orgName || namespaces[0]
    return namespaces
  }

  const createDataset = async () => {
    try {
      const res = await submitDatasetForm()
      ElMessage.success(t('datasets.newDataset.createSuccess'))
      toDatasetDetail(res.path)
    } catch (err) {
      ElMessage.warning(err.message)
    }
  }

  async function submitDatasetForm() {
    const datasetCreateEndpoint = `/internal_api/datasets`
    const formData = new FormData()
    const [ownerId, ownerType] = owner.value.split('_')
    formData.append('owner_id', ownerId)
    formData.append('owner_type', ownerType)
    formData.append('name', datasetName.value)
    formData.append('nickname', datasetNickName.value)
    formData.append('desc', datasetDesc.value)
    formData.append('license', license.value)
    formData.append('visibility', visibility.value)

    const options = { method: 'POST', body: formData }
    hasCreateDataset.value = true

    const response = await csrfFetch(datasetCreateEndpoint, options)
    if (!response.ok) {
      hasCreateDataset.value = false
      const data = await response.json()
      throw new Error(data.message)
    } else {
      hasCreateDataset.value = false
      return response.json()
    }
  }

  const toDatasetDetail = (path) => {
    window.location.pathname = `/datasets/${path}`
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