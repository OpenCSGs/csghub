<template>
  <div class="rounded-[8px]">
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
        :disabled-date="disabledDate"
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
        <div
          class="text-[36px] leading-[44px] overflow-hidden text-ellipsis whitespace-nowrap"
          :title="balance"
        >
          ¥ {{ balance }}
        </div>
      </div>
    </div>

    <!-- space billing -->
    <div class="flex justify-between mb-4">
      <div class="flex gap-2 text-[20px] leading-[30px] text-[#344054]">
        <SvgIcon name="spaces" width="18" height="18" />
        {{ $t('spaces.title') }}
      </div>
      <div class="text-[14px] leading-[20px] text-[#475467]">
        {{ $t('billing.total') }}：¥ {{ spaceTotalPrice }}
      </div>
    </div>
    <BillingTable
      :billings="spaceBillings"
      :selectedMonth="selectedMonth"
      type="space"
    />
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
        <SvgIcon
          name="endpoint"
          width="18"
          height="18"
        />
        {{ $t('billing.inference') }}
      </div>
      <div class="text-[14px] leading-[20px] text-[#475467]">
        {{ $t('billing.total') }}：¥ {{ inferenceTotalPrice }}
      </div>
    </div>
    <BillingTable
      :billings="inferenceBillings"
      :selectedMonth="selectedMonth"
      type="inference"
    />
    <div class="mt-[12px] mb-[16px] flex justify-center">
      <CsgPagination
        :perPage="perPage"
        :currentPage="inferenceCurrentPage"
        @currentChange="fetchInference"
        :total="inferenceTotalBillings"
      />
    </div>

    <!-- finetune -->
    <div class="flex justify-between mb-4">
      <div class="flex gap-2 text-[20px] leading-[30px] text-[#344054]">
        <SvgIcon
          name="profile_finetune"
          width="18"
          height="18"
        />
        {{ $t('billing.finetune') }}
      </div>
      <div class="text-[14px] leading-[20px] text-[#475467]">
        {{ $t('billing.total') }}：¥ {{ finetuneTotalPrice }}
      </div>
    </div>
    <BillingTable
      :billings="finetuneBillings"
      :selectedMonth="selectedMonth"
      type="finetune"
    />
    <div class="mt-[12px] mb-[16px] flex justify-center">
      <CsgPagination
        :perPage="perPage"
        :currentPage="finetuneCurrentPage"
        @currentChange="fetchFinetune"
        :total="finetuneTotalBillings"
      />
    </div>

    <!-- starship -->
    <div class="flex justify-between mb-4">
      <div class="flex gap-2 text-[20px] leading-[30px] text-[#344054]">
        <SvgIcon
          name="billing_starship"
          width="18"
          height="18"
        />
        Starship
      </div>
      <div class="text-[14px] leading-[20px] text-[#475467]">
        {{ $t('billing.total') }}：¥ {{ starshipTotalPrice }}
      </div>
    </div>
    <BillingTable
      :billings="starshipBillings"
      :selectedMonth="selectedMonth"
      type="starship"
    />
    <div class="mt-[12px] mb-[16px] flex justify-center">
      <CsgPagination
        :perPage="perPage"
        :currentPage="starshipCurrentPage"
        @currentChange="fetchStarship"
        :total="starshipTotalBillings"
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
  import { useCookies } from 'vue3-cookies'
  import {
    getCurrentDate,
    getFirstDayOfMonth,
    formatDate,
    isFutureDate,
    getLastDayOfMonthFromDateString
  } from '../../packs/datetimeUtils'
  import BillingTable from './BillingTable.vue'

  const { t } = useI18n()
  const csghubServer = inject('csghubServer')
  const selectedMonth = ref(getFirstDayOfMonth())
  const perPage = ref(10)

  const spaceCurrentPage = ref(1)
  const inferenceCurrentPage = ref(1)
  const finetuneCurrentPage = ref(1)
  const starshipCurrentPage = ref(1)

  const balance = ref(0)
  const spaceBillings = ref([])
  const spaceTotalBillings = ref(0)
  const spaceTotalPrice = ref(0)

  const inferenceBillings = ref([])
  const inferenceTotalBillings = ref(0)
  const inferenceTotalPrice = ref(0)

  const finetuneBillings = ref([])
  const finetuneTotalBillings = ref(0)
  const finetuneTotalPrice = ref(0)

  const starshipBillings = ref([])
  const starshipTotalBillings = ref(0)
  const starshipTotalPrice = ref(0)

  const { cookies } = useCookies()

  const loginIdentity = cookies.get('login_identity')

  const startDate = ref(getFirstDayOfMonth())
  const endDate = ref(getCurrentDate())

  const disabledDate = (date) => {
    return isFutureDate(date)
  }

  const dateChange = (e) => {
    const dateString = formatDate(e)
    startDate.value = dateString
    const lastDayOfMonth = getLastDayOfMonthFromDateString(dateString)
    endDate.value = lastDayOfMonth
    fetchBillings()
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
        balance.value = (data.balance/100.0).toFixed(2)
      })
    }
  }

  const fetchBillings = async () => {
    await fetchInference()
    await fetchSpace()
    await fetchFinetune()
    await fetchStarship()
  }

  // scene = 10：model inference endpoint
  // scene = 11：space
  // scene = 12: model finetune
  // scene = 20：starship-ide
  const fetchInference = async (childCurrent) => {
    const params = new URLSearchParams()
    params.append('per', perPage.value)
    params.append('page', childCurrent ? childCurrent : inferenceCurrentPage.value)
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
      inferenceBillings.value = data.data
      inferenceTotalBillings.value = data.total
      inferenceTotalPrice.value = (Math.abs(data.total_value)/100.0).toFixed(2)
    }
  }

  // scene = 10：model inference endpoint
  // scene = 11：space
  // scene = 12: model finetune
  // scene = 20：starship-ide
  const fetchSpace = async (childCurrent) => {
    const params = new URLSearchParams()
    params.append('per', perPage.value)
    params.append('page', childCurrent ? childCurrent : spaceCurrentPage.value)
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
      spaceBillings.value = data.data
      spaceTotalBillings.value = data.total
      spaceTotalPrice.value = (Math.abs(data.total_value)/100.0).toFixed(2)
    }
  }

  // scene = 10：model inference endpoint
  // scene = 11：space
  // scene = 12: model finetune
  // scene = 20：starship-ide
  const fetchFinetune = async (childCurrent) => {
    const params = new URLSearchParams()
    params.append('per', perPage.value)
    params.append('page', childCurrent ? childCurrent : finetuneCurrentPage.value)
    params.append('start_date', startDate.value)
    params.append('end_date', endDate.value)
    params.append('scene', 12)

    const url = `${csghubServer}/api/v1/accounting/credit/${loginIdentity}/bills?${params.toString()}`
    const res = await jwtFetch(url)

    if (!res.ok) {
      const { msg } = await res.json()
      ElMessage({ message: msg, type: 'warning' })
    } else {
      const { data } = await res.json()
      finetuneBillings.value = data.data
      finetuneTotalBillings.value = data.total
      finetuneTotalPrice.value = (Math.abs(data.total_value)/100.0).toFixed(2)
    }
  }

  // scene = 10：model inference endpoint
  // scene = 11：space
  // scene = 12: model finetune
  // scene = 20：starship-ide
  const fetchStarship = async (childCurrent) => {
    const params = new URLSearchParams()
    params.append('per', perPage.value)
    params.append('page', childCurrent ? childCurrent : starshipCurrentPage.value)
    params.append('start_date', startDate.value)
    params.append('end_date', endDate.value)
    params.append('scene', 20)

    const url = `${csghubServer}/api/v1/accounting/credit/${loginIdentity}/bills?${params.toString()}`
    const res = await jwtFetch(url)

    if (!res.ok) {
      const { msg } = await res.json()
      ElMessage({ message: msg, type: 'warning' })
    } else {
      const { data } = await res.json()
      starshipBillings.value = data.data
      starshipTotalBillings.value = data.total
      starshipTotalPrice.value = (Math.abs(data.total_value)/100.0).toFixed(2)
    }
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
        @media (max-width: 768px) {
          padding: 1px 2px;
        }
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
