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
          class="formInput"
          type="text"
          placeholder="名字"
          name="user_name"
        />
        <input
          class="formInput"
          type="text"
          placeholder="公司 请务必填写工商信息名称!"
          name="user_company"
        />
        <input
          class="formInput"
          type="email"
          placeholder="邮箱'"
          name="user_email"
        />
        <input
          class="formInput"
          type="tel"
          placeholder="手机"
          name="user_tel"
        />
        <input
          class="formInput"
          type="text"
          placeholder="职位"
          name="user_job"
        />
        <textarea name="message" placeholder="你在寻找什么帮助"></textarea>
        <div class="text-center">
          <input class="button" type="submit" :value="'提交'" />
          <div class="closeButton" @click="dialogVisible = false">关闭</div>
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
<style scoped>
input {
  background-color: #FFF;
  border-radius: 4px;
  border: 1px solid #DCDFE6;
  color: #606266;
  height: 40px;
  line-height: 40px;
  outline: 0;
  padding: 0 15px;
  width: 100%;
  margin: 10px 0;
}

textarea {
  display: block;
  resize: vertical;
  padding: 5px 15px;
  line-height: 1.5;
  width: 100%;
  font-size: inherit;
  color: #606266;
  background-color: #FFF;
  border: 1px solid #DCDFE6;
  border-radius: 4px;
  outline: 0;
}
.button {
  color: #FFF;
  background-color: #409EFF;
  border-color: #409EFF;
  width: 70px;
  margin-right: 20px;
  cursor: pointer;
}
.closeButton {
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  background: #FFF;
  border: 1px solid #DCDFE6;
  color: #606266;
  text-align: center;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  outline: 0;
  margin: 0;
  -webkit-transition: .1s;
  transition: .1s;
  font-weight: 500;
  padding: 12px 20px;
  font-size: 14px;
  border-radius: 4px;
}

</style>
