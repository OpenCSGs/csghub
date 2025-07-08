<template>
  <div class="evaluation-detail md:px-5">
    <div class="bg-gray-25 border-b border-gray-200">
      <div class="page-responsive-width m-auto py-8">
        <div class="mb-4 flex items-center justify-between">
          <a
            href="/resource-console"
            class="text-gray-700 text-2xl font-medium flex items-center gap-2"
          >
            <SvgIcon name="chevron_left" />
            {{ evaluation.task_name }}
          </a>
          <a
            v-if="evaluation.download_url"
            download
            :href="evaluation.download_url"
            class="btn btn-primary btn-md"
          >
            <SvgIcon
              name="download"
              class="mr-1"
              style="width: 14px; height: 14px"
            />
            {{ $t('evaluation.detail.download') }}</a
          >
        </div>

        <div class="flex flex-wrap items-center gap-5 mb-4">
          <div class="flex items-center">
            <div class="text-gray-500 text-base mr-1">
              {{ $t('evaluation.detail.evaluationModel') }}:
            </div>
            <div
              class="text-gray-700 text-base"
              v-if="evaluation.repo_ids"
            >
              <a
                :href="`/models/${evaluation.repo_ids[0]}`"
                class="text-brand-700 hover:underline"
              >
                {{ evaluation.repo_ids[0].split('/')[1] }}
              </a>
            </div>
          </div>
          <SvgIcon name="vertical_divider" />
          <div class="flex items-center">
            <div class="text-gray-500 text-base mr-1">
              {{ $t('evaluation.detail.evaluationResource') }}:
            </div>
            <div class="text-gray-700 text-base">
              {{ evaluation.resource_name }}
            </div>
          </div>
          <SvgIcon name="vertical_divider" />
          <div class="flex items-center">
            <div class="text-gray-500 text-base mr-1">
              {{ $t('evaluation.detail.creationTime') }}:
            </div>
            <div class="text-gray-700 text-base">
              {{ formatDate(evaluation.submit_time) }}
            </div>
          </div>
        </div>

        <div
          class="mb-4"
          v-if="!!evaluation.task_desc"
        >
          <span class="text-gray-500 text-base">
            {{ $t('evaluation.detail.desc') }}:
          </span>
          <span class="text-gray-700 text-base">
            {{ evaluation.task_desc }}
          </span>
        </div>

        <div
          class="border border-gray-200 rounded-md px-5 py-4 mb-4 flex flex-col gap-4"
        >
          <template
            v-for="category in groupedDatasets"
            :key="category.name"
          >
            <div
              class="flex items-center gap-4"
              v-if="category.datasets.length"
            >
              <div
                class="border border-gray-300 rounded-sm flex items-center gap-1 px-[6px] py-[2px]"
              >
                <SvgIcon name="dot_black" />
                <div class="text-gray-700 text-xs">{{ category.name }}</div>
              </div>
              <div class="flex items-center gap-3">
                <template
                  v-for="(dataset, index) in category.datasets"
                  :key="dataset"
                >
                  <div class="text-gray-700 text-base">{{ dataset }}</div>
                  <SvgIcon
                    v-if="index < category.datasets.length - 1"
                    name="vertical_divider"
                  />
                </template>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>

    <div class="page-responsive-width m-auto bg-white pt-4">
      <el-tabs
        v-if="evaluationSucceed"
        v-model="activeName"
        @tab-click="handleTabClick"
      >
        <el-tab-pane
          v-for="tab in tabsList"
          :key="tab.name"
          :label="tab.label"
          :name="tab.name"
        >
          <el-table
            v-loading="loading"
            :data="tableDataResult"
            :border="true"
            header-row-class-name="evaluation-table-header-row"
            header-cell-class-name="evaluation-table-header-cell"
            row-class-name="evaluation-table-row"
            cell-class-name="evaluation-table-row-cell"
            class="evaluation-table mt-6 mb-10 rounded-xl"
          >
            <el-table-column
              prop="model" 
              :label="$t('evaluation.detail.model')"
              :min-width="dynamicModelWidth + 'px'"
              class-name="evaluation-model-column" 
              fixed="left"
            />
              <el-table-column 
                v-for="(datasetData, datasetName) in tableDataResult[0]?.dataset || {}" :key="datasetName"
                :label="datasetName"
                header-align="center"
                align="center"
              >
                <el-table-column
                  v-for="(metricItem, index) in datasetData"
                  :key="`${datasetName}-${metricItem}-${index}`"
                  :label="metricItem.metric"
                  :min-width="dynamicMinWidth + 'px'"
                  class-name="evaluation-metric-column"
                >
                  <template #default="{ row }">
                    <div class="line-clamp-3 break-words">
                    {{ 
                      (row.dataset[datasetName] || [])
                        .find(item => item.metric === metricItem.metric)?.score || 0
                    }}
                    </div>
                  </template>
                </el-table-column>
              </el-table-column>
            <template #empty>
              <span v-if="error">{{ error }}</span>
              <span v-else>{{ $t('all.noData') }}</span>
            </template>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <div v-if="!evaluationSucceed" class="handle-error-page flex justify-center items-center">
        <div class="background-pattern w-full py-6 flex flex-col justify-center items-center gap-12" 
             style="background-image: url('/images/evaluation/Background_pattern.svg'); background-size: cover; background-repeat: no-repeat; background-position: center;">
          <div class="flex flex-col justify-center items-center gap-6">
            <SvgIcon
            name="feature_icon"
            width="56"
            height="56"
            />
            <div class="self-stretch inline-flex flex-col justify-start items-center gap-6">
              <div class="self-stretch text-center justify-start text-gray-900 text-4xl font-medium leading-10">{{ $t('evaluation.detail.evaluationFailed') }}</div>
              <div ref="errorLogDiv" class="w-80% h-50% flex-1 overflow-y-auto bg-gray-800 p-6 rounded-xl text-white" style="max-height: 200px; max-width: 720px">
                <p>...</p>
             </div>
            </div>
          </div>
          <div class="inline-flex justify-start items-start gap-3">
            <CsgButton
            class="btn btn-secondary-gray btn-lg"
            @click="goBack"
            :name="$t('evaluation.detail.return')"
          />
            <CsgButton
            class="btn btn-primary btn-lg"
            @click="recreateEvaluation"
            :name="$t('evaluation.detail.recreate')"
          />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted, computed, nextTick, onBeforeUnmount } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { ElMessage } from 'element-plus'
  import useFetchApi from '@/packs/useFetchApi'
  import { formatDate } from '@/packs/datetimeUtils'
  import SvgIcon from '@/components/shared/SvgIcon.vue';

  const props = defineProps({
    evaluationId: {
      type: String,
      required: true
    }
  })

  const { t, locale } = useI18n()

  const evaluation = ref({})
  const evaluationResult = ref({})
  const scoresKey = ref('')
  const activeName = ref('all')
  const loading = ref(false)
  const error = ref('')
  const categories = ref([])
  const evaluationSucceed = ref(true)

  const groupedDatasets = computed(() => {
    return categories.value.map((category) => ({
      name: locale.value === 'en' ? category.name : category.show_name,
      datasets:
        evaluation.value.datasets
          ?.filter((d) => d.tags && Array.isArray(d.tags) && d.tags.some((t) => t.name === category.name))
          .map((d) => d.repo_id.split('/')[1]) || []
    }))
  })

  const datasets = computed(() => {
    if (!evaluationResult.value) return []
    return Object.keys(evaluationResult.value).filter(
      (key) => key !== 'summary'
    )
  })

  const tabsList = computed(() => {
    return [
      { name: 'all', label: t('evaluation.detail.all') },
      ...datasets.value.map((dataset) => ({
        name: dataset,
        label: dataset
      }))
    ]
  })

  const getScoresKey = (result) => {
    if (!result?.summary?.column) return ''
    const keyColumn = result.summary.column.find((col) => !!col.customizeRender)
    return keyColumn?.key || ''
  }

  const tableDataResult = ref([])
  const getTableData = (tab) => {
    if (!evaluationResult.value?.summary) return []

    const source =
      tab === 'all'
        ? evaluationResult.value.summary.data
        : evaluationResult.value[tab]?.data

    let res = source?.map((item) => ({
        model: item.model,
        dataset: item.dataset,
        metric: item.metric,
        score: item.score
      })) || []

    const newres = res.reduce((acc, current) => {
      let modelEntry = acc.find(item => item.model === current.model)
      if (!modelEntry) {
        modelEntry = {
          model: current.model,
          dataset: {}
        }
        acc.push(modelEntry)
      }
      
      if (!modelEntry.dataset[current.dataset]) {
        modelEntry.dataset[current.dataset] = []
      }
      
      modelEntry.dataset[current.dataset].push({
        metric: current.metric,
        score: current.score || 0
      })
      
      return acc
    }, [])

    return newres
  }

  const refreshTableData = (tab) => {
    tableDataResult.value = getTableData(tab)
  }

  const handleTabClick = (tab) => {
    activeName.value = tab.props.name
    refreshTableData(tab.props.name)
  }

  const fetchTags = async () => {
    const { data } = await useFetchApi(
      '/tags?scope=dataset&category=evaluation'
    ).json()

    if (data.value?.data) {
      categories.value = data.value.data
    } else {
      throw new Error('Failed to fetch tags')
    }
  }

  const errorLogDiv = ref(null)
  const errorLogLineNum = ref(0)
  const scrollToBottom = () => {
    if (errorLogDiv) {
      errorLogDiv.value.scrollTop = errorLogDiv.value.scrollHeight
    }
  }

  const appendLog = (refElem, data, refLineNum) => {
    // Create the div element
    const divNode = document.createElement('div')
    divNode.className = 'flex'

    // Create the first p element
    const pNode1 = document.createElement('p')
    pNode1.className = 'pr-6 pt-2'
    pNode1.innerHTML = `${refLineNum.value}:`

    // Create the second p element
    const pNode2 = document.createElement('p')
    pNode2.className = 'pt-2'
    pNode2.innerHTML = `${data.replace(/\\r/g, '<br>')}`

    // Append the p elements to the div element
    divNode.appendChild(pNode1)
    divNode.appendChild(pNode2)

    if (refElem.value) {
      refElem.value.appendChild(divNode)
      refLineNum.value = refLineNum.value + 1
    }
  }

  const goBack = () => {
    window.history.back()
  }

  const recreateEvaluation = () => {
    window.location.href = `/evaluations/new`
  }

  const dynamicMinWidth = ref(288)
  const dynamicModelWidth = ref(320)
  const calculateMinWidth = () => {
    const width = window.innerWidth
    if (width >= 1280) return { metric: 288, model: 320 }
    if (width >= 1024) return { metric: 224, model: 260 }
    if (width >= 768) return { metric: 160, model: 200 }
    if (width >= 640) return { metric: 128, model: 160 }
    return { metric: 128, model: 160 }                    
  }

  const handleResize = () => {
    const widths = calculateMinWidth()
    dynamicMinWidth.value = widths.metric
    dynamicModelWidth.value = widths.model
  }

  const observeResizeEvent = () => {
    window.addEventListener('resize', handleResize)
  }

  const unObserveResizeEvent = () => {
    window.removeEventListener('resize', handleResize)
  }

  const fetchEvaluation = async () => {
    try {
      loading.value = true
      const { data } = await useFetchApi(
        `/evaluations/${props.evaluationId}`
      ).json()

      if (!data.value) {
        throw new Error(data.value?.msg || 'Failed to fetch evaluation')
      }

      const status = data.value.data.status
      if("Failed" === status) {
        evaluationSucceed.value = false
        const reason = data.value.data.reason
        nextTick(() => {
          const lines = reason.split('\n');
          lines.forEach(line => {
            if (line.trim()) {
              appendLog(errorLogDiv, line, errorLogLineNum);
            }
          });
          nextTick(() => {
            scrollToBottom()
          })
        })
      }

      evaluation.value = data.value.data

      if (evaluation.value.result_url) {
        const result = await fetch(evaluation.value.result_url)
        evaluationResult.value = await result.json()
        scoresKey.value = getScoresKey(evaluationResult.value)
        refreshTableData(activeName.value)
      }
    } catch (e) {
      error.value = e.message
      ElMessage({
        message: t('all.fetchError'),
        type: 'error'
      })
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    fetchTags()
    fetchEvaluation()
    handleResize()
    observeResizeEvent()
  })

  onBeforeUnmount(() => {
    unObserveResizeEvent()
  })
