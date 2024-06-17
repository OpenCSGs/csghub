<template>
  <div>
    <h3 class="text-[20x] font-[500] mb-[20px]">
      {{ $t('admin.emailSending.title') }}
    </h3>
    <el-form
      ref="dataFormRef"
      :model="dataForm"
      :rules="rules"
      label-position="top"
    >
      <!-- 邮件 group 选择 -->
      <el-form-item
        :label="$t('admin.emailSending.mailGroupSelect')"
        class="w-[260px]"
        prop="group"
      >
        <el-select
          v-model="dataForm.group"
          placeholder="Select"
          size="large"
        >
          <el-option
            v-for="item in emailGroups"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <!-- 邮件模版输入 -->
      <el-form-item
        :label="$t('admin.emailSending.mailTemplateInput')"
        prop="template"
      >
        <el-input
          v-model="dataForm.template"
          :rows="20"
          type="textarea"
          placeholder="Provide email template here"
        >
        </el-input>
      </el-form-item>

      <el-form-item class="my-[40px]">
        <el-button @click="sendGroupMail">
          {{ $t('admin.emailSending.send') }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import csrfFetch from '../../packs/csrfFetch.js'
  import { ElMessage } from 'element-plus'
  import { useI18n } from 'vue-i18n'

  const dataFormRef = ref(null)

  const { t } = useI18n()

  const dataForm = ref({
    group: 'all',
    template: ''
  })

  const emailGroups = ref([
    { value: 'all', label: t('admin.emailSending.allUsers') }
  ])

  const rules = {
    group: [{ required: true, message: t('admin.emailSending.groupMissing') }],
    template: [
      { required: true, message: t('admin.emailSending.templateMissing') }
    ]
  }

  const sendGroupMail = async () => {
    const params = Object.assign({}, dataForm.value)
    const groupMailerEndpoint = `/internal_api/admin/group_mail`
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    }
    const response = await csrfFetch(groupMailerEndpoint, options)
    if (response.ok) {
      ElMessage({
        message: t('admin.emailSending.sendSuccess'),
        type: 'success'
      })
    } else {
      response.json().then((error) => {
        ElMessage({
          message: error.message,
          type: 'error'
        })
      })
    }
  }
</script>