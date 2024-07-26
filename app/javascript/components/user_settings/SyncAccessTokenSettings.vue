<template>
  <div
    class="flex justify-center md:flex-col px-[24px] rounded-[8px] md:px-[50px] sm:px-[20px] max-w-[1280px] m-auto bg-white"
  >
    <Menu
      class="max-w-[411px] md:mb-[24px]"
      :name="name"
    >
    </Menu>
    <div class="grow flex flex-col gap-[24px] px-6 py-10 border-l min-h-[calc(100vh-153px)]">
      <div class="max-w-[512px]">
        <div class="mb-[16px]">
          <h3 class="mb-[4px] text-[#303133] text-[20px] font-semibold">
            {{ $t('accessToken.syncTitle') }}
          </h3>
          <p class="text-[#606266] text-[14px]">
            {{ $t('accessToken.syncDesc') }}
          </p>
        </div>
        <div
          v-if="accessToken"
          class="bg-[#F5F7FA] p-[12px] rounded-[8px] mt-[16px]"
        >
          <h3 class="text-[#303133] text-[16px] font-[500] mb-[16px]">Token</h3>
          <div class="flex items-center">
            <el-input
              v-model="accessToken"
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
        <div class="my-[16px]">
          <el-button
            v-if="!accessToken"
            type="default"
            @click="createUserToken"
            class="h-[30px] mb-[16px]"
            >{{ $t('accessToken.syncAddToken') }}</el-button
          >
          <el-button
            v-else
            type="default"
            @click="confirmRefreshAccessToken"
            class="h-[30px] mb-[16px]"
            >{{ $t('accessToken.syncRefresh') }}</el-button
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
  import Menu from './Menu.vue'
  import { ref, onMounted, inject } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import jwtFetch from '../../packs/jwtFetch'
  import { copyToClipboard } from '../../packs/clipboard'
  import { v4 as uuidv4 } from 'uuid'
  import { useI18n } from 'vue-i18n'

  const props = defineProps({
    name: String
  })

  const { t } = useI18n()

  const csghubServer = inject('csghubServer')

  const accessToken = ref('')
  const tokenName = ref('')

  const copyToken = () => {
    copyToClipboard(accessToken.value)
  }

  const refreshAccessToken = async () => {
    const refreshTokenEndpoint = `${csghubServer}/api/v1/token/mirror/${tokenName.value}`
    const options = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    }

    try {
      const response = await jwtFetch(refreshTokenEndpoint, options)
      const result = await response.json()

      if (!response.ok) {
        ElMessage({ message: result.msg, type: 'warning' })
        return
      }

      accessToken.value = result.data.token
      ElMessage({ message: result.msg, type: 'success' })
    } catch (error) {
      ElMessage({ message: error.message, type: 'error' })
    }
  }

  const confirmRefreshAccessToken = () => {
    ElMessageBox.confirm(t('accessToken.syncRefreshWarning'), 'Warning', {
      confirmButtonText: t('accessToken.confirm'),
      cancelButtonText: t('all.cancel'),
      type: 'warning'
    })
      .then(refreshAccessToken)
      .catch(() => {
        ElMessage({
          message: t('accessToken.cancelInfo'),
          type: 'info'
        })
      })
  }

  const fetchUserToken = async () => {
    try {
      const res = await jwtFetch(
        `${csghubServer}/api/v1/user/${props.name}/tokens?app=mirror`
      )
      const body = await res.json()

      if (!res.ok) {
        ElMessage({ message: body.msg, type: 'warning' })
        return
      }

      if (body.data && body.data.length > 0) {
        accessToken.value = body.data[0].token
        tokenName.value = body.data[0].token_name
      }
    } catch (error) {
      ElMessage({ message: error.message, type: 'error' })
    }
  }

  const createUserToken = async () => {
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    }

    try {
      const res = await jwtFetch(
        `${csghubServer}/api/v1/token/mirror/${uuidv4()}`,
        options
      )
      const data = await res.json()

      if (!res.ok) {
        ElMessage({ message: data.msg, type: 'warning' })
        return
      }

      fetchUserToken()
    } catch (error) {
      ElMessage({ message: error.message, type: 'error' })
    }
  }

  onMounted(() => {
    fetchUserToken()
  })
</script>
