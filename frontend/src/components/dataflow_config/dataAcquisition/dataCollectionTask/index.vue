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
              {{ t("dataPipelines.startAt") }}：{{ item.start_run_at || "-" }}
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
          <div>
            <p class="text-gray-500 text-xs mb-[6px]">
              {{ t("dataPipelines.taskRunningHost") }}
            </p>
            <div class="text-xl">{{ item.task_run_host || "-" }}</div>
          </div>
          <div>
            <p class="text-gray-500 text-xs mb-[6px]">
              {{ t("dataPipelines.recordsHaveBeenImported") }}
            </p>
            <div class="text-xl">{{ item.records_count }}</div>
          </div>
          <div>
            <p class="text-gray-500 text-xs mb-[6px]">
              {{ t("dataPipelines.totalNumberOfRecords") }}
            </p>
            <div class="text-xl">{{ item.total_count }}</div>
          </div>
        </div>

        <div class="pl-[20px] pr-[20px] pb-[20px]">
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
                class="btn btn-secondary-gray btn-sm whitespace-nowrap mr-[16px]"
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
            class="btn btn-secondary-gray btn-sm whitespace-nowrap mr-[16px]"
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
            class="btn btn-secondary-gray btn-sm whitespace-nowrap mr-[16px]"
            :name="t('dataPipelines.viewLog')"
            :isElementIcon="true"
            @click="getLog(item.task_uid)"
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
                class="btn btn-secondary-gray btn-sm whitespace-nowrap mr-[16px]"
                :name="t('dataPipelines.RunItAgain')"
                @click="rerunIt(item.id)"
                :isElementIcon="true"
                svgName="RefreshRight"
              />
            </template>
          </el-popconfirm>
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
import { ref, reactive, onMounted } from "vue";
import { ElMessage } from "element-plus";
import useFetchApi from "../../../../packs/useFetchApi";
import { convertUtcToLocalTime } from "../../../../packs/datetimeUtils";
import { useI18n } from "vue-i18n";
import { Router } from "@antv/x6/lib/registry";

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

onMounted(() => {
  getDataSourceTypeList();
  gettaskList();
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
  const url = `/dataflow/jobs/${id}`;

  const { data, error } = await useFetchApi(url).delete().json();

  // if (error.value) {
  //   ElMessage({
  //     message: `操作失败: ${error.value.msg}`,
  //     type: "error",
  //   });
  // } else {
  //   ElMessage({
  //     message: "删除成功",
  //     type: "success",
  //   });
  // }
};
const toDatasetPage = (path, branch) => {
  if (path && branch) {
    window.location.href = `/datasets/${path}/files/${branch}`;
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
 * 查看日志
 * @param task_id 任务id
 */
const getLog = async (task_uid) => {
  router.push({
    path: "/datapipelines/viewLog",
    query: {
      task_uid: task_uid,
      type: "datasource",
    },
  });
  // let url = `/dataflow/task_log/list?task_uid=${task_uid}&type=datasource`;
  // const { data } = await useFetchApi(url).get().json();
  // console.log("日志：", data);
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
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px;

      > div {
        width: 33%;
      }
    }
  }
}
</style>
