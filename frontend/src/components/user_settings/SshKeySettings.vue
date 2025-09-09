<template>
  <div
    class="flex justify-center md:flex-col px-[24px] rounded-md md:px-[50px] sm:px-[20px] page-responsive-width m-auto bg-white"
  >
    <Menu
      class="max-w-[411px] md:mb-[24px]"
      :name="name"
    >
    </Menu>
    <div class="grow flex flex-col gap-4 px-6 py-10 border-l md:border-l-0 min-h-[calc(100vh-153px)] md:min-h-0">
      <div class="max-w-[512px]">
        <div class="mb-[16px]">
          <h3 class="mb-1 text-gray-700 text-md font-medium">SSH Keys</h3>
          <p class="text-gray-500 text-sm font-normal">{{ $t('sshKey.desc') }}</p>
        </div>
        <div
          v-if="theSshKeys.length === 0"
          class="rounded-sm w-full bg-brand-25 py-2 px-4 text-brand-600"
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
        <div class="mt-[16px]">
          <CsgButton
            @click="centerDialogVisible = true"
            class="btn btn-primary btn-md w-fit"
            :name="$t('sshKey.addSshKey')"
          />
        </div>
      </div>
      <el-dialog
        v-model="centerDialogVisible"
        :title="$t('sshKey.addSshKey')"
        width="30%"
        class="dialogWidth"
        style="border-radius: var(--border-radius-md)"
        left
        @close="handleDialogClose"
        @open="handleDialogOpen"
      >
        <el-form
          :model="formData"
          :rules="formRules"
          ref="formRef"
        >
          <div class="mb-[16px]">
            <p class="text-gray-700 text-sm mb-[8px]">
              {{ $t('sshKey.sshKeyName') }}
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
                @input="handleSshKeyInput"
                placeholder="Starts with 'ssh-rsa', 'ecdsa-sha2-nistp256', 'ecdsa-sha2-nistp384', 'ecdsa-sha2-nistp521', 'ssh-ed25519', 'sk-ecdsa-sha2-nistp256@openssh.com', or 'sk-ssh-ed25519@openssh.com'"
              />
            </el-form-item>
          </div>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <CsgButton
              class="btn btn-secondary-gray btn-sm w-fit mr-3"
              @click="handleDialogClose"
              :name="$t('all.cancel')"
            />
            <CsgButton
              id="add-ssh-key-button"
              class="btn btn-primary btn-sm w-fit"
              :name="$t('all.add')"
              @click="submitSshKey"
            />
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
  import useFetchApi from '@/packs/useFetchApi'
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

  const resetForm = () => {
    theSshKeyName.value = ''
    formData.value.theSshKey = ''
    if (formRef.value) {
      formRef.value.resetFields()
    }
  }

  const handleDialogClose = () => {
    centerDialogVisible.value = false
    resetForm()
  }

  const handleDialogOpen = () => {
    resetForm()
  }

  const submitSshKey = () => {
    if (theSshKeyName.value == '') {
      ElMessage.warning(t('sshKey.nameWarning'))
      return
    }
    if (formData.value.theSshKey == '') {
      ElMessage.warning(t('sshKey.contentWarning'))
      return
    }

    // 异步操作: 提交时验证表单(注意: 验证通过时valid为true，否则为false)
    formRef.value.validate((valid) => {
      if (valid) {
        // 异步发送请求
        createTheSshKey().catch((err) => {
          ElMessage.warning(err.message)
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
      ElMessage.warning(error.value.msg)
    } else {
      ElMessage.success(t('all.addSuccess'))
      setTimeout(() => {
        window.location.href = '/settings/ssh-keys'
      }, 1000)
    }
  }

  const fetchSshKeys = async () => {
    const SshKeyEndpoint = `/user/${props.name}/ssh_keys`
    const { data, error } = await useFetchApi(SshKeyEndpoint).get().json()

    if (error.value) {
      ElMessage.warning(error.value.msg)
    } else {
      theSshKeys.value = data.value.data || []
    }
  }

  const extractHostnameFromSshKey = (sshKey) => {
    // 匹配常见的 SSH key 格式，提取用户名和主机名
    const regex = /(?:ssh-rsa|ecdsa-sha2-nistp256|ecdsa-sha2-nistp384|ecdsa-sha2-nistp521|ssh-ed25519|sk-ecdsa-sha2-nistp256@openssh\.com|sk-ssh-ed25519@openssh\.com)\s+[^\s]+\s+([^@]+@[^\s]+)/;
    const match = sshKey.match(regex);
    if (match && match[1]) {
      return match[1];
    }
    return '';
  }

  const handleSshKeyInput = () => {
    // 只有当 SSH key 名称为空时才自动填充主机名
    if (!theSshKeyName.value) {
      const hostname = extractHostnameFromSshKey(formData.value.theSshKey);
      if (hostname) {
        theSshKeyName.value = hostname;
      }
    }
  }

  const addSshKey = async () => {
    try {
      await formRef.value.validate();

      const { error } = await useFetchApi(`/user/${props.name}/ssh_key/${theSshKeyName.value}`)
        .post({ ssh_key: formData.value.theSshKey })
        .json();

      if (error.value) {
        ElMessage.warning(error.value)
      } else {
        ElMessage.success(t('all.addSuccess'))
        centerDialogVisible.value = false;
        fetchSshKeys();
      }
    } catch (error) {
      console.error(error);
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
