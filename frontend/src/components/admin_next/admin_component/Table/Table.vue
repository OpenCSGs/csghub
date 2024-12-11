<template>
  <div
    class="next-table bg-white rounded-xl shadow border border-[#eaecf0] mt-8 overflow-hidden">
    <slot name="header">
      <div
        v-if="title"
        class="px-6 pt-5 pb-4">
        <h2 class="text-18 text-md text-gray-900">
          {{ title }}
        </h2>
      </div>
    </slot>
    <!-- support all attrs pass to ElTable -->
    <ElTable
      size="small"
      :border="false"
      class="next"
      v-bind="$attrs">
      <slot />
    </ElTable>
    <slot name="footer" />
  </div>
</template>

<script setup>
  import { ElTable } from 'element-plus'
  defineProps({
    title: {
      type: String,
      required: false
    }
  })
</script>

<style lang="less">
  .el-table.next {
    --el-table-border-color: transparent;

    .cell {
      padding: 0 15px;
    }

    .el-table__header {
      th {
        background-color: #f8f9fb;

        font-weight: normal;
        font-size: 12px;
        height: 60px;
        border-bottom: 1px solid #eaecf0;

        &.cell {
          color: #475467;
        }
      }
    }

    .el-table__row {
      td {
        height: 60px;
        color: #475466;
        font-weight: 300;
        font-size: 14px;
        border-bottom: 1px solid #eaecf0;
      }
    }
  }
</style>
