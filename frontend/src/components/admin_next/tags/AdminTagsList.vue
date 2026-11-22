<template>
  <Container
    :title="$t('admin.tags.title')"
    subtitle=""
    :breadcrumbs="[{ text: $t('admin.tags.title') }]">
    <div class="flex items-center justify-between gap-3 w-full pt-1">
      <!-- 搜索框 -->
      <el-input
        v-model="searchText"
        :placeholder="$t('admin.tags.searchPlaceholder')"
        size="large"
        clearable
        @input="fetchFirstPage"
        class="flex-1"
      />

      <!-- tag scope filter -->
      <el-select
        v-model="scope"
        size="large"
        :placeholder="$t('admin.tags.scope')"
        clearable
        @change="fetchtagsAndResetCategory"
        class="flex-1">
        <el-option
          label="model"
          value="model"></el-option>
        <el-option
          label="dataset"
          value="dataset"></el-option>
        <el-option
          label="code"
          value="code"></el-option>
        <el-option
          label="space"
          value="space"></el-option>
      </el-select>

      <!-- tag category filter -->
      <el-select
        v-model="keyword"
        size="large"
        :placeholder="$t('admin.tags.category')"
        @change="fetchFirstPage"
        class="flex-1">
        <el-option
          v-for="c in avaliableCategories"
          :label="c.name"
          :value="c.name"></el-option>
      </el-select>

      <router-link
        :to="{
          path: '/admin_panel/tags/new',
          query: { scope: scope || '', category: keyword || '' }
        }"
        class="shrink-0">
        <CsgButton
          class="btn btn-primary btn-md"
          :name="$t('admin.tags.create')" />
      </router-link>
    </div>

    <!-- new category -->
    <div class="text-[#101828] text-md my-4 flex gap-2 items-center">
      <p> {{ $t('admin.tags.newCategoryNotes') }} </p>
      <CsgButton
        :name="$t('admin.tags.newCategoryBtn')"
        class="btn btn-primary btn-sm"
        @click="dialogFormVisible = true" />
    </div>

    <Table
      :data="tags"
      size="small"
      :border="false"
      v-loading="loading"
      class="custom-table">
      <template #header>
        <div class="px-6 pt-5 pb-4 flex justify-start gap-2 items-center">
          <h2 class="text-18 text-md text-gray-900">
            {{ $t('admin.tags.tagList') }}
          </h2>
          <div class="px-2 py-1.5 bg-brand-50 rounded-xl outline outline-1 outline-offset-[-1px] outline-brand-200 inline-flex justify-start items-center">
            <span class="text-brand-700 text-xs font-normal leading-none">{{ total }} {{ $t('admin.tags.tagCount') }}</span>
          </div>
        </div>
      </template>
      <el-table-column
        prop="name"
        label="Name" />
      <el-table-column
        prop="show_name"
        label="Show Name" />
      <el-table-column
        prop="category"
        label="Category" />
      <el-table-column
        prop="scope"
        label="Scope" />
      <el-table-column
        prop="group"
        label="Group" />
      <el-table-column
        prop="created_at"
        label="Created At">
        <template #default="{ row }">
          {{ new Date(row.created_at).toLocaleString() }}
        </template>
      </el-table-column>
      <el-table-column
        label="Operations"
        width="200"
        fixed="right">
        <template #default="scope">
          <div class="flex gap-2">
            <router-link :to="`/admin_panel/tags/${scope.row.id}`">
              <CsgButton
                class="btn btn-secondary-gray btn-sm"
                :name="$t('admin.tags.tagDetailBtn')" />
            </router-link>
            <router-link :to="`/admin_panel/tags/${scope.row.id}/edit`">
              <CsgButton
                class="btn btn-primary btn-sm"
                :name="$t('admin.tags.editBtn')" />
            </router-link>
            <el-popconfirm
              popper-class="evaluation-popconfirm"
              :title="`${$t('admin.tags.deleteConfirm')}?`"
              @confirm="deleteTag(scope.row)">
              <template #reference>
                <CsgButton
                  class="btn btn-danger btn-sm px-[12px]"
                  :name="$t('admin.tags.delete')" />
              </template>
            </el-popconfirm>
          </div>
        </template>
      </el-table-column>
      <template
        #footer
        v-if="total > 0">
        <Pagination
          :current-page="page"
          :page-size="per"
          layout="prev, pager, next"
          :total="total"
          @update:current-page="handlePageChange" />
      </template>
    </Table>

    <!-- new category dialog -->
    <el-dialog
      v-model="dialogFormVisible"
      :title="$t('admin.tags.newCategory')"
      width="500"
    >
      <el-form :model="newCategoryForm">
        <el-form-item :label="$t('admin.tags.scope')">
          <el-select
            v-model="newCategoryForm.scope"
            size="large"
            :placeholder="$t('admin.tags.scope')">
            <el-option
              label="model"
              value="model"></el-option>
            <el-option
              label="dataset"
              value="dataset"></el-option>
            <el-option
              label="code"
              value="code"></el-option>
            <el-option
              label="space"
              value="space"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('admin.tags.name')">
          <el-input
            v-model="newCategoryForm.name"
            size="large"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('admin.tags.showName')">
          <el-input
            v-model="newCategoryForm.show_name"
            size="large"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer flex justify-end gap-2">
          <CsgButton class="btn btn-secondary-gray btn-md" :name="$t('admin.tags.editCancelBtn')" @click="dialogFormVisible = false" />
          <CsgButton class="btn btn-primary btn-md" :name="$t('admin.tags.editConfirmBtn')" @click="submitCategoryForm" />
        </div>
      </template>
    </el-dialog>
  </Container>
