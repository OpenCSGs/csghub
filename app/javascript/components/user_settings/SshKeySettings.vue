<template>
  <div class="flex justify-center md:flex-col px-[24px] py-[36px] my-[24px] rounded-[8px] md:px-[50px] sm:px-[20px] max-w-[1280px] m-auto bg-white">
    <Menu class="max-w-[411px] md:mb-[24px]"
          :name="profileName"
          :displayName="profileDisplayName"
          :avatar="profileAvatar">
    </Menu>
    <div class="grow py-[24px]">
      <h3 class="text-[#303133] text-[20px] font-[600]">SSH Keys</h3>
      <button @click="centerDialogVisible = true" class="rounded-[4px] border bg-[#FFF] py-[5px] px-[16px] text-[#606266] text-[14px] font-[500] mt-[32px]">
        添加 SSH Key
      </button>
      <div class="mt-[16px] rounded-sm w-full bg-[#F0F3FF] py-[9px] px-[16px] text-[#4D6AD6]">现在还没有添加SSH key到您的账户</div>

      <div class="mt-[16px] rounded-lg bg-[#F5F7FA] p-[12px] w-[480px] md:w-full">
        <div class="flex items-center pb-[16px] pt-[2px] border-b-2 md:block relative">
          <p class="font-medium">SSH Key Name</p>
          <p class="text-[#606266] text-sm pl-[8px] md:pl-0 md:mt-[4px]">Added less than a minute ago</p>
          <div @click="deleteDialogVisible = true" class="flex items-center justify-center absolute top-0 right-0 w-[46px] h-[32px] bg-white rounded border-2 text-right">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.33366 2.91699L2.73981 9.82157C2.80217 10.8818 2.83336 11.4119 3.05963 11.8141C3.25882 12.1683 3.56115 12.4533 3.92637 12.6314C4.34125 12.8337 4.87226 12.8337 5.93429 12.8337H8.06636C9.12839 12.8337 9.6594 12.8337 10.0743 12.6314C10.4395 12.4533 10.7418 12.1683 10.941 11.8141C11.1673 11.4119 11.1985 10.8818 11.2608 9.82157L11.667 2.91699M2.33366 2.91699H1.16699M2.33366 2.91699H11.667M11.667 2.91699H12.8337M9.33366 2.91699L9.30372 2.82719C9.21047 2.54744 9.16385 2.40756 9.10498 2.28735C8.8112 1.68746 8.23732 1.27383 7.57531 1.18483C7.44265 1.16699 7.29521 1.16699 7.00033 1.16699V1.16699C6.70544 1.16699 6.558 1.16699 6.42535 1.18483C5.76333 1.27383 5.18946 1.68746 4.89567 2.28735C4.8368 2.40756 4.79018 2.54744 4.69693 2.82719L4.66699 2.91699M5.83366 5.83366V9.91699M8.16699 5.83366V8.16699" stroke="#606266" stroke-width="0.857143" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
        <div class="pt-[16px]"><p class="text-[#606266] text-sm">OC_GAOcGvlFUrobfkxpsdmNhGhkuPoOpHJjMM</p></div>
      </div>

      <el-dialog v-model="deleteDialogVisible" title="删除 Key “key name”" width="30%" class="dialogWidth" style="border-radius: 0.5rem;" left>
        <div class="flex items-center justify-center h-[108px]">
          <p>你确定要从你的帐户中删除此密钥吗？此操作无法撤消。</p>
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="deleteDialogVisible = false">Cancel</el-button>
            <el-button type="primary" @click="deleteDialogVisible = false">
              确认
            </el-button>
          </span>
        </template>
      </el-dialog>

      <el-dialog v-model="centerDialogVisible" title="添加 SSH Key" width="30%" class="dialogWidth" style="border-radius: 0.5rem;" left>
        <div class="mb-[16px]">
          <p class="text-[#303133] text-[14px] mb-[8px]"> SSH Key 名称 <span class="text-red-400">*</span> </p>
          <el-input v-model="input" placeholder="Key"/>
        </div>
        <div>
          <p class="text-[#303133] text-[14px] mb-[8px]"> SSH Key 内容 <span class="text-red-400">*</span> </p>
          <el-input
            v-model="textarea"
            :rows="6"
            type="textarea"
            placeholder="Starts with 'ssh-rsa', 'ecdsa-sha2-nistp256', 'ecdsa-sha2-nistp384', 'ecdsa-sha2-nistp521', 'ssh-ed25519', 'sk-ecdsa-sha2-nistp256@openssh.com', or 'sk-ssh-ed25519@openssh.com'"
          />
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="centerDialogVisible = false">Cancel</el-button>
            <el-button type="primary" @click="centerDialogVisible = false">
              添加
            </el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import Menu from "./Menu.vue";
export default {
  props: {
    name: String,
    displayName: String,
    avatar: String
  },
  components: {
    Menu
  },
  data() {
    return {
      centerDialogVisible: false,
      deleteDialogVisible: false,
      profileName: this.name,
      profileDisplayName: this.displayName,
      profileAvatar: this.avatar,
    };
  },
  mounted() {},
  methods: {},
};
</script>
<style>
/* 默认宽度 */
.dialogWidth {
  width: 30%;
}

/* 在小屏幕上宽度变为50% */
@media (max-width: 640px) {
  .dialogWidth {
    width: 80%;
  }
}

/* 在中等屏幕上宽度变为40% */
@media (min-width: 641px) and (max-width: 1024px) {
  .dialogWidth {
    width: 50%;
  }
}

/* 在大屏幕上宽度保持为30% */
@media (min-width: 1025px) {
  .dialogWidth {
    width: 30%;
  }
}
</style>
