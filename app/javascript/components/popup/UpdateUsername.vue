<template>

</template>

<script setup>
  import { onMounted, ref, inject } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useCookies } from 'vue3-cookies'
  import jwtFetch from '../../packs/jwtFetch.js'
  import { ElMessage, ElMessageBox } from 'element-plus'

  const { cookies } = useCookies()
  const canChangeUsername = cookies.get('can_change_username')
  const { t } = useI18n()
  const csghubServer = inject('csghubServer')
  const updateUsername = () => {
    if (canChangeUsername === 'true') {
      ElMessageBox.prompt(
        t('profile.edit.confirmUpdateMessage'),
        t('profile.edit.confirmUpdateTitle'),
      
        {
          confirmButtonText: t('profile.edit.confirmUpdate'),
          cancelButtonText: t('profile.edit.cancelUpdate'),
          type: 'warning',
        }
      ).then(( value ) => {
        saveProfile(value)
      }).catch(() => {
        ElMessage({
          type: 'info',
          message: t('profile.edit.updateCancelled'),
        })
      })
    }
  }

  // const saveProfile = (username) => {
  //   if (username.value.trim() === '') {
  //     ElMessage.warning("Please provide username")
  //     return
  //   }
  //   updateProfile(username)
  // }

  const saveProfile = (username) => {
    validate(username.value, usernameRules.value).then((result) => {
        if (result.valid) {
            updateProfile(username)
        } else {
            ElMessage.error(result.errors[0])
        }
    })
}

  const updateProfile = async (username) => {
    const currentUsername = cookies.get('current_user')
    const profileUpdateEndpoint = `${csghubServer}/api/v1/user/${currentUsername}`

    const params = {new_username:username.value}
    console.log(username.value);

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
        window.location.href = '/logout'
      }
    } catch (error) {
      console.error(error)
    }
  }

  const usernameRules = ref([
      {
        required: true,
        message: t('all.pleaseInput', {
          value: t('models.newModel.modelName')
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
  ])

  onMounted(() => {
    updateUsername()
  })
</script>
