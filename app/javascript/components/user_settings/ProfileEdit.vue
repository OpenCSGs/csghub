<template>
  <div class="flex flex-col gap-[24px] px-6 py-10 border-l">
    <el-alert
      v-if="canChangeUsername === 'true'"
      :title="$t('profile.edit.renameUsername')"
      center
      show-icon
      type="warning">
    </el-alert>
    <div class="font-semibold text-[20px] leading-[28px]">
      {{ $t('profile.edit.title') }}
    </div>
    <!-- name -->
    <div>
      <div class="flex items-center gap-[4px] mb-[8px]">
        {{ $t('all.userName') }}
      </div>
      <el-input
        class="max-w-[600px]"
        v-model="profileData.username"
        :disabled="canChangeUsername === 'false'"
        :placeholder="this.$t('all.userName')">
      </el-input>
      <p class="text-gray-500 text-[12px] italic pt-1">
        {{ $t('rule.nameRule') }}
      </p>
    </div>
    <!-- avatar -->
    <div>
      <div class="flex items-center gap-[4px] mb-[8px]">用户头像</div>
      <el-avatar
        :size="120"
        :src="profileData.avatar">
      </el-avatar>
      <div class="flex gap-[12px] fileInput">
        <input
          ref="fileInput"
          type="file"
          class="hidden"
          @change="uploadAvatar" />
        <div
          @click="uploadImage"
          class="text-[14px] border border-[#DCDFE6] px-[20px] py-[9px] leading-[22px] text-center rounded-[8px] text-white cursor-pointer bg-[#409EFF]">
          {{ $t('profile.edit.uploadAvatar') }}
        </div>
        <div
          @click="removeImage"
          class="text-[14px] border border-[#DCDFE6] px-[20px] py-[9px] leading-[22px] text-center rounded-[8px] text-[#606266] cursor-pointer bg-white">
          {{ $t('profile.edit.removeAvatar') }}
        </div>
      </div>
    </div>
    <!-- nickname -->
    <div>
      <div class="flex items-center gap-[4px] mb-[8px]">
        {{ $t('all.nickName') }}
      </div>
      <el-input
        class="max-w-[600px]"
        v-model="profileData.nickname"
        :placeholder="$t('all.nickName')">
      </el-input>
    </div>
    <!-- homepage -->
    <div>
      <div class="flex items-center gap-[4px] mb-[8px]">
        {{ $t('all.homepage') }}
      </div>
      <el-input
        class="max-w-[600px]"
        v-model="profileData.homepage"
        :placeholder="$t('all.homepage')">
      </el-input>
    </div>
    <!-- bio -->
    <div>
      <div class="flex items-center gap-[4px] mb-[8px]">
        {{ $t('all.bio') }}
      </div>
      <el-input
        class="max-w-[600px]"
        v-model="profileData.bio"
        clearable
        type="textarea"
        :autosize="{ minRows: 8, maxRows: 30 }"
        :placeholder="$t('all.bio')">
      </el-input>
    </div>
    <!-- phone -->
    <div>
      <div class="flex items-center gap-[4px] mb-[8px]">
        {{ $t('all.phone') }}
      </div>
      <div class="flex flex-col gap-[8px]">
        <el-input class="max-w-[600px]"
                  v-model="profileData.phone"
                  ref="phoneInputElement"
                  @change="resetPhoneStatus"
                  :disabled="!updatePhoneEnabled"
                  :placeholder="$t('all.phone')">
        </el-input>
        <div v-if="updatePhoneEnabled" class="flex gap-[13px] max-w-[400px] items-center mt-[16px]">
          <!-- sms code input -->
          <div class="flex items-center">
            <p class="w-[88px] h-[40px] text-[#98A2B3] flex items-center justify-center rounded-l-md border border-r-0 border-gray-300 bg-gray-200">
              {{ $t('profile.edit.smsCode') }}
            </p>
            <input class="w-[117px] px-[12px] py-[8px] h-[40px] rounded-r-md border bg-white"
                  v-model="inputSmsCode">
            </input>
          </div>
          <!-- countdown -->
          <button v-if="inCountDown"
                  class="rounded-md border border-gray-200 bg-gray-200 shadow-sm px-[14px] py-[8px] font-[500] text-[#98A2B3] text-[14px] leading-[20px]"
          >
            {{ countdown }}s {{ $t('profile.edit.retrySendSms') }}
          </button>
          <!-- send sms -->
          <button v-else
                  @click="sendSmsCode"
                  class="rounded-md border border-[#409EFF] bg-[#409EFF] shadow-sm px-[14px] py-[8px] font-[500] text-white text-[14px] leading-[20px]"
          >
            {{ $t('profile.edit.sendSms') }}
          </button>
        </div>
        <el-button v-else
                  class="w-[120px]"
                  @click="enableUpdatePhone"
        >
          {{ $t('profile.edit.updatePhone') }}
        </el-button>
      </div>
    </div>
    <!-- email -->
    <div>
      <div class="flex items-center gap-[4px] mb-[8px]">
        {{ $t('all.email')
        }}<svg
          xmlns="http://www.w3.org/2000/svg"
          width="6"
          height="6"
          viewBox="0 0 6 6"
          fill="none">
          <path
            d="M2.21714 5.21809L3.35474 3.85009L4.49234 5.21809L5.12594 4.75729L4.20434 3.25969L5.77394 2.61169L5.52914 1.87729L3.88754 2.26609L3.74354 0.538086H2.96594L2.82194 2.28049L1.18034 1.87729L0.921143 2.61169L2.49074 3.25969L1.58354 4.75729L2.21714 5.21809Z"
            fill="#F56C6C" />
        </svg>
      </div>
      <el-input
        class="max-w-[600px]"
        v-model="profileData.email"
        :placeholder="$t('all.email')">
      </el-input>
    </div>
    <div
      @click="confirmUpdateProfile"
      class="w-[111px] text-[14px] border border-[#DCDFE6] px-[16px] py-[5px] leading-[22px] text-center rounded-[8px] text-white cursor-pointer bg-[#409EFF]">
      {{ $t('all.save') }}
    </div>
  </div>
