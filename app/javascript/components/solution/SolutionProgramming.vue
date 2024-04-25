<template>
  <div class="Programming py-[96px] text-center w-full bg-white">
    <div class="max-w-[1280px] m-auto">
      <div class="flex flex-col md:px-[20px] items-center mb-[64px]">
        <div class="text-[36px] leading-[44px] text-[#101828]">{{ $t('solution.programming.headline') }}</div>
        <div class="my-[20px] max-w-[768px] text-[20px] text-[#606266] leading-[30px] font-light">{{ $t('solution.programming.desc') }}</div>
        <a href="https://portal.opencsg.com/spaces/OpenCSG/OpenCSG-DeepSeek-Code-1.3B" target="_blank"
          class="cursor-pointer mb-[48px] inline-block py-[16px] px-[22px] text-[18px] leading-[28px] text-[#FFF] bg-[#3250BD] border border-[#3250BD] rounded-[8px]"
        >
          {{ $t("solution.programming.demo") }}
        </a>
      </div>
      <div class="px-[32px] flex gap-[64px] md:flex-col">
        <div class="flex flex-col gap-[48px]">
          <div class="flex flex-col gap-[20px] items-start">
            <div class="px-[12px] py-[12px] rounded-[40px] bg-[#ACBDFF] border-[8px] border-[#CED8FF]">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M22 9H2M14 17.5L16.5 15L14 12.5M10 12.5L7.5 15L10 17.5M2 7.8L2 16.2C2 17.8802 2 18.7202 2.32698 19.362C2.6146 19.9265 3.07354 20.3854 3.63803 20.673C4.27976 21 5.11984 21 6.8 21H17.2C18.8802 21 19.7202 21 20.362 20.673C20.9265 20.3854 21.3854 19.9265 21.673 19.362C22 18.7202 22 17.8802 22 16.2V7.8C22 6.11984 22 5.27977 21.673 4.63803C21.3854 4.07354 20.9265 3.6146 20.362 3.32698C19.7202 3 18.8802 3 17.2 3L6.8 3C5.11984 3 4.27976 3 3.63803 3.32698C3.07354 3.6146 2.6146 4.07354 2.32698 4.63803C2 5.27976 2 6.11984 2 7.8Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
            <div class="flex flex-col gap-[8px] text-left">
              <div class="text-[20px] text-[#101828] leading-[30px]">{{ $t('solution.programming.part1') }}</div>
              <div class="text-[16px] text-[##75467] leading-[24px] font-light">{{ $t('solution.programming.part1-') }}</div>
            </div>
          </div>
          <div class="flex flex-col gap-[20px] items-start">
            <div class="px-[12px] py-[12px] rounded-[40px] bg-[#ACBDFF] border-[8px] border-[#CED8FF]">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M14 17L17 14L14 11M10 7L7 10L10 13M7.8 21H16.2C17.8802 21 18.7202 21 19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362C21 18.7202 21 17.8802 21 16.2V7.8C21 6.11984 21 5.27976 20.673 4.63803C20.3854 4.07354 19.9265 3.6146 19.362 3.32698C18.7202 3 17.8802 3 16.2 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
            <div class="flex flex-col gap-[8px] text-left">
              <div class="text-[20px] text-[#101828] leading-[30px]">{{ $t('solution.programming.part2') }}</div>
              <div class="text-[16px] text-[##75467] leading-[24px] font-light">{{ $t('solution.programming.part2-') }}</div>
            </div>
          </div>
        </div>
        <div class="min-w-[461px] min-h-[461px] md:min-w-full codeOptimizationBg">
        </div>
        <div class="flex flex-col gap-[48px]">
          <div class="flex flex-col gap-[20px] items-start">
            <div class="px-[12px] py-[12px] rounded-[40px] bg-[#ACBDFF] border-[8px] border-[#CED8FF]">
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none"><path d="M10.5 15L7.42474 18.1137C6.99579 18.548 6.78131 18.7652 6.59695 18.7805C6.43701 18.7938 6.28042 18.7295 6.17596 18.6076C6.05556 18.4672 6.05556 18.162 6.05556 17.5515V15.9916C6.05556 15.444 5.60707 15.0477 5.0652 14.9683V14.9683C3.75374 14.7762 2.72378 13.7463 2.53168 12.4348C2.5 12.2186 2.5 11.9605 2.5 11.4444V6.8C2.5 5.11984 2.5 4.27976 2.82698 3.63803C3.1146 3.07354 3.57354 2.6146 4.13803 2.32698C4.77976 2 5.61984 2 7.3 2H14.7C16.3802 2 17.2202 2 17.862 2.32698C18.4265 2.6146 18.8854 3.07354 19.173 3.63803C19.5 4.27976 19.5 5.11984 19.5 6.8V11M19.5 22L17.3236 20.4869C17.0177 20.2742 16.8647 20.1678 16.6982 20.0924C16.5504 20.0255 16.3951 19.9768 16.2356 19.9474C16.0558 19.9143 15.8695 19.9143 15.4969 19.9143H13.7C12.5799 19.9143 12.0198 19.9143 11.592 19.6963C11.2157 19.5046 10.9097 19.1986 10.718 18.8223C10.5 18.3944 10.5 17.8344 10.5 16.7143V14.2C10.5 13.0799 10.5 12.5198 10.718 12.092C10.9097 11.7157 11.2157 11.4097 11.592 11.218C12.0198 11 12.5799 11 13.7 11H19.3C20.4201 11 20.9802 11 21.408 11.218C21.7843 11.4097 22.0903 11.7157 22.282 12.092C22.5 12.5198 22.5 13.0799 22.5 14.2V16.9143C22.5 17.8462 22.5 18.3121 22.3478 18.6797C22.1448 19.1697 21.7554 19.5591 21.2654 19.762C20.8978 19.9143 20.4319 19.9143 19.5 19.9143V22Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
            <div class="flex flex-col gap-[8px] text-left">
              <div class="text-[20px] text-[#101828] leading-[30px]">{{ $t('solution.programming.part3') }}</div>
              <div class="text-[16px] text-[##75467] leading-[24px] font-light">{{ $t('solution.programming.part3-') }}</div>
            </div>
          </div>
          <div class="flex flex-col gap-[20px] items-start">
            <div class="px-[12px] py-[12px] rounded-[40px] bg-[#ACBDFF] border-[8px] border-[#CED8FF]">
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none"><path d="M5.5 18.5C5.5 18.9644 5.5 19.1966 5.52567 19.3916C5.7029 20.7378 6.76222 21.7971 8.10842 21.9743C8.30337 22 8.53558 22 9 22H16.7C18.3802 22 19.2202 22 19.862 21.673C20.4265 21.3854 20.8854 20.9265 21.173 20.362C21.5 19.7202 21.5 18.8802 21.5 17.2V9.98822C21.5 9.25445 21.5 8.88757 21.4171 8.5423C21.3436 8.2362 21.2224 7.94356 21.0579 7.67515C20.8724 7.3724 20.613 7.11296 20.0941 6.59411L16.9059 3.40589C16.387 2.88703 16.1276 2.6276 15.8249 2.44208C15.5564 2.27759 15.2638 2.15638 14.9577 2.08289C14.6124 2 14.2455 2 13.5118 2H9C8.53558 2 8.30337 2 8.10842 2.02567C6.76222 2.2029 5.7029 3.26222 5.52567 4.60842C5.5 4.80337 5.5 5.03558 5.5 5.5M9.5 14.5L12 12L9.5 9.5M5.5 9.5L3 12L5.5 14.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
            <div class="flex flex-col gap-[8px] text-left">
              <div class="text-[20px] text-[#101828] leading-[30px]">{{ $t('solution.programming.part4') }}</div>
              <div class="text-[16px] text-[##75467] leading-[24px] font-light">{{ $t('solution.programming.part4-') }}</div>
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
    return {};
  },

  components: {},

  mounted() {},
};
</script>
<style scoped>
  .codeOptimizationBg{
    background-image: url('../images/codeOptimization.png');
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
  }
</style>
