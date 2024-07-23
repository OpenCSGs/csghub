<template>
  <div class="max-w-[400px] pl-[20px] pr-[40px] md:px-0 sm:px-0 sm:w-full py-[36px]">
    <!-- avatar -->
    <div>
      <el-avatar :size="160" :src="profileData.profileAvatar"></el-avatar>
    </div>
    <!-- nickname -->
    <div class="text-[24px] leading-[32px] font-semibold">
      {{ profileData.profileNickname }}
    </div>
    <!-- name -->
    <div class="text-[16px] text-[#909399] max-w-[max-content] leading-[24px] mb-[16px]">
      @{{ profileData.profileName }}
    </div>
    <!-- profile settings -->
    <div v-if="isLoggedIn" class="flex xl:flex-col md:flex-row gap-3">
      <a href="/settings/profile" class="px-[12px] py-[5px] lg:w-[200px] md:w-auto text-center border border-[#DCDFE6] rounded-[4px] text-[14px] leading-[22px] font-medium hover:bg-[#EAECF0] hover:text-[#808080]">
        {{ $t('profile.editProfile')}}
      </a>
      <a href="/settings/profile" class="px-[12px] py-[5px] border border-[#DCDFE6] rounded-[4px] text-[14px] leading-[22px] font-medium hover:bg-[#EAECF0] hover:text-[#808080] hidden">
        {{ $t('profile.settings')}}
      </a>
    </div>
    <!-- roles -->
    <div v-if="userRoles" class="mt-[16px] text-[#606266] text-[16px] leading-[24px] flex items-center gap-[8px]"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2.66663 12.533C2.66663 10.7657 4.09931 9.33301 5.86663 9.33301H10.1333C11.9006 9.33301 13.3333 10.7657 13.3333 12.533V12.533C13.3333 13.7112 12.3782 14.6663 11.2 14.6663H4.79996C3.62175 14.6663 2.66663 13.7112 2.66663 12.533V12.533Z" stroke="#2F384C" stroke-linecap="round" stroke-linejoin="round"/><path d="M10.6666 3.99967C10.6666 5.47243 9.47272 6.66634 7.99996 6.66634C6.5272 6.66634 5.33329 5.47243 5.33329 3.99967C5.33329 2.52692 6.5272 1.33301 7.99996 1.33301C9.47272 1.33301 10.6666 2.52692 10.6666 3.99967Z" stroke="#2F384C" stroke-linecap="round" stroke-linejoin="round"/></svg>
      {{ profileData.profileRoles }}
    </div>
    <!-- phone -->
    <div v-if="isLoggedIn && profileData.profilePhone"
         class="mt-[16px] text-[#606266] text-[16px] leading-[24px] flex items-center gap-[8px]">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8.00004 3.99967H8.00671M6.66671 12.6663H9.33337M8.33337 3.99967C8.33337 4.18377 8.18414 4.33301 8.00004 4.33301C7.81595 4.33301 7.66671 4.18377 7.66671 3.99967C7.66671 3.81558 7.81595 3.66634 8.00004 3.66634C8.18414 3.66634 8.33337 3.81558 8.33337 3.99967ZM7.60004 14.6663H8.40004C9.89351 14.6663 10.6403 14.6663 11.2107 14.3757C11.7124 14.12 12.1204 13.7121 12.3761 13.2103C12.6667 12.6399 12.6667 11.8931 12.6667 10.3997V5.59967C12.6667 4.1062 12.6667 3.35946 12.3761 2.78903C12.1204 2.28727 11.7124 1.87932 11.2107 1.62366C10.6403 1.33301 9.89351 1.33301 8.40004 1.33301H7.60004C6.10657 1.33301 5.35983 1.33301 4.7894 1.62366C4.28763 1.87932 3.87969 2.28727 3.62402 2.78903C3.33337 3.35946 3.33337 4.1062 3.33337 5.59967V10.3997C3.33337 11.8931 3.33337 12.6399 3.62402 13.2103C3.87969 13.7121 4.28763 14.12 4.7894 14.3757C5.35983 14.6663 6.10657 14.6663 7.60004 14.6663Z" stroke="#2F384C" stroke-linecap="round" stroke-linejoin="round"/></svg>
      {{ profileData.profilePhone }}
    </div>
    <!-- email -->
    <div v-if="isLoggedIn && profileData.profileEmail"
         class="mt-[16px] text-[#606266] text-[16px] leading-[24px] flex items-center gap-[8px]">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M12 5.33333L11.3334 5.77778L10.9584 6.02773C9.88925 6.74053 9.35466 7.09692 8.77684 7.23539C8.2662 7.35776 7.73388 7.35776 7.22325 7.23539C6.64543 7.09692 6.11083 6.74053 5.04164 6.02773L4.66671 5.77778L4.00004 5.33333M6.6667 14H9.33337C11.2002 14 12.1336 14 12.8467 13.6367C13.4739 13.3171 13.9838 12.8072 14.3034 12.18C14.6667 11.4669 14.6667 10.5335 14.6667 8.66667V7.33333C14.6667 5.46649 14.6667 4.53307 14.3034 3.82003C13.9838 3.19282 13.4739 2.68289 12.8467 2.36331C12.1336 2 11.2002 2 9.33338 2H6.66671C4.79987 2 3.86644 2 3.15341 2.36331C2.5262 2.68289 2.01626 3.19282 1.69669 3.82003C1.33337 4.53307 1.33337 5.46649 1.33337 7.33333V8.66667C1.33337 10.5335 1.33337 11.4669 1.69669 12.18C2.01626 12.8072 2.5262 13.3171 3.15341 13.6367C3.86644 14 4.79986 14 6.6667 14Z" stroke="#2F384C" stroke-linecap="round"/></svg>
      <div class="w-[90%] overflow-hidden text-ellipsis">{{ profileData.profileEmail }}</div>
    </div>
    <!-- last login time -->
    <div v-if="isLoggedIn && profileData.profileLastLoginTime"
         class="mt-[16px] text-[#606266] text-[16px] leading-[24px] flex items-center gap-[8px]">
         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><g clip-path="url(#clip0_1405_18826)"><path d="M1.33337 7.99967C1.33337 11.3134 4.00004 14.6663 8.00004 14.6663C12 14.6663 14.6667 11.9997 14.6667 7.99967C14.6667 3.99967 12 1.33301 8.00004 1.33301C4.00004 1.33301 1.33337 4.66634 1.33337 4.66634M1.33337 4.66634V1.99967M1.33337 4.66634H3.66671M8.00004 5.33301V7.99967L10 9.33301" stroke="#2F384C" stroke-linecap="round" stroke-linejoin="round"/></g><defs><clipPath id="clip0_1405_18826"><rect width="16" height="16" fill="white"/></clipPath></defs></svg>
      {{ profileData.profileLastLoginTime }}
    </div>
    <!-- organization -->
    <div class="my-[16px] mt-[36px]">
      <div class="text-[20px] leading-[32px] font-semibold mb-[8px]">
        {{ $t('profile.organization')}}
      </div>
      <div v-if="userOrgs != []" class="flex gap-[10px] flex-wrap mt-[16px]">
        <p v-for="org in userOrgs">
          <a :href="`/organizations/${org.path}`">
            <img :src="org.logo" class="rounded-[50%] h-[40px] w-[40px]" />
          </a>
        </p>
      </div>
      <div v-else class="text-[#909399]">
        {{ $t('all.noData')}}
      </div>
    </div>
  </div>
