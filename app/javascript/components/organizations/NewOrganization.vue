<template>
  <div class="rounded-[16px] bg-white p-[36px]">
    <h3 class="text-[#303133] text-[20px] font-[600]">新建组织</h3>
    <div class="mt-[16px]">
      <div class="flex sm:flex-col gap-[16px] mb-[16px]">
        <div class="w-[284px] sm:w-auto">
          <p class="text-[#303133] text-[14px] mb-[8px]">组织命名空间</p>
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
            <input type="file" ref="orgAvatarFileInput" class="hidden" @change="previewAvatar" />
            <el-button class="mr-[8px]" @click="uploadOrgAvatar">点击上传</el-button>
            <span class="text-[#606266] text-[14px]">{{ orgAvatar }}</span>
          </div>
        </div>
      </div>
      <div class="max-w-[284px] mb-[16px]">
        <p class="text-[#303133] text-[14px] mb-[8px]">组织类型</p>
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
    orgAvatar.value = orgAvatarFileInput.value.files[0].name
  }

  const createOrg = () => {
    submitOrgForm().then((data) => {
      ElMessage({
        message: '组织创建成功',
        type: 'success'
      })
      setTimeout(() => {
        window.location.href = props.currentUserProfile
      }, 500)
    })
    .catch(err => {
      ElMessage({
        message: err.message,
        type: 'warning'
      })
    })
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