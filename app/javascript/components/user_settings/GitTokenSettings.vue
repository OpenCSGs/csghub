<template>
  <div
      class="flex justify-center md:flex-col px-[24px] py-[36px] my-[24px] rounded-[8px] md:px-[50px] sm:px-[20px] max-w-[1280px] m-auto bg-white">
    <Menu class="max-w-[411px] md:mb-[24px]"
          :name="profileName"
          :displayName="profileDisplayName"
          :avatar="profileAvatar">
    </Menu>
    <div class="grow py-[24px]">
      <div class="max-w-[512px]">
        <div class="mb-[16px]">
          <h3 class="mb-[4px] text-[#303133] text-[20px] font-semibold">用户 Git Token</h3>
          <p class="text-[#606266] text-[14px]"> Git Token 用于授权您执行 Git 相关操作 </p>
        </div>
        <div class="bg-[#F5F7FA] p-[12px] rounded-[8px] mt-[16px]">
          <h3 class="text-[#303133] text-[16px] font-[500] mb-[16px]">git token</h3>
          <div class="flex items-center">
            <el-input
                v-model="theGitToken"
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
          <el-button type="default" @click="confirmRefreshGitToken" class="h-[30px] mb-[16px]">刷新 Git Token</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Menu from "./Menu.vue";
import { ElMessage, ElMessageBox } from 'element-plus'
import csrfFetch from "../../packs/csrfFetch"

export default {
  props: {
    name: String,
    displayName: String,
    avatar: String,
    gitToken: String
  },
  components: {
    Menu
  },
  data() {
    return {
      theGitToken: this.gitToken,
      profileName: this.name,
      profileDisplayName: this.displayName,
      profileAvatar: this.avatar,
      gitTokenName: ''
    };
  },
  mounted() {
    // 如果 gitToken 为空，那么刷新获取 token
    if (!this.theGitToken.trim()) {
      this.refreshGitToken()
    }
  },
  methods: {
    copyToken() {
      navigator.clipboard.writeText(this.theGitToken);
      ElMessage({
        message: '复制成功！',
        type: 'success'
      })
    },

    confirmRefreshGitToken() {
      ElMessageBox.confirm(
        "刷新之后现有的 Git Token 将会失效，确认继续吗?",
        'Warning',
        {
          confirmButtonText: '继续刷新',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).then(() => {
        this.refreshGitToken().then((data) => {
          ElMessage({message: data.message, type: "success"})
        })
        .catch(err => {
          ElMessage({
            message: err.message,
            type: 'warning'
          })
        })
      }).catch(() => {
        ElMessage({message: '操作已取消', type: "info"})
      })
    },

    async refreshGitToken() {
      const refreshTokenEndpoint = "/internal_api/git_token/refresh"
      const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }
      const response = await csrfFetch(refreshTokenEndpoint, options)

      if (!response.ok) {
        return response.json().then(data => { throw new Error(data.message) })
      } else {
        response.json().then((data) => {
          this.theGitToken = data.token
        })
        return response.json();
      }
    }
  }
}
</script>
