<template>
  <div class="flex justify-center md:flex-col px-[24px] rounded-[8px] md:px-[50px] sm:px-[20px] max-w-[1280px] m-auto bg-white">
    <Menu class="max-w-[411px] md:mb-[24px]"
          :name="profileName"
          :loginIdentity="loginIdentity"
          :email="email"
          :displayName="profileDisplayName"
          :avatar="profileAvatar"
    ></Menu>
    <ProfileEdit class="grow"
                 :name="name"
                 :nickname="nickname"
                 :avatar="avatar"
                 :phone="phone"
                 :email="email"
                 :homepage="homepage"
                 :bio="bio"
                 :displayName="displayName"
    ></ProfileEdit>
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
    loginIdentity: String,
    homepage: String,
    bio: String,
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
  }
};
</script>
