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
                <!-- 执行按钮：非 Processing 状态 -->
                <el-button
                  v-if="scope.row.status !== 'Processing'"
                  type="text"
                  :class="[
                    'flex items-center justify-start cursor-pointer',
                    scope.row.status === 'Finished' ? 'text-gray-400' : ''
                  ]"
                  :disabled="scope.row.status === 'Finished'"
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
      width="720"
      align-center
      @closed="onExecuteDialogClosed"
    >
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
      <StorageSizeField v-model="executeStorageSize" />
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
const executeClusterId = ref("");
const executeClusterName = ref("");
const executeSpaceResourceId = ref("");
const executeResourceName = ref("");
const executeStorageSize = ref("4Gi");
const executeSubmitting = ref(false);
const executeSpaceResourceFieldsRef = ref(null);

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

const openExecuteDialog = (row) => {
  executePendingJobId.value = row.job_id;
  executeClusterId.value = "";
  executeClusterName.value = "";
  executeSpaceResourceId.value = "";
  executeResourceName.value = "";
  executeStorageSize.value = "4Gi";
  executeDialogKey.value = Date.now();
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

  const spaceNames =
    executeSpaceResourceFieldsRef.value?.resolveSelectionNames?.() ?? {};
  const params = {
    cluster_id: executeClusterId.value,
    cluster_name: spaceNames.cluster_name || executeClusterName.value,
    resource_id: executeSpaceResourceId.value,
    resource_name: spaceNames.resource_name || executeResourceName.value,
    space_resource_id: executeSpaceResourceId.value,
    storage_size: normalizeStorageSize(executeStorageSize.value),
  };

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
</style>
