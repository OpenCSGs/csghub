<template>
  <div
    class="flex justify-center md:flex-col px-[24px] rounded-md md:px-[50px] sm:px-[20px] max-w-[1280px] m-auto bg-white"
  >
    <Menu
      class="max-w-[411px] md:mb-[24px]"
      :name="profileName"
    ></Menu>
    <div class="grow flex flex-col gap-[24px] px-6 py-10 border-l md:border-l-0 min-h-[calc(100vh-153px)] min-h-auto">
      <div class="max-w-[512px]">
        <div class="mb-[16px]">
          <h3 class="mb-[4px] text-gray-700 text-[20px] font-semibold">
            {{ $t('accessToken.title') }}
          </h3>
          <p class="text-gray-500 text-[14px]">{{ $t('accessToken.desc') }}</p>
        </div>
        <div class="bg-gray-100 p-[12px] rounded-md mt-[16px]">
          <h3 class="text-gray-700 text-[16px] font-[500] mb-[16px]">
            access token
          </h3>
          <div class="flex items-center">
            <el-input
              v-model="theAccessToken"
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
            type="default"
            @click="confirmRefreshAccessToken"
            class="h-[30px] mb-[16px]"
            >{{ $t('accessToken.refresh') }}</el-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Menu from './Menu.vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import useFetchApi from '../../packs/useFetchApi'
  import { copyToClipboard } from '../../packs/clipboard'
  import { v4 as uuidv4 } from 'uuid'

  export default {
    props: {
      name: String
    },
    components: {
      Menu
    },
    data() {
      return {
        theAccessToken: '',
        theTokenName: '',
        profileName: this.name,
        profileDisplayName: this.displayName,
        profileAvatar: this.avatar,
        accessTokenName: '',
      }
    },
    mounted() {
      this.fetchUserTokens()
    },
    methods: {
      copyToken() {
        copyToClipboard(this.theAccessToken)
      },

      async fetchUserTokens() {
        const { data, error } = await useFetchApi(
          `/user/${this.name}/tokens?app=git`
        ).json()
        if (error.value) {
          ElMessage({ message: error.value, type: 'warning' })
        } else {
          const body = data.value
          if (body.data) {
            this.theAccessToken = body.data[0].token
            this.theTokenName = body.data[0].token_name
          } else {
            const randomUUID = uuidv4()
            this.createUserToken(randomUUID)
          }
        }
      },

      async createUserToken(token) {
        const options = {
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: token
          })
        }
        const { data, error } = await useFetchApi(
          `/token/git/${this.name}`,
          options
        ).post().json()
        if (error.value) {
          ElMessage({ message: error.value, type: 'warning' })
        } else {
          const body = data.value
          this.theAccessToken = body.data.token
        }
      },

      confirmRefreshAccessToken() {
        ElMessageBox.confirm(this.$t('accessToken.refreshWarning'), 'Warning', {
          confirmButtonText: this.$t('accessToken.confirm'),
          cancelButtonText: this.$t('all.cancel'),
          type: 'warning'
        }).then(() => {
          this.refreshAccessToken()
        }).catch(() => {
          ElMessage({
            message: this.$t('accessToken.cancelInfo'),
            type: 'info'
          })
        })
      },

      async refreshAccessToken() {
        const { data, error } = await useFetchApi(
          `/token/git/${this.theTokenName}`
        ).put().json()
        if (error.value) {
          ElMessage({ message: error.value, type: 'warning' })
        } else {
          const body = data.value
          this.theAccessToken = body.data.token
          ElMessage({ message: data.value.msg, type: 'success' })
        }
      }
    }
  }
</script>
