<template>
  <div>
    <div class="py-[16px] bg-[#FAFCFF]">
      <div class="max-w-[1280px] m-auto py-[16px] xl:px-[16px]">
        <div class="flex gap-[10px]">
          <img :src="organization.avatar" class="h-[60px] w-[60px] rounded-[50%]" />
          <div>
            <h3 class="text-[24px] text-[#303133] font-[600]"> {{ organization.name }}</h3>
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
        <div class="xl:px-[16px] sm:w-[100%] sm:mt-[36px]">
          <div>
            <h3 class="text-[20px] text-[#303133] flex items-center gap-[8px]">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path opacity="0.12" d="M16.5 10.0327V5.46176C16.5 5.33063 16.4312 5.20911 16.3188 5.14164C16.1996 5.07018 16.0507 5.07075 15.9321 5.14313L11.5012 7.84833C10.5927 8.40303 10.1384 8.68038 9.65249 8.78865C9.22277 8.88441 8.77723 8.88441 8.34751 8.78865C7.86162 8.68038 7.40734 8.40303 6.49878 7.84833L2.06785 5.14313C1.9493 5.07075 1.80036 5.07018 1.68125 5.14164C1.5688 5.20911 1.5 5.33063 1.5 5.46176V10.0327C1.5 11.0237 1.5 11.5192 1.64219 11.9645C1.76802 12.3585 1.97396 12.7222 2.24708 13.0328C2.55572 13.3838 2.98062 13.6388 3.83042 14.1486L6.53042 15.7686C7.42832 16.3074 7.87727 16.5768 8.35653 16.682C8.78046 16.7751 9.21954 16.7751 9.64346 16.682C10.1227 16.5768 10.5717 16.3074 11.4696 15.7686L14.1696 14.1486C15.0194 13.6388 15.4443 13.3838 15.7529 13.0328C16.026 12.7222 16.232 12.3585 16.3578 11.9645C16.5 11.5192 16.5 11.0237 16.5 10.0327Z" fill="#AD4A3B"/>
                <path d="M9 9.375L15.75 5.25M9 9.375L2.25 5.25M9 9.375V16.875M1.5 7.96771V10.0323C1.5 11.0233 1.5 11.5188 1.64219 11.9641C1.76802 12.3581 1.97396 12.7218 2.24708 13.0324C2.55572 13.3834 2.98062 13.6384 3.83042 14.1483L6.53042 15.7683C7.42832 16.307 7.87727 16.5764 8.35653 16.6816C8.78046 16.7747 9.21954 16.7747 9.64346 16.6816C10.1227 16.5764 10.5717 16.307 11.4696 15.7683L14.1696 14.1483C15.0194 13.6384 15.4443 13.3834 15.7529 13.0324C16.026 12.7218 16.232 12.3581 16.3578 11.9641C16.5 11.5188 16.5 11.0233 16.5 10.0323V7.96771C16.5 6.97669 16.5 6.48117 16.3578 6.03593C16.232 5.64192 16.026 5.27818 15.7529 4.96757C15.4443 4.61657 15.0194 4.36163 14.1696 3.85175L11.4696 2.23175C10.5717 1.69301 10.1227 1.42364 9.64346 1.31839C9.21954 1.2253 8.78046 1.2253 8.35653 1.31839C7.87727 1.42364 7.42832 1.69301 6.53042 2.23175L3.83042 3.85175C2.98062 4.36163 2.55572 4.61657 2.24708 4.96757C1.97396 5.27818 1.76802 5.64192 1.64219 6.03593C1.5 6.48117 1.5 6.97669 1.5 7.96771Z" stroke="#AD4A3B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span>模型</span>
            </h3>
            <div v-if="hasModels" class="flex flex-wrap gap-4 mb-4 mt-[16px]">
              <model-item v-for="model in modelList" :model="model"></model-item>
            </div>
            <div v-else class="flex flex-wrap gap-4 mb-4 mt-[16px]">
                暂无数据
            </div>
          </div>
          <div class="mt-[32px]">
            <h3 class="text-[20px] text-[#303133] flex items-center gap-[8px]">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path opacity="0.12" d="M9 16.5C12.7279 16.5 15.75 15.4926 15.75 14.25V3.75C15.75 3.75 15.375 6 9 6C2.625 6 2.25 3.75 2.25 3.75V14.25C2.25 15.4926 5.27208 16.5 9 16.5Z" fill="#1F75CB"/>
                <path d="M15.75 9C15.75 10.2426 12.7279 11.25 9 11.25C5.27208 11.25 2.25 10.2426 2.25 9M15.75 3.75C15.75 4.99264 12.7279 6 9 6C5.27208 6 2.25 4.99264 2.25 3.75M15.75 3.75C15.75 2.50736 12.7279 1.5 9 1.5C5.27208 1.5 2.25 2.50736 2.25 3.75M15.75 3.75V14.25C15.75 15.4926 12.7279 16.5 9 16.5C5.27208 16.5 2.25 15.4926 2.25 14.25V3.75" stroke="#1F75CB" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span>数据集</span>
            </h3>
            <div v-if="hasDatasets" class="flex flex-wrap gap-4 mb-4 mt-[16px]">
              <dataset-item v-for="dataset in datasetList" :dataset="dataset"></dataset-item>
            </div>
            <div v-else class="flex flex-wrap gap-4 mb-4 mt-[16px]">
                暂无数据
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { ref, onMounted } from 'vue'
  import ModelItem from '../models/ModelItem.vue';
  import DatasetItem from '../datasets/DatasetItem.vue';
  import InviteMember from './InviteMember.vue'

  const props = defineProps({
    organization: Object,
    members: Array,
    models: Object,
    datasets: Object
  })

  const modelList = props.models.data
  const datasetList = props.datasets.data
  const hasModels = props.models.total === 0 ? false : true
  const hasDatasets = props.datasets.total === 0 ? false : true
  const membersList = ref(props.members)

  const resetMemberList = (newMembers, userRole) => {
    newMembers.forEach(member => member.role = userRole)
    const newMembersList = membersList.value.concat(newMembers).reverse()
    const uniqNewMembersList = newMembersList.filter((member, index, self) => {
      return index === self.findIndex((nestedMember) => nestedMember.name === member.name);
    });
    membersList.value = uniqNewMembersList.reverse()
  }

  onMounted(() => {
  })
</script>