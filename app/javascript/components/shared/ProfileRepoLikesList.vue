<template>
  <div class="xl:px-[16px] sm:w-[100%] sm:mt-[36px]">
    <a :href="`/profile/${name}`"
       class="flex items-center w-[150px] mr-[10px] pl-[18px] py-[5px] border border-[#DCDFE6] rounded-[4px] text-[14px] leading-[22px] font-medium hover:bg-[#EAECF0] hover:text-[#808080]">
      <SvgIcon class="mr-[4px]" name="arrow" />
      {{ $t('profile.return') }}
    </a>
    <div class="mt-[32px] font-medium text-xl">{{ $t('profile.myCollect') }}</div>

    <!-- models -->
    <div class="mt-[32px]">
      <h3 class="text-[20px] text-[#303133] flex items-center gap-[8px]">
        <SvgIcon name="models" />
        <span>{{ $t('organization.model') }}</span>
      </h3>
      <div v-if="hasModels" class="grid grid-cols-2 lg:grid-cols-1 gap-4 mb-4 mr-6 mt-[16px]">
        <RepoItem v-for="model in models.data" :repo="model" repo-type="model"></RepoItem>
      </div>
      <div v-else class="flex flex-wrap gap-4 mb-4 mt-[16px]">
        {{ $t('all.noData') }}
      </div>
      <view-more
        v-if="moreModels"
        target="models"
        @viewMoreTargets="viewMoreTargets"
      ></view-more>
      <el-skeleton class="pr-6" v-if="modelsLoading" :rows="2" animated />
    </div>

    <!-- datasets -->
    <div class="mt-[32px]">
      <h3 class="text-[20px] text-[#303133] flex items-center gap-[8px]">
        <SvgIcon name="datasets" />
        <span>{{ $t('organization.dataset') }}</span>
      </h3>
      <div v-if="hasDatasets" class="grid grid-cols-2 lg:grid-cols-1 gap-4 mb-4 mr-6 mt-[16px]">
        <RepoItem v-for="dataset in datasets.data" :repo="dataset" repo-type="dataset"></RepoItem>
      </div>
      <div v-else class="flex flex-wrap gap-4 mb-4 mt-[16px]">
        {{ $t('all.noData') }}
      </div>
      <view-more
        v-if="moreDatasets"
        target="datasets"
        @viewMoreTargets="viewMoreTargets"
      ></view-more>
      <el-skeleton class="pr-6" v-if="datasetsLoading" :rows="2" animated />
    </div>

    <!-- code repo -->
    <div class="mt-[32px]">
      <h3 class="text-[20px] text-[#303133] flex items-center gap-[8px]">
        <SvgIcon name="codes" />
        <span>{{ $t('organization.code') }}</span>
      </h3>
      <div v-if="hasCodes" class="grid grid-cols-2 lg:grid-cols-1 gap-4 mb-4 mr-6 mt-[16px]">
        <RepoItem v-for="code in codes.data" :repo="code" repo-type="code"></RepoItem>
      </div>
      <div v-else class="flex flex-wrap gap-4 mb-4 mt-[16px]">
        {{ $t('all.noData') }}
      </div>
      <view-more
        v-if="moreCodes"
        target="codes"
        @viewMoreTargets="viewMoreTargets"
      ></view-more>
      <el-skeleton class="pr-6" v-if="codeLoading" :rows="2" animated />
    </div>

    <!-- spaces -->
    <div class="mt-[32px]">
      <h3 class="text-[20px] text-[#303133] flex items-center gap-[8px]">
        <SvgIcon name="spaces" />
        <span>{{ $t('organization.space') }}</span>
      </h3>
      <div v-if="hasSpaces" class="grid grid-cols-2 lg:grid-cols-1 gap-4 mb-4 mr-6 mt-[16px]">
        <ApplicationSpaceItem v-for="repo in spaces.data" :repo="repo" repo-type="space" />
      </div>
      <div v-else class="flex flex-wrap gap-4 mb-4 mt-[16px]">
        {{ $t('all.noData') }}
      </div>
      <view-more
        v-if="moreSpaces"
        target="spaces"
        @viewMoreTargets="viewMoreTargets"
      ></view-more>
      <el-skeleton class="pr-6" v-if="spacesLoading" :rows="2" animated />
    </div>
  </div>
</template>

<script setup>
  import { computed, ref } from 'vue'
  import RepoItem from './RepoItem.vue'
  import ApplicationSpaceItem from '../application_spaces/ApplicationSpaceItem.vue'
  import ViewMore from './ViewMore.vue'
  import { useI18n } from 'vue-i18n'
  import SvgIcon from './SvgIcon.vue'

  const props = defineProps({
    modelList: Object,
    datasetList: Object,
    spaceList: Object,
    codeList: Object,
    name: String
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

  const viewMoreTargets = (target) => {
    const moreRepoUrl = getMoreReposUrl(target)
    toggleRepoLoading(target)   
    const response = fetchData(moreRepoUrl, target)  
    response.then((data) => {   
      refreshRepoList(target, data)
      toggleRepoLoading(target) 
    })
  }

  const toggleRepoLoading = (target) => {
    if (target == 'models') {
      modelsLoading.value = !modelsLoading.value
    } else if (target == 'datasets') {
      datasetsLoading.value = !datasetsLoading.value
    } else if (target == 'codes') {
      spacesLoading.value = !spacesLoading.value
    } else if (target == 'spaces') {
      codeLoading.value = !codeLoading.value
    }
  }

  const refreshRepoList = (target, data) => {
    if (target == 'models') {
      models.value = data
    } else if (target == 'datasets') {
      datasets.value = data
    } else if (target == 'codes') {
      codes.value = data
    } else if (target == 'spaces') {
      spaces.value = data
    }
  }

  const getMoreReposUrl = (target) => {
    return `/internal_api/${prefixPath}/${props.name}/likes/${target}?per=${getRepoListTotal(target)}`
  }

  const getRepoListTotal = (target) => {
    if (target == 'models') {
      return props.modelList.total
    } else if (target == 'datasets') {
      return props.datasetList.total
    } else if (target == 'codes') {
      return props.codeList.total
    } else if (target == 'spaces') {
      return props.spaceList.total
    }
  }

  const fetchData = async (url, target) => {
    return fetch(url).then((response) => {
      if (!response.ok) {
        ElMessage({
          message: t('all.loadError'),
          type: 'warning'
        })
      } 
      return response.json()
    }).catch((error) => {
      console.error(error)
    })
  }
</script>
