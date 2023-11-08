<template>
  <div class="flex justify-center items-center mt-[50px] lg:mt-[350px]">
    <div
        class="absolute flex flex-col bg-white w-[766px] h-auto border rounded-lg p-[36px] gap-y-[24px] border-[#DCDFE6] bg-gradient-to-r shadow-xl">

      <form ref="forms" @submit.prevent="submitTheForm" class="flex flex-col text-[#303133] text-sm gap-y-[48px]">

        <!--姓名-->
        <div class="w-full h-auto">
          <div class="flex gap-x-[80px]">
            <div class="w-[320px]">
              <form-input @update:inputValue="handleUserNameInputValue" field="user_name" placeholder="你的名字" label="姓名"/>
            </div>

            <div class="w-[320px]">
              <form-input @update:inputValue="handlePhoneInputValue" field="phone" placeholder="手机号码" label="手机号码"/>
            </div>
          </div>

          <div class="w-[306px] mt-[24px]">
            <form-input @update:inputValue="handleEmailInputValue" field="email" placeholder="example@gmail.com" label="工作电子邮箱地址"/>
          </div>

        </div>
        <!--公司-->
        <div class="w-full h-auto">

          <div class="flex gap-x-[80px]">
            <div class="w-[320px]">
              <form-input @update:inputValue="handleCompanyNameInputValue" field="company_name" placeholder="开放传神" label="公司/单位名称"/>
            </div>

            <div class="w-[320px]">
              <form-input @update:inputValue="handleProfessionInputValue" field="profession" placeholder="首席执行官" label="职称"/>
            </div>
          </div>

          <div class="flex gap-x-[80px]">
            <div class="w-[320px] mt-[24px]">
              <form-input @update:inputValue="handleCompanyWebInputValue" field="company_web" placeholder="例：https://opencsg.com" label="公司/产品官网"/>
            </div>

            <div class="w-[320px] mt-[24px]">
              <form-select @update:filterValue="handleIndustryInputValue" field="industry" placeholder="请选择一个选项" label="公司行业"/>
            </div>
          </div>

        </div>
        <!--desc-->
        <div class="w-full h-auto mt-[10px]">
          <div class="w-full">
            <form-input @update:inputValue="handleDescInputValue" field="desc" placeholder="请提供您的合作意向及需求" label="请简要描述您的合作需求" :type_placeholder=true />
          </div>
        </div>

        <div class="flex gap-x-[16px]">
          <input class="flex w-[88px] text-white bg-[#409EFF] rounded-[4px] leading-[40px] cursor-pointer" type="submit"
                 :value="'提交表单'"/>
          <div
              class="flex justify-center items-center inline-block w-[70px] text-[#606266] bg-white border border-solid border-[#DCDFE6] rounded-[4px] leading-[40px] cursor-pointer"
              @click="">保存
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import {ElMessage} from "element-plus"
import {useCookies} from "vue3-cookies"

import FormLabel from "./sub/FormLabel.vue"
import FormInput from "./sub/FormInput.vue"
import FormSelect from "./sub/FormSelect.vue"


export default {
  props: {},
  components: {
    FormLabel,
    FormInput,
    FormSelect
  },
  data() {
    return {
      user_name: null,
      phone: null,
      email: null,

      company_name: null,
      company_web: null,
      industry: null,
      desc: null,

      profession: null,

      filterValue: null,
      filesUpdated: false,
      filterValues: [
        {
          value: 'option1',
          label: '选项1'
        },
        {
          value: 'option2',
          label: '选项2'
        }
      ],
    }
  },

  mounted() {},

  methods: {
    handleUserNameInputValue(value) {
      this.user_name = value
    },
    handlePhoneInputValue(value) {
      this.phone = value
    },
    handleEmailInputValue(value) {
      this.email = value
    },

    handleCompanyNameInputValue(value) {
      this.company_name = value
    },
    handleProfessionInputValue(value) {
      this.profession = value
    },
    handleCompanyWebInputValue(value) {
      this.company_web = value
    },
    handleIndustryInputValue(value) {
      this.industry = value
    },

    handleDescInputValue(value) {
      this.desc = value
    },


    changeValue(selectedValue) {
      this.filterValue = selectedValue
    },

    submitTheForm() {
      if (this.user_name == null) {
        ElMessage({message: "请您填写姓名", type: "warning"})
        return
      } else if (this.phone == null) {
        ElMessage({message: "请您填写电话号码", type: "warning"})
        return
      } else if (this.email == null) {
        ElMessage({message: "请您填写邮箱", type: "warning"})
        return
      } else if (this.company_name == null) {
        ElMessage({message: "请您填写公司/单位名称", type: "warning"})
        return
      } else if (this.profession == null) {
        ElMessage({message: "请您填写职称", type: "warning"})
        return
      } else if (this.company_web == null) {
        ElMessage({message: "请您填写公司/产品官网", type: "warning"})
        return
      } else if (this.industry == null) {
        ElMessage({message: "请您选择公司行业", type: "warning"})
        return
      }

      this.createPartner().catch(err => {
        ElMessage({
          message: err.message,
          type: 'warning'
        })
      })
    },

    async createPartner() {

      const { cookies } = useCookies()
      const expertCreateEndpoint = '/api/leads'

      const jsonData = {
        name: this.user_name,
        phone: this.phone,
        email: this.email,
        company: this.company_name,
        title: this.profession,
        company_site: this.company_web,
        industry: this.industry,
        introduction: this.desc
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
          window.location.href = "/partners"
        }, 1500)
        return response.json()
      }
    }
  }
}
</script>
