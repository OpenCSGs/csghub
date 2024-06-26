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
          <label class="flex-none">Credit</label>
          <div @click="refreshDialogVisible = true" class="border px-[16px] rounded-lg border-amber-50 bg-orange-500 cursor-pointer">充值</div>
          <p>{{ credit }}</p>
        </li>
      </ul>
    </el-card>
    <el-dialog v-model="refreshDialogVisible" title="充值" width="30%" class="dialogWidth"
                 style="border-radius: 0.5rem;" left>
          <div class="mb-[16px]">
            <p class="text-[#303133] text-[14px] mb-[8px]">充值金额 <span class="text-red-400">*</span></p>
            <el-input v-model="value" placeholder="充值金额" maxlength="20"/>
          </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="refreshDialogVisible = false">Cancel</el-button>
            <el-button type="primary" @click="fetchRecharge">
              {{ $t('all.add') }}
            </el-button>
        </span>
        </template>
      </el-dialog>
  </div>
</template>

<script setup>
  import { ref, onMounted, inject } from 'vue'
  import { useRoute } from 'vue-router'
  import dayjs from "dayjs"
  import { ElMessage } from 'element-plus'
  import jwtFetch from '../../../packs/jwtFetch'
  import csrfFetch from '../../../packs/csrfFetch'

  const route = useRoute()
  const csghubServer = inject('csghubServer')
  const user = ref({})
  const credit = ref(0)
  const refreshDialogVisible = ref(false)
  const value = ref(0)


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
    const options = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    }
    const response = await jwtFetch(`${csghubServer}/api/v1/accounting/credit/${user.value.login_identity}/balance`, options)
    if (response.ok) {
      const res = await response.json()
      credit.value = res.data.balance
    } else {
      ElMessage.error('Failed to fetch credit')
    }
  }

  const fetchRecharge = async () => {
    const options = {
      method: 'PUT'
    }
    const response = await csrfFetch(`/internal_api/admin/users/recharge/${route.params.id}/${value.value}`, options)
    if (response.ok) {
      const res = await response.json()
      credit.value = res.data.balance
      refreshDialogVisible.value = false
      ElMessage.success('successful')
    } else {
      ElMessage.error('Failed to fetch credit')
    }
  }

  onMounted(() => {
    fetchUser()
  })
</script>
