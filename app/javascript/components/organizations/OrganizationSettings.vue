<template>
  <div
    class="flex justify-center md:flex-col px-[24px] rounded-[8px] md:px-[50px] sm:px-[20px] max-w-[1280px] m-auto bg-white min-h-[calc(100vh-129px)]"
  >
    <Menu
      class="max-w-[411px] md:mb-[24px]"
      :nickName="organization.nickname"
      :homepage="organization.homepage"
      :name="organization.name"
      :logo="organization.logo"
    >
    </Menu>
    <OrganizationEdit
      v-if="action === 'edit'"
      class="grow py-[24px]"
      :organizationRaw="organization"
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

<script setup>
  import Menu from './Menu.vue'
  import OrganizationEdit from './OrganizationEdit.vue'
  import OrganizationMembers from './OrganizationMembers.vue'
  import jwtFetch from "../../packs/jwtFetch.js"
  import { ref, onMounted, inject, provide } from 'vue'

  const props = defineProps({
    name: String,
    action: String
  })

  const csghubServer = inject('csghubServer')

  const organization = ref({
    name: props.name,
    nickname: '',
    verified: false,
    logo: '',
    homepage: '',
    org_type: ''
  })

  const fetchOrgDetail = async () => {
    const orgDetailEndpoint = `${csghubServer}/api/v1/organization/${props.name}`
    jwtFetch(orgDetailEndpoint)
      .then(response => response.json())
      .then(body => {
        organization.value.name = body.data.path
        organization.value.nickname = body.data.name
        organization.value.verified = body.data.verified
        organization.value.logo = body.data.logo
        organization.value.homepage = body.data.homepage
        organization.value.org_type = body.data.org_type
      })
      .catch(error => {
        console.error('Error:', error)
      })
  }

  const updateOrganization = (data) => {
    const { nickname, homepage, logo } = data
    if (nickname) {
      organization.value.nickname = nickname
    }
    if (homepage) {
      organization.value.homepage = homepage
    }
    if (logo) {
      organization.value.logo = logo
    }
  }

  onMounted(() => {
    fetchOrgDetail()
  })
</script>
