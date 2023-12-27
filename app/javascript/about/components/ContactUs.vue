<template>
  <div>
    <el-dialog :title="$t('ContactUs')" :visible="dialogFormVisible" width="80%" :show-close="false" center>
      <div class="center">
        <template>
          <form ref="forms" @submit.prevent="sendEmail">
            <input class="formInput" type="text" :placeholder="language === 'zh'?'名字':'name'" name="user_name">
            <input class="formInput" type="text" :placeholder="language === 'zh'?'公司 请务必填写工商信息名称!':'company'" name="user_company">
            <input class="formInput" type="email" :placeholder="language === 'zh'?'邮箱':'email'" name="user_email">
            <input class="formInput" type="tel" :placeholder="language === 'zh'?'手机':'phone'" name="user_tel">
            <input class="formInput" type="text" :placeholder="language === 'zh'?'职位':'job'" name="user_job">
            <textarea name="message" :placeholder="language === 'zh'?'你在寻找什么帮助':'What kind of help are you looking for?'"></textarea>
            <div class="buttonBox">
              <input class="button" type="submit" :value="language=='zh'?'提交':'submit'">
              <div class="closeButton" @click="closeForm()">{{$t('close')}}</div>
            </div>

          </form>
        </template>
      </div>

    </el-dialog>
  </div>
</template>

<script>
import emailjs from 'emailjs-com';
export default {
  name: "ContactUs",
  props: ["dialogFormVisible"],
  computed: {
  		language() {
  			return this.$i18n.locale
  		}
  	},
  data() {
    return {
      //   dialogFormVisible: false,
    };
  },
  methods: {
    sendEmail() {
      let inputBtn = document.getElementsByClassName('formInput');
      console.log(inputBtn);
      if (inputBtn[0].value == "") {
        this.$message({ message: '请您填写姓名', type: 'warning' });
        return
      } else if (inputBtn[1].value == "") {
        this.$message({ message: '请您填写公司', type: 'warning' });
        return

      } else if (inputBtn[2].value == "") {
        this.$message({ message: '请您邮箱', type: 'warning' });
        return

      } else if (inputBtn[3].value == "") {
        this.$message({ message: '请您填写手机号', type: 'warning' });
        return

      }else if (inputBtn[4].value == "") {
        this.$message({ message: '请您填写职位', type: 'warning' });
        return

      }
      this.$emit("closeDialog");
      emailjs.sendForm('service_j9efpor', 'template_latqkpb', this.$refs.forms, 'mqDiUGzzur1Rhn2Sd')
        .then((result) => {
          this.$message({ message: '表单发送成功', type: 'success' });

          console.log('SUCCESS!', result.text);
        }, (error) => {
          this.$message.error('表单发送失败');
          console.log('FAILED...', error.text);
        });
    },
    closeForm(e) {
      this.$emit("closeDialog");
    },
  },
};
</script>

<style lang="scss" scoped>
input {
  background-color: #FFF;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #DCDFE6;
  box-sizing: border-box;
  color: #606266;
  display: inline-block;
  height: 40px;
  line-height: 40px;
  outline: 0;
  padding: 0 15px;
  width: 100%;
  margin: 10px 0;
}

.button {
  color: #FFF;
  background-color: #409EFF;
  border-color: #409EFF;
  width: 70px;
  margin-right: 20px;
  cursor: pointer;
}

.buttonBox {
  text-align: center;
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

textarea {
  display: block;
  resize: vertical;
  padding: 5px 15px;
  line-height: 1.5;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 100%;
  font-size: inherit;
  color: #606266;
  background-color: #FFF;
  background-image: none;
  border: 1px solid #DCDFE6;
  border-radius: 4px;

}
</style>