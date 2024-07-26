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
          <label>Uuid</label>
          <p>{{ user.uuid }}</p>
        </li>
        <li class="flex justify-between mb-4">
          <label>Name</label>
          <p>{{ user.username }}</p>
        </li>
        <li class="flex justify-between mb-4">
          <label>Nickname</label>
          <p>{{ user.nickname }}</p>
        </li>
        <li class="flex justify-between mb-4">
          <label>Avatar</label>
          <p>{{ user.avatar }}</p>
        </li>
        <li class="flex justify-between mb-4">
          <label>Email</label>
          <p>{{ user.email }}</p>
        </li>
        <li class="flex justify-between mb-4">
          <label>Phone</label>
          <p>{{ user.phone }}</p>
        </li>
        <li class="flex justify-between mb-4">
          <label>Roles</label>
          <p>{{ user.roles }}</p>
        </li>
        <li class="flex justify-between mb-4">
          <label>Created At</label>
          <p>{{ dayjs(user.created_at).format('YYYY-MM-DD HH:mm:ss') }}</p>
        </li>
        <li class="flex justify-between mb-4">
          <label>Credit</label>
          <div class="flex items-center">
            <p class="mr-3">{{ credit }} 元</p>
            <div
              @click="refreshDialogVisible = true"
              class="border px-[16px] rounded-lg border-amber-50 bg-orange-500 cursor-pointer"
            >
              {{ $t('new_admin.user.recharge') }}
            </div>
          </div>
        </li>
      </ul>
      <template #footer>
        <el-button @click="dialogFormVisible = true">Edit</el-button>
      </template>
    </el-card>

    <!-- recharge dialog -->
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

    <!-- edit user infos dialog -->
    <el-dialog
      v-model="dialogFormVisible"
      :title="`${user.username}`"
      width="500"
    >
      <el-form :model="form">
        <el-form-item label="Roles">
          <el-select
            v-model="form.roles"
            multiple
            placeholder="Please select the roles"
          >
            <el-option
              label="Super User"
              value="super_user"
            />
            <el-option
              label="Admin"
              value="admin"
            />
            <el-option
              label="Personal User"
              value="personal_user"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogFormVisible = false">Cancel</el-button>
          <el-button
            type="primary"
            @click="submitUserForm"
          >
            Confirm
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
  import { ref, onMounted, inject, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import jwtFetch from '../../../packs/jwtFetch.js'
  import dayjs from 'dayjs'
  import { ElMessage } from 'element-plus'

  const route = useRoute()
  const csghubServer = inject('csghubServer')

  const user = ref({})
  const credit = ref(0)
  const refreshDialogVisible = ref(false)
  const rechargeAmount = ref(0)

  const dialogFormVisible = ref(false)

  const form = ref({
    roles: String
  })

  watch(user, () => {
    fetchCredit()
  })

  const fetchUser = async () => {
    const response = await jwtFetch(`${csghubServer}/api/v1/user/${route.params.id}`)
    const result = await response.json()
    if (response.ok) {
      user.value = result.data
      form.value.roles = result.data.roles
    } else {
      ElMessage.warning(result.msg)
    }
  }

  const fetchCredit = async () => {
    const response = await jwtFetch(`${csghubServer}/api/v1/accounting/credit/${user.value.uuid}/balance`)
    const result = await response.json()
    if (response.ok) {
      credit.value = (result.data.balance/100.0).toFixed(2)
    } else {
      ElMessage.warning(result.msg)
    }
  }

  const fetchRecharge = async () => {
    const params = {
      op_uid: 1,
      value: rechargeAmount.value * 100
    }
    const options = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    }
    const response = await jwtFetch(`${csghubServer}/api/v1/accounting/credit/${user.value.uuid}/recharge`, options)
    const result = await response.json()
    if (response.ok) {
      credit.value = (result.data.balance/100.0).toFixed(2)
      refreshDialogVisible.value = false
      rechargeAmount.value = 0
      ElMessage.success('Be recharged successfully')
    } else {
      ElMessage.warning(result.msg)
    }
  }

  const clickCancel = () => {
    refreshDialogVisible.value = false
    rechargeAmount.value = 0
  }

  const submitUserForm = async () => {
    const response = await jwtFetch(`${csghubServer}/api/v1/user/${user.value.username}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ roles: form.value.roles })
    })
    const result = response.json()
    if (response.ok) {
      ElMessage.success('User updated successfully')
      dialogFormVisible.value = false
      fetchUser()
    } else {
      ElMessage.warning(result.msg)
    }
  }

  onMounted(() => {
    fetchUser()
  })
</script>
