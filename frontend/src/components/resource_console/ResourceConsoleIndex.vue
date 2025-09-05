<template>
  <div class="w-full sm:mt-9 py-9 text-gray-900">
    <div class="text-3xl leading-9 mb-6">
      {{ $t("resourceConsole.title") }}
    </div>

    <!-- Quick Navigation Tabs -->
    <el-tabs 
      v-model="activeTab" 
      class="border-b border-gray-200 my-8 tabCont"
    >
      <el-tab-pane 
        name="" 
        :label="`&nbsp;${$t('resourceConsole.allProducts')}&nbsp;`"
      ></el-tab-pane>
      <el-tab-pane 
        v-if="isSaas()"
        name="annual"
        :label="`&nbsp;${$t('resourceConsole.yearMonthResources')}&nbsp;`"
      ></el-tab-pane>
      <el-tab-pane 
        name="finetune"
        :label="`&nbsp;${$t('finetune.title')}&nbsp;`"
      ></el-tab-pane>
      <el-tab-pane 
        name="endpoints" 
        :label="`&nbsp;${$t('endpoints.title')}&nbsp;`"
      ></el-tab-pane>
      <el-tab-pane 
        name="evaluations"
        :label="`&nbsp;${$t('evaluation.list.title')}&nbsp;`"
      ></el-tab-pane>
    </el-tabs>

    <AnnualAndMonthlyBilling v-if="isSaas() && (activeTab === '' || activeTab === 'annual')" />

    <!-- finetunes -->
    <h3 v-if="activeTab === '' || activeTab === 'finetune'" class="text-lg flex justify-between gap-2 mt-8">
      <span class="whitespace-nowrap">{{ $t("finetune.title") }}</span>
      <CsgButton
        class="btn btn-primary btn-sm"
        @click="handleNewClick"
        :name="$t('resourceConsole.new')"
        :svgName="'plus'"
      />
    </h3>
    <div v-if="activeTab === '' || activeTab === 'finetune'" class="mt-4">
      <div v-if="filteredFinetunes.length > 0" class="grid grid-cols-2 xl:grid-cols-1 gap-4 mb-8 mt-4">
        <FinetuneItem v-for="finetune in filteredFinetunes" :repo="finetune" repo-type="finetune" />
      </div>
      <div v-else class="flex flex-wrap gap-4 mb-8 mt-4">
        {{ $t("all.noData") }}
      </div>
      <view-more v-if="finetunes.more" target="finetunes" @view-more-targets="viewMoreTargets"></view-more>
      <el-skeleton class="pr-6" v-if="finetunesLoading" :rows="2" animated />
    </div>

    <!-- endpoints -->
    <h3 v-if="activeTab === '' || activeTab === 'endpoints'" class="text-lg flex justify-between gap-2 mt-8">
      <span class="whitespace-nowrap">{{ $t("endpoints.title") }}</span>
      <CsgButton
        class="btn btn-primary btn-sm"
        @click="handleNewClick"
        :name="$t('resourceConsole.new')"
        :svgName="'plus'"
      />
    </h3>
    <div v-if="activeTab === '' || activeTab === 'endpoints'" class="mt-4 w-full">
      <div v-if="filteredEndpoints.length > 0" class="grid grid-cols-2 lg:grid-cols-1 gap-4 mb-8 mt-4">
        <EndpointItem v-for="endpoint in filteredEndpoints" :endpoint="endpoint" :namespace="name" />
      </div>
      <div v-else class="flex flex-wrap gap-4 mb-8 mt-4">
        {{ $t("all.noData") }}
      </div>
      <view-more
        v-if="endpoints.more"
        target="endpoints"
        @view-more-targets="viewMoreTargets"
      ></view-more>
      <el-skeleton class="pr-6" v-if="endpointsLoading" :rows="2" animated />
    </div>

    <!-- evaluations -->
    <h3 v-if="activeTab === '' || activeTab === 'evaluations'" class="text-lg flex justify-between gap-2 mt-8">
      <span class="whitespace-nowrap">{{ $t("evaluation.list.title") }}</span>
      <CsgButton
        class="btn btn-primary btn-sm"
        @click="handleNewClick"
        :name="$t('evaluation.list.new')"
        :svgName="'plus'"
      />
    </h3>
    <div v-if="activeTab === '' || activeTab === 'evaluations'" class="mt-4 w-full">
      <EvaluationTable :evaluations="filteredEvaluations" />
    </div>
  </div>
