<template>
  <div class="evaluation-detail md:px-5">
    <div class="bg-gray-25 border-b border-gray-200">
      <div class="max-w-[1280px] m-auto py-8">
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

        <div class="flex items-center gap-5 mb-4">
          <div class="flex items-center">
            <div class="text-gray-500 text-base mr-1">
              {{ $t('evaluation.detail.creationTime') }}:
            </div>
            <div class="text-gray-700 text-base">
              {{ formatDate(evaluation.submit_time) }}
            </div>
          </div>
          <SvgIcon name="vertical_divider" />
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
                class="text-brand-700 underline"
              >
                {{ evaluation.repo_ids[0].split('/')[1] }}
              </a>
            </div>
          </div>
        </div>

        <div class="mb-4">
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

    <div class="max-w-[1280px] m-auto bg-white pt-4">
      <el-tabs
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
            :data="getTableData(tab.name)"
            :border="true"
            header-row-class-name="evaluation-table-header-row"
            header-cell-class-name="evaluation-table-header-cell"
            row-class-name="evaluation-table-row"
            cell-class-name="evaluation-table-row-cell"
            class="evaluation-table mt-6 mb-10 rounded-xl"
          >
            <el-table-column
              prop="dataset"
              :label="$t('evaluation.detail.dataset')"
            />
            <el-table-column
              prop="metric"
              :label="$t('evaluation.detail.metrics')"
            />
            <el-table-column
              prop="score"
              :label="$t('evaluation.detail.scores')"
              :sortable="true"
              :sort-method="
                (a, b) => {
                  return parseFloat(a.score) > parseFloat(b.score) ? 1 : -1
                }
              "
            />
            <template #empty>
              <span v-if="error">{{ error }}</span>
              <span v-else>{{ $t('common.noData') }}</span>
            </template>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted, computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { ElMessage } from 'element-plus'
  import useFetchApi from '@/packs/useFetchApi'
  import { formatDate } from '@/packs/datetimeUtils'

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

  const groupedDatasets = computed(() => {
    return categories.value.map((category) => ({
      name: locale.value === 'en' ? category.name : category.show_name,
      datasets:
        evaluation.value.datasets
          ?.filter((d) => d.tags.some((t) => t.name === category.name))
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

  const getTableData = (tab) => {
    if (!evaluationResult.value?.summary) return []

    const source =
      tab === 'all'
        ? evaluationResult.value.summary.data
        : evaluationResult.value[tab]?.data

    return (
      source?.map((item) => ({
        dataset: item.dataset,
        metric: item.metric,
        score: item[scoresKey.value]
      })) || []
    )
  }

  const handleTabClick = (tab) => {
    activeName.value = tab.props.name
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

  const fetchEvaluation = async () => {
    try {
      loading.value = true
      const { data } = await useFetchApi(
        `/evaluations/${props.evaluationId}`
      ).json()

      if (!data.value) {
        throw new Error(data.value?.msg || 'Failed to fetch evaluation')
      }

      evaluation.value = data.value.data

      if (evaluation.value.result_url) {
        const result = await fetch(evaluation.value.result_url)
        evaluationResult.value = await result.json()
        scoresKey.value = getScoresKey(evaluationResult.value)
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

  .evaluation-table
    .evaluation-table-header-row
    .evaluation-table-header-cell:nth-child(1) {
    border-left: 1px solid #eaecf0;
    border-top-left-radius: 12px;
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
