<template>
  <div class="flex flex-col py-[96px] md:py-[64px] text-left">
    <div class="max-w-[1280px] m-auto md:px-[16px] px-[32px]">
      <div class="text-[16px] leading-[24px] md:text-[14px] md:leading-[20px] text-[#223B99] mb-[8px]">加入我们</div>
      <div class="text-[36px] leading-[44px] md:text-[30px] md:leading-[38px] text-[#101828] mb-[20px]">我们正在寻找优秀的人才</div>
      <div class="text-[20px] leading-[30px] md:text-[18px] md:leading-[28px] text-[#475467] mb-[64px] md:mb-[48px]" >我们是一支分布在全国的分布式远程团队。加入我们吧</div>
      <div class="grid grid-cols-2  gap-x-[64px] gap-y-[48px] mb-[64px] md:grid-cols-1 text-left">
        <div class="w-[578px] md:w-full flex flex-col pt-[24px] border-t border-t-[1px] border-[#EAECF0]"
         v-for="(item,index) in data" :key="index">
          <div class=" flex gap-[8px] mb-[8px]">
            <div class="text-[#101828] text-[18px] leading-[28px]">{{item.name}}</div>
            <div class="px-[10px] text-[14px] leading-[20px] border border-[#B2DDFF] bg-[#EFF8FF] rounded-[16px] flex items-center gap-[8px]">
              <div class="rounded-full w-[8px] h-[8px] bg-[#2E90FA]"></div>
              {{item.tag}}
            </div>
          </div>
          <div class="text-[16px] text-[#475467] leading-[24px] font-light mb-[24px] md:mb-[16px]">
            {{item.desc}}
          </div>
          <div class="text-[16px] text-[#475467] leading-[24px] flex gap-[20px]">
            <div class="flex gap-[8px]">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M9.99992 10.416C11.3806 10.416 12.4999 9.29673 12.4999 7.91602C12.4999 6.5353 11.3806 5.41602 9.99992 5.41602C8.61921 5.41602 7.49992 6.5353 7.49992 7.91602C7.49992 9.29673 8.61921 10.416 9.99992 10.416Z" stroke="#98A2B3" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/><path d="M9.99992 18.3327C11.6666 14.9993 16.6666 12.8479 16.6666 8.33268C16.6666 4.65078 13.6818 1.66602 9.99992 1.66602C6.31802 1.66602 3.33325 4.65078 3.33325 8.33268C3.33325 12.8479 8.33325 14.9993 9.99992 18.3327Z" stroke="#98A2B3" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/></svg>
              {{item.remote}}
            </div>
            <div class="flex gap-[8px]">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><g clip-path="url(#clip0_1817_4573)"><path d="M10.0001 4.99935V9.99935L13.3334 11.666M18.3334 9.99935C18.3334 14.6017 14.6025 18.3327 10.0001 18.3327C5.39771 18.3327 1.66675 14.6017 1.66675 9.99935C1.66675 5.39698 5.39771 1.66602 10.0001 1.66602C14.6025 1.66602 18.3334 5.39698 18.3334 9.99935Z" stroke="#98A2B3" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/></g><defs><clipPath id="clip0_1817_4573"><rect width="20" height="20" fill="white"/></clipPath></defs></svg>
              {{item.time}}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props: {},
  
    data() {
      return {
        data:[{name:'Product Designer',tag:'Design',desc:'We’re looking for a mid-level product designer to join our team.',remote:'Remote',time:'Full-time'},
              {name:'Engineering Manager',tag:'Software Development',desc:'We’re looking for a mid-level product designer to join our team.',remote:'Remote',time:'Full-time'},
              {name:'Customer Success Manager',tag:'Careers',desc:'We’re looking for a mid-level product designer to join our team.',remote:'Remote',time:'Full-time'},
              {name:'Account Executive',tag:'Sales',desc:'We’re looking for a mid-level product designer to join our team.',remote:'Remote',time:'Full-time'},
              {name:'SEO Marketing Manager',tag:'Marketing',desc:'We’re looking for a mid-level product designer to join our team.',remote:'Remote',time:'Full-time'},
              {name:'UX Researcher',tag:'Design',desc:'We’re looking for a mid-level product designer to join our team.',remote:'Remote',time:'Full-time'}]
      };
    },
  
    components: {},
  
    mounted() {},
  };
  </script>
  <style scoped></style>
  