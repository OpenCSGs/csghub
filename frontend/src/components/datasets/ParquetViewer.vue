<template>
  <div class="flex flex-col border rounded-[8px] p-[16px] gap-[16px]">
    <div class="flex justify-between gap-[16px]">
      <div class="flex w-[181px] h-[28px]">
        <SvgIcon
          name="parquet_viewer"
          width="13px"
          height="13px"
        />
        <p class="ml-[8px] text-gray-900 text-[18px] leading-[28px]">{{ $t('all.parquet') }}</p>
      </div>
      <!-- <div class="flex items-center justify-center">
        <SvgIcon
          name="parquet_auto_converted"
          width="10px"
          height="10px"
          class="cursor-pointer"
        />
        <p class="ml-[8px] text-gray-500 text-[14px] leading-[20px]">Auto-converted to Parquet</p>
      </div>
      <div class="flex items-center justify-center cursor-pointer px-[12px] py-[2px] border rounded-[4px]">
        <SvgIcon
          name="parquet_api"
          width="10px"
          height="6px"
        />
        <p class="ml-[8px] text-[12px] leading-[18px] text-gray-500">
          API
        </p>
      </div>
      <div class="flex items-center justify-center cursor-pointer px-[12px] py-[2px] border rounded-[4px]">
        <SvgIcon
          name="parquet_api"
          width="10px"
          height="6px"
        />
        <p class="ml-[8px] text-[12px] leading-[18px] text-gray-500">
          Go to dataset viewer
        </p>
      </div> -->
    </div>
    <div class="flex justify-between gap-[16px] text-gray-700 text-[14px] leading-[20px]">
      <div class="flex flex-col gap-[8px]">
        <p>Subset</p>
        <el-select
          v-model="subset"
          @change="changeSubsetName"
          placeholder="Select"
          size="large"
          class="!w-[350px] sm:!w-full">
          <el-option
            v-for="item in datasetInfo"
            :key="item.config_name"
            :label="item.config_name"
            :value="item.config_name" />
        </el-select>
      </div>
      <div v-if="splits" class="flex flex-col gap-[8px]">
        <p>Split {{ numSplits }}</p>
        <el-select
          v-model="split"
          @change="changeSplitName"
          placeholder="Select"
          size="large"
          class="!w-[350px] sm:!w-full">
          <el-option
            v-for="item in splits"
            :key="item.name"
            :label="item.name"
            :value="item.name" />
        </el-select>   
      </div>
    </div>
    <!-- <div>
      <el-input
        v-model="nameFilterInput"
        clearable
        size="large"
        :prefix-icon="Search"
        placeholder="Search this dataset"
        @change="filterChange"
        class="w-full" />
    </div> -->
    <div>
      <el-table :data="tableData"
                border
                stripe
                max-height="420"
                @row-click="toggleRow"
                class="w-full rounded-md mb-4"
                row-class-name="row-item-clamp cursor-pointer"
                cell-class-name="!align-top">
        <el-table-column v-for="column in previewData.columns"
                        :key="column"
                        :prop="column"
                        :label="column"
                        min-width="180" />
      </el-table>
      <CsgPagination
        perPage="4"
        :currentPage="currentPage"
        @currentChange="reloadRows"
        :total="totalRows"
      />
    </div>
  </div>
</template>

<script setup>
  import { computed, onMounted, ref } from 'vue'
  import { ElMessage } from 'element-plus'
  import { Search } from '@element-plus/icons-vue'
  import useFetchApi from '../../packs/useFetchApi'
  import CsgPagination from '../shared/CsgPagination.vue'

  const props = defineProps({
    datasetInfo: Object,
    namespacePath: String
  })

  const previewData = ref({ columns: [], rows: [], total: 0 })
  const currentPage = ref(1)
  const totalRows = computed(() => { return previewData.value.total });
  const nameFilterInput = ref('')
  // 默认subset和split的值
  const splits = ref(props.datasetInfo[0].splits)
  const subset = ref(props.datasetInfo[0].config_name)
  const split = ref(splits.value[0]?.name || '')
  const numSplits = ref(splits.value[0]?.num_examples || 0)

  const tableData = computed(() => {
    const rows = previewData.value?.rows.slice(0, 4) || []
    const columns = previewData.value?.columns || []
    return rows.map(row => {
      const obj = {}
      for (let i = 0; i < columns.length; i++) {
        obj[columns[i]] = row[i]
      }
      return obj
    })
  })

  const toggleRow = (_row, _column, event) => {
    const row = event.target.closest('.el-table__row')
    row.classList.toggle('row-item-clamp')
  }
  
  const changeSubsetName = (value) => {
    const filteredItem = props.datasetInfo.find(item => item.config_name === value)
    splits.value = filteredItem ? filteredItem.data_files: null
    split.value = splits.value[0].name || ''
    numSplits.value = splits.value[0].num_examples || 0
    currentPage.value = 1
    reloadRows()
  }

  const changeSplitName = (value) => {
    currentPage.value = 1
    reloadRows()
  }

  const filterChange = () => {
    currentPage.value = 1
    reloadRows()
  }

  const reloadRows = (childCurrent) => {
    if(childCurrent){
      currentPage.value = childCurrent
    }
    let url = `datasets/${props.namespacePath}/dataviewer/rows`
    url = url + `?page=${childCurrent ? childCurrent : currentPage.value}`
    url = url + `&per=4`
    url = url + `&search=${nameFilterInput.value}`

    url = url + `&namespace=${props.namespacePath.split('/')[0]}`
    url = url + `&config=${subset.value}`
    url = url + `&split=${split.value}`
    loadRows(url)
  }

  async function loadRows(url) {
    const { error, data } = await useFetchApi(url).json()
    if (!data.value) {
      ElMessage({
        message: error.value.msg || t('all.fetchError'),
        type: 'warning'
      })
    } else {
      previewData.value = data.value.data
    }
  }

  onMounted(() => {
    reloadRows()
  })
</script>

<style scoped>
  :deep(.row-item-clamp .cell) {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }

  :deep(.el-table__header-wrapper th) {
    background-color: #F9FAFB;
  }
</style>
