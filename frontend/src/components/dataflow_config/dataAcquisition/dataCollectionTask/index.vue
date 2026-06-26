<template>
  <div class="text-left w-full h-full pl-8 py-8 overflow-auto bg-white">
    <!-- <div class="headerMenu flex items-center justify-start mb-[20px]">
      <SvgIcon class="w-5 h-5" name="dataflow_homeIcon" />
      <SvgIcon class="w-5 h-5 mx-2" name="dataflow_homeIcon_divider" />
      <p class="text-brand-700 text-sm font-medium">
        {{ t("dataPipelines.dataCollectionTask") }}
      </p>
    </div> -->
    <div class="headerMenu flex items-center justify-start mb-5">
      <SvgIcon class="w-5 h-5" name="dataflow_homeIcon" />
      <SvgIcon class="w-5 h-5 mx-2" name="dataflow_homeIcon_divider" />
      <p
        class="text-gray-700 text-sm font-medium cursor-pointer hover:text-brand-700"
        @click="router.back()"
      >
        {{ t("dataPipelines.dataSourceManagement") }}
      </p>
      <SvgIcon class="w-5 h-5 mx-2" name="dataflow_homeIcon_divider" />
      <p class="text-brand-700 text-sm font-medium">
        {{ t("dataPipelines.dataCollectionTask") }}
      </p>
    </div>
    <p class="text-gray-900 text-3xl font-medium">
      {{ t("dataPipelines.dataCollectionTask") }}
    </p>

    <div class="mainOption mt-8">
      <p class="text-gray-700 text-sm mb-1.5">
        {{ t("dataPipelines.searchProcessing") }}
      </p>
      <div class="flex items-center justify-between gap-3 xs:block">
        <el-input
          style="width: 100%"
          v-model="form.searchStr"
          @keyup.enter=""
          @clear=""
          :placeholder="`${t('dataPipelines.toInput')}${t(
            'dataPipelines.taskName'
          )}`"
          clearable
          ><template #prefix>
            <el-icon class="el-input__icon w-5 h-5"><search /></el-icon>
          </template>
        </el-input>
      </div>
    </div>

    <div class="task-list mt-[20px]">
      <div class="text-gray-900 text-2xl font-medium mb-[20px]">
        {{ t("dataPipelines.taskList") }}
      </div>
      <div class="task-item" v-for="item in tableData" :key="item.id">
        <div
          :class="{
            header: true,
            'bg-gray-100': item.task_status === 0,
            'bg-blue-100': item.task_status === 1,
            'bg-green-100': item.task_status === 2,
            'bg-red-100': item.task_status === 3,
            'bg-gray-100': item.task_status === 4,
          }"
        >
          <div class="flex items-center">
            <div class="flex items-center mr-[10px]">
              <img
                :src="`/images/task_status_${item.task_status}.png`"
                class="w-[50px] h-[50px] rounded-full"
              />
            </div>
            <div>
              <p class="text-gray-500 text-xs mb-[6px]">
                {{ t("dataPipelines.taskName") }}
              </p>
              <div>{{ item.datasource?.name || "-" }}</div>
            </div>
          </div>
          <div>
            <p class="text-gray-500 text-xs mb-[6px]">
              {{ t("dataPipelines.taskType") }}
            </p>
            <div>{{ item.datasource?.datasource_type || "-" }}</div>
          </div>
          <div>
            <p class="text-gray-500 text-xs mb-[6px]">
              {{ t("dataPipelines.taskStatus") }}
            </p>
            <div>
              {{
                taskStatusVal.find((val) => val.value === item.task_status)
                  ?.label || "-"
              }}
            </div>
          </div>
          <div class="text-right">
            <p class="text-gray-500 text-xs mb-[6px]">
              {{ t("dataPipelines.startAt") }}：{{ item.start_run_at ? convertUtcToLocalTime(item.start_run_at) : "-" }}
            </p>
            <el-progress
              :percentage="
                item.total_count > 0
                  ? Math.round((item.records_count / item.total_count) * 100)
                  : 0
              "
              :stroke-width="8"
              :text-inside="true"
              :show-text="false"
              :status="
                item.task_status === 3
                  ? 'exception'
                  : item.records_count / item.total_count === 1
                  ? 'success'
                  : 'Full'
              "
            />
            <!-- 错误 -->
            <p
              class="text-red-900 text-xs mt-[6px]"
              v-if="item.task_status === 3"
            >
              {{ t("dataPipelines.TaskFailed") }}
            </p>
            <!-- 手动停止 -->
            <p
              class="text-gray-500 text-xs mt-[6px]"
              v-else-if="item.task_status === 4"
            >
              {{ t("dataPipelines.manualStop") }}
            </p>
            <!-- 已完成 -->
            <p
              class="text-green-900 text-xs mt-[6px]"
              v-else-if="item.task_status === 2"
            >
              {{ t("dataPipelines.completed") }}
            </p>

            <p class="text-gray-500 text-xs mt-[6px]" v-else>
              {{
                item.total_count > 0
                  ? Math.round((item.records_count / item.total_count) * 100)
                  : 0
              }}%{{ t("dataPipelines.done") }}
            </p>
          </div>
        </div>

        <div class="task-info">
          <div class="task-info__grid">
            <div class="task-info__cell">
              <p class="text-gray-500 text-xs mb-[6px]">
                {{ t("dataPipelines.dataFlow") }}
              </p>
              <div class="text-md font-normal truncate" :title="displayDataFlow(item)">
                <span
                  v-if="item.export_repo_id && item.export_branch_name"
                  class="text-brand-600 hover:underline cursor-pointer"
                  @click="toDatasetPage(item.export_repo_id, item.export_branch_name)"
                >{{ displayDataFlow(item) }}</span>
                <span v-else>{{ displayDataFlow(item) }}</span>
              </div>
            </div>
            <div class="task-info__cell">
              <p class="text-gray-500 text-xs mb-[6px]">
                {{ t("dataPipelines.recordsHaveBeenImported") }}
              </p>
              <div class="text-md font-normal">{{ item.records_count ?? 0 }}</div>
            </div>
            <div class="task-info__cell">
              <p class="text-gray-500 text-xs mb-[6px]">
                {{ t("dataPipelines.totalNumberOfRecords") }}
              </p>
              <div class="text-md font-normal">{{ item.total_count ?? 0 }}</div>
            </div>
            <div class="task-info__cell">
              <p class="text-gray-500 text-xs mb-[6px]">
                {{ t("dataPipelines.region") }}
              </p>
              <div class="task-info__value-box text-md font-normal">
                {{ displayRegion(item) }}
              </div>
            </div>
            <div class="task-info__cell task-info__cell--span-2">
              <p class="text-gray-500 text-xs mb-[6px]">
                {{ t("dataPipelines.spaceCloudResources") }}
              </p>
              <div
                class="task-info__value-box task-info__value-box--resource text-md font-normal"
              >
                <span
                  v-if="formatResourceParts(item).product"
                  class="task-info__resource-part"
                >{{ formatResourceParts(item).product }}</span>
                <span
                  class="task-info__resource-part task-info__resource-part--main"
                >
                  {{ formatResourceParts(item).spec }}
                </span>
                <span
                  v-if="formatResourceParts(item).extra"
                  class="task-info__resource-part"
                >{{ formatResourceParts(item).extra }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="task-actions pl-[20px] pr-[20px] pt-1 pb-[20px] flex flex-wrap items-center justify-start gap-3">
          <button
            v-if="canShowSubtasks(item)"
            type="button"
            class="task-extra__toggle-btn"
            @click.stop="toggleSubtasks(item.id, item)"
          >
            <el-icon class="task-extra__toggle-btn-icon"><List /></el-icon>
            <span>{{ t("dataPipelines.viewSubtasks") }}</span>
            <el-icon class="task-extra__toggle-btn-chevron">
              <ArrowUp v-if="isSubtasksExpanded(item.id)" />
              <ArrowDown v-else />
            </el-icon>
          </button>
          <!-- 取消任务 -->
          <el-popconfirm
            v-if="item.task_status === 1"
            :title="`${t('dataPipelines.cancelConfirm')}?`"
            :confirm-button-text="t('dataPipelines.confirm')"
            :cancel-button-text="t('dataPipelines.cancel')"
            width="220px"
            @confirm="cancelTask(item.id)"
          >
            <template #reference>
              <CsgButton
                class="btn btn-secondary-gray btn-sm whitespace-nowrap"
                style="border-color: #e14b44; color: #e14b44"
                :name="t('dataPipelines.cancelTask')"
                :isElementIcon="true"
                svgName="VideoPause"
              />
            </template>
          </el-popconfirm>
          <!-- 刷新 -->
          <CsgButton
            v-if="item.task_status === 1"
            class="btn btn-secondary-gray btn-sm whitespace-nowrap"
            :name="t('dataPipelines.refreshStatus')"
            :isElementIcon="true"
            @click="
              gettaskList().then(() =>
                ElMessage.success(t('dataPipelines.operationSuccessful'))
              )
            "
            svgName="Refresh"
          />
          <!-- 查看日志 -->
          <CsgButton
            v-if="item.task_status === 2 || item.task_status === 3"
            class="btn btn-secondary-gray btn-sm whitespace-nowrap"
            :name="t('dataPipelines.viewLog')"
            :isElementIcon="true"
            @click="getLog(item)"
            svgName="Document"
          />
          <!-- 重新运行 -->
          <el-popconfirm
            v-if="
              item.task_status === 2 ||
              item.task_status === 3 ||
              item.task_status === 4
            "
            :title="`${t('dataPipelines.rerunItConfirm')}?`"
            :confirm-button-text="t('dataPipelines.confirm')"
            :cancel-button-text="t('dataPipelines.cancel')"
            width="220px"
            @confirm="rerunIt(item.id)"
          >
            <template #reference>
              <CsgButton
                class="btn btn-secondary-gray btn-sm whitespace-nowrap"
                :name="t('dataPipelines.RunItAgain')"
                @click="rerunIt(item.id)"
                :isElementIcon="true"
                svgName="RefreshRight"
              />
            </template>
          </el-popconfirm>
          <el-popconfirm
            v-if="item.can_delete && item.task_status !== 1"
            :title="`${t('dataPipelines.deleteConfirm')}?`"
            :confirm-button-text="t('dataPipelines.confirm')"
            :cancel-button-text="t('dataPipelines.cancel')"
            width="220px"
            @confirm="handleDelete(item.id)"
          >
            <template #reference>
              <CsgButton
                class="btn btn-secondary-gray btn-sm whitespace-nowrap"
                :name="t('dataPipelines.delete')"
                :isElementIcon="true"
                svgName="Delete"
              />
            </template>
          </el-popconfirm>
          <CsgButton
            v-else-if="item.task_status !== 1"
            class="btn btn-secondary-gray btn-sm whitespace-nowrap opacity-50 cursor-not-allowed"
            :name="t('dataPipelines.delete')"
            :isElementIcon="true"
            svgName="Delete"
            :disabled="true"
          />
        </div>
        <div
          v-if="canShowSubtasks(item) && isSubtasksExpanded(item.id)"
          class="task-extra task-extra__table px-5 pb-4"
        >
          <el-table
            :data="getSubtaskRows(item.id)"
            :border="false"
            size="default"
            class="task-extra__subtable task-extra__subtable--plain w-full"
            :empty-text="t('dataPipelines.noData')"
            :header-cell-style="subtaskTableHeaderStyle"
            :cell-style="subtaskTableCellStyle"
            v-loading="!!subtasksLoading[String(item.id)]"
          >
            <el-table-column
              prop="id"
              :label="t('dataPipelines.subtaskIdentifier')"
              min-width="100"
            />
            <el-table-column
              prop="task_name"
              :label="t('dataPipelines.taskName')"
              min-width="160"
            >
              <template #default="scope">
                {{ resolveSubtaskDisplayName(scope.row, t) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="status"
              :label="t('dataPipelines.executionStatus.label')"
              min-width="110"
            >
              <template #default="scope">
                {{ resolveSubtaskStatusLabel(scope.row.status, t) }}
              </template>
            </el-table-column>
            <el-table-column
              :label="t('dataPipelines.startTime')"
              min-width="160"
            >
              <template #default="scope">
                <span>{{ scope.row.started_at ? convertUtcToLocalTime(scope.row.started_at) : '-' }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="t('dataPipelines.endTime')"
              min-width="160"
            >
              <template #default="scope">
                <span>{{ scope.row.finished_at ? convertUtcToLocalTime(scope.row.finished_at) : '-' }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="t('dataPipelines.operations')"
              min-width="120"
              align="left"
            >
              <template #default="scope">
                <el-button
                  size="small"
                  class="task-extra__log-btn"
                  @click.stop="viewSubtaskLog(item, scope.row)"
                >
                  <el-icon class="task-extra__log-btn-icon"><Document /></el-icon>
                  {{ t("dataPipelines.viewLog") }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

      </div>
    </div>

    <div class="borderBox mt-8" v-if="fasle">
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
            min-width="270"
          />
          <el-table-column
            prop="job_type"
            :label="t('dataPipelines.taskType')"
            min-width="150"
          >
            <template #default="scope">
              {{
                `${scope.row.job_source}/${
                  scope.row.job_source == "pipeline"
                    ? scope.row.job_type
                      ? t(`dataPipelines.${scope.row.job_type}`)
                      : "-"
                    : scope.row.job_type
                }`
              }}
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
                <span class="text-sm">{{
                  scope.row.status
                    ? t(`dataPipelines.${scope.row.status}`)
                    : "-"
                }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="data_source"
            :label="t('dataPipelines.dataSource')"
            min-width="200"
          >
            <template #default="scope">
              <span
                class="text-brand-600 hover:underline cursor-pointer"
                @click="toDatasetPage(scope.row.repo_id, scope.row.branch)"
                >{{
                  `${scope.row.repo_id || "-"}>${scope.row.branch || "-"}`
                }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            prop="data_target"
            :label="t('dataPipelines.dataFlow')"
            min-width="200"
          >
            <template #default="scope">
              <span
                class="text-brand-600 hover:underline cursor-pointer"
                @click="
                  toDatasetPage(
                    scope.row.export_repo_id,
                    scope.row.export_branch_name
                  )
                "
                >{{
                  `${scope.row.export_repo_id || "-"}>${
                    scope.row.export_branch_name || "-"
                  }`
                }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            prop="date_posted"
            :label="t('dataPipelines.startTime')"
            min-width="200"
          >
            <template #default="scope">
              <span>{{
                scope.row.date_posted
                  ? convertUtcToLocalTime(scope.row.date_posted)
                  : "-"
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="token"
            :label="t('dataPipelines.operations')"
            min-width="180"
            fixed="right"
          >
            <template #default="scope">
              <div class="settingsTableBtn flex items-center justify-start">
                <el-popconfirm
                  v-if="scope.row.can_delete"
                  :title="`${t('dataPipelines.deleteConfirm')}?`"
                  :confirm-button-text="t('dataPipelines.confirm')"
                  :cancel-button-text="t('dataPipelines.cancel')"
                  width="220px"
                  @confirm="handleDelete(scope.row.id)"
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
                <el-button
                  class="flex items-center justify-start cursor-pointer"
                  type="text"
                  @click="
                    goToNewTask(
                      `/datapipelines/dataflowInfo?id=${scope.row.job_id}&type=${scope.row.job_source}`
                    )
                  "
                  >{{
                    scope.row.job_source == "pipeline"
                      ? t("dataPipelines.details")
                      : t("dataPipelines.log")
                  }}
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
import { ElMessage } from "element-plus";
import { List, ArrowDown, ArrowUp, Document } from "@element-plus/icons-vue";
import useFetchApi from "../../../../packs/useFetchApi";
import {
  resolveCsghubLogParamsFromTask,
  describeCsghubLogParamsGap,
} from "../../../../packs/csghubDataflowLogs";
import { convertUtcToLocalTime } from "../../../../packs/datetimeUtils";
import { resolveSubtaskDisplayName, resolveSubtaskStatusLabel } from "../../../../packs/subtaskDisplayName.js";
import { useI18n } from "vue-i18n";

const { t, locale } = useI18n();
const router = useRouter();
const route = useRoute();

const tableLoading = ref(false);
// 数据源类型列表
const dataList = ref([]);
// 任务列表
const tableData = ref([]);
const taskStatusVal = ref([
  {
    value: 0,
    label: `${t("dataPipelines.waiting")}`,
    type: "warning",
  },
  {
    value: 1,
    label: `${t("dataPipelines.inProgress")}`,
    type: "primary",
  },
  {
    value: 2,
    label: `${t("dataPipelines.completed")}`,
    type: "success",
  },
  {
    value: 3,
    label: `${t("dataPipelines.error")}`,
    type: "danger",
  },
  {
    value: 4,
    label: `${t("dataPipelines.manualStop")}`,
    type: "danger",
  },
]);

const form = ref({
  searchStr: "",
});

const subtasksByTaskId = reactive({});
const subtasksLoading = reactive({});

// 本次执行的数据流向：目标数据集 + 实际写入分支（后端 export_repo_id / export_branch_name）
const displayDataFlow = (item) => {
  const repoId = item?.export_repo_id;
  const branch = item?.export_branch_name;
  if (repoId && branch) return `${repoId}>${branch}`;
  if (repoId) return repoId;
  return "-";
};

const displayRegion = (item) => {
  const name =
    item?.cluster_name ||
    item?.datasource?.cluster_name ||
    item?.cluster_id;
  return name != null && String(name).trim() !== "" ? String(name) : "-";
};

const formatResourceParts = (item) => {
  const full =
    item?.resource_name ||
    item?.datasource?.resource_name ||
    "";
  if (!full) {
    return { product: "", spec: "-", extra: "" };
  }
  const parts = String(full)
    .split(/[·]/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (parts.length >= 3) {
    return {
      product: parts[0],
      spec: parts[1],
      extra: parts.slice(2).join(" · "),
    };
  }
  if (parts.length === 2) {
    return { product: parts[0], spec: parts[1], extra: "" };
  }
  return { product: "", spec: full, extra: "" };
};

const getSubtaskRows = (taskId) => subtasksByTaskId[String(taskId)] || [];

/** 仅 CSGHub 主任务创建成功（有 csghub_job_id）时才展示/查询子任务 */
const canShowSubtasks = (item) => Boolean(item?.csghub_job_id);

const loadSubtasks = async (taskId) => {
  const key = String(taskId);
  subtasksLoading[key] = true;
  const { data } = await useFetchApi(
    `/dataflow/datasource/tasks/${taskId}/subtasks`
  )
    .get()
    .json();
  subtasksLoading[key] = false;
  if (data.value?.code === 200) {
    const list = data.value.data?.list || [];
    subtasksByTaskId[key] = list.map((row) => ({
      ...row,
      display_task_name: resolveSubtaskDisplayName(row, t),
    }));
  } else {
    subtasksByTaskId[key] = [];
    if (data.value?.msg) {
      ElMessage.warning(data.value.msg);
    }
  }
};

/** 子任务表：表头 / 单元格（无竖线、浅灰表头、行底部分割线） */
const subtaskTableHeaderStyle = {
  background: "#f8f8f9",
  color: "#909399",
  fontWeight: "400",
  borderBottom: "1px solid #ebeef5",
};
const subtaskTableCellStyle = {
  color: "#606266",
  borderBottom: "1px solid #ebeef5",
  paddingTop: "14px",
  paddingBottom: "14px",
};

const subtasksOpen = reactive({});
const toggleSubtasks = async (id, item) => {
  if (item && !canShowSubtasks(item)) return;
  const key = String(id);
  const willOpen = !subtasksOpen[key];
  subtasksOpen[key] = willOpen;
  if (willOpen) {
    await loadSubtasks(id);
  } else {
    delete subtasksByTaskId[key];
  }
};
const isSubtasksExpanded = (id) => !!subtasksOpen[String(id)];

// 自动刷新定时器（当有进行中任务时每 5 秒刷新一次）
const REFRESH_INTERVAL = 5000;
let refreshTimer = null;

/**
 * 检查是否有进行中的任务
 */
const hasRunningTasks = () => {
  return tableData.value.some((item) => item.task_status === 1);
};

/**
 * 启动自动刷新
 */
const startAutoRefresh = () => {
  if (refreshTimer) return;
  refreshTimer = setInterval(async () => {
    await gettaskList();
    if (!hasRunningTasks()) {
      stopAutoRefresh();
    }
  }, REFRESH_INTERVAL);
};

/**
 * 停止自动刷新
 */
const stopAutoRefresh = () => {
  if (refreshTimer) {
    clearInterval(refreshTimer);
    refreshTimer = null;
  }
};

onMounted(() => {
  getDataSourceTypeList();
  gettaskList();
});

onBeforeUnmount(() => {
  stopAutoRefresh();
});

const getDataFlowListFun = async () => {
  const url = `/dataflow/jobs?query=${form.value.searchStr}`;
  tableLoading.value = true;

  const { data } = await useFetchApi(url).get().json();

  if (data.value.code === 200) {
    tableData.value = data.value.data.list;
  }
  tableLoading.value = false;
};
const handleDelete = async (id) => {
  const url = `/dataflow/datasource/collection/task/${id}`;
  const { data } = await useFetchApi(url).delete().json();
  if (data.value?.code === 200) {
    ElMessage.success(t("dataPipelines.operationSuccessful"));
    gettaskList();
  } else {
    ElMessage.error(data.value?.msg || t("dataPipelines.operationFailed"));
  }
};
const toDatasetPage = (path, branch) => {
  if (path && branch) {
    window.location.href = `/datasets/${path}?tab=files&actionName=files&branch=${branch}`;
  }
};

const goToNewTask = (path) => {
  router.push(path);
};

/**
 * 获取任务列表
 */
const gettaskList = async () => {
  const url = `/dataflow/datasource/collectiontasks/list?page=1&pageSize=10000&datasource_id=${route.query.id}`;
  const { data } = await useFetchApi(url).get().json();
  if (data.value.code === 200) {
    tableData.value = data.value.data.list;

    // 根据是否有进行中任务更新自动刷新状态
    if (hasRunningTasks()) {
      startAutoRefresh();
    } else {
      stopAutoRefresh();
    }
    return true;
  }
};

/**
 * 停止任务
 * @param task_id 任务id
 */
const cancelTask = async (task_id) => {
  let url = `/dataflow/datasource/tasks/stop/${task_id}`;
  const { data } = await useFetchApi(url).post().json();
  console.log("停止任务：", data);
  if (data.value.code === 200) {
    ElMessage.success(t("dataPipelines.operationSuccessful"));
  } else {
    ElMessage.error(data.value.msg);
  }
  gettaskList();
};

/**
 * 查看主任务日志（直连 CSGHub）
 */
const getLog = (task) => {
  const { namespaceUuid, jobId } = resolveCsghubLogParamsFromTask(task);
  if (!namespaceUuid || !jobId) {
    const missing = describeCsghubLogParamsGap({ namespaceUuid, jobId });
    ElMessage.error(`任务未提交到 CSGHub，无法查看日志（缺少：${missing.join("、")}）`);
    return;
  }
  router.push({
    path: "/datapipelines/viewLog",
    query: {
      type: "datasource",
      namespace_uuid: namespaceUuid,
      csghub_job_id: jobId,
      task_uid: task.task_uid,
    },
  });
};

/**
 * 查看子任务日志（直连 CSGHub，带 dag_task_id）
 */
const viewSubtaskLog = (parentTask, subtaskRow) => {
  const dagTaskId = subtaskRow?.dag_task_id || subtaskRow?.task_id;
  const jobId = parentTask?.csghub_remote_job_id || parentTask?.csghub_job_id;
  if (!dagTaskId) {
    ElMessage.error("子任务 ID 缺失");
    return;
  }
  if (!parentTask?.namespace_uuid || !jobId) {
    ElMessage.error("任务未提交到 CSGHub，无法查看子任务日志");
    return;
  }
  router.push({
    path: "/datapipelines/viewLog",
    query: {
      type: "datasource",
      namespace_uuid: parentTask.namespace_uuid,
      csghub_job_id: jobId,
      dag_task_id: String(dagTaskId),
      task_uid: parentTask.task_uid,
    },
  });
};

/**
 * 重新运行
 * @param task_id 任务id
 */
const rerunIt = async (task_id) => {
  let url = `/dataflow/datasource/tasks/execute/${task_id}`;
  const { data } = await useFetchApi(url).post().json();
  console.log("重新运行：", data);
  if (data.value.code === 200) {
    ElMessage.success(t("dataPipelines.operationSuccessful"));
  } else {
    ElMessage.error(data.value.msg);
  }
  gettaskList();
};

/**
 * 获取数据源列表
 */
const getDataSourceTypeList = async () => {
  let url = "/dataflow/datasource/datasource/get_data_source_type_list";
  const { data } = await useFetchApi(url).get().json();
  if (data.value?.code === 200) {
    dataList.value = data.value.data;
  }
};
</script>
<style lang="less" scoped>
:deep(.el-form--inline.el-form--label-top .el-form-item) {
  width: calc(33% - 12px);
  margin-bottom: 0;
}
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

.task-list {
  border: 1px #e4e7ed solid;
  padding: 20px;
  border-radius: 8px;

  .task-item {
    border: 1px #e4e7ed solid;
    border-radius: 8px;
    font-size: 14px;
    color: #101828;
    font-weight: 400;
    margin-bottom: 15px;

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      // background: #f9fafb;
      padding: 15px 20px;
      border-radius: 8px;
    }

    .task-info {
      padding: 20px;

      &__grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        column-gap: 12px;
        row-gap: 16px;
        align-items: start;
      }

      &__cell {
        min-width: 0;
      }

      &__cell--span-2 {
        grid-column: span 2;
      }

      &__value-box {
        box-sizing: border-box;
        width: 100%;
        padding: 10px 14px;
        background: #f5f5f5;
        border-radius: 6px;
        color: #101828;
      }

      &__value-box--resource {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px 24px;
        flex-wrap: wrap;
      }

      &__resource-part {
        flex: 0 0 auto;
        white-space: nowrap;
      }

      &__resource-part--main {
        flex: 1 1 auto;
        min-width: 0;
        white-space: normal;
        text-align: center;
      }
    }

    .task-extra {
      font-size: 14px;
      color: #101828;

      &__toolbar {
        padding-top: 8px;
        padding-bottom: 4px;
      }

      &__table {
        margin-top: 14px;
      }

      &__toggle-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        margin: 0;
        padding: 8px 18px;
        border-radius: 999px;
        border: 1px solid #3250bd;
        background: #f0f2ff;
        color: #3250bd;
        font-size: 14px;
        font-weight: 500;
        line-height: 1.25;
        cursor: pointer;
        font-family: inherit;
        transition:
          background 0.15s ease,
          border-color 0.15s ease,
          color 0.15s ease;

        &:hover {
          background: #e4e8ff;
          border-color: #223b99;
          color: #223b99;
        }

        &:focus-visible {
          outline: 2px solid #3250bd;
          outline-offset: 2px;
        }
      }

      &__toggle-btn-icon,
      &__toggle-btn-chevron {
        font-size: 16px;
        flex-shrink: 0;
      }

      &__toggle-btn-chevron {
        margin-left: 2px;
      }

      &__result-tag {
        border: none !important;
        font-weight: 400;
        height: auto;
        line-height: 1.4;
        padding: 4px 12px;

        &--success {
          background-color: #f0f9eb !important;
          color: #67c23a !important;
        }

        &--failure {
          background-color: #fef0f0 !important;
          color: #f56c6c !important;
        }
      }

      &__log-btn {
        background: #fff !important;
        border: 1px solid #dcdfe6 !important;
        color: #606266 !important;
        border-radius: 6px !important;
        padding: 6px 12px !important;
        font-weight: 400;

        &:hover,
        &:focus {
          background: #f5f7fa !important;
          border-color: #c0c4cc !important;
          color: #606266 !important;
        }
      }

      &__log-btn-icon {
        margin-right: 4px;
        font-size: 14px;
        vertical-align: middle;
      }

      :deep(.task-extra__subtable--plain.el-table) {
        --el-table-border-color: #ebeef5;
        --el-table-bg-color: #fff;
        background: #fff;
        border-radius: 8px;
        overflow: hidden;

        &::before,
        &::after {
          display: none;
        }

        .el-table__inner-wrapper::before {
          display: none;
        }

        .el-table__header-wrapper th.el-table__cell {
          background: #f8f8f9 !important;
        }

        th.el-table__cell,
        td.el-table__cell {
          border-right: none !important;
        }
      }
    }
  }
}
</style>
