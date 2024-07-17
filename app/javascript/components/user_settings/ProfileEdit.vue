<template>
  <div class="flex flex-col gap-[24px] px-6 py-10 border-l">
    <!-- avatar -->
    <div>
      <el-avatar :size="120" :src="avatarUrl"> </el-avatar>
      <div class="flex gap-[12px] fileInput">
        <input ref="fileInput"
              type="file"
              class="hidden"
              @change="uploadAvatar"/>
        <div @click="uploadImage" class="text-[14px] border border-[#DCDFE6] px-[20px] py-[9px] leading-[22px] text-center rounded-[8px] text-white cursor-pointer bg-[#409EFF]">
          {{ $t('profile.edit.uploadAvatar') }}
        </div>
        <div @click="removeImage" class="text-[14px] border border-[#DCDFE6] px-[20px] py-[9px] leading-[22px] text-center rounded-[8px] text-[#606266] cursor-pointer bg-white">
          {{ $t('profile.edit.removeAvatar') }}
        </div>
      </div>
    </div>

    <!-- name -->
    <div>
      <div class="flex items-center gap-[4px] mb-[8px]">
        {{ $t('all.userName') }}
        <SvgIcon name="input_required" />
      </div>
      <el-input v-if="name.trim().length === 0"
                class="max-w-[600px]"
                v-model="inputName"
                :placeholder="$t('all.userName')">
      </el-input>
      <el-input v-else
                class="max-w-[600px]"
                v-model="inputName"
                disabled
                :placeholder="$t('all.userName')">
      </el-input>
      <p class="text-gray-500 text-[12px] italic pt-1">{{ $t('rule.nameRule') }}</p>
    </div>

    <!-- email -->
    <div>
      <div class="flex items-center gap-[4px] mb-[8px]">
        {{ $t('all.email') }}
        <SvgIcon name="input_required" />
      </div>
      <el-input class="max-w-[600px]"
                v-model="inputEmail"
                :placeholder="$t('all.email')">
      </el-input>
    </div>

    <!-- nickname -->
    <div>
      <div class="flex items-center gap-[4px] mb-[8px]">{{ $t('all.nickName') }}</div>
      <el-input class="max-w-[600px]"
                v-model="inputNickname"
                :placeholder="$t('all.nickName')">
      </el-input>
    </div>

    <!-- phone -->
    <div>
      <div class="flex items-center gap-[4px] mb-[8px]">
        {{ $t('all.phone') }}
      </div>
      <div class="flex flex-col gap-[8px]">
        <el-input class="max-w-[600px]"
                  v-model="inputPhone"
                  ref="phoneInputElement"
                  :disabled="!updatePhoneEnabled"
                  :placeholder="$t('all.phone')">
        </el-input>
        <div v-if="updatePhoneEnabled" class="flex gap-[13px] max-w-[400px] items-center mt-[16px]">
          <div class="flex items-center">
            <p class="w-[88px] h-[40px] text-[#98A2B3] flex items-center justify-center rounded-l-md border border-r-0 border-gray-300 bg-gray-200">
              {{ $t('profile.edit.smsCode') }}
            </p>
            <input class="w-[117px] px-[12px] py-[8px] h-[40px] rounded-r-md border bg-white"
                  v-model="inputSmsCode">
            </input>
          </div>
          <button v-if="inCountDown"
                  class="rounded-md border border-gray-200 bg-gray-200 shadow-sm px-[14px] py-[8px] font-[500] text-[#98A2B3] text-[14px] leading-[20px]"
          >
            {{ countdown }}s {{ $t('profile.edit.retrySendSms') }}
          </button>
          <button v-else
                  @click="sendSmsCode"
                  class="rounded-md border border-[#409EFF] bg-[#409EFF] shadow-sm px-[14px] py-[8px] font-[500] text-white text-[14px] leading-[20px]"
          >
            {{ $t('profile.edit.sendSms') }}
          </button>
        </div>
        <el-button v-else
                  class="w-[120px]"
                  @click="enableUpdatePhone"
        >
          {{ $t('profile.edit.updatePhone') }}
        </el-button>
      </div>
    </div>

    <!-- homepage -->
    <div>
      <div class="flex items-center gap-[4px] mb-[8px]">{{ $t('all.homepage') }}</div>
      <el-input class="max-w-[600px]"
                v-model="inputHomepage"
                :placeholder="this.$t('all.homepage')">
      </el-input>
    </div>

    <!-- bio -->
    <div>
      <div class="flex items-center gap-[4px] mb-[8px]">{{ $t('all.bio') }}</div>
      <el-input class="max-w-[600px]"
                v-model="inputBio"
                clearable
                type="textarea"
                :autosize="{minRows: 8, maxRows: 30}"
                :placeholder="this.$t('all.bio')">
      </el-input>
    </div>

    <div @click="saveProfile" class="w-[111px] text-[14px] border border-[#DCDFE6] px-[16px] py-[5px] leading-[22px] text-center rounded-[8px] text-white cursor-pointer bg-[#409EFF]">
      {{ $t('all.save') }}
    </div>
  </div>
