<template>
  <div class="sm:w-[100%] sm:mt-[36px]">
    <!-- models -->
    <div>
      <h3 class="text-[20px] text-[#303133] flex items-center gap-[8px]">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path opacity="0.12" d="M16.5 10.0327V5.46176C16.5 5.33063 16.4312 5.20911 16.3188 5.14164C16.1996 5.07018 16.0507 5.07075 15.9321 5.14313L11.5012 7.84833C10.5927 8.40303 10.1384 8.68038 9.65249 8.78865C9.22277 8.88441 8.77723 8.88441 8.34751 8.78865C7.86162 8.68038 7.40734 8.40303 6.49878 7.84833L2.06785 5.14313C1.9493 5.07075 1.80036 5.07018 1.68125 5.14164C1.5688 5.20911 1.5 5.33063 1.5 5.46176V10.0327C1.5 11.0237 1.5 11.5192 1.64219 11.9645C1.76802 12.3585 1.97396 12.7222 2.24708 13.0328C2.55572 13.3838 2.98062 13.6388 3.83042 14.1486L6.53042 15.7686C7.42832 16.3074 7.87727 16.5768 8.35653 16.682C8.78046 16.7751 9.21954 16.7751 9.64346 16.682C10.1227 16.5768 10.5717 16.3074 11.4696 15.7686L14.1696 14.1486C15.0194 13.6388 15.4443 13.3838 15.7529 13.0328C16.026 12.7222 16.232 12.3585 16.3578 11.9645C16.5 11.5192 16.5 11.0237 16.5 10.0327Z" fill="#AD4A3B"/>
          <path d="M9 9.375L15.75 5.25M9 9.375L2.25 5.25M9 9.375V16.875M1.5 7.96771V10.0323C1.5 11.0233 1.5 11.5188 1.64219 11.9641C1.76802 12.3581 1.97396 12.7218 2.24708 13.0324C2.55572 13.3834 2.98062 13.6384 3.83042 14.1483L6.53042 15.7683C7.42832 16.307 7.87727 16.5764 8.35653 16.6816C8.78046 16.7747 9.21954 16.7747 9.64346 16.6816C10.1227 16.5764 10.5717 16.307 11.4696 15.7683L14.1696 14.1483C15.0194 13.6384 15.4443 13.3834 15.7529 13.0324C16.026 12.7218 16.232 12.3581 16.3578 11.9641C16.5 11.5188 16.5 11.0233 16.5 10.0323V7.96771C16.5 6.97669 16.5 6.48117 16.3578 6.03593C16.232 5.64192 16.026 5.27818 15.7529 4.96757C15.4443 4.61657 15.0194 4.36163 14.1696 3.85175L11.4696 2.23175C10.5717 1.69301 10.1227 1.42364 9.64346 1.31839C9.21954 1.2253 8.78046 1.2253 8.35653 1.31839C7.87727 1.42364 7.42832 1.69301 6.53042 2.23175L3.83042 3.85175C2.98062 4.36163 2.55572 4.61657 2.24708 4.96757C1.97396 5.27818 1.76802 5.64192 1.64219 6.03593C1.5 6.48117 1.5 6.97669 1.5 7.96771Z" stroke="#AD4A3B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>{{ $t('organization.model') }}</span>
      </h3>
      <div v-if="hasModels" class="grid grid-cols-2 xl:grid-cols-1 gap-4 mb-4 mt-[16px]">
        <repo-item v-for="model in models.data" :repo="model" repo-type="model"></repo-item>
      </div>
      <div v-else class="flex flex-wrap gap-4 mb-4 mt-[16px]">
        {{ $t('all.noData') }}
      </div>
      <view-more
        v-if="moreModels"
        target="models"
        @view-more-targets="viewMoreTargets"
      ></view-more>
      <el-skeleton class="pr-6" v-if="modelsLoading" :rows="2" animated />
    </div>

    <!-- datasets -->
    <div class="mt-[32px]">
      <h3 class="text-[20px] text-[#303133] flex items-center gap-[8px]">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path opacity="0.12" d="M9 16.5C12.7279 16.5 15.75 15.4926 15.75 14.25V3.75C15.75 3.75 15.375 6 9 6C2.625 6 2.25 3.75 2.25 3.75V14.25C2.25 15.4926 5.27208 16.5 9 16.5Z" fill="#1F75CB"/>
          <path d="M15.75 9C15.75 10.2426 12.7279 11.25 9 11.25C5.27208 11.25 2.25 10.2426 2.25 9M15.75 3.75C15.75 4.99264 12.7279 6 9 6C5.27208 6 2.25 4.99264 2.25 3.75M15.75 3.75C15.75 2.50736 12.7279 1.5 9 1.5C5.27208 1.5 2.25 2.50736 2.25 3.75M15.75 3.75V14.25C15.75 15.4926 12.7279 16.5 9 16.5C5.27208 16.5 2.25 15.4926 2.25 14.25V3.75" stroke="#1F75CB" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>{{ $t('organization.dataset') }}</span>
      </h3>
      <div v-if="hasDatasets" class="grid grid-cols-2 xl:grid-cols-1 gap-4 mb-4 mt-[16px]">
        <repo-item v-for="dataset in datasets.data" :repo="dataset" repo-type="dataset"></repo-item>
      </div>
      <div v-else class="flex flex-wrap gap-4 mb-4 mt-[16px]">
        {{ $t('all.noData') }}
      </div>
      <view-more
        v-if="moreDatasets"
        target="datasets"
        @view-more-targets="viewMoreTargets"
      ></view-more>
      <el-skeleton class="pr-6" v-if="datasetsLoading" :rows="2" animated />
    </div>

    <!-- code repo -->
    <div class="mt-[32px]">
      <h3 class="text-[20px] text-[#303133] flex items-center gap-[8px]">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect opacity="0.12" x="1.5" y="1.5" width="15" height="15" rx="5" fill="#4E5BA6"/>
          <path d="M7.5 6L4.5 9L7.5 12M10.5 6L13.5 9L10.5 12M9 16.5V16.5C11.3297 16.5 12.4946 16.5 13.4134 16.1194C14.6386 15.6119 15.6119 14.6386 16.1194 13.4134C16.5 12.4946 16.5 11.3297 16.5 9V9C16.5 6.67029 16.5 5.50544 16.1194 4.58658C15.6119 3.36144 14.6386 2.38807 13.4134 1.8806C12.4946 1.5 11.3297 1.5 9 1.5V1.5C6.67029 1.5 5.50544 1.5 4.58658 1.8806C3.36144 2.38807 2.38807 3.36144 1.8806 4.58658C1.5 5.50544 1.5 6.67029 1.5 9V9C1.5 11.3297 1.5 12.4946 1.8806 13.4134C2.38807 14.6386 3.36144 15.6119 4.58658 16.1194C5.50544 16.5 6.67029 16.5 9 16.5Z" stroke="#4E5BA6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>{{ $t('organization.code') }}</span>
      </h3>
      <div v-if="hasCodes" class="grid grid-cols-2 xl:grid-cols-1 gap-4 mb-4 mt-[16px]">
        <repo-item v-for="code in codes.data" :repo="code" repo-type="code"></repo-item>
      </div>
      <div v-else class="flex flex-wrap gap-4 mb-4 mt-[16px]">
        {{ $t('all.noData') }}
      </div>
      <view-more
        v-if="moreCodes"
        target="codes"
        @view-more-targets="viewMoreTargets"
      ></view-more>
      <el-skeleton class="pr-6" v-if="codeLoading" :rows="2" animated />
    </div>

    <!-- spaces -->
    <div class="mt-[32px]">
      <h3 class="text-[20px] text-[#303133] flex items-center gap-[8px]">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g opacity="0.12">
          <path d="M1.5 4.5C1.5 3.56812 1.5 3.10218 1.65224 2.73463C1.85523 2.24458 2.24458 1.85523 2.73463 1.65224C3.10218 1.5 3.56812 1.5 4.5 1.5C5.43188 1.5 5.89782 1.5 6.26537 1.65224C6.75542 1.85523 7.14477 2.24458 7.34776 2.73463C7.5 3.10218 7.5 3.56812 7.5 4.5C7.5 5.43188 7.5 5.89782 7.34776 6.26537C7.14477 6.75542 6.75542 7.14477 6.26537 7.34776C5.89782 7.5 5.43188 7.5 4.5 7.5C3.56812 7.5 3.10218 7.5 2.73463 7.34776C2.24458 7.14477 1.85523 6.75542 1.65224 6.26537C1.5 5.89782 1.5 5.43188 1.5 4.5Z" fill="#7A5AF8"/>
          <path d="M1.5 13.5C1.5 12.5681 1.5 12.1022 1.65224 11.7346C1.85523 11.2446 2.24458 10.8552 2.73463 10.6522C3.10218 10.5 3.56812 10.5 4.5 10.5C5.43188 10.5 5.89782 10.5 6.26537 10.6522C6.75542 10.8552 7.14477 11.2446 7.34776 11.7346C7.5 12.1022 7.5 12.5681 7.5 13.5C7.5 14.4319 7.5 14.8978 7.34776 15.2654C7.14477 15.7554 6.75542 16.1448 6.26537 16.3478C5.89782 16.5 5.43188 16.5 4.5 16.5C3.56812 16.5 3.10218 16.5 2.73463 16.3478C2.24458 16.1448 1.85523 15.7554 1.65224 15.2654C1.5 14.8978 1.5 14.4319 1.5 13.5Z" fill="#7A5AF8"/>
          <path d="M10.5 13.5C10.5 12.5681 10.5 12.1022 10.6522 11.7346C10.8552 11.2446 11.2446 10.8552 11.7346 10.6522C12.1022 10.5 12.5681 10.5 13.5 10.5C14.4319 10.5 14.8978 10.5 15.2654 10.6522C15.7554 10.8552 16.1448 11.2446 16.3478 11.7346C16.5 12.1022 16.5 12.5681 16.5 13.5C16.5 14.4319 16.5 14.8978 16.3478 15.2654C16.1448 15.7554 15.7554 16.1448 15.2654 16.3478C14.8978 16.5 14.4319 16.5 13.5 16.5C12.5681 16.5 12.1022 16.5 11.7346 16.3478C11.2446 16.1448 10.8552 15.7554 10.6522 15.2654C10.5 14.8978 10.5 14.4319 10.5 13.5Z" fill="#7A5AF8"/>
          </g>
          <path d="M1.5 4.5C1.5 3.56812 1.5 3.10218 1.65224 2.73463C1.85523 2.24458 2.24458 1.85523 2.73463 1.65224C3.10218 1.5 3.56812 1.5 4.5 1.5V1.5C5.43188 1.5 5.89782 1.5 6.26537 1.65224C6.75542 1.85523 7.14477 2.24458 7.34776 2.73463C7.5 3.10218 7.5 3.56812 7.5 4.5V4.5C7.5 5.43188 7.5 5.89782 7.34776 6.26537C7.14477 6.75542 6.75542 7.14477 6.26537 7.34776C5.89782 7.5 5.43188 7.5 4.5 7.5V7.5C3.56812 7.5 3.10218 7.5 2.73463 7.34776C2.24458 7.14477 1.85523 6.75542 1.65224 6.26537C1.5 5.89782 1.5 5.43188 1.5 4.5V4.5Z" stroke="#7A5AF8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M10.5 4.5C10.5 3.56812 10.5 3.10218 10.6522 2.73463C10.8552 2.24458 11.2446 1.85523 11.7346 1.65224C12.1022 1.5 12.5681 1.5 13.5 1.5V1.5C14.4319 1.5 14.8978 1.5 15.2654 1.65224C15.7554 1.85523 16.1448 2.24458 16.3478 2.73463C16.5 3.10218 16.5 3.56812 16.5 4.5V4.5C16.5 5.43188 16.5 5.89782 16.3478 6.26537C16.1448 6.75542 15.7554 7.14477 15.2654 7.34776C14.8978 7.5 14.4319 7.5 13.5 7.5V7.5C12.5681 7.5 12.1022 7.5 11.7346 7.34776C11.2446 7.14477 10.8552 6.75542 10.6522 6.26537C10.5 5.89782 10.5 5.43188 10.5 4.5V4.5Z" stroke="#7A5AF8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M1.5 13.5C1.5 12.5681 1.5 12.1022 1.65224 11.7346C1.85523 11.2446 2.24458 10.8552 2.73463 10.6522C3.10218 10.5 3.56812 10.5 4.5 10.5V10.5C5.43188 10.5 5.89782 10.5 6.26537 10.6522C6.75542 10.8552 7.14477 11.2446 7.34776 11.7346C7.5 12.1022 7.5 12.5681 7.5 13.5V13.5C7.5 14.4319 7.5 14.8978 7.34776 15.2654C7.14477 15.7554 6.75542 16.1448 6.26537 16.3478C5.89782 16.5 5.43188 16.5 4.5 16.5V16.5C3.56812 16.5 3.10218 16.5 2.73463 16.3478C2.24458 16.1448 1.85523 15.7554 1.65224 15.2654C1.5 14.8978 1.5 14.4319 1.5 13.5V13.5Z" stroke="#7A5AF8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M10.5 13.5C10.5 12.5681 10.5 12.1022 10.6522 11.7346C10.8552 11.2446 11.2446 10.8552 11.7346 10.6522C12.1022 10.5 12.5681 10.5 13.5 10.5V10.5C14.4319 10.5 14.8978 10.5 15.2654 10.6522C15.7554 10.8552 16.1448 11.2446 16.3478 11.7346C16.5 12.1022 16.5 12.5681 16.5 13.5V13.5C16.5 14.4319 16.5 14.8978 16.3478 15.2654C16.1448 15.7554 15.7554 16.1448 15.2654 16.3478C14.8978 16.5 14.4319 16.5 13.5 16.5V16.5C12.5681 16.5 12.1022 16.5 11.7346 16.3478C11.2446 16.1448 10.8552 15.7554 10.6522 15.2654C10.5 14.8978 10.5 14.4319 10.5 13.5V13.5Z" stroke="#7A5AF8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>{{ $t('organization.space') }}</span>
      </h3>
      <div v-if="hasSpaces" class="grid grid-cols-2 lg:grid-cols-1 gap-4 mb-4 mt-[16px]">
        <application-space-item v-for="repo in spaces.data" :repo="repo" repo-type="space" />
      </div>
      <div v-else class="flex flex-wrap gap-4 mb-4 mt-[16px]">
        {{ $t('all.noData') }}
      </div>
      <view-more
        v-if="moreSpaces"
        target="spaces"
        @view-more-targets="viewMoreTargets"
      ></view-more>
      <el-skeleton class="pr-6" v-if="spacesLoading" :rows="2" animated />
    </div>
  </div>
