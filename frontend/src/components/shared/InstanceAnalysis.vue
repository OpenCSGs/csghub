<template>
  <div v-if="hasRunningInstances" class="py-7 flex flex-col gap-4">
    <!-- refresh button -->
    <div class="flex gap-2">
      <el-select
        v-model="selectedInstance"
        @change="refeshCurrentPeriod"
        size="large"
        class="!w-[292px]"
        :placeholder="$t('endpoints.analysis.selectedInstance')">
        <el-option
          v-for="instance in instances"
          :key="instance.name"
          :label="instance.name"
          :value="instance.name" />
      </el-select>
      <el-select
        v-model="timePeriod"
        @change="refeshCurrentPeriod"
        size="large"
        class="!w-[292px]"
        :placeholder="$t('endpoints.analysis.selectPeriod')">
        <el-option
          v-for="option in timePeriodOptions"
          :key="option.value"
          :label="option.label"
          :value="option.value" />
      </el-select>
      <CsgButton
        class="btn btn-secondary-gray btn-sm"
        :name="$t('endpoints.analysis.refresh')"
        svgName="refresh"
        @click="refeshCurrentPeriod"
      />
    </div>
    <!-- metrics part -->
     <div class="grid grid-cols-2 gap-6">
       <div class="border border-gray-200 rounded-xl round-3 p-6">
         <p class="text-gray-600 leading-[22px] text-sm">{{ $t('endpoints.analysis.replica') }}</p>
         <p class="text-gray-900 leading-[38px] text-3xl font-500">{{ instances.length }}/{{ maxReplica }}</p>
       </div>
       <div class="border border-gray-200 rounded-xl p-6">
         <p class="text-gray-600 leading-[22px] text-sm">{{ $t('endpoints.analysis.totalRequests') }}</p>
         <p class="text-gray-900 leading-[38px] text-3xl font-500">{{ totalRequests }}</p>
       </div>
     </div>
     <!-- chart row 1 -->
     <div class="grid grid-cols-2 gap-6">
       <div class="border border-gray-200 rounded-xl p-4 h-[296px]" id="chart-one"></div>
       <div class="border border-gray-200 rounded-xl p-4 h-[296px]" id="chart-two"></div>
     </div>
     <!-- chart row 2 -->
     <div class="grid grid-cols-2 gap-6">
       <div class="border border-gray-200 rounded-xl p-4 h-[296px]" id="chart-three"></div>
       <div class="border border-gray-200 rounded-xl p-4 h-[296px]" id="chart-four"></div>
     </div>
  </div>
  <div v-else>
    <div class="mt-8">
      <p class="text-gray-600 leading-[22px] text-sm">{{ $t('endpoints.analysis.noInstances') }}</p>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed, watch, onMounted } from 'vue'
  import * as echarts from 'echarts'
  import useFetchApi from '@/packs/useFetchApi'
  import { useI18n } from 'vue-i18n'
  import { timestampToDatetimeStr } from '@/packs/datetimeUtils'

  const props = defineProps({
    repoType: String,
    instances: {
      type: Array,
      default: () => []
    },
    modelId: String,
    deployId: String,
    maxReplica: {
      type: Number,
      default: 1
    },
  })

  const { t } = useI18n()
  const totalRequests = ref(0)

  watch(() => props.modelId, (newVal) => {
    if (hasRunningInstances.value) {
      renderHttpCount()
      renderHttpLatency()
      renderCpuUsage()
      renderMemoryUsage()
    }
  })

  const selectedInstance = ref(props.instances[0]?.name)

  const hasRunningInstances = computed(() => {
    return props.instances.length > 0
  })

  const apiRepoType = computed(() => {
    if (props.repoType === 'endpoint') {
      return 'models'
    } else if (props.repoType === 'space') {
      return 'spaces'
    } else if (props.repoType === 'finetune') {
      return 'models'
    }
  })

  const instanceType = computed(() => {
    if (props.repoType === 'endpoint') {
      return 'run'
    } else if (props.repoType === 'space') {
      return 'run'
    } else if (props.repoType === 'finetune') {
      return 'finetune'
    }
  })

  const timePeriodOptions = [
    {
      label: t('endpoints.analysis.thirty_m'),
      value: '30m'
    },
    {
      label: t('endpoints.analysis.one_h'),
      value: '1h'
    },
    {
      label: t('endpoints.analysis.three_h'),
      value: '3h'
    },
    {
      label: t('endpoints.analysis.six_h'),
      value: '6h'
    },
    {
      label: t('endpoints.analysis.twelve_h'),
      value: '12h'
    },
    {
      label: t('endpoints.analysis.one_d'),
      value: '1d'
    },
    {
      label: t('endpoints.analysis.three_d'),
      value: '3d'
    },
    {
      label: t('endpoints.analysis.one_w'),
      value: '1w'
    }
  ]
  const timePeriod = ref(timePeriodOptions[0].value)

  const renderHttpCount = async () => {
    var myChart = echarts.init(document.getElementById('chart-one'));
    const url = `/${apiRepoType.value}/${props.modelId}/${instanceType.value}/${props.deployId}/request/${selectedInstance.value}/count?last_duration=${timePeriod.value}`
    let xAxisData = []
    let twoSeriesData = []
    let fourSeriesData = []
    let fiveSeriesData = []
    try {
      const { data, error } = await useFetchApi(url).json()
      if (error.value) {
        console.log(`Failed to fetch http count: ${error.value}`)
      } else {
        const monitorData = data.value.data?.result
        if (monitorData) {
          xAxisData = monitorData[0].values.map(item => timestampToDatetimeStr(item.timestamp))
          const twoSeries = monitorData.find(item => item.metric.response_code_class == '2xx')?.values
          const fourSeries = monitorData.find(item => item.metric.response_code_class == '4xx')?.values
          const fiveSeries = monitorData.find(item => item.metric.response_code_class == '5xx')?.values
          twoSeriesData = twoSeries?.map(item => item.value)
          fourSeriesData = fourSeries?.map(item => item.value)
          fiveSeriesData = fiveSeries?.map(item => item.value)

          totalRequests.value = (twoSeries?.slice(-1)[0].value || 0) +
                                (fourSeries?.slice(-1)[0].value || 0) +
                                (fiveSeries?.slice(-1)[0].value || 0)
        }
      }
    } catch (error) {
      console.log(`Failed to fetch http count: ${error}`)
    }
    myChart.setOption({
      title: {
        text: t('endpoints.analysis.httpCount')
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        align: 'right',
        left: 'right',
        data: ['2xx', '4xx', '5xx']
      },
      color: ['#3250BD', '#5271E3', '#223B99'],
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        show: false,
        boundaryGap: false,
        data: xAxisData
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '2xx',
          type: 'line',
          stack: 'Total',
          data: twoSeriesData
        },
        {
          name: '4xx',
          type: 'line',
          stack: 'Total',
          data: fourSeriesData
        },
        {
          name: '5xx',
          type: 'line',
          stack: 'Total',
          data: fiveSeriesData
        }
      ]
    })
  }

  const renderHttpLatency = async () => {
    var myChart = echarts.init(document.getElementById('chart-two'));
    const url = `/${apiRepoType.value}/${props.modelId}/${instanceType.value}/${props.deployId}/request/${selectedInstance.value}/latency?last_duration=${timePeriod.value}`
    let xAxisData = []
    let seriesData = []
    try {
      const { data, error } = await useFetchApi(url).json()
      if (error.value) {
        console.log(`Failed to fetch http latency: ${error.value}`)
      } else {
        const monitorData = data.value.data?.result
        if (monitorData) {
          xAxisData = monitorData.map(item => item.metric.le)
            .map(item => item === '+Inf' ? Infinity : parseFloat(item))
            .sort((a, b) => a - b)
            .map(num => {
              if (num === Infinity) return 'Other'
              if (num < 1000) return `${Math.round(num)}ms`
              return `${Math.round(num / 1000)}s`
            });
          seriesData = monitorData.map(item => item.value.value)
        }
      }
    } catch (error) {
      console.log(`Failed to fetch http count: ${error}`)
    }

    myChart.setOption({
      title: {
        text: t('endpoints.analysis.httpCountForLatency')
      },
      tooltip: {},
      xAxis: {
        data: xAxisData
      },
      yAxis: {},
      series: [
        {
          name: 'le',
          type: 'bar',
          data: seriesData
        }
      ]
    })
  }

  const renderCpuUsage = async () => {
    var myChart = echarts.init(document.getElementById('chart-three'));
    const url = `/${apiRepoType.value}/${props.modelId}/${instanceType.value}/${props.deployId}/cpu/${selectedInstance.value}/usage?last_duration=${timePeriod.value}`
    let xAxisData = []
    let seriesData = []
    try {
      const { data, error } = await useFetchApi(url).json()
      if (error.value) {
        console.log(`Failed to fetch cpu usage: ${error.value}`)
      } else {
        const monitorData = data.value.data?.result[0]
        if (monitorData) {
          xAxisData = monitorData?.values.map(item => timestampToDatetimeStr(item.timestamp))
          seriesData = monitorData?.values.map(item => item.value)
        }
      }
    } catch (error) {
      console.log(`Failed to fetch http count: ${error}`)
    }
    myChart.setOption({
      title: {
        text: t('endpoints.analysis.cpuUsage')
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        align: 'right',
        left: 'right',
        data: ['usage in percent']
      },
      color: ['#3250BD', '#5271E3', '#223B99'],
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        show: false,
        data: xAxisData
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: 'usage in percent',
          type: 'line',
          stack: 'Total',
          data: seriesData
        }
      ]
    })
  }

  const renderMemoryUsage = async () => {
    var myChart = echarts.init(document.getElementById('chart-four'));
    const url = `/${apiRepoType.value}/${props.modelId}/${instanceType.value}/${props.deployId}/memory/${selectedInstance.value}/usage?last_duration=${timePeriod.value}`
    let xAxisData = []
    let seriesData = []
    try {
      const { data, error } = await useFetchApi(url).json()
      if (error.value) {
        console.log(`Failed to fetch memory usage: ${error.value}`)
      } else {
        const monitorData = data.value.data?.result[0]
        if (monitorData) {
          xAxisData = monitorData?.values.map(item => timestampToDatetimeStr(item.timestamp))
          seriesData = monitorData?.values.map(item => item.value)
        }
      }
    } catch (error) {
      console.log(`Failed to fetch http count: ${error}`)
    }
    myChart.setOption({
      title: {
        text: t('endpoints.analysis.memoryUsage')
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        align: 'right',
        left: 'right',
        data: ['usage in GB']
      },
      color: ['#3250BD', '#5271E3', '#223B99'],
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        show: false,
        data: xAxisData
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: 'usage in GB',
          type: 'line',
          stack: 'Total',
          data: seriesData
        }
      ]
    })
  }

  const refeshCurrentPeriod = () => {
    if (hasRunningInstances.value) {
      renderHttpCount()
      renderHttpLatency()
      renderCpuUsage()
      renderMemoryUsage()
    }
  }

  onMounted(() => {
    if (props.modelId && hasRunningInstances.value) {
      renderHttpCount()
      renderHttpLatency()
      renderCpuUsage()
      renderMemoryUsage()
    }
  })
</script>
