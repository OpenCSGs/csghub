<template>
  <div class="flex justify-center md:flex-col py-[36px] my-[24px] rounded-[8px] md:px-[50px] sm:px-[20px] max-w-[1280px] m-auto bg-white">
    <Menu class="max-w-[411px] md:mb-[24px]"
          :name="profileName"
          :avatar="profileAvatar">
    </Menu>
    <ProfileEdit class="grow py-[24px]"
                 :name="name"
                 :avatar="avatar"
                 :phone="phone"
                 :email="email"
                 :userName="userName"
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
    phone: String,
    avatar: String,
    email: String,
    userName: String,
  },
  components: {
    Menu,
    ProfileEdit,
  },
  data() {
    return {
      profileName: this.name,
      profileAvatar: this.avatar,
    };
  },
  mounted() {},
  methods: {
    updateUserInfo(data) {
      const { name, avatar } = data;
      this.profileName = name || this.name;
      this.profileAvatar = avatar || this.avatar;
    },
  },
};
</script>
