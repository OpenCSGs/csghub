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
      :role="role"
      :organizationRaw="organization"
    >
    </OrganizationMembers>
  </div>
</template>

<script setup>
  import Menu from './Menu.vue'
  import OrganizationEdit from './OrganizationEdit.vue'
  import OrganizationMembers from './OrganizationMembers.vue'
  import useFetchApi from "../../packs/useFetchApi"
  import { ref, onMounted } from 'vue'
  import { useCookies } from 'vue3-cookies'
  import { ElMessage } from 'element-plus'

  const props = defineProps({
    name: String,
    action: String
  })
  
  const { cookies } = useCookies()
  const current_user = cookies.get('current_user')

  const organization = ref({
    name: props.name,
    nickname: '',
    verified: false,
    logo: '',
    homepage: '',
    org_type: ''
  })

  const role =ref('')

  const fetchOrgDetail = async () => {
    const orgDetailEndpoint = `/organization/${props.name}`
    const { data, error } = await useFetchApi(orgDetailEndpoint).json()

    if (error.value) {
      ElMessage({ message: error.value.msg, type: 'warning' })
    } else {
      const body = data.value
      organization.value.name = body.data.path
      organization.value.nickname = body.data.name
      organization.value.verified = body.data.verified
      organization.value.logo = body.data.logo
      organization.value.homepage = body.data.homepage
      organization.value.org_type = body.data.org_type
    }
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
  
  const currentUserRole = async () => {
    const orgIsAdminEndpoint = `/organization/${props.name}/members/${current_user}`
    const { data, error } = await useFetchApi(orgIsAdminEndpoint).json()

    if (error.value) {
      ElMessage({ message: error.value.msg, type: 'warning' })
    } else {
      const body = data.value
      role.value = body.data
    }
  }

  onMounted(() => {
    fetchOrgDetail()
    currentUserRole()
  })
</script>
