<template>
  <div class="sm:w-[100%] sm:mt-9">
    <!-- title -->
    <div class="mb-6">
      <h1 class="text-lg font-medium text-gray-900 mb-5">
        {{ initiator === 'likes' ? $t('profile.likes') : $t('profile.title') }}
      </h1>
      <div class="h-[1px] bg-gray-200"></div>
    </div>

    <!-- Quick Navigation Tabs -->
    <el-tabs
      v-model="activeTab"
      class="border-b border-gray-200 my-8 tabCont"
    >
      <el-tab-pane
        name=""
        :label="`&nbsp;${$t('profile.tabs.all')}&nbsp;`"
      ></el-tab-pane>
      <el-tab-pane
        name="collections"
        :label="`&nbsp;${$t('profile.tabs.collections')}&nbsp;`"
      ></el-tab-pane>
      <el-tab-pane
        name="models"
        :label="`&nbsp;${$t('profile.tabs.models')}&nbsp;`"
      ></el-tab-pane>
      <el-tab-pane
        name="datasets"
        :label="`&nbsp;${$t('profile.tabs.datasets')}&nbsp;`"
      ></el-tab-pane>
      <el-tab-pane
        name="codes"
        :label="`&nbsp;${$t('profile.tabs.codes')}&nbsp;`"
      ></el-tab-pane>
      <el-tab-pane
        v-if="initiator === 'profile'"
        name="prompts"
        :label="`&nbsp;${$t('profile.tabs.prompts')}&nbsp;`"
      ></el-tab-pane>
      <el-tab-pane
        name="spaces"
        :label="`&nbsp;${$t('profile.tabs.spaces')}&nbsp;`"
      ></el-tab-pane>
      <el-tab-pane
        name="mcps"
        :label="`&nbsp;${$t('profile.tabs.mcps')}&nbsp;`"
      ></el-tab-pane>
    </el-tabs>

    <!-- collections -->
    <div v-if="activeTab === '' || activeTab === 'collections'">
      <h3 class="text-xl text-gray-700 flex items-center gap-2">
        <SvgIcon name="collections" width="18" height="18" />
        <span>{{ $t("collections.collection") }}</span>
      </h3>
      <div v-if="hasCollections" class="mb-4 mt-4">
        <CollectionCards
          v-if="displayedCollections.length > 0"
          :collections="displayedCollections"
        />
      </div>
      <div v-else class="flex flex-wrap gap-4 mb-4 mt-4">
        {{ $t("all.noData") }}
      </div>
      <view-more v-if="collections.more && !expandedSections.collections" target="collections" @view-more-targets="viewMoreTargets"></view-more>
      <el-skeleton class="pr-6" v-if="collectionsLoading" :rows="2" animated />
    </div>

    <!-- models -->
    <div v-if="activeTab === '' || activeTab === 'models'">
      <h3 class="text-xl text-gray-700 flex items-center gap-2">
        <SvgIcon name="models" width="18" height="18" />
        <span>{{ $t("organization.model") }}</span>
      </h3>
      <div v-if="hasModels" class="grid grid-cols-2 xl:grid-cols-1 gap-4 mb-4 mt-4">
        <repo-item v-for="model in displayedModels" :repo="model" repo-type="model"></repo-item>
      </div>
      <div v-else class="flex flex-wrap gap-4 mb-4 mt-4">
        {{ $t("all.noData") }}
      </div>
      <view-more v-if="models.more && !expandedSections.models" target="models" @view-more-targets="viewMoreTargets"></view-more>
      <el-skeleton class="pr-6" v-if="modelsLoading" :rows="2" animated />
    </div>

    <!-- datasets -->
    <div v-if="activeTab === '' || activeTab === 'datasets'" class="mt-8">
      <h3 class="text-xl text-gray-700 flex items-center gap-2">
        <SvgIcon name="datasets" width="18" height="18" />
        <span>{{ $t("organization.dataset") }}</span>
      </h3>
      <div v-if="hasDatasets" class="grid grid-cols-2 xl:grid-cols-1 gap-4 mb-4 mt-4">
        <repo-item v-for="dataset in displayedDatasets" :repo="dataset" repo-type="dataset"></repo-item>
      </div>
      <div v-else class="flex flex-wrap gap-4 mb-4 mt-4">
        {{ $t("all.noData") }}
      </div>
      <view-more
        v-if="datasets.more && !expandedSections.datasets"
        target="datasets"
        @view-more-targets="viewMoreTargets"
      ></view-more>
      <el-skeleton class="pr-6" v-if="datasetsLoading" :rows="2" animated />
    </div>

    <!-- code repo -->
    <div v-if="activeTab === '' || activeTab === 'codes'" class="mt-8">
      <h3 class="text-xl text-gray-700 flex items-center gap-2">
        <SvgIcon name="codes" width="18" height="18" />
        <span>{{ $t("organization.code") }}</span>
      </h3>
      <div v-if="hasCodes" class="grid grid-cols-2 xl:grid-cols-1 gap-4 mb-4 mt-4">
        <repo-item v-for="code in displayedCodes" :repo="code" repo-type="code"></repo-item>
      </div>
      <div v-else class="flex flex-wrap gap-4 mb-4 mt-4">
        {{ $t("all.noData") }}
      </div>
      <view-more v-if="codes.more && !expandedSections.codes" target="codes" @view-more-targets="viewMoreTargets"></view-more>
      <el-skeleton class="pr-6" v-if="codeLoading" :rows="2" animated />
    </div>

    <!-- prompts repo -->
    <div v-if="(activeTab === '' || activeTab === 'prompts') && initiator === 'profile'" class="mt-8">
      <h3 class="text-[20px] text-[#344054] flex items-center gap-2">
        <SvgIcon name="codes" width="18" height="18" />
        <span>{{ $t("organization.prompt") }}</span>
      </h3>
      <div v-if="hasPrompts" class="grid grid-cols-2 xl:grid-cols-1 gap-4 mb-4 mt-4">
        <repo-item v-for="prompt in displayedPrompts" :repo="prompt" repo-type="prompt"></repo-item>
      </div>
      <div v-else class="flex flex-wrap gap-4 mb-4 mt-4">
        {{ $t("all.noData") }}
      </div>
      <view-more v-if="prompts.more && !expandedSections.prompts" target="prompts" @view-more-targets="viewMoreTargets"></view-more>
      <el-skeleton class="pr-6" v-if="promptsLoading" :rows="2" animated />
    </div>       

    <!-- spaces -->
    <div v-if="activeTab === '' || activeTab === 'spaces'" class="mt-8">
      <h3 class="text-xl text-gray-700 flex items-center gap-2">
        <SvgIcon name="spaces" width="18" height="18" />
        <span>{{ $t("organization.space") }}</span>
      </h3>
      <div v-if="hasSpaces" class="grid grid-cols-2 xl:grid-cols-1 gap-4 mb-4 mt-4">
        <application-space-item v-for="repo in displayedSpaces" :repo="repo" repo-type="space" />
      </div>
      <div v-else class="flex flex-wrap gap-4 mb-4 mt-4">
        {{ $t("all.noData") }}
      </div>
      <view-more v-if="spaces.more && !expandedSections.spaces" target="spaces" @view-more-targets="viewMoreTargets"></view-more>
      <el-skeleton class="pr-6" v-if="spacesLoading" :rows="2" animated />
    </div>

    <!-- mcp repo -->
    <div v-if="activeTab === '' || activeTab === 'mcps'" class="mt-8">
      <h3 class="text-xl text-gray-700 flex items-center gap-2">
        <SvgIcon name="space_mcp" width="18" height="18" />
        <span>{{ $t("mcps.title") }}</span>
      </h3>
      <div v-if="hasMcps" class="grid grid-cols-2 xl:grid-cols-1 gap-4 mb-4 mt-4">
        <mcp-item v-for="mcp in displayedMcps" :mcp="mcp" />
      </div>
      <div v-else class="flex flex-wrap gap-4 mb-4 mt-4">
        {{ $t("all.noData") }}
      </div>
      <view-more v-if="mcps.more && !expandedSections.mcps" target="mcps" @view-more-targets="viewMoreTargets"></view-more>
      <el-skeleton class="pr-6" v-if="mcpsLoading" :rows="2" animated />
    </div>
  </div>