</template>
<script setup>
  import { ref, inject, onMounted } from "vue";
  import { useCookies } from "vue3-cookies";
  import jwtFetch from '../../packs/jwtFetch.js'

  const props = defineProps({
    name: String
  })

  const { cookies } = useCookies()
  const isLoggedIn = cookies.isKey('current_user')
  const csghubServer = inject('csghubServer')

  const profileData = ref({
    profileName: '',
    profileNickname: '',
    profileAvatar: '',
    profileEmail: '',
    profilePhone: '',
    profileHomepage: '',
    profileBio: '',
    profileLastLoginTime: '',
    profileRoles: ''
  })

  const userOrgs = ref([])

  onMounted(() => {
    jwtFetch(`${csghubServer}/api/v1/user/${props.name}`, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((body) => {
        profileData.value.profileName = body.data.username
        profileData.value.profileNickname = body.data.nickname
        profileData.value.profileAvatar = body.data.avatar
        profileData.value.profileEmail = body.data.email
        profileData.value.profilePhone = body.data.phone
        profileData.value.profileHomepage = body.data.homepage
        profileData.value.profileBio = body.data.bio
        profileData.value.profileLastLoginTime = body.data.last_login_time
        profileData.value.profileRoles = body.data.roles
        userOrgs.value = body.data.orgs
      })
  })
</script>

<!-- <script>
export default {
  props: {
    name: String,
    displayName: String,
    phone: String,
    avatar: String,
    email: String,
    lastLoginTime: String,
    loginIdentity: String,
    roles: String,
    orgs: String,
    isLoggedIn: Boolean
  },
  data() {
    return {
      theLastLoginTime: this.lastLoginTime ? this.lastLoginTime.slice(0, -6) : "",
      userRoles: this.roles ? JSON.parse(this.roles) : [],
      userOrgs: this.orgs ? JSON.parse(this.orgs) : []
    };
  },
  mounted() {
  },
};
</script> -->
