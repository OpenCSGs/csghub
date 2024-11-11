<template>
  <div
    class="flex justify-center md:flex-col px-[24px] rounded-md md:px-[50px] sm:px-[20px] max-w-[1280px] m-auto bg-white"
  >
    <Menu
      class="max-w-[411px] md:mb-[24px]"
      :name="name"
    >
    </Menu>
    <div class="grow flex flex-col gap-[24px] px-6 py-10 border-l min-h-[calc(100vh-153px)]">
      <div class="max-w-[512px]">
        <div class="mb-[16px]">
          <h3 class="mb-[4px] text-gray-700 text-xl font-semibold">
            {{ $t('accessToken.syncTitle') }}
          </h3>
          <p class="text-gray-500 text-sm">
            {{ $t('accessToken.syncDesc') }}
          </p>
        </div>
        <div
          v-if="accessToken"
          class="bg-gray-100 p-[12px] rounded-md mt-[16px]"
        >
          <h3 class="text-gray-700 text-md font-[500] mb-[16px]">Token</h3>
          <div class="flex items-center">
            <el-input
              v-model="accessToken"
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
  import { ref, onMounted } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import useFetchApi from '../../packs/useFetchApi'
  import { copyToClipboard } from '../../packs/clipboard'
  import { v4 as uuidv4 } from 'uuid'
  import { useI18n } from 'vue-i18n'

  const props = defineProps({
    name: String
  })

  const { t } = useI18n()

  const accessToken = ref('')
  const tokenName = ref('')

  const copyToken = () => {
    copyToClipboard(accessToken.value)
  }

  const refreshAccessToken = async () => {
    const refreshTokenEndpoint = `/token/mirror/${tokenName.value}`
    const options = {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    }

    try {
      const { data, error } = await useFetchApi(refreshTokenEndpoint, options).put().json()

      if (error.value) {
        ElMessage({ message: error.value.msg, type: 'warning' })
        return
      }

      const result = data.value
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
      const { data, error } = await useFetchApi(
        `/user/${props.name}/tokens?app=mirror`
      ).json()

      if (error.value) {
        ElMessage({ message: error.value.msg, type: 'warning' })
        return
      }

      const body = data.value

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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    }

    try {
      const { error } = await useFetchApi(
        `/token/mirror/${uuidv4()}`,
        options
      ).post().json()

      if (error.value) {
        ElMessage({ message: error.value.msg, type: 'warning' })
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