</template>

<script setup>
  import csrfFetch from '../../packs/csrfFetch.js'
  import jwtFetch from '../../packs/jwtFetch.js'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { ref, inject } from 'vue'
  import useUserStore from '../../stores/UserStore.js'
  import { storeToRefs } from 'pinia'
  import { useI18n } from 'vue-i18n'
  import { useCookies } from 'vue3-cookies'
  import { isBlank } from '../../packs/utils'

  const { cookies } = useCookies()
  const { t } = useI18n()
  const userStore = useUserStore()
  const csghubServer = inject('csghubServer')
  const profileData = ref(storeToRefs(userStore))

  const fileInput = ref(null)
  const phoneInputElement = ref(null)
  const inputSmsCode = ref('')
  const generatedSmscode = ref('')
  const updatePhoneEnabled = ref(false)
  const inCountDown = ref(false)
  const countdown = ref(30)
  const intervalId = ref(null)
  const phoneJustSendcode = ref('')
  const phoneChanged = ref(false)
  const canChangeUsername = cookies.get('can_change_username')

  const uploadImage = () => {
    fileInput.value.click()
  }

  const removeImage = () => {
    fileInput.value = null
    profileData.value.avatar = ''
  }

  const resetPhoneStatus = () => {
    phoneChanged.value = true
  }

  const sendSmsCode = async () => {
    const profileSmsEndpoint = `/internal_api/users/sms`;
    generatedSmscode.value = Math.floor(100000 + Math.random() * 900000).toString()
    phoneJustSendcode.value = profileData.value.phone
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: profileData.value.phone,
        code: generatedSmscode.value
      })
    }
    const response = await csrfFetch(profileSmsEndpoint, options)
    if (!response.ok) {
      response.json().then(data => {
        ElMessage({
          message: data.Message,
          type: "warning",
        })
      })
    } else {
      inCountDown.value = true
      intervalId.value = setInterval(() => {
        if (countdown.value > 0) {
          countdown.value--
        } else {
          clearInterval(intervalId.value)
          inCountDown.value = false
        }
      }, 1000)

      ElMessage({
        message: t('profile.edit.smsSented'),
        type: "success",
      })
    }
  }

  const enableUpdatePhone = () => {
    updatePhoneEnabled.value = true
    phoneInputElement.value.disabled = false
  }

  const disableUpdatePhone = () => {
    phoneChanged.value = false
    updatePhoneEnabled.value = false
    inputSmsCode.value = ''
    generatedSmscode.value = ''
    phoneInputElement.value.disabled = true
    phoneJustSendcode.value = ''
  }

  const uploadAvatar = async () => {
    const uploadEndpoint = `/internal_api/upload`
    const formData = new FormData()
    formData.append('file', fileInput.value.files[0])
    const options = {
      method: 'POST',
      body: formData
    }
    const response = await csrfFetch(uploadEndpoint, options)
    const result = await response.json()
    if (!response.ok) {
      ElMessage({ message: result.message, type: 'warning' })
    } else {
      profileData.value.avatar = result.url
    }
  }

  const confirmUpdateProfile = () => {
    if (canChangeUsername === 'true') {
      ElMessageBox.confirm(
        t('profile.edit.confirmUpdateMessage'),
        t('profile.edit.confirmUpdateTitle'),
        {
          confirmButtonText: t('profile.edit.confirmUpdate'),
          cancelButtonText: t('profile.edit.cancelUpdate'),
          type: 'warning',
        }
      ).then(() => {
        saveProfile({relogin: true})
      }).catch(() => {
        ElMessage({
          type: 'info',
          message: t('profile.edit.updateCancelled'),
        })
      })
    } else {
      saveProfile()
    }
  }

  const updateProfile = async (config={}) => {
    const currentUsername = cookies.get('current_user')
    const profileUpdateEndpoint = `${csghubServer}/api/v1/user/${currentUsername}`
    let params = {
      avatar: profileData.value.avatar,
      username: profileData.value.username,
      name: profileData.value.nickname,
      email: (profileData.value.email || "").trim(),
      phone: profileData.value.phone,
      homepage: profileData.value.homepage,
      bio: profileData.value.bio
    }

    if (canChangeUsername === 'true') {
      params['new_username'] = profileData.value.username
    }

    Object.keys(params).forEach(key => {
      if (params[key] === '' || params[key] === undefined) {
        delete params[key]
      }
    })

    const options = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    }
    try {
      const response = await jwtFetch(profileUpdateEndpoint, options)
      if (!response.ok) {
        response.json().then((data) => {
          ElMessage.warning(data.msg)
        })
      } else {
        ElMessage.success(t('profile.edit.updateSuccess'))
        disableUpdatePhone()
        if (config.relogin) {
          window.location.href = '/logout'
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  const isSmsCodeValid = () => {
    if (phoneJustSendcode.value === '' && phoneChanged.value === false) {
      return true
    } else {
      return inputSmsCode.value === generatedSmscode.value &&
        phoneJustSendcode.value === profileData.value.phone
    }
  }

  const saveProfile = (config={}) => {
    if (isBlank(profileData.value.username)) {
      ElMessage.warning("Please provide username")
      return
    }
    if (isBlank(profileData.value.email)) {
      ElMessage.warning("Please provide email")
      return
    }
    if (isSmsCodeValid()) {
      updateProfile(config)
    } else {
      ElMessage.warning("SMS code not correct")
    }
  }
</script>

