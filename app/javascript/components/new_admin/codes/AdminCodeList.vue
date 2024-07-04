<template>
  <div>
    <el-card>
      <template #header>
        <div class="flex items-center justify-between mb-[20px]">
          <h3 class="text-[20x] font-[500]">codes</h3>
          <el-input
            v-model="keyword"
            style="width: 240px"
            placeholder="Name, Owner"
            :prefix-icon="Search"
            @input="searchCodes"
          />
        </div>
      </template>
      <el-table
        :stripe="true"
        :data="codes"
        style="width: 100%"
      >
        <el-table-column
          prop="name"
          label="Name"
        />
        <el-table-column
          label="Owner"
          scoped-slot="default"
        >
          <template #default="scope">
            {{ codes[scope.$index].path.split('/')[0] }}
          </template>
        </el-table-column>
        <el-table-column
          label="Visibility"
          scoped-slot="default"
        >
          <template #default="scope">
            {{ codes[scope.$index].private == false ? 'public' : 'private' }}
          </template>
        </el-table-column>
        <el-table-column label="Operations">
          <template #default="scope">
            <el-button
              size="small"
              @click="showDetail(codes[scope.$index].path)"
            >
              详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-code:current-page="page"
        :page-size="per"
        layout="prev, pager, next"
        :total="total"
        @current-change="fetchCodes"
        class="my-[52px] flex justify-center"
      />
    </el-card>
  </div>
</template>

<script setup>
  import { ref, onMounted, inject } from 'vue'
  import { Search } from '@element-plus/icons-vue'
  import { ElMessage } from 'element-plus'

  const codes = ref([])
  const page = ref(1)
  const per = ref(10)
  const total = ref(0)
  const keyword = ref('')
  const csghubServer = inject('csghubServer')

  const fetchCodes = async (current) => {
    const response = await fetch(
      `${csghubServer}/api/v1/codes?&sort=trending&page=${
        current || page.value
      }&per=${per.value}&search=${keyword.value}`
    )
    if (response.ok) {
      const res_json = await response.json()
      codes.value = res_json.data
      total.value = res_json.total
    } else {
      ElMessage.error('Failed to fetch codes')
    }
  }

  const searchCodes = () => {
    page.value = 1
    fetchCodes()
  }

  const showDetail = (path) => {
    window.location.href = `/new_admin/codes/${path}`
  }

  onMounted(() => {
    fetchCodes()
  })
</script>