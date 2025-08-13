<template>
  <Container
    :title="$t('admin.broadcasts.create')"
    :showBack="true"
    :breadcrumbs="[
      { text: $t('admin.broadcasts.title'), to: '/admin_panel/broadcasts' },
      { text: $t('admin.broadcasts.create') }
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
          <!-- Temporarily hidden, to be shown after subsequent development --> 
          <!-- <el-option
            :label="message"
            value="message"
          /> -->
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
        :label="$t('admin.broadcasts.status')"
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
          :name="$t('admin.broadcasts.create')"
          @click="handleSubmit"
        />
      </div>
    </el-form>
  </Container>
</template>

<script setup>
  import { Container } from '../admin_component'
  import { ref } from 'vue'
  import { ElMessage } from 'element-plus'
  import { useRouter } from 'vue-router'
  import useFetchApi from '@/packs/useFetchApi'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()

  const router = useRouter()

  const dataForm = ref({
    content: '',
    bc_type: 'banner',
    theme: 'dark',
    status: 'inactive'
  })

  const isActive = ref(false)

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
          value: t('admin.broadcasts.bc_type')
        }),
        trigger: 'blur'
      }
    ],
    theme: [
      {
        required: true,
        message: t('all.pleaseSelect', {
          value: t('admin.broadcasts.theme')
        }),
        trigger: 'blur'
      }
    ]
  }

  const handleSubmit = () => {
    dataFormRef.value.validate((valid) => {
      if (valid) {
        createBroadcast()
      }
    })
  }

  const createBroadcast = async () => {
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataForm.value)
    }

    const { data, error } = await useFetchApi(
      `/admin/broadcasts`,
      options
    ).json()

    if (data.value) {
      ElMessage.success('Broadcast created successfully')
      router.replace({ path: `/admin_panel/broadcasts` })
    } else {
      ElMessage.error(error.value.msg)
    }
  }

  const toggleStatus = () => {
    if(isActive.value) {
      dataForm.value.status = 'active'
    } else {
      dataForm.value.status = 'inactive'
    }
  }
</script>
