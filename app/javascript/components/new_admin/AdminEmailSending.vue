<template>
  <div>
    <h3 class="text-[20x] font-[500] mb-[20px]">后台邮件发送</h3>
    <el-form
      ref="dataFormRef"
      :model="dataForm"
      :rules="rules"
      label-position="top"
    >
      <!-- 邮件 group 选择 -->
      <el-form-item label="邮件 Group 选择" class="w-[260px]" prop="group">
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
      <el-form-item label="邮件模版输入" prop="template">
        <el-input
          v-model="dataForm.template"
          :rows="20"
          type="textarea"
          placeholder="Provide email template here"
        > </el-input>
      </el-form-item>

      <el-form-item class="my-[40px]">
        <el-button @click="sendGroupMail">
          发送
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import csrfFetch from "../../packs/csrfFetch.js"
  import { ElMessage } from 'element-plus';

  const dataFormRef= ref(null)

  const dataForm = ref({
    group: 'all',
    template: ''
  })

  const emailGroups = ref([
    {value: 'all', label: '所有用户'}
  ])

  const rules = {
    group: [{required: true, message: '请选择邮件组'}],
    template: [{required: true, message: '请提供邮件模版'}]
  }

  const sendGroupMail = async() => {
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
        message: '邮件发送成功！',
        type: 'success'
      })
    } else {
      response.json().then(error => {
        ElMessage({
          message: error.message,
          type: 'error'
        })
      })
    }
  }
</script>