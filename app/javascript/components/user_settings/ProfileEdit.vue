<template>
  <div class="flex flex-col gap-[24px] p-[16px]">
    <div class="font-semibold text-[20px] leading-[28px]">个人资料设置</div>
    <el-avatar :size="120" :src="avatarUrl"> </el-avatar>
    <div class="flex gap-[12px] fileInput">
      <input ref="fileInput"
             type="file"
             class="hidden"
             @change="previewImage"/>
      <div @click="uploadImage" class="text-[14px] border border-[#DCDFE6] px-[20px] py-[9px] leading-[22px] text-center rounded-[8px] text-white cursor-pointer bg-[#409EFF]">
        上传头像
      </div>
      <div @click="removeImage" class="text-[14px] border border-[#DCDFE6] px-[20px] py-[9px] leading-[22px] text-center rounded-[8px] text-[#606266] cursor-pointer bg-white">
        移除头像
      </div>
    </div>
    <div>
      <div class="flex items-center gap-[4px] mb-[8px]">用户名</div>
      <p class="text-gray-500 text-[12px] italic">* 2-20位字母数字以及 _ - 构成的字符串，- _ 不能连续出现</p>
      <el-input class="max-w-[400px]"
                v-model="inputName"
                disabled
                placeholder="username">
      </el-input>
    </div>
    <div>
      <div class="flex items-center gap-[4px] mb-[8px]">用户昵称</div>
      <el-input class="max-w-[400px]"
                v-model="inputNickname"
                placeholder="昵称">
      </el-input>
    </div>
    <div>
      <div class="flex items-center gap-[4px] mb-[8px]">手机号码<svg xmlns="http://www.w3.org/2000/svg" width="6" height="6" viewBox="0 0 6 6" fill="none"><path d="M2.21714 5.21809L3.35474 3.85009L4.49234 5.21809L5.12594 4.75729L4.20434 3.25969L5.77394 2.61169L5.52914 1.87729L3.88754 2.26609L3.74354 0.538086H2.96594L2.82194 2.28049L1.18034 1.87729L0.921143 2.61169L2.49074 3.25969L1.58354 4.75729L2.21714 5.21809Z" fill="#F56C6C"/></svg>
      </div>
      <el-input class="max-w-[400px]"
                v-model="inputPhone"
                disabled
                placeholder="手机号码">
      </el-input>
    </div>
    <div>
      <div class="flex items-center gap-[4px] mb-[8px]">邮箱<svg xmlns="http://www.w3.org/2000/svg" width="6" height="6" viewBox="0 0 6 6" fill="none"><path d="M2.21714 5.21809L3.35474 3.85009L4.49234 5.21809L5.12594 4.75729L4.20434 3.25969L5.77394 2.61169L5.52914 1.87729L3.88754 2.26609L3.74354 0.538086H2.96594L2.82194 2.28049L1.18034 1.87729L0.921143 2.61169L2.49074 3.25969L1.58354 4.75729L2.21714 5.21809Z" fill="#F56C6C"/></svg>
      </div>
      <el-input class="max-w-[400px]"
                v-model="inputEmail"
                placeholder="邮箱">
      </el-input>
    </div>
    <div @click="saveProfile" class="w-[111px] text-[14px] border border-[#DCDFE6] px-[16px] py-[5px] leading-[22px] text-center rounded-[8px] text-white cursor-pointer bg-[#409EFF]">
      保存
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
    displayName: String,
  },
  data() {
    return {
      inputName: this.name,
      inputNickname: this.nickname,
      inputPhone: this.phone,
      inputEmail: this.email,
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
      formData.append("name", this.inputName);
      formData.append("nickname", this.inputNickname);
      formData.append("email", this.inputEmail);
      const options = {
        method: "PUT",
        body: formData,
      };

      try {
        const response = await csrfFetch(profileUpdateEndpoint, options);
        if (!response.ok) {
          ElMessage({
            message: "profile更新失败",
            type: "warning",
          });
        } else {
          ElMessage({
            message: "profile已更新",
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
