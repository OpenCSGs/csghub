<template>
  <div>
    <el-dialog
      title="联系我们"
      v-model="dialogVisible"
      width="80%"
      :show-close="false"
      class="max-w-[438px] w-[80%]"
    >
      <form ref="forms" @submit.prevent="sendEmail">
        <input
          class="formInput w-full bg-white text-[#606266] rounded-[4px] border-solid border border-[#DCDFE6] leading-[40px] px-[15px] my-[10px]  outline-0"
          type="text"
          placeholder="名字"
          name="user_name"
        />
        <input
          class="formInput w-full bg-white text-[#606266] rounded-[4px] border-solid border border-[#DCDFE6] leading-[40px] px-[15px] my-[10px]  outline-0"
          type="text"
          placeholder="公司 请务必填写工商信息名称!"
          name="user_company"
        />
        <input
          class="formInput w-full bg-white text-[#606266] rounded-[4px] border-solid border border-[#DCDFE6] leading-[40px] px-[15px] my-[10px]  outline-0"
          type="email"
          placeholder="邮箱'"
          name="user_email"
        />
        <input
          class="formInput w-full bg-white text-[#606266] rounded-[4px] border-solid border border-[#DCDFE6] leading-[40px] px-[15px] my-[10px]  outline-0"
          type="tel"
          placeholder="手机"
          name="user_tel"
        />
        <input
          class="formInput w-full bg-white text-[#606266] rounded-[4px] border-solid border border-[#DCDFE6] leading-[40px] px-[15px] my-[10px]  outline-0"
          type="text"
          placeholder="职位"
          name="user_job"
        />
        <textarea name="message" class="w-full bg-white text-[#606266] rounded-[4px] border leading-normal border-solid border-[#DCDFE6] py-[5px] px-[15px] outline-0" placeholder="你在寻找什么帮助"></textarea>
        <div class="text-center">
          <input class="w-[70px] text-white bg-[#409EFF] rounded-[4px] leading-[40px] mr-20 cursor-pointer" type="submit" :value="'提交'" />
          <div class="inline-block w-[70px] text-[#606266] bg-white border border-solid border-[#DCDFE6] rounded-[4px] leading-[40px] cursor-pointer" @click="dialogVisible = false">关闭</div>
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
