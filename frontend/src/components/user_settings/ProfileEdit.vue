<template>
  <div class="flex flex-col gap-6 px-6 md:px-0 py-10 border-l md:border-l-0">
    <div class="font-semibold text-xl leading-[28px]">
      {{ $t('profile.accountSetting') }}
    </div>
    <!-- avatar -->
    <div class="flex flex-row items-center gap-5 mb-2">
      <el-avatar
        :size="96"
        :src="profileData.avatar.value">
      </el-avatar>
      <div class="flex flex-col gap-3 fileInput">
        <input
          ref="fileInput"
          type="file"
          class="hidden"
          @change="uploadAvatar" />
        <CsgButton
          @click="uploadImage"
          class="btn btn-secondary-gray btn-sm"
          :name="$t('profile.edit.uploadAvatar')"
        />
        <CsgButton  
          @click="removeImage"
          class="btn btn-outline-danger btn-sm"
          :name="$t('profile.edit.removeAvatar')"
        />
      </div>
    </div>
    <!-- name and nickname -->
    <div class="flex gap-4 max-w-[600px]">
      <div class="flex-1">
        <div class="flex items-center gap-1 mb-2">
          {{ $t('all.userName') }}
        </div>
        <el-input
          size="large"
          v-model="profileData.username.value"
          :disabled="!canChangeUsername"
          :placeholder="$t('all.userName')">
        </el-input>
        <p class="text-gray-500 text-xs italic pt-1">
          {{ $t('rule.nameRule') }}
        </p>
      </div>
      <div class="flex-1">
        <div class="flex items-center gap-1 mb-2">
          {{ $t('all.nickName') }}
        </div>
        <el-input
          size="large"
          v-model="profileData.nickname.value"
          :placeholder="$t('all.nickName')"
          @change="handleInputChange">
        </el-input>
      </div>
    </div>
    <!-- phone -->
    <div>
      <div class="flex items-center gap-1 mb-2">
        {{ $t('all.phone')}}
        <svg
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
        size="large"
        v-model="profileData.phone.value"
        disabled
        :placeholder="$t('all.phone')">
      </el-input>
    </div>
    <!-- email -->
    <div>
      <div class="flex items-center gap-1 mb-2">
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
      <!-- only validator email -->
      <el-form ref="formRef" :model="form" :rules="rules" status-icon>
        <el-form-item prop="email">
          <el-input
            class="max-w-[600px]"
            size="large"
            v-model="form.email"
            :placeholder="$t('all.email')"
            @change="handleInputChange">
          </el-input>
        </el-form-item>
      </el-form>

    </div>
    <!-- homepage -->
    <div>
      <div class="flex items-center gap-1 mb-2">
        {{ $t('all.homepage') }}
      </div>
      <el-input
        class="max-w-[600px]"
        size="large"
        v-model="profileData.homepage.value"
        :placeholder="$t('all.homepage')"
        @change="handleInputChange">
      </el-input>
    </div>
    <!-- bio -->
    <div>
      <div class="flex items-center gap-1 mb-2">
        {{ $t('all.bio') }}
      </div>
      <el-input
        class="max-w-[600px]"
        size="large"
        v-model="profileData.bio.value"
        clearable
        type="textarea"
        :autosize="{ minRows: 8, maxRows: 30 }"
        :placeholder="$t('all.bio')"
        @change="handleInputChange">
      </el-input>
    </div>
    <div
      v-if="hasBasicInfoChanges"
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
  import { ref, reactive, watch, computed } from 'vue'
  import useUserStore from '../../stores/UserStore.js'
  import { storeToRefs } from 'pinia'
  import { useI18n } from 'vue-i18n'
  import { useCookies } from 'vue3-cookies'
  import { isBlank } from '../../packs/utils'

  const { cookies } = useCookies()
  const { t } = useI18n()
  const userStore = useUserStore()
  const formRef = ref(null)
  const form = reactive({
    email: ''
  })

  const validator = (rule, value, callback) => {
    if (value === '') {
      return callback(new Error(t('profile.edit.emailRequired')))
    }

    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if(!pattern.test(value)) {
      return callback(new Error(t('profile.edit.emailValid')))
    }

    callback()
  }

  const rules = {
    email: [ { validator, trigger: 'change'} ]
  }

  const profileData = storeToRefs(userStore)
  form.email = profileData.email.value

  watch(
    () => profileData,
    () => {
      userStore.updateInitalized(false)
    },
    { deep: true }
  )

  const fileInput = ref(null)
  const emit = defineEmits(['updateHasSave'])
  
  // 存储初始值用于比较
  const initialUsername = ref('')
  const initialNickname = ref('')
  const initialHomepage = ref('')
  const initialBio = ref('')
  const initialAvatar = ref('')
  const hasInitialized = ref(false)
  
  // 初始化函数
  const initializeValues = () => {
    if (!hasInitialized.value) {
      initialUsername.value = profileData.username?.value || ''
      initialNickname.value = profileData.nickname?.value || ''
      initialHomepage.value = profileData.homepage?.value || ''
      initialBio.value = profileData.bio?.value || ''
      initialAvatar.value = profileData.avatar?.value || ''
      hasInitialized.value = true
    }
  }
  
  // 重置初始值函数（保存成功后调用）
  const resetInitialValues = () => {
    initialUsername.value = profileData.username?.value || ''
    initialNickname.value = profileData.nickname?.value || ''
    initialHomepage.value = profileData.homepage?.value || ''
    initialBio.value = profileData.bio?.value || ''
    initialAvatar.value = profileData.avatar?.value || ''
  }

  const { canChangeUsername } = storeToRefs(userStore)
  const { refreshCanChangeUsernameCookie } = userStore

  // 计算属性：检查字段是否有变化
  const hasBasicInfoChanges = computed(() => {
    return (profileData.username?.value || '') !== initialUsername.value ||
           (profileData.nickname?.value || '') !== initialNickname.value ||
           (profileData.homepage?.value || '') !== initialHomepage.value ||
           (profileData.bio?.value || '') !== initialBio.value ||
           (profileData.avatar?.value || '') !== initialAvatar.value
  })

  // 初始化初始值
  initializeValues()
  
  // watch 函数需要在所有相关变量定义之后
  watch(
    () => profileData,
    (newVal, oldVal) => {
      // 只有在不是第一次初始化时才更新初始化状态
      if (oldVal) {
        userStore.updateInitalized(false)
      }
      form.email = profileData.email?.value || ''
      
      // 更新初始值（排除手机号和邮箱）
      initializeValues()
    },
    { deep: true, immediate: true }
  )

  // 调试用：监控计算属性变化
  watch(
    () => hasBasicInfoChanges.value,
    (newVal) => {
      console.log('hasBasicInfoChanges:', newVal)
      console.log('Current values:', {
        username: profileData.username?.value || '',
        nickname: profileData.nickname?.value || '',
        homepage: profileData.homepage?.value || '',
        bio: profileData.bio?.value || '',
        avatar: profileData.avatar?.value || ''
      })
      console.log('Initial values:', {
        username: initialUsername.value,
        nickname: initialNickname.value,
        homepage: initialHomepage.value,
        bio: initialBio.value,
        avatar: initialAvatar.value
      })
    }
  )

  const uploadImage = () => {
    fileInput.value.click()
  }

  const removeImage = () => {
    fileInput.value.value = ''
    if (profileData.avatar) {
      profileData.avatar.value = ''
    }
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
      ElMessage.warning(result.message)
    } else {
      if (profileData.avatar) {
        profileData.avatar.value = result.url
      }
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
        ElMessage.info(t('profile.edit.updateCancelled'))
      })
    } else {
      saveProfile()
    }
  }

  const updateProfile = async (config={}) => {
    const profileUpdateEndpoint = `/user/${userStore.uuid}?type=uuid`
    let params = {
      avatar: profileData.avatar.value,
      username: profileData.username.value,
      name: profileData.nickname.value,
      email: (form.email || "").trim(),
      phone: profileData.phone.value,
      homepage: profileData.homepage.value,
      bio: profileData.bio.value
    }

    if (canChangeUsername.value) {
      params['new_username'] = profileData.username?.value || ''
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
        ElMessage.warning(error.value.msg)
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
    if (isBlank(profileData.username?.value)) {
      ElMessage.warning("Please provide username")
      return
    }
    formRef.value.validate((v,error) => {
      if(v) {
        updateProfile(config)
      }
      if (error) {
        formRef.value.scrollToField('email')
      }
    })
  }

  const handleInputChange = () => {
    emit('updateHasSave', false)
  }
</script>
