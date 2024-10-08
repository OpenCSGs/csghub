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
        <div class="px-[12px] py-[12px] rounded-full bg-brand-100] border-[8px] border-brand-50]">
          <SvgIcon name="edit_org_member_role" />
        </div>
        <img src="/images/invite_bg.png" class="w-[200px] absolute top-1 left-1" />
      </div>
    </template>
    <div class="flex justify-center flex-col m-auto w-full relative">
      <div class="text-[18px] leading-[28px] text-gray-900]">{{ $t('organization.edit.role') }}</div>
      <div class="text-[14px] leading-[20px] text-gray-600] font-light mb-5">{{ $t('organization.edit.roleTips') }}</div>
      <el-form
      :model="dataForm"
      :rules="rules"
      class="w-full"
      ref="form"
      >
        <el-form-item prop="role">
          <div class="flex flex-col w-full">
            <div>{{ $t('organization.members.role') }}</div>
            <el-select v-model="dataForm.role" size="large" :placeholder="$t('all.select')" >
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
        <el-button class="flex-1" size="large" color="#3250BD" type="primary" :loading="loading" @click="submitForm('form')">
          {{ $t('organization.members.confirm') }}
        </el-button>
      </div>
    </template>
  </el-dialog>

</template>
<script>
  import useFetchApi from "../../packs/useFetchApi"

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
        loading:false,
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
      async submitForm(formName) {
        this.loading = true
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            const options = {
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                old_role: this.formDataRaw.role,
                new_role: this.dataForm.role
              })
            }
            const url = `/organization/${this.organization.name}/members/${this.formDataRaw.username}`
            try {
              const { error } = await useFetchApi(url, options).put().json()
              if (error.value) {
                this.$message.error(response.error.msg)
                this.loading = false
                return
              } else {
                this.$message.success($t('organization.members.editRoleSuccess'))
                this.loading = false
                this.$emit('close')
                this.$emit('submit')
              }
            } catch (error) {
              this.$message.error(error.msg)
            }
          }
        })
      }
    }
  }
</script>