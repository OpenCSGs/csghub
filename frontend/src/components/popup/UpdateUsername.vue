<template>
  <el-dialog
    v-model="getChangeUsername"
    :title="$t('profile.edit.updateUsername')"
    width="30%"
    class="dialogWidth"
    :close-on-click-modal="false"
    :show-close="false"
    style="border-radius: var(--border-radius-md)"
    left
  >
    <el-form :model="formData" :rules="formRules" ref="formRef">
      <div>
        <p class="text-gray-700 text-sm mb-[8px] mt-[8px]">
          {{ $t('profile.edit.internalUsername') }}
          <span class="text-red-400">*</span>
        </p>
        <el-form-item prop="username">
          <el-input v-model="formData.username" :rows="6" :placeholder="$t('profile.edit.internalUsernamePlaceholder')" />
        </el-form-item>
        <p class="text-gray-500 text-xs italic mt-[24px]">
          {{ $t('rule.nameRule') }}
        </p>
      </div>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <!-- <el-button @click="canChangeUsername = 'false'">{{ $t('all.cancel') }}</el-button> -->
        <el-button type="primary" @click="submiteUsername">
          {{ $t('all.update') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
  import { ref, inject, computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useCookies } from 'vue3-cookies'
  import { ElMessage } from 'element-plus'
  import useUserStore from '../../stores/UserStore'
  import useFetchApi from '../../packs/useFetchApi'
  import refreshJWT from '@/packs/refreshJWT'

  const { cookies } = useCookies()
  const { t } = useI18n()
  const nameRule = inject('nameRule')
  const formData = ref({ username: '' })
  const formRef = ref(null)
  const userStore = useUserStore()

  const getChangeUsername = computed(() => {
    const canChangeUsername = userStore.isLoggedIn ? cookies.get('can_change_username') : 'false'
    return canChangeUsername === 'true'
  })

  const formRules = ref({
      username: [
    {
      required: true,
      message: t('all.pleaseInput', {
        value: t('profile.edit.internalUsername')
      }),
      trigger: 'blur'
    },
    // limit 2-64 length
    {
      min: 2,
      max: 64,
      message: t('rule.lengthLimit', { min: 2, max: 64 }),
      trigger: 'blur'
    },
    // 以字母开头
    {
      pattern: /^[a-zA-Z]/,
      message: t('rule.startWithLetter'),
      trigger: 'blur'
    },
    // 以数字或字母结尾
    {
      pattern: /[a-zA-Z0-9]$/,
      message: t('rule.endWithLetterOrNumber'),
      trigger: 'blur'
    },
    // 只能包含字母、数字与-_.
    {
      pattern: /^[a-zA-Z0-9-_\.]+$/,
      message: t('rule.onlyLetterNumberAndSpecialStr'),
      trigger: 'blur'
    },
    // 特殊字符不能并列出现
    {
      pattern: /^(?!.*[-_.]{2,}).*$/,
      message: t('rule.specialStrNotTogether'),
      trigger: 'blur'
    },
    // 保险起见最后一步还是加上最终的正则吧
    { pattern: nameRule, message: t('rule.nameRule'), trigger: 'blur' }
    ]
  })

  const submiteUsername = () => {
    formRef.value.validate((valid) => {
      if (valid) {
        // 异步发送请求
        updateUsername().catch((err) => {
          ElMessage({
            message: err.message,
            type: 'warning'
          })
        })
      }
    })
  }

  const updateUsername = async () => {

    const profileUpdateEndpoint = `/user/${userStore.uuid}?type=uuid`

    const params = { new_username: formData.value.username }

    const options = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    }
    try {
      const { error } = await useFetchApi(profileUpdateEndpoint, options).json()

      if (error.value) {
        ElMessage({ message: error.value.msg, type: 'warning' })
      } else {
        await refreshJWT()
        userStore.username = formData.value.username
        cookies.set('can_change_username', 'false')
        ElMessage.success(t('profile.edit.updateSuccess'))
      }
    } catch (error) {
      console.error(error)
    }
  }
</script>