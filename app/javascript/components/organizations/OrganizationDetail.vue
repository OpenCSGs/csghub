<template>
  <div>
    <div class="py-[16px] bg-[#FAFCFF]">
      <div class="max-w-[1280px] m-auto flex md:flex-col md:gap-4 items-center justify-between py-[16px] xl:px-[16px]">
        <div class="flex gap-[10px]">
          <span v-if="organizationData.verified" class="relative">
            <img :src="organizationData.avatar" class="h-[60px] w-[60px] rounded-[50%]" />
            <svg class="absolute bottom-0 right-0" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none"><g clip-path="url(#clip0_7299_1409)"><path d="M13.899 3.18734C14.07 3.6008 14.3981 3.92944 14.8113 4.10101L16.2602 4.70116C16.6737 4.87243 17.0022 5.20094 17.1735 5.61443C17.3448 6.02791 17.3448 6.4925 17.1735 6.90598L16.5738 8.35382C16.4024 8.76748 16.4022 9.23254 16.5743 9.64601L17.173 11.0934C17.2579 11.2982 17.3016 11.5177 17.3016 11.7394C17.3017 11.9611 17.258 12.1807 17.1732 12.3855C17.0883 12.5903 16.964 12.7764 16.8072 12.9331C16.6504 13.0899 16.4643 13.2142 16.2594 13.2989L14.8116 13.8987C14.3981 14.0696 14.0695 14.3978 13.8979 14.811L13.2978 16.2598C13.1265 16.6733 12.798 17.0018 12.3845 17.1731C11.971 17.3444 11.5064 17.3444 11.0929 17.1731L9.64511 16.5734C9.23161 16.4025 8.7672 16.4029 8.35396 16.5744L6.90508 17.1736C6.49183 17.3445 6.02764 17.3444 5.6145 17.1732C5.20135 17.0021 4.87302 16.674 4.70163 16.2609L4.10131 14.8116C3.93035 14.3982 3.6022 14.0695 3.18901 13.898L1.74014 13.2978C1.32683 13.1266 0.998417 12.7983 0.827083 12.3851C0.655748 11.9718 0.655516 11.5075 0.826437 11.094L1.42615 9.6462C1.597 9.23271 1.59665 8.76829 1.42518 8.35505L0.826328 6.90513C0.741422 6.70034 0.697703 6.48082 0.697668 6.25912C0.697632 6.03743 0.741281 5.8179 0.82612 5.61308C0.91096 5.40826 1.03533 5.22216 1.19212 5.06542C1.3489 4.90868 1.53504 4.78438 1.73989 4.6996L3.18772 4.09989C3.60082 3.92908 3.92926 3.60135 4.10096 3.18863L4.70111 1.73976C4.87238 1.32627 5.20089 0.997758 5.61438 0.826487C6.02786 0.655216 6.49245 0.655216 6.90593 0.826487L8.35377 1.4262C8.76726 1.59705 9.23168 1.5967 9.64492 1.42523L11.0944 0.827417C11.5078 0.656242 11.9723 0.656277 12.3857 0.827514C12.7991 0.998752 13.1276 1.32717 13.2989 1.74055L13.8992 3.18985L13.899 3.18734Z" fill="#2E90FA"/><path fill-rule="evenodd" clip-rule="evenodd" d="M12.5249 6.64035C12.6452 6.45148 12.6855 6.22258 12.6369 6.00401C12.5884 5.78544 12.455 5.59509 12.2662 5.47485C12.0773 5.35461 11.8484 5.31432 11.6298 5.36284C11.4113 5.41137 11.2209 5.54473 11.1007 5.7336L7.79654 10.9255L6.28454 9.03547C6.14476 8.86063 5.94124 8.74848 5.71876 8.72369C5.49629 8.6989 5.27308 8.7635 5.09823 8.90329C4.92339 9.04307 4.81123 9.24659 4.78644 9.46907C4.76165 9.69154 4.82626 9.91476 4.96604 10.0896L7.21604 12.9021C7.2999 13.007 7.4076 13.0905 7.53018 13.1454C7.65277 13.2003 7.7867 13.2252 7.92084 13.2179C8.05498 13.2107 8.18544 13.1715 8.30138 13.1036C8.41732 13.0358 8.51539 12.9412 8.58742 12.8278L12.5249 6.64035Z" fill="white"/></g><defs><clipPath id="clip0_7299_1409"><rect width="18" height="18" fill="white"/></clipPath></defs></svg>
          </span>
          <span v-else class="relative">
            <img :src="organizationData.avatar" class="h-[60px] w-[60px] rounded-[50%]" />
          </span>
          <div>
            <h3 class="text-[24px] text-[#303133] font-[600]"> {{ (organizationData.nickname && organizationData.nickname.trim()) || organizationData.name }}</h3>
            <p class="text-[16px]"> @{{ organizationData.name }} </p>
          </div>
        </div>
        <div class="flex gap-[10px]">
          <el-popover placement="bottom-start" :width="300" trigger="click">
            <template #reference>
              <div v-if="role === 'admin'" :href="`/organizations/${organizationData.name}/edit`" class="flex cursor-pointer gap-[10px] border border-gray-300 items-center rounded-[8px] px-[12px] py-[8px]">
                <SvgIcon name="create_org_repo"/>
                {{ $t('organization.create') }}
              </div>
            </template>
            <div>
              <a :href="`/models/new?orgName=${organizationData.name}`" class="hover:bg-[#F9FAFB] cursor-pointer flex gap-2 items-center py-[9px] px-[10px]">
                <div class="px-2 py-2 bg-[#F9F1F0]">
                  <SvgIcon name="models" />
                </div>
                <div class="text-[14px] leading-[20px] text-[#344054]">
                  <div>{{ $t('models.title') }}</div>
                  <div class="font-light">{{ $t('models.tips') }}</div>
                </div>
              </a>
              <a :href="`/datasets/new?orgName=${organizationData.name}`" class="hover:bg-[#F9FAFB] cursor-pointer flex gap-2 items-center py-[9px] px-[10px]">
                <div class="px-2 py-2 bg-[#E7EFF7]">
                  <SvgIcon name="datasets" />
                </div>
                <div class="text-[14px] leading-[20px] text-[#344054]">
                  <div>{{ $t('datasets.title') }}</div>
                  <div class="font-light">{{ $t('datasets.tips') }}</div>
                </div>
              </a>
              <a :href="`/spaces/new?orgName=${organizationData.name}`" class="hover:bg-[#F9FAFB] cursor-pointer flex gap-2 items-center py-[9px] px-[10px]">
                <div class="px-2 py-2 bg-[#F5F2FB]">
                  <SvgIcon name="spaces" />
                </div>
                <div class="text-[14px] leading-[20px] text-[#344054]">
                  <div>{{ $t('spaces.title') }}</div>
                  <div class="font-light">{{ $t('spaces.tips') }}</div>
                </div>
              </a>
              <a  :href="`/codes/new?orgName=${organizationData.name}`" class="hover:bg-[#F9FAFB] cursor-pointer flex gap-2 items-center py-[9px] px-[10px]">
                <div class="px-2 py-2 bg-[#F3F4F6]">
                  <SvgIcon name="codes" />
                </div>
                <div class="text-[14px] leading-[20px] text-[#344054]">
                  <div>{{ $t('codes.title') }}</div>
                  <div class="font-light">{{ $t('codes.tips')}}</div>
                </div>
              </a>
            </div>
          </el-popover>
          <a v-if="role === 'write' || role === 'admin'" :href="`/organizations/${organizationData.name}/edit`" class="flex gap-[10px] border border-gray-300 rounded-[8px] px-[12px] py-[8px]">
            <SvgIcon name="invite_org_member" />
            {{ $t('organization.orgSetting') }}
          </a>
        </div>
      </div>
    </div>

    <div class="bg-[#fff]">
      <div class="flex justify-center lg:flex-col rounded-[8px] max-w-[1280px] m-auto bg-white">
        <div class="max-w-[320px] pl-[16px] pr-[32px] pt-[36px]">
          <h3 class="flex items-center gap-[8px]">
            <SvgIcon name="team_org"/>
            <span class="text-[#303133] text-[20px]">{{ $t('organization.orgTeam') }} <span class="text-[#A8ABB2] text-[20px]">{{ membersList.length }} </span></span>
          </h3>

          <InviteMember :orgName="organizationData.name"
                        @resetMemberList="resetMemberList"
                        :role="role"
                        class="my-[16px]"
          />

          <div class="mt-[16px] flex flex-wrap gap-[8px]">
            <a v-for="user in membersList" :href="`/profile/${user.username}`">
              <el-tooltip placement="bottom" effect="light">
                <div class="flex flex-col items-center">
                  <img :src="user.avatar" class="h-[52px] w-[52px] rounded-[50%] border p-[2px]" />
                </div>
                <template #content>
                  <span class="text-[12px] py-[8px] px-[12px]">{{ user.nickname || user.name }} ( {{ user.role }} )</span>
                </template>
              </el-tooltip>
            </a>
          </div>
        </div>
        <div class="grow px-[20px] py-[36px] sm:py-0">
          <ProfileRepoList :name="name" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted, inject } from 'vue'
  import InviteMember from './InviteMember.vue'
  import ProfileRepoList from '../shared/ProfileRepoList.vue'
  import { useCookies } from 'vue3-cookies'
  import jwtFetch from '../../packs/jwtFetch.js'

  const props = defineProps({
    name: String
  })

  const organizationData = ref({
    name: props.name,
    nickname: '',
    verified: false,
    avatar: ''
  })
  const membersList = ref([])

  const csghubServer = inject('csghubServer')
  const { cookies } = useCookies()

  const role = ref('')

  const resetMemberList = (newMembers, userRole) => {
    newMembers.forEach(member => member.role = userRole)
    const newMembersList = membersList.value.concat(newMembers).reverse()
    const uniqNewMembersList = newMembersList.filter((member, index, self) => {
      return index === self.findIndex((nestedMember) => nestedMember.name === member.name);
    });
    membersList.value = uniqNewMembersList.reverse()
  }

  const fetchOrgDetail = async () => {
    const orgDetailEndpoint = `${csghubServer}/api/v1/organization/${props.name}`
    jwtFetch(orgDetailEndpoint)
      .then(response => response.json())
      .then(body => {
        organizationData.value.name = body.data.path
        organizationData.value.nickname = body.data.name
        organizationData.value.verified = body.data.verified
        organizationData.value.avatar = body.data.logo
      })
      .catch(error => {
        console.error('Error:', error)
      })
  }

  const fetchOrgMemberList = async () => {
    const orgMemberListEndpoint = `${csghubServer}/api/v1/organization/${props.name}/members`
    jwtFetch(orgMemberListEndpoint)
      .then(response => response.json())
      .then(body => {
        membersList.value = body.data.data
      })
      .catch(error => {
        console.error('Error:', error)
      })
  }
  const currentUserRole = async () => {
    const orgIsAdminEndpoint = `${csghubServer}/api/v1/organization/${props.name}/members/${cookies.get('current_user')}`
    jwtFetch(orgIsAdminEndpoint)
      .then(response => response.json())
      .then(body => {
        console.log(body.data);
        role.value = body.data
      })
      .catch(error => {
        console.error('Error:', error)
      })
  }

  onMounted(() => {
    fetchOrgDetail()
    fetchOrgMemberList()
    currentUserRole()
  })
</script>