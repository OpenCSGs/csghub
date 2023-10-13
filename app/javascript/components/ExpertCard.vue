<template>
  <div class="flex flex-col p-[16px] max-w-[410px] max-h-[255px] bg-white gap-y-[16px] justify-between rounded-lg border">
    <div class="flex gap-x-[16px]">
      <div>
        <el-avatar :size="56" :src="avatar">
        </el-avatar>
      </div>
      <div class="flex flex-col w-full gap-y-[8px]">
        <div>
          <p class="text-xl">{{ name }}</p>
        </div>
        <div class="flex gap-x-[4px] text-sm text-[#606266]">
          <p>{{ type }}</p>
          <div class="pt-[2px]">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                  d="M6 8.00033L7.33333 9.33366L10.3333 6.33366M5.40073 1.82222L4.85055 2.06674C3.81875 2.52531 3.30286 2.7546 2.92457 3.11703C2.59019 3.4374 2.33451 3.83082 2.17756 4.2665C2 4.75938 2 5.32393 2 6.45304V7.90846C2 9.16075 2 9.78689 2.1726 10.3552C2.32541 10.8584 2.57592 11.3265 2.90982 11.7327C3.28697 12.1916 3.80796 12.5389 4.84992 13.2336L5.33744 13.5586C6.29971 14.2001 6.78085 14.5209 7.30088 14.6455C7.76046 14.7556 8.23954 14.7556 8.69912 14.6455C9.21915 14.5209 9.70029 14.2001 10.6626 13.5586L11.1501 13.2336C12.192 12.5389 12.713 12.1916 13.0902 11.7327C13.4241 11.3265 13.6746 10.8584 13.8274 10.3552C14 9.78689 14 9.16075 14 7.90846V6.45304C14 5.32393 14 4.75938 13.8224 4.2665C13.6655 3.83082 13.4098 3.4374 13.0754 3.11703C12.6971 2.7546 12.1812 2.52531 11.1495 2.06674L10.5993 1.82222C9.6421 1.39681 9.16351 1.1841 8.66604 1.1001C8.22513 1.02564 7.77487 1.02564 7.33396 1.1001C6.83649 1.1841 6.3579 1.39681 5.40073 1.82222Z"
                  stroke="#303133" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="flex h-[20px] w-[16px] pt-[2px]">
            <div class="w-6/12 border-r-2 border-solid border-[#DCDFE6]"></div>
          </div>
          <p>咨询价格</p>
        </div>
      </div>
    </div>
    <div class="flex gap-x-[7px] text-xs leading-[20px] text-[#606266]">
      <div class="border rounded px-[8px]" v-for="tag in Tags" :key="tag">
        <span>{{ tag }}</span>
      </div>
    </div>
    <div>
      <p class="h-[40px] leading-[23px] text-[#606266] text-sm font-semibold">{{ title }}</p>
      <el-popover
          :width="378"
          trigger="hover"
          :placement="bottom"
          effect="dark"
          :content="desc"
      >
        <template #reference>
          <p class="h-[40px] leading-[23px] text-[#606266] text-sm overflow-hidden overflow-ellipsis line-clamp-2 cursor-pointer">
            {{ desc }}
          </p>
        </template>
      </el-popover>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    name: String,
    type: String,
    tags: String,
    title: String,
    desc: String,
    avatar: String
  },

  data() {
    return {
      Tags: this.tags ? this.tags.split(",") : []
    };
  },

  components: {},

  mounted() {}
}
</script>

