<template>
  <Container
    :title="$t('admin.tagCategories.title')"
    subtitle=""
    :breadcrumbs="[{ text: $t('admin.tagCategories.title') }]"
  >
    <div class="flex items-center justify-between gap-3 w-full pt-1">
      <el-input
        v-model="search"
        :placeholder="$t('admin.tagCategories.searchPlaceholder')"
        class="w-full"
        size="large"
        clearable
      >
        <template #prefix>
          <el-icon class="el-input__icon">
            <Search />
          </el-icon>
        </template>
      </el-input>
      <router-link
        to="/admin_panel/tag_categories/new"
        class="shrink-0"
      >
        <CsgButton
          class="btn btn-primary btn-md"
          :name="$t('admin.tagCategories.create')"
        />
      </router-link>
    </div>
    <Table
      :data="categories"
      size="small"
      :border="false"
      v-loading="loading"
      class="custom-table">
      <template #header>
        <div class="px-6 pt-5 pb-4 flex justify-start gap-2 items-center">
          <h2 class="text-18 text-md text-gray-900">
            {{ $t('admin.tagCategories.listTitle') }}
          </h2>
          <div class="px-2 py-1.5 bg-brand-50 rounded-xl outline outline-1 outline-offset-[-1px] outline-brand-200 inline-flex justify-start items-center">
            <span class="text-brand-700 text-xs font-normal leading-none">{{ categories.length }} {{ $t('admin.tagCategories.categoryCount') }}</span>
          </div>
        </div>
      </template>
      <el-table-column
        prop="name"
        :label="$t('admin.tagCategories.name')"
      />
      <el-table-column
        prop="show_name"
        :label="$t('admin.tagCategories.showName')"
      >
        <template #default="{ row }">
          {{ row.show_name || '-' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="scope"
        :label="$t('admin.tagCategories.scope')"
      />
      <el-table-column
        prop="enabled"
        :label="$t('admin.tagCategories.enabled')"
      >
        <template #default="{ row }">
          {{ row.enabled ? 'Enabled' : 'Disabled' }}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('admin.operations')"
        width="260px"
        fixed="right"
      >
        <template #default="scope">
          <div class="flex gap-2">
            <CsgButton
              class="btn btn-primary btn-sm"
              :name="$t('admin.tagCategories.edit')"
              @click="
                $router.push({
                  path: `/admin_panel/tag_categories/${scope.row.id}/edit`,
                  query: { ...scope.row }
                })
              "
            />
            <el-popconfirm
              popper-class="evaluation-popconfirm"
              :title="`${$t('admin.tagCategories.deleteConfirm')}?`"
              @confirm="deleteCategory(scope.row)"
            >
              <template #reference>
                <CsgButton
                  class="btn btn-danger btn-sm px-[12px]"
                  :name="$t('admin.tagCategories.delete')"
                />
              </template>
            </el-popconfirm>
          </div>
        </template>
      </el-table-column>
    </Table>
  </Container>
</template>

<script setup>
  import { Container, Table } from '../admin_component'
  import { ref, onMounted } from 'vue'
  import useFetchApi from '@/packs/useFetchApi'
  import { ElMessage } from 'element-plus'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()

  const categories = ref([])
  const loading = ref(false)

  const fetchCategories = async () => {
    loading.value = true
    const { data, error } = await useFetchApi('/tags/categories').json()
    if (data.value) {
      categories.value = data.value.data
    } else {
      ElMessage.error(error.value.msg)
    }
    loading.value = false
  }

  const deleteCategory = async (category) => {
    const { response } = await useFetchApi(`/tags/categories/${category.id}`, {
      method: 'DELETE'
    }).json()
    if (response.value.ok) {
      ElMessage.success(t('admin.tagCategories.opSuccess'))
      fetchCategories()
    } else {
      ElMessage.error('Failed to delete Tag Category')
    }
  }

  onMounted(() => {
    fetchCategories()
  })
</script>
