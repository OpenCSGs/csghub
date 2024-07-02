<template>
  <div>
    <el-card>
      <template #header>
        <div class="flex items-center justify-between mb-[20px]">
          <h3 class="text-[20x] font-[500]">Models</h3>
          <el-input
            v-model="keyword"
            style="width: 240px"
            placeholder="Name, Owner"
            :prefix-icon="Search"
            @input="searchModels"
          />
        </div>
      </template>
      <el-table
        :stripe="true"
        :data="models"
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
            {{ models[scope.$index].path.split("/")[0] }}
          </template>
        </el-table-column>
        <el-table-column
          label="Visibility"
          scoped-slot="default"
        >
          <template #default="scope">
            {{ models[scope.$index].private == false ? 'public' : 'private' }}
          </template>
        </el-table-column>
        <el-table-column label="Operations">
          <template #default="scope">
            <el-button
              size="small"
              @click="showDetail(models[scope.$index].path)"
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
        @current-change="fetchModels"
        class="my-[52px] flex justify-center"
      />
    </el-card>
  </div>
</template>

<script setup>
  import { ref, onMounted, inject } from 'vue'
  import { Search } from '@element-plus/icons-vue'
  import { ElMessage } from 'element-plus'

  const models = ref([])
  const page = ref(1)
  const per = ref(10)
  const total = ref(0)
  const keyword = ref('')
  const csghubServer = inject('csghubServer')

  const fetchModels = async (current) => {
    const response = await fetch(
      `${csghubServer}/api/v1/models?&sort=trending&page=${current || page.value}&per=${per.value}&search=${keyword.value}`
    )
    if (response.ok) {
      const res_json = await response.json()
      models.value = res_json.data
      total.value = res_json.total_count
    } else {
      ElMessage.error('Failed to fetch models')
    }
  }

  const searchModels = () => {
    page.value = 1
    fetchModels()
  }

  const showDetail = (path) => {
    window.location.href = `/new_admin/models/${path}`
  }

  onMounted(() => {
    fetchModels()
  })
</script>
