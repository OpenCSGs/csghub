<template>
  <div
    class="bg-gray-100 p-[12px] rounded-md mt-[16px] flex flex-col gap-[8px]"
  >
    <div class="flex justify-between">
      <h3 class="text-gray-700 text-[16px] font-[500]">
        {{ tokenName }}
      </h3>
      <el-button
        type="info"
        @click="confirmRefreshAccessToken"
        >{{ $t('accessToken.starshipRefresh') }}</el-button
      >
    </div>
    <div class="flex items-center">
      <el-input
        v-model="theTokenValue"
        type="password"
        show-password
        onfocus="this.blur()"
      />
      <div
        class="ml-[8px] px-[16px] py-[8px] border rounded-xs bg-white cursor-pointer"
        @click="copyToken"
      >
        <SvgIcon name="copy" />
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import SvgIcon from '../shared/SvgIcon.vue'
  import { useI18n } from 'vue-i18n'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { copyToClipboard } from '../../packs/clipboard'
  import useFetchApi from '../../packs/useFetchApi'

  const props = defineProps({
    tokenName: String,
    tokenValue: String
  })

  const { t } = useI18n()

  const theTokenValue = ref(props.tokenValue)

  const copyToken = () => {
    copyToClipboard(theTokenValue.value)
  }

  const confirmRefreshAccessToken = () => {
    ElMessageBox.confirm(t('accessToken.refreshWarning'), 'Warning', {
      confirmButtonText: t('accessToken.confirm'),
      cancelButtonText: t('all.cancel'),
      type: 'warning'
    }).then(() => {
      refreshAccessToken()
    }).catch(() => {
      ElMessage({
        message: t('accessToken.cancelInfo'),
        type: 'info'
      })
    })
  }

  const refreshAccessToken = async() => {
    const refreshTokenEndpoint = `/token/starship/${props.tokenName}`
    const options = {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    }
    const { data, error } = await useFetchApi(refreshTokenEndpoint, options).put().json()

    if (error.value) {
      ElMessage({ message: error.value.msg, type: 'warning' })
    } else {
      const result = data.value
      theTokenValue.value = result.data.token
      ElMessage({ message: result.msg, type: 'success' })
    }
  }
</script>