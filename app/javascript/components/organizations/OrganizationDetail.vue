<template>
  <div>
    <div class="py-[16px] bg-[#FAFCFF]">
      <div class="max-w-[1280px] m-auto py-[16px] xl:px-[16px]">
        <div class="flex gap-[10px]">
          <img :src="organization.avatar" class="h-[60px] w-[60px] rounded-[50%]" />
          <div>
            <h3 class="text-[24px] text-[#303133] font-[600]"> {{ organization.nickname.trim() || organization.name }}</h3>
            <p class="text-[16px]"> @{{ organization.name }} </p>
          </div>
        </div>
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
            <span class="text-[#303133] text-[20px]">团队成员 <span class="text-[#A8ABB2] text-[20px]">{{ membersList.length }} </span></span>
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
          :name="organization.name"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { ref, onMounted } from 'vue'
  import ModelItem from '../models/ModelItem.vue';
  import DatasetItem from '../datasets/DatasetItem.vue';
  import InviteMember from './InviteMember.vue'
  import ProfileRepoList from '../shared/ProfileRepoList.vue'

  const props = defineProps({
    organization: Object,
    members: Array,
    models: Object,
    datasets: Object,
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