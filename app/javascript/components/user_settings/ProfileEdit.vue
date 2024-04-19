<template>
  <div class="flex flex-col gap-[24px] p-[16px]">
    <div class="font-semibold text-[20px] leading-[28px]">{{ $t('profile.edit.title') }}</div>
    <el-avatar :size="120" :src="avatarUrl"> </el-avatar>
    <div class="flex gap-[12px] fileInput">
      <input ref="fileInput"
             type="file"
             class="hidden"
             @change="previewImage"/>
      <div @click="uploadImage" class="text-[14px] border border-[#DCDFE6] px-[20px] py-[9px] leading-[22px] text-center rounded-[8px] text-white cursor-pointer bg-[#409EFF]">
        {{ $t('profile.edit.uploadAvatar') }}
      </div>
      <div @click="removeImage" class="text-[14px] border border-[#DCDFE6] px-[20px] py-[9px] leading-[22px] text-center rounded-[8px] text-[#606266] cursor-pointer bg-white">
        {{ $t('profile.edit.removeAvatar') }}
      </div>
    </div>

    <!-- name -->
    <div>
      <div class="flex items-center gap-[4px] mb-[8px]">{{ $t('all.userName') }}</div>
      <p class="text-gray-500 text-[12px] italic">{{ $t('rule.nameRule') }}</p>
      <p class="text-gray-500 text-[12px] italic">* {{ $t('rule.notChangable') }}</p>
      <el-input v-if="name.trim().length === 0"
                class="max-w-[400px]"
                v-model="inputName"
                :placeholder="$t('all.userName')">
      </el-input>
      <el-input v-else
                class="max-w-[400px]"
                v-model="inputName"
                disabled
                :placeholder="$t('all.userName')">
      </el-input>
    </div>

    <!-- nickname -->
    <div>
      <div class="flex items-center gap-[4px] mb-[8px]">{{ $t('all.nickName') }}</div>
      <el-input class="max-w-[400px]"
                v-model="inputNickname"
                :placeholder="$t('all.nickName')">
      </el-input>
    </div>

    <!-- phone -->
    <div>
      <div class="flex items-center gap-[4px] mb-[8px]">
        {{ $t('all.phone') }}
        <svg xmlns="http://www.w3.org/2000/svg" width="6" height="6" viewBox="0 0 6 6" fill="none"><path d="M2.21714 5.21809L3.35474 3.85009L4.49234 5.21809L5.12594 4.75729L4.20434 3.25969L5.77394 2.61169L5.52914 1.87729L3.88754 2.26609L3.74354 0.538086H2.96594L2.82194 2.28049L1.18034 1.87729L0.921143 2.61169L2.49074 3.25969L1.58354 4.75729L2.21714 5.21809Z" fill="#F56C6C"/></svg>
      </div>
      <el-input class="max-w-[400px]"
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
                 class="ml-[12px]"
                 @click="enableUpdatePhone"
      >
        {{ $t('profile.edit.updatePhone') }}
      </el-button>
    </div>

    <!-- email -->
    <div>
      <div class="flex items-center gap-[4px] mb-[8px]">{{ $t('all.email') }}<svg xmlns="http://www.w3.org/2000/svg" width="6" height="6" viewBox="0 0 6 6" fill="none"><path d="M2.21714 5.21809L3.35474 3.85009L4.49234 5.21809L5.12594 4.75729L4.20434 3.25969L5.77394 2.61169L5.52914 1.87729L3.88754 2.26609L3.74354 0.538086H2.96594L2.82194 2.28049L1.18034 1.87729L0.921143 2.61169L2.49074 3.25969L1.58354 4.75729L2.21714 5.21809Z" fill="#F56C6C"/></svg>
      </div>
      <el-input class="max-w-[400px]"
                v-model="inputEmail"
                :placeholder="$t('all.email')">
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
    displayName: String,
  },
  data() {
    return {
      inputName: this.name,
      inputNickname: this.nickname,
      inputPhone: this.phone,
      inputEmail: this.email,
      avatarUrl: this.avatar,
      inputSmsCode: '',
      generatedSmscode: '',
      updatePhoneEnabled: false,
      inCountDown: false,
      countdown: 30,
      intervalId: null
    };
  },
  mounted() {},
  methods: {
    async sendSmsCode() {
      const profileSmsEndpoint = `/internal_api/users/sms`;
      this.generatedSmscode = Math.floor(100000 + Math.random() * 900000).toString()
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
      this.$refs.phoneInputElement.disabled = true
    },
    uploadImage() {
      this.$refs.fileInput.click();
    },
    removeImage() {
      this.$refs.fileInput.value = null;
      this.avatarUrl = "";
    },
    previewImage() {
      this.avatarUrl = URL.createObjectURL(this.$refs.fileInput.files[0]);
    },
    async updateProfile() {
      const profileUpdateEndpoint = `/internal_api/users/${this.displayName}`;
      const formData = new FormData();
      const file = this.$refs.fileInput.files[0];
      if (file !== undefined) {
        formData.append("avatar", file);
      }
      if (this.generatedSmscode !== this.inputSmsCode) {
        ElMessage({
          message: this.$t('profile.edit.smsNotMatch'),
          type: "warning",
        });

        return
      }
      formData.append("name", this.inputName);
      formData.append("nickname", this.inputNickname);
      formData.append("phone", this.inputPhone);
      formData.append("email", this.inputEmail);
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
          this.$emit("updateUserInfo", {
            avatar: file && URL.createObjectURL(file),
            name: this.inputName,
            nickname: this.inputNickname
          });
          this.disableUpdatePhone()
          // 处理成功响应
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
