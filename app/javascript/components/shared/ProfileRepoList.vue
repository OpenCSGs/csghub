<template>
  <div class="xl:px-[16px] sm:w-[100%] sm:mt-[36px]">
    <div>
      <h3 class="text-[20px] text-[#303133] flex items-center gap-[8px]">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path opacity="0.12" d="M16.5 10.0327V5.46176C16.5 5.33063 16.4312 5.20911 16.3188 5.14164C16.1996 5.07018 16.0507 5.07075 15.9321 5.14313L11.5012 7.84833C10.5927 8.40303 10.1384 8.68038 9.65249 8.78865C9.22277 8.88441 8.77723 8.88441 8.34751 8.78865C7.86162 8.68038 7.40734 8.40303 6.49878 7.84833L2.06785 5.14313C1.9493 5.07075 1.80036 5.07018 1.68125 5.14164C1.5688 5.20911 1.5 5.33063 1.5 5.46176V10.0327C1.5 11.0237 1.5 11.5192 1.64219 11.9645C1.76802 12.3585 1.97396 12.7222 2.24708 13.0328C2.55572 13.3838 2.98062 13.6388 3.83042 14.1486L6.53042 15.7686C7.42832 16.3074 7.87727 16.5768 8.35653 16.682C8.78046 16.7751 9.21954 16.7751 9.64346 16.682C10.1227 16.5768 10.5717 16.3074 11.4696 15.7686L14.1696 14.1486C15.0194 13.6388 15.4443 13.3838 15.7529 13.0328C16.026 12.7222 16.232 12.3585 16.3578 11.9645C16.5 11.5192 16.5 11.0237 16.5 10.0327Z" fill="#AD4A3B"/>
          <path d="M9 9.375L15.75 5.25M9 9.375L2.25 5.25M9 9.375V16.875M1.5 7.96771V10.0323C1.5 11.0233 1.5 11.5188 1.64219 11.9641C1.76802 12.3581 1.97396 12.7218 2.24708 13.0324C2.55572 13.3834 2.98062 13.6384 3.83042 14.1483L6.53042 15.7683C7.42832 16.307 7.87727 16.5764 8.35653 16.6816C8.78046 16.7747 9.21954 16.7747 9.64346 16.6816C10.1227 16.5764 10.5717 16.307 11.4696 15.7683L14.1696 14.1483C15.0194 13.6384 15.4443 13.3834 15.7529 13.0324C16.026 12.7218 16.232 12.3581 16.3578 11.9641C16.5 11.5188 16.5 11.0233 16.5 10.0323V7.96771C16.5 6.97669 16.5 6.48117 16.3578 6.03593C16.232 5.64192 16.026 5.27818 15.7529 4.96757C15.4443 4.61657 15.0194 4.36163 14.1696 3.85175L11.4696 2.23175C10.5717 1.69301 10.1227 1.42364 9.64346 1.31839C9.21954 1.2253 8.78046 1.2253 8.35653 1.31839C7.87727 1.42364 7.42832 1.69301 6.53042 2.23175L3.83042 3.85175C2.98062 4.36163 2.55572 4.61657 2.24708 4.96757C1.97396 5.27818 1.76802 5.64192 1.64219 6.03593C1.5 6.48117 1.5 6.97669 1.5 7.96771Z" stroke="#AD4A3B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>模型</span>
      </h3>
      <div v-if="hasModels" class="grid grid-cols-2 lg:grid-cols-1 gap-4 mb-4 mr-6 mt-[16px]">
        <model-item v-for="model in models.data" :model="model"></model-item>
      </div>
      <div v-else class="flex flex-wrap gap-4 mb-4 mt-[16px]">
          暂无数据
      </div>
      <view-more
        v-if="moreModels"
        target="models"
        @view-more-targets="viewMoreTargets"
      ></view-more>
      <el-skeleton class="pr-6" v-if="loading" :rows="2" animated />
    </div>
    <div class="mt-[32px]">
      <h3 class="text-[20px] text-[#303133] flex items-center gap-[8px]">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path opacity="0.12" d="M9 16.5C12.7279 16.5 15.75 15.4926 15.75 14.25V3.75C15.75 3.75 15.375 6 9 6C2.625 6 2.25 3.75 2.25 3.75V14.25C2.25 15.4926 5.27208 16.5 9 16.5Z" fill="#1F75CB"/>
          <path d="M15.75 9C15.75 10.2426 12.7279 11.25 9 11.25C5.27208 11.25 2.25 10.2426 2.25 9M15.75 3.75C15.75 4.99264 12.7279 6 9 6C5.27208 6 2.25 4.99264 2.25 3.75M15.75 3.75C15.75 2.50736 12.7279 1.5 9 1.5C5.27208 1.5 2.25 2.50736 2.25 3.75M15.75 3.75V14.25C15.75 15.4926 12.7279 16.5 9 16.5C5.27208 16.5 2.25 15.4926 2.25 14.25V3.75" stroke="#1F75CB" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>数据集</span>
      </h3>
      <div v-if="hasDatasets" class="grid grid-cols-2 lg:grid-cols-1 gap-4 mb-4 mr-6 mt-[16px]">
        <dataset-item v-for="dataset in datasets.data" :dataset="dataset"></dataset-item>
      </div>
      <div v-else class="flex flex-wrap gap-4 mb-4 mt-[16px]">
          暂无数据
      </div>
      <view-more
        v-if="moreDatasets"
        target="datasets"
        @view-more-targets="viewMoreTargets"
      ></view-more>
    </div>
  </div>
</template>

<script setup>
  import { computed, ref } from 'vue'
  import ModelItem from '../models/ModelItem.vue'
  import DatasetItem from '../datasets/DatasetItem.vue'
  import ViewMore from './ViewMore.vue'
import { ElSkeleton } from 'element-plus';

  const props = defineProps({
    modelList: Object,
    datasetList: Object,
    name: String
  })

  const models = ref(props.modelList)
  const datasets = ref(props.datasetList)
  const loading = ref(false)

  const hasModels = computed(() => props.modelList?.total > 0)
  const hasDatasets = computed(() => props.datasetList?.total > 0)

  const moreModels = ref(props.modelList?.total > 6)
  const moreDatasets = ref(props.datasetList?.total > 6)

  const viewMoreTargets = (target) => {
    loading.value = true
    if (target === 'models') {
      fetchMoreModels()
    } else if (target === 'datasets') {
      fetchMoreDatasets()
    }
  }

  const fetchMoreModels = async () => {
    const url = `/internal_api/users/${props.name}/models?per=${props.modelList.total}`
    await fetchData(url, models)
    moreModels.value = false
  }

  const fetchMoreDatasets = async () => {
    const url = `/internal_api/users/${props.name}/datasets?per=${props.datasetList.total}`
    await fetchData(url, datasets)
    moreDatasets.value = false
  }

  const fetchData = async (url, targetRef) => {
    fetch(url).then((response) => {
      response.json().then((data) => {
        targetRef.value = data
        loading.value = false
      }).catch((error) => {
        ElMessage({
          message: '加载数据报错',
          type: 'warning'
        })
      })
    })
  }
</script>
