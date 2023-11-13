<template>
  <div class="flex justify-center items-center mt-[50px] lg:mt-[60px] md:px-[24px] md:mt-[60px] sm:mt-[36px]">
    <div
      class="flex flex-col bg-white w-[766px] lg:w-[566px] h-auto border rounded-lg p-[36px] gap-y-[24px] border-[#DCDFE6] bg-gradient-to-r shadow-xl"
    >
      <div class="text-[#303133] text-sm gap-y-[48px]">
        <div class="w-full h-auto">
          <div class="hidden md:block text-sm text-[#606266] mb-[24px]">
            <p class="mt-[16px]">如您有意加入OpenCSG开放传神社区并成为我们的合作伙伴，请填写下方信息</p>
            <p class="mt-[16px]">我们会尽快与您联系并详细沟通，感谢您对OpenCSG的支持。</p>
          </div>
          <div class="flex md:flex-col md:gap-y-[20px] gap-x-[80px]">
            <div class="w-[320px] lg:w-full">
              <form-label labelName="姓名" :required="true" />
              <el-input
                v-model="userName"
                clearable
                placeholder="你的名字"
                class="w-full h-[40px] text-[#606266]"
              />
            </div>

            <div class="w-[320px] lg:w-full md:flex-col">
              <form-label labelName="手机号码" :required="true" />
              <el-input
                v-model="phone"
                clearable
                placeholder="手机号码"
                class="w-full h-[40px] text-[#606266]"
              />
            </div>
          </div>

          <div class="w-[306px] mt-[24px] lg:w-full md:flex-col">
            <form-label labelName="工作电子邮箱地址" :required="true" />
            <el-input
              v-model="email"
              clearable
              placeholder="example@gmail.com"
              class="w-full h-[40px] text-[#606266]"
            />
          </div>
        </div>

        <div class="w-full h-auto mt-[24px]">
          <div class="flex flex md:flex-col md:gap-y-[20px] gap-x-[80px] gap-x-[80px]">
            <div class="w-[320px] lg:w-full md:flex-col">
              <form-label labelName="公司/单位名称" :required="true" />
              <el-input
                v-model="companyName"
                clearable
                placeholder="开放传神"
                class="w-full h-[40px] text-[#606266]"
              />
            </div>

            <div class="w-[320px] lg:w-full md:flex-col">
              <form-label labelName="职称" :required="true" />
              <el-input
                v-model="profession"
                clearable
                placeholder="首席执行官"
                class="w-full h-[40px] text-[#606266]"
              />
            </div>
          </div>

          <div class="flex flex md:flex-col md:gap-y-[20px] gap-x-[80px] gap-x-[80px]">
            <div class="w-[320px] mt-[24px] lg:w-full md:flex-col">
              <form-label labelName="公司/产品官网" :required="true" />
              <el-input
                v-model="companyWeb"
                clearable
                placeholder="例：https://opencsg.com"
                class="w-full h-[40px] text-[#606266]"
              />
            </div>
            <div class="w-[320px] mt-[24px] md:mt-0 lg:w-full md:flex-col">
              <form-label labelName="公司行业" :required="true" />
              <el-input
                  v-model="industry"
                  clearable
                  placeholder="请填写您的行业信息"
                  class="w-full h-[40px] text-[#606266]"
              />
            </div>
          </div>
        </div>

        <div class="w-full h-auto mt-[24px]">
          <div class="w-full">
            <form-label labelName="请简要描述您的合作需求" :required="true" />
            <el-input
              v-model="desc"
              clearable
              placeholder="请提供您的合作意向及需求"
              type="textarea"
              class="w-full h-auto text-[#606266]"
            />
          </div>
        </div>
      </div>

      <div class="flex gap-x-[16px]">
        <el-button type="primary" @click="submitTheForm">提交表单</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { ElMessage } from "element-plus";
import { useCookies } from "vue3-cookies";

import FormLabel from "./sub/FormLabel.vue";

export default {
  props: {},
  components: {
    FormLabel,
  },
  data() {
    return {
      userName: null,
      phone: null,
      email: null,
      companyName: null,
      companyWeb: null,
      industry: null,
      desc: null,
      profession: null,
      filterValue: null,
      filesUpdated: false,
      filterValues: [
        {
          value: "option1",
          label: "选项1",
        },
        {
          value: "option2",
          label: "选项2",
        },
      ],
    };
  },

  mounted() {},

  methods: {
    handleIndustryInputValue(value) {
      this.industry = value;
    },
    submitTheForm() {
      if (this.userName == null) {
        ElMessage({ message: "请您填写姓名", type: "warning" });
        return;
      } else if (this.phone == null) {
        ElMessage({ message: "请您填写电话号码", type: "warning" });
        return;
      } else if (this.email == null) {
        ElMessage({ message: "请您填写邮箱", type: "warning" });
        return;
      } else if (this.companyName == null) {
        ElMessage({ message: "请您填写公司/单位名称", type: "warning" });
        return;
      } else if (this.profession == null) {
        ElMessage({ message: "请您填写职称", type: "warning" });
        return;
      } else if (this.companyWeb == null) {
        ElMessage({ message: "请您填写公司/产品官网", type: "warning" });
        return;
      } else if (this.industry == null) {
        ElMessage({ message: "请您选择公司行业", type: "warning" });
        return;
      }
      this.createPartner().catch((err) => {
        ElMessage({
          message: err.message,
          type: "warning",
        });
      });
    },
    async createPartner() {
      const { cookies } = useCookies();
      const expertCreateEndpoint = "/api/leads";

      const jsonData = {
        name: this.userName,
        phone: this.phone,
        email: this.email,
        company: this.companyName,
        title: this.profession,
        company_site: this.companyWeb,
        industry: this.industry,
        introduction: this.desc,
        lead_source: 'CommunitySite',
        lead_type: 'partners'
      };

      const jsonStr = JSON.stringify(jsonData);

      const option = {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${cookies.get('idToken')}`,
          'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
          'Content-Type': 'application/json',
        },
        body: jsonStr,
      };
      const response = await fetch(expertCreateEndpoint, option);

      if (!response.ok) {
        return response.json().then((data) => {
          console.log(data);
          throw new Error(data.message);
        });
      } else {
        ElMessage({ message: "表单发送成功", type: "success" });

        setTimeout(() => {
          window.location.href = "/partners";
        }, 1500);
        return response.json();
      }
    },
  },
};
</script>
