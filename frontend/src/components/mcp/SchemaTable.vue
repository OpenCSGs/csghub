<template>
  <div class="block overflow-auto schema-table-container">
    <el-table
      class="schema-table"
      :data="safeData"
      style="width: 100%"
      :empty-text="$t('all.noData')"
      header-row-class-name="schema-table-header-row"
      header-cell-class-name="schema-table-header-cell"
      row-class-name="schema-table-row"
      cell-class-name="schema-table-row-cell"
    >
      <el-table-column
        v-for="column in visibleColumns"
        :key="column.key"
        :prop="column.key"
        :label="formatColumnLabel(column.key)"
        :width="column.width || ''"
        :align="column.align || 'left'"
        :class-name="column.className || ''"
      >
        <template
          v-if="dataType === 'tools' && column.key === 'name'"
          #default="scope"
        >
          <ToolNameCell
            :tool="scope.row"
            @showToolDetail="showToolDetail"
          />
        </template>
        <template
          v-else
          #default="scope"
        >
          {{ scope.row[column.key] }}
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="dialogVisible">
      <template #header="{ close, titleId, titleClass }">
        <div class="flex items-center gap-4 w-full">
          <div
            class="w-12 h-12 flex items-center justify-center bg-white rounded-[10px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] outline outline-1 outline-offset-[-1px] outline-gray-200"
          >
            <SvgIcon name="space_mcp" />
          </div>
          <div class="flex-1">
            <div class="text-gray-900 text-lg font-medium">
              {{ $t('mcps.mcpTool') }}
            </div>
            <div class="text-gray-600 text-sm font-light mt-1">
              {{ $t('mcps.mcpToolDesc') }}
            </div>
          </div>
        </div>
      </template>
      <McpToolDetail :tool="toolData" />
    </el-dialog>
  </div>
</template>

<script setup>
  import { ref, computed } from 'vue'
  import ToolNameCell from './ToolNameCell.vue'
  import McpToolDetail from './McpToolDetail.vue'

  const dialogVisible = ref(false)
  const toolData = ref({})

  const showToolDetail = (tool) => {
    toolData.value = tool
    dialogVisible.value = true
  }

  const props = defineProps({
    data: {
      type: Array,
      default: () => []
    },
    columnConfig: {
      type: Array,
      default: null
    },
    hiddenColumns: {
      type: Array,
      default: () => []
    },
    dataType: {
      type: String,
      default: ''
    }
  })

  const safeData = computed(() => {
    return Array.isArray(props.data) ? props.data : []
  })

  const defaultColumns = computed(() => {
    if (!safeData.value.length) return []

    return Object.keys(safeData.value[0]).map((key) => ({
      key,
      width: key === 'description' ? '400' : ''
    }))
  })

  const emptyDataColumns = computed(() => {
    return ['name', 'description']
  })

  const columns = computed(() => {
    if (!props.columnConfig) {
      if (defaultColumns.value.length) {
        return defaultColumns.value
      } else {
        return emptyDataColumns.value.map((key) => {
          return {
            key,
            width: key === 'description' ? '400' : ''
          }
        })
      }
    }

    return props.columnConfig
  })

  const visibleColumns = computed(() => {
    console.log('columns', columns.value)
    return columns.value.filter(
      (column) => !props.hiddenColumns.includes(column.key)
    )
  })

  const formatColumnLabel = (key) => {
    return key.charAt(0).toUpperCase() + key.slice(1)
  }
</script>

<style lang="less">
  .schema-table {
    .el-table__empty-block {
      border: 1px solid #ebeef5;
      border-bottom-left-radius: 12px;
      border-bottom-right-radius: 12px;
    }

    .el-table__inner-wrapper:before {
      height: 0;
    }

    .schema-table-header-row {
      .schema-table-header-cell {
        padding: 12px 0;
        font-size: 14px;
        font-weight: 500;
        color: var(--gray-500);
        &:nth-child(1) {
          border-left: 1px solid #ebeef5;
          border-top-left-radius: 12px;
        }
        &:nth-last-child(1) {
          border-right: 1px solid #ebeef5;
          border-top-right-radius: 12px;
        }
        .cell {
          line-height: 18px;
        }
        border-top: 1px solid #ebeef5;
        background-color: #f2f4f7;
      }
    }

    .schema-table-row {
      .schema-table-row-cell {
        &:nth-child(1) {
          border-left: 1px solid #ebeef5;
        }
        &:nth-last-child(1) {
          border-right: 1px solid #ebeef5;
        }
      }
      &:nth-last-child(1) {
        .schema-table-row-cell {
          &:nth-child(1) {
            border-bottom-left-radius: 12px;
          }
          &:nth-last-child(1) {
            border-bottom-right-radius: 12px;
          }
        }
      }
    }
  }

  .schema-table-container {
    .el-dialog {
      padding: 0;
    }

    .el-dialog__header {
      padding: 24px;
      border-bottom: 1px solid #eaecf0;
    }

    .el-dialog__body {
      padding: 24px;
    }

    .el-dialog__headerbtn {
      top: 12px;
      right: 12px;
      font-size: 24px;
    }
  }
</style>
