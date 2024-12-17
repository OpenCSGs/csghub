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
      :admin="admin"
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
    admin: Boolean,
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

      const hasPermission = usePermissionCheck(response.value)
      if (!hasPermission) return

      const json = data.value
      if (json) {
        repo.value = json.data
        if (json.data.tags) {
          tags.value = buildTags(json.data.tags)
        }
        repoDetailStore.initialize(json.data)
        ownerUrl.value = getOwnerUrl(json.data)
      } else {
        ElMessage({ message: error.value.msg, type: 'warning' })
      }
    } catch (error) {
      console.error(error)
    }
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
