<template>
  <div
    v-if="repo"
    class="w-full bg-gray-25 border-b border-gray-100 pt-9 pb-[60px] xl:px-10 md:px-0 md:pb-6 md:h-auto"
  >
    <div class="mx-auto page-responsive-width">
      <repo-header
        :license="repo.license"
        :name="repo.name"
        :nickname="repo.nickname"
        :desc="repo.description"
        :path="`${namespace}/${repoName}`"
        :tags="tags"
        :avatar="repo.namespace?.Avatar"
        :owner-url="ownerUrl"
        :repoId="repo.repository_id"
        :totalLikes="repo.likes"
        :hasLike="repo.user_likes"
        :repoType="repoType"
      />
    </div>
  </div>
  <div class="mx-auto page-responsive-width mt-[-40px] md:px-0">
    <repo-tabs
      :repo-detail="repo"
      :current-branch="currentBranch"
      :current-path="currentPath"
      :default-tab="defaultTab"
      :actionName="actionName"
      :settingsVisibility="repo.can_manage"
      :can-write="repo.can_write"
      :tags="tags"
      :userName="userName"
      :commitId="commitId"
      :repoType="repoType"
      :path="`${namespace}/${repoName}`"
    />
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import RepoHeader from '../shared/RepoHeader.vue'
  import RepoTabs from '../shared/RepoTabs.vue'
  import useRepoDetailStore from '../../stores/RepoDetailStore'
  import { buildTags } from '../../packs/buildTags'
  import { ElMessage } from 'element-plus'
  import { usePermissionCheck } from '../../packs/usePermissionCheck'
  import useFetchApi from '../../packs/useFetchApi'

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

  const repo = ref({})
  const tags = ref({
    task_tags: [],
    framework_tags: [],
    language_tags: [],
    license_tags: [],
    industry_tags: [],
    other_tags: []
  })
  const ownerUrl = ref('')
  const repoDetailStore = useRepoDetailStore()

  const getOwnerUrl = (repo) => {
    if (repo.user.username === props.namespace) {
      return `/profile/${props.namespace}`
    } else {
      return `/organizations/${props.namespace}`
    }
  }

  const fetchRepoDetail = async () => {
    const url = `/${props.repoType}s/${props.namespace}/${props.repoName}`

    try {
      const { response, data, error } = await useFetchApi(url).json()

      if (!usePermissionCheck(response.value)) {
        return
      }

      if (!data.value) {
        ElMessage({ message: error.value.msg, type: 'warning' })
        return
      }

      const repoData = data.value.data
      repo.value = repoData

      tags.value = handleRepoTags(repoData)

      repoDetailStore.initialize(repoData)
      ownerUrl.value = getOwnerUrl(repoData)

    } catch (error) {
      console.error('Failed to fetch repo detail:', error)
    }
  }

  const handleRepoTags = (repoData) => {
    if (repoData.tags) {
      return buildTags(repoData.tags)
    }

    if (props.repoType === 'code' && repoData.license) {
      return buildTags([{
        name: repoData.license,
        category: 'license',
        built_in: true
      }])
    }

    return []
  }

  onMounted(() => {
    fetchRepoDetail()
  })
</script>

<style scoped>
  body {
    background: #fff !important;
  }
</style>
