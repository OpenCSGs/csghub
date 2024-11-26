<template>
  <div
    class="next-table bg-white rounded-xl shadow border border-[#eaecf0] mt-[24px] overflow-hidden">
    <!-- card header -->
    <slot name="header">
      <div
        v-if="title"
        class="px-6 py-7 border-b border-gray-200">
        <h2 class="text-lg text-gray-900">
          {{ title }}
        </h2>
      </div>
    </slot>

    <!-- card body -->
    <ElCard
      size="small"
      :border="false"
      class="next"
      v-bind="$attrs">
      <slot />
    </ElCard>

    <!-- card footer -->
    <div class="py-4 flex justify-end px-6 border-t border-gray-200">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup>
  import { ElCard } from 'element-plus'
  defineProps({
    title: {
      type: String,
      required: false
    }
  })
</script>

<style lang="less">
  .el-card.next {
    --el-card-border-color: transparent;
    border: unset;
  }

  .el-card.next.is-always-shadow {
    box-shadow: none;
  }
</style>
