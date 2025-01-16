<!-- 提示词库列表页面 -->
<template>
  <PromptsBreadCrumbs 
    firstHref="/prompts/library"
    firstHrefName="prompts.promptLibrary"
    class="sticky top-0 md:top-[60px] bg-white left-0 z-10"
  />
  <div
    class="w-full text-gray-900 p-8 md:p-1 md:pt-10 md:px-12 sm:px-5"
  >
    <div class="w-full flex md:items-start justify-between items-center mb-8 md:mb-4">
      <div class="text-2xl font-medium md:mb-5">{{ $t('prompts.promptLibrary')}}</div>
      <div class="flex gap-4">
        <ElInput
          v-model="nameFilterInput"
          class="!w-64 xl:!w-56 md:!w-full md:!hidden"
          size="large"
          :placeholder="$t('prompts.placeholder')"
          :prefix-icon="Search"
          @change="filterChange"
        />
        <CsgButton
          v-if="userStore.isLoggedIn"
          :loading="loading"
          class="btn btn-secondary-gray btn-lg"
          @click="changeCurrentComponent('newPromptsList')"
          svgName="create_org_repo"
          :name="$t('prompts.newPromptsList')"
        />
      </div>   
    </div>
    <ElInput
          v-model="nameFilterInput"
          class="!w-64 xl:!w-56 md:!w-full !hidden md:!flex md:mb-4"
          size="large"
          :placeholder="$t('prompts.placeholder')"
          :prefix-icon="Search"
          @change="filterChange"
        />
    <div class="grid grid-cols-2 lg:grid-cols-1 gap-4" v-loading="loading">
      <PromptsDatasetsCard
        v-for="prompts in promptsData"
        :key="prompts.id"
        :promptsData="prompts"
      />
    </div>
    <div
      v-if="!loading && promptsData.length === 0"
      class="w-full text-center text-gray-500 pt-5"
    >
      No Data
    </div>
    <CsgPagination
      :perPage="perPage"
      :currentPage="currentPage"
      @currentChange="fetchPromptsIndex"
      :total="totalPrompts"
    />
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import PromptsDatasetsCard from './PromptsDatasetsCard.vue'
  import PromptsBreadCrumbs from './PromptsBreadCrumbs.vue'
  import useFetchApi from '../../packs/useFetchApi'
  import { ElMessage } from 'element-plus'
  import { Search } from '@element-plus/icons-vue'
  import CsgPagination from '../shared/CsgPagination.vue'
  import useUserStore from '../../stores/UserStore.js'

  const userStore = useUserStore()
  const loading =ref(true)
  const nameFilterInput = ref('')
  const perPage = ref(16)
  const currentPage = ref(1)
  const promptsData = ref([])
  const totalPrompts = ref(0)

  const emit = defineEmits(['changeCurrentComponent'])
  const changeCurrentComponent = (currentComponent) => {
    emit('changeCurrentComponent', currentComponent)
  }

  const filterChange = () => {
    currentPage.value = 1
    loading.value = true
    fetchPromptsIndex()
  }

  const fetchPromptsIndex = async (childCurrent) => {
    if (childCurrent) {
      currentPage.value = childCurrent
    }
    const params = new URLSearchParams()
    params.append('per', perPage.value)
    params.append('page', currentPage.value)
    params.append('search', nameFilterInput.value)
    const url = `/prompts?${params.toString()}`
    const { data, error } = await useFetchApi(url).json()
    if (error.value) {
      ElMessage({ message: error.value.msg, type: 'warning' })
      loading.value = false
    } else {
      const res = data.value
      promptsData.value = res.data || []
      totalPrompts.value = res.total
      loading.value = false
    }
  }

  onMounted(() => {
    fetchPromptsIndex()
  })
</script>
