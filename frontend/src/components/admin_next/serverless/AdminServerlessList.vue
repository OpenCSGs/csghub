<template>
  <Container
    type="serverless"
    :title="$t('admin.serverless.title')"
    subtitle=""
    :breadcrumbs="[{ text: $t('admin.serverless.title') }]"
  >
    <!-- search & filter -->
    <!-- <div class="flex items-center py-1 gap-3 w-full pt-1">
      <el-input
        v-model="keyword"
        :placeholder="$t('admin.search') + ' ' + $t('admin.serverless.deployName')"
        size="large"
        clearable
        @input="searchServerless"
      >
        <template #prefix>
          <el-icon class="el-input__icon">
            <Search />
          </el-icon>
        </template>
      </el-input>
    </div> -->
    <Table
      :data="serverless"
      size="small"
      :border="false"
      class="custom-table">
      <template #header>
        <div class="px-6 pt-5 pb-4 flex justify-start gap-2 items-center">
          <h2 class="text-18 text-md text-gray-900">
            {{ $t('admin.serverless.listTitle') }}
          </h2>
          <div class="px-2 py-1.5 bg-brand-50 rounded-xl outline outline-1 outline-offset-[-1px] outline-brand-200 inline-flex justify-start items-center whitespace-nowrap">
            <span class="text-brand-700 text-xs font-normal leading-none">{{ total }} {{ $t('admin.serverless.serverlessCount') }}</span>
          </div>
        </div>
      </template>
      <el-table-column :label="$t('admin.serverless.deployName')" min-width="200" show-overflow-tooltip>
        <template #default="scope">
          <a
            :href="`/admin_panel/serverless/${scope.row.model_id}/${scope.row.deploy_id}`"
            target="_blank"
            class="underline"
          >
            {{ scope.row.deploy_name }}
          </a>
        </template>
      </el-table-column>
      <el-table-column
        prop="hardware"
        :label="$t('admin.serverless.resource')"
        min-width="240"
        show-overflow-tooltip
      >
        <template #default="scope">
          <div v-if="scope.row.hardware">
            <div v-if="typeof scope.row.hardware === 'string'">
              {{ formatHardware(scope.row.hardware) }}
            </div>
            <div v-else>
              <template v-if="scope.row.hardware.cpu">
                CPU: {{ scope.row.hardware.cpu.type || '' }} x {{ scope.row.hardware.cpu.num || '' }}
              </template>
              <template v-if="scope.row.hardware.memory">
                <span class="ml-1">· memory: {{ scope.row.hardware.memory }}</span>
              </template>
            </div>
          </div>
          <div v-else>-</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="runtime_framework"
        :label="$t('admin.serverless.runtimeFramework')"
        width="130"
      />
      <el-table-column
        prop="status"
        :label="$t('admin.serverless.status')"
        min-width="100"
      />
      <el-table-column
        :label="$t('admin.operations')"
        width="280px"
        fixed="right"
      >
        <template #default="scope">
          <div class="flex gap-2">
            <CsgButton
              class="btn btn-secondary-gray btn-sm"
              :name="$t('admin.serverless.detail')"
              @click="showDetail(scope.row)"
            />
            <CsgButton
              class="btn btn-primary btn-sm"
              :name="$t('admin.serverless.edit')"
              @click="shoeEdit(scope.row)"
            />
            <CsgButton
              v-if="scope.row.status === 'Stopped'"
              class="btn btn-danger btn-sm"
              :name="$t('all.delete')"
              @click="removeServerless(scope.row)"
            />
          </div>
        </template>
      </el-table-column>
      <template #footer>
        <Pagination
          v-model:current-page="page"
          :page-size="per"
          layout="prev, pager, next"
          :total="total"
          @current-change="fetchServerless"
        />
      </template>
    </Table>
  </Container>
</template>

<script setup>
  import { Container, Pagination, Table } from '../admin_component'
  import { ref, onMounted, inject } from 'vue'
  import { Search } from '@element-plus/icons-vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import useFetchApi from '../../../packs/useFetchApi'
  import useUserStore from '@/stores/UserStore'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()
  const userStore = useUserStore()

  const serverless = ref([])
  const page = ref(1)
  const per = ref(10)
  const total = ref(0)
  const keyword = ref('')

  const formatHardware = (hardware) => {
    try {
      if (typeof hardware === 'string') {
        const hw = JSON.parse(hardware)
        let result = []
        
        if (hw.cpu) {
          const cpuInfo = `CPU: ${hw.cpu.type || ''} x ${hw.cpu.num || ''}`
          result.push(cpuInfo.trim())
        }
        
        if (hw.memory) {
          result.push(`memory: ${hw.memory}`)
        }
        
        return result.join(' · ')
      }
      return hardware
    } catch (e) {
      return hardware
    }
  }

  const fetchServerless = async (current) => {
    const { data, error } = await useFetchApi(
      `/user/${userStore.username}/run/serverless?page=${
        current || page.value
      }&per=${per.value}&search=${keyword.value}&search_field=deploy_name`
    ).json()
    if (data.value) {
      const res_json = data.value
      serverless.value = res_json.data
      total.value = res_json.total
    } else {
      ElMessage.error(error.value.msg || 'Failed to fetch serverless')
    }
  }

  const searchServerless = () => {
    page.value = 1
    fetchServerless()
  }

  const showDetail = (detail) => {
    window.location.href = `/admin_panel/serverless/${detail.model_id}/${detail.deploy_id}`
  }

  const shoeEdit = (detail) => {
    window.location.href = `/admin_panel/serverless/${detail.model_id}/${detail.deploy_id}/edit`
  }

  const removeServerless = async (detail) => {
    try {
      await ElMessageBox.confirm(
        t('admin.systemConfig.removeTips'),
        t('admin.systemConfig.removeTitle'),
        {
          confirmButtonText: t('all.confirm'),
          cancelButtonText: t('all.cancel'),
          type: 'warning'
        }
      )
        .then(() => {
          deleteServerless(detail)
        })
        .catch(() => {
          console.log('cancel')
        })
    } catch (error) {
      console.log(error)
    }
  }
  
  const deleteServerless = async (detail) => {
    const [namespace, name] = detail.model_id.split('/');
    const removeData = {
        namespace,
        name
    };
    const options = { body: JSON.stringify(removeData) }
    const url = `/models/${detail.model_id}/serverless`
    const { error } = await useFetchApi(url, options).delete().json()
    if (error.value) {
      ElMessage({ message: error.value.msg, type: 'warning' })
    } else {
      ElMessage({ message: t('all.delSuccess'), type: 'success' })
      window.location.href = `/admin_panel/serverless`
    }
  }

  onMounted(() => {
    fetchServerless()
  })
</script>
