<template>
  <Container
    type="model"
    :title="$t('admin.models.title')"
    subtitle=""
    :breadcrumbs="[{ text: $t('admin.models.title') }]"
  >
    <!-- search & filter -->
    <div class="flex items-center py-1 gap-3 w-full pt-1">
      <el-input
        v-model="keyword"
        :placeholder="$t('admin.search') + ' ' + $t('admin.name') + ' / ' + $t('admin.owner')"
        size="large"
        :prefix-icon="Search"
        @input="debouncedSearch"
      />
    </div>
    <Table
      :data="models"
      size="small"
      :border="false"
      class="custom-table">
      <template #header>
        <div class="px-6 pt-5 pb-4 flex justify-start gap-2 items-center">
          <h2 class="text-18 text-md text-gray-900">
            {{ $t('admin.models.modelList') }}
          </h2>
          <div class="px-2 py-1.5 bg-brand-50 rounded-xl outline outline-1 outline-offset-[-1px] outline-brand-200 inline-flex justify-start items-center">
            <span class="text-brand-700 text-xs font-normal leading-none">{{ total }} {{ $t('admin.models.modelCount') }}</span>
          </div>
        </div>
      </template>
      <el-table-column
        :label="$t('admin.name')"
      >
        <template #default="scope">
          <a :href="`/models/${models[scope.$index].path}`" target="_blank" class="underline">
            {{ models[scope.$index].name }}
          </a>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('admin.owner')"
        scoped-slot="default"
      >
        <template #default="scope">
          {{ models[scope.$index].path.split('/')[0] }}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('admin.visibility')"
        scoped-slot="default"
      >
        <template #default="scope">
          {{ models[scope.$index].private == false ? 'public' : 'private' }}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('admin.weight')"
        scoped-slot="default"
      >
        <template #default="scope">
          {{ models[scope.$index].recom_op_weight || 1 }}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('admin.origin')"
        scoped-slot="default"
      >
        <template #default="scope">
          {{ 
            models[scope.$index].ms_path ? $t('admin.models.source.modelscope') : 
            models[scope.$index].hf_path ? $t('admin.models.source.huggingface') : 
            models[scope.$index].csghub_path ? $t('admin.models.source.opencsg') : 
            $t('admin.models.source.userUpload')
          }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('admin.operations')">
        <template #default="scope">
          <CsgButton
            class="btn btn-secondary-gray btn-sm"
            @click="showDetail(models[scope.$index].path)"
            :name="$t('admin.models.modelDetailBtn')"
          />
        </template>
      </el-table-column>
      <template #footer>
        <Pagination
          v-model:current-page="page"
          :page-size="per"
          layout="prev, pager, next"
          :total="total"
          @current-change="fetchModels"
        />
      </template>
    </Table>
  </Container>
</template>

<script setup>
  import { Container, Pagination, Table } from '../admin_component'
  import { ref, onMounted, onUnmounted, inject } from 'vue'
  import { debounce } from 'lodash'
  import { Search } from '@element-plus/icons-vue'
  import { ElMessage } from 'element-plus'
  import useFetchApi from '../../../packs/useFetchApi'

  const models = ref([])
  const page = ref(1)
  const per = ref(10)
  const total = ref(0)
  const keyword = ref('')

  const fetchModels = async (current) => {
    const { data, error } = await useFetchApi(
      `/models?need_op_weight=true&sort=trending&page=${
        current || page.value
      }&per=${per.value}&search=${keyword.value}`
    ).json()
    if (data.value) {
      const res_json = data.value
      models.value = res_json.data
      total.value = res_json.total
    } else {
      ElMessage.error(error.value.msg || 'Failed to fetch models')
    }
  }

  const searchModels = () => {
    page.value = 1
    fetchModels()
  }

  const debouncedSearch = debounce(searchModels, 500)

  onUnmounted(() => {
    debouncedSearch.cancel()
  })

  const showDetail = (path) => {
    window.location.href = `/admin_panel/models/${path}`
  }

  onMounted(() => {
    fetchModels()
  })
</script>
