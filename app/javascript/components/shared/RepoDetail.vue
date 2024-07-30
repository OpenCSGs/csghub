<template>
  <div
    v-if="repo"
    class="w-full bg-[#FCFCFD] pt-9 pb-[60px] xl:px-10 md:px-0 md:pb-6 md:h-auto border-b border-[#EBEEF5]"
  >
    <div class="mx-auto max-w-[1280px]">
      <repo-header
        :license="repo.license"
        :name="repo.name"
        :nickname="repo.nickname"
        :desc="repo.description"
        :path="`${namespace}/${repoName}`"
        :tags="tags"
        :avatar="avatar"
        :owner-url="ownerUrl"
        :repoId="repo.repository_id"
        :totalLikes="repo.likes"
        :hasLike="repo.user_likes"
        :repoType="repoType"
      />
    </div>
  </div>
  <div class="mx-auto max-w-[1280px] mt-[-40px] xl:px-10 md:px-0">
    <repo-tabs
      :local-repo-id="localRepoId"
      :repo-detail="repo"
      :current-branch="currentBranch"
      :current-path="currentPath"
      :default-tab="defaultTab"
      :actionName="actionName"
      :settingsVisibility="repo.can_manage"
      :can-write="repo.can_write"
      :tags="tags"
      :tag-list="tagList"
      :userName="userName"
      :commitId="commitId"
      :repoType="repoType"
      :admin="admin"
      :path="`${namespace}/${repoName}`"
    />
  </div>
</template>

<script setup>
  import { ref, onMounted, inject } from 'vue'
  import RepoHeader from '../shared/RepoHeader.vue'
  import RepoTabs from '../shared/RepoTabs.vue'
  import useRepoDetailStore from '../../stores/RepoDetailStore'
  import jwtFetch from '../../packs/jwtFetch'
  import { buildTags } from '../../packs/buildTags'

  const props = defineProps({
    localRepoId: String,
    defaultTab: String,
    repoType: String,
    tagList: Object,
    localModel: Object,
    currentBranch: String,
    currentPath: String,
    actionName: String,
    settingsVisibility: Boolean,
    avatar: String,
    ownerUrl: String,
    canWrite: Boolean,
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
  const csghubServer = inject('csghubServer')
  const repoDetailStore = useRepoDetailStore()

  const fetchRepoDetail = async () => {
    const url = `${csghubServer}/api/v1/${props.repoType}s/${props.namespace}/${props.repoName}`

    try {
      const response = await jwtFetch(url, { method: 'GET' })
      const json = await response.json()

      if (response.ok) {
        repo.value = json.data
        if (json.data.tags) {
          tags.value = buildTags(json.data.tags)
        }
        repoDetailStore.initialize(json.data)
      } else {
        ElMessage({ message: json.msg, type: 'warning' })
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
