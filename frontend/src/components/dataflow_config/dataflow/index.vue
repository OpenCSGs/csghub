<template>
  <div class="text-left w-full h-full pl-8 py-8 overflow-auto bg-white">
    <div class="headerMenu flex items-center justify-start mb-[20px]">
      <SvgIcon
        class="w-5 h-5"
        name="dataflow_homeIcon"
      />
      <SvgIcon
        class="w-5 h-5 mx-2"
        name="dataflow_homeIcon_divider"
      />
      <p class="text-brand-700 text-sm font-medium">
        {{ t('dataPipelines.dataProcessing') }}
      </p>
    </div>
    <p class="text-gray-900 text-3xl font-medium">
      {{ t('dataPipelines.dataProcessing') }}
    </p>
    <p class="text-gray-600 text-md font-light mt-[2px]">
      {{ t('dataPipelines.dataProcessingDescription') }}
    </p>
    <div class="mainOption mt-8">
      <p class="text-gray-700 text-sm mb-1.5">
        {{ t('dataPipelines.searchProcessing') }}
      </p>
      <div class="flex items-center justify-between gap-3 xs:block">
        <el-input
          style="width: 100%"
          v-model="form.searchStr"
          @keyup.enter="getDataFlowListFun"
          @clear="getDataFlowListFun"
          :placeholder="`${t('dataPipelines.toInput')}${t(
            'dataPipelines.taskName'
          )}`"
          clearable
          ><template #prefix>
            <el-icon class="el-input__icon w-5 h-5"
              ><search
            /></el-icon>
          </template>
        </el-input>
        <CsgButton
          class="btn btn-primary btn-sm whitespace-nowrap"
          @click="goToNewTask('/datapipelines/newTask')"
          :name="t('dataPipelines.createTask')"
          :icon="true"
        />
      </div>
    </div>
    <div class="borderBox mt-8">
      <div class="py-5 px-6">
        <p class="text-lg text-gray-900 font-medium">
          {{ t('dataPipelines.taskList') }}
        </p>
      </div>
      <div class="flex flex-col">
        <el-table
          :data="tableData"
          class="rounded tableCont"
          :empty-text="t('dataPipelines.noData')"
          header-cell-class-name="tableHeader"
          v-loading="tableLoading"
        >
          <el-table-column
            prop="job_name"
            :label="t('dataPipelines.taskName')"
            min-width="270"
          />
          <el-table-column
            prop="job_type"
            :label="t('dataPipelines.taskType')"
            min-width="150"
          >
            <template #default="scope">
              {{`${scope.row.job_source}/${scope.row.job_source=='pipeline'?(
                scope.row.job_type
                  ? t(`dataPipelines.${scope.row.job_type}`)
                  : '-'):scope.row.job_type
              }`}}
            </template>
          </el-table-column>
          <el-table-column
            :label="t('dataPipelines.processingStatus')"
            min-width="180"
          >
            <template #default="scope">
              <div
                v-if="scope.row.status"
                class="statusBox flex items-center gap-1 px-2 py-1"
                :class="scope.row.status"
              >
                <SvgIcon
                  :name="scope.row.status"
                  class="w-3 h-3"
                />
                <span class="text-sm">{{
                  scope.row.status
                    ? t(`dataPipelines.${scope.row.status}`)
                    : '-'
                }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="data_source"
            :label="t('dataPipelines.dataSource')"
            min-width="200"
          >
            <template #default="scope">
              <span class="text-brand-600 hover:underline cursor-pointer" @click="toDatasetPage(scope.row.repo_id,scope.row.branch)">{{
                `${scope.row.repo_id || '-'}>${scope.row.branch || '-'}`
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="data_target"
            :label="t('dataPipelines.dataFlow')"
            min-width="200"
          >
            <template #default="scope">
              <span class="text-brand-600 hover:underline cursor-pointer" @click="toDatasetPage(scope.row.export_repo_id,scope.row.export_branch_name)">{{
                `${scope.row.export_repo_id || '-'}>${
                  scope.row.export_branch_name || '-'
                }`
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="date_posted"
            :label="t('dataPipelines.startTime')"
            min-width="200"
          >
            <template #default="scope">
              <span>{{
                scope.row.date_posted
                  ? convertUtcToLocalTime(scope.row.date_posted)
                  : '-'
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="token"
            :label="t('dataPipelines.operations')"
            min-width="180"
            fixed="right"
          >
            <template #default="scope">
              <div class="settingsTableBtn flex items-center justify-start">
                <el-popconfirm
                  :title="`${t('dataPipelines.deleteConfirm')}?`"
                  :confirm-button-text="t('dataPipelines.confirm')"
                  :cancel-button-text="t('dataPipelines.cancel')"
                  width="220px"
                  @confirm="handleDelete(scope.row.job_id)"
                >
                  <template #reference>
                    <el-button
                      type="text"
                      class="flex items-center justify-start cursor-pointer"
                      >{{ t('dataPipelines.delete') }}
                    </el-button>
                  </template>
                </el-popconfirm>
                <el-button
                  class="flex items-center justify-start cursor-pointer"
                  type="text"
                  @click="
                    goToNewTask(
                      `/datapipelines/dataflowInfo?id=${scope.row.job_id}&type=${scope.row.job_source}`
                    )
                  "
                  >{{ scope.row.job_source=='pipeline'?t('dataPipelines.details'):t('dataPipelines.log') }}
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
  import { useRouter } from 'vue-router'
  import { ref, onMounted } from 'vue'
  import { ElMessage } from 'element-plus'
  import useFetchApi from '../../../packs/useFetchApi'
  import { convertUtcToLocalTime } from '../../../packs/datetimeUtils'
  import { useI18n } from 'vue-i18n'

  const { t, locale } = useI18n()
  const tableLoading = ref(false)      

  const form = ref({
    searchStr: ''
  })
  const tableData = ref([])

  const getDataFlowListFun = async () => {
    const url = `/dataflow/jobs?query=${form.value.searchStr}`
    tableLoading.value = true

    const { data } = await useFetchApi(url).get().json()

    if (data.value) {
      tableData.value = data.value
    }
    tableLoading.value = false
  }
  const handleDelete = async (id) => {
    const url = `/dataflow/jobs/${id}`

    const { data, error } = await useFetchApi(url).delete().json()

    if (error.value) {
      ElMessage({
        message: `操作失败: ${error.value.msg}`,
        type: 'error'
      })
    } else {
      ElMessage({
        message: '删除成功',
        type: 'success'
      })
      getDataFlowListFun()
    }
  }
  const toDatasetPage = (path,branch) => {
    if (path) {
      window.location.href=`/datasets/${path}?tab=files&branch=${branch || 'main'}`
    }
  }

  const router = useRouter()

  const goToNewTask = (path) => {
    router.push(path)
  }

  onMounted(() => {
    getDataFlowListFun()
  })
</script>
<style lang="less" scoped>
  :deep(.settingsTableBtn) {
    .el-button {
      padding: 0 !important;
      margin-right: 20px !important;
      font-size: 14px !important;
      color: #667085 !important;
      font-weight: 400 !important;
      &:hover {
        color: #3250bd !important;
      }
    }
  }

  :deep(.tableCont) {
    .el-button--text {
      background: transparent !important;
    }
  }

  :deep(.el-form--inline) {
    .el-form-item {
      margin-right: 12px;
    }
  }
  .borderBox {
    border-radius: var(--spacing-lg, 12px);
    border: var(--spacing-none, 1px) solid
      var(--colors-gray-light-mode-200, #eaecf0);
    background: var(--Base-White, #fff);
    overflow: hidden;
  }
  :deep(.el-table__header) {
    background: var(--Gray-50, #f9fafb);
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
      color: #101828;
      font-weight: 400;
    }
  }
  :deep(.tableHeader) {
    font-size: 12px !important;
    font-weight: normal !important;
    color: #475467;
    padding: 12px 24px !important;
    border-bottom: 1px solid var(--colors-gray-light-mode-200, #eaecf0);
    background: var(--Gray-50, #f9fafb) !important;
  }
</style>
