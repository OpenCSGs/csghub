<template>
  <div class="text-left w-full h-full pl-8 py-8 overflow-auto bg-white">
    <div class="headerMenu flex items-center justify-start mb-5">
      <SvgIcon class="w-5 h-5" name="dataflow_homeIcon" />
      <SvgIcon class="w-5 h-5 mx-2" name="dataflow_homeIcon_divider" />
      <p class="text-brand-600 text-sm font-medium">
        {{ t("dataPipelines.concurrentTaskMonitoring") }}
      </p>
    </div>
    <p class="text-gray-900 text-3xl font-medium">
      {{ t("dataPipelines.concurrentTaskMonitoring") }}
    </p>

    <div class="min-h-screen">
      <!-- 顶部统计信息 -->
      <div class="grid grid-cols-6 md:grid-cols-6 gap-4 mt-4">
        <!-- 全局并发数 -->
        <div
          class="bg-white rounded-lg border p-4 flex flex-col justify-between"
        >
          <!-- 标题 + 图标占位 -->
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600">全局并发数</span>
            <!-- 图标占位，可替换为实际 SvgIcon -->
            <div
              class="w-6 h-6 flex items-center justify-center bg-blue-100 text-blue-500 rounded-full"
            >
              <!-- <SvgIcon class="w-5 h-5" name="icon-concurrency" /> -->
              <span>⚙</span>
            </div>
          </div>
          <!-- 主数据 -->
          <div class="text-xl mt-2">12/20</div>
          <!-- 趋势 + 进度条 -->
          <div class="flex items-start justify-between mt-1 flex-col">
            <div class="flex items-center space-x-1">
              <SvgIcon class="w-3 h-3 text-green-500" name="arrow_under" />
              <span class="text-sm text-green-500">-5%</span>
            </div>
            <div class="w-full bg-gray-200 h-1 rounded-full mt-2">
              <div class="bg-blue-500 h-1 rounded-full w-1/4"></div>
            </div>
          </div>
        </div>

        <!-- 排队任务数 -->
        <div
          class="bg-white rounded-lg border p-4 flex flex-col justify-between"
        >
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600">排队任务数</span>
            <div
              class="w-6 h-6 flex items-center justify-center bg-yellow-100 text-yellow-500 rounded-full"
            >
              <!-- <SvgIcon class="w-5 h-5" name="icon-queue" /> -->
              <span>📋</span>
            </div>
          </div>
          <div class="text-xl mt-2">4</div>
          <div class="flex items-start justify-between mt-1 flex-col">
            <div class="flex items-center space-x-1">
              <SvgIcon class="w-3 h-3 text-red-500" name="arrow_top" />
              <span class="text-sm text-red-500">+2</span>
            </div>
            <div class="w-full bg-gray-200 h-1 rounded-full mt-2">
              <div class="bg-yellow-500 h-1 rounded-full w-1/6"></div>
            </div>
          </div>
        </div>

        <!-- CPU 占用率 -->
        <div
          class="bg-white rounded-lg border p-4 flex flex-col justify-between"
        >
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600">CPU 占用率</span>
            <div
              class="w-6 h-6 flex items-center justify-center bg-green-100 text-green-500 rounded-full"
            >
              <!-- <SvgIcon class="w-5 h-5" name="icon-cpu" /> -->
              <span>💻</span>
            </div>
          </div>
          <div class="text-xl mt-2">72%</div>
          <div class="flex items-start justify-between mt-1 flex-col">
            <div class="flex items-center space-x-1">
              <SvgIcon class="w-3 h-3 text-red-500" name="arrow_top" />
              <span class="text-sm text-red-500">+3%</span>
            </div>
            <div class="w-full bg-gray-200 h-1 rounded-full mt-2">
              <div class="bg-green-500 h-1 rounded-full w-3/5"></div>
            </div>
          </div>
        </div>

        <!-- 内存使用率 -->
        <div
          class="bg-white rounded-lg border p-4 flex flex-col justify-between"
        >
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600">内存使用率</span>
            <div
              class="w-6 h-6 flex items-center justify-center bg-purple-100 text-purple-500 rounded-full"
            >
              <!-- <SvgIcon class="w-5 h-5" name="icon-memory" /> -->
              <span>🧠</span>
            </div>
          </div>
          <div class="text-xl mt-2">68%</div>
          <div class="flex items-start justify-between mt-1 flex-col">
            <div class="flex items-center space-x-1">
              <SvgIcon class="w-3 h-3 text-green-500" name="arrow_under" />
              <span class="text-sm text-green-500">-1%</span>
            </div>
            <div class="w-full bg-gray-200 h-1 rounded-full mt-2">
              <div class="bg-purple-500 h-1 rounded-full w-2/3"></div>
            </div>
          </div>
        </div>

        <!-- 平均任务耗时 -->
        <div
          class="bg-white rounded-lg border p-4 flex flex-col justify-between"
        >
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600">平均任务耗时</span>
            <div
              class="w-6 h-6 flex items-center justify-center bg-blue-100 text-blue-500 rounded-full"
            >
              <!-- <SvgIcon class="w-5 h-5" name="icon-time" /> -->
              <span>⏱</span>
            </div>
          </div>
          <div class="text-xl mt-2">18.6s</div>
          <div class="flex items-start justify-between mt-1 flex-col">
            <div class="flex items-center space-x-1">
              <SvgIcon class="w-3 h-3 text-green-500" name="arrow_under" />
              <span class="text-sm text-green-500">-1.2s</span>
            </div>
            <div class="w-full bg-gray-200 h-1 rounded-full mt-2">
              <div class="bg-blue-500 h-1 rounded-full w-2/5"></div>
            </div>
          </div>
        </div>

        <!-- 今日故障转移 -->
        <div
          class="bg-white rounded-lg border p-4 flex flex-col justify-between"
        >
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600">今日故障转移</span>
            <div
              class="w-6 h-6 flex items-center justify-center bg-yellow-100 text-yellow-500 rounded-full"
            >
              <!-- <SvgIcon class="w-5 h-5" name="icon-fault" /> -->
              <span>⚠</span>
            </div>
          </div>
          <div class="text-xl mt-2">2次</div>
          <div class="flex items-start justify-between mt-1 flex-col">
            <div class="text-sm text-green-500">全部成功</div>
            <div class="w-full bg-gray-200 h-1 rounded-full mt-2">
              <div class="bg-green-500 h-1 rounded-full w-full"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- CPU 占用率趋势 -->
      <div class="bg-white p-5 rounded-lg border mt-6">
        <h3 class="text-lg mb-4">CPU 占用率趋势</h3>
        <div
          class="chart"
          id="cpuTrendChart"
          style="width: 100%; height: 300px"
        ></div>
      </div>

      <!-- 外层容器，设置网格布局 -->
      <div
        class="grid grid-cols-3 sm:grid-cols-1 lg:grid-cols-2 md:grid-cols-3 gap-4 h-[320px] mt-6"
      >
        <!-- 内存使用分布卡片 -->
        <div class="bg-white rounded-lg border p-4">
          <h2 class="text-lg mb-2">内存使用分布</h2>
          <div class="flex items-center">
            <div id="memoryPie" class="w-1/2 h-[250px]"></div>
            <div class="mt-4 flex flex-col space-y-1 w-1/2">
              <div class="flex items-center space-x-2">
                <div class="w-3 h-3 rounded-full bg-green-500"></div>
                <span class="text-xs text-gray-600">应用内存- - - - -26%</span>
              </div>
              <div class="flex items-center space-x-2">
                <div class="w-3 h-3 rounded-full bg-orange-500"></div>
                <span class="text-xs text-gray-600">系统内存- - - - -12%</span>
              </div>
              <div class="flex items-center space-x-2">
                <div class="w-3 h-3 rounded-full bg-blue-300"></div>
                <span class="text-xs text-gray-600">系统内存- - - - -12%</span>
              </div>
              <div class="flex items-center space-x-2">
                <div class="w-3 h-3 rounded-full bg-blue-500"></div>
                <span class="text-xs text-gray-600">空闲内存- - - - -72%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- I/O 吞吐量监控卡片 -->
        <div class="bg-white rounded-lg border p-4">
          <h2 class="text-lg mb-2">I/O 吞吐量监控</h2>
          <!-- 柱状图容器 -->
          <div id="ioBar" class="w-full h-[300px]"></div>
        </div>

        <!-- 任务耗时分布卡片 -->
        <div class="bg-white rounded-lg border p-4">
          <h2 class="text-lg mb-2">任务耗时分布</h2>
          <!-- 柱状图容器 -->
          <div id="taskTimeBar" class="w-full h-[300px]"></div>
        </div>
      </div>

      <div class="w-full bg-white rounded-lg border p-4 mt-6">
        <h2 class="text-lg mb-4">并发任务配置</h2>
        <!-- 全局最大并发数 -->
        <div class="mb-4">
          <div class="flex justify-between">
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >全局最大并发数</label
            >
            <span class="inline-block text-gray-700 ml-2">{{
              globalMaxConcurrent
            }}</span>
          </div>
          <el-slider
            v-model="globalMaxConcurrent"
            :max="20"
            :min="0"
            class="w-full"
            style="--el-slider-process-bg-color: #409eff"
          ></el-slider>
        </div>
        <!-- 模块信息表格 -->
        <el-table
          :data="moduleTableData"
          border
          class="w-full"
          style="
            --el-table-header-text-color: #666;
            --el-table-row-hover-bg: #f8f9fa;
          "
        >
          <el-table-column
            prop="moduleName"
            label="模块名称"
            align="center"
            class-name="text-gray-700"
          />
          <el-table-column
            prop="currentConcurrent"
            label="当前并发"
            align="center"
            class-name="text-gray-700"
          />
          <el-table-column
            prop="maxLimit"
            label="最大限制"
            align="center"
            class-name="text-gray-700"
          />
          <el-table-column
            prop="status"
            label="状态"
            align="center"
            class-name="text-gray-700"
          >
            <template #default="scope">
              <el-tag
                :type="scope.row.status === '正常' ? 'success' : ''"
                class="text-xs"
              >
                {{ scope.row.status }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="operation"
            label="操作"
            align="center"
            class-name="text-gray-700"
          >
            <template #default="scope">
              <el-button
                type="text"
                size="small"
                @click="handleAdjust(scope.row)"
              >
                <span class="text-brand-600 hover:underline cursor-pointer"
                  >调整</span
                >
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ref, onMounted, computed } from "vue";
import { ElMessage } from "element-plus";
import { useI18n } from "vue-i18n";
import * as echarts from "echarts";
const { t } = useI18n();

