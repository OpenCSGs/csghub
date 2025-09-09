<template>
  <div class="text-left w-full h-full pl-8 py-8 overflow-auto bg-white">
    <div class="headerMenu flex items-center justify-start mb-[20px]">
      <SvgIcon class="w-5 h-5" name="dataflow_homeIcon" />
      <SvgIcon class="w-5 h-5 mx-2" name="dataflow_homeIcon_divider" />
      <p class="text-brand-700 text-sm font-medium">
        {{ t("dataPipelines.systemDashboard") }}
      </p>
    </div>
    <p class="text-gray-900 text-2xl font-medium">
      数据源
    </p>

    <div>
      <div class="grid grid-cols-4 md:grid-cols-4 gap-4 mt-4">
        <!-- 等待中 -->
        <div
          class="bg-white rounded-lg border p-4 flex flex-col justify-between"
        >
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600">等待中</span>
            <div
              class="w-7 h-7 flex items-center justify-center text-blue-500 rounded-full"
            >
              <img src="/images/task_status_5.png" class="w-full" />
            </div>
          </div>
          <!-- 主数据 -->
          <div class="text-xl mt-2">{{ taskStatistics.WAITING }}</div>
        </div>

        <!-- 执行中 -->
        <div
          class="bg-white rounded-lg border p-4 flex flex-col justify-between"
        >
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600">执行中</span>
            <div
              class="w-7 h-7 flex items-center justify-center text-yellow-500 rounded-full"
            >
              <img src="/images/task_status_1.png" class="w-full" />
            </div>
          </div>
          <div class="text-xl mt-2">{{ taskStatistics.EXECUTING }}</div>
        </div>

        <!-- 执行结束（正常） -->
        <div
          class="bg-white rounded-lg border p-4 flex flex-col justify-between"
        >
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600">执行结束（正常）</span>
            <div
              class="w-7 h-7 flex items-center justify-center text-green-500 rounded-full"
            >
              <img src="/images/task_status_2.png" class="w-full" />
            </div>
          </div>
          <div class="text-xl mt-2">{{ taskStatistics.COMPLETED }}</div>
        </div>

        <!-- 执行结束（错误） -->
        <div
          class="bg-white rounded-lg border p-4 flex flex-col justify-between"
        >
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600">执行结束（错误）</span>
            <div
              class="w-7 h-7 flex items-center justify-center bg-purple-100 text-purple-500 rounded-full"
            >
              <img src="/images/task_status_3.png" class="w-full" />
            </div>
          </div>
          <div class="text-xl mt-2">{{ taskStatistics.ERROR }}</div>
        </div>
      </div>
    </div>

    <p class="text-gray-900 text-2xl font-medium mt-[16px]">
      格式转换
    </p>

    <div>
      <div class="grid grid-cols-5 md:grid-cols-5 gap-5 mt-4">
        <!-- 等待中 -->
        <div
          class="bg-white rounded-lg border p-4 flex flex-col justify-between"
        >
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600">等待中</span>
            <div
              class="w-7 h-7 flex items-center justify-center text-blue-500 rounded-full"
            >
              <img src="/images/task_status_5.png" class="w-full" />
            </div>
          </div>
          <div class="text-xl mt-2">{{ formatifyTaskStatistics.WAITING }}</div>
        </div>

        <!-- 执行中 -->
        <div
          class="bg-white rounded-lg border p-4 flex flex-col justify-between"
        >
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600">执行中</span>
            <div
              class="w-7 h-7 flex items-center justify-center text-yellow-500 rounded-full"
            >
              <img src="/images/task_status_1.png" class="w-full" />
            </div>
          </div>
          <div class="text-xl mt-2">{{ formatifyTaskStatistics.EXECUTING }}</div>
        </div>

        <!-- 已停止 -->
        <div
          class="bg-white rounded-lg border p-4 flex flex-col justify-between"
        >
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600">已停止</span>
            <div
              class="w-7 h-7 flex items-center justify-center text-yellow-500 rounded-full"
            >
              <img src="/images/task_status_4.png" class="w-full" />
            </div>
          </div>
          <div class="text-xl mt-2">{{ formatifyTaskStatistics.STOP }}</div>
        </div>

        <!-- 执行结束（正常） -->
        <div
          class="bg-white rounded-lg border p-4 flex flex-col justify-between"
        >
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600">执行结束（正常）</span>
            <div
              class="w-7 h-7 flex items-center justify-center text-green-500 rounded-full"
            >
              <img src="/images/task_status_2.png" class="w-full" />
            </div>
          </div>
          <div class="text-xl mt-2">{{ formatifyTaskStatistics.COMPLETED }}</div>
        </div>

        <!-- 执行结束（错误） -->
        <div
          class="bg-white rounded-lg border p-4 flex flex-col justify-between"
        >
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600">执行结束（错误）</span>
            <div
              class="w-7 h-7 flex items-center justify-center bg-purple-100 text-purple-500 rounded-full"
            >
              <img src="/images/task_status_3.png" class="w-full" />
            </div>
          </div>
          <div class="text-xl mt-2">{{ formatifyTaskStatistics.ERROR }}</div>
        </div>
      </div>
    </div>

    <p class="text-gray-900 text-2xl font-medium mt-[16px]">
      数据处理
    </p>

    <div>
      <div class="grid grid-cols-4 md:grid-cols-4 gap-4 mt-4">
        <!-- 等待中 -->
        <div
          class="bg-white rounded-lg border p-4 flex flex-col justify-between"
        >
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600">等待中</span>
            <div
              class="w-7 h-7 flex items-center justify-center text-blue-500 rounded-full"
            >
              <img src="/images/task_status_5.png" class="w-full" />
            </div>
          </div>
          <!-- 主数据 -->
          <div class="text-xl mt-2">{{ jobsTaskStatistics.QUEUED }}</div>
        </div>

        <!-- 执行中 -->
        <div
          class="bg-white rounded-lg border p-4 flex flex-col justify-between"
        >
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600">执行中</span>
            <div
              class="w-7 h-7 flex items-center justify-center text-yellow-500 rounded-full"
            >
              <img src="/images/task_status_1.png" class="w-full" />
            </div>
          </div>
          <div class="text-xl mt-2">{{ jobsTaskStatistics.PROCESSING }}</div>
        </div>

        <!-- 执行结束（正常） -->
        <div
          class="bg-white rounded-lg border p-4 flex flex-col justify-between"
        >
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600">执行结束（正常）</span>
            <div
              class="w-7 h-7 flex items-center justify-center text-green-500 rounded-full"
            >
              <img src="/images/task_status_2.png" class="w-full" />
            </div>
          </div>
          <div class="text-xl mt-2">{{ jobsTaskStatistics.FINISHED }}</div>
        </div>

        <!-- 执行结束（错误） -->
        <div
          class="bg-white rounded-lg border p-4 flex flex-col justify-between"
        >
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600">执行结束（错误）</span>
            <div
              class="w-7 h-7 flex items-center justify-center bg-purple-100 text-purple-500 rounded-full"
            >
              <img src="/images/task_status_3.png" class="w-full" />
            </div>
          </div>
          <div class="text-xl mt-2">{{ jobsTaskStatistics.FAILED }}</div>
        </div>
      </div>
    </div>

    <div class="mainOption mt-8">
      <div class="flex items-center justify-between gap-3 xs:block" v-if="false">
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
          Celery 节点服务列表
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
            prop="worker_name"
            :label="t('dataPipelines.nodeName')"
            min-width="320"
          />
          <el-table-column
            prop="current_ip"
            label="IP地址"
            min-width="180"
          />
          <el-table-column
            prop="task_count"
            label="当前任务数"
            min-width="160"
          />

          <el-table-column
            prop="status"
            label="节点状态"
            min-width="160"
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
            prop="ack_time"
            label="心跳时间"
            min-width="280"
          >
            <template #default="scope">
              <span>
                {{ formatTimestamp(scope.row.ack_time) }}
              </span>
            </template>
          </el-table-column>
          
          <!-- <el-table-column
            prop="token"
            :label="t('dataPipelines.operations')"
            min-width="120"
            fixed="right"
          >
            <template #default="scope">
              <div class="settingsTableBtn flex items-center justify-start">
                <el-button
                  class="flex items-center justify-start cursor-pointer"
                  type="text"
                  @click="
                    goToNewTask(
                      `/datapipelines/dataflowInfo?id=${scope.row.job_id}&type=${scope.row.job_source}`
                    )
                  "
                  >
                  {{ t("dataPipelines.details") }}
                </el-button>
              </div>
            </template>
          </el-table-column> -->
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
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import useFetchApi from "../../../packs/useFetchApi";
import { convertUtcToLocalTime } from "../../../packs/datetimeUtils";
import { useI18n } from "vue-i18n";

