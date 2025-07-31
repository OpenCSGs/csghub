<template>
  <div class="sm:w-[100%] sm:mt-[36px]">
    <!-- title -->
    <div class="mb-6">
      <h1 class="text-lg font-medium text-gray-900 mb-5">
        {{ initiator === 'likes' ? $t('profile.likes') : $t('profile.title') }}
      </h1>
      <div class="h-[1px] bg-gray-200"></div>
    </div>

    <!-- collections -->
    <div>
      <h3 class="text-xl text-gray-700 flex items-center gap-[8px]">
        <SvgIcon name="collections" width="18" height="18" />
        <span>{{ $t("collections.collection") }}</span>
      </h3>
      <div v-if="hasCollections" class="mb-4 mt-[16px]">
        <CollectionCards
          v-if="collections.data.length > 0"
          :collections="collections.data"
        />
      </div>
      <div v-else class="flex flex-wrap gap-4 mb-4 mt-[16px]">
        {{ $t("all.noData") }}
      </div>
      <view-more v-if="collections.more" target="collections" @view-more-targets="viewMoreTargets"></view-more>
      <el-skeleton class="pr-6" v-if="collectionsLoading" :rows="2" animated />
    </div>

    <!-- models -->
    <div>
      <h3 class="text-xl text-gray-700 flex items-center gap-[8px]">
        <SvgIcon name="models" width="18" height="18" />
        <span>{{ $t("organization.model") }}</span>
      </h3>
      <div v-if="hasModels" class="grid grid-cols-2 xl:grid-cols-1 gap-4 mb-4 mt-[16px]">
        <repo-item v-for="model in models.data" :repo="model" repo-type="model"></repo-item>
      </div>
      <div v-else class="flex flex-wrap gap-4 mb-4 mt-[16px]">
        {{ $t("all.noData") }}
      </div>
      <view-more v-if="models.more" target="models" @view-more-targets="viewMoreTargets"></view-more>
      <el-skeleton class="pr-6" v-if="modelsLoading" :rows="2" animated />
    </div>

    <!-- datasets -->
    <div class="mt-[32px]">
      <h3 class="text-xl text-gray-700 flex items-center gap-[8px]">
        <SvgIcon name="datasets" width="18" height="18" />
        <span>{{ $t("organization.dataset") }}</span>
      </h3>
      <div v-if="hasDatasets" class="grid grid-cols-2 xl:grid-cols-1 gap-4 mb-4 mt-[16px]">
        <repo-item v-for="dataset in datasets.data" :repo="dataset" repo-type="dataset"></repo-item>
      </div>
      <div v-else class="flex flex-wrap gap-4 mb-4 mt-[16px]">
        {{ $t("all.noData") }}
      </div>
      <view-more
        v-if="datasets.more"
        target="datasets"
        @view-more-targets="viewMoreTargets"
      ></view-more>
      <el-skeleton class="pr-6" v-if="datasetsLoading" :rows="2" animated />
    </div>

    <!-- code repo -->
    <div class="mt-[32px]">
      <h3 class="text-xl text-gray-700 flex items-center gap-[8px]">
        <SvgIcon name="codes" width="18" height="18" />
        <span>{{ $t("organization.code") }}</span>
      </h3>
      <div v-if="hasCodes" class="grid grid-cols-2 xl:grid-cols-1 gap-4 mb-4 mt-[16px]">
        <repo-item v-for="code in codes.data" :repo="code" repo-type="code"></repo-item>
      </div>
      <div v-else class="flex flex-wrap gap-4 mb-4 mt-[16px]">
        {{ $t("all.noData") }}
      </div>
      <view-more v-if="codes.more" target="codes" @view-more-targets="viewMoreTargets"></view-more>
      <el-skeleton class="pr-6" v-if="codeLoading" :rows="2" animated />
    </div>

    <!-- spaces -->
    <div class="mt-[32px]">
      <h3 class="text-xl text-gray-700 flex items-center gap-[8px]">
        <SvgIcon name="spaces" width="18" height="18" />
        <span>{{ $t("organization.space") }}</span>
      </h3>
      <div v-if="hasSpaces" class="grid grid-cols-2 xl:grid-cols-1 gap-4 mb-4 mt-[16px]">
        <application-space-item v-for="repo in spaces.data" :repo="repo" repo-type="space" />
      </div>
      <div v-else class="flex flex-wrap gap-4 mb-4 mt-[16px]">
        {{ $t("all.noData") }}
      </div>
      <view-more v-if="spaces.more" target="spaces" @view-more-targets="viewMoreTargets"></view-more>
      <el-skeleton class="pr-6" v-if="spacesLoading" :rows="2" animated />
    </div>

    <!-- mcp repo -->
    <div class="mt-[32px]">
      <h3 class="text-xl text-gray-700 flex items-center gap-[8px]">
        <SvgIcon name="space_mcp" width="18" height="18" />
        <span>{{ $t("mcps.title") }}</span>
      </h3>
      <div v-if="hasMcps" class="grid grid-cols-2 xl:grid-cols-1 gap-4 mb-4 mt-[16px]">
        <mcp-item v-for="mcp in mcps.data" :mcp="mcp" />
      </div>
      <div v-else class="flex flex-wrap gap-4 mb-4 mt-[16px]">
        {{ $t("all.noData") }}
      </div>
      <view-more v-if="mcps.more" target="mcps" @view-more-targets="viewMoreTargets"></view-more>
      <el-skeleton class="pr-6" v-if="mcpsLoading" :rows="2" animated />
    </div>
  </div>
