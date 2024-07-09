<template>
  <el-card>
    <template #header>
      <div class="flex items-center justify-between mb-[20px]">
        <h3 class="text-[20x] font-[500]">Datasets</h3>
        <el-input
          v-model="keyword"
          style="width: 240px"
          placeholder="Name, Owner"
          :prefix-icon="Search"
          @input="searchDatasets"
        />
      </div>
    </template>
    <el-table
      :stripe="true"
      :data="datasets"
      style="width: 100%"
    >
      <el-table-column
        prop="name"
        label="Name"
      />
      <el-table-column label="Owner">
        <template #default="scope">
          {{ scope.row.path.split('/')[0] }}
        </template>
      </el-table-column>
      <el-table-column label="Visibility">
        <template #default="scope">
          {{ scope.row.private == false ? 'public' : 'private' }}
        </template>
      </el-table-column>
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
      :page-size="per"
      layout="prev, pager, next"
      :total="total"
      @current-change="fetchDatasets"
      class="my-[52px] flex justify-center"
    />
  </el-card>
</template>

<script setup>
  import { ref, onMounted, inject } from 'vue'
  import { Search } from '@element-plus/icons-vue'
  import { ElMessage } from 'element-plus'

  const datasets = ref([])
  const page = ref(1)
  const per = ref(10)
  const total = ref(0)
  const keyword = ref('')
  const csghubServer = inject('csghubServer')

  const fetchDatasets = async (current) => {
    const response = await fetch(
      `${csghubServer}/api/v1/datasets?&sort=trending&page=${
        current || page.value
      }&per=${per.value}&search=${keyword.value}`
    )
    if (response.ok) {
      const res_json = await response.json()
      datasets.value = res_json.data
      total.value = res_json.total
    } else {
      ElMessage.error(response.msg || 'Failed to fetch dataset')
    }
  }

  const searchDatasets = () => {
    page.value = 1
    fetchDatasets()
  }

  const showDetail = (obj) => {
    window.location.href = `/new_admin/datasets/${obj.path}`
  }

  onMounted(() => {
    fetchDatasets()
  })
</script>