// 模拟表格数据
const moduleTableData = ref([
  {
    moduleName: "数据采集模块",
    currentConcurrent: 5,
    maxLimit: 8,
    status: "正常",
  },
  {
    moduleName: "数据清洗模块",
    currentConcurrent: 4,
    maxLimit: 6,
    status: "正常",
  },
]);
// 全局最大并发数
const globalMaxConcurrent = ref(20);

onMounted(() => {
  renderCpuTrendChart();

  // 初始化内存使用分布饼图
  const memoryPieChart = echarts.init(document.getElementById("memoryPie"));
  memoryPieChart.setOption({
    series: [
      {
        type: "pie",
        radius: ["55%", "80%"], // 减小环形图尺寸
        // center: ["30%", "50%"], // 向右移动饼图
        data: [
          { value: 26, name: "应用内存", itemStyle: { color: "#46D564" } },
          { value: 12, name: "系统内存", itemStyle: { color: "#E6A23C" } },
          { value: 12, name: "系统内存", itemStyle: { color: "#409EFF" } },
          { value: 72, name: "空闲内存", itemStyle: { color: "#1F90FF" } },
        ],
        label: { show: false },
        legend: {
          orient: "vertical", // 垂直排列
          right: "10%", // 靠右对齐
          top: "center", // 垂直居中
          itemWidth: 10, // 图例标记宽度
          itemHeight: 10, // 图例标记高度
          textStyle: {
            color: "#666",
            fontSize: 12,
          },
        },
      },
    ],
  });

  // 初始化 I/O 吞吐量监控柱状图
  const ioBarChart = echarts.init(document.getElementById("ioBar"));
  ioBarChart.setOption({
    xAxis: {
      type: "category",
      data: ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00"],
      axisLine: { lineStyle: { color: "#999" } },
      axisLabel: { color: "#666" },
    },
    yAxis: {
      type: "value",
      name: "MB",
      max: 140,
      axisLine: { lineStyle: { color: "#999" } },
      axisLabel: { color: "#666" },
      splitLine: { lineStyle: { color: "#eee" } },
    },
    series: [
      {
        name: "读操作",
        type: "bar",
        data: [90, 85, 110, 70, 60, 40],
        itemStyle: { color: "#409EFF" },
        barWidth: "35%",
        label: {
          show: true,
          position: "top",
          color: "#333",
        },
      },
      {
        name: "写操作",
        type: "bar",
        data: [40, 35, 50, 25, 20, 10],
        itemStyle: { color: "#66CCFF" },
        barWidth: "35%",
        label: {
          show: true,
          position: "top",
          color: "#333",
        },
      },
    ],
    legend: {
      data: ["读操作", "写操作"],
      type: "plain",
      itemWidth: 10, // 图例标记宽度
      itemHeight: 10, // 图例标记高度
      itemStyle: {
        borderRadius: 5, // 圆角半径等于宽度一半即圆形
      },
      top: "5%",
      right: "5%",
      textStyle: {
        color: "#666",
        fontSize: 12,
      },
    },
  });

  // 初始化任务耗时分布柱状图
  const taskTimeBarChart = echarts.init(document.getElementById("taskTimeBar"));
  taskTimeBarChart.setOption({
    xAxis: {
      type: "category",
      data: ["高优先级", "中优先级", "低优先级"],
      axisLine: { lineStyle: { color: "#999" } },
      axisLabel: { color: "#666" },
    },
    yAxis: {
      type: "value",
      name: "s",
      max: 30,
      axisLine: { lineStyle: { color: "#999" } },
      axisLabel: { color: "#666" },
      splitLine: { lineStyle: { color: "#eee" } },
    },
    series: [
      {
        type: "bar",
        data: [10, 15, 22],
        itemStyle: {
          color: (params) => {
            const colorMap = ["#FF6B6B", "#F7B84B", "#67C23A"];
            return colorMap[params.dataIndex];
          },
        },
        barWidth: "40%",
        label: {
          show: true,
          position: "top",
          color: "#333",
        },
      },
    ],
  });
});

