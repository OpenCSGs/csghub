<template>
  <div class="text-left w-full h-full pl-8 py-8 overflow-auto bg-white">
    <div class="headerMenu flex items-center justify-start mb-[20px]">
      <SvgIcon class="w-5 h-5" name="dataflow_homeIcon" />
      <SvgIcon class="w-5 h-5 mx-2" name="dataflow_homeIcon_divider" />
      <p class="text-brand-700 text-sm font-medium">
        {{ t("dataPipelines.formatConversion") }}
      </p>
    </div>
    <p class="text-gray-900 text-3xl font-medium data-source-title">
      {{ t("dataPipelines.formatConversion") }}

      <CsgButton
        class="btn btn-primary btn-sm whitespace-nowrap"
        @click="goToNewTask('/datapipelines/newFormatConversion')"
        :name="t('dataPipelines.createTask')"
        svgName="plus"
      />
    </p>

    <div class="mainOption mt-8">
      <p class="text-gray-700 text-sm mb-1.5">
        {{ t("dataPipelines.searchProcessing") }}
      </p>
      <div class="flex items-center justify-between gap-3 xs:block">
        <el-input
          style="width: 100%"
          v-model="formInline.name"
          :placeholder="t('dataPipelines.searchTaskName')"
          @change="valueChange"
          clearable
          ><template #prefix>
            <el-icon class="el-input__icon w-5 h-5"><search /></el-icon>
          </template>
        </el-input>
      </div>
    </div>

    <div class="borderBox mt-8">
      <div class="flex flex-col">
        <el-table
          :data="tableData"
          class="rounded tableCont"
          header-cell-class-name="tableHeader"
          v-loading="tableLoading"
          :show-header="true"
        >
          <el-table-column
            prop="name"
            align="center"
            :label="t('dataPipelines.taskName')"
            width="180"
          />
          <el-table-column
            prop="from_data_type"
            align="center"
            :label="t('dataPipelines.sourceFormat')"
            width="180"
          >
            <template #default="scope">
              <div>
                {{
                  formatVal.find(
                    (item) => item.value === scope.row.from_data_type
                  )?.label
                }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="to_data_type"
            align="center"
            :label="t('dataPipelines.targetFormat')"
            width="180"
          >
            <template #default="scope">
              <div>
                {{
                  formatVal.find(
                    (item) => item.value === scope.row.to_data_type
                  )?.label
                }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="task_status"
            align="center"
            :label="t('dataPipelines.processingStatus')"
            width="180"
          >
            <template #default="scope">
              <div>
                <el-tag
                  :type="
                    taskStatusVal.find(
                      (item) => item.value === scope.row.task_status
                    )?.type
                  "
                >
                  {{
                    taskStatusVal.find(
                      (item) => item.value === scope.row.task_status
                    )?.label
                  }}
                </el-tag>
              </div>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="jd" label="进度" width="180" /> -->
          <el-table-column
            prop="to_csg_hub_dataset_name"
            align="center"
            :label="t('dataPipelines.dataFlow')"
            width="180"
          />
          <el-table-column
            prop="created_at"
            align="center"
            :label="t('dataPipelines.createTime')"
            width="260"
          />

          <el-table-column
            :label="t('dataPipelines.operations')"
            :min-width="`${cookies.get('locale') === 'en' ? 330 : 270}`"
            align="center"
            fixed="right"
          >
            <template #default="scope">
              <div class="settingsTableBtn flex items-center justify-start">
                <el-button
                  class="flex items-center justify-start cursor-pointer"
                  type="text"
                  @click="getDetail(scope.row)"
                  >{{ t("dataPipelines.details") }}
                </el-button>
                <el-button
                  v-if="scope.row.task_status !== 0 || scope.row.task_status !== 1"
                  disabled
                  type="text"
                  class="flex items-center justify-start cursor-pointer"
                  >{{ t("dataPipelines.terminate") }}
                </el-button>
                <el-popconfirm
                  v-else
                  :title="`${t('dataPipelines.confirmTermination')}?`"
                  :confirm-button-text="t('dataPipelines.confirm')"
                  :cancel-button-text="t('dataPipelines.cancel')"
                  width="220px"
                  @confirm="handleTerminate(scope.row.id)"
                >
                  <template #reference>
                    <el-button
                      type="text"
                      class="flex items-center justify-start cursor-pointer"
                      >{{ t("dataPipelines.terminate") }}
                    </el-button>
                  </template>
                </el-popconfirm>
                <el-button
                  type="text"
                  class="flex items-center justify-start cursor-pointer"
                  @click="getLog(scope.row.task_uid)"
                  >{{ t("dataPipelines.log") }}
                </el-button>
                <el-popconfirm
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
              </div>
            </template>
          </el-table-column>

          <template #empty>
            <el-empty :description="t('dataPipelines.noData')" />
          </template>
        </el-table>

        <!-- <el-pagination
          v-model:current-page="formInline.page"
          :page-size="formInline.pageSize"
          layout="prev, pager, next"
          :total="total"
          @current-change="currentChange"
          class="flex justify-end mt-[10px] mb-[5px]"
        /> -->
        <div class="flex justify-end mt-4 mr-4 mb-4">
          <el-pagination
            :page-size="formInline.pageSize"
            :current-page="formInline.page"
            :total="total"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="currentChange"
          />
        </div>
      </div>
    </div>

    <el-dialog
      v-model="dataSourceDetailsVisible"
      :title="t('dataPipelines.details')"
      width="800"
      align-center
    >
      <DataSourceInfo />
      <template #footer>
        <div class="dialog-footer">
          <CsgButton
            class="btn btn-secondary-gray btn-md whitespace-nowrap"
            @click="dataSourceDetailsVisible = false"
            :name="t('dataPipelines.close')"
          />
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ref, reactive, onMounted, provide } from "vue";
import { ElMessage, ElLoading } from "element-plus";
import useFetchApi from "@/packs/useFetchApi";
import { useI18n } from "vue-i18n";
import DataSourceInfo from "./components/dataSourceInfo.vue";
const router = useRouter();
const { t, locale } = useI18n();
import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();
// 搜索
const formInline = reactive({
  page: 1,
  pageSize: 10,
  name: "",
});
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
const formatVal = ref([
  {
    value: 0,
    label: "PPT",
  },
  {
    value: 1,
    label: "Word",
  },
  {
    value: 2,
    label: "Markdown",
  },
  {
    value: 3,
    label: "Excel",
  },
  {
    value: 4,
    label: "Json",
  },
  {
    value: 5,
    label: "Csv",
  },
  {
    value: 6,
    label: "Parquet",
  },
]);
// 总数
const total = ref(0);
// 数据源类型列表
const dataList = ref([]);
// 详情数据
const dataSource = ref([]);
provide("dataSource", dataSource);
provide("dataList", dataList);
provide("taskStatusVal", taskStatusVal);
provide("formatVal", formatVal);
// 表格loading状态
const tableLoading = ref(false);
// 详情弹框
const dataSourceDetailsVisible = ref(false);
// 列表数据
const tableData = ref([]);

onMounted(() => {
  getDataFlowListFun();
  getFormatTypeList();
});

/**
 * 搜索
 */
const valueChange = async () => {
  formInline.page = 1;
  getDataFlowListFun();
};

/**
 * 获取数据格式类型列表
 */
const getFormatTypeList = async () => {
  let url = "/dataflow/formatify/formatify/get_format_type_list";
  const { data } = await useFetchApi(url).get().json();
  if (data.value?.code === 200) {
    dataList.value = data.value.data;
  }
};

/**
 * 页码改变时触发
 */
const currentChange = async (val) => {
  console.log(val,'valvalvalvalval');
  formInline.page = val;
  getDataFlowListFun();
};
/**
 * 页码改变时触发
 */
const handleSizeChange = async (size) => {
  formInline.pageSize = size;
  formInline.page = 1;
  getDataFlowListFun();
};

/**
 * 列表
 */
const getDataFlowListFun = async () => {
  const params = new URLSearchParams();
  Object.entries(formInline).forEach(([key, value]) => {
    if (value !== "" && value !== null && value !== undefined) {
      params.append(key, value);
    }
  });
  const url = `/dataflow/formatify/formatify/list`;
  const queryString = params.toString();
  const fullUrl = queryString ? `${url}?${queryString}` : url;
  tableLoading.value = true;
  const { data } = await useFetchApi(fullUrl).get().json();
  console.log("data=", data.value);
  if (data.value.code === 200) {
    tableData.value = data.value.data.list;
    total.value = data.value.data.total;
    console.log(tableData.value, "------------------------------");
  }
  tableLoading.value = false;
};

/**
 * 查看详情
 * @param row 当前行数据
 */
const getDetail = async (row) => {
  const loading = ElLoading.service({
    lock: true,
    text: `${t("dataPipelines.loading")}...`,
    background: "rgba(0, 0, 0, 0.7)",
  });
  const { data } = await useFetchApi(
    `/dataflow/formatify/formatify/get/${row.id}`
  )
    .get()
    .json();
  loading.close();
  if (data.value.code === 200) {
    dataSource.value = data.value.data;
    dataSourceDetailsVisible.value = true;
  } else {
    ElMessage.error(data.value.msg);
  }
};

/**
 * 导出任务
 * @param id 当前行数据的id
 */

// const handleExports = async (id) => {
//   console.log(id, "---------");
// };

/**
 * 终止任务
 * @param id 当前行数据的id
 */
const handleTerminate = async (id) => {
  const url = `/dataflow/formatify/formatify/stop/${id}`;
  const loading = ElLoading.service({
    lock: true,
    text: `${t("dataPipelines.terminatingTask")}...`,
    background: "rgba(0, 0, 0, 0.7)",
  });
  const { data, error } = await useFetchApi(url).post().json();
  loading.close();
  if (data.value.code === 200) {
    ElMessage.success(t("dataPipelines.operationSuccessful"));
    getDataFlowListFun();
  } else {
    ElMessage.error(data.value.msg);
  }
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
      type: "formatity",
    },
  });
  // let url = `/dataflow/task_log/list?task_uid=${task_uid}&type=datasource`;
  // const { data } = await useFetchApi(url).get().json();
  // console.log("日志：", data);
};

/**
 * 删除任务
 * @param id 当前行数据的id
 */
const handleDelete = async (id) => {
  const url = `/dataflow/formatify/formatify/delete/${id}`;
  const loading = ElLoading.service({
    lock: true,
    text: `${t("dataPipelines.deletingTask")}...`,
    background: "rgba(0, 0, 0, 0.7)",
  });
  const { data, error } = await useFetchApi(url).delete().json();
  loading.close();
  if (data.value.code === 200) {
    ElMessage.success(t("dataPipelines.operationSuccessful"));
    getDataFlowListFun();
  } else {
    ElMessage.error(data.value.msg);
  }
};

/**
 * 创建任务
 * @param path 路径
 */
const goToNewTask = (path) => {
  router.push(path);
};
</script>
<style lang="less" scoped>
.data-source-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
:deep(.el-form--inline.el-form--label-top .el-form-item) {
  width: calc(33.33% - 12px);
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
</style>
