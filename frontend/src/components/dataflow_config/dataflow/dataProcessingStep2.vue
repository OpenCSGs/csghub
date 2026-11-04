<template>
  <div>
    <p class="text-gray-900 text-2xl font-medium">
      {{ t("dataPipelines.taskFlowConfiguration") }}
    </p>
    <div class="mt-[12px]">
      <workflow-editor ref="workflowEditorRef" :workflow-data="form.dslText" :form="form" @save="handleWorkflowSave" />
    </div>
    <div class="flex items-center justify-end gap-2 pt-5 bottomBtnGroup">
      <CsgButton
          class="btn btn-secondary-gray btn-md whitespace-nowrap"
          @click="geback"
          :name="t('dataPipelines.cancel')"
      />
      <CsgButton
          class="btn btn-secondary-gray btn-md whitespace-nowrap"
          @click="step = 1"
          :name="t('dataPipelines.previousStep')"
      />
      <!--
      <CsgButton
        v-if="init !== 'createJobs'"
        class="btn btn-primary btn-md whitespace-nowrap mr-[5px]"
        v-loading="formLoading"
        @click="save(1)"
        :name="type === 'edit' ? t('dataPipelines.updateTemplate') : t('dataPipelines.creationCompleted')"
      />
      -->
      <CsgButton
          v-if="init === 'createJobs'"
          class="btn btn-primary btn-md whitespace-nowrap mr-[5px]"
          v-loading="formLoading"
          @click="save(2)"
          :name="t('dataPipelines.saveAndExecute')"
      />
    </div>

    <!-- 空间资源选择对话框 -->
    <el-dialog
        v-model="resourceDialogVisible"
        :title="t('dataPipelines.selectSpaceResources')"
        width="900px"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        @close="handleResourceDialogClose"
    >
      <div class="resource-dialog-content">
        <!-- 空间资源配置区域 -->
        <div class="space-resource-section">
          <p class="section-title">{{ t('dataPipelines.spaceResourceConfig') }}</p>

          <SpaceResourceSelect
              ref="spaceResourceSelectRef"
              v-model:cluster-id="tempResourceData.cluster_id"
              v-model:space-resource-id="tempResourceData.space_resource_id"
              v-model:cluster-name="tempResourceData.cluster_name"
              v-model:resource-name="tempResourceData.resource_name"
          />
          <StorageSizeField
              v-model="tempResourceData.storage_size"
              class="mt-[24px]"
          />
        </div>

        <!-- 执行模式选择区域（仅支持流式算子时显示） -->
        <div v-if="isStreamingCompatible" class="execution-mode-section">
          <el-divider />

          <p class="section-title">{{ t('dataPipelines.executionModeTitle') }}</p>

          <!-- 检测提示 -->
          <div class="detection-tip">
            <el-icon class="tip-icon"><CircleCheckFilled /></el-icon>
            <span class="tip-text">{{ t('dataPipelines.streamingCompatibleDetected') }}</span>
          </div>

          <el-radio-group v-model="executionMode" class="mode-radio-group">
            <el-radio value="normal" size="large">
              {{ t('dataPipelines.normalMode') }}
            </el-radio>
            <el-radio value="streaming" size="large">
              {{ t('dataPipelines.streamingMode') }}
            </el-radio>
          </el-radio-group>

          <!-- 批量大小设置（仅流式模式时显示） -->
          <div v-if="executionMode === 'streaming'" class="batch-size-section">
            <p class="batch-size-label">
              <span class="required-mark">*</span>
              {{ t('dataPipelines.streamingBatchSize') }}
            </p>
            <el-input
                v-model.number="streamingBatchSize"
                type="number"
                :min="1"
                :placeholder="t('dataPipelines.streamingBatchSizePlaceholder')"
                class="batch-size-input"
                @input="handleBatchSizeInput"
            >
              <template #suffix>
                <span class="input-unit">{{ t('dataPipelines.batchUnit') }}</span>
              </template>
            </el-input>
            <p class="batch-size-hint">
              <el-icon class="hint-icon"><InfoFilled /></el-icon>
              {{ t('dataPipelines.streamingBatchSizeHint') }}
            </p>
          </div>

          <!-- 流式模式说明 -->
          <div class="streaming-benefits">
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
        <div class="dialog-footer">
          <CsgButton
              class="btn btn-secondary-gray btn-md"
              @click="resourceDialogVisible = false"
              :name="t('dataPipelines.cancel')"
          />
          <CsgButton
              class="btn btn-primary btn-md"
              v-loading="formLoading"
              @click="confirmResourceSelection"
              :name="t('dataPipelines.confirm')"
          />
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";
import { ref, inject, computed, watch, nextTick, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { InfoFilled, CircleCheckFilled } from '@element-plus/icons-vue';
import useFetchApi from "../../../packs/useFetchApi";
import {
  buildTaskCreatePayload,
  guardNamespaceBeforeSubmit,
} from "../../../packs/useDataflowNamespaces.js";
import { useI18n } from "vue-i18n";
import workflowEditor from './workflowEditor.vue';
import SpaceResourceSelect from "../dataAcquisition/dataSourceManagement/SpaceResourceSelect.vue";
import StorageSizeField from "../dataAcquisition/dataSourceManagement/StorageSizeField.vue";

const workflowEditorRef = ref(null);
const spaceResourceSelectRef = ref(null);

const router = useRouter();
const route = useRoute()
const { t } = useI18n();
const formLoading = ref(false);

const templateId = computed(() => route.query.templateId)
const type = computed(() => route.query.type)

const form = inject("subForm");
const step = inject("step");

// 流式模式相关状态
const pendingWorkflowResult = ref(null);
const streamingBatchSize = ref(100); // 流式模式批量大小，默认100
const isStreamingCompatible = ref(false); // 是否支持流式模式
const executionMode = ref('normal'); // 执行模式：'normal' 或 'streaming'，默认普通模式

// 空间资源选择对话框相关状态
const resourceDialogVisible = ref(false);
const tempResourceData = ref({
  cluster_id: "",
  space_resource_id: "",
  cluster_name: "",
  resource_name: "",
  storage_size: "4Gi",
});

// 可升级的算子列表（支持流式模式）
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

watch(
    () => form.value.dslText,
    () => {
      nextTick(() => {
        workflowEditorRef.value.initGraph()
      })
    }
);

onMounted(() => {});

const props = defineProps({
  init: {
    type: String,
    required: true,
    default: () => ''
  }
})

const isRun = ref(false);

/**
 * 检查工作流中的算子是否全部支持流式模式
 * @param {Object} workflowData - 工作流数据 {yaml, json}
 * @returns {boolean} - 如果全部支持返回true，否则返回false
 */
const checkStreamingCompatibility = (workflowData) => {
  try {
    if (!workflowData || !workflowData.json || !workflowData.json.process) {
      console.log('工作流数据无效或没有process');
      return false;
    }

    // 从process对象中提取所有算子名称
    const processEntries = Object.values(workflowData.json.process);

    if (processEntries.length === 0) {
      console.log('没有算子');
      return false;
    }

    const operators = processEntries.map(node => node.operator_name);

    // 检查是否所有算子都在可升级列表中
    const allCompatible = operators.every(op =>
        streamingCompatibleOperators.includes(op)
    );

    console.log('算子兼容性检查:', {
      operators,
      allCompatible,
      operatorCount: operators.length,
      streamingCompatibleOperators: streamingCompatibleOperators
    });

    return allCompatible;
  } catch (error) {
    console.error('检查流式模式兼容性时出错:', error);
    return false;
  }
};

const save = async (type) => {
  isRun.value = type === 2;
  if (workflowEditorRef.value) {
    workflowEditorRef.value.saveWorkflow();
  }
};

/**
 * 处理批量大小输入
 * @param {number} value - 输入的值
 */
const handleBatchSizeInput = (value) => {
  // 如果输入为空，不做处理，允许用户清空
  if (value === '' || value === null || value === undefined) {
    return;
  }

  // 转换为数字
  const numValue = Number(value);

  // 如果是负数或0，只提示错误，不自动修改
  if (numValue <= 0) {
    ElMessage.error(t('dataPipelines.streamingBatchSizeMinError'));
  } else if (!Number.isInteger(numValue)) {
    // 如果不是整数，提示错误
    ElMessage.error(t('dataPipelines.streamingBatchSizeIntegerError'));
  }
};

/**
 * 确认空间资源选择
 */
const confirmResourceSelection = async () => {
  // 验证必填项
  if (!tempResourceData.value.cluster_id) {
    ElMessage.error(
        t("all.pleaseSelect", { value: t("dataPipelines.selectRegion") })
    );
    return;
  }
  if (
      tempResourceData.value.space_resource_id === "" ||
      tempResourceData.value.space_resource_id == null
  ) {
    ElMessage.error(
        t("all.pleaseSelect", { value: t("dataPipelines.spaceCloudResources") })
    );
    return;
  }

  // 如果选择流式模式，验证批量大小
  if (executionMode.value === 'streaming') {
    // 批量大小是必填项（有默认值100）
    if (streamingBatchSize.value === null || streamingBatchSize.value === undefined || streamingBatchSize.value === '') {
      ElMessage.error(t('dataPipelines.streamingBatchSizeRequired'));
      return;
    }

    const batchSize = Number(streamingBatchSize.value);

    // 验证必须是大于等于1的整数
    if (batchSize <= 0) {
      ElMessage.error(t('dataPipelines.streamingBatchSizeMinError'));
      return;
    }

    if (!Number.isInteger(batchSize)) {
      ElMessage.error(t('dataPipelines.streamingBatchSizeIntegerError'));
      return;
    }
  }

  // 解析资源名称
  const spaceNames =
      spaceResourceSelectRef.value?.resolveSelectionNames?.() ?? {};

  // 将临时数据赋值给表单
  form.value.cluster_id = tempResourceData.value.cluster_id;
  form.value.space_resource_id = tempResourceData.value.space_resource_id;
  form.value.cluster_name = spaceNames.cluster_name || tempResourceData.value.cluster_name;
  form.value.resource_name = spaceNames.resource_name || tempResourceData.value.resource_name;
  form.value.storage_size = tempResourceData.value.storage_size;

  // 关闭对话框
  resourceDialogVisible.value = false;

  // 继续执行保存操作
  if (pendingWorkflowResult.value) {
    await proceedWithSave(pendingWorkflowResult.value);
  }
};

/**
 * 处理空间资源对话框关闭事件
 */
const handleResourceDialogClose = () => {
  // 用户取消选择，重置临时数据
  tempResourceData.value = {
    cluster_id: "",
    space_resource_id: "",
    cluster_name: "",
    resource_name: "",
    storage_size: "4Gi",
  };
  // 重置执行模式为普通模式
  executionMode.value = 'normal';
  // 重置批量大小为默认值
  streamingBatchSize.value = 100;
};

/**
 * 处理工作流保存 - 实际执行保存逻辑
 * @param {Object} result - 工作流保存结果
 */
const proceedWithSave = async (result) => {
  if (props.init === 'createTemplate') {
    const combinedData = {
      id: type.value === 'edit' ? templateId.value : '',
      ...form.value,
      dslText: result.yaml
    };

    console.log('合并后的数据:', combinedData);

    const options = {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(combinedData)
    }

    const url = type.value === 'edit' ? `/dataflow/algo_templates/${templateId.value}` : '/dataflow/algo_templates'
    const { data, error } = await useFetchApi(url, options)[type.value === 'edit' ? 'put' : 'post']().json()
    console.log(data.value, error.value, "dataerror");
    if (error.value || data.value.code !== 200) {
      ElMessage({
        message: data.value.msg || error.value.msg,
        type: 'error',
        plain: true,
        grouping: true,
      })
    } else {
      ElMessage({
        message: type.value === 'edit' ? '更新成功' : '创建成功',
        type: 'success',
        plain: true,
      })
      router.go(-1);
    }
  } else {
    const nsCheck = guardNamespaceBeforeSubmit(form, t);
    if (!nsCheck.ok) {
      ElMessage.error(nsCheck.message);
      return;
    }

    // 判断是否使用流式模式
    const useStreaming = executionMode.value === 'streaming';

    let combinedData = buildTaskCreatePayload({
      ...form.value,
      job_source: "pipeline",
      process: Array.isArray(form.value.process) ? form.value.process : [],
      dslText: result.yaml,
      is_run: isRun.value,
      use_streaming: useStreaming, // 添加流式模式参数
    });

    // 只有启用流式模式时才传递批量大小参数
    if (useStreaming) {
      combinedData.streaming_batch_size = Number(streamingBatchSize.value);
    }

    if (isRun.value) {
      delete combinedData.task_run_time
    }

    console.log('合并后的数据:', combinedData);

    const options = {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(combinedData)
    }

    const url = '/dataflow/jobs/pipeline'
    const { data, error } = await useFetchApi(url, options).post().json()
    console.log(data.value, error.value, "dataerror");
    if (error.value || data.value.code !== 200) {
      ElMessage({
        message: data.value.msg || error.value.msg,
        type: 'error',
        plain: true,
        grouping: true,
      })
    } else {
      ElMessage({
        message: type.value === 'edit' ? '更新成功' : '创建成功',
        type: 'success',
        plain: true,
      })
      router.go(-1);
    }
  }
};

// 保存
const handleWorkflowSave = async (result) => {
  if (result.success) {
    // 处理保存成功的逻辑
    console.log('工作流数据:', result.data);

    // 在 createJobs 模式下（创建任务），需要空间资源选择
    if (props.init === 'createJobs') {
      // 检查是否支持流式模式
      isStreamingCompatible.value = checkStreamingCompatibility(result.data);

      // 保存工作流结果
      pendingWorkflowResult.value = result.data;

      // 显示空间资源选择对话框（如果支持流式，会显示执行模式选择）
      resourceDialogVisible.value = true;
      console.log('显示空间资源选择对话框，支持流式模式:', isStreamingCompatible.value);
      return; // 等待用户选择
    } else {
      console.log('创建模板，不需要空间资源选择');
    }

    // 如果是创建模板，直接执行保存
    await proceedWithSave(result.data);
  } else {
    // 显示错误信息
    ElMessage.error({
      message: result.error,
      duration: 3000,
      plain: true,
      grouping: true,
    });
  }
};

const geback = () => {
  router.go(-1);
};
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

:deep(body) {
  width: calc(100% - 0px) !important;
}

// 空间资源对话框样式
.resource-dialog-content {
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

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
