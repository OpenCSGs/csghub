<template>
  <Container
    :title="$t('admin.broadcasts.title')"
    subtitle=""
    :breadcrumbs="[{ text: $t('admin.broadcasts.title') }]"
  >
    <div class="flex items-center justify-between gap-3 w-full pt-1">
      <el-input
        v-model="keyword"
        :placeholder="$t('admin.broadcasts.searchPlaceholder')"
        size="large"
        :prefix-icon="Search"
        @input="searchBroadcasts"
      />
      <router-link
        to="/admin_panel/broadcasts/new"
        class="shrink-0"
      >
        <CsgButton
          class="btn btn-primary btn-md"
          :name="$t('admin.broadcasts.create')"
        />
      </router-link>
    </div>

    <Table
      :title="$t('admin.broadcasts.list')"
      :data="broadcasts"
      size="small"
      :border="false"
      v-loading="loading"
      class="custom-table"
    >
      <el-table-column
        prop="bc_type"
        :label="$t('admin.broadcasts.bc_type')"
      />
      <el-table-column
        prop="theme"
        :label="$t('admin.broadcasts.theme')"
      />
      <el-table-column
        :label="$t('admin.broadcasts.status')">
        <template #default="scope">
          <div v-if="scope.row.status === 'active'" class="flex justify-center w-[65px] rounded-[16px] border border-success-200 bg-success-50 text-success-700 text-[12px] py-[2px] px-2">
            展示中
          </div>
          <div v-else class="flex justify-center w-[65px] rounded-[16px] border border-warning-200 bg-warning-50 text-warning-700 text-[12px] py-[2px] px-2">
            待发布
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="content"
        :label="$t('admin.broadcasts.content')"
        show-overflow-tooltip
      />
      <el-table-column
        :label="$t('admin.operations')"
        width="100"
        fixed="right"
      >
        <template #default="scope">
          <a
            href="javascript:void(0)"
            @click="showDetail(scope.row)"
            class="text-brand-700"
          >
            {{ $t('admin.broadcasts.edit') }}
          </a>
        </template>
      </el-table-column>
    </Table>
  </Container>
</template>

<script setup>
  import { Container, Table } from '../admin_component'
  import { ref, onMounted } from 'vue'
  import { Search } from '@element-plus/icons-vue'
  import { ElMessage } from 'element-plus'
  import useFetchApi from '../../../packs/useFetchApi'

  const broadcasts = ref([])
  const keyword = ref('')
  const loading = ref(false)

  const searchBroadcasts = () => {
    page.value = 1
    fetchBroadcasts()
  }

  const fetchBroadcasts = async () => {
    loading.value = true

    try {
      const { data, error } = await useFetchApi(`/admin/broadcasts`).json()

      if (data.value) {
        broadcasts.value = data.value.data
      } else {
        ElMessage.warning(error.value?.msg || 'Failed to fetch broadcasts')
      }
    } catch (error) {
      ElMessage.error(error.value?.msg || 'Failed to fetch broadcasts')
    } finally {
      loading.value = false
    }
  }

  const showDetail = (row) => {
    window.location.href = `/admin_panel/broadcasts/${row.id}/edit`
  }

  onMounted(() => {
    fetchBroadcasts()
  })
</script>
