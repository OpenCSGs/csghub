<template>
  <div class="flex flex-col gap-[32px] p-[16px] pt-[24px]">
    <div class="font-semibold text-[20px] leading-[28px] pt-[16px]">组织信息</div>
    <div>
      <div class="flex items-center text-[#344054] text-[14px] leading-[20px] gap-[4px] mb-[8px]">组织别名</div>
      <el-input class="w-full"
                v-model="orgNickName"
                placeholder="">
      </el-input>
    </div>
    <div>
      <div class="flex items-center gap-[4px] mb-[8px] text-[#344054] text-[14px] leading-[20px]">组织命名空间</div>
      <el-input class="w-full mb-[10px]"
                v-model="orgName"
                disabled
                placeholder="组织命名空间">
      </el-input>
      <p class="text-gray-500 text-[12px]">创建完成后，命名空间不可更改</p>
    </div>
    <div class="flex flex-col gap-[12px] fileInput">
      <div class="flex items-center gap-[4px] mb-[8px] text-[#344054] text-[14px] leading-[20px]">组织头像</div>
      <input ref="fileInput"
             type="file"
             class="hidden"
             @change="previewImage"/>
      <div class="flex flex-col gap-[20px]">
        <el-avatar :size="60" :src="avatarUrl"> </el-avatar>
        <div class="flex  gap-[20px] items-center">
          <div @click="uploadImage" class="flex gap-[4px] text-[14px] border border-[#3250BD] px-[12px] py-[8px] leading-[20px] text-center rounded-[8px] text-white cursor-pointer bg-[#3250BD]">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3.33366 13.5352C2.32867 12.8625 1.66699 11.7168 1.66699 10.4167C1.66699 8.46369 3.15992 6.85941 5.06678 6.68281C5.45684 4.31011 7.5172 2.5 10.0003 2.5C12.4835 2.5 14.5438 4.31011 14.9339 6.68281C16.8407 6.85941 18.3337 8.46369 18.3337 10.4167C18.3337 11.7168 17.672 12.8625 16.667 13.5352M6.66699 13.3333L10.0003 10M10.0003 10L13.3337 13.3333M10.0003 10V17.5" stroke="white" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/></svg>
            上传头像
          </div>
          <div @click="removeImage" class="text-[14px] leading-[20px] text-center text-[#223B99] cursor-pointer">
            移除
          </div>
        </div>
      </div>
    </div>
    <div>
      <div class="flex items-center gap-[4px] mb-[8px] text-[#344054] text-[14px] leading-[20px]">组织主页</div>
      <el-input class="w-full mb-[10px]"
                v-model="homepage"
                placeholder="组织主页">
      </el-input>
    </div>
    <div class="mb-[16px]">
          <p class="text-[#303133] flex gap-[4px] items-center text-[14px] mb-[8px]">
          组织类型
          <svg xmlns="http://www.w3.org/2000/svg" width="6" height="6" viewBox="0 0 6 6" fill="none"><path d="M2.21714 5.2179L3.35474 3.8499L4.49234 5.2179L5.12594 4.7571L4.20434 3.2595L5.77394 2.6115L5.52914 1.8771L3.88754 2.2659L3.74354 0.537903H2.96594L2.82194 2.2803L1.18034 1.8771L0.921143 2.6115L2.49074 3.2595L1.58354 4.7571L2.21714 5.2179Z" fill="#F56C6C"/></svg>
        </p>
        <el-select v-model="orgType" placeholder="选择" class="w-full">
          <el-option
            v-for="item in theOrgTypes"
            :key="item.key"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
    <div @click="saveProfile" class="w-max text-[14px] border border-[#3250BD] px-[12px] py-[8px] leading-[20px] text-center rounded-[8px] text-white cursor-pointer bg-[#3250BD]">
      保存设置
    </div>
  </div>
</template>
<script>
import csrfFetch from "../../packs/csrfFetch.js"
import { ElMessage } from "element-plus";
export default {
  props: {
    organization: Object
  },
  data() {
    return {
      orgName:this.organization.name,
      orgNickName:this.organization.nickname,
      avatarUrl:this.organization.avatar,
      homepage:this.organization.homepage,
      orgType:this.organization.org_type,
      theOrgTypes:[{key: '1', label: '企业', value: '企业'},
                   {key: '2', label: '高校', value: '高校'},
                   {key: '3', label: '非营利组织', value: '非营利组织'},
                   {key: '4', label: '社区组织', value: '社区组织'},]
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
      const organizationUpdateEndpoint = `/internal_api/organizations/${this.orgName}`;
      const formData = new FormData();
      const file = this.$refs.fileInput.files[0];
      if (file !== undefined) {
        formData.append("logo", file);
      }
      formData.append("name", this.orgName);
      formData.append("nickname", this.orgNickName);
      formData.append("homepage", this.homepage);
      formData.append("org_type", this.orgType);
      const options = {
        method: "PUT",
        body: formData,
      };

      try {
        const response = await csrfFetch(organizationUpdateEndpoint, options);
        if (!response.ok) {
          response.json().then(data => {
            ElMessage({
              message: data.message,
              type: "warning",
            })
          })
        } else {
          ElMessage({
            message: "organization已更新",
            type: "success",
          });
          this.$emit("updateOrganization", {
            logo: file && URL.createObjectURL(file),
            nickname: this.orgNickName,
            homepage: this.homepage,
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
