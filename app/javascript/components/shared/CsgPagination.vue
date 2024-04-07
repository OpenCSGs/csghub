<template>
    <el-pagination
      background
      :hide-on-single-page="true"
      v-model:current-page="theCurrentPage"
      :prev-icon="prevIcon"
      :next-icon="nextIcon"
      :default-current-page="1"
      :total="total"
      :page-size="perPage"
      layout="prev, pager, next"
      @update:current-page="currentChange"
      class="my-[52px] flex justify-center"
    />
</template>

<script setup>
import { ref } from "vue";
import Previous from "./Previous.vue";
import Next from "./Next.vue";
const props = defineProps({
  perPage: Number,
  total: Number,
  currentPage: Number,
});
const emit = defineEmits(["currentChange"]);
console.log(props.perPage);
console.log(props.total);
const theCurrentPage = ref(props.currentPage);
const prevIcon = ref(Previous);
const nextIcon = ref(Next);
const currentChange = (currentPage) => {
  emit("currentChange", currentPage);
};
</script>
<style scoped>
:deep(.btn-prev) {
  border-radius: 8px 0 0 8px;
  margin: 0 !important;
  background: #ffffff !important;
  border: 1px solid #d0d5dd;
}
:deep(.btn-next) {
  border-radius: 0 8px 8px 0;
  margin: 0 !important;
  background: #ffffff !important;
  border: 1px solid #d0d5dd;
}
:deep(.el-pager li) {
  margin: 0 !important;
  background-color: #ffffff !important;
  border: 1px solid #d0d5dd;
  color: #182230 !important;
}
:deep(.el-pager li.is-active) {
  background-color: #F9FAFB !important;
  color: #182230 !important;
}
</style>
