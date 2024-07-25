<template>
  <div class="w-[640px] m-auto flex flex-col items-center md:w-full md:p-5">
    <div>
      <svg width="37" height="36" viewBox="0 0 37 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect opacity="0.12" x="3.5" y="3" width="30" height="30" rx="10" fill="#667085"/>
        <path d="M15.5 12L9.5 18L15.5 24M21.5 12L27.5 18L21.5 24M18.5 33V33C23.1594 33 25.4891 33 27.3268 32.2388C29.7771 31.2239 31.7239 29.2771 32.7388 26.8268C33.5 24.9891 33.5 22.6594 33.5 18V18C33.5 13.3406 33.5 11.0109 32.7388 9.17317C31.7239 6.72288 29.7771 4.77614 27.3268 3.7612C25.4891 3 23.1594 3 18.5 3V3C13.8406 3 11.5109 3 9.67317 3.7612C7.22288 4.77614 5.27614 6.72288 4.2612 9.17317C3.5 11.0109 3.5 13.3406 3.5 18V18C3.5 22.6594 3.5 24.9891 4.2612 26.8268C5.27614 29.2771 7.22288 31.2239 9.67317 32.2388C11.5109 33 13.8406 33 18.5 33Z" stroke="#667085" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
    <h3 class="text-[#303133] text-xl font-semibold mt-6 mb-3">{{ $t('codes.newCode.title') }}</h3>
    <p class="text-[#606266] text-base font-medium md:text-center">{{ $t('codes.newCode.titleDesc') }}</p>
    <div class="mt-9">
      <!-- 名称选择 -->
      <div class="w-full flex sm:flex-col gap-2 mb-9 md:gap-9">
        <div>
          <p class="text-[#303133] text-sm mb-2">{{ $t('codes.newCode.owner') }}</p>
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
          <p class="text-[#303133] text-sm mb-2">{{ $t('codes.newCode.codeName') }}</p>
          <el-input v-model="codeName" :placeholder="$t('rule.nameRule')" input-style="width: 100%" >
            <template #suffix>
              <InputTip :content="$t('codes.newCode.tip')" />
            </template>
          </el-input>
        </div>
      </div>

      <div class="w-full flex sm:flex-col gap-2 mb-9 md:gap-9">
        <div class="flex-1">
          <p class="text-[#303133] text-sm mb-2">{{ $t('codes.newCode.codeNickName') }}</p>
          <el-input v-model="codeNickName" :placeholder="$t('all.inputNickNamePlc')" />
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
          <p class="text-[#303133] text-sm mb-2">{{ $t('codes.newCode.codeDesc') }}</p>
          <el-input v-model="codeDesc"
                    :rows="6"
                    type="textarea"
                    :placeholder="$t('all.inputDescPlc')" />
        </div>
      </div>

      <hr class="mb-9" />
      <div class="mb-9">
        <el-radio-group v-model="visibility" class="!block">
          <el-radio class="w-full mr-0 mb-9 !rounded-xl !h-auto !items-start !p-4" label="public" size="large" border>
            {{ $t('codes.newCode.public') }}
            <p class="whitespace-normal text-[#475467] font-light">{{ $t('codes.newCode.publicDesc') }}</p>
          </el-radio>
          <el-radio class="w-full mr-0 !rounded-xl !h-auto !items-start !p-4" label="private" size="large" border>
            {{ $t('codes.newCode.private') }}
            <p class="whitespace-normal text-[#475467] font-light">{{ $t('codes.newCode.privateDesc') }}</p>
          </el-radio>
        </el-radio-group>
      </div>
      <hr class="mb-9" />
      <p class="mb-9 rounded bg-[#F0F3FF] text-[#4D6AD6] text-[13px] py-[9px] px-4">
        {{ $t('codes.newCode.tips') }}
      </p>
      <div class="flex justify-end">
        <button
          class="bg-[#3250BD] w-[118px] h-9 rounded-lg text-white flex items-center justify-center border disabled:text-[#98A2B3] disabled:bg-[#F2F4F7] disabled:border-[#EAECF0]"
          @click="createCode"
          :disabled="!canCreateCode || hasCreateCode"
        >
          {{ $t('codes.newCode.createCode') }}
        </button>
      </div>
    </div>
  </div>
</template>

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

<script setup>
  import { ref, computed, onMounted, inject } from 'vue'
  import { ElInput, ElMessage } from 'element-plus'
  import csrfFetch from "../../packs/csrfFetch.js"
  import { useI18n } from 'vue-i18n'
  import InputTip from '../shared/inputs/InputTip.vue'
  import useUserStore from '../../stores/UserStore'

  const userStore = useUserStore()

  const { t } = useI18n()
  const nameRule = inject('nameRule')

  const props = defineProps({
    licenses: Array
  })

  const license = ref(props.licenses[0][0])
  const owner = ref('')
  const codeName = ref('')
  const codeNickName = ref('')
  const codeDesc = ref('')
  const visibility = ref('private')
  const hasCreateCode = ref(false)

  const canCreateCode = computed(() => { return nameRule.test(codeName.value) })

  const namespaces = () => {
    let namespaces = userStore.orgs.map(org => org.path)
    namespaces.unshift(userStore.username)
    const params = new URLSearchParams(window.location.search);
    const orgName = params.get('orgName')
    owner.value = orgName || namespaces[0]
    return namespaces
  }

  const createCode = async () => {
    try {
      const res = await submitCodeForm()
      ElMessage.success(t('codes.newCode.createSuccess'))
      toCodelDetail(res.path)
    } catch (err) {
      ElMessage.warning(err.message)
    }
  }

  async function submitCodeForm() {
    const codeCreateEndpoint = `/internal_api/codes`
    const formData = new FormData()
    const [ownerId, ownerType] = owner.value.split('_')
    formData.append('owner_id', ownerId)
    formData.append('owner_type', ownerType)
    formData.append('name', codeName.value)
    formData.append('nickname', codeNickName.value)
    formData.append('desc', codeDesc.value)
    formData.append('license', license.value)
    formData.append('visibility', visibility.value)

    const options = { method: 'POST', body: formData }
    hasCreateCode.value = true

    const response = await csrfFetch(codeCreateEndpoint, options)
    if (!response.ok) {
      const data = await response.json()
      hasCreateCode.value = false
      throw new Error(data.message)
    } else {
      hasCreateCode.value = false
      return response.json()
    }
  }

  const toCodelDetail = (path) => {
    window.location.pathname = `/codes/${path}`
  }
</script>
