<template>
  <el-dialog
    :title="$t('organization.members.editRole')"
    v-model="dialogVisible"
    width="350"
    :style="{ borderRadius: '10px' }"
    @close="handleClose"
  >
    <template #header="{ close }">
      <div class="flex justify-between">
        <div class="px-[12px] py-[12px] rounded-full bg-[#ACBDFF] border-[8px] border-[#CED8FF]">
          <SvgIcon name="edit_org_member_role" />
        </div>
        <img src="/images/invite_bg.png" class="w-[200px] absolute top-1 left-1" />
      </div>
    </template>
    <div class="flex justify-center flex-col m-auto w-full relative">
      <div class="text-[18px] leading-[28px] text-[#101828]">{{ $t('organization.edit.role') }}</div>
      <div class="text-[14px] leading-[20px] text-[#475467] font-light mb-5">{{ $t('organization.edit.roleTips') }}</div>
      <el-form
      :model="dataForm"
      :rules="rules"
      class="w-full"
      ref="form"
      >
        <el-form-item prop="role">
          <div class="flex flex-col w-full">
            <div>{{ $t('organization.members.role') }}</div>
            <el-select v-model="dataForm.role" size="large" :placeholder="this.$t('all.select')" >
              <el-option
                v-for="item in roleMappings"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <div class="dialog-footer flex justify-between">
        <el-button class="flex-1 mr-3 text-gray-700" size="large" @click="handleClose">{{ $t('organization.members.cancel') }}</el-button>
        <el-button class="flex-1" size="large" color="#3250BD" type="primary" @click="submitForm('form')">
          {{ $t('organization.members.confirm') }}
        </el-button>
      </div>
    </template>
  </el-dialog>

</template>
<script>
  import csrfFetch from "../../packs/csrfFetch.js"
  import jwtFetch from "../../packs/jwtFetch.js"
  import { inject } from 'vue'

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
        dataForm: Object.assign({}, this.formDataRaw),
        roleMappings: [
          { value: 'read', label: 'read' },
          { value: 'write', label: 'write' },
          { value: 'admin', label: 'admin' }
        ],
        rules: {
          role: [
            { required: true, message: 'Please select a role', trigger: 'change' }
          ]
        },
        csghubServer: inject('csghubServer')
      }
    },
    watch: {
      visible(val) {
        this.dialogVisible = val
      },
      formDataRaw(val) {
        this.dataForm = Object.assign({}, val)
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
              body: JSON.stringify({
                old_role: this.formDataRaw.role,
                new_role: this.dataForm.role
              })
            }
            const url = `${this.csghubServer}/api/v1/organizations/${this.organization.name}/members/${this.formDataRaw.name}`
            jwtFetch(url, options)
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