const { t, locale } = useI18n();
const tableLoading = ref(false);

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
    pagination.value.pageSize = size;
    pagination.value.currentPage = 1; // 切换每页大小时回到第一页
    getDataFlowListFun();
  },
  handleCurrentChange: (page) => {
    pagination.value.currentPage = page;
    getDataFlowListFun();
  }
});

const taskStatistics = ref({})
const getTaskStatistics = async () => {
  const url = `/dataflow/datasource/get_task_statistics`;
  const { data } = await useFetchApi(url).get().json();
  taskStatistics.value = data.value.data;
};

const formatifyTaskStatistics = ref({})
const getFormatifyTaskStatistics = async () => {
  const url = `/dataflow/formatify/get_task_statistics`;
  const { data } = await useFetchApi(url).get().json();
  formatifyTaskStatistics.value = data.value.data;
};

const jobsTaskStatistics = ref({})
const getJobsTaskStatistics = async () => {
  const url = `/dataflow/jobs/get_task_statistics`;
  const { data } = await useFetchApi(url).get().json();
  jobsTaskStatistics.value = data.value.data;
};

const getDataFlowListFun = async () => {
  const { currentPage, pageSize } = pagination.value;
  const url = `/dataflow/celery/get_celery_server_list?page=${currentPage}&page_size=${pageSize}`;
  tableLoading.value = true;

  const { data } = await useFetchApi(url).get().json();

  if (data.value) {
    tableData.value = data.value.data;
    pagination.value.total = data.value.total || 0;
  }
  tableLoading.value = false;
};

