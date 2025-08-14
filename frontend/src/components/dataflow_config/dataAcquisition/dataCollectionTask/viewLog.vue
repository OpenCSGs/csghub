<template>
  <div class="text-left w-full h-full pl-8 py-8 overflow-auto bg-white">
    <div class="headerMenu flex items-center justify-start mb-[20px]">
      <SvgIcon class="w-5 h-5" name="dataflow_homeIcon" />
      <SvgIcon class="w-5 h-5 mx-2" name="dataflow_homeIcon_divider" />
      <p class="text-sm font-medium cursor-pointer" @click="navigateToPage">
        {{
          route.query.type === "datasource"
            ? t("dataPipelines.dataCollectionTask")
            : t("dataPipelines.dataFormatConversion")
        }}
      </p>
      <SvgIcon class="w-5 h-5 mx-2" name="dataflow_homeIcon_divider" />
      <p class="text-brand-700 text-sm font-medium">
        {{ t("dataPipelines.taskLog") }}
      </p>
    </div>
    <div class="flex items-center justify-start gap-1">
      <SvgIcon
        class="w-6 h-6 cursor-pointer"
        name="dataflow_backIcon"
        @click="navigateToPage"
      />
      <p class="text-gray-900 text-3xl font-medium">
        {{ t("dataPipelines.taskLog") }}
      </p>
    </div>
    <div class="resultBox mt-[20px]">
      <!-- <pre class="text-gray-50 text-base font-normal"
        >{{ logData.join("\n") }}
          </pre
      > -->
      <div class="log-container">
        <div v-for="(line, index) in logData" :key="index" class="log-line">
          {{ line }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";
import { ref, onMounted, computed } from "vue";
import useFetchApi from "@/packs/useFetchApi";
import { useI18n } from "vue-i18n";
const router = useRouter();
const route = useRoute();

const logData = ref([]);

const { t, locale } = useI18n();

/**
 * 跳转
 */
const navigateToPage = () => {
  router.back();
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
};

const getLogData = async () => {
  let url = `/dataflow/task_log/list?task_uid=${route.query.task_uid}&type=${route.query.type}&page=1&page_size=1000000`;
  const { data } = await useFetchApi(url).get().json();
  if (data.value) {
    logData.value = data.value.data.data.map((item) => {
      return `${formatTimestamp(item.create_at)} | ${item.level} | ${
        item.content
      }`;
    });
  }
};

onMounted(() => {
  getLogData();
});
</script>
<style lang="less" scoped>
.resultBox {
  border-radius: 12px;
  background: #0c111d;
  padding: 24px;
  height: 700px;
  overflow: auto; // 改为同时处理水平和垂直滚动
  color: #f9fafb;

  font-family: "Roboto Mono";
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
}

.log-container {
  display: flex;
  flex-direction: column;
}

.log-line {
  white-space: nowrap; // 禁止文本换行
  // overflow: hidden; // 隐藏溢出内容
  // text-overflow: ellipsis; // 溢出时显示省略号
  min-height: 24px; // 确保每行有足够高度
}
</style>
