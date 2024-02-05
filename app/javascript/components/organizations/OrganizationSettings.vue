<template>
    <div class="flex justify-center md:flex-col px-[24px] rounded-[8px] md:px-[50px] sm:px-[20px] max-w-[1280px] m-auto bg-white">
      <Menu class="max-w-[411px] md:mb-[24px]" :nickName="organizationNickname"
                                               :homepage="organizationHomepage"
                                               :name="organization.name"
                                               :logo="organizationAvatar">
      </Menu>
      <OrganizationEdit class="grow py-[24px]"
                        :organization="organization"
                        @updateOrganization="updateOrganization" >
      </OrganizationEdit>
    </div>
  </template>
  <script>
  import Menu from "./Menu.vue";
  import OrganizationEdit from "./OrganizationEdit.vue";
  export default {
    props: {
      organization: Object
    },
    components: {
      Menu,
      OrganizationEdit,
    },
    data() {
      return {
        organizationNickname: this.organization.nickname,
        organizationHomepage: this.organization.homepage,
        organizationAvatar: this.organization.avatar,
      };
    },
    mounted() {},
    methods: {
      updateOrganization(data) {
        const { nickname, homepage, logo } = data;
        this.organizationNickname = nickname || this.nickname;
        this.organizationHomepage = homepage || this.homepage;
        this.organizationAvatar = logo || this.logo;
      },
    },
  };
  </script>
  