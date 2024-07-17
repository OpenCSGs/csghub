<template>
  <div class="flex flex-col gap-[24px] px-6 py-10 border-l">
    <div class="font-semibold text-[20px] leading-[28px]">{{ $t('profile.edit.title') }}</div>
    <div>
      <div class="flex items-center gap-[4px] mb-[8px]">{{ $t('all.userName') }}</div>
      <el-input class="max-w-[600px]"
                v-model="inputName"
                disabled
                :placeholder="this.$t('all.userName')">
      </el-input>
      <p class="text-gray-500 text-[12px] italic pt-1">{{ $t('rule.nameRule') }}</p>
    </div>
    <div>
      <div class="flex items-center gap-[4px] mb-[8px]">用户头像</div>
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
    <div>
      <div class="flex items-center gap-[4px] mb-[8px]">{{ $t('all.nickName') }}</div>
      <el-input class="max-w-[600px]"
                v-model="inputNickname"
                :placeholder="this.$t('all.nickName')">
      </el-input>
    </div>
    <div>
      <div class="flex items-center gap-[4px] mb-[8px]">{{ $t('all.homepage') }}</div>
      <el-input class="max-w-[600px]"
                v-model="inputHomepage"
                :placeholder="this.$t('all.homepage')">
      </el-input>
    </div>
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
    <div>
      <div class="flex items-center gap-[4px] mb-[8px]">{{ $t('all.phone') }}<svg xmlns="http://www.w3.org/2000/svg" width="6" height="6" viewBox="0 0 6 6" fill="none"><path d="M2.21714 5.21809L3.35474 3.85009L4.49234 5.21809L5.12594 4.75729L4.20434 3.25969L5.77394 2.61169L5.52914 1.87729L3.88754 2.26609L3.74354 0.538086H2.96594L2.82194 2.28049L1.18034 1.87729L0.921143 2.61169L2.49074 3.25969L1.58354 4.75729L2.21714 5.21809Z" fill="#F56C6C"/></svg>
      </div>
      <el-input class="max-w-[600px]"
                v-model="inputPhone"
                disabled
                :placeholder="this.$t('all.phone')">
      </el-input>
    </div>
    <div>
      <div class="flex items-center gap-[4px] mb-[8px]">{{ $t('all.email') }}<svg xmlns="http://www.w3.org/2000/svg" width="6" height="6" viewBox="0 0 6 6" fill="none"><path d="M2.21714 5.21809L3.35474 3.85009L4.49234 5.21809L5.12594 4.75729L4.20434 3.25969L5.77394 2.61169L5.52914 1.87729L3.88754 2.26609L3.74354 0.538086H2.96594L2.82194 2.28049L1.18034 1.87729L0.921143 2.61169L2.49074 3.25969L1.58354 4.75729L2.21714 5.21809Z" fill="#F56C6C"/></svg>
      </div>
      <el-input class="max-w-[600px]"
                v-model="inputEmail"
                :placeholder="this.$t('all.email')">
      </el-input>
    </div>
    <div @click="saveProfile" class="w-[111px] text-[14px] border border-[#DCDFE6] px-[16px] py-[5px] leading-[22px] text-center rounded-[8px] text-white cursor-pointer bg-[#409EFF]">
      {{ $t('all.save') }}
    </div>
  </div>
</template>
<script>
import csrfFetch from "../../packs/csrfFetch.js"
import { useCookies } from "vue3-cookies";
import { ElMessage } from "element-plus";
const { cookies } = useCookies();
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
    };
  },
  mounted() {},
  methods: {
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
      formData.append("avatar", this.avatarUrl);
      formData.append("name", this.inputName);
      formData.append("nickname", this.inputNickname);
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
          this.$emit("updateUserInfo", {
            avatar: file && URL.createObjectURL(file),
            name: this.inputName,
            nickname: this.inputNickname
          });
          // 处理成功响应
        }
      } catch (error) {
        console.error(error);
      }
    },
    saveProfile() {
      this.updateProfile();
    },
  },
};
</script>
