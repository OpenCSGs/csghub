<template>
  <el-dialog
    :title="$t('organization.members.editRole')"
    v-model="dialogVisible"
    width="30%"
    @close="handleClose"
  >
    <template #header="{ close }">
        <div class="flex justify-between">
          <div class="px-[12px] py-[12px] rounded-[10px] border-[2px] border-[#EAECF0]">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M19 21V15M16 18H22M12 15H8C6.13623 15 5.20435 15 4.46927 15.3045C3.48915 15.7105 2.71046 16.4892 2.30448 17.4693C2 18.2044 2 19.1362 2 21M15.5 3.29076C16.9659 3.88415 18 5.32131 18 7C18 8.67869 16.9659 10.1159 15.5 10.7092M13.5 7C13.5 9.20914 11.7091 11 9.5 11C7.29086 11 5.5 9.20914 5.5 7C5.5 4.79086 7.29086 3 9.5 3C11.7091 3 13.5 4.79086 13.5 7Z" stroke="#344054" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <img src="/images/invite_bg.png" class="w-[200px] absolute top-0 left-0" />
        </div>
    </template>
    <el-form
      :model="formDataRaw"
      label-width="100px"
      :rules="rules"
      ref="form"
    >
      <el-form-item :label="$t('organization.members.role')" prop="role">
        <div>{{ $t('organization.members.role') }}</div>
        <el-select v-model="dataForm.role" :placeholder="this.$t('all.select')" >
          <el-option
            v-for="item in roleMappings"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <div class="flex justify-between">
          <el-button type="primary" @click="submitForm('form')">{{ $t('organization.members.confirm') }}</el-button>
          <el-button @click="handleClose">{{ $t('organization.members.cancel') }}</el-button>
        </div>
      </el-form-item>
    </el-form>
  </el-dialog>

</template>
<script>
  import csrfFetch from "../../packs/csrfFetch.js"
  export default {
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      formDataRaw: {
        type: Object,
        default: () => ({})
      },
      organization: {
        type: Object,
        default: () => ({})
      }
    },
    data() {
      return {
        dialogVisible: this.visible,
        dataForm: this.formDataRaw || {},
        roleMappings: [
          { value: 'read', label: 'read' },
          { value: 'write', label: 'write' },
          { value: 'admin', label: 'admin' }
        ],
        rules: {
          role: [
            { required: true, message: 'Please select a role', trigger: 'change' }
          ]
        }
      }
    },
    watch: {
      visible(val) {
        this.dialogVisible = val
      },
      formDataRaw(val) {
        this.dataForm = val
      }
    },
    methods: {
      handleClose() {
        this.$refs.form.resetFields()
        this.$emit('close')
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const options = {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ user_role: this.dataForm.role })
            }
            const url = `/internal_api/organizations/${this.organization.name}/members/${this.formDataRaw.id}`
            csrfFetch(url, options)
              .then((res) => {
                if(res.ok) {
                  res.json().then((data) => {
                    this.$message.success(this.$t('organization.members.editRoleSuccess'))
                    this.$emit('close')
                    this.$emit('submit')
                  })
                } else {
                  res.json().then((data) => {
                    this.$message.error(data.message)
                  })
                }
              })
              .catch((err) => {
                this.$message.error('Edit role failed')
              })
          }
        })
      }
    }
  }
</script>