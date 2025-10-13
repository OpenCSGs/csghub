<template>
  <el-dialog
    v-model="dialogVisible"
    :width="dialogWidth"
    :close-on-click-modal="false"
  >
    <template #header="{ close }">
      <div class="flex justify-between">
        <div class="m-2">
          <SvgIcon
            name="finetune-balance"
            class="w-12 h-12"
          />
        </div>
        <img
          src="/images/collection_half_cirle.png"
          class="w-[50%] absolute top-0 left-0"
        />
      </div>
    </template>

    <div class="w-full relative">
      <div class="text-lg font-medium text-gray-900">
        {{ $t('finetune.new.balanceInsufficient') }}
      </div>
      <div class="text-sm font-light text-gray-600 mb-5">
        {{ $t('finetune.new.taskBalanceInsufficient', { balance: balance }) }}
      </div>
    </div>

    <template #footer>
      <div class="flex w-full justify-between gap-3 px-5">
        <div class="w-1/2">
          <CsgButton
            :name="$t('finetune.new.cancel')"
            class="btn btn-secondary-gray btn-lg w-full"
            @click="dialogVisible = false"
          />
        </div>
        <div class="w-1/2">
          <CsgButton
            :name="$t('finetune.new.goToRecharge')"
            class="btn btn-primary btn-lg w-full"
            @click="goToRecharge"
          />
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
  import { ref, watch, computed } from 'vue'
  import { ElMessage } from 'element-plus'

  const props = defineProps({
    errorMsg: String
  })

  const dialogVisible = ref(false)

  const currencyUnit = REGION === 'hk' ? 'HK$' : '¥'
  const balance = ref(`${currencyUnit}0`)

  const isMobile = ref(window.innerWidth < 450)
  const dialogWidth = computed(() => (isMobile.value ? '95%' : '450'))

  const goToRecharge = () => {
    window.location.href = '/settings/recharge-payment'
  }

  watch(
    () => props.errorMsg,
    (newVal) => {
      if (newVal && newVal.includes('balance is not enough')) {
        const match = newVal.match(/current balance: (-?[\d.]+)/)
        if (match) {
          balance.value = `${currencyUnit}${(Number(match[1]) / 100).toFixed(2)}`
        } else {
          balance.value = `${currencyUnit}0`
        }
        dialogVisible.value = true
      }else{
        ElMessage.warning(newVal)
      }
    }
  )
</script>
