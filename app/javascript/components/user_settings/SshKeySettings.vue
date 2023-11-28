<template>
  <div class="flex justify-center md:flex-col px-[24px] py-[36px] my-[24px] rounded-[8px] md:px-[50px] sm:px-[20px] max-w-[1280px] m-auto bg-white">
    <Menu class="max-w-[411px] md:mb-[24px]"
          :name="profileName"
          :displayName="profileDisplayName"
          :avatar="profileAvatar">
    </Menu>
    <div class="grow py-[24px]">
      <h3 class="text-[#303133] text-[20px] font-[600]">SSH Keys</h3>
      <button @click="centerDialogVisible = true" class="rounded-[4px] border bg-[#FFF] py-[5px] px-[16px] text-[#606266] text-[14px] font-[500] my-[32px]">
        添加 SSH Key
      </button>

      <el-dialog v-model="centerDialogVisible" title="添加 SSH Key" width="30%" left>
        <div class="mb-[16px]">
          <p class="text-[#303133] text-[14px] mb-[8px]"> SSH Key 名称 <span class="text-red-400">*</span> </p>
          <el-input v-model="input" placeholder="Please input" />
        </div>
        <div>
          <p class="text-[#303133] text-[14px] mb-[8px]"> SSH Key 内容 <span class="text-red-400">*</span> </p>
          <el-input
            v-model="textarea"
            :rows="6"
            type="textarea"
            placeholder="Please input"
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
      profileName: this.name,
      profileDisplayName: this.displayName,
      profileAvatar: this.avatar,
    };
  },
  mounted() {},
  methods: {},
};
</script>
