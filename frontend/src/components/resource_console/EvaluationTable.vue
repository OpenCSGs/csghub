<template>
  <div class="w-full">
    <el-table
      class="evaluation-table rounded-xl"
      header-row-class-name="evaluation-table-header-row"
      header-cell-class-name="evaluation-table-header-cell"
      row-class-name="evaluation-table-row"
      cell-class-name="evaluation-table-row-cell"
      :data="evaluations"
      stripe
      v-loading="loading"
      style="width: 100%"
      :empty-text="$t('all.noData')"
    >
      <el-table-column
        :label="$t('evaluation.list.evaluationName')"
        label-class-name="indent-3 text-sm font-normal leading-5 text-gray-600 truncate"
        width="110"
        show-overflow-tooltip
        align="left"
      >
        <template #default="scope">
          <div class="text-sm font-normal leading-5 text-gray-600">
            {{ scope.row.task_name }}
          </div>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('evaluation.list.modelName')"
        label-class-name="text-sm font-normal leading-5 text-gray-600"
        width="200"
        show-overflow-tooltip
        align="left"
      >
        <template #default="scope">
          <div
            class="text-sm font-normal leading-5 text-gray-600 truncate"
          >
            {{ scope.row.repo_ids[0] }}
          </div>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('evaluation.list.datasetNum')"
        label-class-name="text-sm font-normal leading-5 text-gray-600"
        width="120"
        align="left"
      >
        <template #default="scope">
          <div class="text-sm font-normal leading-5 text-gray-600">
            {{ scope.row.datasets ? scope.row.datasets.length : 0 }}
          </div>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('evaluation.list.dataset')"
        label-class-name="text-sm font-normal leading-5 text-gray-600"
        width="200"
        align="left"
      >
        <template #default="scope">
          <el-tooltip
            placement="top"
            :disabled="(scope.row.datasets || []).length <= 2"
          >
            <template #content>
              <ul
                class="list-item list-disc ml-3"
                v-for="dataset in (scope.row.datasets || [])"
                :key="dataset"
              >
                <li>{{ dataset }}</li>
              </ul>
            </template>

            <div class="text-sm font-normal leading-5 text-gray-600">
              <ul
                class="list-item list-disc ml-3"
                v-for="dataset in scope.row.datasets?.slice(0, 2)"
                :key="dataset"
              >
                <li class="truncate">{{ dataset }}</li>
              </ul>
            </div>
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('evaluation.list.creationTime')"
        label-class-name="text-sm font-normal leading-5 text-gray-600"
        width="150"
        align="left"
      >
        <template #default="scope">
          <div class="text-sm font-normal leading-5 text-gray-600">
            {{ formatDate(scope.row.submit_time) }}
          </div>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('evaluation.list.status')"
        label-class-name="text-sm font-normal leading-5 text-gray-600"
        width="130"
        align="left"
      >
        <template #default="scope">
          <div class="w-fit">
            <component
              :is="getStatusComponent(scope.row.status)"
              :statusName="
                locale === 'en'
                  ? scope.row.status
                  : statusMapping[scope.row.status]
              "
            />
          </div>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('evaluation.list.desc')"
        label-class-name="text-sm font-normal leading-5 text-gray-600"
        align="left"
        width="150"
        show-overflow-tooltip
      >
        <template #default="scope">
          <div
            class="text-sm font-normal leading-5 text-gray-600 truncate"
          >
            {{ scope.row.task_desc }}
          </div>
        </template>
      </el-table-column>

      <el-table-column
        width="220"
        align="right"
        :label="$t('evaluation.list.action')"
        fixed="right"
      >
        <template #default="scope">
          <div class="flex gap-4 justify-end">
            <a
              v-if="scope.row.download_url"
              download
              :href="scope.row.download_url"
              class="flex gap-4 text-brand-700 cursor-pointer hover:text-brand-800"
              >{{ $t('evaluation.list.download') }}</a
            >
            <a
              @click="detailEvaluation(scope.row)"
              :class="{
                'pointer-events-none !text-brand-100': !scope.row.result_url
              }"
              class="flex gap-4 text-brand-700 cursor-pointer hover:text-brand-800"
              >{{ $t('evaluation.list.detail') }}</a
            >
            <el-popconfirm
              popper-class="evaluation-popconfirm"
              :title="`${$t('evaluation.list.deleteConfirm')}?`"
              @confirm="deleteEvaluation(scope.row)"
            >
              <template #reference>
                <a class="text-error-600 cursor-pointer hover:text-error-700">{{
                  $t('evaluation.list.delete')
                }}</a>
              </template>
            </el-popconfirm>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="mt-3 flex justify-center">
      <CsgPagination
        :perPage="perPage"
        :currentPage="currentPage"
        @currentChange="fetchEvaluations"
        :total="total"
      />
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted, watch } from 'vue'
  import { formatDate } from '../../packs/datetimeUtils'
  import useFetchApi from '../../packs/useFetchApi'
  import useUserStore from '../../stores/UserStore.js'
  import BuildStatus from '../application_spaces/BuildStatus.vue'
  import WarningStatus from '../application_spaces/WarningStatus.vue'
  import ErrorStatus from '../application_spaces/ErrorStatus.vue'
  import SuccessStatus from '../application_spaces/SuccessStatus.vue'
  import { useI18n } from 'vue-i18n'
  import { ElMessage } from 'element-plus'

  const { locale } = useI18n()

  const userStore = useUserStore()
  const evaluations = ref([])
  const currentPage = ref(1)
  const perPage = ref(10)
  const total = ref(0)
  const loading = ref(false)

  const statusMapping = {
    Succeeded: '已完成',
    Pending: '排队中',
    Failed: '失败',
    Running: '测评中'
  }

  const statusComponents = {
    Succeeded: SuccessStatus,
    Pending: WarningStatus,
    Failed: ErrorStatus,
    Running: BuildStatus
  }

  const getStatusComponent = (status) => {
    return statusComponents[status]
  }

  const fetchEvaluations = async () => {
    loading.value = true
    const { data, error } = await useFetchApi(
      `/user/${userStore.username}/evaluations`
    ).json()
    if (error.value) {
      ElMessage({ message: error.value.msg, type: 'warning' })
    } else {
      const body = data.value
      evaluations.value = body.data
      total.value = body.total
    }
    loading.value = false
  }

  const deleteEvaluation = async (evaluation) => {
    const { error } = await useFetchApi(`/evaluations/${evaluation.id}`)
      .delete()
      .json()
    if (error.value) {
      ElMessage({ message: error.value.msg, type: 'warning' })
    } else {
      fetchEvaluations()
    }
  }

  const detailEvaluation = (evaluation) => {
    if (evaluation.result_url) {
      location.href = `/evaluations/${evaluation.id}`
    }
  }

  watch(
    () => userStore.initialized,
    () => {
      fetchEvaluations()
    }
  )

  onMounted(() => {
    if (userStore.initialized) {
      fetchEvaluations()
    }
  })
