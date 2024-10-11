<template>
  <div class="text-left h-full p-[32px] overflow-auto bg-[#FFF]">
    <div class="headerMenu flex items-center justify-start mb-[20px]">
      <SvgIcon class="w-[20px] h-[20px]" name="homeIcon" />
      <SvgIcon class="w-[20px] h-[20px] mx-[8px]" name="homeIconDivider" />
      <p class="text-[#344054] text-[14px] font-medium">算法模板</p>
    </div>
    <p class="text-[#101828] text-[30px] font-medium">算法模板</p>
    <p class="text-[#475467] text-[16px] font-light mt-[2px]">
      算法模版可支持用户使用多种不同的模型算子组成工作流，完成数据清洗、自动数据增强及分析等工作。
    </p>
    <div class="mainOption mt-[32px] flex items-center justify-between">
      <el-form :inline="true" :model="form" label-width="auto" label-position="top">
        <el-form-item label="搜索任务模板" class="mr-[12px]">
          <el-input style="width: 330px" v-model="form.git_server_url"><template #prefix>
        <el-icon class="el-input__icon w-[20px] h-[20px]"><search /></el-icon>
      </template>
    </el-input>
        </el-form-item>
        <el-form-item label="任务分类">
          <el-select
            v-model="form.private_token"
            style="width: 330px"
            :placeholder="t('common.select')"
          >
            <el-option :label="t('pages.option1')" value="strict" />
            <el-option :label="t('pages.option2')" value="moderate" />
            <el-option :label="t('pages.option3')" value="lenient" />
          </el-select>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="toNewPage('add')">创建模板</el-button>
    </div>
    <div class="grid grid-cols-3 items-start justify-between mt-[24px] gap-[20px]">
      <div class="dataItemCont p-[16px]">
        <div class="flex items-center justify-start gap-[8px] mb-[8px]">
          <img src="@/assets/image/Avatar.png" class="w-[24px] h-[24px] rounded-full" />
          <p class="text-[#101828] text-[16px] font-medium">数据清洗-通用</p>
        </div>
        <p class="text-[#475467] text-[14px] font-light overflow-hidden whitespace-nowrap overflow-ellipsis">通过去重、去敏等多种算子，清洗数据，使数据满足使用需求通过去重、去敏等多种算子，清洗数据，使数据满足使用需求通过去重、去敏等多种算子，清洗数据，使数据满足使用需求</p>
        <div class="flex items-center justify-between mt-[26px]">
          <span class="text-[#475467] text-[14px] font-normal">数据清洗</span>
          <div class="flex items-center justify-end gap-[12px]">
            <span class="text-[#475467] text-[14px] font-medium hover:text-[#17308F] cursor-pointer" @click="toNewPage('add')">创建</span>
            <span class="text-[#475467] text-[14px] font-medium hover:text-[#17308F] cursor-pointer" @click="goToNewTask">使用</span>
          </div>
        </div>
      </div>
      <div class="dataItemCont p-[16px]">
        <div class="flex items-center justify-start gap-[8px] mb-[8px]">
          <img src="@/assets/image/Avatar.png" class="w-[24px] h-[24px] rounded-full" />
          <p class="text-[#101828] text-[16px] font-medium">数据清洗-通用</p>
        </div>
        <p class="text-[#475467] text-[14px] font-light overflow-hidden whitespace-nowrap overflow-ellipsis">通过去重、去敏等多种算子，清洗数据，使数据满足使用需求通过去重、去敏等多种算子，清洗数据，使数据满足使用需求通过去重、去敏等多种算子，清洗数据，使数据满足使用需求</p>
        <div class="flex items-center justify-between mt-[26px]">
          <span class="text-[#475467] text-[14px] font-normal">数据清洗</span>
          <div class="flex items-center justify-end gap-[12px]">
            <span class="text-[#475467] text-[14px] font-medium hover:text-[#17308F] cursor-pointer" @click="toNewPage('add')">创建</span>
            <span class="text-[#475467] text-[14px] font-medium hover:text-[#17308F] cursor-pointer" @click="goToNewTask">使用</span>
          </div>
        </div>
      </div>
      <div class="dataItemCont p-[16px]">
        <div class="flex items-center justify-start gap-[8px] mb-[8px]">
          <img src="@/assets/image/Avatar.png" class="w-[24px] h-[24px] rounded-full" />
          <p class="text-[#101828] text-[16px] font-medium">数据清洗-通用</p>
        </div>
        <p class="text-[#475467] text-[14px] font-light overflow-hidden whitespace-nowrap overflow-ellipsis">通过去重、去敏等多种算子，清洗数据，使数据满足使用需求通过去重、去敏等多种算子，清洗数据，使数据满足使用需求通过去重、去敏等多种算子，清洗数据，使数据满足使用需求</p>
        <div class="flex items-center justify-between mt-[26px]">
          <span class="text-[#475467] text-[14px] font-normal">数据清洗</span>
          <div class="flex items-center justify-end gap-[12px]">
            <span class="text-[#475467] text-[14px] font-medium hover:text-[#17308F] cursor-pointer" @click="toNewPage('add')">创建</span>
            <span class="text-[#475467] text-[14px] font-medium hover:text-[#17308F] cursor-pointer" @click="toNewPage('edit')">编辑</span>
            <span class="text-[#475467] text-[14px] font-medium hover:text-[#17308F] cursor-pointer" @click="goToNewTask">使用</span>
          </div>
        </div>
      </div>
      <div class="dataItemCont p-[16px]">
        <div class="flex items-center justify-start gap-[8px] mb-[8px]">
          <img src="@/assets/image/Avatar.png" class="w-[24px] h-[24px] rounded-full" />
          <p class="text-[#101828] text-[16px] font-medium">数据清洗-通用</p>
        </div>
        <p class="text-[#475467] text-[14px] font-light overflow-hidden whitespace-nowrap overflow-ellipsis">通过去重、去敏等多种算子，清洗数据，使数据满足使用需求通过去重、去敏等多种算子，清洗数据，使数据满足使用需求通过去重、去敏等多种算子，清洗数据，使数据满足使用需求</p>
        <div class="flex items-center justify-between mt-[26px]">
          <span class="text-[#475467] text-[14px] font-normal">数据清洗</span>
          <div class="flex items-center justify-end gap-[12px]">
            <span class="text-[#475467] text-[14px] font-medium hover:text-[#17308F] cursor-pointer" @click="toNewPage('add')">创建</span>
            <span class="text-[#475467] text-[14px] font-medium hover:text-[#17308F] cursor-pointer" @click="toNewPage('edit')">编辑</span>
            <span class="text-[#475467] text-[14px] font-medium hover:text-[#17308F] cursor-pointer" @click="goToNewTask">使用</span>
          </div>
        </div>
      </div>
      <div class="dataItemCont p-[16px]">
        <div class="flex items-center justify-start gap-[8px] mb-[8px]">
          <img src="@/assets/image/Avatar.png" class="w-[24px] h-[24px] rounded-full" />
          <p class="text-[#101828] text-[16px] font-medium">数据清洗-通用</p>
        </div>
        <p class="text-[#475467] text-[14px] font-light overflow-hidden whitespace-nowrap overflow-ellipsis">通过去重、去敏等多种算子，清洗数据，使数据满足使用需求通过去重、去敏等多种算子，清洗数据，使数据满足使用需求通过去重、去敏等多种算子，清洗数据，使数据满足使用需求</p>
        <div class="flex items-center justify-between mt-[26px]">
          <span class="text-[#475467] text-[14px] font-normal">数据清洗</span>
          <div class="flex items-center justify-end gap-[12px]">
            <span class="text-[#475467] text-[14px] font-medium hover:text-[#17308F] cursor-pointer" @click="toNewPage('add')">创建</span>
            <span class="text-[#475467] text-[14px] font-medium hover:text-[#17308F] cursor-pointer" @click="toNewPage('edit')">编辑</span>
            <span class="text-[#475467] text-[14px] font-medium hover:text-[#17308F] cursor-pointer" @click="goToNewTask">使用</span>
          </div>
        </div>
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

const toNewPage = (type) => {
  router.push({ path: '/newTemplate', query: { type } });
};
const goToNewTask = () => {
  router.push('/addTask');
};

const router = useRouter();

onMounted(() => {
  console.log('算法模板')
});
</script>
<style lang="scss" scoped>
:deep(.tableHeader) {
  font-size: 14px;
  font-style: normal;
  font-weight: 600 !important;
  color: #344054;
  padding: 8px 0 !important;
}
:deep(.drawerCont) {
  width: 44% !important;
  text-align: left;
  .el-drawer__header {
    display: block;
    margin-bottom: 0;
  }
  .el-drawer__body {
    overflow-x: hidden !important;
    padding-top: 20px;
  }
}
:deep(.tableCont) {
  .el-button--text {
    border: none;
  }
  .el-table__cell {
    font-size: 14px;
    color: #344054;
    font-weight: 400;
  }
}
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
:deep(.el-table) {
  .el-table__cell {
    padding: 12px 0;
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
border: 1px solid var(--colors-gray-light-mode-200, #EAECF0);
background: var(--Base-White, #FFF);
box-shadow: 0px 4px 8px -2px rgba(16, 24, 40, 0.10), 0px 2px 4px -2px rgba(16, 24, 40, 0.06);
}
</style>
