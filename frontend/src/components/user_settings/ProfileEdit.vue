<template>
  <div class="flex flex-col gap-[24px] px-6 py-10 border-l md:border-l-0">
    <div class="font-semibold text-xl leading-[28px]">
      {{ $t('profile.accountSetting') }}
    </div>
    <!-- avatar -->
    <div>
      <div class="flex items-center gap-[4px] mb-[8px]">{{ $t('profile.edit.userAvatar') }}</div>
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
          class="btn btn-primary btn-sm">
          {{ $t('profile.edit.uploadAvatar') }}
        </div>
        <div
          @click="removeImage"
          class="btn btn-secondary-gray btn-sm">
          {{ $t('profile.edit.removeAvatar') }}
        </div>
      </div>
    </div>
    <!-- name -->
    <div>
      <div class="flex items-center gap-[4px] mb-[8px]">
        {{ $t('all.userName') }}
      </div>
      <el-input
        class="max-w-[600px]"
        v-model="profileData.username"
        :disabled="!canChangeUsername"
        :placeholder="$t('all.userName')">
      </el-input>
      <p class="text-gray-500 text-xs italic pt-1">
        {{ $t('rule.nameRule') }}
      </p>
    </div>
    <!-- phone -->
    <div>
      <div class="flex items-center gap-[4px] mb-[8px]">
        {{ $t('all.phone')
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
        v-model="profileData.phone"
        disabled
        :placeholder="$t('all.phone')">
      </el-input>
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
        :placeholder="$t('all.email')"
        @change="handleInputChange">
      </el-input>
    </div>
    <!-- nickname -->
    <div>
      <div class="flex items-center gap-[4px] mb-[8px]">
        {{ $t('all.nickName') }}
      </div>
      <el-input
        class="max-w-[600px]"
        v-model="profileData.nickname"
        :placeholder="$t('all.nickName')"
        @change="handleInputChange">
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
        :placeholder="$t('all.homepage')"
        @change="handleInputChange">
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
        :placeholder="$t('all.bio')"
        @change="handleInputChange">
      </el-input>
    </div>
    <div
      @click="confirmUpdateProfile"
      class="btn btn-primary btn-md w-fit">
      {{ $t('all.save') }}
    </div>
  </div>
</template>

<script setup>
  import csrfFetch from '../../packs/csrfFetch.js'
  import useFetchApi from '../../packs/useFetchApi'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { ref, watch } from 'vue'
  import useUserStore from '../../stores/UserStore.js'
  import { storeToRefs } from 'pinia'
  import { useI18n } from 'vue-i18n'
  import { useCookies } from 'vue3-cookies'
  import { isBlank } from '../../packs/utils'
  import refreshJWT from '@/packs/refreshJWT.js'

  const { cookies } = useCookies()
  const { t } = useI18n()
  const userStore = useUserStore()

  const profileData = ref(storeToRefs(userStore))

  watch(
    () => profileData.value,
    () => {
      userStore.updateInitalized(false)
    },
    { deep: true }
  )

  const fileInput = ref(null)
  const emit = defineEmits(['updateHasSave'])

  const { canChangeUsername } = storeToRefs(userStore)
  const { refreshCanChangeUsernameCookie } = userStore

  const uploadImage = () => {
    fileInput.value.click()
  }

  const removeImage = () => {
    fileInput.value = null
    profileData.value.avatar = ''
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
    emit('updateHasSave', true)

    if (canChangeUsername.value) {
      ElMessageBox.confirm(
        '',
        t('profile.edit.confirmUpdateTitle'),
        {
          confirmButtonText: t('profile.edit.confirmUpdate'),
          cancelButtonText: t('profile.edit.cancelUpdate'),
          type: 'warning',
        }
      ).then(() => {
        saveProfile()
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
    const profileUpdateEndpoint = `/user/${userStore.uuid}?type=uuid`
    let params = {
      avatar: profileData.value.avatar,
      username: profileData.value.username,
      name: profileData.value.nickname,
      email: (profileData.value.email || "").trim(),
      phone: profileData.value.phone,
      homepage: profileData.value.homepage,
      bio: profileData.value.bio
    }

    if (canChangeUsername.value) {
      params['new_username'] = profileData.value.username
    }

    Object.keys(params).forEach(key => {
      if (params[key] === '' || params[key] === undefined) {
        delete params[key]
      }
    })

    const options = {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    }
    try {
      const { error } = await useFetchApi(profileUpdateEndpoint, options).put().json()
      if (error.value) {
        ElMessage({ message: error.value.msg, type: 'warning' })
      } else {
        await fetch('/internal_api/users/jwt_token', {method: 'PUT'})
        userStore.email = params.email
        userStore.username = params.username
        cookies.set('can_change_username', 'false')
        refreshCanChangeUsernameCookie()
        ElMessage.success(t('profile.edit.updateSuccess'))
        if (config.relogin) {
          window.location.href = '/logout'
        }
      }
    } catch (error) {
      console.error(error)
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
    updateProfile(config)
  }

  const handleInputChange = () => {
    emit('updateHasSave', false)
  }
</script>
