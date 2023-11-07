<template>
  <div class="flex justify-center items-center mt-[50px] lg:mt-[350px]">
    <div
        class="absolute flex flex-col bg-white w-[766px] h-auto border rounded-lg p-[36px] gap-y-[24px] border-[#DCDFE6] bg-gradient-to-r shadow-xl">

      <form ref="forms" @submit.prevent="submitTheForm" class="flex flex-col text-[#303133] text-sm gap-y-[48px]">

        <!--姓名-->
        <div class="w-full h-auto">
          <div class="flex gap-x-[80px]">
            <div class="w-[320px]">
              <div class="flex items-center gap-[4px]">
                <label for="username">姓名</label>
                <svg xmlns="http://www.w3.org/2000/svg" width="6" height="6" viewBox="0 0 6 6" fill="none">
                  <path
                      d="M2.21714 5.2179L3.35474 3.8499L4.49234 5.2179L5.12594 4.7571L4.20434 3.2595L5.77394 2.6115L5.52914 1.8771L3.88754 2.2659L3.74354 0.537903H2.96594L2.82194 2.2803L1.18034 1.8771L0.921143 2.6115L2.49074 3.2595L1.58354 4.7571L2.21714 5.2179Z"
                      fill="#F56C6C"/>
                </svg>
              </div>
              <input
                  class="formInput w-full bg-white text-[#606266] rounded-[4px] border-solid border border-[#DCDFE6] leading-[40px] px-[15px] my-[10px]  outline-0"
                  type="text"
                  placeholder="你的名字"
                  name="user_name"
              />
            </div>

            <div class="w-[320px]">
              <div class="flex items-center gap-[4px]">
                <label for="phone">电话号码</label>
                <svg xmlns="http://www.w3.org/2000/svg" width="6" height="6" viewBox="0 0 6 6" fill="none">
                  <path
                      d="M2.21714 5.2179L3.35474 3.8499L4.49234 5.2179L5.12594 4.7571L4.20434 3.2595L5.77394 2.6115L5.52914 1.8771L3.88754 2.2659L3.74354 0.537903H2.96594L2.82194 2.2803L1.18034 1.8771L0.921143 2.6115L2.49074 3.2595L1.58354 4.7571L2.21714 5.2179Z"
                      fill="#F56C6C"/>
                </svg>
              </div>
              <input
                  class="formInput w-full bg-white text-[#606266] rounded-[4px] border-solid border border-[#DCDFE6] leading-[40px] px-[15px] my-[10px] outline-0"
                  type="tel"
                  placeholder="手机号码"
                  name="phone"
              />
            </div>
          </div>

          <div class="w-[306px] mt-[8px]">
            <div class="flex items-center gap-[4px]">
              <label for="email">工作电子邮箱地址</label>
              <svg xmlns="http://www.w3.org/2000/svg" width="6" height="6" viewBox="0 0 6 6" fill="none">
                <path
                    d="M2.21714 5.2179L3.35474 3.8499L4.49234 5.2179L5.12594 4.7571L4.20434 3.2595L5.77394 2.6115L5.52914 1.8771L3.88754 2.2659L3.74354 0.537903H2.96594L2.82194 2.2803L1.18034 1.8771L0.921143 2.6115L2.49074 3.2595L1.58354 4.7571L2.21714 5.2179Z"
                    fill="#F56C6C"/>
              </svg>
            </div>
            <input
                class="formInput w-full text-[#606266] rounded-[4px] border-solid border border-[#DCDFE6] leading-[40px] px-[15px] my-[10px] outline-0"
                type="email"
                placeholder="example@gmail.com"
                name="email"
            />
          </div>

        </div>
        <!--公司-->
        <div class="w-full h-auto">

          <div class="flex gap-x-[80px]">
            <div class="w-[320px]">
              <div class="flex items-center gap-[4px]">
                <label for="company_name">公司/单位名称</label>
                <svg xmlns="http://www.w3.org/2000/svg" width="6" height="6" viewBox="0 0 6 6" fill="none">
                  <path
                      d="M2.21714 5.2179L3.35474 3.8499L4.49234 5.2179L5.12594 4.7571L4.20434 3.2595L5.77394 2.6115L5.52914 1.8771L3.88754 2.2659L3.74354 0.537903H2.96594L2.82194 2.2803L1.18034 1.8771L0.921143 2.6115L2.49074 3.2595L1.58354 4.7571L2.21714 5.2179Z"
                      fill="#F56C6C"/>
                </svg>
              </div>
              <input
                  class="formInput w-full bg-white text-[#606266] rounded-[4px] border-solid border border-[#DCDFE6] leading-[40px] px-[15px] my-[10px] outline-0"
                  type="text"
                  placeholder="开放传神"
                  name="company_name"
              />
            </div>

            <div class="w-[320px]">
              <div class="flex items-center gap-[4px]">
                <label for="profession">职称</label>
                <svg xmlns="http://www.w3.org/2000/svg" width="6" height="6" viewBox="0 0 6 6" fill="none">
                  <path
                      d="M2.21714 5.2179L3.35474 3.8499L4.49234 5.2179L5.12594 4.7571L4.20434 3.2595L5.77394 2.6115L5.52914 1.8771L3.88754 2.2659L3.74354 0.537903H2.96594L2.82194 2.2803L1.18034 1.8771L0.921143 2.6115L2.49074 3.2595L1.58354 4.7571L2.21714 5.2179Z"
                      fill="#F56C6C"/>
                </svg>
              </div>
              <input
                  class="formInput w-full bg-white text-[#606266] rounded-[4px] border-solid border border-[#DCDFE6] leading-[40px] px-[15px] my-[10px]  outline-0"
                  type="text"
                  placeholder="首席执行官"
                  name="profession"
              />
            </div>
          </div>

          <div class="flex gap-x-[80px]">
            <div class="w-[320px] mt-[8px]">
              <div class="flex items-center gap-[4px]">
                <label for="company_web">公司/产品官网</label>
                <svg xmlns="http://www.w3.org/2000/svg" width="6" height="6" viewBox="0 0 6 6" fill="none">
                  <path
                      d="M2.21714 5.2179L3.35474 3.8499L4.49234 5.2179L5.12594 4.7571L4.20434 3.2595L5.77394 2.6115L5.52914 1.8771L3.88754 2.2659L3.74354 0.537903H2.96594L2.82194 2.2803L1.18034 1.8771L0.921143 2.6115L2.49074 3.2595L1.58354 4.7571L2.21714 5.2179Z"
                      fill="#F56C6C"/>
                </svg>
              </div>
              <input
                  class="formInput w-full bg-white text-[#606266] rounded-[4px] border-solid border border-[#DCDFE6] leading-[40px] px-[15px] my-[10px]  outline-0"
                  type="text"
                  placeholder="例：https://opencsg.com"
                  name="company_web"
              />
            </div>

            <div class="w-[320px] mt-[8px]">
              <div class="flex items-center gap-[4px]">
                <label for="industry">公司行业</label>
                <svg xmlns="http://www.w3.org/2000/svg" width="6" height="6" viewBox="0 0 6 6" fill="none">
                  <path
                      d="M2.21714 5.2179L3.35474 3.8499L4.49234 5.2179L5.12594 4.7571L4.20434 3.2595L5.77394 2.6115L5.52914 1.8771L3.88754 2.2659L3.74354 0.537903H2.96594L2.82194 2.2803L1.18034 1.8771L0.921143 2.6115L2.49074 3.2595L1.58354 4.7571L2.21714 5.2179Z"
                      fill="#F56C6C"/>
                </svg>
              </div>
              <el-select v-model="filterValue" @change="changeValue" placeholder="请选择一个选项" size="large"
                         class="w-full mt-[10px]">
                <el-option
                    v-for="item in filterValues"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    :disabled="item.disabled"
                />
              </el-select>
            </div>
          </div>

        </div>
        <!--desc-->
        <div class="w-full h-auto">
          <div class="w-full">
            <div class="flex items-center gap-[4px]">
              <label for="desc">请简要描述您的合作需求</label>
              <svg xmlns="http://www.w3.org/2000/svg" width="6" height="6" viewBox="0 0 6 6" fill="none">
                <path
                    d="M2.21714 5.2179L3.35474 3.8499L4.49234 5.2179L5.12594 4.7571L4.20434 3.2595L5.77394 2.6115L5.52914 1.8771L3.88754 2.2659L3.74354 0.537903H2.96594L2.82194 2.2803L1.18034 1.8771L0.921143 2.6115L2.49074 3.2595L1.58354 4.7571L2.21714 5.2179Z"
                    fill="#F56C6C"/>
              </svg>
            </div>
            <textarea name="desc"
                      class="formTextarea w-full bg-white h-[40px] text-[#606266] rounded-[4px] my-[10px] border leading-normal border-solid border-[#DCDFE6] py-[5px] px-[15px] outline-0"
                      placeholder="请提供您的合作意向及需求"
                      maxlength="100"
            ></textarea>
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