</template>
<script>
import csrfFetch from "../../packs/csrfFetch.js"
import { ElMessage } from "element-plus"

export default {
  props: {
    name: String,
    nickname: String,
    avatar: String,
    phone: String,
    email: String,
    homepage: String,
    bio: String,
    displayName: String,
  },
  data() {
    return {
      inputName: this.name,
      inputNickname: this.nickname,
      inputPhone: this.phone,
      inputEmail: this.email,
      inputHomepage: this.homepage,
      inputBio: this.bio,
      avatarUrl: this.avatar,
      inputSmsCode: '',
      generatedSmscode: '',
      updatePhoneEnabled: false,
      inCountDown: false,
      countdown: 30,
      intervalId: null,
      phoneJustSendcode: this.phone
    };
  },
  mounted() {},
  methods: {
    async sendSmsCode() {
      const profileSmsEndpoint = `/internal_api/users/sms`;
      this.generatedSmscode = Math.floor(100000 + Math.random() * 900000).toString()
      this.phoneJustSendcode = this.inputPhone
      const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: this.inputPhone,
          code: this.generatedSmscode
        })
      }
      const response = await csrfFetch(profileSmsEndpoint, options)
      if (!response.ok) {
        response.json().then(data => {
          ElMessage({
            message: data.Message,
            type: "warning",
          })
        })
      } else {
        this.inCountDown = true
        this.intervalId = setInterval(() => {
          if (this.countdown > 0) {
            this.countdown--
          } else {
            clearInterval(this.intervalId)
            this.inCountDown = false
          }
        }, 1000)

        ElMessage({
          message: this.$t('profile.edit.smsSented'),
          type: "success",
        })
      }
    },
    enableUpdatePhone() {
      this.updatePhoneEnabled = true
      this.$refs.phoneInputElement.disabled = false
    },
    disableUpdatePhone() {
      this.updatePhoneEnabled = false
      this.inputSmsCode = ''
      this.generatedSmscode = ''
      this.$refs.phoneInputElement.disabled = true
    },
    uploadImage() {
      this.$refs.fileInput.click();
    },
    removeImage() {
      this.$refs.fileInput.value = null;
      this.avatarUrl = "";
    },
    async uploadAvatar() {
      const uploadEndpoint = `/internal_api/upload`;
      const formData = new FormData()
      formData.append("file", this.$refs.fileInput.files[0])
      const options = {
        method: 'POST',
        body: formData
      }
      const response = await csrfFetch(uploadEndpoint, options)
      const result = await response.json()
      if (!response.ok) {
        ElMessage({ message: result.message, type: 'warning' })
      } else {
        this.avatarUrl = result.url
      }
    },
    async updateProfile() {
      const profileUpdateEndpoint = `/internal_api/users/${this.displayName}`;
      const formData = new FormData();
      if (this.phoneJustSendcode !== this.inputPhone) {
        ElMessage({
          message: this.$t('profile.edit.phoneNotMatch'),
          type: "warning",
        });
        return
      }
      if (this.generatedSmscode !== this.inputSmsCode) {
        ElMessage({
          message: this.$t('profile.edit.smsNotMatch'),
          type: "warning",
        });
        return
      }
      formData.append("avatar", this.avatarUrl);
      formData.append("name", this.inputName);
      formData.append("nickname", this.inputNickname);
      formData.append("phone", this.inputPhone);
      formData.append("email", this.inputEmail);
      formData.append("homepage", this.inputHomepage);
      formData.append("bio", this.inputBio);
      const options = {
        method: "PUT",
        body: formData,
      };

      try {
        const response = await csrfFetch(profileUpdateEndpoint, options);
        if (!response.ok) {
          response.json().then(data => {
            ElMessage({
              message: data.message,
              type: "warning",
            })
          })
        } else {
          ElMessage({
            message: this.$t('profile.edit.updateSuccess'),
            type: "success",
          });
          this.disableUpdatePhone()
          this.$emit("updateUserInfo", {
            avatar: this.avatarUrl,
            name: this.inputName,
            nickname: this.inputNickname
          });
          // 处理成功响应
          setTimeout(() => {
            window.location.reload()
          }, 1000)
        }
      } catch (error) {
        console.error(error);
      }
    },
    saveProfile() {
      if (this.inputName.trim().length === 0 || this.inputEmail.trim().length === 0) {
        ElMessage({
          message: "请提供用户名和邮箱",
          type: "warning",
        });

        return
      }
      this.updateProfile();
    },
  },
};
</script>
