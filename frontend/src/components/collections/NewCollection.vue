<template>
  <div class="w-[640px] m-auto flex flex-col items-center md:w-full md:p-5">
    <div>
      <SvgIcon name="new_collection" />
    </div>
    <h3 class="text-gray-700 text-xl font-medium mt-6 mb-2">
      {{ $t('collections.newCollection.title') }}
    </h3>
    <p class="text-gray-500 text-base font-normal md:text-center">
      {{ $t('collections.newCollection.titleDesc') }}
    </p>
    <div class="mt-9">
      <el-form
        ref="dataFormRef"
        :model="dataForm"
        :rules="rules"
        label-position="top"
        class="mt-[48px] text-left"
      >
        <!-- First row -->
        <div class="w-full flex sm:flex-col gap-2 mb-9 md:gap-9">
          <el-form-item class="flex-1" :label="t('collections.newCollection.owner')" prop="owner">
            <el-select
              v-model="dataForm.owner"
              :placeholder="$t('all.select')"
              size="large"
              class="!w-full"
            >
              <el-option
                v-for="item in namespaces()"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <div class="md:hidden">
            <p class="h-8"></p>
            <p class="text-gray-500 text-xl font-light">/</p>
          </div>
          <el-form-item class="flex-1" :label="t('collections.newCollection.collectionName')" prop="title">
            <el-input
              v-model="dataForm.title"
              :placeholder="$t('rule.collectionNameRule')"
              class="!w-full"
            >
              <template #suffix>
                <InputTip :content="$t('collections.newCollection.tip')" />
              </template>
            </el-input>
          </el-form-item>
        </div>
        <!-- Second row -->
        <div class="w-full flex sm:flex-col gap-2 mb-9 md:gap-9">
          <div class="flex-1">
            <p class="text-gray-700 text-sm mb-2">
              {{ $t('collections.newCollection.collectionNickName') }}
            </p>
            <el-form-item prop="collectionNickName">
              <el-input
                v-model="dataForm.collectionNickName"
                :placeholder="$t('all.inputNickNamePlc')"
                class="!w-full"
              />
            </el-form-item>
          </div>
          <div class="flex-1">
            <p class="text-gray-700 text-sm mb-2">
              {{ $t('collections.newCollection.selectTheme') }}
            </p>
            <el-form-item prop="colorName">
              <el-select
                v-model="dataForm.colorName"
                :placeholder="$t('all.select')"
                size="large"
                class="!w-full"
              >
                <el-option
                  v-for="item in colorNameList"
                  :key="item[0]"
                  :label="item[1]"
                  :value="item[0]"
                />
                <template #prefix>
                  <div
                    class="w-4 h-4 border"
                    :style="{ backgroundColor: dataForm.colorName }"
                  ></div>
                </template>
              </el-select>
            </el-form-item>
          </div>
        </div>
        <!-- Third row -->
        <div class="w-full flex sm:flex-col mb-9">
          <div class="flex-1">
            <p class="text-gray-700 text-sm mb-2">
              {{ $t('collections.newCollection.collectionDesc') }}
            </p>
            <el-form-item prop="collectionDesc">
              <el-input
                v-model="dataForm.collectionDesc"
                :rows="6"
                type="textarea"
                :placeholder="$t('all.inputDescPlc')"
              />
            </el-form-item>
          </div>
        </div>
        <!-- Fourth row -->
        <div class="mb-9">
          <el-form-item prop="visibility">
            <PublicAndPrivateRadioGroup
              v-model="dataForm.visibility"
              :publicDesc="t('collections.newCollection.publicDesc')"
              :privateDesc="t('collections.newCollection.privateDesc')"
            /> 
          </el-form-item>
        </div>
      </el-form>
      <div class="flex justify-end w-full">
        <el-form-item>
          <CsgButton
            class="btn btn-primary btn-md"
            :name="$t('collections.newCollection.createCollection')"
            @click="createCollection"
          />
        </el-form-item>
      </div>
    </div>
  </div>
