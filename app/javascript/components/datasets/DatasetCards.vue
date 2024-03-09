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
        type="dataset"
      />
    </div>
    <div class="pr-[20px] mlg:px-[20px] xl:w-full">
      <div class="flex xl:flex-col justify-between">
        <h3 class="text-[20px] text-[#303133] flex items-center gap-[8px]">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path opacity="0.12" d="M9 16.5C12.7279 16.5 15.75 15.4926 15.75 14.25V3.75C15.75 3.75 15.375 6 9 6C2.625 6 2.25 3.75 2.25 3.75V14.25C2.25 15.4926 5.27208 16.5 9 16.5Z" fill="#1F75CB"/>
            <path d="M15.75 9C15.75 10.2426 12.7279 11.25 9 11.25C5.27208 11.25 2.25 10.2426 2.25 9M15.75 3.75C15.75 4.99264 12.7279 6 9 6C5.27208 6 2.25 4.99264 2.25 3.75M15.75 3.75C15.75 2.50736 12.7279 1.5 9 1.5C5.27208 1.5 2.25 2.50736 2.25 3.75M15.75 3.75V14.25C15.75 15.4926 12.7279 16.5 9 16.5C5.27208 16.5 2.25 15.4926 2.25 14.25V3.75" stroke="#1F75CB" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>{{ $t('datasets.title') }} <span class="text-gray-400 text-[16px] italic"> {{ totalDatasets }} </span></span>
        </h3>
        <div class="xl:mt-[16px]">
          <ElInput
            v-model="nameFilterInput"
            class="!w-[320px] mr-[16px] xl:!w-[260px] sm:!w-[calc(100%-136px)]"
            size="large"
            :placeholder="this.$t('datasets.placeholder')"
            :prefix-icon="Search"
            @change = "reloadDatasets"
          />
          <el-select v-model="sortSelection"
                     @change="reloadDatasets"
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
        <DatasetItem v-for="dataset in datasetsData" :dataset="dataset" />
      </div>
      <div v-show="totalDatasets > perPage">
        <el-pagination background
                      v-model:current-page="currentPage"
                      :default-current-page=1
                      :total="totalDatasets"
                      :page-size="16"
                      layout="prev, pager, next"
                      @update:current-page="reloadDatasets"
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
  import DatasetItem from './DatasetItem.vue'
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
  const totalDatasets = ref(0)
  const taskTag = ref('')
  const frameworkTag = ref('')
  const licenseTag = ref('')
  const datasetsData = ref(Array)
  const placeholder = ref('');
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
    reloadDatasets()
  }

  const reloadDatasets = () => {
    let url = "/internal_api/datasets"
    url = url + `?page=${currentPage.value}`
    url = url + `&per_page=${perPage.value}`
    url = url + `&search=${nameFilterInput.value}`
    url = url + `&sort=${sortSelection.value}`
    url = url + `&task_tag=${taskTag.value}`
    url = url + `&framework_tag=${frameworkTag.value}`
    url = url + `&license_tag=${licenseTag.value}`
    loadDatasets(url)
  }

  async function loadDatasets(url) {
    const response = await fetch(url);

    if (!response.ok) {
      ElMessage({
        message: "加载数据集数据报错",
        type: 'warning'
      })
    } else {
      response.json().then((data) => {
        datasetsData.value = data['datasets']
        totalDatasets.value = data['total']
      })
    }
  }

  onMounted(() => {
    if (!props.selectedTag) {
      const url = `/internal_api/datasets?page=${currentPage.value}&per_page=${perPage.value}`
      loadDatasets(url)
    }
  })
</script>