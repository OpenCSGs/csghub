<template>
  <div class="w-[640px] m-auto flex flex-col items-center md:w-full md:p-5">
    <div>
      <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36" fill="none">
        <path opacity="0.12" d="M18 33C25.4558 33 31.5 30.9853 31.5 28.5V7.5C31.5 7.5 30.75 12 18 12C5.25 12 4.5 7.5 4.5 7.5V28.5C4.5 30.9853 10.5442 33 18 33Z" fill="#1F75CB"/>
        <path d="M31.5 18C31.5 20.4853 25.4558 22.5 18 22.5C10.5442 22.5 4.5 20.4853 4.5 18M31.5 7.5C31.5 9.98528 25.4558 12 18 12C10.5442 12 4.5 9.98528 4.5 7.5M31.5 7.5C31.5 5.01472 25.4558 3 18 3C10.5442 3 4.5 5.01472 4.5 7.5M31.5 7.5V28.5C31.5 30.9853 25.4558 33 18 33C10.5442 33 4.5 30.9853 4.5 28.5V7.5" stroke="#1F75CB" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
    <h3 class="text-[#303133] text-xl font-semibold mt-6 mb-3">新建数据集仓库</h3>
    <p class="text-[#606266] text-base font-medium md:text-center">仓库包含所有的数据集文件和修订的历史记录</p>
    <div class="mt-9">
      <div class="w-full flex sm:flex-col gap-2 mb-9 md:gap-9">
        <div>
          <p class="text-[#303133] text-sm mb-2">所有者</p>
          <el-select v-model="owner" placeholder="选择" size="large">
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
          <p class="text-[#303133] text-sm mb-2">数据集名称</p>
          <el-input v-model="datasetName" placeholder="2-20个字母数字_-的字符串，_-不能并列出现" input-style="width: 100%" />
        </div>
      </div>
      <div class="mb-9">
        <p class="text-[#303133] text-sm mb-2">License</p>
        <el-select v-model="license" placeholder="选择" size="large">
          <el-option
            v-for="item in licenses"
            :key="item[0]"
            :label="item[1]"
            :value="item[0]"
          />
        </el-select>
      </div>
      <hr class="mb-9" />
      <div class="mb-9">
        <el-radio-group v-model="visibility" class="!block">
          <el-radio class="w-full mr-0 mb-9 !rounded-xl !h-auto !items-start !p-4 bg-[#F9FAFB]" label="public" size="large" border disabled>
            公开
            <p class="whitespace-normal text-[#475467] font-light">任何互联网上的人都可以看到这个仓库。只有你（个人）或你所在组织的成员可以提交。</p>
          </el-radio>
          <el-radio class="w-full mr-0 !rounded-xl !h-auto !items-start !p-4" label="private" size="large" border>
            私有
            <p class="whitespace-normal text-[#475467] font-light">只有你（个人）或你所在组织的成员可以看到并提交到这个仓库。</p>
          </el-radio>
        </el-radio-group>
      </div>
      <hr class="mb-9" />
      <p class="mb-9 rounded bg-[#F0F3FF] text-[#4D6AD6] text-[13px] py-[9px] px-4">
        <span> 创建数据集后，你可以使用网页或 Git 上传你的文件。 </span>
        <br />
        <span> 暂不支持创建公开的数据集，如有需要可以联系管理员进行人工审核。</span>
      </p>
      <div class="flex justify-end">
        <button
          class="bg-[#3250BD] w-[118px] h-9 rounded-lg text-white flex items-center justify-center border disabled:text-[#98A2B3] disabled:bg-[#F2F4F7] disabled:border-[#EAECF0]"
          @click="createDataset"
          :disabled="!canCreateDataset"
        >
          创建数据集
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
  :deep(.el-input) {
    width: 240px;
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
</style>

<script setup>
  import { ref, computed, defineProps } from 'vue'
  import { ElInput, ElMessage } from 'element-plus'
  import csrfFetch from "../../packs/csrfFetch.js"

  const props = defineProps({
    licenses: Array,
    namespaces: Array,
  })

  const license = ref(props.licenses[0][0])
  const owner = ref(props.namespaces[0][0])
  const datasetName = ref('')
  const visibility = ref('private')

  const canCreateDataset = computed(() => { return /^(?=.{2,20}$)(?!.*[_]{2})(?!.*[-]{2})[a-zA-Z0-9_-]+$/.test(datasetName.value) })

  const createDataset = async () => {
    try {
      const res = await submitDatasetForm()
      ElMessage.success('数据集创建成功')
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
    formData.append('license', license.value)
    formData.append('visibility', visibility.value)

    const options = { method: 'POST', body: formData }

    const response = await csrfFetch(datasetCreateEndpoint, options)
    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.message)
    } else {
      return response.json()
    }
  }

  const toDatasetDetail = (path) => {
    window.location.pathname = `/datasets/${path}`
  }
</script>
