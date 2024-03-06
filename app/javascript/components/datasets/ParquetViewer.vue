<template>
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
</template>

<script setup>
import { computed } from 'vue'

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
