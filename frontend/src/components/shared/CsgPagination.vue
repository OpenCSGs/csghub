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
      class="my-12 flex justify-between"
    />
</template>

<script setup>
import { ref, watch } from "vue";
import Previous from "./Previous.vue";
import Next from "./Next.vue";
const props = defineProps({
  perPage: Number,
  total: Number,
  currentPage: Number,
});
const emit = defineEmits(["currentChange"]);

const theCurrentPage = ref(props.currentPage);
const prevIcon = ref(Previous);
const nextIcon = ref(Next);
const currentChange = (currentPage) => {
  emit("currentChange", currentPage);
};

// 监听 props.currentPage 的变化来更新 theCurrentPage
watch(() => props.currentPage, (newPage) => {
  theCurrentPage.value = newPage;
});
</script>
<style scoped>
:deep(.btn-prev.is-first) {
  border-radius: 0 !important;
  border: none !important;
  color: #182230 !important;
  font-weight: 400 !important;
  margin-right: 8px !important;
  height: 40px !important;
}
:deep(.btn-prev.is-first *) {
  font-weight: 400 !important;
}
:deep(.btn-prev.is-first:hover) {
  background-color: #F9FAFB !important;
  border-radius: 8px !important;
}
:deep(.btn-next.is-last) {
  border-radius: 0 !important;
  border: none !important;
  color: #182230 !important;
  font-weight: 400 !important;
  margin-left: 8px !important;
  height: 40px !important;
}
:deep(.btn-next.is-last *) {
  font-weight: 400 !important;
}
:deep(.btn-next.is-last:hover) {
  background-color: #F9FAFB !important;
  border-radius: 8px !important;
}
:deep(.btn-prev) {
  border-radius: 8px;
  margin: 0 !important;
  color: #182230 !important;
  background: #ffffff !important;
  border: 1px solid #d0d5dd;
  font-weight: 400 !important;
  height: 40px !important;
}
:deep(.btn-prev *) {
  font-weight: 400 !important;
}
:deep(.btn-next) {
  border-radius: 8px;
  margin: 0 !important;
  color: #182230 !important;
  background: #ffffff !important;
  border: 1px solid #d0d5dd;
  font-weight: 400 !important;
  height: 40px !important;
}
:deep(.btn-next *) {
  font-weight: 400 !important;
}
:deep(.el-pager li) {
  margin: 0 !important;
  background-color: #ffffff !important;
  font-weight: 400 !important;
  border-radius: 0 !important;
  border-right: none;
  color: #182230 !important;
  height: 40px !important;
}
:deep(.el-pager li:first-child) {
  border-left: none;
}
:deep(.el-pager li.is-active) {
  background-color: #F9FAFB !important;
  font-weight: 400 !important;
  color: #182230 !important;
  border-radius: 8px !important;
}
</style>
