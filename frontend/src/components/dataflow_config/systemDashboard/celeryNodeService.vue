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
      {{ t("dataPipelines.data_source") }}
    </p>

    <div>
      <div class="grid grid-cols-4 md:grid-cols-4 gap-4 mt-4">
        <!-- 等待中 -->
        <div
          class="bg-white rounded-lg border p-4 flex flex-col justify-between"
        >
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600">{{ t("dataPipelines.waiting") }}</span>
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
            <span class="text-sm text-gray-600">{{ t("dataPipelines.inProgress") }}</span>
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
            <span class="text-sm text-gray-600">{{ t("dataPipelines.execution_completed_normally") }}</span>
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
            <span class="text-sm text-gray-600">{{ t("dataPipelines.execution_end_error") }}</span>
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
      {{ t("dataPipelines.formatConversion") }}
    </p>

    <div>
      <div class="grid grid-cols-5 md:grid-cols-5 gap-5 mt-4">
        <!-- 等待中 -->
        <div
          class="bg-white rounded-lg border p-4 flex flex-col justify-between"
        >
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600">{{ t("dataPipelines.waiting") }}</span>
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
            <span class="text-sm text-gray-600">{{ t("dataPipelines.inProgress") }}</span>
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
            <span class="text-sm text-gray-600">{{ t("dataPipelines.stopped") }}</span>
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
            <span class="text-sm text-gray-600">{{ t("dataPipelines.execution_completed_normally") }}</span>
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
            <span class="text-sm text-gray-600">{{ t("dataPipelines.execution_end_error") }}</span>
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
      {{ t("dataPipelines.dataProcessing") }}
    </p>

    <div>
      <div class="grid grid-cols-4 md:grid-cols-4 gap-4 mt-4">
        <!-- 等待中 -->
        <div
          class="bg-white rounded-lg border p-4 flex flex-col justify-between"
        >
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600">{{ t("dataPipelines.waiting") }}</span>
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
            <span class="text-sm text-gray-600">{{ t("dataPipelines.inProgress") }}</span>
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
            <span class="text-sm text-gray-600">{{ t("dataPipelines.execution_completed_normally") }}</span>
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
            <span class="text-sm text-gray-600">{{ t("dataPipelines.execution_end_error") }}</span>
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
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import useFetchApi from "../../../packs/useFetchApi";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

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

onMounted(() => {
  getTaskStatistics();
  getFormatifyTaskStatistics();
  getJobsTaskStatistics();
});
</script>
