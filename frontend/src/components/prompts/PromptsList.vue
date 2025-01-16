<template>
  <PromptsBreadCrumbs
    :title="repo.nickname || repo.name"
    :namespace="namespace"
    :name="name"
    firstHref="/prompts/library"
    firstHrefName="prompts.promptLibrary"
    class="sticky top-0 md:top-[60px] bg-white left-0 z-10"
  />
  <div
    class="w-full text-gray-900 flex flex-col gap-5 p-8 md:p-1 md:px-12 sm:px-5"
    v-loading="loading"
  >
    <div
      class="flex flex-col gap-4"
      v-if="repo"
    >
      <div class="text-2xl font-medium md:mt-5">
        {{ repo.nickname || repo.name }}
      </div>
      <div class="text-sm text-gray-500">{{ repo.description }}</div>
      <div
        class="flex text-sm text-gray-500 items-center"
        v-if="theModels.length"
      >
        <span class="min-w-[max-content] text-md text-gray-700">
          {{ $t('prompts.relationModel') }}
        </span>
        <div class="flex items-center gap-3 w-full flex-wrap overflow-hidden">
          <a
            v-for="model in theModels"
            :href="`/models/${model.path}`"
          >
            <p
              class="rounded-md text-sm text-gray-900 border border-gray-300 bg-white py-1 px-2 hover:bg-gray-50"
            >
              {{ model.path }}
            </p>
          </a>
          <div
            v-if="models.more"
            class="cursor-pointer hover:text-blue-700"
          >
            <div
              @click="models.isExpanded = !models.isExpanded"
              v-show="!models.isExpanded"
            >
              {{ $t('prompts.openUp') }}
              <el-icon>
                <arrow-down />
              </el-icon>
            </div>
            <div
              @click="models.isExpanded = !models.isExpanded"
              v-show="models.isExpanded"
            >
              {{ $t('prompts.closeUp') }}
              <el-icon>
                <arrow-up />
              </el-icon>
            </div>
          </div>
        </div>
      </div>

      <div class="flex gap-3 items-center">
        <a
          class="flex gap-2 items-center text-sm text-gray-700 leading-4 hover:underline cursor-pointer"
          v-if="repo.user"
          :href="`/profile/${repo.user.username}`"
        >
          <el-avatar
            :size="24"
            :src="repo.user.avatar || 'https://cdn.casbin.org/img/casbin.svg'"
          ></el-avatar>
          {{ repo.user.username || '' }}
        </a>
        <SvgIcon
          v-if="repo.user"
          name="prompts_pipe"
        />
        <div
          v-if="repo.updated_at"
          class="text-sm flex gap-1 leading-4 text-gray-500"
        >
          <SvgIcon name="clock" />
          {{ $t('prompts.updateAt')
          }}{{ repo.updated_at.substring(0, 10) || '' }}
        </div>
      </div>
    </div>
    <div class="flex xl:flex-col gap-4 justify-between !text-md !leading-4">
      <div class="flex md:flex-col gap-4 flex-wrap">
        <ElInput
          v-model="nameFilterInput"
          class="!w-[320px] md:!w-full inputResponsive !h-[40px]"
          size="large"
          :placeholder="$t('prompts.placeholder')"
          :prefix-icon="Search"
          @change="filterChange"
        />
        <div class="flex gap-4 md:justify-between">
          <el-select
            v-model="langFilterInput"
            @change="filterChange"
            :placeholder="$t('prompts.placeholderLang')"
            size="large"
            class="!w-[180px] md:!w-1/2"
          >
            <el-option
              v-for="item in langOptions"
              :key="item.id"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-select
            v-model="tagFilterInput"
            @change="filterChange"
            :placeholder="$t('prompts.placeholderTag')"
            size="large"
            class="!w-[180px] md:!w-1/2"
          >
            <el-option
              v-for="item in tagOptions"
              :key="item.id"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </div>
      <div class="flex gap-4 !text-gray-700">
        <CsgButton
          v-if="repo.can_manage"
          :loading="loading"
          class="btn btn-secondary-gray btn-md"
          @click="changeCurrentComponent('newPromptsList')"
          svgName="create_org_repo"
          :name="$t('prompts.newPromptsList')"
        />
        <CsgButton
          v-if="repo.can_manage"
          class="btn btn-secondary-gray btn-md"
          @click="changeCurrentComponent('promptsListSettings')"
          svgName="setting"
          :name="$t('prompts.settings')"
        />
      </div>
    </div>
    <div class="grid grid-cols-3 xl:grid-cols-1 gap-4">
      <PromptsCard
        v-for="prompt in filteredData"
        :key="prompt.id"
        :prompt="prompt"
        :path="repo.path"
        :filePath="prompt.file_path"
        :canManage="repo.can_manage"
        @setPromptsDetails="setPromptsDetails"
      />
    </div>
    <div
      v-if="!loading && filteredData.length === 0"
      class="flex flex-col w-full justify-center items-center text-center h-[450px] text-gray-500 pt-5 gap-4"
    >
      <SvgIcon v-if="repo.can_manage" name="prompts_bg_user" class="cursor-pointer" />
      <SvgIcon v-else name="prompts_bg" />
      <div class="mt-4 text-gray-700">{{ $t('prompts.noPrompt') }}</div>
      <CsgButton
        v-if="repo.can_manage"
        @click="changeCurrentComponent('newPrompt')"
        class="btn btn-primary btn-lg"
        svgName="create_prompt"
        :name="$t('prompts.newPrompt')"
      />
    </div>
    <CsgPagination
    <CsgPagination
      :perPage="perPage"
      :currentPage="currentPage"
      @currentChange="filterPrompts"
      :total="totalPrompts"
    />
  </div>
