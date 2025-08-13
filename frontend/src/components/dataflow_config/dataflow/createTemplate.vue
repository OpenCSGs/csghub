<template>
  <div class="text-left w-full h-full pl-8 py-8 overflow-auto bg-white">
    <div class="headerMenu flex items-center justify-start mb-[20px]">
      <SvgIcon class="w-5 h-5" name="dataflow_homeIcon" />
      <SvgIcon class="w-5 h-5 mx-2" name="dataflow_homeIcon_divider" />
      <p class="text-brand-700 text-sm font-medium cursor-pointer" @click="navigateToPage">
        {{ url === 'customize' ? t("dataPipelines.customTemplate") : t("dataPipelines.builtInTemplate") }}
      </p>
      <SvgIcon class="w-5 h-5 mx-2" name="dataflow_homeIcon_divider" />
      <p class="text-brand-700 text-sm font-medium">
        {{ title }}
      </p>
    </div>
    <createTemplateStep1 v-show="step === 1"></createTemplateStep1>
    <dataProcessingStep2 v-show="step === 2" :init="'createTemplate'"></dataProcessingStep2>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";
import { ref, onMounted, provide, computed } from "vue";
import { ElMessage } from "element-plus";
import useFetchApi from "../../../packs/useFetchApi";
import { convertUtcToLocalTime } from "../../../packs/datetimeUtils";
import { useI18n } from "vue-i18n";
import createTemplateStep1 from "./createTemplateStep1.vue";
import dataProcessingStep2 from "./dataProcessingStep2.vue";
const router = useRouter();
const route = useRoute()

const { t, locale } = useI18n();
const tableLoading = ref(false);
const yamlWorkflow = ref('');

const url = route.query.url

const title = computed(() => {
  return route.query.type === 'add'
    ? `${t('dataPipelines.create')}${t('dataPipelines.algorithmTemplate')}`
    : route.query.type === 'copy'
    ? `${t('dataPipelines.copy')}${t('dataPipelines.algorithmTemplate')}`
    : `${t('dataPipelines.edit')}${t('dataPipelines.algorithmTemplate')}`
})

const form = ref({
  name: '',
  description: '',
  type: 'data_refine',
  dslText: '',
}); // 表单数据
const step = ref(1); // 表单步骤

provide("subForm", form);
provide("step", step);

/**
 * 跳转
 */
const navigateToPage = () => {
  // router.push("/datapipelines/customTemplate");
  router.back();
};

onMounted(() => {});
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