</template>

<script setup>
  import { computed, ref, inject } from 'vue'
  import RepoItem from './RepoItem.vue'
  import ApplicationSpaceItem from '../application_spaces/ApplicationSpaceItem.vue'
  import ViewMore from './ViewMore.vue'
  import { useI18n } from 'vue-i18n'
  import jwtFetch from '../../packs/jwtFetch'
  import { ElMessage } from 'element-plus'

  const props = defineProps({
    modelList: Object,
    datasetList: Object,
    spaceList: Object,
    codeList: Object,
    name: String,
    initiator: String
  })

  const { t } = useI18n();
  const models = ref(props.modelList)
  const datasets = ref(props.datasetList)
  const codes = ref(props.codeList)
  const spaces = ref(props.spaceList)
  const modelsLoading = ref(false)
  const datasetsLoading = ref(false)
  const codeLoading = ref(false)
  const spacesLoading = ref(false)

  const hasModels = computed(() => props.modelList?.total > 0)
  const hasDatasets = computed(() => props.datasetList?.total > 0)
  const hasCodes = computed(() => props.codeList?.total > 0)
  const hasSpaces = computed(() => props.spaceList?.total > 0)

  const moreModels = ref(props.modelList?.total > 6)
  const moreDatasets = ref(props.datasetList?.total > 6)
  const moreCodes = ref(props.codeList?.total > 6)
  const moreSpaces = ref(props.spaceList?.total > 6)

  const prefixPath = document.location.pathname.split('/')[1] === 'organizations' ? 'organizations' : 'users'
  const csghubServer = inject('csghubServer')

  const viewMoreTargets = (target) => {
    if (target === 'models') {
      modelsLoading.value = true
      fetchMoreModels()
    } else if (target === 'datasets') {
      datasetsLoading.value = true
      fetchMoreDatasets()
    } else if (target === 'spaces') {
      spacesLoading.value = true
      fetchMoreSpaces()
    } else if (target === 'codes') {
      codeLoading.value = true
      fetchMoreCodes()
    }
  }

  const reposUrl = (type) => {
    switch (props.initiator) {
      case "likes":
    return `${csghubServer}/api/v1/user/${props.name}/likes/${type}`
      case "profile":
    default:
      return `${csghubServer}/api/v1/user/${props.name}/${type}`
    }
  }

  const fetchMoreModels = async () => {
    const url = reposUrl("models")
    await fetchData(url, models, props.modelList.total)
    moreModels.value = false
  }

  const fetchMoreDatasets = async () => {
    const url = reposUrl("datasets")
    await fetchData(url, datasets, props.datasetList.total)
    moreDatasets.value = false
  }

  const fetchMoreSpaces = async () => {
    const url = reposUrl("spaces")
    await fetchData(url, spaces, props.spaceList.total)
    moreSpaces.value = false
  }

  const fetchMoreCodes = async () => {
    const url = reposUrl("codes")
    await fetchData(url, codes, props.codeList.total)
    moreCodes.value = false
  }

  const fetchData = async (url, targetRef, total) => {
    const params = new URLSearchParams();
    params.append('per', total);
    params.append('page', 1);

    jwtFetch(`${url}?${params}`).then((response) => {
      if (!response.ok) {
        ElMessage({
          message: t('all.loadError'),
          type: 'warning'
        })
      } else {
        response.json().then((data) => {
          targetRef.value = data
        })
      }
    }).catch((error) => {
      console.error(error)
    }).finally(() => {
      if (targetRef === models) {
        modelsLoading.value = false
      } else if (targetRef === datasets) {
        datasetsLoading.value = false
      } else if (targetRef === codes) {
        codeLoading.value = false
      } else if (targetRef === spaces) {
        spacesLoading.value = false
      }
    })
  }
</script>
