<template>
  <div>
    <el-card>
      <template #header>
        <div class="card-header">
          <span>User Detail</span>
        </div>
      </template>
      <ul class="max-w-[480px]">
        <li class="flex justify-between mb-4">
          <label>Name</label>
          <p>{{ user.name }}</p>
        </li>
        <li class="flex justify-between mb-4">
          <label>Nickname</label>
          <p>{{ user.nickname }}</p>
        </li>
        <li class="flex justify-between mb-4">
          <label>Phone</label>
          <p>{{ user.phone }}</p>
        </li>
        <li class="flex justify-between mb-4">
          <label>Role</label>
          <p>{{ user.role }}</p>
        </li>
        <li class="flex justify-between mb-4">
          <label>Created At</label>
          <p>{{ dayjs(user.created_at).format('YYYY-MM-DD HH:mm:ss') }}</p>
        </li>
        <li class="flex justify-between mb-4">
          <label>Credit</label>
          <div class="flex items-center">
            <div 
              @click="refreshDialogVisible = true"
              class="border px-[16px] rounded-lg border-amber-50 bg-orange-500 cursor-pointer"
            >
              {{ $t('new_admin.user.recharge') }}
            </div>
            <p class="ml-3">{{ credit }} 元</p>
          </div>
        </li>
      </ul>
    </el-card>
    <el-dialog 
      v-model="refreshDialogVisible" 
      :title="$t('new_admin.user.recharge')" 
      width="20%" 
      class="dialogWidth"
      style="border-radius: 0.5rem;" 
      left
    >
      <div class="mb-[16px]">
        <p class="text-[#303133] text-[14px] mb-[8px]">
          {{ $t('new_admin.user.inputTitle') }} 
          <span class="text-red-400">*</span>
        </p>
        <el-input 
          v-model="rechargeAmount" 
          type="number" 
          :placeholder="$t('new_admin.user.inputPlaceholder')" 
          maxlength="20" 
        />
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="clickCancel">{{ $t('new_admin.user.cancel') }}</el-button>
          <el-button 
            type="primary" 
            @click="fetchRecharge"
          >
            {{ $t('new_admin.user.confirm') }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import dayjs from "dayjs"
  import { ElMessage } from 'element-plus'
  import csrfFetch from '../../../packs/csrfFetch'

  const route = useRoute()
  const user = ref({})
  const credit = ref(0)
  const refreshDialogVisible = ref(false)
  const rechargeAmount = ref(0)

  const fetchUser = async () => {
    const response = await fetch(`/internal_api/admin/users/${route.params.id}`)
    if (response.ok) {
      const data = await response.json()
      user.value = data
      fetchCredit()
    } else {
      ElMessage.error('Failed to fetch user')
    }
  }

  const fetchCredit = async () => {
    const response = await csrfFetch(`/internal_api/admin/users/balance/${route.params.id}`, { method: 'GET' })
    if (response.ok) {
      const res = await response.json()
      credit.value = res.data.balance
    } else {
      ElMessage.error('Failed to fetch credit')
    }
  }

  const fetchRecharge = async () => {
    const response = await csrfFetch(`/internal_api/admin/users/recharge/${route.params.id}/${rechargeAmount.value}`, { method: 'PUT' })
    if (response.ok) {
      const res = await response.json()
      credit.value = res.data.balance
      refreshDialogVisible.value = false
      rechargeAmount.value = 0
      ElMessage.success('Be recharged successfully')
    } else {
      ElMessage.error('Failed to recharge')
    }
  }

  const clickCancel = () => {
    refreshDialogVisible.value = false
    rechargeAmount.value = 0
  }

  onMounted(() => {
    fetchUser()
  })
</script>