</template>

<script setup>
  import { computed, ref, onMounted, onUnmounted } from "vue"
  import { useRoute } from 'vue-router'
  import RepoItem from "./RepoItem.vue"
  import CollectionCards from "../collections/CollectionCards.vue"
  import ApplicationSpaceItem from "../application_spaces/ApplicationSpaceItem.vue"
  import ViewMore from "./ViewMore.vue"
  import useFetchApi from "../../packs/useFetchApi"
  import { ElMessage } from "element-plus"
  import McpItem from "../mcp/McpItem.vue"

  const props = defineProps({
    name: String,
    initiator: String
  })

  const route = useRoute()
  const activeTab = ref('')
  const collections = ref({})
  const models = ref({})
  const datasets = ref({})
  const codes = ref({})
  const prompts = ref({})
  const spaces = ref({})
  const mcps = ref({})
  const collectionsLoading = ref(false)
  const modelsLoading = ref(false)
  const datasetsLoading = ref(false)
  const codeLoading = ref(false)
  const promptsLoading = ref(false)
  const spacesLoading = ref(false)
  const mcpsLoading = ref(false)

  const collectionsPage = ref(1)
  const modelsPage = ref(1)
  const datasetsPage = ref(1)
  const codesPage = ref(1)
  const promptsPage = ref(1)
  const spacesPage = ref(1)
  const mcpsPage = ref(1)

  const PER_PAGE = 50
  const INITIAL_PER_PAGE = 6

  // 跟踪每个类型是否已经展开显示更多内容
  const expandedSections = ref({
    collections: false,
    models: false,
    datasets: false,
    codes: false,
    prompts: false,
    spaces: false,
    mcps: false
  })

  const hasCollections = computed(() => collections.value?.data?.length > 0)
  const hasModels = computed(() => models.value?.data?.length > 0)
  const hasDatasets = computed(() => datasets.value?.data?.length > 0)
  const hasCodes = computed(() => codes.value?.data?.length > 0)
  const hasPrompts = computed(() => prompts.value?.data?.length > 0)
  const hasSpaces = computed(() => spaces.value?.data?.length > 0)
  const hasMcps = computed(() => mcps.value?.data?.length > 0)

  const displayedCollections = computed(() => {
    const data = collections.value?.data || []
    if (data.length > INITIAL_PER_PAGE) {
      return data
    }
    return data.slice(0, INITIAL_PER_PAGE)
  })

  const displayedModels = computed(() => {
    const data = models.value?.data || []
    if (data.length > INITIAL_PER_PAGE) {
      return data
    }
    return data.slice(0, INITIAL_PER_PAGE)
  })

  const displayedDatasets = computed(() => {
    const data = datasets.value?.data || []
    if (data.length > INITIAL_PER_PAGE) {
      return data
    }
    return data.slice(0, INITIAL_PER_PAGE)
  })

  const displayedCodes = computed(() => {
    const data = codes.value?.data || []
    if (data.length > INITIAL_PER_PAGE) {
      return data
    }
    return data.slice(0, INITIAL_PER_PAGE)
  })

  const displayedPrompts = computed(() => {
    const data = prompts.value?.data || []
    if (data.length > INITIAL_PER_PAGE) {
      return data
    }
    return data.slice(0, INITIAL_PER_PAGE)
  })

  const displayedSpaces = computed(() => {
    const data = spaces.value?.data || []
    if (data.length > INITIAL_PER_PAGE) {
      return data
    }
    return data.slice(0, INITIAL_PER_PAGE)
  })

  const displayedMcps = computed(() => {
    const data = mcps.value?.data || []
    if (data.length > INITIAL_PER_PAGE) {
      return data
    }
    return data.slice(0, INITIAL_PER_PAGE)
  })

  const prefixPath =
    document.location.pathname.split("/")[1] === "organizations" ? "organization" : "user"

  const isLoading = ref(false)
  const lastFetchTime = ref(0)
  const FETCH_DEBOUNCE_TIME = 1000

  const getProfileRepoData = async () => {
    if (isLoading.value) {
      return
    }
    
    isLoading.value = true
    lastFetchTime.value = Date.now()
    
    try {
      const collectionsUrl = `${reposUrl("collections")}`
      const modelsUrl = `${reposUrl("models")}`
      const datasetsUrl = `${reposUrl("datasets")}`
      const spacesUrl = `${reposUrl("spaces")}`
      const codesUrl = `${reposUrl("codes")}`
      const promptsUrl = `${reposUrl("prompts")}`
      const mcpsUrl = `${reposUrl("mcps")}`

      const promises = [
        fetchData(collectionsUrl, collections, INITIAL_PER_PAGE, 1),
        fetchData(modelsUrl, models, INITIAL_PER_PAGE, 1),
        fetchData(datasetsUrl, datasets, INITIAL_PER_PAGE, 1),
        fetchData(spacesUrl, spaces, INITIAL_PER_PAGE, 1),
        fetchData(codesUrl, codes, INITIAL_PER_PAGE, 1),
        fetchData(mcpsUrl, mcps, INITIAL_PER_PAGE, 1),
      ]
      if (props.initiator === "profile") {
        promises.push(fetchData(promptsUrl, prompts, INITIAL_PER_PAGE, 1))
      }
      await Promise.all(promises)
    } finally {
      isLoading.value = false
    }
  }

  const viewMoreTargets = async (target) => {
    switch (target) {
      case "collections":
        collectionsLoading.value = true
        await fetchMoreCollections()
        collectionsLoading.value = false
        // 只有当没有更多数据时才标记为已展开
        if (!collections.value.more) {
          expandedSections.value.collections = true
        }
        break
      case "models":
        modelsLoading.value = true
        await fetchMoreModels()
        modelsLoading.value = false
        if (!models.value.more) {
          expandedSections.value.models = true
        }
        break
      case "datasets":
        datasetsLoading.value = true
        await fetchMoreDatasets()
        datasetsLoading.value = false
        if (!datasets.value.more) {
          expandedSections.value.datasets = true
        }
        break
      case "spaces":
        spacesLoading.value = true
        await fetchMoreSpaces()
        spacesLoading.value = false
        if (!spaces.value.more) {
          expandedSections.value.spaces = true
        }
        break
      case "codes":
        codeLoading.value = true
        await fetchMoreCodes()
        codeLoading.value = false
        if (!codes.value.more) {
          expandedSections.value.codes = true
        }
        break
      case "prompts":
        promptsLoading.value = true
        await fetchMorePrompts()
        promptsLoading.value = false
        if (!prompts.value.more) {
          expandedSections.value.prompts = true
        }
        break
      case "mcps":
        mcpsLoading.value = true
        await fetchMoreMcp()
        mcpsLoading.value = false
        if (!mcps.value.more) {
          expandedSections.value.mcps = true
        }
        break
    }
  }

  const reposUrl = (type) => {
    switch (props.initiator) {
      case "likes":
        return `/${prefixPath}/${props.name}/likes/${type}`
      case "profile":
      default:
        return `/${prefixPath}/${props.name}/${type}`
    }
  }

  const updatePageAndData = (response, targetRef, pageRef, isFirstExpand = false) => {
    const addData = targetRef === mcps ? response.data.data : response.data
    const repoTotal = targetRef === mcps ? response.data.total : response.total
    
    if (isFirstExpand) {
      targetRef.value.data = addData
      pageRef.value = 1
    } else {
      targetRef.value.data = [...targetRef.value.data, ...addData]
    }
    
    targetRef.value.total = repoTotal
    const loadedCount = targetRef.value.data.length
    const hasMore = loadedCount < repoTotal
    targetRef.value.more = hasMore

    if (hasMore) {
      pageRef.value++
    }
  }

  const fetchData = async (url, targetRef, perPage, page) => {
    const params = new URLSearchParams()
    params.append("per", perPage)
    params.append("page", page)

    const timestamp = Date.now()

    try {
      const { data, error } = await useFetchApi(`${url}?${params}&_t=${timestamp}`).json()

      if (error.value) {
        ElMessage({
          message: error.value.msg,
          type: "warning"
        })
        return null
      }

      if (perPage === INITIAL_PER_PAGE) {
        if (targetRef === mcps) {
          if (data.value.data) {
            targetRef.value = data.value.data
            targetRef.value.more = data.value.data.total > perPage 
          }
        } else {
          targetRef.value = data.value
          targetRef.value.more = data.value.total > perPage
        }
      } else {
        const pageRef = getPageRef(targetRef)
        const isFirstExpand = pageRef.value === 1 && perPage === PER_PAGE
        updatePageAndData(data.value, targetRef, pageRef, isFirstExpand)
      }

      return data.value
    } catch (error) {
      console.log(error)
      return null
    }
  }

  const getPageRef = (targetRef) => {
    if (targetRef === collections) return collectionsPage
    if (targetRef === models) return modelsPage
    if (targetRef === datasets) return datasetsPage
    if (targetRef === codes) return codesPage
    if (targetRef === prompts) return promptsPage
    if (targetRef === spaces) return spacesPage
    if (targetRef === mcps) return mcpsPage
  }

  const fetchMore = async (targetRef, type) => {
    const pageRef = getPageRef(targetRef)
    const url = reposUrl(type)
    const currentLoadedCount = targetRef.value.data?.length || 0

    if (currentLoadedCount <= INITIAL_PER_PAGE) {
      await fetchData(url, targetRef, PER_PAGE, 1)
    } else {
      await fetchData(url, targetRef, PER_PAGE, pageRef.value)
    }
  }

  const fetchMoreCollections = () => fetchMore(collections, "collections")
  const fetchMoreModels = () => fetchMore(models, "models")
  const fetchMoreDatasets = () => fetchMore(datasets, "datasets")
  const fetchMoreSpaces = () => fetchMore(spaces, "spaces")
  const fetchMoreCodes = () => fetchMore(codes, "codes")
  const fetchMorePrompts = () => fetchMore(prompts, "prompts")
  const fetchMoreMcp = () => fetchMore(mcps, "mcps")


  const handlePopState = () => {
    if (isLoading.value) {
      return
    }

    const now = Date.now()
    if (now - lastFetchTime.value < FETCH_DEBOUNCE_TIME) {
      return
    }

    getProfileRepoData()
  }

  onMounted(() => {
    getProfileRepoData()
    
    window.addEventListener('popstate', handlePopState)
  })

  onUnmounted(() => {
    window.removeEventListener('popstate', handlePopState)
  })
</script>

<style scoped>
:deep(.tabCont) {
  .el-tabs__header {
    margin: 0;
  }
  .el-tabs__nav-wrap::after {
    height: 1px;
    background-color: #e5e7eb;
  }
  .el-tabs__item {
    font-size: 14px !important;
    color: #667085 !important;
    padding-bottom: 12px;
    height: auto;
    line-height: normal;
    &:hover {
      color: #223B99 !important;
    }
    &.is-active {
      color: #223B99 !important;
      font-weight: 500;
    }
  }
  .el-tabs__active-bar {
    background-color: #223B99 !important;
    height: 2px !important;
  }
}
</style>
