<template>
  <div class="sm:w-[100%] sm:mt-[36px]">
    <!-- models -->
    <div>
      <h3 class="text-[20px] text-[#303133] flex items-center gap-[8px]">
        <SvgIcon name="models" width="18" height="18" />
        <span>{{ $t("organization.model") }}</span>
      </h3>
      <div v-if="hasModels" class="grid grid-cols-2 xl:grid-cols-1 gap-4 mb-4 mt-[16px]">
        <repo-item v-for="model in models.data" :repo="model" repo-type="model"></repo-item>
      </div>
      <div v-else class="flex flex-wrap gap-4 mb-4 mt-[16px]">
        {{ $t("all.noData") }}
      </div>
      <view-more v-if="moreModels" target="models" @view-more-targets="viewMoreTargets"></view-more>
      <el-skeleton class="pr-6" v-if="modelsLoading" :rows="2" animated />
    </div>

    <!-- datasets -->
    <div class="mt-[32px]">
      <h3 class="text-[20px] text-[#303133] flex items-center gap-[8px]">
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
        v-if="moreDatasets"
        target="datasets"
        @view-more-targets="viewMoreTargets"
      ></view-more>
      <el-skeleton class="pr-6" v-if="datasetsLoading" :rows="2" animated />
    </div>

    <!-- code repo -->
    <div class="mt-[32px]">
      <h3 class="text-[20px] text-[#303133] flex items-center gap-[8px]">
        <SvgIcon name="codes" width="18" height="18" />
        <span>{{ $t("organization.code") }}</span>
      </h3>
      <div v-if="hasCodes" class="grid grid-cols-2 xl:grid-cols-1 gap-4 mb-4 mt-[16px]">
        <repo-item v-for="code in codes.data" :repo="code" repo-type="code"></repo-item>
      </div>
      <div v-else class="flex flex-wrap gap-4 mb-4 mt-[16px]">
        {{ $t("all.noData") }}
      </div>
      <view-more v-if="moreCodes" target="codes" @view-more-targets="viewMoreTargets"></view-more>
      <el-skeleton class="pr-6" v-if="codeLoading" :rows="2" animated />
    </div>

    <!-- spaces -->
    <div class="mt-[32px]">
      <h3 class="text-[20px] text-[#303133] flex items-center gap-[8px]">
        <SvgIcon name="spaces" width="18" height="18" />
        <span>{{ $t("organization.space") }}</span>
      </h3>
      <div v-if="hasSpaces" class="grid grid-cols-2 lg:grid-cols-1 gap-4 mb-4 mt-[16px]">
        <application-space-item v-for="repo in spaces.data" :repo="repo" repo-type="space" />
      </div>
      <div v-else class="flex flex-wrap gap-4 mb-4 mt-[16px]">
        {{ $t("all.noData") }}
      </div>
      <view-more v-if="moreSpaces" target="spaces" @view-more-targets="viewMoreTargets"></view-more>
      <el-skeleton class="pr-6" v-if="spacesLoading" :rows="2" animated />
    </div>

    <!-- endpoints -->
    <div v-if="hasEndpoints" class="mt-[32px]">
      <h3 class="text-[20px] text-[#303133] flex items-center gap-[8px]">
        <SvgIcon name="endpoint" width="18" height="18" />
        <span>{{ $t("endpoints.title") }}</span>
      </h3>
      <div v-if="hasEndpoints" class="grid grid-cols-2 lg:grid-cols-1 gap-4 mb-4 mt-[16px]">
        <EndpointItem v-for="endpoint in endpoints.data" :endpoint="endpoint" :namespace="name" />
      </div>
      <div v-else class="flex flex-wrap gap-4 mb-4 mt-[16px]">
        {{ $t("all.noData") }}
      </div>
      <view-more
        v-if="moreEndpoints"
        target="endpoints"
        @view-more-targets="viewMoreTargets"
      ></view-more>
      <el-skeleton class="pr-6" v-if="endpointsLoading" :rows="2" animated />
    </div>
  </div>
