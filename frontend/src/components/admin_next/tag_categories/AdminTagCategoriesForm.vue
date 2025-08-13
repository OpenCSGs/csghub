<template>
  <Container
    :title="breadcrumbsTitle"
    :showBack="true"
    :breadcrumbs="[
      {
        text: $t('admin.tagCategories.title'),
        to: `${BASE_URL}/tag_categories`
      },
      { text: breadcrumbsTitle }
    ]"
  >
    <el-form
      ref="dataFormRef"
      :model="dataForm"
      :rules="rules"
      class="w-full flex flex-col gap-[14px]"
      label-position="top"
    >
      <el-form-item
        :label="$t('admin.tagCategories.name')"
        prop="name"
        class="w-full"
      >
        <el-input v-model="dataForm.name" />
      </el-form-item>

      <el-form-item
        :label="$t('admin.tagCategories.showName')"
        prop="show_name"
        class="w-full"
      >
        <el-input v-model="dataForm.show_name" />
      </el-form-item>

      <el-form-item
        :label="$t('admin.tagCategories.scope')"
        prop="scope"
        class="w-full"
      >
        <el-select v-model="dataForm.scope">
          <el-option
            label="Model"
            value="model"
          />
          <el-option
            label="Dataset"
            value="dataset"
          />
          <el-option
            label="Code"
            value="code"
          />
          <el-option
            label="Space"
            value="space"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        :label="$t('admin.tagCategories.enabled')"
        prop="enabled"
        class="w-full"
      >
        <el-switch
          v-model="dataForm.enabled"
          :active-value="true"
          :inactive-value="false"
          size="large"
        />
      </el-form-item>

      <el-form-item class="w-full">
        <div class="flex justify-end w-full">
          <CsgButton
            class="btn btn-primary btn-md"
            :name="$t('admin.tagCategories.submit')"
            @click="handleSubmit"
          />
        </div>
      </el-form-item>
    </el-form>
  </Container>
</template>

<script setup>
  import { Container } from '../admin_component'
  import { ref, computed } from 'vue'
  import useFetchApi from '../../../packs/useFetchApi'
  import { ElMessage } from 'element-plus'
  import { useRoute, useRouter } from 'vue-router'
  import { BASE_URL } from '../router'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()
  const route = useRoute()
  const router = useRouter()

  const breadcrumbsTitle = computed(() =>
    route.params.id
      ? t('admin.tagCategories.editTitle')
      : t('admin.tagCategories.newTitle')
  )

  const dataForm = ref({
    name: '',
    show_name: '',
    scope: 'model',
    enabled: true
  })

  if (route.params.id) {
    dataForm.value = { ...route.query }
    dataForm.value.enabled = route.query.enabled === 'true'
  }

  const dataFormRef = ref(null)
  const rules = {
    name: [
      { required: true, message: 'Category name is required', trigger: 'blur' }
    ],
    scope: [{ required: true, message: 'Scope is required', trigger: 'change' }]
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
    const { data } = await useFetchApi('/tags/categories', {
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
      router.push({ path: '/admin_panel/tag_categories' })
    } else {
      ElMessage.error('Failed to create Tag Category')
    }
  }

  const update = async () => {
    const { data } = await useFetchApi(`/tags/categories/${dataForm.value.id}`, {
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
      router.push('/admin_panel/tag_categories')
    } else {
      ElMessage.error('Failed to update Tag Category')
    }
  }
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
</style>
