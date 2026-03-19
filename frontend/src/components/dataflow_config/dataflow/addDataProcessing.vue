<template>
  <div class="text-left w-full h-full pl-8 py-8 overflow-auto bg-white">
    <div class="headerMenu flex items-center justify-start mb-[20px]">
      <SvgIcon class="w-5 h-5" name="dataflow_homeIcon" />
      <SvgIcon class="w-5 h-5 mx-2" name="dataflow_homeIcon_divider" />
      <p class="text-brand-700 text-sm font-medium cursor-pointer" @click="geback">
        {{ pageTitle }}
      </p>
      <SvgIcon class="w-5 h-5 mx-2" name="dataflow_homeIcon_divider" />
      <p class="text-brand-700 text-sm font-medium">
        {{ t("dataPipelines.newTask") }}
      </p>
    </div>
    <dataProcessingStep1 v-show="step === 1"></dataProcessingStep1>
    <dataProcessingStep2
      v-show="step === 2"
      :key="route.query?.templateName || 'default'"
      :init="'createJobs'"
    ></dataProcessingStep2>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";
import { ref, onMounted, provide, computed, watch } from "vue";
import { ElMessage } from "element-plus";
import useFetchApi from "../../../packs/useFetchApi";
import { convertUtcToLocalTime } from "../../../packs/datetimeUtils";
import { useI18n } from "vue-i18n";
import dataProcessingStep1 from "./dataProcessingStep1.vue";
import dataProcessingStep2 from "./dataProcessingStep2.vue";
const router = useRouter();
const route = useRoute();

const { t, locale } = useI18n();
const tableLoading = ref(false);

// 模板名称到国际化key的映射
const templateNameMap = {
  "数据过滤": "dataFilter",
  "数据筛选": "dataSelection",
  "数据脱敏": "dataDesensitization",
  "语义去重": "semanticDeduplication",
  "质量评测": "qualityEvaluation",
};

const form = ref({
  name: '',
  description: '',
  type: 'data_refine',
  dslText: '',
}); // 表单数据
const step = ref(1); // 表单步骤

// 动态页面标题 - 优先使用表单中选择的模板名称，否则使用URL参数
const pageTitle = computed(() => {
  // 有 URL 参数 templateName 时（从数据过滤/数据筛选等菜单进入），显示对应模板名称
  const templateName = route.query?.templateName;
  if (templateName && templateNameMap[templateName]) {
    return t(`dataPipelines.${templateNameMap[templateName]}`);
  }
  // 无 templateName 时（从任务列表「创建任务」进入），固定显示「任务列表」，不随下拉选择变化
  return t("dataPipelines.taskList");
});

provide("subForm", form);
provide("step", step);

// 切换模板类型（数据筛选、数据脱敏、语义去重等）时，重置为第一步并清空已填数据
watch(
  () => route.query?.templateName,
  (newName, oldName) => {
    if (newName && newName !== oldName) {
      step.value = 1;
      // 清空第一步表单中用户填写的数据，保留 owner 等默认值
      form.value.project_name = "";
      form.value.repo_id = "";
      form.value.branch = "";
      form.value.text_keys = "";
      form.value.dataset_path = "";
      form.value.export_path = "";
      form.value.process = [];
    }
  }
);

onMounted(() => {});

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
</style>