</template>

<script setup>
  import { ref, onMounted, computed, nextTick } from 'vue'
  import useFetchApi from '../../packs/useFetchApi'
  import { ElMessage } from 'element-plus'
  import PromptsCard from './PromptsCard.vue'
  import PromptsBreadCrumbs from './PromptsBreadCrumbs.vue'
  import { Search } from '@element-plus/icons-vue'
  import CsgPagination from '../shared/CsgPagination.vue'
  import { useLangOptions, useTagOptions } from './promptsOptions'
import CsgButton from '../shared/CsgButton.vue'

  const perPage = ref(24)
  const currentPage = ref(1)
  const loading = ref(true)
  const nameFilterInput = ref('')
  const repo = ref({})
  const models = ref({ data: [] })
  const promptsListData = ref([])
  const filteredData = ref([])
  const totalPrompts = ref(0)
  const langFilterInput = ref('')
  const tagFilterInput = ref('')
  const langOptions = ref(useLangOptions())
  const tagOptions = ref(useTagOptions())

  const props = defineProps({
    namespace: String,
    name: String
  })

  const emit = defineEmits(['changeCurrentComponent', 'setPromptsDetails' , 'setRelationsModels'])
  const changeCurrentComponent = (currentComponent) => {
    emit('changeCurrentComponent', currentComponent)
  }

  const setPromptsDetails = (promptsDetails, currentComponent = null) => {
    emit('setPromptsDetails', promptsDetails, currentComponent)
  }

  const setRelationsModels = (relationsModels) => {
    emit('setRelationsModels', relationsModels)
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const theModels = computed(() => {
    if (models.value.data) {
      return models.value.data.length <= 6 || models.value.isExpanded
        ? models.value.data
        : models.value.data.slice(0, 6)
    } else {
      return []
    }
  })

  const filteredPrompts = computed(() => {
    const lowerCaseQuery = nameFilterInput.value.toLowerCase()
    return promptsListData.value.filter((prompt) => {
      const matchesTitle = prompt.title.toLowerCase().includes(lowerCaseQuery)
      const matchesLang = langFilterInput.value
        ? prompt.language === langFilterInput.value
        : true
      const matchesTag = tagFilterInput.value
        ? prompt.tags.includes(tagFilterInput.value)
        : true
      return matchesTitle && matchesLang && matchesTag
    })
  })

  const filterChange = () => {
    currentPage.value = 1
    updateFilteredData()
    scrollToTop()
  }

  const updateFilteredData = async () => {
    const start = (currentPage.value - 1) * perPage.value
    const end = currentPage.value * perPage.value
    filteredData.value = []
    await nextTick()
    filteredData.value = filteredPrompts.value.slice(start, end)
    totalPrompts.value = filteredPrompts.value.length
  }

  const filterPrompts = (page) => {
    currentPage.value = page
    updateFilteredData()
    scrollToTop()
  }

  const fetchPromptsList = async () => {
    loading.value = true
    const { data, error } = await useFetchApi(
      `/prompts/${props.namespace}/${props.name}`
    ).json()
    if (error.value) {
      ElMessage({ message: error.value.msg, type: 'warning' })
    } else {
      promptsListData.value = data.value.data.prompts || []
      repo.value = data.value.data.detail
      setPromptsDetails(repo.value)
      updateFilteredData()
    }
    loading.value = false
  }

  const fetchModels = async () => {
    const { data, error } = await useFetchApi(
      `/prompts/${props.namespace}/${props.name}/relations`
    ).json()
    if (error.value) {
      ElMessage({ message: error.value.msg, type: 'warning' })
    } else {
      if (data.value.data.models) {
        const { data: modelsData } = data.value;
        models.value.data = modelsData.models
      }
      setRelationsModels(models.value.data)
      const length = models.value.data.length
      models.value.more = length > 6
      models.value.isExpanded = length <= 6
    }
  }

  onMounted(() => {
    fetchPromptsList()
    fetchModels()
  })
</script>

<style scoped>
  .inputResponsive {
    @media (min-width: 826px) and (max-width: 999px) {
      width: clamp(
        180px,
        calc(180px + (280 - 180) * ((100vw - 826px) / (999 - 826))),
        280px
      ) !important;
    }
  }
  
  :deep(.el-select) {
    --el-component-size-large: 44px !important;
  }
  
  :deep(.el-select .el-input) {
    height: 44px !important;
  }
  
  :deep(.el-select .el-input__wrapper) {
    height: 44px !important;
    line-height: 44px !important;
    padding: 0 16px !important;
  }
  
  :deep(.el-select .el-input__inner) {
    height: 44px !important;
    line-height: 44px !important;
  }
  
  :deep(.el-select:not(.el-select--large) .el-input__wrapper) {
    height: 44px !important;
  }
  
  :deep(.el-select__popper .el-select-dropdown__item) {
    height: 44px !important;
    line-height: 44px !important;
  }
  
  :deep(.btn-prev) {
    border-radius: 6px 0 0 6px;
    margin: 0 !important;
    background: #ffffff !important;
    border: 1px solid #d0d5dd;
  }
  :deep(.btn-next) {
    border-radius: 0 6px 6px 0;
    margin: 0 !important;
    background: #ffffff !important;
    border: 1px solid #d0d5dd;
  }
  :deep(.el-pager li) {
    margin: 0 !important;
    background-color: #ffffff !important;
    border: 1px solid #d0d5dd;
    border-right: none;
    color: #182230 !important;
  }
  :deep(.el-pager li:first-child) {
    border-left: none;
  }
  :deep(.el-pager li.is-active) {
    background-color: #f9fafb !important;
    color: #182230 !important;
  }
</style>
