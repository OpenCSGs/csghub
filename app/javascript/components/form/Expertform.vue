<template>
  <div class="flex justify-center items-center mt-[200px] lg:mt-[350px]">
    <div
        class="absolute flex flex-col bg-white w-[500px] h-auto border rounded-lg p-[36px] gap-y-[24px] border-[#DCDFE6] bg-gradient-to-r shadow-xl">

      <div v-if="divTipVisible === true" class="flex items-center justify-center px-[16px] py-[9px] w-full font-normal text-[13px] text-[#909399] rounded-[4px] leading-[22px] outline-0 bg-[#F4F4F5] gap-[8px]">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
              d="M10 1.25C12.4742 1.315 14.5348 2.17104 16.1819 3.81813C17.829 5.46521 18.685 7.52583 18.75 10C18.685 12.4742 17.829 14.5348 16.1819 16.1819C14.5348 17.829 12.4742 18.685 10 18.75C7.52583 18.685 5.46521 17.829 3.81813 16.1819C2.17104 14.5348 1.315 12.4742 1.25 10C1.315 7.52583 2.17104 5.46521 3.81813 3.81813C5.46521 2.17104 7.52583 1.315 10 1.25ZM11.3088 6.62125C11.6475 6.62125 11.9275 6.52042 12.1488 6.31875C12.37 6.11708 12.4806 5.84687 12.4806 5.50812C12.4806 5.16937 12.37 4.89917 12.1488 4.6975C11.9275 4.49583 11.6508 4.395 11.3188 4.395C10.9867 4.395 10.71 4.49583 10.4887 4.6975C10.2675 4.89917 10.1569 5.16937 10.1569 5.50812C10.1569 5.84687 10.2675 6.11708 10.4887 6.31875C10.71 6.52042 10.9835 6.62125 11.3094 6.62125H11.3088ZM11.5431 13.6525C11.5431 13.5742 11.5496 13.47 11.5625 13.34C11.5754 13.21 11.5754 13.0863 11.5625 12.9688L10.5275 14.16C10.4233 14.2771 10.3158 14.3683 10.205 14.4338C10.0942 14.4992 9.99979 14.5188 9.92188 14.4925C9.80479 14.4404 9.75271 14.3492 9.76562 14.2188L11.4844 8.80875C11.5494 8.44417 11.4908 8.13167 11.3088 7.87125C11.1267 7.61083 10.8337 7.45458 10.43 7.4025C9.97417 7.41542 9.47604 7.6075 8.93563 7.97875C8.39521 8.35 7.92313 8.82208 7.51937 9.395V9.68813C7.50646 9.81854 7.50646 9.94229 7.51937 10.0594L8.55438 8.86812C8.65854 8.75104 8.76604 8.65979 8.87687 8.59438C8.98771 8.52896 9.07562 8.50937 9.14062 8.53562C9.27104 8.60062 9.31667 8.70479 9.2775 8.84812L7.57812 14.2387C7.48688 14.5642 7.5325 14.854 7.715 15.1081C7.8975 15.3623 8.21646 15.5348 8.67188 15.6256C9.32312 15.6127 9.87 15.424 10.3125 15.0594C10.755 14.6948 11.1652 14.226 11.5431 13.6531V13.6525Z"
              fill="#909399"/>
        </svg>
        <p>表单中填写的信息除电话号码外将展示在专家推荐页面</p>
        <svg xmlns="http://www.w3.org/2000/svg" @click="closeTipDiv" class="cursor-pointer" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
              d="M11.9375 3.35951L7.99996 7.29701L4.06246 3.35951C3.95812 3.26584 3.84096 3.21901 3.71096 3.21901C3.58096 3.21901 3.46629 3.26851 3.36696 3.36751C3.26762 3.46651 3.21812 3.58117 3.21846 3.71151C3.21879 3.84184 3.26562 3.95901 3.35896 4.06301L7.29646 8.00051L3.35896 11.938C3.22362 12.0733 3.17929 12.2348 3.22596 12.4225C3.27262 12.6102 3.38729 12.7273 3.56996 12.774C3.75262 12.8207 3.91662 12.7763 4.06196 12.641L7.99946 8.70351L11.937 12.641C12.0413 12.7347 12.1585 12.7815 12.2885 12.7815C12.4185 12.7815 12.5331 12.732 12.6325 12.633C12.7318 12.534 12.7813 12.4193 12.781 12.289C12.7806 12.1587 12.7338 12.0415 12.6405 11.9375L8.70296 8.00001L12.6405 4.06251C12.7758 3.92717 12.8201 3.76567 12.7735 3.57801C12.7268 3.39034 12.6096 3.27317 12.422 3.22651C12.2343 3.17984 12.0728 3.22417 11.9375 3.35951Z"
              fill="#909399"/>
        </svg>
      </div>

      <form ref="forms" @submit.prevent="submitTheForm" class="flex flex-col gap-y-[24px] text-[#303133] text-sm">
        <form-input @update:inputValue="handleUserNameInputValue" field="user_name" placeholder="请输入" label="姓名"/>
        <form-input @update:inputValue="handleUserNameInputValue" field="job_name" placeholder="请输入" label="职位名称"/>
        <form-input @update:inputValue="handleUserNameInputValue" field="phone" placeholder="请输入" label="电话号码"/>
        <form-input @update:inputValue="handleUserNameInputValue" field="company_name" placeholder="请输入" label="公司名称"/>
        <form-input @update:inputValue="handleUserNameInputValue" field="expertise" placeholder="请输入" label="擅长领域" :type_placeholder=true />
        <form-input @update:inputValue="handleUserNameInputValue" field="desc" placeholder="请输入" label="个人介绍" :type_placeholder=true />

        <div class="flex mt-[16px] gap-x-[16px]">
          <input class="flex w-[70px] text-white bg-[#409EFF] rounded-[4px] leading-[40px] cursor-pointer" type="submit"
                 :value="'提交'"/>
          <div
              class="flex justify-center items-center inline-block w-[70px] text-[#606266] bg-white border border-solid border-[#DCDFE6] rounded-[4px] leading-[40px] cursor-pointer"
              @click="dialogVisible = false">保存
          </div>
        </div>

      </form>
    </div>
  </div>