</template>

<script setup>
  import { computed, ref, onMounted, watch, onUnmounted } from "vue"
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
  const collections = ref({})
  const models = ref({})
  const datasets = ref({})
  const codes = ref({})
  const spaces = ref({})
  const mcps = ref({})
  const collectionsLoading = ref(false)
  const modelsLoading = ref(false)
  const datasetsLoading = ref(false)
  const codeLoading = ref(false)
  const spacesLoading = ref(false)
  const mcpsLoading = ref(false)

  const collectionsPage = ref(1)
  const modelsPage = ref(1)
  const datasetsPage = ref(1)
  const codesPage = ref(1)
  const spacesPage = ref(1)
  const mcpsPage = ref(1)

  const PER_PAGE = 50
  const INITIAL_PER_PAGE = 6

  const hasCollections = computed(() => collections.value?.data?.length > 0)
  const hasModels = computed(() => models.value?.data?.length > 0)
  const hasDatasets = computed(() => datasets.value?.data?.length > 0)
  const hasCodes = computed(() => codes.value?.data?.length > 0)
  const hasSpaces = computed(() => spaces.value?.data?.length > 0)
  const hasMcps = computed(() => mcps.value?.data?.length > 0)

  const prefixPath =
    document.location.pathname.split("/")[1] === "organizations" ? "organization" : "user"

  const isLoading = ref(false)
  const lastFetchTime = ref(0)
  const FETCH_DEBOUNCE_TIME = 1000

  const getProfileRepoData = async () => {
    // 防止重复请求
    if (isLoading.value) {
      return
    }
    
    isLoading.value = true
    lastFetchTime.value = Date.now()
    
    try {
      const collectionsUrl = reposUrl("collections")
      const modelsUrl = reposUrl("models")
      const datasetsUrl = reposUrl("datasets")
      const spacesUrl = reposUrl("spaces")
      const codesUrl = reposUrl("codes")
      const promptsUrl = reposUrl("prompts")
      const mcpsUrl = reposUrl("mcps")

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
        break
      case "models":
        modelsLoading.value = true
        await fetchMoreModels()
        modelsLoading.value = false
        break
      case "datasets":
        datasetsLoading.value = true
        await fetchMoreDatasets()
        datasetsLoading.value = false
        break
      case "spaces":
        spacesLoading.value = true
        await fetchMoreSpaces()
        spacesLoading.value = false
        break
      case "codes":
        codeLoading.value = true
        await fetchMoreCodes()
        codeLoading.value = false
        break
      case "mcps":
        mcpsLoading.value = true
        await fetchMoreMcp()
        mcpsLoading.value = false
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

  const updatePageAndData = (response, targetRef, pageRef) => {
    if (!targetRef.value.data || pageRef.value === 1) {
      targetRef.value.data = []
    }
    const addData = targetRef === mcps ? response.data.data : response.data
    targetRef.value.data = [...targetRef.value.data, ...addData]
    const repoTotal = targetRef === mcps ? response.data.total : response.total
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

    try {
      const { data, error } = await useFetchApi(`${url}?${params}`).json()

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
        updatePageAndData(data.value, targetRef, getPageRef(targetRef))
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
    if (targetRef === spaces) return spacesPage
    if (targetRef === mcps) return mcpsPage
  }

  const fetchMore = async (targetRef, type) => {
    const pageRef = getPageRef(targetRef)
    const url = reposUrl(type)
    await fetchData(url, targetRef, PER_PAGE, pageRef.value)
  }

  const fetchMoreCollections = () => fetchMore(collections, "collections")
  const fetchMoreModels = () => fetchMore(models, "models")
  const fetchMoreDatasets = () => fetchMore(datasets, "datasets")
  const fetchMoreSpaces = () => fetchMore(spaces, "spaces")
  const fetchMoreCodes = () => fetchMore(codes, "codes")
  const fetchMoreMcp = () => fetchMore(mcps, "mcps")

  onMounted(() => {
    getProfileRepoData()
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
  })

  onUnmounted(() => {
    document.removeEventListener('visibilitychange', handleVisibilityChange)
  })

  const handleVisibilityChange = () => {
    if (!document.hidden) {
      if (isLoading.value) {
        return
      }
      
      const now = Date.now()
      if (now - lastFetchTime.value < FETCH_DEBOUNCE_TIME) {
        return
      }
      
      // 重新获取数据
      getProfileRepoData()
    }
  }
</script>
