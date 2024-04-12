<template>
  <el-dialog
    :title="$t('organization.members.editRole')"
    v-model="dialogVisible"
    width="30%"
    @close="handleClose"
  >
    <el-form
      :model="formDataRaw"
      label-width="100px"
      :rules="rules"
      ref="form"
    >
      <el-form-item :label="$t('organization.members.role')" prop="role">
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