<template>
  <Container title="用户管理" subtitle="" :breadcrumbs="[{ text: '用户管理' }]">
    <!-- search & filter -->
    <div class="flex items-center gap-3 w-full">
      <el-input v-model="keyword" placeholder="Name, Email, Phone" size="large" :prefix-icon="Search"
        @input="searchUsers" />
    </div>
    <Table title="用户列表" :data="users" size="small" :border="false" class="custom-table">
      <el-table-column prop="username" label="Name" />
      <el-table-column prop="nickname" label="Nickname" />
      <el-table-column prop="email" label="Email" />
      <el-table-column prop="phone" label="Phone" />
      <el-table-column label="Operations">
        <template #default="scope">
          <el-button size="small" @click="showDetail(scope.row)">
            详情
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
  window.location.href = `/admin_next/users/${row.username}`
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