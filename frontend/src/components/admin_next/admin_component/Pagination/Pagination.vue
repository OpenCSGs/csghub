<template>
  <el-pagination
    class="next flex justify-between my-[24px] mx-[15px]"
    :prev-icon="PrevButton"
    :next-icon="NextButton"
    v-bind="$attrs" />
</template>

<script setup>
  import PrevButton from './PrevButton.vue'
  import NextButton from './NextButton.vue'
</script>

<style lang="less">
  .el-pagination.next {
    .number {
      color: #475467;

      &.is-active {
        border-radius: 4px;
        background-color: #f9fafb;
        color: #182230 !important;
        font-weight: normal !important;
      }
    }

    button.btn-prev,
    button.btn-next {
      display: inline-flex;
      align-items: normal;
    }
  }
</style>
