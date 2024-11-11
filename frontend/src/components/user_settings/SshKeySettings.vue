<template>
  <div
    class="flex justify-center md:flex-col px-[24px] rounded-md md:px-[50px] sm:px-[20px] max-w-[1280px] m-auto bg-white"
  >
    <Menu
      class="max-w-[411px] md:mb-[24px]"
      :name="name"
    >
    </Menu>
    <div class="grow flex flex-col gap-[24px] px-6 py-10 border-l min-h-[calc(100vh-153px)]">
      <h3 class="text-gray-700 text-xl font-[600]">SSH Keys</h3>
      <button
        @click="centerDialogVisible = true"
        class="rounded-xs border bg-white py-[5px] px-[16px] text-gray-500 text-sm font-[500] mt-[32px] w-[160px]"
      >
        {{ $t('sshKey.addSshKey') }}
      </button>
      <div
        v-if="theSshKeys.length === 0"
        class="mt-[16px] rounded-sm w-full bg-brand-25 py-[9px] px-[16px] text-brand-500"
      >
        {{ $t('sshKey.noKeyTips') }}
      </div>
      <ssh-key-card
        v-for="sshkey in theSshKeys"
        :profile-name="name"
        :ssh-key-name="sshkey.name"
        :ssh-key="sshkey.content"
        :ssh-key-id="sshkey.id"
        :create-time="sshkey.created_at"
      >
      </ssh-key-card>
      <el-dialog
        v-model="centerDialogVisible"
        :title="$t('sshKey.addSshKey')"
        width="30%"
        class="dialogWidth"
        style="border-radius: var(--border-radius-md)"
        left
      >
        <el-form
          :model="formData"
          :rules="formRules"
          ref="formRef"
        >
          <div class="mb-[16px]">
            <p class="text-gray-700 text-sm mb-[8px]">
              {{ $t('sshKey.sshKeyName') }} <span class="text-red-400">*</span>
            </p>
            <el-input
              v-model="theSshKeyName"
              placeholder="Key"
              maxlength="20"
            />
          </div>
          <div>
            <p class="text-gray-700 text-sm mb-[8px]">
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

<script setup>
  import Menu from './Menu.vue'
  import SshKeyCard from './SshKeyCard.vue'
  import { ElMessage } from 'element-plus'
  import { ref, onMounted } from 'vue'
  import useFetchApi from '../../packs/useFetchApi'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()

  const props = defineProps({
    name: String
  })

  const centerDialogVisible = ref(false)
  const sshKeyWarningDialogVisible = ref(false)
  const theSshKeys = ref([])
  const theSshKeyName = ref('')
  const formRef = ref(null)
  const formData = ref({
    theSshKey: ''
  })

  const validateTheSshKey = async (rule, value, callback) => {
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
  }

  const formRules = ref({
    theSshKey: [
      { validator: validateTheSshKey, trigger: 'blur' } // blur: 聚焦时触发验证
    ]
  })

  const submitSshKey = () => {
    if (theSshKeyName.value == '') {
      ElMessage({ message: t('sshKey.nameWarning'), type: 'warning' })
      return
    }
    if (formData.value.theSshKey == '') {
      ElMessage({
        message: t('sshKey.contentWarning'),
        type: 'warning'
      })
      return
    }

    // 异步操作: 提交时验证表单(注意: 验证通过时valid为true，否则为false)
    formRef.value.validate((valid) => {
      if (valid) {
        // 异步发送请求
        createTheSshKey().catch((err) => {
          ElMessage({
            message: err.message,
            type: 'warning'
          })
        })
      }
    })
  }

  const createTheSshKey = async () => {
    const options = {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: props.name,
        name: theSshKeyName.value,
        content: formData.value.theSshKey
      })
    }
    const SshKeyCreateEndpoint = `/user/${props.name}/ssh_keys`
    const { error } = await useFetchApi(SshKeyCreateEndpoint, options).post().json()

    if (error.value) {
      ElMessage({ message: error.value.msg, type: 'warning' })
    } else {
      setTimeout(() => {
        window.location.href = '/settings/ssh-keys'
      }, 1000)
      ElMessage({ message: t('all.addSuccess'), type: 'success' })
    }
  }

  const fetchSshKeys = async () => {
    const SshKeyEndpoint = `/user/${props.name}/ssh_keys`
    const { data, error } = await useFetchApi(SshKeyEndpoint).get().json()

    if (error.value) {
      ElMessage({
        message: error.value.msg,
        type: 'warning'
      })
    } else {
      theSshKeys.value = data.value.data || []
    }
  }

  onMounted(() => {
    fetchSshKeys()
  })
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
