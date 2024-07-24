<template>
  <div
    class="flex justify-center md:flex-col h-auto px-[24px] py-[36px] my-[24px] rounded-[8px] md:px-[50px] sm:px-[20px] max-w-[1280px] m-auto bg-white"
  >
    <Menu
      class="max-w-[411px] md:mb-[24px]"
      :name="profileName"
      :email="email"
      :displayName="profileDisplayName"
      :avatar="profileAvatar"
    >
    </Menu>
    <div class="grow py-[24px]">
      <h3 class="text-[#303133] text-[20px] font-[600]">SSH Keys</h3>
      <button
        @click="centerDialogVisible = true"
        class="rounded-[4px] border bg-[#FFF] py-[5px] px-[16px] text-[#606266] text-[14px] font-[500] mt-[32px]"
      >
        {{ $t('sshKey.addSshKey') }}
      </button>
      <div
        v-if="theSshKeys === '[]'"
        class="mt-[16px] rounded-sm w-full bg-[#F0F3FF] py-[9px] px-[16px] text-[#4D6AD6]"
      >
        {{ $t('sshKey.noKeyTips') }}
      </div>
      <ssh-key-card
        v-for="sshkey in JSON.parse(theSshKeys)"
        :profile-name="profileName"
        :ssh-key-name="sshkey.name"
        :ssh-key="sshkey.content"
        :ssh-key-id="sshkey.id"
        :create-time="sshkey.created_at"
      >
      </ssh-key-card>
      <el-dialog
        v-model="centerDialogVisible"
        :title="this.$t('sshKey.addSshKey')"
        width="30%"
        class="dialogWidth"
        style="border-radius: 0.5rem"
        left
      >
        <el-form
          :model="formData"
          :rules="formRules"
          ref="formRules"
        >
          <div class="mb-[16px]">
            <p class="text-[#303133] text-[14px] mb-[8px]">
              {{ $t('sshKey.sshKeyName') }} <span class="text-red-400">*</span>
            </p>
            <el-input
              v-model="theSshKeyName"
              placeholder="Key"
              maxlength="20"
            />
          </div>
          <div>
            <p class="text-[#303133] text-[14px] mb-[8px]">
              {{ $t('sshKey.sshKeyContent')
              }}<span class="text-red-400">*</span>
            </p>
            <el-form-item prop="theSshKey">
              <el-input
                v-model="formData.theSshKey"
                :rows="6"
                type="textarea"
                placeholder="Starts with 'ssh-rsa', 'ecdsa-sha2-nistp256', 'ecdsa-sha2-nistp384', 'ecdsa-sha2-nistp521', 'ssh-ed25519', 'sk-ecdsa-sha2-nistp256@openssh.com', or 'sk-ssh-ed25519@openssh.com'"
              />
            </el-form-item>
          </div>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="centerDialogVisible = false">Cancel</el-button>
            <el-button
              type="primary"
              @click="submitSshKey"
            >
              {{ $t('all.add') }}
            </el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  import Menu from './Menu.vue'
  import SshKeyCard from './SshKeyCard.vue'
  import { ElMessage } from 'element-plus'
  import { inject } from 'vue'
  import jwtFetch from '../../packs/jwtFetch'

  export default {
    props: {
      name: String,
      sshKeys: String
    },
    components: {
      Menu,
      SshKeyCard
    },

    data() {
      return {
        csghubServer: inject('csghubServer'),
        centerDialogVisible: false,
        sshKeyWarningDialogVisible: false,
        profileName: this.name,
        profileDisplayName: this.displayName,
        profileAvatar: this.avatar,
        theSshKeys: this.sshKeys,
        theSshKeyName: '',
        formData: {
          theSshKey: ''
        },
        formRules: {
          theSshKey: [
            { validator: this.validateTheSshKey, trigger: 'blur' } // blur: 聚焦时触发验证
          ]
        }
      }
    },

    mounted() {},

    methods: {
      // 验证theSshKey
      async validateTheSshKey(rule, value, callback) {
        let regex =
          /^(ssh-rsa|ecdsa-sha2-nistp256|ecdsa-sha2-nistp384|ecdsa-sha2-nistp521|ssh-ed25519|sk-ecdsa-sha2-nistp256@openssh.com|sk-ssh-ed25519@openssh.com)/

        if (!value) {
          callback(new Error('Please input the ssh key'))
          return
        }
        // 正则校验theSshKey
        if (!regex.test(value)) {
          callback(new Error('Invalid SSH key'))
        }
      },

      submitSshKey() {
        if (this.theSshKeyName == '') {
          ElMessage({ message: this.$t('sshKey.nameWarning'), type: 'warning' })
          return
        }
        if (this.formData.theSshKey == '') {
          ElMessage({
            message: this.$t('sshKey.contentWarning'),
            type: 'warning'
          })
          return
        }

        // 异步操作: 提交时验证表单(注意: 验证通过时valid为true，否则为false)
        this.$refs.formRules.validate((valid) => {
          if (valid) {
            // 异步发送请求
            this.createTheSshKey().catch((err) => {
              ElMessage({
                message: err.message,
                type: 'warning'
              })
            })
          }
        })
      },

      async createTheSshKey() {
        const options = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: this.profileName,
            name: this.theSshKeyName,
            content: this.formData.theSshKey
          })
        }
        const SshKeyCreateEndpoint = `${this.csghubServer}/api/v1/user/${this.profileName}/ssh_keys`
        const response = await jwtFetch(SshKeyCreateEndpoint, options)

        if (!response.ok) {
          return response.json().then((data) => {
            throw new Error(data.msg)
          })
        } else {
          setTimeout(() => {
            window.location.href = '/settings/ssh-keys'
          }, 1000)
          ElMessage({ message: this.$t('all.addSuccess'), type: 'success' })
        }
      }
    }
  }
</script>
<style>
  .dialogWidth {
    width: 30%;
  }

  @media (max-width: 640px) {
    .dialogWidth {
      width: 80%;
    }
  }

  @media (min-width: 641px) and (max-width: 1024px) {
    .dialogWidth {
      width: 50%;
    }
  }

  @media (min-width: 1025px) {
    .dialogWidth {
      width: 30%;
    }
  }
</style>
