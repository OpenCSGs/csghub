<template>
  <div class="flex justify-center md:flex-col py-[36px] my-[24px] rounded-[8px] md:px-[50px] sm:px-[20px] max-w-[1280px] m-auto bg-white">
    <Menu class="max-w-[411px] md:mb-[24px]"
          :name="profileName"
          :displayName="profileDisplayName"
          :avatar="profileAvatar">
    </Menu>
    <div class="grow py-[24px]">
      <div>
        <h3>用户 Git Token</h3>
        <p> Git Token 用于授权您执行 Git 相关操作 </p>
      </div>
      <div>
        <h3>git token</h3>
        <el-input
          v-model="input"
          type="password"
          placeholder="Please input password"
          show-password
        />
      </div>
    </div>
  </div>
</template>
<script>
import Menu from "./Menu.vue";
import ProfileEdit from "./ProfileEdit.vue";
export default {
  props: {
    name: String,
    nickname: String,
    phone: String,
    avatar: String,
    email: String,
    displayName: String,
  },
  components: {
    Menu,
    ProfileEdit,
  },
  data() {
    return {
      profileName: this.name,
      profileDisplayName: this.displayName,
      profileAvatar: this.avatar,
    };
  },
  mounted() {},
  methods: {
    updateUserInfo(data) {
      const { nickname, name, avatar } = data;
      this.profileName = name || this.name;
      this.profileDisplayName = nickname || this.displayName;
      this.profileAvatar = avatar || this.avatar;
    },
  },
};
</script>
