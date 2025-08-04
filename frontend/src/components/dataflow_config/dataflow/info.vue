<template>
  <div class="text-left w-full h-full pl-8 py-8 overflow-auto bg-white">
    <div class="headerMenu flex items-center justify-start mb-[20px]">
      <SvgIcon
        class="w-5 h-5"
        name="dataflow_homeIcon"
      />
      <SvgIcon
        class="w-5 h-5 mx-2"
        name="dataflow_homeIcon_divider"
      />
      <p
        class="text-gray-700 text-sm font-medium cursor-pointer hover:text-brand-700"
        @click="navigateToPage"
      >
        {{ t('dataPipelines.dataProcessing') }}
      </p>
      <SvgIcon
        class="w-5 h-5 mx-2"
        name="dataflow_homeIcon_divider"
      />
      <p class="text-brand-700 text-sm font-medium">
        {{ t('dataPipelines.processingResult') }}
      </p>
    </div>
    <div class="flex items-center justify-start gap-1">
      <SvgIcon
        class="w-6 h-6 cursor-pointer"
        name="dataflow_backIcon"
        @click="geback"
      />
      <p class="text-gray-900 text-3xl font-medium">
        {{ t('dataPipelines.processingResult') }}
      </p>
    </div>
    <div
      class="mainOption my-6 grid grid-cols-4 lg:grid-cols-3 md:grid-cols-2 xs:grid-cols-1 items-start justify-between gap-14 lg:gap-3.5"
    >
      <div>
        <div class="flex items-center justify-start gap-2 mb-4">
          <p class="text-gray-700 text-sm font-medium textContP">
            {{ t('dataPipelines.taskName') }}：
          </p>
          <p class="text-gray-600 text-sm font-light textContValueP">
            {{ jobInfo.job_name }}
          </p>
        </div>
        <div class="flex items-center justify-start gap-2">  
          <p class="text-gray-700 text-sm font-medium textContP">
            {{ t('dataPipelines.createTime') }}：
          </p>
          <el-tooltip
            :content="jobInfo.date_posted
                ? convertUtcToLocalTime(jobInfo.date_posted)
                : '-'"
            placement="top"
            effect="dark"
          >
            <p class="text-gray-600 text-sm font-light textContValueP">
              {{
                jobInfo.date_posted
                  ? convertUtcToLocalTime(jobInfo.date_posted)
                  : '-'
              }}
            </p>
          </el-tooltip>
        </div>
      </div>
      <div>
        <div class="flex items-center justify-start gap-2 mb-4">
          <p class="text-gray-700 text-sm font-medium textContP">
            {{ t('dataPipelines.dataAmount') }}：
          </p>
          <p class="text-gray-600 text-sm font-light textContValueP">
            {{ jobInfo.data_count || 0 }}
          </p>
        </div>
        <div class="flex items-center justify-start gap-2">
          <p class="text-gray-700 text-sm font-medium textContP">
            {{ t('dataPipelines.finishTime') }}：
          </p>
          <el-tooltip
            :content="jobInfo.date_finish
                ? convertUtcToLocalTime(jobInfo.date_finish)
                : '-'"
            placement="top"
            effect="dark"
          >
            <p class="text-gray-600 text-sm font-light textContValueP">
              {{
                jobInfo.date_finish
                  ? convertUtcToLocalTime(jobInfo.date_finish)
                  : '-'
              }}
            </p>
          </el-tooltip>
        </div>
      </div>
      <div>
        <div class="flex items-center justify-start gap-2 mb-4">
          <p class="text-gray-700 text-sm font-medium textContP">
            {{ t('dataPipelines.dataSource') }}：
          </p>
          <el-tooltip
            :content="`${jobInfo.repo_id || '-'}>${jobInfo.branch || '-'}`"
            placement="top"
            effect="dark"
          >
            <p class="text-sm font-light textContValueP text-brand-600 hover:underline cursor-pointer" @click="toDatasetPage(jobInfo.repo_id,jobInfo.branch)">
              {{ `${jobInfo.repo_id || '-'}>${jobInfo.branch || '-'}` }}
            </p>
          </el-tooltip>
        </div>
        <div class="flex items-center justify-start gap-2">
          <p class="text-gray-700 text-sm font-medium textContP">
            {{ t('dataPipelines.processedDataAmount') }}：
          </p>
          <p class="text-gray-600 text-sm font-light textContValueP">
            {{ jobInfo.process_count || 0 }}
          </p>
        </div>
      </div>
      <div>
        <div class="flex items-center justify-start gap-2 mb-4">
          <p class="text-gray-700 text-sm font-medium textContP">
            {{ t('dataPipelines.dataFlow') }}：
          </p>
          <el-tooltip
            :content="`${jobInfo.export_repo_id || '-'}>${jobInfo.export_branch_name || '-'}`"
            placement="top"
            effect="dark"
          >
            <p class="text-sm font-light textContValueP text-brand-600 hover:underline cursor-pointer" @click="toDatasetPage(jobInfo.export_repo_id,jobInfo.export_branch_name)">
              {{
                `${jobInfo.export_repo_id || '-'}>${
                jobInfo.export_branch_name || '-'
              }`
              }}
            </p>
          </el-tooltip>
        </div>
      </div>
    </div>
    <el-tabs
      v-model="activeTab"
      class="demo-tabs"
      @tab-click="handleClick"
    >
      <el-tab-pane
      v-if="taskType == 'pipeline'"
        :label="t('dataPipelines.processInfo')"
        name="1"
      >
        <div class="borderBox">
          <el-table
            :data="tableData"
            class="rounded tableCont"
            :empty-text="t('dataPipelines.noData')"
            header-cell-class-name="tableHeader"
          >
            <el-table-column
              type="index"
              min-width="120"
              :label="t('dataPipelines.executionOrder')"
            />
            <el-table-column
              prop="name"
              :label="t('dataPipelines.operatorName')"
              width="200"
            />
            <el-table-column
              prop="type"
              :label="t('dataPipelines.operatorType')"
              min-width="200"
            />
            <el-table-column
              prop="description"
              :label="t('dataPipelines.description')"
              min-width="240"
            />
            <el-table-column
              :label="t('dataPipelines.operatorConfiguration')"
              min-width="300"
            >
              <template #default="scope">
                <div v-if="scope.row.params.length > 0">
                  <div
                    v-for="(item, paramIndex) in scope.row.params"
                    :key="paramIndex"
                    class="flex flex-col gap-3 typeItemCont"
                  >
                    <div v-if="item.type == 'from_2_to_20'">
                      <el-slider
                        disabled
                        v-model="scope.row.params[0].value"
                        size="small"
                        :min="2"
                        :max="scope.row.params[1].value"
                        style="width: 98%"
                      />
                      <p class="text-gray-900 text-sm mt-3 mb-5">
                        {{ scope.row.params[0].name }}
                      </p>
                      <el-slider
                        disabled
                        v-model="scope.row.params[1].value"
                        size="small"
                        :min="scope.row.params[0].value"
                        :max="20"
                        style="width: 98%"
                      />
                      <p class="text-gray-900 text-sm mt-3 mb-5">
                        {{ scope.row.params[1].name }}
                      </p>
                    </div>
                    <div
                      v-if="
                        [
                          'FLOAT',
                          'STRING',
                          'INTEGER',
                          'PositiveFloat',
                          'ClosedUnitInterval',
                          'LIST'
                        ].includes(item.type)
                      "
                    >
                      <el-select
                        v-if="
                          item.type == 'STRING' &&
                          Array.isArray(item.option_values)
                        "
                        disabled
                        v-model="item.value"
                        class="w-full"
                        :placeholder="item.name"
                      >
                        <el-option
                          v-for="selItem in item.option_values"
                          :key="selItem.key"
                          :label="selItem.label"
                          :value="selItem.key"
                        />
                      </el-select>
                      <el-input
                        v-if="
                          item.type == 'STRING' &&
                          !Array.isArray(item.option_values)
                        "
                        disabled
                        :placeholder="`${item.name}`"
                        style="width: 100%"
                        v-model="item.value"
                      />
                      <el-input
                        v-if="item.type == 'FLOAT'"
                        disabled
                        type="number"
                        :step="0.01"
                        :precision="2"
                        style="width: 100%"
                        v-model="item.value"
                      />
                      <el-input
                        v-if="item.type == 'INTEGER'"
                        disabled
                        type="number"
                        :min="0"
                        :precision="0"
                        :step="1"
                        style="width: 100%"
                        v-model="item.value"
                      />
                      <el-input
                        v-if="item.type == 'PositiveFloat'"
                        disabled
                        type="number"
                        :min="0"
                        style="width: 100%"
                        v-model="item.value"
                      />
                      <el-slider
                        v-if="item.type == 'ClosedUnitInterval'"
                        disabled
                        size="small"
                        v-model="item.value"
                        :min="0"
                        :max="1"
                        :step="0.01"
                        style="width: 98%"
                      />
                      <div
                        v-if="item.type == 'LIST'"
                        class="flex flex-wrap gap-2 tagInputCont"
                      >
                        <el-tag
                          v-for="tag in item.value"
                          :key="tag"
                          :disable-transitions="false"
                        >
                          {{ tag }}
                        </el-tag>
                      </div>
                      <p class="text-gray-900 text-sm mt-3 mb-5">
                        {{ item.name }}
                      </p>
                    </div>
                    <el-checkbox
                      v-if="item.type == 'BOOLEAN'"
                      disabled
                      v-model="item.value"
                      :label="item.name"
                      class="block my-[10px]"
                    />
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              :label="t('dataPipelines.processStatus')"
              min-width="200"
            >
              <template #default="scope">
                <div
                  v-if="scope.row.status"
                  class="statusBox flex items-center gap-1 px-2 py-1"
                  :class="scope.row.status"
                >
                  <SvgIcon
                    :name="scope.row.status"
                    class="w-3 h-3"
                  />
                  <span class="text-sm">{{
                    t(`dataPipelines.${scope.row.status}`)
                  }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              :label="t('dataPipelines.processedData')"
              min-width="200"
            >
              <template #default="scope">
                <span>{{ scope.row.data_lines || 0 }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
      <el-tab-pane
      v-if="taskType == 'pipeline'"
        :label="t('dataPipelines.sessionProcessedResult')"
        name="2"
      >
        <div class="borderBox">
          <el-table
            :data="sessionData"
            class="rounded tableCont"
            :empty-text="t('dataPipelines.noData')"
            header-cell-class-name="tableHeader"
          >
            <el-table-column
              type="index"
              min-width="100"
              :label="t('dataPipelines.index')"
            />
            <el-table-column
              prop="name"
              :label="t('dataPipelines.operatorName')"
              min-width="200"
            >
            <template #default="scope">
                <div>
                  {{ tableData[scope.$index].name }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              :label="t('dataPipelines.preSession')"
              min-width="240"
            >
              <template #default="scope">
                <div>
                  {{
                    Array.isArray(scope.row.before) &&
                    scope.row.before.length > 0
                      ? JSON.stringify(scope.row.before)
                      : t('dataPipelines.noData')
                  }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="type"
              :label="t('dataPipelines.processType')"
              min-width="150"
            >
              <template #default="scope">
                <div>
                  {{ t(`dataPipelines.${scope.row.op_type}`) }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="new"
              :label="t('dataPipelines.afterSession')"
              min-width="240"
            >
              <template #default="scope">
                <div>
                  {{
                    Array.isArray(scope.row.after) && scope.row.after.length > 0
                      ? JSON.stringify(scope.row.after)
                      : t('dataPipelines.noData')
                  }}
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
      <el-tab-pane
        :label="t('dataPipelines.taskLog')"
        name="3"
      >
        <div class="flex items-center justify-between mb-[16px]">
          <p class="text-gray-900 font-medium text-lg invisible">
            {{ t('dataPipelines.logName') }}
          </p>
          <CsgBtton
            class="btn btn-secondary-gray btn-sm whitespace-nowrap"
            @click="downloadTxt"
            :name="t('dataPipelines.downloadLog')"
          />
        </div>
        <div class="resultBox">
          <pre class="text-gray-50 text-base font-normal"
            >{{ logData }}
          </pre>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
  import { useRouter, useRoute } from 'vue-router'
  import { ref, onMounted, computed } from 'vue'
  import useFetchApi from '../../../packs/useFetchApi'
  import { convertUtcToLocalTime } from '../../../packs/datetimeUtils'
  import zhOps from '../../../locales/zh_js/operator_zh.json'
  import enOps from '../../../locales/en_js/operator_en.json'
  import zhHantOps from '../../../locales/zh_hant_js/operator_zhHant.json'
  import { useI18n } from 'vue-i18n'

  const { t, locale } = useI18n()

  const dataflowOps = {
    zh: zhOps,
    en: enOps,
    zhHant: zhHantOps
  }

  const activeTab = ref('1')
  const jobInfo = ref({})
  const tableData = ref([])
  const sessionData = ref([])
  const logData = ref([])

  const router = useRouter()
  const route = useRoute()
  const infoId = computed(() => {
    return route.query.id
  })
  const taskType = computed(() => {
    return route.query.type
  })
  const toDatasetPage = (path,branch) => {
    if (path) {
      window.location.href=`/datasets/${path}/files?tab=files&branch=${branch || 'main'}`
    }
  }
  const getInfoData = async () => {
    const url = `/dataflow/jobs/${infoId.value}`

    const { data } = await useFetchApi(url).get().json()

    if (data.value) {
      jobInfo.value = data.value?.job
      if (
        data.value.config_content &&
        data.value.config_content.process &&
        Array.isArray(data.value.config_content.process)
      ) {
        let ops = dataflowOps[locale.value]
        tableData.value = [...data.value.config_content.process]
        sessionData.value = tableData.value.map((item) => item.data)
        tableData.value = tableData.value.map((item) => {
          if (ops.hasOwnProperty(item.name)) {
            const op = ops[item.name]
            if (Array.isArray(op.params) && op.params.length > 0) {
              const updatedParams = op.params.map((paramsItem, paramsIndex) => {
                return {
                  ...paramsItem,
                  value: item.params[paramsIndex]?.value ?? paramsItem.value,
                  key: item.params[paramsIndex]?.name ?? paramsItem.name
                }
              })
              return {
                ...item,
                ...op,
                params: updatedParams,
                key: item.name
              }
            }
          }
          return {
            ...item,
            ...(ops.hasOwnProperty(item.name) ? ops[item.name] : item),
            key: item.name
          }
        })
      }
    }
  }
  const getLogData = async () => {
    const url = `dataflow/jobs/log/${infoId.value}`

    const { data } = await useFetchApi(url).get().json()

    if (data.value) {
      logData.value = data.value.session_log
    }
  }
  const navigateToPage = () => {
    router.push('/datapipelines')
  }
  const geback = () => {
    router.go(-1)
  }
  const handleClick = (tab, event) => {
    console.log(tab, event)
  }
  const downloadTxt = () => {
    const content = logData.value
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = `${jobInfo.value.job_name}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  onMounted(() => {
    getInfoData()
    getLogData()
    if(taskType.value!='pipeline'){
      activeTab.value = '3'
    }
  })
</script>
<style lang="less" scoped>
  :deep(.tableCont) {
    .el-button--text {
      background: transparent !important;
    }
  }
  .borderBox {
    border-radius: var(--spacing-lg, 12px);
    border: var(--spacing-none, 1px) solid
      var(--colors-gray-light-mode-200, #eaecf0);
    background: var(--Base-White, #fff);
    box-shadow: 0px 1px 3px 0px rgba(16, 24, 40, 0.1),
      0px 1px 2px 0px rgba(16, 24, 40, 0.06);
    overflow: hidden;
  }
  :deep(.el-table__header) {
    background: var(--Gray-50, #f9fafb);
  }
  :deep(.el-table) {
    .el-table__cell {
      padding: 16px 24px;
    }
  }
  :deep(.tableCont) {
    .el-button--text {
      border: none;
    }
    .el-table__cell {
      font-size: 14px;
      color: #101828;
      font-weight: 400;
    }
  }
  :deep(.tableHeader) {
    font-size: 12px !important;
    font-weight: normal !important;
    color: #475467;
    padding: 12px 24px !important;
    border-bottom: 1px solid var(--colors-gray-light-mode-200, #eaecf0);
    background: var(--Gray-50, #f9fafb) !important;
  }
  :deep(.el-tabs__content) {
    padding-top: 16px !important;
  }
  .demo-tabs > .el-tabs__content {
    padding: 32px;
    color: #6b778c;
    font-size: 32px;
    font-weight: 600;
  }
  .statusBox {
    font-size: 12px;
    border-radius: 16px;
    width: fit-content;
    &.statusBox1 {
      color: #067647;
      border: 1px solid #abefc6;
      background: #ecfdf3;
    }
  }
  .optionBtn {
    border-radius: 8px;
    border: 1px solid #d0d5dd;
    background: #fff;
    box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.05);
    padding: 10px 14px;
    color: #344054;
    font-size: 14px;
    font-weight: 500;
  }
  .resultBox {
    border-radius: 12px;
    background: #0c111d;
    padding: 24px;
    height: 500px;
    overflow-y: auto;
    color: #f9fafb;

    font-family: 'Roboto Mono';
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
  }
  .textContP {
    white-space: nowrap;
  }
  .textContValueP {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 300px;
    display: inline-block;
  }
</style>
