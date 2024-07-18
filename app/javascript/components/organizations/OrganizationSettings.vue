<template>
  <div
    class="flex justify-center md:flex-col px-[24px] rounded-[8px] md:px-[50px] sm:px-[20px] max-w-[1280px] m-auto bg-white min-h-[calc(100vh-129px)]"
  >
    <Menu
      class="max-w-[411px] md:mb-[24px]"
      :nickName="organizationNickname"
      :homepage="organizationHomepage"
      :name="organization.name"
      :logo="organizationAvatar"
    >
    </Menu>
    <OrganizationEdit
      v-if="action === 'edit'"
      class="grow py-[24px]"
      :organization="organization"
      @updateOrganization="updateOrganization"
    >
    </OrganizationEdit>
    <OrganizationMembers
      v-if="action === 'members'"
      class="grow py-[24px]"
      :admin="admin"
      :organization="organization"
    >
    </OrganizationMembers>
  </div>
</template>
<script>
  import Menu from './Menu.vue'
  import OrganizationEdit from './OrganizationEdit.vue'
  import OrganizationMembers from './OrganizationMembers.vue'
  export default {
    props: {
      organization: Object,
      action: String,
      admin: Boolean
    },
    components: {
      Menu,
      OrganizationEdit,
      OrganizationMembers
    },
    data() {
      return {
        organizationNickname: this.organization.nickname,
        organizationHomepage: this.organization.homepage,
        organizationAvatar: this.organization.avatar
      }
    },
    methods: {
      updateOrganization(data) {
        const { nickname, homepage, logo } = data
        this.organizationNickname = nickname || this.organizationNickname
        this.organizationHomepage = homepage || this.organizationHomepage
        this.organizationAvatar = logo || this.organizationAvatar
      }
    }
  }
</script>
