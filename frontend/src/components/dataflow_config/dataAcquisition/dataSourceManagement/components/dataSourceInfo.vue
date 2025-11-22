<template>
  <div class="data-source-card" v-if="dataSource">
    <!-- 基本信息与连接信息布局 -->
    <el-row :gutter="20">
      <!-- 基本信息列 -->
      <el-col :span="12">
        <div class="info-group">
          <h3>{{ t("dataPipelines.basicInformation") }}</h3>
          <div class="info-item">
            <div class="text-gray-400 text-xs mb-1 mt-1">
              {{ t("dataPipelines.dataSourceName") }}：
            </div>
            <div>{{ dataSource.datasourceInfo?.database }}</div>
          </div>
          <div class="info-item">
            <div class="text-gray-400 text-xs mb-1 mt-1">
              {{ t("dataPipelines.dataSourceType") }}：
            </div>
            <div>
              {{
                dataList.find(
                  (item) => item.id === dataSource.datasourceInfo?.source_type
                ).name || "-"
              }}
            </div>
          </div>
          <div class="info-item">
            <div class="text-gray-400 text-xs mb-1 mt-1">
              {{ t("dataPipelines.dataFlow") }}：
            </div>
            <div>{{ getDataFlow(dataSource.datasourceInfo?.extra_config) }}</div>
          </div>

          <div class="info-item">
            <div class="text-gray-400 text-xs mb-1 mt-1">
              {{ t("dataPipelines.createTime") }}：
            </div>
            <div>{{ dataSource.datasourceInfo?.created_at }}</div>
          </div>
          <div class="info-item">
            <div class="text-gray-400 text-xs mb-1 mt-1">
              {{ t("dataPipelines.lastUpdate") }}：
            </div>
            <div>{{ dataSource.datasourceInfo?.updated_at }}</div>
          </div>
        </div>
      </el-col>
      <!-- 连接信息列 -->
      <el-col :span="12">
        <div class="info-group">
          <h3>{{ t("dataPipelines.connectionInformation") }}</h3>
          <div class="info-item">
            <div class="text-gray-400 text-xs mb-1 mt-1">
              {{ t("dataPipelines.ServerAddress") }}：
            </div>
            <div v-if="dataSource.datasourceInfo.source_type !== 2">
              {{
                `${dataSource.datasourceInfo?.host}:${dataSource.datasourceInfo?.port}`
              }}
            </div>
            <div v-else>{{ `${dataSource.datasourceInfo?.host}` }}</div>
          </div>
          <div class="info-item">
            <div class="text-gray-400 text-xs mb-1 mt-1">
              {{ t("dataPipelines.DatabaseName") }}：
            </div>
            <div>{{ dataSource.datasourceInfo?.database }}</div>
          </div>
          <div class="info-item">
            <div class="text-gray-400 text-xs mb-1 mt-1">
              {{ t("dataPipelines.username") }}：
            </div>
            <div>{{ dataSource.datasourceInfo?.username || "-" }}</div>
          </div>
          <div class="info-item">
            <div class="text-gray-400 text-xs mb-1 mt-1">
              {{ t("dataPipelines.connectionStatus") }}：
            </div>
            <el-tag :type="testLinkStatus === true ? 'success' : 'danger'">
              {{
                testLinkStatus === true
                  ? t("dataPipelines.normal")
                  : t("dataPipelines.anomaly")
              }}
            </el-tag>
          </div>
        </div>
      </el-col>
    </el-row>
    <!-- 描述信息 -->
    <div class="description">
      <h3>{{ t("dataPipelines.description") }}</h3>
      <p>{{ dataSource.datasourceInfo.des }}</p>
    </div>
    <!-- 使用记录 -->
    <div class="usage-record">
      <h3>{{ t("dataPipelines.useRecord") }}</h3>
      <div style="padding: 20px; background-color: #f7f9fa; border-radius: 6px">
        <div class="record-item">
          <span>{{ t("dataPipelines.dataImportTask") }}：</span>
          <span
            >{{ dataSource.task_total || 0 }}
            {{ t("dataPipelines.persons") }}</span
          >
        </div>
        <div class="record-item" v-if="dataSource?.last_task">
          <span>{{ t("dataPipelines.recentlyUsed") }}：</span>
          <span>{{ dataSource.last_task?.start_run_at || "-" }}</span>
        </div>
        <div class="record-item" v-if="dataSource?.last_task">
          <span>{{ t("dataPipelines.dataVolume") }}：</span>
          <span
            >{{ dataSource.last_task?.records_count }} /
            {{ dataSource.last_task?.total_count }}
            {{ t("dataPipelines.total") }}</span
          >
        </div>
      </div>
    </div>
  </div>
  <div v-else class="loading-container">
    <el-skeleton animated />
  </div>
</template>

<script setup>
import { ref, onMounted, defineProps, inject } from "vue";
import useFetchApi from "@/packs/useFetchApi";
import { useI18n } from "vue-i18n";
const { t, locale } = useI18n();
// 数据源数据
const dataSource = inject("dataSource");
const dataList = inject("dataList");
// 加载状态
const loading = ref(true);
// 连接状态
const testLinkStatus = ref(false);
onMounted(() => {
  testLink();
});

const getDataFlow = (extra_config = '{}') => {
  const dataFlow = JSON.parse(extra_config);
  return `${dataFlow.csg_hub_dataset_id || ''}${dataFlow.csg_hub_dataset_branch ? ` > ${dataFlow.csg_hub_dataset_branch}` : ''}`;
}

/**
 * 测试链接接口
 */
const testLink = async () => {
  const params = {
    ...dataSource.value.datasourceInfo,
    extra_config:
      JSON.parse(dataSource.value.datasourceInfo.extra_config) || {},
  };
  const options = {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  };
  loading.value = true;
  const newEndpoint = "/dataflow/datasource/datasource/test-connection";
  const { data, error } = await useFetchApi(newEndpoint, options).post().json();
  if (data.value.code === 200) {
    testLinkStatus.value = true;
  } else {
    testLinkStatus.value = false;
  }

  loading.value = false;
};
</script>

<style scoped>
.data-source-card {
  /* width: 600px; */
}
.info-group {
  margin-bottom: 20px;
}
.info-group h3 {
  margin-bottom: 10px;
  font-size: 16px;
  color: #333;
}
.info-item {
  margin-bottom: 15px;
}
.label {
  display: inline-block;
  width: 80px;
  text-align: right;
  margin-right: 10px;
  color: #666;
}
.description {
  margin-bottom: 20px;
}
.description h3 {
  margin-bottom: 10px;
  font-size: 16px;
  color: #333;
}
.usage-record h3 {
  margin-bottom: 10px;
  font-size: 16px;
  color: #333;
}
.record-item {
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
}
.loading-container {
  width: 600px;
  margin: 20px auto;
}
</style>
