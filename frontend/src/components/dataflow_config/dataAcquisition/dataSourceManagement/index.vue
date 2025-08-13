<template>
  <div class="text-left w-full h-full pl-8 py-8 overflow-auto bg-white">
    <div class="headerMenu flex items-center justify-start mb-[20px]">
      <SvgIcon class="w-5 h-5" name="dataflow_homeIcon" />
      <SvgIcon class="w-5 h-5 mx-2" name="dataflow_homeIcon_divider" />
      <p class="text-brand-700 text-sm font-medium">
        {{ t("dataPipelines.dataSourceManagement") }}
      </p>
    </div>
    <p class="text-gray-900 text-3xl font-medium data-source-title">
      {{ t("dataPipelines.dataSourceManagement") }}

      <CsgButton
        class="btn btn-primary btn-sm whitespace-nowrap"
        @click="goToNewTask('/datapipelines/newDataSource')"
        :name="t('dataPipelines.addDataSource')"
        svgName="plus"
      />
    </p>

    <el-card shadow="never" class="mt-8">
      <el-form label-position="top" :inline="true" :model="formInline">
        <el-form-item :label="t('dataPipelines.dataSourceType')">
          <el-select
            v-model="formInline.source_type"
            :placeholder="t('dataPipelines.dataSourceType')"
            clearable
            @change="valueChange"
          >
            <el-option
              v-for="item in dataList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('dataPipelines.searchDataSources')">
          <el-input
            v-model="formInline.name"
            prefix-icon="Search"
            :placeholder="t('dataPipelines.searchNameOrDescription')"
            clearable
            @change="valueChange"
          />
        </el-form-item>
      </el-form>
    </el-card>

    <div class="borderBox mt-8">
      <div class="flex flex-col">
        <el-table
          :data="tableData"
          class="rounded tableCont"
          header-cell-class-name="tableHeader"
          v-loading="tableLoading"
          :show-header="false"
        >
          <el-table-column prop="title" min-width="220">
            <template #default="scope">
              <div class="flex items-center">
                <!-- mqsql -->
                <div
                  v-if="scope.row.source_type === 1"
                  class="w-[36px] h-[36px] rounded-full flex justify-center items-center mr-[10px] bg-sky-100"
                >
                  <SvgIcon class="w-[20px] h-[20px]" name="Mysql_color" />
                </div>
                <!-- mongodb -->
                <div
                  v-if="scope.row.source_type === 2"
                  class="w-[36px] h-[36px] rounded-full flex justify-center items-center mr-[10px] bg-green-100"
                >
                  <SvgIcon class="w-[20px] h-[20px]" name="Mongodb_color" />
                </div>
                <!-- 文件 -->
                <div
                  v-if="scope.row.source_type === 3"
                  class="w-[36px] h-[36px] rounded-full flex justify-center items-center mr-[10px] bg-yellow-100"
                >
                  <SvgIcon class="w-[20px] h-[20px]" name="File_color" />
                </div>
                <!-- hive -->
                <div
                  v-if="scope.row.source_type === 4"
                  class="w-[36px] h-[36px] rounded-full flex justify-center items-center mr-[10px] bg-red-100"
                >
                  <SvgIcon class="w-[20px] h-[20px]" name="Hive_color" />
                </div>
                <div class="flex-1">
                  <div class="truncate">{{ `${scope.row.name}` }}</div>
                  <div
                    class="text-gray-500 text-sm font-light text-xs truncate"
                  >
                    {{ `${scope.row.des}` }}
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="server" min-width="280" align="right">
            <template #default="scope">
              <div class="text-gray-500 text-sm font-light text-xs text-right">
                {{ t("dataPipelines.server") }}
              </div>
              <div class="text-right truncate">
                <span v-if="scope.row.source_type !== 2">
                  {{ `${scope.row.host}:${scope.row.port}` }}
                </span>
                <span v-else>{{ `${scope.row.host}` }}</span>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="database" min-width="180" align="right">
            <template #default="scope">
              <div class="text-gray-500 text-sm font-light text-xs text-right">
                {{ t("dataPipelines.database") }}
              </div>
              <div class="text-right truncate">
                {{ `${scope.row.database || "-"}` }}
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="databaseType" min-width="180" align="right">
            <template #default="scope">
              <div class="text-gray-500 text-sm font-light text-xs text-right">
                {{ t("dataPipelines.dataSourceType") }}
              </div>
              <div class="text-right truncate">
                {{
                  `${
                    dataList.find((item) => item.id === scope.row.source_type)
                      ?.name || "-"
                  }`
                }}
              </div>
            </template>
          </el-table-column>

          <el-table-column
            prop="dataFlowDirection"
            min-width="150"
            align="right"
          >
            <template #default="scope">
              <div class="text-gray-500 text-sm font-light text-xs text-right">
                {{ t("dataPipelines.dataFlow") }}
              </div>
              <div class="text-right truncate">
                {{
                  `${
                    JSON.parse(scope.row.extra_config)?.csg_hub_dataset_name ||
                    "-"
                  }`
                }}
              </div>
            </template>
          </el-table-column>

          <!-- <el-table-column prop="state" min-width="120" align="right">
            <template #default="scope">
              <div class="text-gray-500 text-sm font-light text-xs">状态</div>
              <el-tag type="success">{{ `${scope.row.state || "-"}` }}</el-tag>
            </template>
          </el-table-column> -->

          <el-table-column
            prop="token"
            :label="t('dataPipelines.operations')"
            :min-width="`${cookies.get('locale') === 'en' ? 330 : 280}`"
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
                <!-- <el-popconfirm
                  :title="`${t('dataPipelines.executeConfirm')}?`"
                  :confirm-button-text="t('dataPipelines.confirm')"
                  :cancel-button-text="t('dataPipelines.cancel')"
                  width="220px"
                  @confirm="handleExecute(scope.row.id)"
                >
                  <template #reference>
                    <el-button
                      type="text"
                      class="flex items-center justify-start cursor-pointer"
                      >{{ t("dataPipelines.execute") }}
                    </el-button>
                  </template>
                </el-popconfirm> -->
                <el-button
                  type="text"
                  class="flex items-center justify-start cursor-pointer"
                  @click="openExecuteDialog(scope.row.id)"
                  >{{ t("dataPipelines.execute") }}
                </el-button>

                <el-button
                  class="flex items-center justify-start cursor-pointer"
                  type="text"
                  @click="viewTasks(scope.row.id)"
                  >{{ t("dataPipelines.task") }}
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
      :title="`${
        dataList.find((item) => item.id === dataSource.source_type)?.name || ''
      }${t('dataPipelines.dataSourceDetails')}`"
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

    <el-dialog
      v-model="centerDialogVisible"
      :title="t('dataPipelines.execute')"
      width="500"
      align-center
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
        v-model="task_run_time"
        value-format="YYYY-MM-DD HH:mm:ss"
        type="datetime"
        :placeholder="t('dataPipelines.PleaseSelectTime')"
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
            @click="handleExecute"
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
import useFetchApi from "../../../../packs/useFetchApi";
import { convertUtcToLocalTime } from "../../../../packs/datetimeUtils";
import { useI18n } from "vue-i18n";
import DataSourceInfo from "./components/DataSourceInfo.vue";
import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();
const router = useRouter();
const { t, locale } = useI18n();
// 搜索
const formInline = reactive({
  page: 1,
  pageSize: 10,
  name: "",
});
// 总数
const total = ref(0);
// 数据源类型列表
const dataList = ref([]);
// 详情数据
const dataSource = ref([]);
provide("dataSource", dataSource);
provide("dataList", dataList);
// 表格loading状态
const tableLoading = ref(false);
// 详情弹框
const dataSourceDetailsVisible = ref(false);
// 列表数据
const tableData = ref([]);
// 执行弹框
const centerDialogVisible = ref(false);
// 是否立即执行
const is_run = ref(true);
// 当前行数据的Id
const rowId = ref(null);
// 选择的运行时间
const task_run_time = ref(null);

onMounted(() => {
  getDataFlowListFun();
  getDataSourceTypeList();
});

/**
 * 搜索
 */
const valueChange = async () => {
  formInline.page = 1;
  getDataFlowListFun();
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
  const url = `/dataflow/datasource/datasource/list`;
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
    `/dataflow/datasource/datasource/info?datasource_id=${row.id}`
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
 * 查看任务
 * @param id 当前行数据的id
 */
const viewTasks = (id) => {
  router.push({ path: "/datapipelines/dataCollectionTask", query: { id } });
};

/**
 * 执行任务弹框
 * @param id 当前行数据的id
 */
const openExecuteDialog = async (id) => {
  rowId.value = id;
  centerDialogVisible.value = true;
  task_run_time.value = null;
  is_run.value = true;
};

/**
 * 执行任务
 * @param id 当前行数据的id
 */
const handleExecute = async (id) => {
  const url = `/dataflow/datasource/datasource/execute/${rowId.value}`;

  let params = {};

  if (!is_run.value) {
    if (!task_run_time)
      return ElMessage.error(
        `${t("dataPipelines.pleaseSelectAnExecutionTime")}...`
      );
    params = {
      task_run_time: task_run_time.value,
    };
  }
  const options = {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  };
  const loading = ElLoading.service({
    lock: true,
    text: `${t("dataPipelines.inProgress")}...`,
    background: "rgba(0, 0, 0, 0.7)",
  });
  const { data, error } = await useFetchApi(url, options).post().json();
  loading.close();
  if (data.value.code === 200) {
    ElMessage.success(data.value.data);
    centerDialogVisible.value = false;
    getDataFlowListFun();
  } else {
    ElMessage.error(data.value.msg);
  }
};

/**
 * 删除数据
 * @param id 当前行数据的id
 */
const handleDelete = async (id) => {
  const url = `/dataflow/datasource/datasource/remove/${id}`;
  const { data, error } = await useFetchApi(url).delete().json();
  const loading = ElLoading.service({
    lock: true,
    text: `${t("dataPipelines.deletingTask")}...`,
    background: "rgba(0, 0, 0, 0.7)",
  });
  loading.close();
  if (data.value.code === 200) {
    ElMessage.success(t("dataPipelines.operationSuccessful"));
    getDataFlowListFun();
  } else {
    ElMessage.error(data.value.msg);
  }
};

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
