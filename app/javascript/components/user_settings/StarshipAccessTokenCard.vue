<template>
  <div
    class="bg-[#F5F7FA] p-[12px] rounded-[8px] mt-[16px] flex flex-col gap-[8px]"
  >
    <div class="flex justify-between">
      <h3 class="text-[#303133] text-[16px] font-[500]">
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
        class="ml-[8px] px-[16px] py-[8px] border rounded-[4px] bg-[#FFF] cursor-pointer"
        @click="copyToken"
      >
        <SvgIcon name="copy" />
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, inject } from 'vue'
  import SvgIcon from '../shared/SvgIcon.vue'
  import { useI18n } from 'vue-i18n'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { copyToClipboard } from '../../packs/clipboard'
  import jwtFetch from '../../packs/jwtFetch'

  const props = defineProps({
    tokenName: String,
    tokenValue: String
  })

  const { t } = useI18n()
  const csghubServer = inject('csghubServer')

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
    const refreshTokenEndpoint = `${csghubServer}/api/v1/token/starship/${props.tokenName}`
    const options = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    }
    const response = await jwtFetch(refreshTokenEndpoint, options)

    if (!response.ok) {
      response.json().then((err) => {
        ElMessage({ message: err.msg, type: 'warning' })
      })
    } else {
      response.json().then((result) => {
        theTokenValue.value = result.data.token
        ElMessage({ message: result.msg, type: 'success' })
      })
    }
  }
</script>