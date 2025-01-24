<template>
  <Container
    :title="$t('admin.broadcasts.update')"
    :showBack="true"
    :breadcrumbs="[
      { text: $t('admin.broadcasts.title'), to: '/admin_panel/broadcasts' },
      { text: $t('admin.broadcasts.update') }
    ]"
  >
    <el-form
      ref="dataFormRef"
      :model="dataForm"
      :rules="rules"
      class="w-full"
      label-position="top"
    >
      <!-- bc type -->
      <el-form-item
        :label="$t('admin.broadcasts.bc_type')"
        prop="bc_type"
        class="w-full"
      >
        <el-select
          v-model="dataForm.bc_type"
          placeholder="Please select"
        >
          <el-option
            :label="banner"
            value="banner"
          />
          <el-option
            :label="message"
            value="message"
          />
        </el-select>
      </el-form-item>

      <!-- theme -->
      <el-form-item
        :label="$t('admin.broadcasts.theme')"
        prop="theme"
        class="w-full"
      >
        <el-select
          v-model="dataForm.theme"
          placeholder="Please select"
        >
          <el-option
            :label="light"
            value="light"
          />
          <el-option
            :label="dark"
            value="dark"
          />
        </el-select>
      </el-form-item>

      <!-- status -->
      <el-form-item
        :label="$t('admin.campaigns.status')"
        prop="status"
        width="140"
      >
        <el-switch
          v-model="isActive"
          @change="toggleStatus"
        />
      </el-form-item>

      <!-- content -->
      <el-form-item
        :label="$t('admin.broadcasts.content')"
        prop="content"
        class="w-full"
      >
        <el-input v-model="dataForm.content" type="textarea" :rows="2" />
      </el-form-item>

      <div class="flex justify-end">
        <CsgButton
          class="btn btn-primary btn-md"
          :name="$t('admin.broadcasts.update')"
          @click="handleSubmit"
        />
      </div>
    </el-form>
  </Container>
</template>

<script setup>
  import { Container } from '../admin_component'
  import { ref, onMounted } from 'vue'
  import { ElMessage } from 'element-plus'
  import { useRouter } from 'vue-router'
  import useFetchApi from '@/packs/useFetchApi'
  import { useI18n } from 'vue-i18n'
  import { useRoute } from 'vue-router'

  const { t } = useI18n()

  const router = useRouter()

  const dataForm = ref({
    content: '',
    bc_type: 'banner',
    theme: 'dark',
    status: 'inactive'
  })

  const isActive = ref(false)
  const route = useRoute()

  const dataFormRef = ref(null)
  const rules = {
    content: [
      {
        required: true,
        message: t('all.pleaseInput', { value: t('admin.broadcasts.content') }),
        trigger: 'blur'
      }
    ],
    bc_type: [
      {
        required: true,
        message: t('all.pleaseSelect', {
          value: t('admin.mirrors.bc_type')
        }),
        trigger: 'blur'
      }
    ],
    theme: [
      {
        required: true,
        message: t('all.pleaseSelect', {
          value: t('admin.mirrors.theme')
        }),
        trigger: 'blur'
      }
    ]
  }

  const handleSubmit = () => {
    dataFormRef.value.validate((valid) => {
      if (valid) {
        updateBroadcast()
      }
    })
  }

  const updateBroadcast = async () => {
    const id = route.params.id
    const options = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataForm.value)
    }

    const { data, error } = await useFetchApi(
      `/admin/broadcasts/${id}`,
      options
    ).json()

    if (data.value) {
      ElMessage.success('Broadcast updated')
    } else {
      ElMessage.warning(error.value.msg)
    }
  }

  const toggleStatus = () => {
    if(isActive.value) {
      dataForm.value.status = 'active'
    } else {
      dataForm.value.status = 'inactive'
    }
  }

  const fetchBroadcast = async () => {
    const id = route.params.id
    const { data, error } = await useFetchApi(`/admin/broadcasts/${id}`).json()

    if (data.value) {
      dataForm.value.bc_type = data.value.data.bc_type
      dataForm.value.content = data.value.data.content
      dataForm.value.theme = data.value.data.theme
      dataForm.value.status = data.value.data.status
      isActive.value = data.value.data.status === 'active' ? true : false
    } else {
      ElMessage.warning(error.value.msg)
    }
  }

  onMounted(() => {
    fetchBroadcast()
  })
</script>