</template>

<script setup>
  import InputTip from '../shared/inputs/InputTip.vue'
  import { ref, computed, inject, onMounted } from 'vue'
  import { useI18n } from 'vue-i18n'
  import useFetchApi from '../../packs/useFetchApi'
  import { ElMessage } from 'element-plus'
  import PublicAndPrivateRadioGroup from '../shared/form/PublicAndPrivateRadioGroup.vue'
  import useUserStore from '../../stores/UserStore.js'

  const userStore = useUserStore()

  const { t } = useI18n()
  const dataFormRef = ref()
  const nameRule = inject('nameRule')

  const hasCreateCollection = ref(false)
  const colorNameList = ref([
    ['#F5F3FF', t('collections.color.lPurple')],
    ['#ECFDF3', t('collections.color.lGreen')],
    ['#FFF4ED', t('collections.color.lOrange')]
  ])
  const dataForm = ref({
    owner: '',
    visibility: 'public',
    colorName: colorNameList.value[0][0]
  })
  const rules = ref({
    owner: [
      {
        required: true,
        message: t('all.pleaseSelect', { value: t('collections.newCollection.owner') }),
        trigger: 'change'
      }
    ],
    title: [
      { required: true, message: t('collections.newCollection.validation1'), trigger: 'blur' },
      { min: 2, max: 70, message: t('collections.newCollection.validation2'), trigger: 'blur' },
      // Starts with a letter
      { pattern: /^[a-zA-Z]/, message: t('rule.startWithLetter'), trigger: 'blur' },
      // Ends with a letter or number
      { pattern: /[a-zA-Z0-9]$/, message: t('rule.endWithLetterOrNumber'), trigger: 'blur' },
      // Only contains letters, numbers, and -_.
      {
        pattern: /^[a-zA-Z0-9-_\.]+$/,
        message: t('rule.onlyLetterNumberAndSpecialStr'),
        trigger: 'blur'
      },
      // Special characters cannot appear consecutively
      { pattern: /^(?!.*[-_.]{2,}).*$/, message: t('rule.specialStrNotTogether'), trigger: 'blur' },
      // As a final step, add the final regex rule
      { pattern: nameRule, message: t('rule.nameRule'), trigger: 'blur' }
    ]
  })

  const createCollection = () => {
    if (!dataForm.value) return
    dataFormRef.value.validate((valid) => {
      if (valid) {
        submitCollectionForm()
      }
    })
  }

  // Methods
  const namespaces = () => {
    let namespaces = userStore.orgs.map((org) => org.path)
    namespaces.unshift(userStore.username)
    const params = new URLSearchParams(window.location.search)
    const orgName = params.get('orgName')
    dataForm.value.owner = orgName || namespaces[0]
    return namespaces
  }

  async function submitCollectionForm() {
    const transformedData = {
      description: '',
      name: '',
      nickname: '',
      private: true,
      theme: '#000000'
    }
    // dataFormValue value to transformedData
    // Only pass the namespace if it is an organization
    if(dataForm.value.owner !== userStore.username){
      transformedData.namespace = dataForm.value.owner
    }
    transformedData.description = dataForm.value.collectionDesc
    transformedData.name = dataForm.value.title
    transformedData.nickname = dataForm.value.collectionNickName
    transformedData.private = dataForm.value.visibility === 'private' // 根据需要进行布尔值转换
    transformedData.theme = dataForm.value.colorName

    const options = { body: JSON.stringify(transformedData) }
    hasCreateCollection.value = true

    const { data, error } = await useFetchApi('/collections', options).post().json()

    if (error.value) {
      hasCreateCollection.value = false
      ElMessage.warning(error.value.msg)
    } else {
      hasCreateCollection.value = false
      ElMessage.success(t('collections.newCollection.createSuccess'))
      toCollectionDetail(data.value.data.id)
      return data.value
    }
  }

  const toCollectionDetail = (path) => {
    window.location.pathname = `/collections/${path}`
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
    margin-top: 8px;
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
