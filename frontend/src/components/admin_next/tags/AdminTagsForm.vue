<template>
  <Container
    :title="dataForm.name ? `Edit Tag #${dataForm.name}` : 'Create Tag'"
    :showBack="true"
    :breadcrumbs="[
      { text: $t('admin.tags.title'), to: `${BASE_URL}/tags` },
      breadcrumbsTitle === 'edit'
        ? {
            text: `Edit Tag #${dataForm.name}`,
            to: `${BASE_URL}/tags/${dataForm.name}`
          }
        : { text: 'Tags', to: `${BASE_URL}/tags` },
      { text: breadcrumbsTitle }
    ]">
    <el-form
      ref="dataFormRef"
      :model="dataForm"
      :rules="rules"
      class="w-full flex flex-col gap-[14px]"
      label-position="top">
      <el-form-item
        label="Name"
        prop="name"
        class="w-full">
        <el-input v-model="dataForm.name" />
      </el-form-item>
      <el-form-item
        label="Show Name"
        prop="show_name"
        class="w-full">
        <el-input v-model="dataForm.show_name" />
      </el-form-item>
      <el-form-item
        label="Category"
        prop="category"
        class="w-full">
        <el-select v-model="dataForm.category">
          <el-option
            label="model"
            value="model"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="Scope"
        prop="scope"
        class="w-full">
        <el-select
          v-model="dataForm.scope"
          size="large"
          placeholder="scope name">
          <el-option
            label="model"
            value="model"></el-option>
          <el-option
            label="dataset"
            value="dataset"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="Group"
        prop="group"
        class="w-full">
        <el-input v-model="dataForm.group" />
      </el-form-item>
      <el-form-item
        label="Built In"
        prop="built_in"
        class="w-full">
        <el-switch
          v-model="dataForm.built_in"
          size="large" />
      </el-form-item>
      <el-form-item class="w-full">
        <div class="flex justify-end w-full">
          <CsgButton
            class="btn btn-primary btn-md"
            :name="$t('admin.syncSetting.submit')"
            @click="handleSubmit" />
        </div>
      </el-form-item>
    </el-form>
  </Container>
</template>

<script setup>
  import { Container, Pagination, Table } from '../admin_component'
  import { ref, onMounted, computed } from 'vue'
  import useFetchApi from '../../../packs/useFetchApi'
  import { ElMessage } from 'element-plus'
  import { useRouter } from 'vue-router'
  import { BASE_URL } from '../router'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()
  const router = useRouter()

  const tagCategories = ref([])

  const breadcrumbsTitle = computed(() =>
    router.currentRoute.value.fullPath === '/admin_panel/tags/new'
      ? 'new'
      : 'edit'
  )

  const dataForm = ref({
    built_in: true,
    category: '',
    group: '',
    name: '',
    scope: '',
    show_name: ''
  })
  const dataFormRef = ref(null)
  const rules = {
    name: [{ required: true, message: 'name is required', trigger: 'blur' }],
    scope: [{ required: true, message: 'scope is required', trigger: 'change' }]
  }

  const handleSubmit = () => {
    dataFormRef.value.validate((valid) => {
      if (valid) {
        createOrUpdate()
      } else {
        return false
      }
    })
  }

  const createOrUpdate = () => {
    if (dataForm.value.id) {
      update()
    } else {
      create()
    }
  }

  const create = async () => {
    const { data } = await useFetchApi(`/tags`, {
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataForm.value)
    })
      .post()
      .json()
    if (data.value) {
      ElMessage({
        message: t('admin.createSuccess'),
        type: 'success'
      })
      router.push({ path: '/admin_panel/tags' })
    } else {
      ElMessage.error('Failed to create Tag')
    }
  }

  const update = async () => {
    const { data } = await useFetchApi(`/tags/${dataForm.value.id}`, {
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataForm.value)
    })
      .put()
      .json()
    if (data.value) {
      ElMessage({
        message: t('admin.updateSuccess'),
        type: 'success'
      })
      router.push(`/admin_panel/tags`)
    } else {
      ElMessage.error('Failed to update Tag')
    }
  }

  const fetchTag = async () => {
    const id = router.currentRoute.value.params.id
    const { data } = await useFetchApi(`/tags/${id}`).json()
    if (data.value) {
      const result = data.value
      dataForm.value = result.data
    } else {
      ElMessage.error('Failed to fetch user')
    }
  }

  const fetchTagCategories = async () => {
    const { data, error } = await useFetchApi("/tags/categories").json()
    if (data.value) {
      tagCategories.value = data.value.data
    } else {
      ElMessage.error(`Failed to fetch tag category: ${error.value}`)
    }
  }

  onMounted(() => {
    fetchTagCategories()
    if (breadcrumbsTitle.value == 'edit') {
      fetchTag()
    }
  })
</script>

<style>
  .el-form-item {
    margin-bottom: 24px;
  }
  .el-form-item__label {
    margin-bottom: 6px;
  }
  :deep(.el-input__wrapper) {
    border-radius: 8px;
  }
  :deep(.el-textarea__inner) {
    border-radius: 8px;
  }
  :deep(.el-upload--picture-card) {
    border: 0px;
  }
  .hide .el-upload.el-upload--picture-card {
    display: none;
  }
</style>
