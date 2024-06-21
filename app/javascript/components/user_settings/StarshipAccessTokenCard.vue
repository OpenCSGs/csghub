<template>
  <div
    class="bg-[#F5F7FA] p-[12px] rounded-[8px] mt-[16px] flex flex-col gap-[8px]"
  >
    <h3 class="text-[#303133] text-[16px] font-[500]">
      {{ tokenName }}
    </h3>
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
    <el-button
      type="info"
      @click="confirmRefreshAccessToken"
      round
      class="w-[100px]"
      >{{ $t('accessToken.starshipRefresh') }}</el-button
    >
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import SvgIcon from '../shared/SvgIcon.vue';
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { copyToClipboard } from '../../packs/clipboard'

  const props = defineProps({
    tokenName: String,
    tokenValue: String
  })

  const theTokenValue = ref(props.tokenValue)

  const copyToken = () => {
    copyToClipboard(theTokenValue)
  }

  const confirmRefreshAccessToken = () => {
    ElMessageBox.confirm(this.$t('accessToken.refreshWarning'), 'Warning', {
      confirmButtonText: this.$t('accessToken.confirm'),
      cancelButtonText: this.$t('all.cancel'),
      type: 'warning'
    }).then(() => {
      refreshAccessToken()
    }).catch(() => {
      ElMessage({
        message: this.$t('accessToken.cancelInfo'),
        type: 'info'
      })
    })
  }

  const refreshAccessToken = async() => {
    const refreshTokenEndpoint = '/internal_api/access_token/refresh'
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }
    const response = await csrfFetch(refreshTokenEndpoint, options)

    if (!response.ok) {
      response.json().then((err) => {
        ElMessage({ message: err.message, type: 'warning' })
      })
    } else {
      response.json().then((data) => {
        // 仅在刷新操作的时候提醒，首次自动生成不提醒
        if (this.theAccessToken) {
          ElMessage({ message: data.message, type: 'success' })
        }
        this.theAccessToken = data.token
      })
    }
  }
</script>