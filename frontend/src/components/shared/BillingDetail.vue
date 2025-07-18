<template>
  <div
    class="w-full mt-8 mb-8 rounded-t-lg pt-9 xl:px-10 md:px-0 md:h-auto border border-gray-200">
    <div class="flex justify-between px-6 mb-5">
      <div class="text-lg leading-[28px]">
        {{ $t('billing.instanceBilling') }}
      </div>
      <div class="flex gap-3 items-center">
        <el-date-picker
          v-model="selectedMonth"
          @change="dateChange"
          type="month"
          placeholder="Pick"
          :disabled-date="disabledDate"
          style="width: 120px" />
        <el-button
          :loading="billingLoading"
          class="flex gap-1 border border-gray-300 rounded-md py-1 px-2 cursor-pointer"
          @click="fetchDetails(1)">
          {{ $t('billing.refresh') }}
        </el-button>
      </div>
    </div>
    <div>
      <el-table
        v-loading="billingLoading"
        class="billing-table"
        header-row-class-name="billing-table-header-row"
        header-cell-class-name="billing-table-header-cell"
        row-class-name="billing-table-row"
        cell-class-name="billing-table-row-cell"
        :data="billings"
        :empty-text="$t('all.noData')"
        stripe
        style="width: 100%">
        <!-- instance ID -->
        <el-table-column
          :label="$t('billing.instanceID')"
          label-class-name="indent-3 text-xs justify-center font-[400] leading-[18px] text-gray-600"
          align="center">
          <template #default="scope">
            <div class="flex justify-center gap-[12px] items-center pl-3">
              <div class="flex flex-col">
                <div
                  class="text-sm font-[300] leading-[20px] text-gray-600"
                  v-if="!!scope.row.customer_id">
                  #{{ scope.row.customer_id }}
                </div>
              </div>
            </div>
          </template>
        </el-table-column>

        <!-- usage time -->
        <el-table-column
          :label="$t('billing.usageTime')"
          label-class-name="text-xs font-[400] leading-[18px] text-gray-600"
          align="center">
          <template #default="scope">
            <div class="text-sm font-[400] leading-[20px] text-gray-600">
              {{ scope.row.value }}
            </div>
          </template>
        </el-table-column>

        <!-- created_at -->
        <el-table-column
          :label="$t('billing.createTime')"
          label-class-name="text-xs font-[400] leading-[18px] text-gray-600"
          align="center">
          <template #default="scope">
            <div class="text-sm font-[400] leading-[20px] text-gray-600">
              {{ formatDateTime(scope.row.created_at) }}
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="mt-[12px] mb-[16px] flex justify-center">
      <CsgPagination
        :perPage="perPage"
        :currentPage="currentPage"
        @currentChange="fetchDetails"
        :total="totalBillings" />
    </div>
  </div>
</template>

<script setup>
  import { ref, computed, watch, onMounted } from 'vue'
  import { ElMessage } from 'element-plus'
  import useFetchApi from '../../packs/useFetchApi'
  import {
    getCurrentTime,
    getFirstDayOfTime,
    formatDate,
    formatDateTime,
    isFutureDate
  } from '../../packs/datetimeUtils'
  import CsgPagination from '../shared/CsgPagination.vue'
  import useUserStore from '../../stores/UserStore'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()
  const userStore = useUserStore()

  const props = defineProps({
    type: String,
    instanceName: String
  })

  const billingLoading = ref(false)
  const perPage = ref(10)
  const currentPage = ref(1)
  const totalBillings = ref(0)
  const billings = ref([])
  const selectedMonth = ref(getFirstDayOfTime())
  const startTime = ref(getFirstDayOfTime())
  const endTime = ref(getCurrentTime())
  const scene = computed(() => {
    let tempScene = 10
    switch (props.type) {
      case 'inference':
        tempScene = 10
        break
      case 'space':
        tempScene = 11
        break
      case 'finetune':
        tempScene = 12
        break
      case 'starship':
        tempScene = 20
        break
      default:
        tempScene = 10
    }
    return tempScene
  })

  const canFetchBillingDetail = computed(() => {
    return userStore.uuid && props.instanceName
  })

  watch(canFetchBillingDetail, (newValue) => {
    if (newValue) {
      fetchDetails()
    }
  })

  const disabledDate = (date) => {
    return isFutureDate(date)
  }

  const dateChange = (e) => {
    const dateString = formatDate(e) + ' 00:00:00'
    startTime.value = dateString
    const lastDayOfMonth =
      getLastDayOfMonthFromDateString(dateString) + ' 23:59:59'
    endTime.value = lastDayOfMonth
    fetchDetails()
  }

  const getLastDayOfMonthFromDateString = (dateString) => {
    const parts = dateString.split('-')
    const year = parseInt(parts[0], 10)
    const month = parseInt(parts[1], 10) - 1 // 月份在 Date 对象中是从 0 到 11 表示的

    const lastDay = getLastDayOfMonth(year, month)
    const formattedMonth = (month + 1).toString().padStart(2, '0')

    return `${year}-${formattedMonth}-${lastDay}`
  }

  const getLastDayOfMonth = (year, month) => {
    const nextMonthFirstDay = new Date(year, month + 1, 1)
    const lastDay = new Date(nextMonthFirstDay - 86400000).getDate() // 获取月底的日期
    return lastDay
  }

  // scene = 10：model inference endpoint
  // scene = 11：space
  // scene = 12: model finetune
  // scene = 20：starship-ide
  const fetchDetails = async (childCurrent) => {
    if (!userStore.uuid) return

    billingLoading.value = true
    if (childCurrent) {
      currentPage.value = childCurrent
    }
    const params = new URLSearchParams()
    params.append('per', perPage.value)
    params.append('page', currentPage.value)
    params.append('start_time', startTime.value)
    params.append('end_time', endTime.value)
    params.append('scene', scene.value)
    params.append('instance_name', props.instanceName)

    const url = `/accounting/metering/${
      userStore.uuid
    }/statements?${params.toString()}`

    const { data, error } = await useFetchApi(url).json()

    if (error.value) {
      ElMessage.warning(error.value.msg || t('finetune.settings.fetchBillingError'))
    } else {
      const body = data.value
      billings.value = body.data.data
      totalBillings.value = body.data.total
    }
    billingLoading.value = false
  }

  onMounted(() => {
    if(canFetchBillingDetail.value) {
      fetchDetails()
    }
  })
</script>

<style scoped lang="less">
  :deep(.billing-table) {
    .el-table__empty-block {
      border-left: 1px solid #eaecf0;
      border-right: 1px solid #eaecf0;
      border-bottom-left-radius: 12px;
      border-bottom-right-radius: 12px;
    }
    .billing-table-header-row {
      .billing-table-header-cell {
        padding: 12px 0px;
        font-size: 12px;
        font-weight: 400;
        color: var(--gray-600);
        .cell {
          line-height: 18px;
        }
        border-top: 1px solid #eaecf0;
        background-color: #f9fafb;
      }
    }
    .billing-table-row {
      .billing-table-row-cell {
        &:nth-child(1) {
          border-left: 1px solid #eaecf0;
        }
        &:nth-last-child(1) {
          border-right: 1px solid #eaecf0;
        }
        .cell {
          line-height: 40px;
        }
      }
    }
  }
</style>
