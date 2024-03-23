<template>
  <div>
    <div class="py-[16px] bg-[#FAFCFF]">
      <div class="max-w-[1280px] m-auto flex items-center justify-between py-[16px] xl:px-[16px]">
        <div class="flex gap-[10px]">
          <span v-if="organization.verified" class="relative">
            <img :src="organization.avatar" class="h-[60px] w-[60px] rounded-[50%]" />
            <svg class="absolute bottom-0 right-0" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none"><g clip-path="url(#clip0_7299_1409)"><path d="M13.899 3.18734C14.07 3.6008 14.3981 3.92944 14.8113 4.10101L16.2602 4.70116C16.6737 4.87243 17.0022 5.20094 17.1735 5.61443C17.3448 6.02791 17.3448 6.4925 17.1735 6.90598L16.5738 8.35382C16.4024 8.76748 16.4022 9.23254 16.5743 9.64601L17.173 11.0934C17.2579 11.2982 17.3016 11.5177 17.3016 11.7394C17.3017 11.9611 17.258 12.1807 17.1732 12.3855C17.0883 12.5903 16.964 12.7764 16.8072 12.9331C16.6504 13.0899 16.4643 13.2142 16.2594 13.2989L14.8116 13.8987C14.3981 14.0696 14.0695 14.3978 13.8979 14.811L13.2978 16.2598C13.1265 16.6733 12.798 17.0018 12.3845 17.1731C11.971 17.3444 11.5064 17.3444 11.0929 17.1731L9.64511 16.5734C9.23161 16.4025 8.7672 16.4029 8.35396 16.5744L6.90508 17.1736C6.49183 17.3445 6.02764 17.3444 5.6145 17.1732C5.20135 17.0021 4.87302 16.674 4.70163 16.2609L4.10131 14.8116C3.93035 14.3982 3.6022 14.0695 3.18901 13.898L1.74014 13.2978C1.32683 13.1266 0.998417 12.7983 0.827083 12.3851C0.655748 11.9718 0.655516 11.5075 0.826437 11.094L1.42615 9.6462C1.597 9.23271 1.59665 8.76829 1.42518 8.35505L0.826328 6.90513C0.741422 6.70034 0.697703 6.48082 0.697668 6.25912C0.697632 6.03743 0.741281 5.8179 0.82612 5.61308C0.91096 5.40826 1.03533 5.22216 1.19212 5.06542C1.3489 4.90868 1.53504 4.78438 1.73989 4.6996L3.18772 4.09989C3.60082 3.92908 3.92926 3.60135 4.10096 3.18863L4.70111 1.73976C4.87238 1.32627 5.20089 0.997758 5.61438 0.826487C6.02786 0.655216 6.49245 0.655216 6.90593 0.826487L8.35377 1.4262C8.76726 1.59705 9.23168 1.5967 9.64492 1.42523L11.0944 0.827417C11.5078 0.656242 11.9723 0.656277 12.3857 0.827514C12.7991 0.998752 13.1276 1.32717 13.2989 1.74055L13.8992 3.18985L13.899 3.18734Z" fill="#2E90FA"/><path fill-rule="evenodd" clip-rule="evenodd" d="M12.5249 6.64035C12.6452 6.45148 12.6855 6.22258 12.6369 6.00401C12.5884 5.78544 12.455 5.59509 12.2662 5.47485C12.0773 5.35461 11.8484 5.31432 11.6298 5.36284C11.4113 5.41137 11.2209 5.54473 11.1007 5.7336L7.79654 10.9255L6.28454 9.03547C6.14476 8.86063 5.94124 8.74848 5.71876 8.72369C5.49629 8.6989 5.27308 8.7635 5.09823 8.90329C4.92339 9.04307 4.81123 9.24659 4.78644 9.46907C4.76165 9.69154 4.82626 9.91476 4.96604 10.0896L7.21604 12.9021C7.2999 13.007 7.4076 13.0905 7.53018 13.1454C7.65277 13.2003 7.7867 13.2252 7.92084 13.2179C8.05498 13.2107 8.18544 13.1715 8.30138 13.1036C8.41732 13.0358 8.51539 12.9412 8.58742 12.8278L12.5249 6.64035Z" fill="white"/></g><defs><clipPath id="clip0_7299_1409"><rect width="18" height="18" fill="white"/></clipPath></defs></svg>
          </span>
          <span v-else class="relative">
            <img :src="organization.avatar" class="h-[60px] w-[60px] rounded-[50%]" />
          </span>
          <div>
            <h3 class="text-[24px] text-[#303133] font-[600]"> {{ organization.nickname.trim() || organization.name }}</h3>
            <p class="text-[16px]"> @{{ organization.name }} </p>
          </div>
        </div>
        <a v-if="admin" :href="`/organizations/${organization.name}/edit`" class="flex gap-[10px] border border-gray-300 rounded-[8px] px-[12px] py-[8px]">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M9.99984 12.9167H6.24984C5.08687 12.9167 4.50538 12.9167 4.03222 13.0602C2.96688 13.3834 2.1332 14.217 1.81004 15.2824C1.6665 15.7555 1.6665 16.337 1.6665 17.5M15.8332 17.5V12.5M13.3332 15H18.3332M12.0832 6.25C12.0832 8.32107 10.4042 10 8.33317 10C6.2621 10 4.58317 8.32107 4.58317 6.25C4.58317 4.17893 6.2621 2.5 8.33317 2.5C10.4042 2.5 12.0832 4.17893 12.0832 6.25Z" stroke="#344054" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/></svg>
            {{ $t('organization.orgSetting') }}
          </a>
      </div>
    </div>

    <div class="bg-[#fff]">
      <div class="max-w-[1280px] m-auto py-[36px] flex sm:flex-col">
        <div class="w-[30%] md:w-[45%] px-[16px] sm:w-[100%]">
          <h3 class="flex items-center gap-[8px]">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
              <g clip-path="url(#clip0_4440_70851)">
                <path opacity="0.12" d="M16.5 11.25V9.4084C16.5 8.42493 16.5 7.9332 16.4124 7.47151C16.2497 6.61316 15.8648 5.81244 15.2963 5.14913C14.9904 4.79234 14.6064 4.48516 13.8385 3.87079L13.6852 3.74817C12.2008 2.56062 11.4586 1.96684 10.655 1.68498C9.58368 1.30917 8.41632 1.30917 7.34496 1.68498C6.54145 1.96684 5.79923 2.56062 4.31479 3.74817L4.31479 3.74817L4.16151 3.87079C3.39355 4.48516 3.00958 4.79234 2.70375 5.14913C2.13518 5.81244 1.75034 6.61316 1.58756 7.47151C1.5 7.9332 1.5 8.42493 1.5 9.4084V11.25C1.5 11.4821 1.5 11.5982 1.50385 11.6963C1.60629 14.3036 3.69643 16.3937 6.3037 16.4961C6.40181 16.5 6.51788 16.5 6.75 16.5V11.25C6.75 11.0178 6.75 10.9017 6.75963 10.804C6.85315 9.85441 7.60441 9.10315 8.55397 9.00963C8.65175 9 8.76783 9 9 9C9.23217 9 9.34825 9 9.44603 9.00963C10.3956 9.10315 11.1468 9.85441 11.2404 10.804C11.25 10.9017 11.25 11.0178 11.25 11.25V16.5C11.4821 16.5 11.5982 16.5 11.6963 16.4961C14.3036 16.3937 16.3937 14.3036 16.4961 11.6963C16.5 11.5982 16.5 11.4821 16.5 11.25Z" fill="#A8ABB2"/>
                <path d="M11.25 16.5V11.25C11.25 11.0178 11.25 10.9017 11.2404 10.804C11.1468 9.85441 10.3956 9.10315 9.44603 9.00963C9.34825 9 9.23217 9 9 9V9C8.76783 9 8.65175 9 8.55397 9.00963C7.60441 9.10315 6.85315 9.85441 6.75963 10.804C6.75 10.9017 6.75 11.0178 6.75 11.25V16.5M4.31479 3.74817L4.16151 3.87079C3.39355 4.48516 3.00958 4.79234 2.70375 5.14913C2.13518 5.81244 1.75034 6.61316 1.58756 7.47151C1.5 7.9332 1.5 8.42493 1.5 9.4084V9.4084C1.5 11.3554 1.5 12.3288 1.76744 13.1133C2.26754 14.5803 3.41967 15.7325 4.88666 16.2326C5.67116 16.5 6.64464 16.5 8.5916 16.5H9.4084C11.3554 16.5 12.3288 16.5 13.1133 16.2326C14.5803 15.7325 15.7325 14.5803 16.2326 13.1133C16.5 12.3288 16.5 11.3554 16.5 9.4084V9.4084C16.5 8.42493 16.5 7.9332 16.4124 7.47151C16.2497 6.61316 15.8648 5.81244 15.2963 5.14913C14.9904 4.79234 14.6064 4.48516 13.8385 3.87079L13.6852 3.74817C12.2008 2.56062 11.4586 1.96684 10.655 1.68498C9.58368 1.30917 8.41632 1.30917 7.34497 1.68498C6.54145 1.96684 5.79923 2.56062 4.31479 3.74817Z" stroke="#A8ABB2" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </g>
              <defs>
                <clipPath id="clip0_4440_70851">
                  <rect width="18" height="18" fill="white"/>
                </clipPath>
              </defs>
            </svg>
            <span class="text-[#303133] text-[20px]">{{ $t('organization.orgTeam') }} <span class="text-[#A8ABB2] text-[20px]">{{ membersList.length }} </span></span>
          </h3>

          <InviteMember :org-name="organization.name"
                        @resetMemberList="resetMemberList"
                        :admin="admin"
          />

          <div class="mt-[16px] flex flex-wrap gap-[8px]">
            <a v-for="user in membersList" :href="`/profile/${user.name}`">
              <div class="flex flex-col items-center">
                <img :src="user.avatar" class="h-[52px] w-[52px] rounded-[50%] border p-[2px]" />
                <span class="text-[#A8ABB2] text-[12px]">{{ user.role }}</span>
              </div>
            </a>
          </div>
        </div>
        <profile-repo-list
          :model-list="models"
          :dataset-list="datasets"
          :code-list="codes"
          :name="organization.name"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { ref, onMounted } from 'vue'
  import InviteMember from './InviteMember.vue'
  import ProfileRepoList from '../shared/ProfileRepoList.vue'

  const props = defineProps({
    organization: Object,
    members: Array,
    models: Object,
    datasets: Object,
    codes: Object,
    admin: Boolean
  })

  const membersList = ref(props.members)

  const resetMemberList = (newMembers, userRole) => {
    newMembers.forEach(member => member.role = userRole)
    const newMembersList = membersList.value.concat(newMembers).reverse()
    const uniqNewMembersList = newMembersList.filter((member, index, self) => {
      return index === self.findIndex((nestedMember) => nestedMember.name === member.name);
    });
    membersList.value = uniqNewMembersList.reverse()
  }

  onMounted(() => {})
</script>