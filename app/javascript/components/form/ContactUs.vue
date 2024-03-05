<template>
  <div>
    <el-dialog
      :title="this.$t('form.contactUs.contact')"
      v-model="dialogVisible"
      width="80%"
      :show-close="false"
      class="max-w-[438px] w-[80%]"
    >
      <form ref="forms" @submit.prevent="sendEmail">
        <input
          class="formInput w-full bg-white text-[#606266] rounded-[4px] border-solid border border-[#DCDFE6] leading-[40px] px-[15px] my-[10px]  outline-0"
          type="text"
          :placeholder="this.$t('form.contactUs.name')"
          name="user_name"
        />
        <input
          class="formInput w-full bg-white text-[#606266] rounded-[4px] border-solid border border-[#DCDFE6] leading-[40px] px-[15px] my-[10px]  outline-0"
          type="text"
          :placeholder="this.$t('form.contactUs.company')"
          name="user_company"
        />
        <input
          class="formInput w-full bg-white text-[#606266] rounded-[4px] border-solid border border-[#DCDFE6] leading-[40px] px-[15px] my-[10px]  outline-0"
          type="email"
          :placeholder="this.$t('form.contactUs.email')"
          name="user_email"
        />
        <input
          class="formInput w-full bg-white text-[#606266] rounded-[4px] border-solid border border-[#DCDFE6] leading-[40px] px-[15px] my-[10px]  outline-0"
          type="tel"
          :placeholder="this.$t('form.contactUs.phone')"
          name="user_tel"
        />
        <input
          class="formInput w-full bg-white text-[#606266] rounded-[4px] border-solid border border-[#DCDFE6] leading-[40px] px-[15px] my-[10px]  outline-0"
          type="text"
          :placeholder="this.$t('form.contactUs.job')"
          name="user_job"
        />
        <textarea name="message" class="w-full bg-white text-[#606266] rounded-[4px] border leading-normal border-solid border-[#DCDFE6] py-[5px] px-[15px] outline-0" :placeholder="this.$t('form.contactUs.help')"></textarea>
        <div class="text-center">
          <input class="w-[70px] text-white bg-[#409EFF] rounded-[4px] leading-[40px] mr-20 cursor-pointer" type="submit" :value="this.$t('form.contactUs.submit')" />
          <div class="inline-block w-[70px] text-[#606266] bg-white border border-solid border-[#DCDFE6] rounded-[4px] leading-[40px] cursor-pointer" @click="dialogVisible = false">{{$t('form.contactUs.close')}}</div>
        </div>
      </form>
    </el-dialog>
  </div>
</template>
<script setup>
import emailjs from "emailjs-com";
import { nextTick, ref, inject, onMounted } from "vue";
import { ElMessage } from "element-plus";

const dialogVisible = ref(false);
const forms = ref()
const showDialog = () =>{
  dialogVisible.value = true;
}
const closeDialog = () => {
  dialogVisible.value = false;
};
const sendEmail = () => {
  let inputBtn = document.getElementsByClassName("formInput");
  if (inputBtn[0].value == "") {
    ElMessage({ message: "请您填写姓名", type: "warning" });
    return;
  } else if (inputBtn[1].value == "") {
    ElMessage({ message: "请您填写公司", type: "warning" });
    return;
  } else if (inputBtn[2].value == "") {
    ElMessage({ message: "请您邮箱", type: "warning" });
    return;
  } else if (inputBtn[3].value == "") {
    ElMessage({ message: "请您填写手机号", type: "warning" });
    return;
  } else if (inputBtn[4].value == "") {
    ElMessage({ message: "请您填写职位", type: "warning" });
    return;
  }
  closeDialog();
  emailjs.sendForm(
      "service_j9efpor",
      "template_latqkpb",
      forms.value,
      "mqDiUGzzur1Rhn2Sd"
    )
    .then(
      (result) => {
        ElMessage({ message: "表单发送成功", type: "success" });

        console.log("SUCCESS!", result.text);
      },
      (error) => {
        ElMessage({ message: "表单发送失败", type: "warning" });
        console.log("FAILED...", error.text);
      }
    );
};

defineExpose({
    showDialog,
})
</script>
