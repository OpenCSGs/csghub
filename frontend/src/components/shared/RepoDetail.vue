<template>
  <div
    class="w-full bg-gray-25 border-b border-gray-100 pt-9 pb-[60px] xl:px-10 md:px-0 md:pb-6 md:h-auto">
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
  <div class="mx-auto page-responsive-width mt-[-40px] md:px-0">
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
</template>

<script setup>
  import { onMounted, computed, provide, ref, watch, onUnmounted } from 'vue'
  import RepoHeader from '../shared/RepoHeader.vue'
  import RepoTabs from '../shared/RepoTabs.vue'
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

  // 添加防抖相关状态
  const isLoading = ref(false)
  const lastFetchTime = ref(0)
  const FETCH_DEBOUNCE_TIME = 1000 // 1秒防抖
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
    if (isLoading.value) {
      return
    }
    
    isLoading.value = true
    lastFetchTime.value = Date.now()
    
    // 添加时间戳参数来避免浏览器缓存
    const timestamp = Date.now()
    const url = `/${props.repoType}s/${props.namespace}/${props.repoName}?_t=${timestamp}`

    try {
      const { response, data, error } = await useFetchApi(url).json()
      // redirect unauthorized page
      if (response.value.status === 403) {
        ToUnauthorizedPage()
        return
      }
      // redirect not found page
      if (response.value.status === 404) {
        ToNotFoundPage()
        return
      }
      if (!data.value) {
        ElMessage.warning(error.value.msg)
        return
      }
      const repoData = data.value.data
      repoDetailStore.initialize(repoData, props.repoType)
      setRepoTab({
        currentBranch: props.currentBranch ? props.currentBranch : repoDetailStore.defaultBranch,
      })
    } catch (error) {
      console.error('Failed to fetch repo detail:', error)
    } finally {
      isLoading.value = false
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

  // 添加处理浏览器前进后退的函数
  const handlePopState = () => {
    if (isLoading.value) {
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

  onMounted(() => {
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
    
    fetchRepoDetail()
    fetchLastCommit()
    
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
