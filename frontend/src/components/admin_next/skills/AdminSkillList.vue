<template>
  <Container
    type="skill"
    :title="$t('admin.skills.title')"
    subtitle=""
    :breadcrumbs="[{ text: $t('admin.skills.title') }]"
  >
    <div class="flex items-center justify-between gap-3 w-full pt-1">
      <el-input
        v-model="keyword"
        :placeholder="$t('admin.search') + ' ' +  $t('admin.name') + ' / ' + $t('admin.owner')"
        class="w-full"
        size="large"
        clearable
        @input="debouncedSearch"
      >
        <template #prefix>
          <el-icon class="el-input__icon">
            <Search />
          </el-icon>
        </template>
      </el-input>

    </div>
    <Table
      :title="$t('admin.skills.skillList')"
      :data="skills"
      size="small"
      :border="false"
      class="custom-table"
    >
      <template #header>
        <div class="flex gap-3 w-full justify-between px-6 pt-5 pb-4">
          <div class="flex gap-2 items-center justify-center">
            <h2 class="text-18 text-md text-gray-900 min-w-[max-content]">{{ $t('admin.skills.skillList') }}</h2>
            <div class="px-2 py-1.5 bg-brand-50 rounded-xl outline outline-1 outline-offset-[-1px] outline-brand-200 inline-flex justify-start items-center whitespace-nowrap">
              <span class="text-brand-700 text-xs font-normal leading-none">{{ total }} {{ $t('admin.skills.skillCount') }}</span>
            </div>
          </div>
        </div>
      </template>
      <el-table-column
        :label="$t('admin.name')"
      >
        <template #default="scope">
          <a :href="`/skills/${scope.row.path}`" target="_blank" class="underline">
            {{ scope.row.name }}
          </a>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('admin.owner')"
        scoped-slot="default"
      >
        <template #default="scope">
          {{ skills[scope.$index].path.split('/')[0] }}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('admin.visibility')"
        scoped-slot="default"
      >
        <template #default="scope">
          {{ skills[scope.$index].private == false ? 'public' : 'private' }}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('admin.weight')"
        scoped-slot="default"
      >
        <template #default="scope">
          {{ skills[scope.$index].recom_op_weight || 1 }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('admin.operations')">
        <template #default="scope">
          <CsgButton
            class="btn btn-secondary-gray btn-sm"
            @click="showDetail(skills[scope.$index].path)"
            :name="$t('admin.skills.skillDetailBtn')"
          />
        </template>
      </el-table-column>
      <template #footer>
        <Pagination
          v-model:current-page="page"
          :page-size="per"
          layout="prev, pager, next"
          :total="total"
          @current-change="fetchSkills"
        />
      </template>
    </Table>
  </Container>
</template>

<script setup>
  import { Container, Pagination, Table } from '../admin_component'
  import { ref, onMounted, onUnmounted } from 'vue'
  import { Search } from '@element-plus/icons-vue'
  import { debounce } from 'lodash'
  import { ElMessage } from 'element-plus'
  import useFetchApi from '../../../packs/useFetchApi'

  const skills = ref([])
  const page = ref(1)
  const per = ref(10)
  const total = ref(0)
  const keyword = ref('')

  const fetchSkills = async (current) => {
    const { data, error } = await useFetchApi(
      `/skills?need_op_weight=true&sort=trending&page=${current || page.value}&per=${
        per.value
      }&search=${keyword.value}`
    ).json()
    if (data.value) {
      const res_json = data.value
      skills.value = res_json.data
      total.value = res_json.total
    } else {
      ElMessage.error(error.value.msg || 'Failed to fetch skills')
    }
  }

  const searchSkills = () => {
    page.value = 1
    fetchSkills()
  }

  const debouncedSearch = debounce(searchSkills, 500)

  const showDetail = (path) => {
    window.location.href = `/admin_panel/skills/${path}`
  }

  onMounted(() => {
    fetchSkills()
  })

  onUnmounted(() => {
    debouncedSearch.cancel()
  })
</script>
