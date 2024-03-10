<template>
  <div class="flex justify-center items-center mt-[50px] lg:mt-[60px] md:mt-[60px] sm:mt-[36px]">
    <div
      class="flex flex-col bg-white w-[766px] lg:w-[566px] md:w-[90%] h-auto border rounded-lg p-[36px] gap-y-[24px] border-[#DCDFE6] bg-gradient-to-r shadow-xl"
    >
      <div class="text-[#303133] text-sm gap-y-[48px]">
        <div class="w-full h-auto">
          <div class="hidden md:block text-sm text-[#606266] mb-[24px]">
            <p class="mt-[16px]">{{ $t('form.partner.p1') }}</p>
            <p class="mt-[16px]">{{ $t('form.partner.p2') }}</p>
          </div>
          <div class="flex md:flex-col md:gap-y-[20px] gap-x-[80px]">
            <div class="w-[320px] lg:w-full">
              <form-label :labelName="$t('form.partner.name')" :required="true" />
              <el-input
                v-model="userName"
                clearable
                :placeholder="$t('form.partner.name-')"
                class="w-full h-[40px] text-[#606266]"
              />
            </div>

            <div class="w-[320px] lg:w-full md:flex-col">
              <form-label :labelName="$t('form.partner.phone')" :required="true" />
              <el-input
                v-model="phone"
                clearable
                :placeholder="$t('form.partner.phone')"
                class="w-full h-[40px] text-[#606266]"
              />
            </div>
          </div>

          <div class="w-[306px] mt-[24px] lg:w-full md:flex-col">
            <form-label :labelName="$t('form.partner.email')" :required="true" />
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
              <form-label :labelName="$t('form.partner.company')" :required="true" />
              <el-input
                v-model="companyName"
                clearable
                :placeholder="$t('form.partner.company-')"
                class="w-full h-[40px] text-[#606266]"
              />
            </div>

            <div class="w-[320px] lg:w-full md:flex-col">
              <form-label :labelName="$t('form.partner.expertise')" :required="true" />
              <el-input
                v-model="profession"
                clearable
                :placeholder="$t('form.partner.expertise-')"
                class="w-full h-[40px] text-[#606266]"
              />
            </div>
          </div>

          <div class="flex flex md:flex-col md:gap-y-[20px] gap-x-[80px] gap-x-[80px]">
            <div class="w-[320px] mt-[24px] lg:w-full md:flex-col">
              <form-label :labelName="$t('form.partner.web')" :required="true" />
              <el-input
                v-model="companyWeb"
                clearable
                :placeholder="$t('form.partner.web-')"
                class="w-full h-[40px] text-[#606266]"
              />
            </div>
            <div class="w-[320px] mt-[24px] md:mt-0 lg:w-full md:flex-col">
              <form-label :labelName="$t('form.partner.industry')" :required="true" />
              <el-input
                  v-model="industry"
                  clearable
                  :placeholder="$t('form.partner.industry-')"
                  class="w-full h-[40px] text-[#606266]"
              />
            </div>
          </div>
        </div>

        <div class="w-full h-auto mt-[24px]">
          <div class="w-full">
            <form-label :labelName="$t('form.partner.desc')" :required="true" />
            <el-input
              v-model="desc"
              clearable
              :placeholder="$t('form.partner.desc-')"
              type="textarea"
              class="w-full h-auto text-[#606266]"
            />
          </div>
        </div>
      </div>

      <div class="flex gap-x-[16px]">
        <el-button type="primary" @click="submitTheForm">{{ $t('form.partner.submit') }}</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { ElMessage } from "element-plus";
import { useCookies } from "vue3-cookies";

import FormLabel from "./sub/FormLabel.vue";
import csrfFetch from "../../packs/csrfFetch.js"

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
        ElMessage({ message: this.$t('form.partner.nameWarn'), type: "warning" });
        return;
      } else if (this.phone == null) {
        ElMessage({ message: this.$t('form.partner.phoneWarn'), type: "warning" });
        return;
      } else if (this.email == null) {
        ElMessage({ message: this.$t('form.partner.emailWarn'), type: "warning" });
        return;
      } else if (this.companyName == null) {
        ElMessage({ message: this.$t('form.partner.companyWarn'), type: "warning" });
        return;
      } else if (this.profession == null) {
        ElMessage({ message: this.$t('form.partner.expertiseWarn'), type: "warning" });
        return;
      } else if (this.companyWeb == null) {
        ElMessage({ message: this.$t('form.partner.webWarn'), type: "warning" });
        return;
      } else if (this.industry == null) {
        ElMessage({ message: this.$t('form.partner.industryWarn'), type: "warning" });
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
      const expertCreateEndpoint = "/internal_api/leads";

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
        headers: { 'Content-Type': 'application/json' },
        body: jsonStr,
      };
      const response = await csrfFetch(expertCreateEndpoint, option);

      if (!response.ok) {
        return response.json().then((data) => {
          console.log(data);
          throw new Error(data.message);
        });
      } else {
        ElMessage({ message: this.$t('form.expert.success'), type: "success" });

        setTimeout(() => {
          window.location.href = "/partners";
        }, 1500);
        return response.json();
      }
    },
  },
};
</script>
