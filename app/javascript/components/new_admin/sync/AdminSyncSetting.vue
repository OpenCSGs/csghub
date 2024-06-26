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
      ></el-table-column>
      <el-table-column
        prop="progress"
        label="Progress"
      ></el-table-column>
      <el-table-column
        prop="status"
        label="Status"
      ></el-table-column>
    </el-table>

    <el-pagination
      v-model:current-page="page"
      :page-size="per"
      layout="prev, pager, next"
      :total="total"
      @current-change="fetchMirrors"
      class="my-[52px] flex justify-center"
    />
  </div>
</template>

<script setup>
  import { ref, inject, onMounted } from 'vue'
  import { ElMessage } from 'element-plus'
  import jwtFetch from '../../../packs/jwtFetch'

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

  const csghubServer = inject('csghubServer')

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
    const response = await jwtFetch(
      `${csghubServer}/api/v1/sync/client_setting`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form.value)
      }
    )
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

  const fetchMirrors = async (current) => {
    const response = await jwtFetch(
      `${csghubServer}/api/v1/mirror/repos?page=${current || page.value}&per=${
        per.value
      }`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    if (response.ok) {
      const { data } = await response.json()
      mirrors.value = data
    } else {
      response.json().then((err) => {
        ElMessage({ message: err.msg, type: 'warning' })
      })
    }
  }

  onMounted(() => {
    fetchMirrors()
  })
</script>
