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
        </div></el-col
      >
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <div class="mb-[15px]">
          <div class="text-gray-400 text-xs mb-1 mt-1">
            {{ t("dataPipelines.dataFlow") }}：
          </div>
          <div>
            {{ dataSource.to_csg_hub_dataset_name || "-" }}
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <div class="info-group">
          <div class="mb-[15px]">
            <div class="text-gray-400 text-xs mb-1 mt-1">
              {{ t("dataPipelines.createTime") }}：
            </div>
            <div>
              {{ dataSource.created_at || "-" }}
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <!-- 描述信息 -->
    <div class="description">
      <h3>{{ t("dataPipelines.description") }}</h3>
      <p>{{ dataSource.des || "-" }}</p>
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
const taskStatusVal = inject("taskStatusVal");
const formatVal = inject("formatVal");
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
