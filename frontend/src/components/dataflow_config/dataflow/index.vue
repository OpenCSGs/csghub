<template>
  <div class="text-left h-full p-[32px] overflow-auto bg-[#FFF]">
    <div class="headerMenu flex items-center justify-start mb-[20px]">
      <SvgIcon class="w-[20px] h-[20px]" name="homeIcon" />
      <SvgIcon class="w-[20px] h-[20px] mx-[8px]" name="homeIconDivider" />
      <p class="text-[#344054] text-[14px] font-medium">数据处理</p>
    </div>
    <p class="text-[#101828] text-[30px] font-medium">数据处理</p>
    <p class="text-[#475467] text-[16px] font-light mt-[2px]">
      数据处理可支持用户使用不同的模型算子，针对大模型所用的数据进行处理，包括数据清洗、自动数据增强及分析等处理方式，用户可通过数据处理来获取更高质量的数据
    </p>
    <div class="mainOption mt-[32px] flex items-center justify-between">
      <el-form :inline="true" :model="form" label-width="auto" label-position="top">
        <el-form-item label="搜索处理任务" class="mr-[12px]">
          <el-input style="width: 330px" v-model="form.git_server_url"><template #prefix>
        <el-icon class="el-input__icon w-[20px] h-[20px]"><search /></el-icon>
      </template>
    </el-input>
        </el-form-item>
        <el-form-item label="任务分类">
          <el-select
            v-model="form.private_token"
            style="width: 330px"
            placeholder="全部分类"
          >
            <el-option :label="t('pages.option1')" value="strict" />
            <el-option :label="t('pages.option2')" value="moderate" />
            <el-option :label="t('pages.option3')" value="lenient" />
          </el-select>
        </el-form-item>
      </el-form>
      <el-button type="primary"  @click="goToNewTask('/addTask')">创建任务</el-button>
    </div>
    <div class="borderBox mt-[32px]">
      <div class="py-[20px] px-[24px]">
        <p class="text-[18px] text-[#101828] font-medium">任务列表</p>
      </div>
      <div class="flex flex-col">
        <el-table
          :data="tableData"
          class="rounded tableCont"
          :empty-text="t('common.noData')"
          header-cell-class-name="tableHeader"
        >
          <el-table-column prop="project_name" label="任务名称" />
          <el-table-column prop="repo_status_display_name" label="任务类型" />
          <el-table-column label="处理状态">
              <template #default="scope">
                <div class="statusBox flex items-center gap-1 px-[8px] py-[2px] statusBox1">
                  <SvgIcon name="check" class="w-[16px] h-[16px]" />
                  <span class="text-[12px]">已完成</span>
                </div>
              </template>
            </el-table-column>
          <el-table-column prop="repo_status_display_name" label="数据来源" />
          <el-table-column prop="repo_status_display_name" label="数据流向" />
          <el-table-column prop="repo_status_display_name" label="开始时间" />
          <el-table-column prop="token" :label="t('pages.tableHeader3')" width="150">
            <template #default="scope">
              <div class="settingsTableBtn flex items-center justify-end">
                <el-popconfirm
                  :title="`${t('common.ensure')}${t('common.delete')}?`"
                  :confirm-button-text="t('common.delete')"
                  :cancel-button-text="t('common.cancel')"
                  @confirm="handleDelete(scope.row)"
                >
                  <template #reference>
                    <el-button type="text" class="flex items-center justify-start cursor-pointer">{{ t('common.delete') }}
                    </el-button>
                  </template>
                </el-popconfirm>
                <el-button
                  class="flex items-center justify-start cursor-pointer"
                  type="text"
                  @click="goToNewTask('/dataflowInfo')"
                >
                详情
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n'

  const { t } = useI18n()

const form = ref({
  git_server_url: '',
  private_token: '',
});
const tableData = ref([
  {
    project_name: 'test',
    repo_status_display_name: 'test',
    token: 'test',
  },
]);

// const getOpsListFun = async () => {
//   const [data] = await getOpsList();
//   console.log('data===', data);
// };

// const getJobsListFun = async () => {
//   const [data] = await getJobsList();
//   console.log('data===', data);
// };

// const getJobsFun = async () => {
//   const [data] = await getJobs();
//   console.log('data===', data);
// };

const router = useRouter();

const goToNewTask = (path) => {
  router.push(path);
};

onMounted(() => {
  console.log('数据处理')
  // getOpsListFun()
  // getJobsListFun()
  // getJobs()
});
</script>
<style lang="scss" scoped>
.hoverChange {
  &:hover {
    border: 1px solid var(--Gray-300, #d0d5dd);
    background: var(--Gray-50, #f9fafb);
    color: #3250bd;
  }
  &:active {
    border: 1px solid var(--Gray-300, #d0d5dd);
    background: var(--Base-White, #fff);
    box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.05), 0px 0px 0px 4px rgba(152, 162, 179, 0.14);
    color: #3250bd;
  }
  &.delBtn {
    &:hover,
    &:active {
      color: #f87171;
    }
  }
}
:deep(.settingsTableBtn) {
  .el-button {
    padding: 0 !important;
    margin-left: 20px !important;
    font-size: 14px !important;
    color: #667085 !important;
    font-weight: 400 !important;
    &:hover {
      color: #3250bd !important;
    }
  }
}

// :deep(.el-form-item__label){
//   font-size: 14px;
//   color: #344054;
//   font-weight: 400;
// }
:deep(.tableCont) {
  .el-button--text {
    background: transparent !important;
  }
}

:deep(.el-form--inline){
  .el-form-item {
  margin-right: 12px;  
  }
}
.dataItemCont {
  border-radius: var(--spacing-lg, 12px);
  border: 1px solid var(--colors-gray-light-mode-200, #eaecf0);
  background: var(--Base-White, #fff);
  box-shadow: 0px 4px 8px -2px rgba(16, 24, 40, 0.1), 0px 2px 4px -2px rgba(16, 24, 40, 0.06);
}
.borderBox {
  border-radius: var(--spacing-lg, 12px);
border: var(--spacing-none, 1px) solid var(--colors-gray-light-mode-200, #EAECF0);
background: var(--Base-White, #FFF);
box-shadow: 0px 1px 3px 0px rgba(16, 24, 40, 0.10), 0px 1px 2px 0px rgba(16, 24, 40, 0.06);
overflow: hidden;
}
:deep(.el-table__header){
  background: var(--Gray-50, #F9FAFB);
}
:deep(.el-table) {
  .el-table__cell {
    padding: 16px 24px;
  }
}
:deep(.tableCont) {
  .el-button--text {
    border: none;
  }
  .el-table__cell {
    font-size: 14px;
    color: #475467;
    font-weight: 300;
  }
}
:deep(.tableHeader) {
  font-size: 12px !important;
  font-weight: normal !important;
  color: #475467;
  padding: 12px 24px !important;
  border-bottom: 1px solid var(--colors-gray-light-mode-200, #EAECF0);
background: var(--Gray-50, #F9FAFB) !important;
}
</style>
