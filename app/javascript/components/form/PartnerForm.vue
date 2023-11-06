<template>
  <div class="flex justify-center items-center mt-[350px] lg:mt-[350px]">
    <div
        class="absolute flex flex-col bg-white w-[766px] h-auto border rounded-lg p-[36px] gap-y-[24px] border-[#DCDFE6] bg-gradient-to-r shadow-xl">

      <form ref="forms" @submit.prevent="submitTheForm" class="flex flex-col text-[#303133] text-sm gap-y-[48px]">

        <!--姓名-->
        <div class="w-full h-auto">
          <div class="flex gap-x-[80px]">
          <div class="w-[350px]">
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
                placeholder="178 0106 1972"
                name="phone"
            />
          </div>
          </div>

          <div class="w-[320px] mt-[8px]">
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
        <!--职位-->
        <div class="w-full h-auto">

          <div class="flex gap-x-[80px]">
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

          <div class="w-[320px]">
            <div class="flex items-center gap-[4px]">
              <label for="department">部门</label>
              <svg xmlns="http://www.w3.org/2000/svg" width="6" height="6" viewBox="0 0 6 6" fill="none">
                <path
                    d="M2.21714 5.2179L3.35474 3.8499L4.49234 5.2179L5.12594 4.7571L4.20434 3.2595L5.77394 2.6115L5.52914 1.8771L3.88754 2.2659L3.74354 0.537903H2.96594L2.82194 2.2803L1.18034 1.8771L0.921143 2.6115L2.49074 3.2595L1.58354 4.7571L2.21714 5.2179Z"
                    fill="#F56C6C"/>
              </svg>
            </div>
            <el-select v-model="filterValue" @change="changeValue" placeholder="请选择一个选项" size="large" class="w-full mt-[10px] h-full">
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

          <div class="flex gap-x-[80px]">
          <div class="w-[320px] mt-[8px]">
            <div class="flex items-center gap-[4px]">
              <label for="company_name">公司名称</label>
              <svg xmlns="http://www.w3.org/2000/svg" width="6" height="6" viewBox="0 0 6 6" fill="none">
                <path
                    d="M2.21714 5.2179L3.35474 3.8499L4.49234 5.2179L5.12594 4.7571L4.20434 3.2595L5.77394 2.6115L5.52914 1.8771L3.88754 2.2659L3.74354 0.537903H2.96594L2.82194 2.2803L1.18034 1.8771L0.921143 2.6115L2.49074 3.2595L1.58354 4.7571L2.21714 5.2179Z"
                    fill="#F56C6C"/>
              </svg>
            </div>
            <input
                class="formInput w-full bg-white text-[#606266] rounded-[4px] border-solid border border-[#DCDFE6] leading-[40px] px-[15px] my-[10px]  outline-0"
                type="text"
                placeholder="开放传神"
                name="company_name"
            />
          </div>

          <div class="w-[320px] mt-[8px]">
            <div class="flex items-center gap-[4px]">
              <label for="web">公司网站</label>
              <svg xmlns="http://www.w3.org/2000/svg" width="6" height="6" viewBox="0 0 6 6" fill="none">
                <path
                    d="M2.21714 5.2179L3.35474 3.8499L4.49234 5.2179L5.12594 4.7571L4.20434 3.2595L5.77394 2.6115L5.52914 1.8771L3.88754 2.2659L3.74354 0.537903H2.96594L2.82194 2.2803L1.18034 1.8771L0.921143 2.6115L2.49074 3.2595L1.58354 4.7571L2.21714 5.2179Z"
                    fill="#F56C6C"/>
              </svg>
            </div>
            <input
                class="formInput w-full bg-white text-[#606266] rounded-[4px] border-solid border border-[#DCDFE6] leading-[40px] px-[15px] my-[10px] outline-0"
                type="text"
                placeholder="https://https://opencsg.com"
                name="web"
            />
          </div>
          </div>

          <div class="flex gap-x-[80px]">
          <div class="w-[320px] mt-[8px]">
            <div class="flex items-center gap-[4px]">
              <label for="sector">公司行业</label>
              <svg xmlns="http://www.w3.org/2000/svg" width="6" height="6" viewBox="0 0 6 6" fill="none">
                <path
                    d="M2.21714 5.2179L3.35474 3.8499L4.49234 5.2179L5.12594 4.7571L4.20434 3.2595L5.77394 2.6115L5.52914 1.8771L3.88754 2.2659L3.74354 0.537903H2.96594L2.82194 2.2803L1.18034 1.8771L0.921143 2.6115L2.49074 3.2595L1.58354 4.7571L2.21714 5.2179Z"
                    fill="#F56C6C"/>
              </svg>
            </div>
            <el-select v-model="filterValue" @change="changeValue" placeholder="请选择一个选项" size="large" class="w-full mt-[10px]">
              <el-option
                  v-for="item in filterValues"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  :disabled="item.disabled"
              />
            </el-select>
          </div>

          <div class="w-[320px] mt-[8px]">
            <div class="flex items-center gap-[4px]">
              <label for="scale">公司规模</label>
              <svg xmlns="http://www.w3.org/2000/svg" width="6" height="6" viewBox="0 0 6 6" fill="none">
                <path
                    d="M2.21714 5.2179L3.35474 3.8499L4.49234 5.2179L5.12594 4.7571L4.20434 3.2595L5.77394 2.6115L5.52914 1.8771L3.88754 2.2659L3.74354 0.537903H2.96594L2.82194 2.2803L1.18034 1.8771L0.921143 2.6115L2.49074 3.2595L1.58354 4.7571L2.21714 5.2179Z"
                    fill="#F56C6C"/>
              </svg>
            </div>
            <el-select v-model="filterValue" @change="changeValue" placeholder="请选择一个选项" size="large" class="w-full mt-[10px] h-full">
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
        <!--地址-->
        <div class="w-full h-auto">

          <div class="w-full">
            <div class="flex items-center gap-[4px]">
              <label for="address">地址</label>
              <svg xmlns="http://www.w3.org/2000/svg" width="6" height="6" viewBox="0 0 6 6" fill="none">
                <path
                    d="M2.21714 5.2179L3.35474 3.8499L4.49234 5.2179L5.12594 4.7571L4.20434 3.2595L5.77394 2.6115L5.52914 1.8771L3.88754 2.2659L3.74354 0.537903H2.96594L2.82194 2.2803L1.18034 1.8771L0.921143 2.6115L2.49074 3.2595L1.58354 4.7571L2.21714 5.2179Z"
                    fill="#F56C6C"/>
              </svg>
            </div>
            <input
                class="formInput w-full text-[#606266] rounded-[4px] border-solid border border-[#DCDFE6] leading-[40px] px-[15px] my-[10px] outline-0"
                type="text"
                placeholder="地址行 1"
                name="address"
            />
          </div>

          <div class="flex gap-x-[80px]">
            <div class="w-[320px] mt-[8px]">
              <div class="flex items-center gap-[4px]">
                <label for="city">城市</label>
                <svg xmlns="http://www.w3.org/2000/svg" width="6" height="6" viewBox="0 0 6 6" fill="none">
                  <path
                      d="M2.21714 5.2179L3.35474 3.8499L4.49234 5.2179L5.12594 4.7571L4.20434 3.2595L5.77394 2.6115L5.52914 1.8771L3.88754 2.2659L3.74354 0.537903H2.96594L2.82194 2.2803L1.18034 1.8771L0.921143 2.6115L2.49074 3.2595L1.58354 4.7571L2.21714 5.2179Z"
                      fill="#F56C6C"/>
                </svg>
              </div>
              <input
                  class="formInput w-full bg-white text-[#606266] rounded-[4px] border-solid border border-[#DCDFE6] leading-[40px] px-[15px] my-[10px]  outline-0"
                  type="text"
                  placeholder="上海"
                  name="city"
              />
            </div>

            <div class="w-[320px] mt-[8px]">
              <div class="flex items-center gap-[4px]">
                <label for="post">邮政/邮政编码</label>
                <svg xmlns="http://www.w3.org/2000/svg" width="6" height="6" viewBox="0 0 6 6" fill="none">
                  <path
                      d="M2.21714 5.2179L3.35474 3.8499L4.49234 5.2179L5.12594 4.7571L4.20434 3.2595L5.77394 2.6115L5.52914 1.8771L3.88754 2.2659L3.74354 0.537903H2.96594L2.82194 2.2803L1.18034 1.8771L0.921143 2.6115L2.49074 3.2595L1.58354 4.7571L2.21714 5.2179Z"
                      fill="#F56C6C"/>
                </svg>
              </div>
              <input
                  class="formInput w-full bg-white text-[#606266] rounded-[4px] border-solid border border-[#DCDFE6] leading-[40px] px-[15px] my-[10px] outline-0"
                  type="number"
                  placeholder="200001"
                  name="post"
              />
            </div>
          </div>

          <div class="w-full">
            <div class="flex items-center gap-[4px] w-full">
              <label for="country">国家/地区</label>
              <svg xmlns="http://www.w3.org/2000/svg" width="6" height="6" viewBox="0 0 6 6" fill="none">
                <path
                    d="M2.21714 5.2179L3.35474 3.8499L4.49234 5.2179L5.12594 4.7571L4.20434 3.2595L5.77394 2.6115L5.52914 1.8771L3.88754 2.2659L3.74354 0.537903H2.96594L2.82194 2.2803L1.18034 1.8771L0.921143 2.6115L2.49074 3.2595L1.58354 4.7571L2.21714 5.2179Z"
                    fill="#F56C6C"/>
              </svg>
            </div>
            <el-select v-model="country" @change="changeValue" placeholder="请选择一个选项" size="large" class="w-full mt-[10px] h-full text-[#606266]">
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
                      class="w-full bg-white h-[40px] text-[#606266] rounded-[4px] border leading-normal border-solid border-[#DCDFE6] py-[5px] px-[15px] outline-0"
                      placeholder="请提供您的合作意向及需求"
                      maxlength="100"
            ></textarea>
          </div>


        </div>
        <!--file-->
        <div class="w-full h-auto">

          <div class="w-full">
            <label for="phone">文件补充</label>
            <input ref="fileInputRef" type="file" class="hidden" @change="previewImage"/>
            <div @click="uploadFile"
                 class="flex items-center justify-center mt-[8px] w-[440px] h-[160px] px-[8px] border rounded border-dashed border-[#DCDFE6] bg-[#FAFAFA]">
              <div class="flex items-center justify-center flex-col">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                      d="M3.2 18C1.88484 17.235 1 15.8051 1 14.1674C1 12.1053 2.40285 10.3727 4.30122 9.88197C4.30041 9.83571 4.3 9.78935 4.3 9.7429C4.3 5.46661 7.74741 2 12 2C15.6211 2 18.6584 4.51348 19.4806 7.90009C21.5395 8.69955 23 10.7089 23 13.0613C23 14.8707 22.1359 16.4772 20.8 17.4862M12 22V13M12 13L8.5 16.5M12 13L15.5 16.5"
                      stroke="#2F384C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <p class="mt-[8px] text-[#606266]">将文件拖拽到此处，或<a href="upload" class="text-[#409EFF]">点击上传</a></p>
                <p class="text-[12px] text-[#A8ABB2]">pdf./doc. files with a size less than 500kb</p>
              </div>
            </div>
          </div>

        </div>

        <div class="flex gap-x-[16px]">
          <input class="flex w-[88px] text-white bg-[#409EFF] rounded-[4px] leading-[40px] cursor-pointer" type="submit"
                 :value="'提交表单'"/>
          <div
              class="flex justify-center items-center inline-block w-[70px] text-[#606266] bg-white border border-solid border-[#DCDFE6] rounded-[4px] leading-[40px] cursor-pointer"
              @click="dialogVisible = false">保存
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
<!--<script lang="ts" setup>-->
<!--import { ref, defineProps, defineEmits } from 'vue';-->

<!--const fileInput = ref(null)-->

<!--let filterValue = ""-->
<!--const filterValues = [-->
<!--  {-->
<!--    value: 'all',-->
<!--    label: '全部应用'-->
<!--  },-->
<!--  {-->
<!--    value: 'mine',-->
<!--    label: '我的应用'-->
<!--  }-->
<!--]-->

<!--const changeValue = (selectedValue) => {-->
<!--  console.log('选中的值为:', selectedValue)-->
<!--  filterValue = selectedValue-->
<!--  console.log(filterValue)-->
<!--}-->

<!--const uploadFile = () => {-->
<!--  console.log("test")-->
<!--  fileInput.value.click()-->
<!--}-->
<!--</script>-->

<script>
  export default {
    props: {},
    components: {},
    data() {
      return {
        fileInput: null,
        filterValue: '',
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
        country: '中国',
        countryList: [
          {
            value: 'option1',
            label: '美国'
          },
          {
            value: 'option2',
            label: '中国'
          }
        ]
      }
    },
    mounted() {
      // 获取文件输入元素，假设文件输入元素的 ref 为 'fileInputRef'
      // 用于访问组件模板中具有ref属性的DOM元素或子组件的对象
      this.fileInput = this.$refs.fileInputRef
    },
    methods: {
      changeValue(selectedValue) {
        console.log('选中的值为:', selectedValue)
        this.filterValue = selectedValue
        console.log(this.filterValue)
      },

      uploadFile() {
        console.log("uploadFile")
        this.fileInput.click()
      },
    }
  }
</script>