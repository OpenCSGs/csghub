<template>
  <div
    class="w-full mt-8 mb-8 rounded-t-lg pt-9 xl:px-10 md:px-0 md:h-auto border border-[#EBEEF5]"
  >
    <div class="flex justify-between px-6 mb-5">
      <div class="text-[18px] leading-[28px]">{{ $t('billing.instanceBilling') }}</div>
      <div class="flex gap-3 items-center">
        <div>{{ $t('billing.total') }}：￥{{ (Math.abs(totalPrice)/100.0).toFixed(2) }}</div>
        <el-date-picker
          v-model="selectedMonth"
          @change="dateChange"
          type="month"
          placeholder="Pick"
          :disabled-date="disabledDate"
          style="width: 120px"
        />
        <div
          class="flex gap-1 border border-[#D0D5DD] rounded-[8px] py-1 px-2 cursor-pointer"
          @click="fetchDetails(1)"
        >
          <SvgIcon name="refresh" />{{ $t('billing.refresh') }}
        </div>
      </div>
    </div>
    <div>
      <el-table
        class="billing-table"
        header-row-class-name="billing-table-header-row"
        header-cell-class-name="billing-table-header-cell"
        row-class-name="billing-table-row"
        cell-class-name="billing-table-row-cell"
        :data="billings"
        stripe
        style="width: 100%"
      >
        <!-- instance ID -->
        <el-table-column
          :label="$t('billing.instanceID')"
          label-class-name="indent-3 text-[12px] justify-center font-[400] leading-[18px] text-[#475467]"
          align="center"
        >
          <template #default="scope">
            <div class="flex justify-center gap-[12px] items-center pl-3">
              <div class="flex flex-col">
                <div
                  class="text-[14px] font-[300] leading-[20px] text-[#475467]"
                  v-if="!!scope.row.instance_name"
                >
                  #{{ scope.row.instance_name }}
                </div>
              </div>
            </div>
          </template>
        </el-table-column>

        <!-- usage time -->
        <el-table-column
          :label="$t('billing.usageTime')"
          label-class-name="text-[12px] font-[400] leading-[18px] text-[#475467]"
          align="center"
        >
          <template #default="scope">
            <div class="text-[14px] font-[400] leading-[20px] text-[#475467]">
              {{ scope.row.consumption }}
            </div>
          </template>
        </el-table-column>

        <!-- cost -->
        <el-table-column
          :label="$t('billing.cost')"
          label-class-name="text-[12px] font-[400] leading-[18px] text-[#475467]"
          align="center"
        >
          <template #default="scope">
            <div class="text-[14px] font-[400] leading-[20px] text-[#475467]">
              {{ (Math.abs(scope.row.value)/100.0).toFixed(2) }}
            </div>
          </template>
        </el-table-column>

        <!-- created_at -->
        <el-table-column
          :label="$t('billing.createTime')"
          label-class-name="text-[12px] font-[400] leading-[18px] text-[#475467]"
          align="center"
        >
          <template #default="scope">
            <div class="text-[14px] font-[400] leading-[20px] text-[#475467]">
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
        :total="totalBillings"
      />
    </div>
  </div>
</template>

<script setup>
  import { ref, inject, onMounted, computed } from 'vue'
  import { ElMessage } from 'element-plus'
  import jwtFetch from '../../packs/jwtFetch'
  import { useCookies } from 'vue3-cookies'
  import {
    getCurrentTime,
    getFirstDayOfTime,
    formatDate,
    formatDateTime,
    isFutureDate,
    getLastDayOfMonthFromDateString
  } from '../../packs/datetimeUtils'
  import CsgPagination from '../shared/CsgPagination.vue'

  const props = defineProps({
    type: String,
    instanceName: String
  })

  const { cookies } = useCookies()
  const csghubServer = inject('csghubServer')
  const loginIdentity = cookies.get('login_identity')

  const perPage = ref(10)
  const currentPage = ref(1)
  const totalBillings = ref(0)
  const totalPrice = ref(0)
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

  const disabledDate = (date) => {
    return isFutureDate(date)
  }

  const dateChange = (e) => {
    const dateString = formatDate(e) + ' 00:00:00'
    startTime.value = dateString
    const lastDayOfMonth = getLastDayOfMonthFromDateString(dateString) + ' 23:59:59'
    endTime.value = lastDayOfMonth
    fetchDetails()
  }

  // scene = 10：model inference endpoint
  // scene = 11：space
  // scene = 12: model finetune
  // scene = 20：starship-ide
  const fetchDetails = async (childCurrent) => {
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

    const url = `${csghubServer}/api/v1/accounting/credit/${loginIdentity}/statements?${params.toString()}`
    const res = await jwtFetch(url)

    if (!res.ok) {
      const { msg } = await res.json()
      ElMessage({ message: msg, type: 'warning' })
    } else {
      const { data } = await res.json()
      billings.value = data.data
      totalBillings.value = data.total
      totalPrice.value = data.total_value
    }
  }

  onMounted(() => {
    const searchParams = new URLSearchParams(window.location.search)
    if (searchParams.get('time')) {
      selectedMonth.value = searchParams.get('time')
      dateChange(selectedMonth.value)
    }
    fetchDetails()
  })
</script>

<style scoped lang="less">
  :deep(.billing-table) {
    .el-table__empty-block {
      border-left: 1px solid #eaecf0;
      border-right: 1px solid #eaecf0;
    }
    .billing-table-header-row {
      .billing-table-header-cell {
        padding: 12px 24px;
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
