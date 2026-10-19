<template>
  <div class="metrics-compare-viewer">
    <el-skeleton v-if="loading" :rows="6" animated />

    <div v-else-if="!hasMetrics" class="py-12">
      <el-empty
        description="No performance metrics file (metrics.json or eval_results.json) found in these versions. Add a metrics file to your model repository to display performance score comparisons."
      />
    </div>

    <div v-else class="space-y-6">
      <div class="flex items-center justify-between pb-3 border-b border-gray-200">
        <span class="text-sm font-semibold text-gray-800">Performance Metrics Comparison</span>
        <el-tag size="small" type="info" effect="plain">{{ metricList.length }} Metrics Found</el-tag>
      </div>

      <!-- Metrics Table -->
      <div class="border border-gray-200 rounded overflow-hidden">
        <table class="w-full text-left text-sm">
          <thead class="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase">
            <tr>
              <th class="px-4 py-2.5">Metric</th>
              <th class="px-4 py-2.5 w-1/4">{{ versionALabel || 'Version A' }}</th>
              <th class="px-4 py-2.5 w-1/4">{{ versionBLabel || 'Version B' }}</th>
              <th class="px-4 py-2.5 w-1/4">Difference (Δ)</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white">
            <tr v-for="item in metricList" :key="item.name" class="hover:bg-gray-50">
              <td class="px-4 py-3 font-medium text-gray-800">{{ item.name }}</td>
              <td class="px-4 py-3 font-mono text-xs text-gray-700">{{ item.valAFormatted }}</td>
              <td class="px-4 py-3 font-mono text-xs text-gray-700">{{ item.valBFormatted }}</td>
              <td class="px-4 py-3 font-mono text-xs">
                <span
                  v-if="item.delta !== null"
                  :class="[
                    'px-2 py-0.5 rounded font-semibold text-xs',
                    item.delta > 0 ? 'bg-green-100 text-green-800' : item.delta < 0 ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-700'
                  ]"
                >
                  {{ item.delta > 0 ? '+' : '' }}{{ item.deltaFormatted }}
                </span>
                <span v-else class="text-gray-400">-</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- ECharts Visual Comparison Chart if numerical metrics exist -->
      <div v-if="chartData.length > 0" class="border border-gray-200 rounded p-4 bg-white">
        <div class="text-xs font-semibold text-gray-600 uppercase mb-3">Metrics Visual Comparison</div>
        <div ref="chartRef" class="w-full h-72"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick, onUnmounted } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  metricsA: [Object, Array, null],
  metricsB: [Object, Array, null],
  versionALabel: String,
  versionBLabel: String,
  loading: Boolean
})

const chartRef = ref(null)
let chartInstance = null

const normalizeMetricsObj = (raw) => {
  if (!raw) return {}
  if (typeof raw === 'object' && !Array.isArray(raw)) {
    // If nested under 'metrics' or 'results' key
    if (raw.metrics && typeof raw.metrics === 'object') return raw.metrics
    if (raw.results && typeof raw.results === 'object') return raw.results
    if (raw.eval_results && typeof raw.eval_results === 'object') return raw.eval_results
    return raw
  }
  if (Array.isArray(raw)) {
    const res = {}
    raw.forEach((item) => {
      if (item && item.name && item.value !== undefined) {
        res[item.name] = item.value
      }
    })
    return res
  }
  return {}
}

const metricList = computed(() => {
  const normA = normalizeMetricsObj(props.metricsA)
  const normB = normalizeMetricsObj(props.metricsB)

  const keysA = Object.keys(normA)
  const keysB = Object.keys(normB)
  const allKeys = Array.from(new Set([...keysA, ...keysB])).sort()

  return allKeys.map((key) => {
    const valA = normA[key]
    const valB = normB[key]

    const numA = typeof valA === 'number' ? valA : parseFloat(valA)
    const numB = typeof valB === 'number' ? valB : parseFloat(valB)

    const isNum = !isNaN(numA) && !isNaN(numB)
    const delta = isNum ? numB - numA : null

    return {
      name: key,
      valA,
      valB,
      valAFormatted: valA !== undefined ? String(valA) : 'N/A',
      valBFormatted: valB !== undefined ? String(valB) : 'N/A',
      numA: !isNaN(numA) ? numA : null,
      numB: !isNaN(numB) ? numB : null,
      delta,
      deltaFormatted: delta !== null ? (Math.round(delta * 10000) / 10000).toString() : null
    }
  })
})

const hasMetrics = computed(() => metricList.value.length > 0)

const chartData = computed(() => {
  return metricList.value.filter((item) => item.numA !== null || item.numB !== null)
})

const renderChart = () => {
  if (!chartRef.value || chartData.value.length === 0) return

  try {
    if (!chartInstance) {
      chartInstance = echarts.init(chartRef.value)
    }

    const categories = chartData.value.map((d) => d.name)
    const seriesA = chartData.value.map((d) => d.numA)
    const seriesB = chartData.value.map((d) => d.numB)

    const option = {
      animation: false,
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' }
      },
      legend: {
        data: [props.versionALabel || 'Version A', props.versionBLabel || 'Version B'],
        bottom: 0
      },
      grid: {
        top: '10%',
        left: '3%',
        right: '4%',
        bottom: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: categories,
        axisLabel: { interval: 0, rotate: 25 }
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: props.versionALabel || 'Version A',
          type: 'bar',
          data: seriesA,
          itemStyle: { color: '#6366f1' }
        },
        {
          name: props.versionBLabel || 'Version B',
          type: 'bar',
          data: seriesB,
          itemStyle: { color: '#10b981' }
        }
      ]
    }

    chartInstance.setOption(option)
  } catch (e) {
    // Canvas context may be unavailable in unit test environments
  }
}

watch(chartData, () => {
  nextTick(renderChart)
})

onMounted(() => {
  nextTick(renderChart)
})

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
})
</script>
