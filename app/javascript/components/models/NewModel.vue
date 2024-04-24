<template>
  <div class="w-[640px] m-auto flex flex-col items-center md:w-full md:p-5">
    <div>
      <svg xmlns="http://www.w3.org/2000/svg" width="37" height="36" viewBox="0 0 37 36" fill="none">
        <path opacity="0.12" d="M33.5 20.0654V10.9235C33.5 10.6613 33.3624 10.4182 33.1375 10.2833C32.8993 10.1404 32.6014 10.1415 32.3643 10.2863L23.5024 15.6967C21.6853 16.8061 20.7768 17.3608 19.805 17.5773C18.9455 17.7688 18.0545 17.7688 17.195 17.5773C16.2232 17.3608 15.3147 16.8061 13.4976 15.6967L4.6357 10.2863C4.39859 10.1415 4.10071 10.1404 3.8625 10.2833C3.6376 10.4182 3.5 10.6613 3.5 10.9235V20.0654C3.5 22.0474 3.5 23.0384 3.78438 23.9289C4.03603 24.7169 4.44792 25.4444 4.99417 26.0656C5.61145 26.7676 6.46124 27.2775 8.16084 28.2973L13.5608 31.5373C15.3566 32.6148 16.2545 33.1535 17.2131 33.364C18.0609 33.5502 18.9391 33.5502 19.7869 33.364C20.7455 33.1535 21.6434 32.6148 23.4392 31.5373L28.8392 28.2973C30.5388 27.2775 31.3886 26.7676 32.0058 26.0656C32.5521 25.4444 32.964 24.7169 33.2156 23.9289C33.5 23.0384 33.5 22.0474 33.5 20.0654Z" fill="#AD4A3B"/>
        <path d="M18.5 18.75L32 10.5M18.5 18.75L5 10.5M18.5 18.75V33.75M3.5 15.9354V20.0646C3.5 22.0466 3.5 23.0377 3.78438 23.9281C4.03603 24.7162 4.44792 25.4436 4.99417 26.0649C5.61145 26.7669 6.46124 27.2767 8.16084 28.2965L13.5608 31.5365C15.3566 32.614 16.2545 33.1527 17.2131 33.3632C18.0609 33.5494 18.9391 33.5494 19.7869 33.3632C20.7455 33.1527 21.6434 32.614 23.4392 31.5365L28.8392 28.2965C30.5388 27.2767 31.3886 26.7669 32.0058 26.0649C32.5521 25.4436 32.964 24.7162 33.2156 23.9281C33.5 23.0377 33.5 22.0466 33.5 20.0646V15.9354C33.5 13.9534 33.5 12.9623 33.2156 12.0719C32.964 11.2838 32.5521 10.5564 32.0058 9.93514C31.3886 9.23313 30.5388 8.72325 28.8392 7.7035L23.4392 4.4635C21.6434 3.38601 20.7455 2.84727 19.7869 2.63678C18.9391 2.4506 18.0609 2.4506 17.2131 2.63678C16.2545 2.84727 15.3566 3.38601 13.5608 4.46349L8.16084 7.7035C6.46124 8.72325 5.61145 9.23313 4.99417 9.93514C4.44792 10.5564 4.03603 11.2838 3.78438 12.0719C3.5 12.9623 3.5 13.9534 3.5 15.9354Z" stroke="#AD4A3B" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
    <h3 class="text-[#303133] text-xl font-semibold mt-6 mb-3">{{ $t('models.newModel.title') }}</h3>
    <p class="text-[#606266] text-base font-medium md:text-center">{{ $t('models.newModel.titleDesc') }}</p>
    <div class="mt-9">
      <!-- 模型名称选择 -->
      <div class="w-full flex sm:flex-col gap-2 mb-9 md:gap-9">
        <div>
          <p class="text-[#303133] text-sm mb-2">{{ $t('models.newModel.owner') }}</p>
          <el-select v-model="owner" :placeholder="$t('all.select')" size="large">
            <el-option
              v-for="item in namespaces"
              :key="item[0]"
              :label="item[1]"
              :value="item[0]"
            />
          </el-select>
        </div>
        <div class="md:hidden">
          <p class="h-8"></p>
          <p class="text-[#909399] text-xl font-light">/</p>
        </div>
        <div class="flex-1">
          <p class="text-[#303133] text-sm mb-2">{{ $t('models.newModel.modelName') }}</p>
          <el-input v-model="modelName" :placeholder="$t('rule.nameRule')" input-style="width: 100%" >
            <template #suffix>            
              <InputTip :content="$t('models.newModel.tip')" />
            </template>
          </el-input>
        </div> 
      </div>

      <div class="w-full flex sm:flex-col gap-2 mb-9 md:gap-9">
        <div class="flex-1">
          <p class="text-[#303133] text-sm mb-2">{{ $t('models.newModel.modelNickName') }}</p>
          <el-input v-model="modelNickName" :placeholder="$t('all.inputNickNamePlc')" />
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
          <p class="text-[#303133] text-sm mb-2">{{ $t('models.newModel.modelDesc') }}</p>
          <el-input v-model="modelDesc"
                    :rows="6"
                    type="textarea"
                    :placeholder="this.$t('all.inputDescPlc')" />
        </div>
      </div>

      <hr class="mb-9" />
      <div class="mb-9">
        <el-radio-group v-model="visibility" class="!block">
          <el-radio class="w-full mr-0 mb-9 !rounded-xl !h-auto !items-start !p-4" label="public" size="large" border>
            {{ $t('models.newModel.public') }}
            <p class="whitespace-normal text-[#475467] font-light">{{ $t('models.newModel.publicDesc') }}</p>
          </el-radio>
          <el-radio class="w-full mr-0 !rounded-xl !h-auto !items-start !p-4" label="private" size="large" border>
            {{ $t('models.newModel.private') }}
            <p class="whitespace-normal text-[#475467] font-light">{{ $t('models.newModel.privateDesc') }}</p>
          </el-radio>
        </el-radio-group>
      </div>
      <hr class="mb-9" />
      <p class="mb-9 rounded bg-[#F0F3FF] text-[#4D6AD6] text-[13px] py-[9px] px-4">
        {{ $t('models.newModel.tips') }}
      </p>
      <div class="flex justify-end">
        <button
          class="bg-[#3250BD] w-[118px] h-9 rounded-lg text-white flex items-center justify-center border disabled:text-[#98A2B3] disabled:bg-[#F2F4F7] disabled:border-[#EAECF0]"
          @click="createModel"
          :disabled="!canCreateModel || hasCreateModel"
        >
          {{ $t('models.newModel.createModel') }}
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

  const props = defineProps({
    licenses: Array,
    namespaces: Array,
  })

  const { t } = useI18n();
  const nameRule = inject('nameRule')

  const license = ref(props.licenses[0][0])
  const owner = ref(props.namespaces[0][0])
  const modelName = ref('')
  const modelNickName = ref('')
  const modelDesc = ref('')
  const visibility = ref('private')
  const hasCreateModel = ref(false)

  const canCreateModel = computed(() => { return nameRule.test(modelName.value) })

  const createModel = async () => {
    try {
      const res = await submitModelForm()
      ElMessage.success(t('models.newModel.createSuccess'))
      toModelDetail(res.path)
    } catch (err) {
      ElMessage.warning(err.message)
    }
  }

  async function submitModelForm() {
    const modelCreateEndpoint = `/internal_api/models`
    const formData = new FormData()
    const [ownerId, ownerType] = owner.value.split('_')
    formData.append('owner_id', ownerId)
    formData.append('owner_type', ownerType)
    formData.append('name', modelName.value)
    formData.append('nickname', modelNickName.value)
    formData.append('desc', modelDesc.value)
    formData.append('license', license.value)
    formData.append('visibility', visibility.value)

    const options = { method: 'POST', body: formData }
    hasCreateModel.value = true

    const response = await csrfFetch(modelCreateEndpoint, options)
    if (!response.ok) {
      hasCreateModel.value = false
      const data = await response.json()
      throw new Error(data.message)
    } else {
      return response.json()
    }
  }
  const toModelDetail = (path) => {
    window.location.pathname = `/models/${path}`
  }
  onMounted(() => {
    const params = new URLSearchParams(window.location.search)
    const result = props.namespaces.find(item => item[1] === params.get('orgName'));
    if (result) {
      owner.value = result[0]
    }
  })
</script>
