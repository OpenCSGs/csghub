<template>
  <div>
    <h3 class="mb-5">{{ $t('admin.syncSetting.title') }}</h3>
    <el-form
      :model="form"
      label-width="auto"
      label-position="left"
      style="max-width: 400px"
    >
      <el-form-item label="Token">
        <el-input v-model="form.token"></el-input>
      </el-form-item>
      <el-form-item :label="$t('admin.syncSetting.concurrent')">
        <el-select v-model="form.concurrent_count">
          <el-option
            v-for="count in concurrentCounts"
            :key="count"
            :label="count"
            :value="count"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('admin.syncSetting.bandwidth')">
        <el-select v-model="form.max_bandwidth">
          <el-option
            v-for="count in bandwidthCounts"
            :key="count"
            :label="count"
            :value="count"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="onSubmit"
          >{{ $t('admin.syncSetting.submit') }}</el-button
        >
      </el-form-item>
    </el-form>

    <hr class="my-8" />

    <h3 class="mb-5">{{ $t('admin.syncSetting.mirrors') }}</h3>

    <el-table
      :data="mirrors"
      style="width: 100%"
    >
      <el-table-column
        prop="path"
        label="Path"
      ></el-table-column>
      <el-table-column
        prop="repo_type"
        label="Type"
        width="100"
      ></el-table-column>
      <el-table-column label="Progress">
        <template #default="scope">
          <el-progress :percentage="scope.row.progress" />
        </template>
      </el-table-column>
      <el-table-column
        prop="sync_status"
        label="Status"
      ></el-table-column>
    </el-table>

    <el-pagination
      v-model:current-page="page"
      :page-size="per"
      layout="prev, pager, next"
      :total="total"
      @current-change="fetchSyncRecords"
      class="my-[52px] flex justify-center"
    />
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import { ElMessage } from 'element-plus'
  import csrfFetch from '../../../packs/csrfFetch'

  const form = ref({
    token: '',
    concurrent_count: 1,
    max_bandwidth: 50
  })

  const concurrentCounts = [1, 2, 3]
  const bandwidthCounts = [50, 100, 150, 200]
  const mirrors = ref([])
  const page = ref(1)
  const per = ref(10)
  const total = ref(0)

  const onSubmit = () => {
    if (form.value.token === '') {
      ElMessage({
        message: 'Token cannot be empty',
        type: 'error'
      })
      return false
    }
    createSyncSetting()
  }

  const createSyncSetting = async () => {
    const createEndpoint = '/internal_api/admin/sync_settings'
    const response = await csrfFetch(createEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(form.value)
    })
    if (response.ok) {
      ElMessage({
        message: 'Sync Setting created successfully',
        type: 'success'
      })
    } else {
      response.json().then((err) => {
        ElMessage({ message: err.msg, type: 'warning' })
      })
    }
  }

  const fetchSyncRecords = async (current) => {
    const mirrorsEndpoint = '/internal_api/admin/sync_settings/sync_repos'
    const response = await csrfFetch(
      `${mirrorsEndpoint}?page=${current || page.value}&per=${per.value}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    if (response.ok) {
      const { data } = await response.json()
      mirrors.value = data.data
      total.value = data.total
    } else {
      response.json().then((err) => {
        ElMessage({ message: err.msg, type: 'warning' })
      })
    }
  }

  onMounted(() => {
    fetchSyncRecords()
  })
</script>
