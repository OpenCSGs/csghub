<template>
  <Container :title="$t('admin.users.title')" subtitle="" :breadcrumbs="[{ text: $t('admin.users.title') }]">
    <!-- search & filter -->
    <div class="flex items-center gap-3 w-full">
      <el-input v-model="keyword" placeholder="Name, Email, Phone" size="large" :prefix-icon="Search"
        @input="searchUsers" />
    </div>
    <Table
      :data="users"
      size="small"
      :border="false"
      class="custom-table">
      <template #header>
        <div class="px-6 pt-5 pb-4 flex justify-start gap-2 items-center">
          <h2 class="text-18 text-md text-gray-900">
            {{ $t('admin.users.userList') }}
          </h2>
          <div class="px-2 py-1.5 bg-brand-50 rounded-xl outline outline-1 outline-offset-[-1px] outline-brand-200 inline-flex justify-start items-center">
            <span class="text-brand-700 text-xs font-normal leading-none">{{ total }} {{ $t('admin.users.userCount') }}</span>
          </div>
        </div>
      </template>
      <el-table-column
        prop="username"
        :label="$t('admin.name')" />
      <el-table-column
        prop="nickname"
        :label="$t('admin.nickname')" />
      <el-table-column
        prop="email"
        :label="$t('admin.email')" />
      <el-table-column
        prop="phone"
        :label="$t('admin.phone')" />
      <el-table-column :label="$t('admin.operations')">
        <template #default="scope">
          <el-button size="small" @click="showDetail(scope.row)">
            {{ $t('admin.users.userDetailBtn') }}
          </el-button>
        </template>
      </el-table-column>
      <template #footer>
        <Pagination v-model:current-page="page" :page-size="per" layout="prev, pager, next" :total="total"
          @current-change="fetchUsers" />
      </template>
    </Table>
  </Container>
</template>

<script setup>
import { Container, Pagination, Table } from '../admin_component'
import { ref, onMounted } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import useFetchApi from '../../../packs/useFetchApi'

const users = ref([])
const page = ref(1)
const per = ref(10)
const total = ref(0)
const keyword = ref('')

const fetchUsers = async (current) => {
  const { data, error } = await useFetchApi(`/users?page=${current || page.value}&per=${per.value}&search=${keyword.value}`).json()
  if (data.value) {
    users.value = data.value.data.data
    total.value = data.value.data.total
  } else {
    ElMessage.error(error.value.msg)
  }
}

const searchUsers = () => {
  page.value = 1
  fetchUsers()
}

const showDetail = (row) => {
  window.location.href = `/admin_panel/users/${row.username}`
}

onMounted(() => {
  fetchUsers()
})
</script>


<style lang="less" scoped>
:deep(.el-table) {
  --el-table-border-color: transparent;

  .el-table__header {
    th {
      background-color: #f8f9fb;
      color: #475466;
      font-weight: normal;
      font-size: 12px;
      height: 60px;
      border-bottom: 1px solid #eaecf0;
    }
  }

  .el-table__row {
    td {
      height: 60px;
      color: #475466;
      font-weight: 300;
      font-size: 14px;
      border-bottom: 1px solid #eaecf0;
    }
  }
}
</style>