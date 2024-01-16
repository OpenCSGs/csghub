<template>
  <div class="flex justify-center md:flex-col px-[24px] py-[36px] my-[24px] rounded-[8px] md:px-[50px] sm:px-[20px] max-w-[1280px] m-auto bg-white">
    <Menu class="max-w-[411px] md:mb-[24px]"
          ref="profileMenu"
          :name="profileName"
          :displayName="profileDisplayName"
          :avatar="profileAvatar">
    </Menu>
    <ProfileEdit class="grow py-[24px]"
                 :name="name"
                 :nickname="nickname"
                 :avatar="avatar"
                 :phone="phone"
                 :email="email"
                 :displayName="displayName"
                 @isInputChange="isInputChange"
                 @updateUserInfo="updateUserInfo">
    </ProfileEdit>
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
    isInputChange(isChange){
      this.$refs.profileMenu.isInputChange(isChange)
    },
    updateUserInfo(data) {
      const { nickname, name, avatar } = data;
      this.profileName = name || this.name;
      this.profileDisplayName = nickname || this.displayName;
      this.profileAvatar = avatar || this.avatar;
    },
  },
};
</script>
