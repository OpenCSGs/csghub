<template>
  <div class="text-left w-full h-full pl-8 py-8 overflow-hidden bg-white">
    <div class="headerMenu flex items-center justify-start mb-[20px]">
      <SvgIcon class="w-5 h-5" name="dataflow_homeIcon" />
      <SvgIcon class="w-5 h-5 mx-2" name="dataflow_homeIcon_divider" />
      <p class="text-sm font-medium cursor-pointer" @click="navigateToPage">
        {{
          route.query.type === "datasource"
            ? t("dataPipelines.dataCollectionTask")
            : route.query.type === "formatity"
              ? t("dataPipelines.dataFormatConversion")
              : t("dataPipelines.dataProcessing")
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
    <pre ref="logBoxRef" class="resultBox log-scroll-box mt-[20px]">{{ logText }}</pre>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";
import { ref, computed, watch, inject, nextTick, onBeforeUnmount } from "vue";
import { useCookies } from "vue3-cookies";
import { ElMessage } from "element-plus";
import refreshJWT from "@/packs/refreshJWT";
import {
  buildCsghubDataflowLogsUrl,
  normalizePayloadLineBreaks,
  streamCsghubDataflowLogs,
  describeCsghubLogParamsGap,
} from "@/packs/csghubDataflowLogs";
import { useI18n } from "vue-i18n";

const router = useRouter();
const route = useRoute();
const csghubServer = inject("csghubServer");
const { cookies } = useCookies();
const { t } = useI18n();

const logData = ref([]);
const logText = computed(() =>
  normalizePayloadLineBreaks(logData.value.join("\n"))
);
const logBoxRef = ref(null);
let logAbortController = null;

const pickQuery = (key) => {
  const value = route.query[key];
  return Array.isArray(value) ? value[0] : value;
};

const navigateToPage = () => {
  router.back();
};

const abortLogStream = () => {
  if (logAbortController) {
    logAbortController.abort();
    logAbortController = null;
  }
};

const scrollLogToTop = () => {
  nextTick(() => {
    const el = logBoxRef.value;
    if (el) {
      el.scrollTop = 0;
    }
  });
};

const CSGHUB_DIRECT_LOG_TYPES = new Set(["datasource", "formatity", "job"]);

const fetchCsghubLogs = async ({ namespaceUuid, jobId, dagTaskId }) => {
  await refreshJWT();
  const jwtToken = cookies.get("user_token");
  const url = buildCsghubDataflowLogsUrl(csghubServer, {
    namespaceUuid,
    jobId,
    dagTaskId,
    stream: true,
  });
  console.info("[CSGHub logs stream]", url);

  logAbortController = new AbortController();
  await streamCsghubDataflowLogs(url, {
    authorization: jwtToken ? `Bearer ${jwtToken}` : undefined,
    userToken: jwtToken,
    signal: logAbortController.signal,
    onLine: (line, { append = false } = {}) => {
      if (append && logData.value.length > 0) {
        logData.value[logData.value.length - 1] += line;
      } else {
        logData.value.push(line);
      }
    },
  });
  scrollLogToTop();
};

const getLogData = async () => {
  abortLogStream();

  const logType = pickQuery("type");
  const namespaceUuid = pickQuery("namespace_uuid");
  const jobId = pickQuery("csghub_job_id");
  const dagTaskId = pickQuery("dag_task_id");

  logData.value = [];
  try {
    if (!CSGHUB_DIRECT_LOG_TYPES.has(logType)) {
      logData.value = ["不支持的日志类型"];
      scrollLogToTop();
      return;
    }
    if (!namespaceUuid || !jobId) {
      const missing = describeCsghubLogParamsGap({ namespaceUuid, jobId });
      logData.value = [
        `任务未提交到 CSGHub，无法查看日志（缺少：${missing.join("、")}）`,
      ];
      scrollLogToTop();
      return;
    }
    await fetchCsghubLogs({ namespaceUuid, jobId, dagTaskId });
  } catch (error) {
    if (error?.name === "AbortError") {
      return;
    }
    logData.value = [error?.message || "获取日志失败"];
    scrollLogToTop();
  }
};

watch(
  () => [
    route.query.task_uid,
    route.query.namespace_uuid,
    route.query.csghub_job_id,
    route.query.dag_task_id,
    route.query.type,
  ],
  () => {
    getLogData();
  },
  { immediate: true }
);

onBeforeUnmount(() => {
  abortLogStream();
});
</script>
<style lang="less" scoped>
.resultBox {
  display: block;
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  margin: 0;
  border-radius: 12px;
  background: #0c111d;
  padding: 24px;
  height: 700px;
  overflow: scroll;
  white-space: pre;
  word-wrap: normal;
  overflow-wrap: normal;
  color: #f9fafb;
  font-family: "Roboto Mono", monospace;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px;
}

/* datapipelines base.html 全局隐藏了滚动条，此处强制显示 */
.log-scroll-box {
  scrollbar-gutter: stable both-edges;
  scrollbar-width: thin;
  scrollbar-color: #667085 #1d2939;

  &::-webkit-scrollbar {
    opacity: 1 !important;
    width: 12px;
    height: 12px;
  }

  &::-webkit-scrollbar-track {
    background: #1d2939;
    border-radius: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: #667085;
    border-radius: 6px;
    border: 2px solid #1d2939;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #98a2b3;
  }

  &::-webkit-scrollbar-corner {
    background: #1d2939;
  }
}
</style>