// 调整操作示例方法
const handleAdjust = (row) => {
  console.log("点击调整", row);
  // 可在这里编写打开调整弹窗或跳转调整页面等逻辑
};

// 渲染 CPU 占用率趋势折线图
function renderCpuTrendChart() {
  const chartDom = document.getElementById("cpuTrendChart");
  const myChart = echarts.init(chartDom);
  const option = {
    grid: {
      left: "3%", // 左侧边距
      right: "4%", // 右侧边距
      bottom: "3%", // 底部边距
      top: "5%", // 顶部边距
      containLabel: true, // 包含标签
    },
    dataZoom: [
      {
        type: "inside", // 内置缩放
        xAxisIndex: 0, // 对应第一个 X 轴
        start: 0, // 开始位置
        end: 100, // 结束位置
      },
    ],
    xAxis: {
      type: "category",
      boundaryGap: false,
      axisLabel: {
        rotate: 45, // 旋转标签避免重叠
        interval: 2, // 控制标签显示间隔
      },
      data: [
        "00:00",
        "01:00",
        "02:00",
        "03:00",
        "04:00",
        "05:00",
        "06:00",
        "07:00",
        "08:00",
        "09:00",
        "10:00",
        "11:00",
        "12:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
        "18:00",
        "19:00",
        "20:00",
        "21:00",
        "22:00",
        "23:00",
      ],
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        name: "今日",
        type: "line",
        data: [
          0, 0, 0, 0, 0, 0, 1, 4, 2, 1, 3, 1, 1, 2, 1, 3, 2, 1, 2, 3, 8, 4, 1,
          0,
        ],
        smooth: true,
        symbol: "none",
        color: "orange",
      },
      {
        name: "1天前",
        type: "line",
        data: [
          0, 0, 0, 1, 1, 0, 0, 1, 2, 2, 4, 2, 1, 1, 2, 3, 2, 1, 2, 2, 3, 2, 1,
          0,
        ],
        smooth: true,
        symbol: "none",
        color: "#6782F1",
      },
      {
        name: "7天前",
        type: "line",
        data: [
          0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0,
          0,
        ],
        smooth: true,
        symbol: "none",
        color: "#66CF95",
      },
    ],
  };
  myChart.setOption(option);
}
</script>
<style lang="less" scoped></style>