</script>

<style lang="less">
  .evaluation-popconfirm {
    .el-button--primary {
      background-color: var(--Brand-600);
      border: none;
    }
  }

  .evaluation-table .el-popper {
    max-width: 320px;
  }
</style>

<style scoped lang="less">
  :deep(.evaluation-table) {
    .el-table__empty-block {
      border-left: 1px solid #eaecf0;
      border-right: 1px solid #eaecf0;
      border-bottom-left-radius: 12px;
      border-bottom-right-radius: 12px;
    }
    .evaluation-table-header-row {
      .evaluation-table-header-cell {
        padding: 12px 0;
        font-size: 12px;
        font-weight: 400;
        color: #475467 !important;
        &:nth-child(1) {
          border-left: 1px solid #eaecf0;
          border-top-left-radius: 12px;

          .cell {
            padding-left: 12px;
          }
        }
        &:nth-last-child(1) {
          border-right: 1px solid #eaecf0;
          border-top-right-radius: 12px;
        }
        .cell {
          line-height: 18px;
          padding: 0 24px;
        }
        border-top: 1px solid #eaecf0;
        background-color: #f9fafb;
      }
    }
    .evaluation-table-row {
      .evaluation-table-row-cell {
        &:nth-child(1) {
          border-left: 1px solid #eaecf0;
        }
        &:nth-last-child(1) {
          border-right: 1px solid #eaecf0;
        }
        .cell {
          line-height: 40px;
          padding: 0 24px;
        }
      }
      &:last-child {
        .evaluation-table-row-cell {
          &:first-child {
            border-bottom-left-radius: 12px;
          }
          &:last-child {
            border-bottom-right-radius: 12px;
          }
        }
      }
    }
  }
</style>
