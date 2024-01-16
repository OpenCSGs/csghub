<template>
    <div>
      <div class="w-[294px] border rounded-[8px] bg-[#FAFAFA] border-[#DCDFE6] mx-[24px]">
        <div class="flex p-[16px] border-b border-[#DCDFE6]" @click="goProfile">
          <el-avatar :size="60" :src="avatar"> </el-avatar>
          <div class="ml-[10px]">
            <div class="text-[24px] leading-[32px] font-semibold">
              <a>
                {{displayName}}
              </a>
            </div>
            <div class="text-[16px] text-[#909399] leading-[24px]">@{{name}}</div>
          </div>
        </div>
        <div class="flex flex-col">
          <a href="/settings/profile" class="p-[16px] hover:bg-[#EBEDF0] border-b border-[#DCDFE6] text-[18px] text-[#606266] leading-[26px] cursor-pointer"
               :class="menuClass('/settings/profile')"
          >
              个人资料
          </a>
          <div class="p-[16px] hover:bg-[#EBEDF0] border-b border-[#DCDFE6] text-[18px] text-[#606266] leading-[26px] opacity-40"
               :class="menuClass('/settings/account')"
          >
            账户信息
          </div>
          <div class="p-[16px] hover:bg-[#EBEDF0] border-b border-[#DCDFE6] text-[18px] text-[#606266] leading-[26px] opacity-40"
               :class="menuClass('/settings/accessTokens')"
          >
            Access Token
          </div>
          <a href="/settings/git-token" class="p-[16px] hover:bg-[#EBEDF0] border-b border-[#DCDFE6] text-[18px] text-[#606266] leading-[26px] cursor-pointer"
               :class="menuClass('/settings/git-token')"
          >
              Git Token
          </a>
          <a href="/settings/ssh-keys" class="p-[16px] hover:bg-[#EBEDF0] border-b border-[#DCDFE6] text-[18px] text-[#606266] leading-[26px] cursor-pointer"
               :class="menuClass('/settings/ssh-keys')"
          >
              SSH Keys
          </a>
          <div class="p-[16px] hover:bg-[#EBEDF0] text-[18px] text-[#606266] leading-[26px] opacity-40"
               :class="menuClass('/settings/billing')"
          >
            账单
          </div>
        </div>
      </div>
    </div>
</template>
<script>
import {h} from 'vue'
import {ElMessage, ElMessageBox} from 'element-plus'
export default {
  props: {
    name: String,
    displayName: String,
    avatar: String,
  },
  data() {
    return {
      isChange:false,
    };
  },
  mounted() {},
  methods: {
    isInputChange(isChange) {
      // 处理来自 ProfileEdit 组件传递过来的数据
      this.isChange = isChange // 根据需要修改 isChange 的值
    },
    goProfile(){
      if(this.isChange){
        ElMessageBox({
        title: '是否确认返回',
        message: h('p', null, [
          h('span', null, '返回后修改将不会被保存，是否确认返回？')
        ]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then((action) => {
        window.location.href  = `/profile/${this.displayName}`
      }).catch(() => {
        console.log('cancel');
      })
      }else{
      window.location.href  = `/profile/${this.displayName}`
      }
    },
    menuClass(menuPath) {
      if (menuPath === window.location.pathname) {
        return 'text-[#303133] font-semibold'
      } else {
        return ''
      }
    }
  }
};
</script>
