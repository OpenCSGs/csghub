<template>
  <Container
    :title="$t('admin.tags.title')"
    subtitle=""
    :breadcrumbs="[{ text: $t('admin.tags.title') }]">
    <div class="flex items-center justify-between gap-3 w-full pt-1">
      <el-input
        v-model="keyword"
        placeholder="category name"
        size="large"
        :prefix-icon="Search"
        @input="fetchtags" />
      <el-select
        v-model="scope"
        size="large"
        placeholder="scope name"
        clearable
        @change="fetchtags">
        <el-option
          label="model"
          value="model"></el-option>
        <el-option
          label="dataset"
          value="dataset"></el-option>
      </el-select>
      <router-link
        to="/admin_panel/tags/new"
        class="shrink-0">
        <CsgButton
          class="btn btn-primary btn-md"
          :name="$t('admin.tags.create')" />
      </router-link>
    </div>
    <Table
      :title="$t('admin.tags.tagList')"
      :data="paginatedTags"
      size="small"
      :border="false"
      v-loading="loading"
      class="custom-table">
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
          v-model:current-page="page"
          :page-size="per"
          layout="prev, pager, next"
          :total="total"
          @current-change="handlePageChange" />
      </template>
    </Table>
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
  const page = ref(1)
  const per = ref(10)
  const total = ref(0)
  const loading = ref(false)

  const paginatedTags = computed(() => {
    if (!Array.isArray(tags.value) || tags.value.length === 0) {
      return []
    } else {
      const start = (page.value - 1) * per.value
      const end = start + per.value
      return tags.value.slice(start, end)
    }
  })

  const handlePageChange = (newPage) => {
    page.value = newPage
  }

  const fetchtags = async (current) => {
    loading.value = true
    const { data, error } = await useFetchApi(
      `/tags?page=${current || page.value}&per=${per.value}&category=${
        keyword.value
      }&scope=${scope.value || ''}`
    ).json()
    if (data.value) {
      tags.value = data.value.data
      total.value = data.value.data?.length || 0
    } else {
      ElMessage.error(error.value.msg)
    }
    page.value = 1
    loading.value = false
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

  onMounted(() => {
    fetchtags()
  })
</script>
