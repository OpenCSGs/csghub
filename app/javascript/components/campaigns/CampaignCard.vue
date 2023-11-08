<template>
  <a href="#" class="w-full block rounded-lg p-6 bg-white mt-4">
    <div class="flex items-center justify-between mb-1">
      <div class="text-[#303133] text-[20px] leading-7">
        {{ name }}
      </div>
      <div class="flex items-center text-[#909399]">
        <div class="flex items-center mr-2">
          <svg class="mr-1" xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none"><path d="M14.6668 8.14388C14.6668 9.81055 12.6668 13.4772 8.00016 13.4772C3.3335 13.4772 1.3335 9.81055 1.3335 8.14388C1.3335 6.47721 3.3335 2.81055 8.00016 2.81055C12.6668 2.81055 14.6668 6.47721 14.6668 8.14388Z" stroke="#909399" stroke-linecap="round"/><path d="M10.0002 8.14388C10.0002 9.24845 9.10473 10.1439 8.00016 10.1439C6.89559 10.1439 6.00016 9.24845 6.00016 8.14388C6.00016 7.03931 6.89559 6.14388 8.00016 6.14388C9.10473 6.14388 10.0002 7.03931 10.0002 8.14388Z" stroke="#909399" stroke-linecap="round"/></svg>
          {{ pageviews }}
        </div>
        <div class="flex items-center">
          <svg class="mr-1" xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none"><path d="M2.6665 12.6785C2.6665 10.9112 4.09919 9.47852 5.8665 9.47852H10.1332C11.9005 9.47852 13.3332 10.9112 13.3332 12.6785V12.6785C13.3332 13.8567 12.378 14.8118 11.1998 14.8118H4.79984C3.62163 14.8118 2.6665 13.8567 2.6665 12.6785V12.6785Z" stroke="#909399" stroke-linecap="round" stroke-linejoin="round"/><path d="M10.6665 4.14518C10.6665 5.61794 9.4726 6.81185 7.99984 6.81185C6.52708 6.81185 5.33317 5.61794 5.33317 4.14518C5.33317 2.67242 6.52708 1.47852 7.99984 1.47852C9.4726 1.47852 10.6665 2.67242 10.6665 4.14518Z" stroke="#909399" stroke-linecap="round" stroke-linejoin="round"/></svg>
          {{ leadsCount }}
        </div>
      </div>
    </div>
    <div class="text-[#909399] text-[14px] leading-[22px] mb-1">
      {{ startDate }} ~ {{ endDate }}
    </div>
    <div class="text-[#303133] text-[14px] leading-[22px] w-[60%] overflow-hidden overflow-ellipsis line-clamp-1 mb-10">
      {{ content }}
    </div>
    <div class="flex items-center justify-between text-[14px] leading-[22px]">
      <div class="text-[#303133]">
        举办方：
        <a :href="organizerWebsite" class="text-[#409EFF]" target="_blank">
          {{ organizer }}
        </a>
      </div>
      <a :href="'/campaigns/' + campaignId" class="text-white font-semibold w-[88px] h-[32px] flex items-center justify-center bg-[#409EFF] rounded-[100px]">
        了解更多
      </a>
    </div>
  </a>
</template>

<script>
  export default {
    props: {
      campaignId: Number,
      name: String,
      startDate: String,
      endDate: String,
      content: String,
      organizer: String,
      organizerWebsite: String,
      pageviews: Number,
      leadsCount: Number,
      formUrl: String
    },
    mounted() {
      console.log(this.name)
      console.log(this.formUrl)
    }
  }
</script>
