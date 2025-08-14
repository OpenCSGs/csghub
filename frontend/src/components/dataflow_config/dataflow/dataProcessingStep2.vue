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
      <CsgButton
        class="btn btn-primary btn-md whitespace-nowrap mr-[5px]"
        v-loading="formLoading"
        @click="save(1)"
        :name="type === 'edit' ? t('dataPipelines.updateTemplate') : t('dataPipelines.creationCompleted')"
      />
      <CsgButton
        v-if="init === 'createJobs'"
        class="btn btn-primary btn-md whitespace-nowrap mr-[5px]"
        v-loading="formLoading"
        @click="centerDialogVisible = true"
        :name="t('dataPipelines.saveAndExecute')"
      />
      <!-- save(2) -->
    </div>

    <el-dialog
      v-model="centerDialogVisible"
      :title="t('dataPipelines.saveAndExecute')"
      width="500"
      align-center
      @close="saveDialogClose"
    >
      <el-radio-group v-model="is_run" class="execute-type">
        <el-radio :value="true" size="large">
          {{ t("dataPipelines.executeImmediately") }}</el-radio
        >
        <el-radio :value="false" size="large">
          {{ t("dataPipelines.selectTheExecutionTime") }}</el-radio
        >
      </el-radio-group>

      <el-date-picker
        v-if="is_run === false"
        v-model="form.task_run_time"
        value-format="YYYY-MM-DD HH:mm:ss"
        type="datetime"
        :placeholder="t('dataPipelines.PleaseSelectTime')"
        :disabled-date="disabledPastDate"
        :disabled-hours="disabledPastHours"
        :disabled-minutes="disabledPastMinutes"
        :disabled-seconds="disabledPastSeconds"
        style="width: 100%"
      />

      <template #footer>
        <div class="dialog-footer">
          <CsgButton
            class="btn btn-secondary-gray btn-md whitespace-nowrap"
            @click="centerDialogVisible = false"
            :name="t('dataPipelines.cancel')"
          />
          <CsgButton
            class="btn btn-primary btn-md whitespace-nowrap ml-[12px]"
            v-loading="subLoading"
            :name="t('dataPipelines.sure')"
            @click="save(2)"
          />
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";
import { ref, onMounted, inject, computed, watch, nextTick } from "vue";
import { ElMessage } from "element-plus";
import useFetchApi from "../../../packs/useFetchApi";
import { convertUtcToLocalTime } from "../../../packs/datetimeUtils";
import { useI18n } from "vue-i18n";
import dayjs from 'dayjs';
import workflowEditor from './workflowEditor.vue'

const workflowEditorRef = ref(null);

const centerDialogVisible = ref(false);
const is_run = ref(true);

const router = useRouter();
const route = useRoute()
const { t, locale } = useI18n();
const formLoading = ref(false);

const templateId = computed(() => route.query.templateId)
const type = computed(() => route.query.type)

const formData = ref(null);
const form = inject("subForm");
const step = inject("step");

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

const saveDialogClose = () => {
  is_run.value = true;
  form.value.task_run_time = "";
}

// 获取当前时间（使用computed保持响应式）
const now = computed(() => dayjs());

// 禁用过去的日期（包括今天之前的）
const disabledPastDate = (time) => {
  return time.getTime() < now.value.startOf('day').valueOf();
};

// 禁用今天已经过去的小时
const disabledPastHours = () => {
  const hours = [];
  for (let i = 0; i < now.value.hour(); i++) {
    hours.push(i);
  }
  return hours;
};

// 禁用当前小时已经过去的分钟
const disabledPastMinutes = (selectedHour) => {
  if (selectedHour === now.value.hour()) {
    const minutes = [];
    for (let i = 0; i < now.value.minute(); i++) {
      minutes.push(i);
    }
    return minutes;
  }
  return [];
};

// 禁用当前分钟已经过去的秒
const disabledPastSeconds = (selectedHour, selectedMinute) => {
  if (selectedHour === now.value.hour() && selectedMinute === now.value.minute()) {
    const seconds = [];
    for (let i = 0; i < now.value.second(); i++) {
      seconds.push(i);
    }
    return seconds;
  }
  return [];
};

const isRun = ref(false);
const save = async (type) => {
  isRun.value = type === 2;
  if (workflowEditorRef.value) {
    workflowEditorRef.value.saveWorkflow();
  }

  // formData.value.validate(async (valid, fields) => {
  //   console.log(valid, "validvalidvalidvalid");
  //   if (valid && !formLoading.value) {
  //     // formLoading.value = true;
  //     step.value = 2;
  //   }
  // });
};

// 保存
const handleWorkflowSave = async (result) => {
  if (result.success) {
    // 处理保存成功的逻辑
    console.log('工作流数据:', result.data);

    if (props.init === 'createTemplate') {
      const combinedData = {
        id: type.value === 'edit' ? templateId.value : '',
        ...form.value,
        dslText: result.data.yaml
      };

      console.log('合并后的数据:', combinedData);
      
      const options = {
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(combinedData)
      }
      
      const url = type.value === 'edit' ? `/dataflow/algo_templates/${templateId.value}` : '/dataflow/algo_templates/'
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
        // window.location.href = '/datapipelines/customTemplate'
      }
    } else {
      // 创建任务
      
      let combinedData = {
        ...form.value,
        dslText: result.data.yaml,
        is_run: isRun.value,
        process: [],
      }

      if (is_run.value) {
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
        // window.location.href = '/datapipelines/customTemplate'
      }
    }
    
    
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

// ::-webkit-scrollbar {
//   width: 0;
//   height: 0; 
// }

.execute-type {
  :deep(.el-radio) {
    width: 100% !important;
  }
}
</style>