</template>

<script setup>
  import { Container, Pagination, Table } from '../admin_component'
  import { ref, onMounted, computed } from 'vue'
  import useFetchApi from '../../../packs/useFetchApi'
  import { ElMessage } from 'element-plus'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()

  const tags = ref([])
  const keyword = ref('')
  const scope = ref('')
  const searchText = ref('')
  const page = ref(1)
  const per = ref(10)
  const total = ref(0)
  const loading = ref(false)

  const tagCategories = ref([])

  const dialogFormVisible = ref(false)

  const newCategoryForm = ref({
    enabled: true,
    scope: '',
    name: '',
    show_name: ''
  })

  const avaliableCategories = computed(() => {
    if (scope.value === '') {
      return []
    } else {
      return tagCategories.value.filter((c) => c.scope === scope.value)
    }
  })

  let latestRequest = 0

  const handlePageChange = (newPage) => {
    if (page.value !== newPage) {
      page.value = newPage
      fetchtags()
    }
  }

  const fetchFirstPage = () => {
    page.value = 1
    fetchtags()
  }

  const fetchtagsAndResetCategory = () => {
    keyword.value = ''
    fetchFirstPage()
  }

  const fetchtags = async () => {
    const request = ++latestRequest
    loading.value = true
    const params = new URLSearchParams({ page: page.value, per: per.value })
    if (keyword.value) params.set('category', keyword.value)
    if (scope.value) params.set('scope', scope.value)
    if (searchText.value) params.set('search', searchText.value)

    try {
      const { data, error } = await useFetchApi(`/tags?${params}`).json()
      if (request !== latestRequest) return
      if (error.value) {
        ElMessage.error(error.value.msg || error.value)
        return
      }
      total.value = data.value.total ?? 0
      const lastPage = Math.max(1, Math.ceil(total.value / per.value))
      if (page.value > lastPage) {
        handlePageChange(lastPage)
        return
      }
      tags.value = data.value.data
    } finally {
      if (request === latestRequest) loading.value = false
    }
  }

  const deleteTag = async (tag) => {
    const { data, error } = await useFetchApi(`/tags/${tag.id}`, {
      method: 'DELETE'
    }).json()
    if (data) {
      ElMessage.success(t('admin.tags.opSuccess'))
      fetchtags()
    } else {
      ElMessage.error(error.value.msg)
    }
  }

  const fetchTagCategories = async () => {
    const { data, error } = await useFetchApi('/tags/categories').json()
    if (data.value) {
      tagCategories.value = data.value.data
    } else {
      ElMessage.error(`Failed to fetch tag category: ${error.value}`)
    }
  }

  const submitCategoryForm = async () => {
    const { data, error } = await useFetchApi(`/tags/categories`, {
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newCategoryForm.value)
    }).post().json()
    if (data.value) {
      ElMessage.success('Category created successfully')
      dialogFormVisible.value = false
      fetchUser()
    } else {
      ElMessage.error(error.value.msg)
    }
  }

  onMounted(() => {
    fetchTagCategories()
    fetchtags()
  })
</script>

<style scoped>
  :deep(.el-form-item__label) {
    line-height: 32px !important;
  }
  :deep(.el-dialog__body) {
    padding: 0 !important;
  }
  :deep(.el-dialog__header) {
    padding-bottom: 47px;
  }
</style>