</template>

<script setup>
  import { computed, ref, inject } from "vue"
  import RepoItem from "./RepoItem.vue"
  import ApplicationSpaceItem from "../application_spaces/ApplicationSpaceItem.vue"
  import EndpointItem from "../endpoints/EndpointItem.vue"
  import ViewMore from "./ViewMore.vue"
  import { useI18n } from "vue-i18n"
  import jwtFetch from "../../packs/jwtFetch"
  import { ElMessage } from "element-plus"

  const props = defineProps({
    modelList: Object,
    datasetList: Object,
    spaceList: Object,
    codeList: Object,
    endpointList: Object,
    name: String,
    initiator: String
  })

  const { t } = useI18n()
  const models = ref(props.modelList)
  const datasets = ref(props.datasetList)
  const codes = ref(props.codeList)
  const spaces = ref(props.spaceList)
  const endpoints = ref(props.endpointList)
  const modelsLoading = ref(false)
  const datasetsLoading = ref(false)
  const codeLoading = ref(false)
  const spacesLoading = ref(false)
  const endpointsLoading = ref(false)

  const hasModels = computed(() => props.modelList?.total > 0)
  const hasDatasets = computed(() => props.datasetList?.total > 0)
  const hasCodes = computed(() => props.codeList?.total > 0)
  const hasSpaces = computed(() => props.spaceList?.total > 0)
  const hasEndpoints = computed(() => props.endpointList?.total > 0)

  const moreModels = ref(props.modelList?.total > 6)
  const moreDatasets = ref(props.datasetList?.total > 6)
  const moreCodes = ref(props.codeList?.total > 6)
  const moreSpaces = ref(props.spaceList?.total > 6)
  const moreEndpoints = ref(props.endpointList?.total > 6)

  const prefixPath =
    document.location.pathname.split("/")[1] === "organizations" ? "organization" : "user"
  const csghubServer = inject("csghubServer")

  const viewMoreTargets = (target) => {
    if (target === "models") {
      modelsLoading.value = true
      fetchMoreModels()
    } else if (target === "datasets") {
      datasetsLoading.value = true
      fetchMoreDatasets()
    } else if (target === "spaces") {
      spacesLoading.value = true
      fetchMoreSpaces()
    } else if (target === "codes") {
      codeLoading.value = true
      fetchMoreCodes()
    } else if (target === "endpoints") {
      endpointsLoading.value = true
      fetchMoreEndpoints()
    }
  }

  const reposUrl = (type) => {
    switch (props.initiator) {
      case "likes":
        return `${csghubServer}/api/v1/${prefixPath}/${props.name}/likes/${type}`
      case "profile":
      default:
        if (type === "endpoints") {
          return `${csghubServer}/api/v1/${prefixPath}/${props.name}/run/model`
        } else {
          return `${csghubServer}/api/v1/${prefixPath}/${props.name}/${type}`
        }
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

  const fetchMoreEndpoints = async () => {
    const url = reposUrl("endpoints")
    await fetchData(url, endpoints, props.endpointList.total)
    moreEndpoints.value = false
  }

  const fetchData = async (url, targetRef, total) => {
    const params = new URLSearchParams()
    params.append("per", total)
    params.append("page", 1)

    jwtFetch(`${url}?${params}`)
      .then((response) => {
        if (!response.ok) {
          ElMessage({
            message: t("all.loadError"),
            type: "warning"
          })
        } else {
          response.json().then((data) => {
            targetRef.value = data
          })
        }
      })
      .catch((error) => {
        console.error(error)
      })
      .finally(() => {
        if (targetRef === models) {
          modelsLoading.value = false
        } else if (targetRef === datasets) {
          datasetsLoading.value = false
        } else if (targetRef === codes) {
          codeLoading.value = false
        } else if (targetRef === spaces) {
          spacesLoading.value = false
        } else if (targetRef === endpoints) {
          endpointsLoading.value = false
        }
      })
  }
</script>
