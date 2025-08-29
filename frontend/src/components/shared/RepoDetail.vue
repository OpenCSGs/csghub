<template>
  <div v-show="!isDataLoading && isInitialized" class="bg-gray-25 border-b border-gray-100 pt-9 pb-[60px] xl:pb-[70px] md:pb-6 md:h-auto">
    <div class="mx-auto page-responsive-width">
      <repo-header
        :avatar="repoDetailStore.namespace?.Avatar"
        :license="repoDetailStore.license"
        :name="repoDetailStore.name"
        :nickname="repoDetailStore.nickname"
        :desc="repoDetailStore.description"
        :path="`${namespace}/${repoName}`"
        :tags="tags"
        :owner-url="ownerUrl"
        :repoId="repoDetailStore.repositoryId"
        :totalLikes="repoDetailStore.likes"
        :hasLike="repoDetailStore.userLikes"
        :showNewTag="showNewTag"
        :repoType="repoType" />
    </div>
  </div>
  <div v-show="!isDataLoading && isInitialized" class="page-responsive-width mt-[-40px] xl:mt-[-78px] md:mt-[-40px]">
    <repo-tabs
      :repo-detail="repoDetailStore"
      :current-branch="currentBranch || repoDetailStore.defaultBranch || 'main'"
      :current-path="currentPath"
      :default-tab="defaultTab"
      :actionName="actionName"
      :settingsVisibility="repoDetailStore.canManage"
      :can-write="repoDetailStore.canWrite"
      :tags="tags"
      :userName="userName"
      :commitId="commitId || lastCommit?.id"
      :repoType="repoType"
      :path="`${namespace}/${repoName}`" />
  </div>
  
  <LoadingSpinner 
    :loading="isDataLoading" 
    :text="$t('repo.loading')" 
  />
</template>

<script setup>
  import { onMounted, computed, provide, ref, onUnmounted } from 'vue'
  import RepoHeader from '../shared/RepoHeader.vue'
  import RepoTabs from '../shared/RepoTabs.vue'
  import LoadingSpinner from './LoadingSpinner.vue'
  import useRepoDetailStore from '../../stores/RepoDetailStore'
  import { buildTags } from '../../packs/buildTags'
  import { ElMessage } from 'element-plus'
  import useFetchApi from '../../packs/useFetchApi'
  import { ToNotFoundPage, ToUnauthorizedPage, validateTab, validateActionName } from '@/packs/utils'
  import { storeToRefs } from 'pinia'
  import { isWithinTwoWeeks } from '../../packs/datetimeUtils'
  import { useRepoTabStore } from '../../stores/RepoTabStore'

  const { setRepoTab } = useRepoTabStore()

  const props = defineProps({
    defaultTab: String,
    repoType: String,
    localModel: Object,
    currentBranch: String,
    currentPath: String,
    actionName: String,
    userName: String,
    commitId: String,
    namespace: String,
    repoName: String
  })

  const repoDetailStore = useRepoDetailStore()
  const { isInitialized } = storeToRefs(repoDetailStore)
  const lastCommit = ref({})

  const lastFetchTime = ref(0)
  const FETCH_DEBOUNCE_TIME = 1000
  const isDataLoading = ref(false)
  
  const showNewTag = computed(() => {
    return ((props.repoType === 'model' || props.repoType === 'dataset')) && (isWithinTwoWeeks(repoDetailStore.createdAt) || isWithinTwoWeeks(repoDetailStore.updatedAt));
  });

  const tags = computed(() => {
    return handleRepoTags(repoDetailStore)
  })

  const ownerUrl = computed(() => {
    if (repoDetailStore.user.username === props.namespace) {
      return `/profile/${props.namespace}`
    } else {
      return `/organizations/${props.namespace}`
    }
  })

  const isSameRepo = computed(() => {
    return (
      props.repoType === repoDetailStore.repoType &&
      props.namespace === repoDetailStore.namespace.Path &&
      props.repoName === repoDetailStore.name
    )
  })

  const fetchRepoDetail = async () => {
    if (isDataLoading.value) {
      return false
    }
    
    isDataLoading.value = true
    lastFetchTime.value = Date.now()
    
    const timestamp = Date.now()
    const url = `/${props.repoType}s/${props.namespace}/${props.repoName}?_t=${timestamp}`

    try {
      const { response, data, error } = await useFetchApi(url).json()
      // redirect unauthorized page
      if (response.value.status === 403) {
        ToUnauthorizedPage()
        return false
      }
      // redirect not found page
      if (response.value.status === 404) {
        ToNotFoundPage()
        return false
      }
      if (!data.value) {
        ElMessage.warning(error.value.msg)
        return false
      }
      const repoData = data.value.data
      repoDetailStore.initialize(repoData, props.repoType)
      setRepoTab({
        currentBranch: props.currentBranch ? props.currentBranch : repoDetailStore.defaultBranch,
      })
      return true
    } catch (error) {
      console.error('Failed to fetch repo detail:', error)
      return false
    } finally {
      isDataLoading.value = false
    }
  }

  const fetchLastCommit = async () => {
    const url = `/${props.repoType}s/${props.namespace}/${props.repoName}/last_commit`
    
    try {
      const { data } = await useFetchApi(url).json()

      if (data.value) {
        const json = data.value
        lastCommit.value = json.data
      }
    } catch (error) {
      // 
    }
  }

  const handleRepoTags = (repoData) => {
    if (repoData.tags) {
      return buildTags(repoData.tags)
    }

    if (props.repoType === 'code' && repoData.license) {
      return buildTags([
        {
          name: repoData.license,
          category: 'license',
          built_in: true
        }
      ])
    }

    return {}
  }

  const getUrlParams = () => {
    const urlParams = new URLSearchParams(window.location.search)
    return {
      tab: validateTab(urlParams.get('tab')),
      actionName: validateActionName(urlParams.get('actionName')),
      path: urlParams.get('path'),
      branch: urlParams.get('branch')
    }
  }

  const handlePopState = () => {
    if (isDataLoading.value) {
      return
    }
    
    const now = Date.now()
    if (now - lastFetchTime.value < FETCH_DEBOUNCE_TIME) {
      return
    }
    
    // 重新获取数据
    fetchRepoDetail()
    fetchLastCommit()
  }

  onMounted(async () => {
    const urlParams = getUrlParams()
    
    const initialData = {
      repoType: props.repoType,
      namespace: props.namespace,
      repoName: props.repoName,
      tab: urlParams.tab || props.defaultTab || 'summary',
      actionName: urlParams.actionName || props.actionName || 'files',
      lastPath: urlParams.path || props.currentPath || '',
      currentBranch: urlParams.branch || props.currentBranch || ''
    }
    
    setRepoTab(initialData)
    
    // 只有主请求成功后才获取其他数据
    const success = await fetchRepoDetail()
    if (success) {
      fetchLastCommit()
    }
    
    window.addEventListener('popstate', handlePopState)
  })

  onUnmounted(() => {
    window.removeEventListener('popstate', handlePopState)
  })

  provide('fetchRepoDetail', fetchRepoDetail)
</script>

<style scoped>
  body {
    background: #fff !important;
  }
</style>