</script>

<style scoped>
  .evaluation-table :deep(.el-table__empty-block) {
    border-left: 1px solid #eaecf0;
    border-right: 1px solid #eaecf0;
  }

  .evaluation-table .evaluation-table-header-row .evaluation-table-header-cell {
    padding: 12px 24px;
    font-size: 12px;
    font-weight: 400;
    color: var(--gray-600);
    border-top: 1px solid #eaecf0;
    background-color: #f9fafb;
  }

    .evaluation-table-header-row:not(:first-of-type) {
      .evaluation-table-header-cell {
        &:nth-child(1) {
          border-left: none;
          border-top-left-radius: 0px;
        }
        &:nth-last-child(1) {
          border-top-right-radius: 0px;
        }
        .cell {
          line-height: 18px;
        }
        border-top: none;
      }
    }

    .evaluation-table-row {
      .evaluation-table-row-cell {
        &:nth-child(1) {
          border-left: 1px solid #eaecf0;
        }
        &:nth-last-child(1) {
          border-right: 1px solid #eaecf0;
        }
        .cell {
          line-height: 22px;
        }
        padding: 16px 24px;
        font-size: 14px;
        color: var(--gray-900);
      }
    }

  .evaluation-table
    .evaluation-table-header-row
    .evaluation-table-header-cell:nth-last-child(1) {
    border-right: 1px solid #eaecf0;
    border-top-right-radius: 12px;
  }

  .evaluation-table
    .evaluation-table-header-row
    .evaluation-table-header-cell
    .cell {
    line-height: 18px;
  }

  .evaluation-table .evaluation-table-row .evaluation-table-row-cell {
    padding: 16px 24px;
    font-size: 14px;
    color: var(--gray-900);
  }

  .evaluation-table
    .evaluation-table-row
    .evaluation-table-row-cell:nth-child(1) {
    border-left: 1px solid #eaecf0;
  }

  .evaluation-table
    .evaluation-table-row
    .evaluation-table-row-cell:nth-last-child(1) {
    border-right: 1px solid #eaecf0;
  }

  .evaluation-table .evaluation-table-row .evaluation-table-row-cell .cell {
    line-height: 22px;
  }

  .evaluation-table
    .evaluation-table-row:nth-last-child(1)
    .evaluation-table-row-cell:nth-child(1) {
    border-bottom-left-radius: 12px;
  }

  .evaluation-table
    .evaluation-table-row:nth-last-child(1)
    .evaluation-table-row-cell:nth-last-child(1) {
    border-bottom-right-radius: 12px;
  }
</style>
