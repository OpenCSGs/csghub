<template>
  <div class="data-source-card" v-if="dataSource">
    <!-- 基本信息与连接信息布局 -->
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <div class="mb-[15px]">
          <div class="text-gray-400 text-xs mb-1 mt-1">
            {{ t("dataPipelines.taskName") }} ：
          </div>
          <div>{{ dataSource.name }}</div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <div class="mb-[15px]">
          <div class="text-gray-400 text-xs mb-1 mt-1">
            {{ t("dataPipelines.sourceFormat") }}：
          </div>
          <div>
            {{
              formatVal.find((item) => item.value === dataSource.from_data_type)
                ?.label || "-"
            }}
          </div>
        </div>
      </el-col>

      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <div class="mb-[15px]">
          <div class="text-gray-400 text-xs mb-1 mt-1">
            {{ t("dataPipelines.targetFormat") }}：
          </div>
          <div>
            {{
              formatVal.find((item) => item.value === dataSource.to_data_type)
                ?.label || "-"
            }}
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <div class="mb-[15px]">
          <div class="text-gray-400 text-xs mb-1 mt-1">
            {{ t("dataPipelines.processingStatus") }}：
          </div>
          <div>
            {{
              taskStatusVal.find(
                (item) => item.value === dataSource.task_status
              )?.label || "-"
            }}
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <div class="mb-[15px]">
          <div class="text-gray-400 text-xs mb-1 mt-1">
            {{ t("dataPipelines.dataSource") }}：
          </div>
          <div>
            {{ dataSource.from_csg_hub_dataset_name }}{{ dataSource.from_csg_hub_dataset_branch ? ' > ' + dataSource.from_csg_hub_dataset_branch : '' }}
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <div class="mb-[15px]">
          <div class="text-gray-400 text-xs mb-1 mt-1">
            {{ t("dataPipelines.dataFlow") }}：
          </div>
          <div>
            {{ dataSource.to_csg_hub_dataset_name }}{{ dataSource.to_csg_hub_dataset_default_branch ? ' > ' + dataSource.to_csg_hub_dataset_default_branch : '' }}
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <div class="mb-[15px]">
          <div class="text-gray-400 text-xs mb-1 mt-1">
            {{ t("dataPipelines.region") }}：
          </div>
          <div>{{ displayRegion }}</div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <div class="mb-[15px]">
          <div class="text-gray-400 text-xs mb-1 mt-1">
            {{ t("dataPipelines.spaceCloudResources") }}：
          </div>
          <div class="break-words">{{ displaySpaceResource }}</div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <div class="info-group">
          <div class="mb-[15px]">
            <div class="text-gray-400 text-xs mb-1 mt-1">
              {{ t("dataPipelines.createTime") }}：
            </div>
            <div>
              {{ dataSource.created_at ? convertUtcToLocalTime(dataSource.created_at) : "-" }}
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    
    <div v-if="dataSource.progress">
      <div class="text-gray-400 text-xs mb-2">
        {{ t("dataPipelines.progress") }}：
      </div>
      <div class="progress-section">
        <div class="progress-content">
          <div class="progress-bar-wrapper">
            <el-progress
              :percentage="dataSource.progress.progress || 0"
              :stroke-width="8"
            />
          </div>
          <div class="progress-stats">
            <div class="stat-item">
              <span class="stat-label">{{ t("dataPipelines.total") }}：</span>
              <span class="stat-value">{{ dataSource.progress.total || 0 }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">{{ t("dataPipelines.success") }}：</span>
              <span class="stat-value success">{{ dataSource.progress.success || 0 }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">{{ t("dataPipelines.failure") }}：</span>
              <span class="stat-value failure">{{ dataSource.progress.failure || 0 }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 描述信息 -->
    <div class="description">
      <div class="text-gray-400 text-xs mb-2">
        {{ t("dataPipelines.description") }}：
      </div>
      <p>{{ dataSource.des || "-" }}</p>
    </div>
  </div>
  <div v-else class="loading-container">
    <el-skeleton animated />
  </div>
</template>

<script setup>
import { computed, inject, onMounted, ref } from "vue";
import useFetchApi from "@/packs/useFetchApi";
import { convertUtcToLocalTime } from "@/packs/datetimeUtils";
import { useI18n } from "vue-i18n";
const { t, locale } = useI18n();
// 数据源数据
const dataSource = inject("dataSource");
const dataList = inject("dataList");
const taskStatusVal = inject("taskStatusVal");
const formatVal = inject("formatVal");

const displayRegion = computed(() => {
  const d = dataSource?.value;
  if (!d || typeof d !== "object" || Array.isArray(d)) return "-";
  const info = d.datasourceInfo || d;
  const v =
    info.cluster_name ??
    d.region ??
    d.region_name ??
    d.cluster_region ??
    d.cluster_name ??
    d.cluster_label;
  return v != null && String(v).trim() !== "" ? String(v) : "-";
});

const displaySpaceResource = computed(() => {
  const d = dataSource?.value;
  if (!d || typeof d !== "object" || Array.isArray(d)) return "-";
  const info = d.datasourceInfo || d;
  const v =
    info.resource_name ??
    d.space_resource_name ??
    d.space_resource_label ??
    d.space_resources_summary ??
    d.space_resource_desc ??
    d.space_resources ??
    d.space_resource_spec;
  if (v != null && String(v).trim() !== "") return String(v);
  const rid = info.resource_id ?? d.space_resource_id;
  if (rid != null && String(rid).trim() !== "") return String(rid);
  return "-";
});
// 加载状态
const loading = ref(true);
// 连接状态
const testLinkStatus = ref(false);
onMounted(() => {
  console.log(dataSource.value, "------------------------------");
});
</script>

<style scoped>
.data-source-card {
  /* width: 600px; */
  display: block;
}

.info-group h3 {
  margin-bottom: 10px;
  font-size: 16px;
  color: #333;
}
.description {
  margin-bottom: 20px;
}
.description h3 {
  margin-bottom: 10px;
  font-size: 16px;
  color: #333;
}
.progress-section {
  margin: 10px 0 20px 0;
  padding: 16px;
  background-color: #f9f9f9;
  border-radius: 8px;
}
.progress-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.progress-bar-wrapper {
  width: 100%;
}
.progress-stats {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}
.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
}
.stat-label {
  font-size: 14px;
  color: #666;
}
.stat-value {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}
.stat-value.success {
  color: #67c23a;
}
.stat-value.failure {
  color: #f56c6c;
}
.usage-record h3 {
  margin-bottom: 10px;
  font-size: 16px;
  color: #333;
}
.loading-container {
  width: 600px;
  margin: 20px auto;
}
</style>
