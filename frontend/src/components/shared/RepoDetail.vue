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
  import { onMounted, computed, provide, ref, watch } from 'vue'
  import RepoHeader from '../shared/RepoHeader.vue'
  import RepoTabs from '../shared/RepoTabs.vue'
  import useRepoDetailStore from '../../stores/RepoDetailStore'
  import { buildTags } from '../../packs/buildTags'
  import { ElMessage } from 'element-plus'
  import useFetchApi from '../../packs/useFetchApi'
  import { ToUnauthorizedPage } from '@/packs/utils'
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

  // const repo = ref({})
  // const tags = ref({
  //   task_tags: [],
  //   framework_tags: [],
  //   language_tags: [],
  //   license_tags: [],
  //   industry_tags: [],
  //   other_tags: []
  // })
  const showNewTag = computed(() => {
    return ((props.repoType === 'model' || props.repoType === 'dataset')) && (isWithinTwoWeeks(repoDetailStore.createdAt) || isWithinTwoWeeks(repoDetailStore.updatedAt));
  });

  const tags = computed(() => {
    return handleRepoTags(repoDetailStore)
  })
  // const ownerUrl = ref('')
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
    const url = `/${props.repoType}s/${props.namespace}/${props.repoName}`

    try {
      const { response, data, error } = await useFetchApi(url).json()
      // redirect unauthorized page
      if (response.value.status === 403) {
        ToUnauthorizedPage()
        return
      }
      if (!data.value) {
        ElMessage.warning(error.value.msg)
        return
      }
      const repoData = data.value.data
      // repo.value = repoData
      // tags.value = handleRepoTags(repoData)
      repoDetailStore.initialize(repoData, props.repoType)
      setRepoTab({
        currentBranch: props.currentBranch ? props.currentBranch : repoDetailStore.defaultBranch,
      })
      // ownerUrl.value = getOwnerUrl(repoData)
    } catch (error) {
      console.error('Failed to fetch repo detail:', error)
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

  const fetchLastCommit = async () => {
    const url = `/${props.repoType}s/${props.namespace}/${props.repoName}/last_commit`
    try {
      const { data } = await useFetchApi(url).json()

      if (data.value) {
        const json = data.value
        lastCommit.value = json.data
      }
    } catch (error) {
      console.log(error)
    }
  }

  onMounted(() => {
    fetchRepoDetail()
    fetchLastCommit()
    setRepoTab({
      repoType: props.repoType,
      namespace: props.namespace,
      repoName: props.repoName,
    })
  })

  provide('fetchRepoDetail', fetchRepoDetail)
</script>

<style scoped>
  body {
    background: #fff !important;
  }
</style>
