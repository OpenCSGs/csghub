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
              <!--                 @click="toDatasetPage(scope.row.repo_id, scope.row.branch)" -->
              <span>{{
                `${scope.row.repo_id || "-"}>${scope.row.branch || "-"}`
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="data_target"
            :label="t('dataPipelines.dataFlow')"
            min-width="200"
          >
            <template #default="scope">
              <!--                 @click="
                  toDatasetPage(
                    scope.row.export_repo_id,
                    scope.row.export_branch_name
                  )
                " -->
              <span>
                {{ scope.row.repo_id }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="date_posted"
            :label="t('dataPipelines.startTime')"
            min-width="260"
          >
            <template #default="scope">
              <span>{{ scope.row.date_posted }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="token"
            :label="t('dataPipelines.operations')"
            min-width="260"
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
                  >{{
                    scope.row.job_source == "pipeline"
                      ? t("dataPipelines.details")
                      : t("dataPipelines.log")
                  }}
                </el-button>

                <el-popconfirm
                  :title="
                    scope.row.status === 'Failed' ||
                    scope.row.status === 'Timeout' ||
                    scope.row.status === 'Finished' ? `${t('dataPipelines.executeConfirm')}?` : `${t('dataPipelines.cancelExecute')}?`
                    "
                  :confirm-button-text="t('dataPipelines.confirm')"
                  :cancel-button-text="t('dataPipelines.cancel')"
                  width="220px"
                  @confirm="openExecuteDialog(scope.row.job_id, scope.row.status)"
                >
                  <template #reference>
                    <el-button
                      type="text"
                      class="flex items-center justify-start cursor-pointer"
                    >
                      {{
                        scope.row.status === 'Failed' ||
                        scope.row.status === 'Timeout' ||
                        scope.row.status === 'Finished' ? t("dataPipelines.execute") : t("dataPipelines.cancel")
                      }}
                    </el-button>
                  </template>
                </el-popconfirm>

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
        message: t("dataPipelines.taskExecuted"),
        type: "success",
        plain: true,
        grouping: true,
      })
      getDataFlowListFun();
    } else {
      ElMessage({
        message: t("dataPipelines.taskExecutionFailed"),
        type: "error",
        plain: true,
        grouping: true,
      })
    }
  } else {
    if (status === 'Processing') {
      return ElMessage({
          message: t("dataPipelines.cannotCancel"),
          type: "warning",
          plain: true,
          grouping: true,
        });
    }
    const url = `/dataflow/jobs/stop_pipline_job?job_id=${job_id}`;
    const { data } = await useFetchApi(url).post().json();
    if (data.value.code === 200) {
      ElMessage({
        message: t("dataPipelines.taskSuccessStop"),
        type: "success",
        plain: true,
        grouping: true,
      })
      getDataFlowListFun();
    } else {
      ElMessage({
        message: t("dataPipelines.taskStopFailed"),
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

onMounted(() => {
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
