<template>
    <div class="flex justify-center md:flex-col px-[24px] rounded-[8px] md:px-[50px] sm:px-[20px] max-w-[1280px] m-auto bg-white">
      <Menu class="max-w-[411px] md:mb-[24px]">
      </Menu>
      <OrganizationEdit class="grow py-[24px]">
      </OrganizationEdit>
    </div>
  </template>
  <script>
  import Menu from "./Menu.vue";
  import OrganizationEdit from "./OrganizationEdit.vue";
  export default {
    props: {},
    components: {
      Menu,
      OrganizationEdit,
    },
    data() {
      return {};
    },
    mounted() {},
    methods: {},
  };
  </script>
  