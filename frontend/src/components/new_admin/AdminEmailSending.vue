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
        <el-button>
          发送
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
  import { ref } from 'vue'

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
</script>