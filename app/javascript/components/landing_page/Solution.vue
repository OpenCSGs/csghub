<template>
    <div class="landing_solution text-center w-full banner py-[96px] px-[80px] md:px-[16px]">
      <div class="sm:w-full max-w-[1280px] m-auto">
        <div class="mb-[20px] pb-[33px] bg-contain bg-left-top bg-no-repeat bg-[url('images/landing/solution_bg.png')] md:bg-none">
          <div class="text-[16px] leading-[24px] md:text-[14px] md:leading-[20px] text-[#223B99] mb-[8px]">解决方案</div>
          <div class="text-[36px] leading-[44px] md:text-[30px] md:leading-[38px] text-[#101828] mb-[48px]">重新构想您的业务<br class="hidden md:block" />解决方案</div>
          <div class="flex justify-center gap-[16px]">
            <el-input v-model="inputValue" class="max-w-[300px] md:max-w-[225px]" placeholder="Enter Your Email">
              <template #prefix>
                <div class="px-[8px] py-[8px] bg-[#fff] rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M2.65328 1.86331C3.36632 1.5 4.29974 1.5 6.16659 1.5H9.83326C11.7001 1.5 12.6335 1.5 13.3466 1.86331C13.9738 2.18289 14.4837 2.69282 14.8033 3.32003C15.1666 4.03307 15.1666 4.96649 15.1666 6.83333V9.16667C15.1666 11.0335 15.1666 11.9669 14.8033 12.68C14.4837 13.3072 13.9738 13.8171 13.3466 14.1367C12.6335 14.5 11.7001 14.5 9.83325 14.5H6.16658C4.29974 14.5 3.36632 14.5 2.65328 14.1367C2.02608 13.8171 1.51614 13.3072 1.19656 12.68C0.833252 11.9669 0.833252 11.0335 0.833252 9.16667V6.83333C0.833252 4.96649 0.833252 4.03307 1.19656 3.32003C1.51614 2.69282 2.02608 2.18289 2.65328 1.86331ZM4.27726 4.91731C4.04749 4.76413 3.73706 4.82622 3.58388 5.05598C3.43071 5.28575 3.49279 5.59618 3.72256 5.74936L4.38923 6.1938L4.4668 6.24553L4.46681 6.24553C5.46567 6.91159 6.06008 7.30796 6.70174 7.50128C7.54839 7.75637 8.45143 7.75637 9.29808 7.50128C9.93974 7.30796 10.5342 6.91159 11.533 6.24553L11.6106 6.1938L12.2773 5.74936C12.507 5.59618 12.5691 5.28575 12.4159 5.05598C12.2628 4.82622 11.9523 4.76413 11.7226 4.91731L11.0559 5.36175C9.95571 6.09521 9.49101 6.39875 9.0096 6.5438C8.35109 6.7422 7.64873 6.7422 6.99022 6.5438C6.5088 6.39875 6.04411 6.09521 4.94393 5.36175L4.27726 4.91731Z" fill="#4D6AD6"/></svg>
                </div>
              </template>
            </el-input>
            <div class="md:grow md:w-[60px] md:py-[8px] md:px-[16px] px-[22px] py-[8px] rounded-[40px] text-[#FFF] bg-[#4D6AD6] border border-[32508D] cursor-pointer">
              提交咨询
            </div>
          </div>
        </div>
        <div class="flex overflow-hidden items-center">
          <div class="landing_swiperBox flex gap-[24px]">
            <div v-for="(item,indx) in tags" :key=index class="flex gap-[8px] items-center px-[8px] py-[4px] rounded-[8px] border border-[#EAEDF0] bg-[#F9FAFB] text-[16px] leading-[24px]">
              <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none"><path d="M6.83325 6.66732C6.83325 6.85141 6.68401 7.00065 6.49992 7.00065C6.31582 7.00065 6.16659 6.85141 6.16659 6.66732M6.83325 6.66732C6.83325 6.48322 6.68401 6.33398 6.49992 6.33398C6.31582 6.33398 6.16659 6.48322 6.16659 6.66732M6.83325 6.66732H6.16659M10.8333 6.66732C10.8333 6.85141 10.684 7.00065 10.4999 7.00065C10.3158 7.00065 10.1666 6.85141 10.1666 6.66732M10.8333 6.66732C10.8333 6.48322 10.684 6.33398 10.4999 6.33398C10.3158 6.33398 10.1666 6.48322 10.1666 6.66732M10.8333 6.66732H10.1666M11.1667 10.0007C10.5586 10.8103 9.59038 11.334 8.49984 11.334C7.40929 11.334 6.44106 10.8103 5.83293 10.0007M8.49992 14.6673V14.6673C12.1818 14.6673 15.1666 11.6826 15.1666 8.00065V8.00065C15.1666 4.31875 12.1818 1.33398 8.49992 1.33398V1.33398C4.81802 1.33398 1.83325 4.31875 1.83325 8.00065V8.00065C1.83325 11.6826 4.81802 14.6673 8.49992 14.6673Z" stroke="#4D6AD6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
              {{item}}
            </div>
          </div>
          <div class="landing_swiperBox flex gap-[24px]">
            <div v-for="(item,indx) in tags" :key=index class="flex gap-[8px] items-center px-[8px] py-[4px] rounded-[8px] border border-[#EAEDF0] bg-[#F9FAFB] text-[16px] leading-[24px]">
              <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none"><path d="M6.83325 6.66732C6.83325 6.85141 6.68401 7.00065 6.49992 7.00065C6.31582 7.00065 6.16659 6.85141 6.16659 6.66732M6.83325 6.66732C6.83325 6.48322 6.68401 6.33398 6.49992 6.33398C6.31582 6.33398 6.16659 6.48322 6.16659 6.66732M6.83325 6.66732H6.16659M10.8333 6.66732C10.8333 6.85141 10.684 7.00065 10.4999 7.00065C10.3158 7.00065 10.1666 6.85141 10.1666 6.66732M10.8333 6.66732C10.8333 6.48322 10.684 6.33398 10.4999 6.33398C10.3158 6.33398 10.1666 6.48322 10.1666 6.66732M10.8333 6.66732H10.1666M11.1667 10.0007C10.5586 10.8103 9.59038 11.334 8.49984 11.334C7.40929 11.334 6.44106 10.8103 5.83293 10.0007M8.49992 14.6673V14.6673C12.1818 14.6673 15.1666 11.6826 15.1666 8.00065V8.00065C15.1666 4.31875 12.1818 1.33398 8.49992 1.33398V1.33398C4.81802 1.33398 1.83325 4.31875 1.83325 8.00065V8.00065C1.83325 11.6826 4.81802 14.6673 8.49992 14.6673Z" stroke="#4D6AD6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
              {{item}}
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
      tags:['1Lorem','Lorem','Lorem','Lorem','Lorem','Lorem','Lorem','Lorem','Lorem','Lorem','Lorem5']
    };
  },

  components: {},

  mounted() {},
};
</script>
<style>
@keyframes marqueeScroll {
  0% {
    transform: translate(0, 0);
  }

  100% {
    transform: translate(-100%, 0);
  }
}
.landing_swiperBox {
  display: flex;
  animation: marqueeScroll 50s linear infinite forwards;
  animation-delay: 0s;
  animation-direction: normal;
  animation-play-state: running;
}
.landing_solution .el-input__wrapper{
  border-radius: 40px;
  padding:8px 8px;
  height:40px;
}
</style>
