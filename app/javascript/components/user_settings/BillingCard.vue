<template>
  <div class="p-[12px] rounded-[8px] mt-[16px]">
    <!-- billing title -->
    <div class="flex justify-between items-center mb-8">
      <div class="text-[30px] leading-[38px]">
        {{ $t('billing.title') }}
      </div>
      <el-date-picker
        v-model="selectedMonth"
        @change="dateChange"
        type="month"
        placeholder="Pick"
        style="width: 120px"
      />
    </div>

    <!-- balance -->
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

    <!-- space billing -->
    <div class="flex justify-between mb-4">
      <div class="flex gap-2 text-[20px] leading-[30px] text-[#344054]">
        <SvgIcon name="spaces" />
        {{ $t('spaces.title') }}
      </div>
      <div class="text-[14px] leading-[20px] text-[#475467]">
        {{ $t('billing.total') }}：¥ {{ spaceTotalPrice }}
      </div>
    </div>
    <BillingTable :billings="spaceBillings"/>
    <div class="mt-[12px] mb-[16px] flex justify-center">
      <CsgPagination
        :perPage="perPage"
        :currentPage="spaceCurrentPage"
        @currentChange="fetchSpace"
        :total="spaceTotalBillings"
      />
    </div>

    <!-- inference instances -->
    <div class="flex justify-between mb-4">
      <div class="flex gap-2 text-[20px] leading-[30px] text-[#344054]">
        <SvgIcon name="inference_instances" />
        {{ $t('billing.inference') }}
      </div>
      <div class="text-[14px] leading-[20px] text-[#475467]">
        {{ $t('billing.total') }}：¥ {{ inferenceTotalPrice }}
      </div>
    </div>
    <BillingTable :billings="inferenceBillings"/>
    <div class="mt-[12px] mb-[16px] flex justify-center">
      <CsgPagination
        :perPage="perPage"
        :currentPage="inferenceCurrentPage"
        @currentChange="fetchInference"
        :total="inferenceTotalBillings"
      />
    </div>
  </div>
</template>

<script setup>
  import { ref, inject, onMounted } from 'vue'
  import { useI18n } from 'vue-i18n'
  import CsgPagination from '../shared/CsgPagination.vue'
  import { ElMessage } from 'element-plus'
  import jwtFetch from '../../packs/jwtFetch'
  import dayjs from 'dayjs'
  import { useCookies } from 'vue3-cookies'
  import { getCurrentDate, getFirstDayOfMonth } from '../../packs/datetimeUtils'

  const { t } = useI18n()
  const csghubServer = inject('csghubServer')
  const selectedMonth = ref('')
  const perPage = ref(10)

  const spaceCurrentPage = ref(1)
  const inferenceCurrentPage = ref(1)

  const balance = ref(0)
  const spaceBillings = ref([])
  const spaceTotalBillings = ref(0)
  const inferenceBillings = ref([])
  const inferenceTotalBillings = ref(0)
  const spaceTotalPrice = ref(0)
  const inferenceTotalPrice = ref(0)

  const { cookies } = useCookies()

  const loginIdentity = cookies.get('login_identity')

  const startDate = ref(getFirstDayOfMonth())
  const endDate = ref(getCurrentDate())

  const dateChange = (e) => {
    console.log(e)
    const dateString = formatDate(e)
    startDate.value = dateString
    const lastDayOfMonth = getLastDayOfMonthFromDateString(dateString)
    console.log(lastDayOfMonth)
    endDate.value = lastDayOfMonth
    fetchBillings()
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

  // 获取用户的余额
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

  const fetchBillings = async () => {
    await fetchInference()
    await fetchSpace()
  }

  // scene = 10：model inference endpoint
  // scene = 11：space
  // scene = 12: model finetune
  // scene = 20：starship-ide
  const fetchInference = async () => {
    const params = new URLSearchParams()
    params.append('per', perPage.value)
    params.append('page', inferenceCurrentPage.value)
    params.append('start_date', startDate.value)
    params.append('end_date', endDate.value)
    params.append('scene', 10)

    const url = `${csghubServer}/api/v1/accounting/credit/${loginIdentity}/bills?${params.toString()}`
    const res = await jwtFetch(url)

    if (!res.ok) {
      const { msg } = await res.json()
      ElMessage({ message: msg, type: 'warning' })
    } else {
      const { data } = await res.json()
      console.log('Data for scene 10:', data)
      inferenceBillings.value = data.data
      inferenceTotalBillings.value = data.total
    }
  }

  // scene = 10：model inference endpoint
  // scene = 11：space
  // scene = 12: model finetune
  // scene = 20：starship-ide
  const fetchSpace = async () => {
    const params = new URLSearchParams()
    params.append('per', perPage.value)
    params.append('page', spaceCurrentPage.value)
    params.append('start_date', startDate.value)
    params.append('end_date', endDate.value)
    params.append('scene', 11)

    const url = `${csghubServer}/api/v1/accounting/credit/${loginIdentity}/bills?${params.toString()}`
    const res = await jwtFetch(url)

    if (!res.ok) {
      const { msg } = await res.json()
      ElMessage({ message: msg, type: 'warning' })
    } else {
      const { data } = await res.json()
      console.log('Data for scene 11:', data)
      spaceBillings.value = data.data
      spaceTotalBillings.value = data.total
    }
  }

  const formatDate = (date) => {
    if (!date) return '-'
    console.log(dayjs(date).format('YYYY-MM-DD'))
    return dayjs(date).format('YYYY-MM-DD')
  }

  onMounted(() => {
    fetchBalance()
    fetchBillings()
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
