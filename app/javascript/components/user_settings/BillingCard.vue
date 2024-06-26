<template>
  <div class="p-[12px] rounded-[8px] mt-[16px]">
    <div class="flex justify-between items-center mb-8">
      <div class="text-[30px] leading-[38px]">
        {{ $t('billing.title') }}
      </div>
      <el-date-picker
        v-model="value2"
        @change="dateChange"
        type="month"
        placeholder="Pick"
        style="width: 120px"
      />
    </div>
    <div class="flex flex-col gap-6 mb-8">
      <div
        class="flex flex-col w-[320px] rounded-lg p-6 border border-[#EAECF0] gap-6 text-[16px] leading-[24px]"
      >
        <div class="flex gap-4 items-center">
          <div class="bg-[#3250BD] p-3 rounded-lg">
            <SvgIcon name="billing_wallet" />
          </div>
          {{ $t('billing.balance') }}
        </div>
        <div class="text-[36px] leading-[44px]">¥ {{ balance }}</div>
      </div>
    </div>
    <div class="flex justify-between mb-4">
      <div class="flex gap-2 text-[20px] leading-[30px] text-[#344054]">
        <SvgIcon name="spaces" />
        {{ $t('spaces.title') }}
      </div>
      <div class="text-[14px] leading-[20px] text-[#475467]">
        {{ $t('billing.total') }}：¥ 120.00
      </div>
    </div>
    <div class="w-full mb-[37px]">
      <el-table
        class="billing-table"
        header-row-class-name="billing-table-header-row"
        header-cell-class-name="billing-table-header-cell"
        row-class-name="billing-table-row"
        cell-class-name="billing-table-row-cell"
        :data="spaceBillings"
        stripe
        v-loading="loading"
        style="width: 100%"
      >
        <el-table-column
          :label="$t('billing.instanceID')"
          label-class-name="indent-3 text-[12px] font-[400] leading-[18px] text-[#475467]"
        >
          <template #default="scope">
            <div class="flex gap-[12px] items-center pl-3">
              <div class="flex flex-col">
                <div
                  class="text-[14px] font-[300] leading-[20px] text-[#475467]"
                  v-if="!!scope.row.name"
                >
                  @{{ scope.row.instance_name }}
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('billing.createTime')"
          label-class-name="text-[12px] font-[400] leading-[18px] text-[#475467]"
        >
          <template #default="scope">
            <div class="text-[14px] font-[400] leading-[20px] text-[#475467]">
              {{ formatDate(scope.row.created_at) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('billing.usageTime')"
          label-class-name="text-[12px] font-[400] leading-[18px] text-[#475467]"
        >
          <template #default="scope">
            <div class="text-[14px] font-[400] leading-[20px] text-[#475467]">
              {{ scope.row.role }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('billing.cost')"
          label-class-name="text-[12px] font-[400] leading-[18px] text-[#475467]"
        >
          <template #default="scope">
            <div class="text-[14px] font-[400] leading-[20px] text-[#475467]">
              {{ scope.row.consumption }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('billing.status')"
          label-class-name="text-[12px] font-[400] leading-[18px] text-[#475467]"
        >
          <template #default="scope">
            <div class="text-[14px] font-[400] leading-[20px] text-[#475467]">
              {{ scope.row.status }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          v-if="admin"
          width="100"
          align="center"
          fixed="right"
        >
          <template #default="scope">
            <div class="flex gap-4 justify-end pr-4">{{ $t('billing.details') }}</div>
          </template>
        </el-table-column>
      </el-table>
      <div class="mt-[12px] mb-[16px] flex justify-center">
        <CsgPagination
          :perPage="perPage"
          :currentPage="currentPage"
          @currentChange="loadMoreBillings"
          :total="totalCommits"
        />
      </div>
    </div>
    <div class="flex justify-between mb-4">
      <div class="flex gap-2 text-[20px] leading-[30px] text-[#344054]">
        <SvgIcon name="spaces" />
        {{ $t('billing.inference') }}
      </div>
      <div class="text-[14px] leading-[20px] text-[#475467]">
        {{ $t('billing.total') }}：¥ 120.00
      </div>
    </div>
    <div class="w-full">
      <el-table
        class="billing-table"
        header-row-class-name="billing-table-header-row"
        header-cell-class-name="billing-table-header-cell"
        row-class-name="billing-table-row"
        cell-class-name="billing-table-row-cell"
        :data="spaceBillings"
        stripe
        v-loading="loading"
        style="width: 100%"
      >
        <el-table-column
          :label="$t('billing.instanceID')"
          label-class-name="indent-3 text-[12px] font-[400] leading-[18px] text-[#475467]"
        >
          <template #default="scope">
            <div class="flex gap-[12px] items-center pl-3">
              <div class="flex flex-col">
                <div
                  class="text-[14px] font-[300] leading-[20px] text-[#475467]"
                  v-if="!!scope.row.name"
                >
                  @{{ scope.row.name }}
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('billing.createTime')"
          label-class-name="text-[12px] font-[400] leading-[18px] text-[#475467]"
        >
          <template #default="scope">
            <div class="text-[14px] font-[400] leading-[20px] text-[#475467]">
              {{ formatDate(scope.row.last_login_at) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('billing.usageTime')"
          label-class-name="text-[12px] font-[400] leading-[18px] text-[#475467]"
        >
          <template #default="scope">
            <div class="text-[14px] font-[400] leading-[20px] text-[#475467]">
              {{ scope.row.role }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('billing.cost')"
          label-class-name="text-[12px] font-[400] leading-[18px] text-[#475467]"
        >
          <template #default="scope">
            <div class="text-[14px] font-[400] leading-[20px] text-[#475467]">
              {{ scope.row.role }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('billing.status')"
          label-class-name="text-[12px] font-[400] leading-[18px] text-[#475467]"
        >
          <template #default="scope">
            <div class="text-[14px] font-[400] leading-[20px] text-[#475467]">
              {{ scope.row.status }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          v-if="admin"
          width="100"
          align="center"
          fixed="right"
        >
          <template #default="scope">
            <div class="flex gap-4 justify-end pr-4">{{ $t('billing.details') }}</div>
          </template>
        </el-table-column>
      </el-table>
      <div class="mt-[12px] mb-[16px] flex justify-center">
        <CsgPagination
          :perPage="perPage"
          :currentPage="currentPage"
          @currentChange="loadMoreBillings"
          :total="totalBillings"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, inject, onMounted } from 'vue'
  import { useI18n } from 'vue-i18n'
  import Menu from './Menu.vue'
  import CsgPagination from '../shared/CsgPagination.vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import jwtFetch from '../../packs/jwtFetch'
  import dayjs from 'dayjs'
  import { useCookies } from 'vue3-cookies'

  const props = defineProps({
    name: String,
    displayName: String,
    avatar: String,
    email: String
  })

  const { t } = useI18n()
  const csghubServer = inject('csghubServer')
  const value2 = ref('')
  const currentPage = ref(1)
  const perPage = ref(10)
  const scene = ref(10)
  const balance = ref(0)
  const totalBillings = ref(0)
  const spaceBillings = ref([])
  const { cookies } = useCookies()
  const startDate = ref('')
  const endDate = ref('')

  const loginIdentity = cookies.get('login_identity')

  onMounted(() => {
    fetchBalance()
    fetchBillings()
  })

  const dateChange = (e) => {
    console.log(e)
    const dateString = formatDate(e)
    startDate.value = dateString
    const lastDayOfMonth = getLastDayOfMonthFromDateString(dateString)
    console.log(lastDayOfMonth)
    endDate.value = lastDayOfMonth
  }

  const getLastDayOfMonthFromDateString = (dateString) => {
    const parts = dateString.split('-')
    const year = parseInt(parts[0], 10)
    const month = parseInt(parts[1], 10) - 1 // 月份在 Date 对象中是从 0 到 11 表示的

    const lastDay = getLastDayOfMonth(year, month)
    return `${year}-${month + 1}-${lastDay}`
  }

  const getLastDayOfMonth = (year, month) => {
    const nextMonthFirstDay = new Date(year, month + 1, 1)
    const lastDay = new Date(nextMonthFirstDay - 86400000).getDate() // 获取月底的日期
    return lastDay
  }

  const loadMoreBillings = (page) => {
    currentPage.value = page
    const params = new URLSearchParams()
    params.append('scene', scene.value)
    params.append('per', perPage.value)
    params.append('page', currentPage.value)
    params.append('start_date', startDate.value)
    params.append('end_date', endDate.value)
    fetchBillings(params)
  }

  const fetchBalance = async (params = new URLSearchParams()) => {
    const url = `${csghubServer}/api/v1/accounting/credit/${loginIdentity}/balance`
    const res = await jwtFetch(url)
    if (!res.ok) {
      res.json().then(({ msg }) => {
        ElMessage({ message: msg, type: 'warning' })
      })
    } else {
      res.json().then(({ data }) => {
        console.log(data)
        balance.value = data.balance
      })
    }
  }

  const fetchBillings = async (params = new URLSearchParams()) => {
    params.append('per', perPage.value)
    params.append('start_date', '2024-06-01')
    params.append('end_date', '2024-06-25')
    const url = `${csghubServer}/api/v1/accounting/credit/${loginIdentity}/bills?${params.toString()}`
    const res = await jwtFetch(url)
    if (!res.ok) {
      res.json().then(({ msg }) => {
        ElMessage({ message: msg, type: 'warning' })
      })
    } else {
      res.json().then(({ data }) => {
        console.log(data)
        spaceBillings.value = data.data
        totalBillings.value = data.total
      })
    }
  }

  const formatDate = (date) => {
    if (!date) return '-'
    console.log(dayjs(date).format('YYYY-MM-DD'))
    return dayjs(date).format('YYYY-MM-DD')
  }
  // const confirmRefreshAccessToken = () => {
  //   ElMessageBox.confirm(t('accessToken.refreshWarning'), 'Warning', {
  //     confirmButtonText: t('accessToken.confirm'),
  //     cancelButtonText: t('all.cancel'),
  //     type: 'warning'
  //   }).then(() => {
  //     refreshAccessToken()
  //   }).catch(() => {
  //     ElMessage({
  //       message: t('accessToken.cancelInfo'),
  //       type: 'info'
  //     })
  //   })
  // }
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
        &:not(:first-child):not(:last-child) {
          border-top: 1px solid #eaecf0;
        }
        &:nth-child(1) {
          border: 1px solid #eaecf0;
          border-right: none;
          border-radius: 12px 0 0 0;
        }
        &:nth-last-child(1) {
          border: 1px solid #eaecf0;
          border-left: none;
          border-radius: 0 12px 0 0;
        }
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