</template>

<script setup>
  import { computed, ref, watch, inject, onMounted } from "vue"
  import useUserStore from '../../stores/UserStore.js'
  import FinetuneItem from "../shared/FinetuneItem.vue"
  import ViewMore from "../shared/ViewMore.vue"
  import EndpointItem from "../endpoints/EndpointItem.vue"
  import EvaluationTable from "./EvaluationTable.vue"
  import useFetchApi from "../../packs/useFetchApi"
  import { ElMessage } from "element-plus"
  import { isSaas } from "../../packs/config.js"
  import CsgButton from "../shared/CsgButton.vue"
  import { useI18n } from 'vue-i18n'

  const props = defineProps({
    name: String
  })

  const { t: $t } = useI18n()

  const handleNewClick = (event) => {
    // 获取最近的标题元素
    const titleElement = event.target.closest('h3')
    if (!titleElement) return

    // 根据标题内容判断类型
    const titleText = titleElement.textContent.trim()
    if (titleText.includes($t("finetune.title"))) {
      window.location.href = '/finetune/new'
    } else if (titleText.includes($t("endpoints.title"))) {
      window.location.href = '/endpoints/new'
    } else if (titleText.includes($t("evaluation.list.title"))) {
      window.location.href = '/evaluations/new'
    }
  }

  const userStore = useUserStore()
  const defaultTotal = 6
  const endpoints = ref([])
  const finetunes = ref([])
  const evaluations = ref([])
  const activeTab = ref('')

  const endpointsLoading = ref(false)
  const finetunesLoading = ref(false)

  const hasEndpoints = computed(() => endpoints.value?.total > 0)
  const hasFinetune = computed(() => finetunes.value?.total > 0)

  const filteredFinetunes = computed(() => finetunes.value?.data || [])
  const filteredEndpoints = computed(() => endpoints.value?.data || [])
  const filteredEvaluations = computed(() => evaluations.value?.data || [])

  const csghubServer = inject("csghubServer")

  const getRepoData = async () =>{
    const promises = [];
    const endpointsUrl = reposUrl("endpoints")
    promises.push(fetchData(endpointsUrl, endpoints, defaultTotal, 'endpoints'));
    const finetunesUrl = reposUrl("finetunes")
    promises.push(fetchData(finetunesUrl, finetunes, defaultTotal));
    await Promise.all(promises);
  }

  const reposUrl = (type) => {
    if (type === "endpoints") {
      return `${csghubServer}/api/v1/user/${userStore.username}/run/model`
    } else if (type === "finetunes") {
      return `${csghubServer}/api/v1/user/${userStore.username}/finetune/instances`
    } else {
      return `${csghubServer}/api/v1/user/${userStore.username}/${type}`
    }
  }

  const viewMoreTargets = (target) => {
    if (target === "endpoints") {
      endpointsLoading.value = true
      fetchMoreEndpoints()
    } else if (target === "finetunes") {
      finetunesLoading.value = true
      fetchMoreFinetunes()
    }
  }

  const fetchMoreEndpoints = async () => {
    const url = reposUrl("endpoints")
    await fetchData(url, endpoints, endpoints.value.total, 'endpoints')
  }

  const fetchMoreFinetunes = async () => {
    const url = reposUrl("finetunes")
    await fetchData(url, finetunes, finetunes.value.total, 'finetunes')
  }

  const fetchData = async (url, targetRef, total, type) => {
    const params = new URLSearchParams()
    params.append("per", total)
    params.append("page", 1)
    if(type=='endpoints'){
      params.append("deploy_type", 1)
    }

    try {
      const { data, error } = await useFetchApi(`${url}?${params}`).json()
      if (error.value) {
        ElMessage({
          message: error.value.msg,
          type: "warning"
        })
      } else {
        targetRef.value = data.value
        if(targetRef.value?.total > 6 && total === 6){
          targetRef.value.more = true
        }else if(total > 6){
          targetRef.value.more = false
        }
      }
    } catch (error) {
      console.log(error)
    } finally {
      if (targetRef === finetunes) {
        finetunesLoading.value = false
      } else if (targetRef === endpoints) {
        endpointsLoading.value = false
      }
    }
  }

  watch(
    () => userStore.initialized,
    () => {
      getRepoData()
    }
  )


  onMounted(() => {
    if (userStore.initialized) {
      getRepoData()
    }
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
