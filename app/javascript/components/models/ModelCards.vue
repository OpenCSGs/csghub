<template>
  <div class="flex gap-[24px] max-w-[1280px] mb-[60px] m-auto mt-[32px]">
    <div class="w-[30%] min-w-[360px] xl:px-[20px] mlg:hidden">
      <TagSidebar
        :taskTags="props.taskTags"
        :frameworkTags="props.frameworkTags"
        :licenseTags="props.licenseTags"
        :selectedTag="props.selectedTag"
        :selectedTagType="props.selectedTagType"
        @resetTags="resetTags"
        type="model"
      />
    </div>
    <div class="pr-[20px] mlg:px-[20px] xl:w-full">
      <div class="flex xl:flex-col justify-between">
        <h3 class="text-[20px] text-[#303133] flex items-center gap-[8px]">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path opacity="0.12" d="M16.5 10.0327V5.46176C16.5 5.33063 16.4312 5.20911 16.3188 5.14164C16.1996 5.07018 16.0507 5.07075 15.9321 5.14313L11.5012 7.84833C10.5927 8.40303 10.1384 8.68038 9.65249 8.78865C9.22277 8.88441 8.77723 8.88441 8.34751 8.78865C7.86162 8.68038 7.40734 8.40303 6.49878 7.84833L2.06785 5.14313C1.9493 5.07075 1.80036 5.07018 1.68125 5.14164C1.5688 5.20911 1.5 5.33063 1.5 5.46176V10.0327C1.5 11.0237 1.5 11.5192 1.64219 11.9645C1.76802 12.3585 1.97396 12.7222 2.24708 13.0328C2.55572 13.3838 2.98062 13.6388 3.83042 14.1486L6.53042 15.7686C7.42832 16.3074 7.87727 16.5768 8.35653 16.682C8.78046 16.7751 9.21954 16.7751 9.64346 16.682C10.1227 16.5768 10.5717 16.3074 11.4696 15.7686L14.1696 14.1486C15.0194 13.6388 15.4443 13.3838 15.7529 13.0328C16.026 12.7222 16.232 12.3585 16.3578 11.9645C16.5 11.5192 16.5 11.0237 16.5 10.0327Z" fill="#AD4A3B"/>
            <path d="M9 9.375L15.75 5.25M9 9.375L2.25 5.25M9 9.375V16.875M1.5 7.96771V10.0323C1.5 11.0233 1.5 11.5188 1.64219 11.9641C1.76802 12.3581 1.97396 12.7218 2.24708 13.0324C2.55572 13.3834 2.98062 13.6384 3.83042 14.1483L6.53042 15.7683C7.42832 16.307 7.87727 16.5764 8.35653 16.6816C8.78046 16.7747 9.21954 16.7747 9.64346 16.6816C10.1227 16.5764 10.5717 16.307 11.4696 15.7683L14.1696 14.1483C15.0194 13.6384 15.4443 13.3834 15.7529 13.0324C16.026 12.7218 16.232 12.3581 16.3578 11.9641C16.5 11.5188 16.5 11.0233 16.5 10.0323V7.96771C16.5 6.97669 16.5 6.48117 16.3578 6.03593C16.232 5.64192 16.026 5.27818 15.7529 4.96757C15.4443 4.61657 15.0194 4.36163 14.1696 3.85175L11.4696 2.23175C10.5717 1.69301 10.1227 1.42364 9.64346 1.31839C9.21954 1.2253 8.78046 1.2253 8.35653 1.31839C7.87727 1.42364 7.42832 1.69301 6.53042 2.23175L3.83042 3.85175C2.98062 4.36163 2.55572 4.61657 2.24708 4.96757C1.97396 5.27818 1.76802 5.64192 1.64219 6.03593C1.5 6.48117 1.5 6.97669 1.5 7.96771Z" stroke="#AD4A3B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>{{ $t('models.title') }} <span class="text-gray-400 text-[16px] italic"> {{ totalModels }} </span></span>
        </h3>
        <div class="xl:mt-[16px]">
          <ElInput
            v-model="nameFilterInput"
            class="!w-[320px] mr-[16px] xl:!w-[260px] sm:!w-[calc(100%-136px)]"
            size="large"
            :placeholder="this.$t('models.placeholder')"
            :prefix-icon="Search"
            @change = "reloadModels"
          />
          <el-select v-model="sortSelection"
                     @change="reloadModels"
                     class="w-[200px] xl:w-[150px] xl:mr-[20px] sm:w-[120px] sm:mr-0"
                     size="large"
          >
            <el-option
              v-for="item in sortOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </div>
      <div class="w-[896px] xl:flex-col xl:w-full flex flex-wrap justify-between gap-y-4 mb-4 mt-[16px]">
        <repo-item v-for="model in modelsData" :repo="model" repo-type="model" />
      </div>
      <div v-show="totalModels > perPage">
        <el-pagination background
                      v-model:current-page="currentPage"
                      :default-current-page=1
                      :total="totalModels"
                      :page-size="16"
                      layout="prev, pager, next"
                      @update:current-page="reloadModels"
                      class="my-[52px] flex justify-center"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { Search } from '@element-plus/icons-vue'
  import { ElInput, ElMessage } from 'element-plus'
  import RepoItem from '../shared/RepoItem.vue'
  import TagSidebar from '../tags/TagSidebar.vue';
  import { useI18n } from 'vue-i18n'

  const props = defineProps({
    taskTags: String,
    frameworkTags: String,
    licenseTags: String,
    selectedTag: String,
    selectedTagType: String
  })

  const { t } = useI18n();
  const nameFilterInput = ref('')
  const sortSelection = ref('recently_update')
  const currentPage = ref(1)
  const perPage = ref(16)
  const totalModels = ref(0)
  const taskTag = ref('')
  const frameworkTag = ref('')
  const licenseTag = ref('')
  const modelsData = ref(Array)
  const sortOptions = [
                        {
                          value: 'recently_update',
                          label: t('all.recentlyUpdate')
                        },
                        {
                          value: 'trending',
                          label: t('all.trending')
                        },
                        {
                          value: 'most_download',
                          label: t('all.mostDownload')
                        },
                        {
                          value: 'most_favorite',
                          label: t('all.mostFavorite')
                        },
                      ]

  const resetTags = (task, framework, license) => {
    taskTag.value = task
    frameworkTag.value = framework
    licenseTag.value = license
    reloadModels()
  }

  const reloadModels = () => {
    let url = "/internal_api/models"
    url = url + `?page=${currentPage.value}`
    url = url + `&per_page=${perPage.value}`
    url = url + `&search=${nameFilterInput.value}`
    url = url + `&sort=${sortSelection.value}`
    url = url + `&task_tag=${taskTag.value}`
    url = url + `&framework_tag=${frameworkTag.value}`
    url = url + `&license_tag=${licenseTag.value}`
    loadModels(url)
  }

  async function loadModels(url) {
    const response = await fetch(url);

    if (!response.ok) {
      ElMessage({
        message: "加载模型数据报错",
        type: 'warning'
      })
    } else {
      response.json().then((data) => {
        modelsData.value = data['models']
        totalModels.value = data['total']
      })
    }
  }

  onMounted(() => {
    if (!props.selectedTag) {
      const url = `/internal_api/models?page=${currentPage.value}&per_page=${perPage.value}`
      loadModels(url)
    }
  })
</script>