</template>
<script setup>
import {ElMessage} from "element-plus"
import {useCookies} from "vue3-cookies"
import {ref} from "vue"

import FormLabel from "./sub/FormLabel.vue"
import FormInput from "./sub/FormInput.vue"

const divTipVisible = ref(true)

const { cookies } = useCookies()

let user_name = null
let job_name = null
let phone = null
let company_name = null
let expertise = null
let desc = null

// 父组件接受子组件传来的值
const handleUserNameInputValue = (value) => {
  user_name = value
}
const handleJobNameInputValue = (value) => {
  job_name = value
}
const handlePhoneInputValue = (value) => {
  phone = value
}
const handleCompanyNameInputValue = (value) => {
  company_name = value
}
const handleExpertiseInputValue = (value) => {
  expertise = value
}
const handleDescInputValue = (value) => {
  desc = value
}

const closeTipDiv = () => {
  divTipVisible.value = false
};

const submitTheForm = () => {
  if (user_name == null) {
    ElMessage({message: "请您填写姓名", type: "warning"})
    return
  } else if (job_name == null) {
    ElMessage({message: "请您填写职位名称", type: "warning"})
    return
  } else if (phone == null) {
    ElMessage({message: "请您填写电话号码", type: "warning"})
    return
  } else if (company_name == null) {
    ElMessage({message: "请您填写公司名称", type: "warning"})
    return
  } else if (expertise == null) {
    ElMessage({message: "请您填写擅长领域", type: "warning"})
    return
  } else if (desc == null) {
    ElMessage({message: "请您填写个人介绍", type: "warning"})
    return
  }


  createExpert().catch(err => {
    ElMessage({
      message: err.message,
      type: 'warning'
    })
  })
}

async function createExpert() {
  const expertCreateEndpoint = '/api/leads'

  const jsonData = {
    name: user_name,
    title: job_name,
    phone: phone,
    company: company_name,
    expertise: expertise,
    introduction: desc
  }

  const jsonStr = JSON.stringify(jsonData)
  const option = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${cookies.get('idToken')}`,
      'Content-Type': 'application/json',
    },
    body: jsonStr
  }
  const response = await fetch(expertCreateEndpoint, option)

  if (!response.ok) {
    return response.json().then(data => {
      console.log(data)
      throw new Error(data.message)
    })
  } else {
    ElMessage({ message: "表单发送成功", type: "success" })

    setTimeout(() => {
      window.location.href = "/experts"
    }, 1500)
    return response.json()
  }
}
</script>