export default {
  props: {},
  components: {},
  data() {
    return {
      filterValue: '',
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
  mounted() {
    this.formInputs = document.getElementsByClassName("formInput")
    this.formTextarea = document.getElementsByClassName("formTextarea")
  },
  methods: {
    changeValue(selectedValue) {
      this.filterValue = selectedValue
    },

    submitTheForm() {
      const inputBtn = this.formInputs
      if (inputBtn[0].value == "") {
        ElMessage({message: "请您填写姓名", type: "warning"})
        return
      } else if (inputBtn[1].value == "") {
        ElMessage({message: "请您填写电话号码", type: "warning"})
        return
      } else if (inputBtn[2].value == "") {
        ElMessage({message: "请您填写邮箱", type: "warning"})
        return
      } else if (inputBtn[3].value == "") {
        ElMessage({message: "请您填写公司/单位名称", type: "warning"})
        return
      } else if (inputBtn[4].value == "") {
        ElMessage({message: "请您填写职称", type: "warning"})
        return
      } else if (inputBtn[5].value == "") {
        ElMessage({message: "请您填写公司/产品官网", type: "warning"})
        return
      }

      if (this.filterValue == '') {
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
      const inputBtn = this.formInputs
      const expertCreateEndpoint = '/api/leads'

      const jsonData = {
        name: inputBtn[0].value,
        phone: inputBtn[1].value,
        email: inputBtn[2].value,
        company: inputBtn[3].value,
        title: inputBtn[4].value,
        company_site: inputBtn[5].value,
        industry: this.filterValue,
        introduction: this.formTextarea[0].value
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
