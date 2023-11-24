<template>
  <div class="flex justify-center md:flex-col py-[36px] my-[24px] rounded-[8px] md:px-[50px] sm:px-[20px] max-w-[1280px] m-auto bg-white">
    <Menu class="max-w-[411px] md:mb-[24px]"
          :name="name"
          :displayName="profileName"
          :avatar="profileAvatar">
    </Menu>
    <ProfileEdit class="grow py-[24px]"
                 :name="name"
                 :nickname="nickname"
                 :avatar="avatar"
                 :phone="phone"
                 :email="email"
                 :displayName="displayName"
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
      profileName: this.displayName,
      profileAvatar: this.avatar,
    };
  },
  mounted() {},
  methods: {
    updateUserInfo(data) {
      const { nickname, avatar } = data;
      this.profileName = nickname || this.displayName;
      this.profileAvatar = avatar || this.avatar;
    },
  },
};
</script>
