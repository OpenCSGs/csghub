<template>
  <div class="flex flex-col border rounded-[8px] p-[16px] gap-[16px]">
    <div class="flex justify-between gap-[16px]">
      <div class="flex w-[181px] h-[28px]">
        <SvgIcon
          name="parquet_viewer"
          width="13px"
          height="13px"
        />
        <p class="ml-[8px] text-[#101828] text-[18px] leading-[28px]">数据集预览</p>
      </div>
      <div class="flex items-center justify-center">
        <SvgIcon
          name="parquet_auto_converted"
          width="10px"
          height="10px"
          class="cursor-pointer"
        />
        <p class="ml-[8px] text-[#667085] text-[14px] leading-[20px]">Auto-converted to Parquet</p>
      </div>
      <div class="flex items-center justify-center cursor-pointer px-[12px] py-[2px] border rounded-[4px]">
        <SvgIcon
          name="parquet_api"
          width="10px"
          height="6px"
        />
        <p class="ml-[8px] text-[12px] leading-[18px] text-[#667085]">
          API
        </p>
      </div>
      <div class="flex items-center justify-center cursor-pointer px-[12px] py-[2px] border rounded-[4px]">
        <SvgIcon
          name="parquet_api"
          width="10px"
          height="6px"
        />
        <p class="ml-[8px] text-[12px] leading-[18px] text-[#667085]">
          Go to dataset viewer
        </p>
      </div>
    </div>
    <div class="flex justify-between gap-[16px] text-[#344054] text-[14px] leading-[20px]">
      <div class="flex flex-col gap-[8px]">
        <p>Subset（100）</p>
        <el-select
          v-model="visibilityName"
          @change="changeVisibility"
          placeholder="Select"
          size="large"
          class="!w-[350px] sm:!w-full">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value" />
        </el-select>
      </div>
      <div class="flex flex-col gap-[8px]">
        <p>Split (1)</p>
        <el-select
          v-model="visibilityName"
          @change="changeVisibility"
          placeholder="Select"
          size="large"
          class="!w-[350px] sm:!w-full">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value" />
        </el-select>   
      </div>
    </div>
    <div>
      <el-input
        v-model="delDesc"
        clearable
        size="large"
        :prefix-icon="Search"
        placeholder="Search this dataset"
        class="w-full" />
    </div>
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
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { Search } from '@element-plus/icons-vue'

const props = defineProps({
  previewData: Object
})

const tableData = computed(() => {
  const rows = props.previewData?.rows || []
  const columns = props.previewData?.columns || []
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

onMounted(() => {
    // fetchCatalog()
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
