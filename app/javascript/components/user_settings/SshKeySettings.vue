<template>
  <div class="flex justify-center md:flex-col px-[24px] py-[36px] my-[24px] rounded-[8px] md:px-[50px] sm:px-[20px] max-w-[1280px] m-auto bg-white">
    <Menu class="max-w-[411px] md:mb-[24px]"
          :name="profileName"
          :displayName="profileDisplayName"
          :avatar="profileAvatar">
    </Menu>
    <div class="grow py-[24px]">
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
      profileName: this.name,
      profileDisplayName: this.displayName,
      profileAvatar: this.avatar,
    };
  },
  mounted() {},
  methods: {},
};
</script>
