<template>
  <div class="rounded-[16px] bg-white p-[36px]">
    <h3 class="text-[#303133] text-[20px] font-[600]">新建组织</h3>
    <div class="mt-[16px]">
      <div class="flex sm:flex-col gap-[16px] mb-[16px]">
        <div class="w-[284px] sm:w-auto">
          <p class="text-[#303133] flex gap-[4px] items-center text-[14px] mb-[8px]">
            组织命名空间
            <svg xmlns="http://www.w3.org/2000/svg" width="6" height="6" viewBox="0 0 6 6" fill="none"><path d="M2.21714 5.2179L3.35474 3.8499L4.49234 5.2179L5.12594 4.7571L4.20434 3.2595L5.77394 2.6115L5.52914 1.8771L3.88754 2.2659L3.74354 0.537903H2.96594L2.82194 2.2803L1.18034 1.8771L0.921143 2.6115L2.49074 3.2595L1.58354 4.7571L2.21714 5.2179Z" fill="#F56C6C"/></svg>
          </p>
          <el-input v-model="orgName" placeholder="2-20位字母数字以及 _ 构成的字符串" input-style="height: 40px" />
        </div>
        <div class="w-[284px] sm:w-auto">
          <p class="text-[#303133] text-[14px] mb-[8px]">组织别名</p>
          <el-input v-model="orgNickname" placeholder="请输入" input-style="height: 40px" />
        </div>
      </div>
      <div class="flex sm:flex-col gap-[16px] mb-[16px]">
        <div class="max-w-[284px]">
          <p class="text-[#303133] text-[14px] mb-[8px]">组织头像</p>
          <div>
            <input type="file" ref="orgAvatarFileInput" class="hidden" accept="image/*" @change="previewAvatar" />
            <el-button class="mr-[8px]" @click="uploadOrgAvatar">点击上传</el-button>
            <span class="text-[#606266] text-[14px]">{{ orgAvatar }}</span>
          </div>
        </div>
      </div>
      <div class="max-w-[284px] mb-[16px]">
          <p class="text-[#303133] flex gap-[4px] items-center text-[14px] mb-[8px]">
          组织类型
          <svg xmlns="http://www.w3.org/2000/svg" width="6" height="6" viewBox="0 0 6 6" fill="none"><path d="M2.21714 5.2179L3.35474 3.8499L4.49234 5.2179L5.12594 4.7571L4.20434 3.2595L5.77394 2.6115L5.52914 1.8771L3.88754 2.2659L3.74354 0.537903H2.96594L2.82194 2.2803L1.18034 1.8771L0.921143 2.6115L2.49074 3.2595L1.58354 4.7571L2.21714 5.2179Z" fill="#F56C6C"/></svg>
        </p>
        <el-select v-model="orgType" placeholder="选择" size="large">
          <el-option
            v-for="item in theOrgTypes"
            :key="item[1]"
            :label="item[0]"
            :value="item[1]"
          />
        </el-select>
      </div>
      <div class="mb-[16px]">
        <p class="text-[#303133] text-[14px] mb-[8px]">组织主页</p>
        <el-input v-model="orgHomepage" placeholder="https://example.com" input-style="height: 40px" />
      </div>
      <button class="bg-[#8AA2FF] w-full rounded-[4px] px-[20px] py-[9px] text-white" @click="createOrg">创建组织</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { nextTick, ref, inject, onMounted } from 'vue'
  import csrfFetch from "../../packs/csrfFetch.js"
  import { ElInput, ElMessage } from 'element-plus'

  const props = defineProps({
    orgTypes: String,
    currentUserProfile: String
  })

  const theOrgTypes = JSON.parse(props.orgTypes)
  const orgType = ref('')
  const orgAvatar = ref('待上传')
  const orgAvatarFileInput = ref(null)
  const orgName = ref('')
  const orgNickname = ref('')
  const orgHomepage = ref('')

  const uploadOrgAvatar = () => {
    orgAvatarFileInput.value.click()
  }

  const previewAvatar = () => {
    const file = orgAvatarFileInput.value.files[0];
    const maxSize = 1 * 1024 * 1024; // 1MB
    if (file && file.size <= maxSize) {
      orgAvatar.value = file.name;
    } else {
      orgAvatar.value = '待上传';
      ElMessage.error('请上传不超过1MB的图片文件');
    }
  }

  const createOrg = () => {
    if(orgName.value&&orgName.value!=''){
      submitOrgForm().then((data) => {
        ElMessage({
          message: '组织创建成功',
          type: 'success'
        })
        setTimeout(() => {
          window.location.href = "/organizations/" + orgName.value
        }, 500)
      })
      .catch(err => {
        ElMessage({
          message: err.message,
          type: 'warning'
        })
      })
    }else{
      ElMessage({
          message: '请填写组织命名空间',
          type: 'warning'
        })
    }

  }

  onMounted(() => {
  })

  async function submitOrgForm() {
    const orgCreateEndpoint = `/internal_api/organizations`;
    const formData = new FormData()
    const orgAvatarFile = orgAvatarFileInput.value.files[0]
    formData.append('name', orgName.value)
    formData.append('nickname', orgNickname.value)
    formData.append('org_type', orgType.value)
    formData.append('homepage', orgHomepage.value)
    if ( orgAvatarFile != undefined) {
      formData.append("logo", orgAvatarFile);
    }
    const options = {
      method: 'POST',
      body: formData
    };

    const response = await csrfFetch(orgCreateEndpoint, options)

    if (!response.ok) {
      return response.json().then(data => { throw new Error(data.message) })
    } else {
      return response.json();
    }
  }
</script>