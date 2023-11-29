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
      <ssh-key-card v-for="sshkey in JSON.parse(TheSshKeys)"
                    :ssh-key-name="sshkey.name"
                    :ssh-key="sshkey.ssh_key">
      </ssh-key-card>
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
import SshKeyCard from "./SshKeyCard.vue";
export default {
  props: {
    name: String,
    displayName: String,
    avatar: String,
    sshKeys: String
  },
  components: {
    Menu,
    SshKeyCard
  },
  data() {
    return {
      centerDialogVisible: false,
      profileName: this.name,
      profileDisplayName: this.displayName,
      profileAvatar: this.avatar,
      TheSshKeys: this.sshKeys
    };
  },
  mounted() {
    console.log(this.sshKeys)
  },
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