const handleSearch = () => {
  pagination.value.currentPage = 1;
  getDataFlowListFun();
};

const openExecuteDialog = async (job_id, status) => {
  if (status === 'Failed' || status === 'Timeout' || status === 'Finished') {
    console.log('执行', job_id)
    const url = `/dataflow/jobs/job/execute/${job_id}`;
    const { data } = await useFetchApi(url).post().json();
    if (data.value.code === 200) {
      ElMessage({
        message: '任务已执行',
        type: "success",
        plain: true,
        grouping: true,
      })
      getDataFlowListFun();
    } else {
      ElMessage({
        message: '任务执行失败',
        type: "error",
        plain: true,
        grouping: true,
      })
    }
  } else {
    if (status === 'Processing') {
      return ElMessage({
          message: `任务处理中，无法取消`,
          type: "warning",
          plain: true,
          grouping: true,
        });
    }
    const url = `/dataflow/jobs/stop_pipline_job?job_id=${job_id}`;
    const { data } = await useFetchApi(url).post().json();
    if (data.value.code === 200) {
      ElMessage({
        message: '任务已成功停止',
        type: "success",
        plain: true,
        grouping: true,
      })
      getDataFlowListFun();
    } else {
      ElMessage({
        message: '任务停止失败',
        type: "error",
        plain: true,
        grouping: true,
      })
    }
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

const formatTimestamp = (timestamp) => {
  // 检查时间戳是否为秒级
  const date = new Date(timestamp > 9999999999 ? timestamp : timestamp * 1000);

  // 格式化年、月、日、时、分、秒
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  // 返回格式化后的日期字符串
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

onMounted(() => {
  getTaskStatistics();
  getFormatifyTaskStatistics();
  getJobsTaskStatistics();
  getDataFlowListFun();
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

