<template>
  <div class="text-left w-full h-full pl-8 py-8 overflow-auto bg-white">
    <div class="headerMenu flex items-center justify-start mb-[20px]">
      <SvgIcon class="w-5 h-5" name="dataflow_homeIcon" />
      <SvgIcon class="w-5 h-5 mx-2" name="dataflow_homeIcon_divider" />
      <p class="text-brand-700 text-sm font-medium">
        {{ t("dataPipelines.dataProcessing") }}
      </p>
    </div>
    <p class="text-gray-900 text-3xl font-medium">
      {{ t("dataPipelines.dataProcessing") }}
    </p>
    <p class="text-gray-600 text-md font-light mt-[2px]">
      {{ t("dataPipelines.dataProcessingDescription") }}
    </p>
    <div class="mainOption mt-8">
      <p class="text-gray-700 text-sm mb-1.5">
        {{ t("dataPipelines.searchProcessing") }}
      </p>
      <div class="flex items-center justify-between gap-3 xs:block">
        <el-input
            style="width: 100%"
            v-model="form.searchStr"
            @keyup.enter="handleSearch"
            @clear="handleSearch"
            :placeholder="`${t('dataPipelines.toInput')}${t(
            'dataPipelines.taskName'
          )}`"
            clearable
        ><template #prefix>
          <el-icon class="el-input__icon w-5 h-5"><search /></el-icon>
        </template>
        </el-input>
        <!-- <CsgButton
          class="btn btn-primary btn-sm whitespace-nowrap"
          @click="goToNewTask('/datapipelines/newTask')"
          :name="t('dataPipelines.createTask')"
          :icon="true"
        /> -->
        <CsgButton
            class="btn btn-primary btn-sm whitespace-nowrap"
            @click="goToNewTask('/datapipelines/addDataProcessing')"
            :name="t('dataPipelines.createTask')"
            :icon="true"
        />
      </div>
    </div>
    <div class="borderBox mt-8">
      <div class="py-5 px-6">
        <p class="text-lg text-gray-900 font-medium">
          {{ t("dataPipelines.taskList") }}
        </p>
      </div>
      <div class="flex flex-col">
        <el-table
            :data="tableData"
            class="rounded tableCont"
            :empty-text="t('dataPipelines.noData')"
            header-cell-class-name="tableHeader"
            v-loading="tableLoading"
        >
          <el-table-column
              prop="job_name"
              :label="t('dataPipelines.taskName')"
              min-width="320"
          />
          <el-table-column
              prop="execution_mode"
              :label="t('dataPipelines.executionMode')"
              min-width="140"
          >
            <template #default="scope">
              <span>
                {{ getExecutionMode(scope.row) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
              prop="job_type"
              :label="t('dataPipelines.taskType')"
              min-width="180"
          >
            <template #default="scope">
              {{ t(`dataPipelines.${scope.row.job_type}`) }}
            </template>
          </el-table-column>
          <el-table-column
              :label="t('dataPipelines.processingStatus')"
              min-width="180"
          >
            <template #default="scope">
              <div
                  v-if="scope.row.status"
                  class="statusBox flex items-center gap-1 px-2 py-1"
                  :class="scope.row.status"
              >
                <SvgIcon :name="scope.row.status" class="w-3 h-3" />
                <span class="text-sm">{{ t(`dataPipelines.${scope.row.status}`) }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
              prop="data_source"
              :label="t('dataPipelines.dataSource')"
              min-width="300"
          >
            <template #default="scope">
              <span>{{
                  `${scope.row.repo_id || "-"}>${scope.row.branch || "-"}`
                }}</span>
            </template>
          </el-table-column>
          <el-table-column
              prop="data_target"
              :label="t('dataPipelines.dataFlow')"
              min-width="300"
          >
            <template #default="scope">
              <span>{{
                  `${scope.row.export_repo_id || "-"}>${scope.row.export_branch_name || "-"}`
                }}</span>
            </template>
          </el-table-column>
          <el-table-column
              prop="cluster_name"
              :label="t('dataPipelines.region')"
              min-width="140"
          >
            <template #default="scope">
              <span>{{ scope.row.cluster_name || "-" }}</span>
            </template>
          </el-table-column>
          <el-table-column
              prop="resource_name"
              :label="t('dataPipelines.spaceCloudResources')"
              min-width="200"
          >
            <template #default="scope">
              <span
                  class="truncate inline-block max-w-full"
                  :title="scope.row.resource_name || ''"
              >{{ scope.row.resource_name || "-" }}</span>
            </template>
          </el-table-column>
          <el-table-column
              prop="date_posted"
              :label="t('dataPipelines.startTime')"
              min-width="260"
          >
            <template #default="scope">
              <span>{{ scope.row.date_posted ? convertUtcToLocalTime(scope.row.date_posted) : '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column
              prop="token"
              :label="t('dataPipelines.operations')"
              min-width="320"
              fixed="right"
          >
            <template #default="scope">
              <div class="settingsTableBtn flex items-center justify-start">
                <el-button
                    class="flex items-center justify-start cursor-pointer"
                    type="text"
                    @click="
                    goToNewTask(
                      `/datapipelines/dataflowInfo?id=${scope.row.job_id}&type=${scope.row.job_source}&jobType=${scope.row.job_type}`
                    )
                  "
                >{{ t("dataPipelines.details") }}
                </el-button>
                <el-button
                    type="text"
                    class="flex items-center justify-start cursor-pointer"
                    @click="getLog(scope.row)"
                >{{ t("dataPipelines.log") }}
                </el-button>

                <!-- 取消按钮：Processing 状态 -->
                <el-popconfirm
                    v-if="scope.row.status === 'Processing'"
                    :title="`${t('dataPipelines.cancelExecute')}?`"
                    :confirm-button-text="t('dataPipelines.confirm')"
                    :cancel-button-text="t('dataPipelines.cancel')"
                    width="220px"
                    @confirm="handleCancel(scope.row.job_id)"
                >
                  <template #reference>
                    <el-button
                        type="text"
                        class="flex items-center justify-start cursor-pointer"
                    >
                      {{ t("dataPipelines.cancel") }}
                    </el-button>
                  </template>
                </el-popconfirm>
                <!-- 执行按钮 -->
                <el-button
                    type="text"
                    class="flex items-center justify-start cursor-pointer"
                    :class="{ 'text-gray-400': scope.row.status === 'Processing' || scope.row.status === 'Queued' || scope.row.status === 'Finished' }"
                    :disabled="scope.row.status === 'Processing' || scope.row.status === 'Queued' || scope.row.status === 'Finished'"
                    @click="openExecuteDialog(scope.row)"
                >
                  {{ t("dataPipelines.execute") }}
                </el-button>

                <el-popconfirm
                    v-if="scope.row.can_delete"
                    :title="`${t('dataPipelines.deleteConfirm')}?`"
                    :confirm-button-text="t('dataPipelines.confirm')"
                    :cancel-button-text="t('dataPipelines.cancel')"
                    width="220px"
                    @confirm="handleDelete(scope.row.job_id)"
                >
                  <template #reference>
                    <el-button
                        type="text"
                        class="flex items-center justify-start cursor-pointer"
                    >{{ t("dataPipelines.delete") }}
                    </el-button>
                  </template>
                </el-popconfirm>
                <el-button
                    v-else
                    type="text"
                    disabled
                    class="flex items-center justify-start"
                >{{ t("dataPipelines.delete") }}
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <div class="flex justify-end mt-4 mr-4 mb-4">
          <el-pagination
              :page-size="pagination.pageSize"
              :current-page="pagination.currentPage"
              :total="pagination.total"
              :page-sizes="[10, 20, 50, 100]"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="pagination.handleSizeChange"
              @current-change="pagination.handleCurrentChange"
          />
        </div>
      </div>
    </div>
    <el-dialog
        v-model="executeDialogVisible"
        :title="t('dataPipelines.execute')"
        width="900px"
        align-center
        @closed="onExecuteDialogClosed"
    >
      <div class="execute-dialog-content">
        <!-- 空间资源配置区域 -->
        <div class="space-resource-section">
          <p class="section-title">{{ t('dataPipelines.spaceResourceConfig') }}</p>

          <SpaceResourceSelect
              ref="executeSpaceResourceFieldsRef"
              :key="executeDialogKey"
              v-if="executeDialogVisible"
              v-model:cluster-id="executeClusterId"
              v-model:cluster-name="executeClusterName"
              v-model:space-resource-id="executeSpaceResourceId"
              v-model:resource-name="executeResourceName"
              compact
          />
          <StorageSizeField v-model="executeStorageSize" class="mt-[24px]" />
        </div>

        <!-- 执行模式选择区域（仅支持流式算子时显示） -->
        <div v-if="executeIsStreamingCompatible" class="execution-mode-section">
          <el-divider />

          <p class="section-title mb-4">{{ t('dataPipelines.executionModeTitle') }}</p>

          <!-- 检测提示（仅算子任务显示） -->
          <div v-if="executePendingJobSource === 'pipeline'" class="detection-tip">
            <el-icon class="tip-icon"><CircleCheckFilled /></el-icon>
            <span class="tip-text">{{ t('dataPipelines.streamingCompatibleDetected') }}</span>
          </div>

          <el-radio-group v-model="executeExecutionMode" class="mode-radio-group">
            <el-radio value="normal" size="large">
              {{ t('dataPipelines.normalMode') }}
            </el-radio>
            <el-radio value="streaming" size="large">
              {{ t('dataPipelines.streamingMode') }}
            </el-radio>
          </el-radio-group>

          <!-- 普通模式提示（仅工具任务显示） -->
          <el-alert
              v-if="executePendingJobSource === 'tool' && executeExecutionMode === 'normal'"
              type="info"
              :closable="false"
              class="mt-3"
              show-icon
          >
            <template #title>
              <span class="text-xs">{{ t("dataPipelines.legacyModeHint") }}</span>
            </template>
          </el-alert>

          <!-- 批量大小设置（仅流式模式时显示） -->
          <div v-if="executeExecutionMode === 'streaming'" class="batch-size-section">
            <p class="batch-size-label">
              <span class="required-mark">*</span>
              {{ t('dataPipelines.streamingBatchSize') }}
            </p>
            <el-input
                v-model.number="executeStreamingBatchSize"
                type="number"
                :min="1"
                :placeholder="t('dataPipelines.streamingBatchSizePlaceholder')"
                class="batch-size-input"
                @input="handleExecuteBatchSizeInput"
            >
              <template #suffix>
                <span class="input-unit">{{ t('dataPipelines.batchUnit') }}</span>
              </template>
            </el-input>
            <p v-if="executePendingJobSource === 'pipeline'" class="batch-size-hint">
              <el-icon class="hint-icon"><InfoFilled /></el-icon>
              {{ t('dataPipelines.streamingBatchSizeHint') }}
            </p>

            <!-- 流式模式提示（仅工具任务显示Alert样式） -->
            <div v-if="executePendingJobSource === 'tool'" class="mt-3 space-y-2">
              <el-alert
                  type="success"
                  :closable="false"
                  show-icon
              >
                <template #title>
                  <span class="text-xs">{{ t("dataPipelines.streamingModeAdvantage") }}</span>
                </template>
              </el-alert>

              <el-alert
                  type="warning"
                  :closable="false"
                  show-icon
              >
                <template #title>
                  <span class="text-xs">{{ t("dataPipelines.batchSizeRecommendation") }}</span>
                </template>
              </el-alert>
            </div>
          </div>

          <!-- 流式模式说明（仅算子任务显示） -->
          <div v-if="executePendingJobSource === 'pipeline'" class="streaming-benefits">
            <p class="benefits-title">{{ t('dataPipelines.streamingModeBenefits') }}</p>
            <ul>
              <li>{{ t('dataPipelines.streamingBenefit1') }}</li>
              <li>{{ t('dataPipelines.streamingBenefit2') }}</li>
              <li>{{ t('dataPipelines.streamingBenefit3') }}</li>
            </ul>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer flex flex-row justify-end items-center gap-3">
          <CsgButton
              class="btn btn-secondary-gray btn-md whitespace-nowrap"
              @click="executeDialogVisible = false"
              :name="t('dataPipelines.cancel')"
          />
          <CsgButton
              class="btn btn-primary btn-md whitespace-nowrap"
              :loading="executeSubmitting"
              :name="t('dataPipelines.sure')"
              @click="confirmExecute"
          />
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import { ElMessage } from "element-plus";
import { InfoFilled, CircleCheckFilled, QuestionFilled, Warning } from '@element-plus/icons-vue';
import useFetchApi from "../../../packs/useFetchApi";
import {
  resolveCsghubLogParamsFromTask,
  describeCsghubLogParamsGap,
} from "../../../packs/csghubDataflowLogs";
import { convertUtcToLocalTime } from "../../../packs/datetimeUtils";
import { normalizeStorageSize } from "../../../packs/storageSize.js";
import { useI18n } from "vue-i18n";
import SpaceResourceSelect from "../dataAcquisition/dataSourceManagement/SpaceResourceSelect.vue";
import StorageSizeField from "../dataAcquisition/dataSourceManagement/StorageSizeField.vue";

const { t, locale } = useI18n();
const tableLoading = ref(false);
const refreshTimer = ref(null);
const route = useRoute();

// 执行弹框相关状态
const executeDialogVisible = ref(false);
const executeDialogKey = ref(0);
const executePendingJobId = ref(null);
const executePendingJobSource = ref(null); // 保存任务类型：'tool' 或 'pipeline'
const executeClusterId = ref("");
const executeClusterName = ref("");
const executeSpaceResourceId = ref("");
const executeResourceName = ref("");
const executeStorageSize = ref("4Gi");
const executeSubmitting = ref(false);
const executeSpaceResourceFieldsRef = ref(null);

// 执行弹框-流式模式相关状态
const executeIsStreamingCompatible = ref(false);
const executeExecutionMode = ref('normal');
const executeStreamingBatchSize = ref(100);

const form = ref({
  searchStr: "",
});
const tableData = ref([
  // {
  //   job_name: "数据大清洗",
  //   job_type: "数据处理",
  //   job_source: "pipeline",
  //   status: "待处理", // 对应多语言键名
  //   repo_id: "2275748353/test-main",
  //   branch: "test-main",
  //   export_repo_id: "--",
  //   export_branch_name: "--",
  //   date_posted: "2025-07-08 14:20:22", // UTC 时间
  //   job_id: "job_001",
  // }
]);

const pagination = ref({
  currentPage: 1,
  pageSize: 10,
  total: 0,
  handleSizeChange: (size) => {
    // 切换分页时先停止定时任务
    stopRefreshTimer();
    pagination.value.pageSize = size;
    pagination.value.currentPage = 1; // 切换每页大小时回到第一页
    getDataFlowListFun();
  },
  handleCurrentChange: (page) => {
    // 切换分页时先停止定时任务
    stopRefreshTimer();
    pagination.value.currentPage = page;
    getDataFlowListFun();
  }
});

const getDataFlowListFun = async () => {
  const { currentPage, pageSize } = pagination.value;
  const url = `/dataflow/jobs?query=${form.value.searchStr}&page=${currentPage}&page_size=${pageSize}`;
  tableLoading.value = true;

  const { data } = await useFetchApi(url).get().json();

  if (data.value) {
    tableData.value = data.value.data;
    pagination.value.total = data.value.total || 0;
  }
  tableLoading.value = false;

  // 数据更新后检查是否需要启动/停止定时任务
  checkAndManageTimer();
};

// 检查当前页是否存在 Processing 状态的任务
const hasProcessingTask = () => {
  return tableData.value.some(item => item.status === 'Processing');
};

// 启动定时任务
const startRefreshTimer = () => {
  // 如果定时器已存在，先清除，避免创建多个定时器
  if (refreshTimer.value) {
    stopRefreshTimer();
  }

  // 确保定时器不存在后再创建新的
  if (!refreshTimer.value) {
    refreshTimer.value = setInterval(() => {
      getDataFlowListFun();
    }, 3000); // 3秒刷新一次
  }
};

// 停止定时任务
const stopRefreshTimer = () => {
  if (refreshTimer.value) {
    clearInterval(refreshTimer.value);
    refreshTimer.value = null;
  }
};

// 检查并管理定时任务
const checkAndManageTimer = () => {
  if (hasProcessingTask()) {
    startRefreshTimer();
  } else {
    stopRefreshTimer();
  }
};

const handleSearch = () => {
  // 搜索时先停止定时任务
  stopRefreshTimer();
  pagination.value.currentPage = 1;
  getDataFlowListFun();
};

// 支持流式模式的算子列表
const streamingCompatibleOperators = [
  'clean_email_mapper',
  'clean_copyright_mapper',
  'clean_links_mapper',
  'expand_macro_mapper',
  'fix_unicode_mapper',
  'clean_ip_mapper',
  'clean_html_mapper',
  'chinese_convert_mapper',
  'nlpaug_en_mapper',
  'nlpcda_zh_mapper',
  'punctuation_normalization_mapper',
  'remove_bibliography_mapper',
  'remove_comments_mapper',
  'remove_header_mapper',
  'remove_long_words_mapper',
  'remove_non_chinese_character_mapper',
  'remove_repeat_sentences_mapper',
  'remove_specific_chars_mapper',
  'remove_table_text_mapper',
  'remove_words_with_incorrect_substrings_mapper',
  'replace_content_mapper',
  'sentence_split_mapper',
  'whitespace_normalization_mapper',
  'flagged_words_filter',
  'character_repetition_filter',
  'text_length_filter',
  'alphanumeric_filter',
  'word_repetition_filter',
  'words_num_filter',
  'average_line_length_filter',
  'language_id_score_filter',
  'maximum_line_length_filter',
  'special_characters_filter',
  'specified_field_filter',
  'specified_numeric_field_filter',
  'stopwords_filter',
  'suffix_filter',
  'text_high_score_filter',
  'multi_keyword_filter',
  'text_entity_dependency_filter',
  'annotate_edu_train_bert_scorer_mapper',
  'text_action_filter',
  'perplexity_filter',
  'optimize_instruction_mapper',
  'extract_qa_mapper',
  'generate_code_qa_pair_mapper'
];

/**
 * 获取任务的执行模式显示文本
 * @param {Object} row - 任务行数据
 * @returns {string} - 执行模式文本
 */
const getExecutionMode = (row) => {
  try {
    if (!row.yaml_config) {
      return t('dataPipelines.normalExecution');
    }

    // 尝试解析为 JSON（工具任务）
    try {
      const config = JSON.parse(row.yaml_config);

      // 检查 params 数组中的 processing_mode 参数
      if (config.params && Array.isArray(config.params)) {
        const processingModeParam = config.params.find(p => p.name === 'processing_mode');
        if (processingModeParam && processingModeParam.value === 'streaming') {
          return t('dataPipelines.streamingExecution');
        }
      }
    } catch (jsonError) {
      // 不是 JSON 格式，尝试 YAML 格式（工作流任务）
    }

    // 解析为 YAML 格式（工作流任务）
    const yamlLines = row.yaml_config.split('\n');

    // 检查工作流/算子级别的流式执行 (use_streaming: true)
    for (const line of yamlLines) {
      if (line.trim().startsWith('use_streaming:')) {
        const value = line.split(':')[1]?.trim().toLowerCase();
        if (value === 'true') {
          return t('dataPipelines.streamingExecution');
        }
      }
    }

    // 如果有 use_streaming 字段（未来可能添加）
    if (row.use_streaming === true) {
      return t('dataPipelines.streamingExecution');
    }

    // 默认为普通执行
    return t('dataPipelines.normalExecution');
  } catch (error) {
    console.error('Error parsing execution mode:', error);
    return t('dataPipelines.normalExecution');
  }
};

/**
 * 检查工作流中的算子是否全部支持流式模式
 */
const checkStreamingCompatibility = (workflowData) => {
  try {
    // 支持两种数据结构：
    // 1. workflowData.json.process (JSON格式)
    // 2. workflowData.process (YAML解析后的格式)
    const process = workflowData?.json?.process || workflowData?.process;

    if (!process) {
      console.log('未找到 process 数据');
      return false;
    }

    const processEntries = Object.values(process);

    if (processEntries.length === 0) {
      console.log('process 为空');
      return false;
    }

    const operators = processEntries.map(node => node.operator_name);
    console.log('检测到的算子:', operators);

    const isCompatible = operators.every(op => streamingCompatibleOperators.includes(op));
    console.log('流式模式兼容性检查结果:', isCompatible);

    return isCompatible;
  } catch (error) {
    console.error('检查流式模式兼容性时出错:', error);
    return false;
  }
};

/**
 * 处理批量大小输入验证
 */
const handleExecuteBatchSizeInput = (value) => {
  if (value === '' || value === null || value === undefined) {
    return;
  }

  const numValue = Number(value);

  if (numValue <= 0) {
    ElMessage.error(t('dataPipelines.streamingBatchSizeMinError'));
  } else if (!Number.isInteger(numValue)) {
    ElMessage.error(t('dataPipelines.streamingBatchSizeIntegerError'));
  }
};

const openExecuteDialog = async (row) => {
  executePendingJobId.value = row.job_id;
  executePendingJobSource.value = row.job_source; // 保存任务类型
  executeClusterId.value = "";
  executeClusterName.value = "";
  executeSpaceResourceId.value = "";
  executeResourceName.value = "";
  executeStorageSize.value = "4Gi";
  executeExecutionMode.value = 'normal';
  executeStreamingBatchSize.value = 100;
  executeIsStreamingCompatible.value = false;
  executeDialogKey.value = Date.now();

  // 支持流式模式的工具列表
  const streamingSupportedTools = [
    'reformat_jsonl_nan_value_preprocess_internal',
    'reformat_csv_nan_value_preprocess_internal',
    'dataset_spliter_by_language_preprocess_internal',
    'cosmopedia_chinese_preprocess_internal'
  ];

  // 检查是否是工具任务
  if (row.job_source === 'tool' && row.yaml_config) {
    try {
      const config = JSON.parse(row.yaml_config);
      const toolName = config.name;

      // 检查工具是否支持流式模式
      if (streamingSupportedTools.includes(toolName)) {
        executeIsStreamingCompatible.value = true;

        // 读取当前的流式配置
        if (config.params && Array.isArray(config.params)) {
          const processingModeParam = config.params.find(p => p.name === 'processing_mode');
          const batchSizeParam = config.params.find(p => p.name === 'batch_size');

          if (processingModeParam) {
            executeExecutionMode.value = processingModeParam.value === 'streaming' ? 'streaming' : 'normal';
          }

          if (batchSizeParam && typeof batchSizeParam.value === 'number') {
            executeStreamingBatchSize.value = batchSizeParam.value;
          }
        }
      }
    } catch (error) {
      console.error('Error parsing tool config:', error);
    }
  } else {
    // 工作流任务的流式检测逻辑
    const dslText = row.dslText || row.dsl_text;

    if (dslText) {
      try {
        // 尝试 JSON 解析
        try {
          const workflowData = JSON.parse(dslText);
          executeIsStreamingCompatible.value = checkStreamingCompatibility(workflowData);
        } catch (jsonError) {
          // YAML 格式，使用正则提取算子名称
          const operatorNameRegex = /operator_name:\s*(\w+)/g;
          const operators = [];
          let match;
          while ((match = operatorNameRegex.exec(dslText)) !== null) {
            operators.push(match[1]);
          }

          if (operators.length > 0) {
            executeIsStreamingCompatible.value = operators.every(op =>
                streamingCompatibleOperators.includes(op)
            );
          }
        }
      } catch (error) {
        // 解析失败，保持默认值 false
      }
    }
  }

  executeDialogVisible.value = true;
};

const onExecuteDialogClosed = () => {
  executePendingJobId.value = null;
};

const confirmExecute = async () => {
  if (!executeClusterId.value) {
    return ElMessage.error(
        t("all.pleaseSelect", { value: t("dataPipelines.selectRegion") })
    );
  }
  if (!executeSpaceResourceId.value) {
    return ElMessage.error(
        t("all.pleaseSelect", { value: t("dataPipelines.spaceCloudResources") })
    );
  }

  // 如果选择流式模式，验证批量大小
  if (executeExecutionMode.value === 'streaming') {
    if (executeStreamingBatchSize.value === null || executeStreamingBatchSize.value === undefined || executeStreamingBatchSize.value === '') {
      return ElMessage.error(t('dataPipelines.streamingBatchSizeRequired'));
    }

    const batchSize = Number(executeStreamingBatchSize.value);

    if (batchSize <= 0) {
      return ElMessage.error(t('dataPipelines.streamingBatchSizeMinError'));
    }

    if (!Number.isInteger(batchSize)) {
      return ElMessage.error(t('dataPipelines.streamingBatchSizeIntegerError'));
    }
  }

  const spaceNames =
      executeSpaceResourceFieldsRef.value?.resolveSelectionNames?.() ?? {};

  const useStreaming = executeExecutionMode.value === 'streaming';

  const params = {
    cluster_id: executeClusterId.value,
    cluster_name: spaceNames.cluster_name || executeClusterName.value,
    resource_id: executeSpaceResourceId.value,
    resource_name: spaceNames.resource_name || executeResourceName.value,
    space_resource_id: executeSpaceResourceId.value,
    storage_size: normalizeStorageSize(executeStorageSize.value),
  };

  // 根据任务类型发送不同的参数名
  if (executePendingJobSource.value === 'tool') {
    // 工具任务：使用 processing_mode 和 batch_size
    params.processing_mode = useStreaming ? 'streaming' : 'legacy';
    if (useStreaming) {
      params.batch_size = Number(executeStreamingBatchSize.value);
    }
  } else {
    // 算子任务：使用 use_streaming 和 streaming_batch_size
    params.use_streaming = useStreaming;
    if (useStreaming) {
      params.streaming_batch_size = Number(executeStreamingBatchSize.value);
    }
  }

  executeSubmitting.value = true;
  const url = `/dataflow/jobs/job/execute/${executePendingJobId.value}`;
  const options = {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  };
  const { data, error } = await useFetchApi(url, options).post().json();
  executeSubmitting.value = false;

  if (data.value?.code === 200) {
    ElMessage({
      message: t("dataPipelines.taskExecuted"),
      type: "success",
      plain: true,
      grouping: true,
    });
    executeDialogVisible.value = false;
    getDataFlowListFun();
  } else {
    ElMessage({
      message: error.value?.msg || data.value?.msg || t("dataPipelines.taskExecutionFailed"),
      type: "error",
      plain: true,
      grouping: true,
    });
  }
};

const handleCancel = async (job_id) => {
  const url = `/dataflow/jobs/stop_pipline_job?job_id=${job_id}`;
  const { data } = await useFetchApi(url).post().json();
  if (data.value.code === 200) {
    ElMessage({
      message: t("dataPipelines.taskSuccessStop"),
      type: "success",
      plain: true,
      grouping: true,
    });
    getDataFlowListFun();
  } else {
    ElMessage({
      message: t("dataPipelines.taskStopFailed"),
      type: "error",
      plain: true,
      grouping: true,
    });
  }
};

const handleDelete = async (id) => {
  const url = `/dataflow/jobs/${id}`;

  const { data, error } = await useFetchApi(url).delete().json();

  if (error.value) {
    ElMessage({
      message: `操作失败: ${error.value.msg}`,
      type: "error",
    });
  } else {
    ElMessage({
      message: "删除成功",
      type: "success",
    });
    getDataFlowListFun();
  }
};
const toDatasetPage = (path, branch) => {
  if (path && branch) {
    window.location.href = `/datasets/${path}/files/${branch}`;
  }
};

const router = useRouter();

const goToNewTask = (path) => {
  router.push(path);
};

/**
 * 查看主任务日志（直连 CSGHub；列表缺字段时用 log_context 补全，不调 dataflow 日志接口）
 */
const getLog = async (row) => {
  let task = { ...row };
  let { namespaceUuid, jobId } = resolveCsghubLogParamsFromTask(task);

  if ((!namespaceUuid || !jobId) && row?.job_id) {
    const { data } = await useFetchApi(
        `/dataflow/jobs/log_context/${row.job_id}`
    )
        .get()
        .json();
    if (data.value?.code === 200 && data.value?.data) {
      task = { ...task, ...data.value.data };
      ({ namespaceUuid, jobId } = resolveCsghubLogParamsFromTask(task));
    }
  }

  if (!namespaceUuid || !jobId) {
    const missing = describeCsghubLogParamsGap({ namespaceUuid, jobId });
    ElMessage.error(`无法查看 CSGHub 日志（缺少：${missing.join("、")}）`);
    return;
  }
  router.push({
    path: "/datapipelines/viewLog",
    query: {
      type: "job",
      namespace_uuid: namespaceUuid,
      csghub_job_id: jobId,
      task_uid: task.uuid || row.uuid,
      job_id: row.job_id,
    },
  });
};

// 监听路由变化，停止定时任务
watch(
    () => route.path,
    () => {
      stopRefreshTimer();
    }
);

onMounted(() => {
  getDataFlowListFun();
});

// 组件卸载时清理定时器
onBeforeUnmount(() => {
  stopRefreshTimer();
});
</script>
<style lang="less" scoped>
:deep(.settingsTableBtn) {
  .el-button {
    padding: 0 !important;
    margin-right: 20px !important;
    font-size: 14px !important;
    color: #667085 !important;
    font-weight: 400 !important;
    &:hover {
      color: #3250bd !important;
    }
    &.is-disabled,
    &[disabled] {
      color: #c0c4cc !important;
      cursor: not-allowed !important;
      &:hover {
        color: #c0c4cc !important;
      }
    }
  }
}

:deep(.tableCont) {
  .el-button--text {
    background: transparent !important;
  }
}

:deep(.el-form--inline) {
  .el-form-item {
    margin-right: 12px;
  }
}
.borderBox {
  border-radius: var(--spacing-lg, 12px);
  border: var(--spacing-none, 1px) solid
  var(--colors-gray-light-mode-200, #eaecf0);
  background: var(--Base-White, #fff);
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
  .el-button--text.is-disabled {
    color: #9ca3af !important;
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

// 执行对话框样式
.execute-dialog-content {
  padding: 8px 0;

  .space-resource-section {
    margin-bottom: 24px;

    .section-title {
      font-size: 16px;
      font-weight: 500;
      color: #101828;
      margin-bottom: 16px;
    }
  }

  .execution-mode-section {
    :deep(.el-divider) {
      margin: 0 0 24px 0;
    }

    .section-title {
      font-size: 16px;
      font-weight: 500;
      color: #101828;
      margin-bottom: 12px;
    }

    .detection-tip {
      display: flex;
      align-items: center;
      padding: 10px 12px;
      background: #f0f9ff;
      border: 1px solid #b3e0ff;
      border-radius: 6px;
      margin-bottom: 16px;

      .tip-icon {
        flex-shrink: 0;
        font-size: 16px;
        color: #0ea5e9;
        margin-right: 8px;
      }

      .tip-text {
        font-size: 13px;
        color: #0c4a6e;
        line-height: 1.5;
      }
    }

    .mode-radio-group {
      display: flex;
      gap: 32px;
      margin-bottom: 16px;

      :deep(.el-radio) {
        margin-right: 0;
        height: 32px;
        line-height: 32px;

        .el-radio__label {
          font-size: 14px;
          color: #344054;
          font-weight: 400;
          padding-left: 8px;
        }

        &.is-checked {
          .el-radio__label {
            color: #3250bd;
          }
        }
      }
    }

    .batch-size-section {
      padding: 16px;
      background: #f9fafb;
      border: 1px solid #e4e7ec;
      border-radius: 8px;
      margin-bottom: 16px;

      .batch-size-label {
        font-size: 14px;
        font-weight: 500;
        color: #344054;
        margin-bottom: 8px;
        display: flex;
        align-items: center;

        .required-mark {
          color: #f04438;
          font-size: 14px;
          margin-right: 4px;
        }
      }

      .batch-size-input {
        margin-bottom: 8px;

        :deep(.el-input__inner) {
          text-align: left;
        }

        .input-unit {
          font-size: 12px;
          color: #667085;
          padding-right: 8px;
        }
      }

      .batch-size-hint {
        font-size: 12px;
        color: #667085;
        line-height: 1.5;
        display: flex;
        align-items: flex-start;
        margin: 0;

        .hint-icon {
          flex-shrink: 0;
          margin-right: 4px;
          margin-top: 2px;
          color: #98a2b3;
        }
      }
    }

    .streaming-benefits {
      padding: 16px;
      background: #f0f7ff;
      border: 1px solid #d1e9ff;
      border-radius: 8px;

      .benefits-title {
        font-size: 14px;
        font-weight: 500;
        color: #101828;
        margin-bottom: 12px;
      }

      ul {
        margin: 0;
        padding-left: 20px;

        li {
          font-size: 13px;
          color: #475467;
          line-height: 1.8;
          margin-bottom: 6px;

          &:last-child {
            margin-bottom: 0;
          }
        }
      }
    }
  }
}
</style>