<template>
  <div
      class="flex justify-center md:flex-col px-[24px] py-[36px] my-[24px] rounded-[8px] md:px-[50px] sm:px-[20px] max-w-[1280px] m-auto bg-white">
    <Menu class="max-w-[411px] md:mb-[24px]"
          :name="profileName"
          :email="email"
          :displayName="profileDisplayName"
          :avatar="profileAvatar">
    </Menu>
    <div class="grow py-[24px]">
      <div class="max-w-[512px]">
        <div class="mb-[16px]">
          <h3 class="mb-[4px] text-[#303133] text-[20px] font-semibold">{{ $t('accessToken.title') }}</h3>
          <p class="text-[#606266] text-[14px]">{{ $t('accessToken.desc') }}</p>
        </div>
        <div class="bg-[#F5F7FA] p-[12px] rounded-[8px] mt-[16px]">
          <h3 class="text-[#303133] text-[16px] font-[500] mb-[16px]">access token</h3>
          <div class="flex items-center">
            <el-input
                v-model="theAccessToken"
                type="password"
                show-password
                onfocus="this.blur()"
            />
            <div class="ml-[8px] px-[16px] py-[8px] border rounded-[4px] bg-[#FFF] cursor-pointer" @click="copyToken">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                    d="M9.43088 4.66699H9.63366C10.7538 4.66699 11.3138 4.66699 11.7416 4.88498C12.118 5.07673 12.4239 5.38269 12.6157 5.75901C12.8337 6.18683 12.8337 6.74689 12.8337 7.86699V9.63366C12.8337 10.7538 12.8337 11.3138 12.6157 11.7416C12.4239 12.118 12.118 12.4239 11.7416 12.6157C11.3138 12.8337 10.7538 12.8337 9.63366 12.8337H7.86699C6.74689 12.8337 6.18683 12.8337 5.75901 12.6157C5.38269 12.4239 5.07673 12.118 4.88498 11.7416C4.66699 11.3138 4.66699 10.7538 4.66699 9.63366V9.43088M4.36699 9.33366H6.13366C7.25376 9.33366 7.81382 9.33366 8.24164 9.11567C8.61796 8.92393 8.92393 8.61796 9.11567 8.24164C9.33366 7.81382 9.33366 7.25377 9.33366 6.13366V4.36699C9.33366 3.24689 9.33366 2.68683 9.11567 2.25901C8.92393 1.88269 8.61796 1.57673 8.24164 1.38498C7.81382 1.16699 7.25377 1.16699 6.13366 1.16699H4.36699C3.24689 1.16699 2.68683 1.16699 2.25901 1.38498C1.88269 1.57673 1.57673 1.88269 1.38498 2.25901C1.16699 2.68683 1.16699 3.24689 1.16699 4.36699V6.13366C1.16699 7.25376 1.16699 7.81382 1.38498 8.24164C1.57673 8.61796 1.88269 8.92393 2.25901 9.11567C2.68683 9.33366 3.24689 9.33366 4.36699 9.33366Z"
                    stroke="#606266" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
        <div class="my-[16px]">
          <el-button type="default" @click="confirmRefreshAccessToken" class="h-[30px] mb-[16px]">{{ $t('accessToken.refresh') }}</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Menu from "./Menu.vue";
import { inject } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import jwtFetch from '../../packs/jwtFetch'
import { copyToClipboard } from "../../packs/clipboard"
import { v4 as uuidv4 } from 'uuid';

export default {
  props: {
    name: String,
    displayName: String,
    avatar: String,
    email: String
  },
  components: {
    Menu
  },
  data() {
    return {
      theAccessToken: '',
      theTokenName:'',
      profileName: this.name,
      profileDisplayName: this.displayName,
      profileAvatar: this.avatar,
      accessTokenName: '',
      csghubServer: inject('csghubServer'),

    };
  },
  mounted() {
    this.fetchUserTokens()
  },
  methods: {
    copyToken() {
      copyToClipboard(this.theAccessToken)
    },

    async fetchUserTokens() {
      const res = await jwtFetch(`${this.csghubServer}/api/v1/user/${this.name}/tokens?app=git`)
      if (!res.ok) {
        res.json().then(error => {
          ElMessage({message: error.msg, type: "warning"})
        })
      } else {
        res.json().then(body => {
          if (body.data) {
            this.theAccessToken = body.data[0].token
            this.theTokenName = body.data[0].token_name
          } else {
            const randomUUID = uuidv4()
            this.createUserToken(randomUUID)
          }
        })
      }
    },

    async createUserToken(token) {
      const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: token
        })
      }
      const res = await jwtFetch(`${this.csghubServer}/api/v1/token/git/${this.name}`, options)
      if (!res.ok) {
        res.json().then(error => {
          ElMessage({message: error.msg, type: "warning"})
        })
      } else {
        res.json().then((body) => {
          this.theAccessToken = body.data.token
        })
      }
    },

    confirmRefreshAccessToken() {
      ElMessageBox.confirm(
        this.$t('accessToken.refreshWarning'),
        'Warning',
        {
          confirmButtonText: this.$t('accessToken.confirm'),
          cancelButtonText:  this.$t('all.cancel'),
          type: 'warning',
        }
      ).then(() => {
        this.refreshAccessToken()
      }).catch(() => {
        ElMessage({message: this.$t('accessToken.cancelInfo'), type: "info"})
      })
    },

    async refreshAccessToken() {
      const options = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      }
      const res = await jwtFetch(`${this.csghubServer}/api/v1/token/git/${this.theTokenName}`, options)
      if (!res.ok) {
        res.json().then(error => {
          ElMessage({message: error.msg, type: "warning"})
        })
      } else {
        res.json().then((body) => {
          this.theAccessToken = body.data.token
        })
      }
    }
  }
}
</script>
