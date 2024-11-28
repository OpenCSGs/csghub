<template>
  <div>
    <el-card>
      <template #header>
        <div class="flex items-center justify-between mb-[20px]">
          <h3 class="text-[20x] font-[500]">Users</h3>
          <el-input
            v-model="keyword"
            style="width: 240px"
            placeholder="Name, Email, Phone"
            :prefix-icon="Search"
            @input="searchUsers"
          />
        </div>
      </template>
      <el-table
        :stripe="true"
        :data="users"
        style="width: 100%"
      >
        <el-table-column
          prop="username"
          label="Name"
        />
        <el-table-column
          prop="nickname"
          label="Nickname"
        />
        <el-table-column
          prop="email"
          label="Email"
        />
        <el-table-column
          prop="phone"
          label="Phone"
        />
        <el-table-column label="Operations">
          <template #default="scope">
            <el-button
              size="small"
              @click="showDetail(scope.row)"
            >
              详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-model:current-page="page"
        :page-size="per"
        layout="prev, pager, next"
        :total="total"
        @current-change="fetchUsers"
        class="my-[52px] flex justify-center"
      />
    </el-card>
  </div>
</template>

<script setup>
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
    const {data, error} = await useFetchApi(`/users?page=${current || page.value}&per=${per.value}&search=${keyword.value}`).json()
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
