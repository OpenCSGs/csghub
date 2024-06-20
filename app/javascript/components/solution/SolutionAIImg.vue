<template>
  <div class="AIImg py-[96px] text-center w-full bg-white">
    <div class="max-w-[1280px] m-auto">
      <div class="flex flex-col md:px-[20px] items-center mb-[32px]">
        <div class="text-[36px] leading-[44px] text-[#101828]">
          {{ $t('solution.AIImg.headline') }}
        </div>
        <div
          class="my-[20px] max-w-[768px] text-[20px] text-[#606266] leading-[30px] font-light"
        >
          {{ $t('solution.AIImg.desc') }}
        </div>
        <div
          @click="toDemoPage"
          class="cursor-pointer mb-[48px] inline-block py-[16px] px-[22px] text-[18px] leading-[28px] text-[#FFF] bg-[#3250BD] border border-[#3250BD] rounded-[8px]"
        >
          {{ $t('solution.AIImg.demo') }}
        </div>
        <!-- coming soon -->
        <!-- <div class="flex gap-[16px]">
          <div class="cursor-pointer py-[16px] px-[22px] flex text-[14px] leading-[20px] text-[#344054] gap-[6px] border border-[#D0D5DD] rounded-[8px]"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><g clip-path="url(#clip0_661_4)"><path d="M9.99984 18.3337C14.6022 18.3337 18.3332 14.6027 18.3332 10.0003C18.3332 5.39795 14.6022 1.66699 9.99984 1.66699C5.39746 1.66699 1.6665 5.39795 1.6665 10.0003C1.6665 14.6027 5.39746 18.3337 9.99984 18.3337Z" stroke="#344054" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M7.9165 7.47144C7.9165 7.0737 7.9165 6.87483 7.99962 6.76381C8.07206 6.66705 8.18293 6.60652 8.30349 6.59791C8.44182 6.58803 8.60911 6.69557 8.94368 6.91065L12.8775 9.43954C13.1678 9.62618 13.313 9.71949 13.3631 9.83815C13.4069 9.94183 13.4069 10.0588 13.3631 10.1625C13.313 10.2812 13.1678 10.3745 12.8775 10.5611L8.94368 13.09C8.60911 13.3051 8.44182 13.4126 8.30349 13.4027C8.18293 13.3941 8.07206 13.3336 7.99962 13.2368C7.9165 13.1258 7.9165 12.927 7.9165 12.5292V7.47144Z" stroke="#344054" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></g><defs><clipPath id="clip0_661_4"><rect width="20" height="20" fill="white"/></clipPath></defs></svg>
            产品演示
          </div>
        </div> -->
      </div>

      <div class="flex flex-col gap-[32px] mb-[64px]">
        <div
          class="flex gap-[32px] md:pl-[10px] flex-nowrap w-full overflow-hidden"
        >
          <div
            class="min-w-[360px] h-[480px] bg-[#ECBF55] transition-transform duration-300 ease"
            v-for="(item, index) in srcList"
            :style="{ transform: `translateX(${translateValue}px)` }"
          >
            <el-image
              style="width: 360px; height: 480px"
              :src="item"
              :initial-index="index"
              :preview-teleported="true"
              :preview-src-list="srcList"
            />
          </div>
        </div>
        <div class="flex gap-[32px]">
          <div
            class="cursor-pointer py-[16px] px-[16px] rounded-[28px] border border-[#EAECF0]"
            @click="prevSlide"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M19 12H5M5 12L12 19M5 12L12 5"
                stroke="#667085"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <div
            class="cursor-pointer py-[16px] px-[16px] rounded-[28px] border border-[#EAECF0]"
            @click="nextSlide"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M5 12H19M19 12L12 5M19 12L12 19"
                stroke="#667085"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-3 gap-[32px] md:grid-cols-1 px-[20px]">
        <div
          class="flex flex-col items-center gap-[20px] md:mb-[0px] mb-[96px]"
        >
          <div
            class="px-[12px] py-[12px] rounded-[40px] bg-[#ACBDFF] border-[8px] border-[#CED8FF]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M12 2H11.5V2C8.234 2 6.601 2 5.34627 2.61876C4.16167 3.20294 3.20294 4.16167 2.61876 5.34627C2 6.601 2 8.234 2 11.5V12.4C2 15.7603 2 17.4405 2.65396 18.7239C3.2292 19.8529 4.14708 20.7708 5.27606 21.346C6.55953 22 8.23969 22 11.6 22H12.5C15.766 22 17.399 22 18.6537 21.3812C19.8383 20.7971 20.7971 19.8383 21.3812 18.6537C22 17.399 22 15.766 22 12.5V12.5V12M21.5 17.6875L20.0752 16.2627C19.2832 15.4707 18.8872 15.0747 18.4305 14.9263C18.0289 14.7958 17.5962 14.7958 17.1945 14.9263C16.7378 15.0747 16.3418 15.4707 15.5498 16.2627L14.4861 17.3264M2.5 18.5L6.77044 14.2296C7.55197 13.448 7.94273 13.0573 8.39428 12.9083C8.79155 12.7773 9.21991 12.7741 9.61907 12.8993C10.0728 13.0415 10.4693 13.4265 11.2623 14.1964L14.4861 17.3264M14.4861 17.3264L18.5 21.3403M14 10L14.12 9.40013C14.2612 8.69387 14.3319 8.34073 14.461 8.01144C14.5757 7.71916 14.7243 7.44139 14.9039 7.18387C15.1063 6.89374 15.3609 6.63909 15.8702 6.1298L18 4C18.5523 3.44771 19.4477 3.44772 20 4V4C20.5523 4.55228 20.5523 5.44771 20 6L17.8702 8.12979C17.3609 8.63909 17.1063 8.89374 16.8161 9.09608C16.5586 9.27568 16.2808 9.42434 15.9886 9.53899C15.6593 9.66815 15.3061 9.73877 14.5999 9.88003L14 10Z"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <div class="flex flex-col gap-[8px]">
            <div class="text-[20px] text-[#101828] leading-[30px]">
              {{ $t('solution.AIImg.part1') }}
            </div>
            <div class="text-[16px] text-[##75467] leading-[24px] font-light">
              {{ $t('solution.AIImg.part1-') }}
            </div>
          </div>
        </div>
        <div class="flex flex-col items-center gap-[20px]">
          <div
            class="px-[12px] py-[12px] rounded-[40px] bg-[#ACBDFF] border-[8px] border-[#CED8FF]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M19 8V2M16 5H22M22 12V17.2C22 18.8802 22 19.7202 21.673 20.362C21.3854 20.9265 20.9265 21.3854 20.362 21.673C19.7202 22 18.8802 22 17.2 22H6.8C5.11984 22 4.27976 22 3.63803 21.673C3.07354 21.3854 2.6146 20.9265 2.32698 20.362C2 19.7202 2 18.8802 2 17.2V6.8C2 5.11984 2 4.27976 2.32698 3.63803C2.6146 3.07354 3.07354 2.6146 3.63803 2.32698C4.27976 2 5.11984 2 6.8 2H12M2.14574 19.9263C2.61488 18.2386 4.1628 17 6 17H13C13.9293 17 14.394 17 14.7804 17.0769C16.3671 17.3925 17.6075 18.6329 17.9231 20.2196C18 20.606 18 21.0707 18 22M14 9.5C14 11.7091 12.2091 13.5 10 13.5C7.79086 13.5 6 11.7091 6 9.5C6 7.29086 7.79086 5.5 10 5.5C12.2091 5.5 14 7.29086 14 9.5Z"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <div class="flex flex-col gap-[8px]">
            <div class="text-[20px] text-[#101828] leading-[30px]">
              {{ $t('solution.AIImg.part2') }}
            </div>
            <div class="text-[16px] text-[##75467] leading-[24px] font-light">
              {{ $t('solution.AIImg.part2-') }}
            </div>
          </div>
        </div>
        <div class="flex flex-col items-center gap-[20px]">
          <div
            class="px-[12px] py-[12px] rounded-[40px] bg-[#ACBDFF] border-[8px] border-[#CED8FF]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M16 5L18 7L22 3M12.5 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21H17C17.93 21 18.395 21 18.7765 20.8978C19.8117 20.6204 20.6204 19.8117 20.8978 18.7765C21 18.395 21 17.93 21 17M10.5 8.5C10.5 9.60457 9.60457 10.5 8.5 10.5C7.39543 10.5 6.5 9.60457 6.5 8.5C6.5 7.39543 7.39543 6.5 8.5 6.5C9.60457 6.5 10.5 7.39543 10.5 8.5ZM14.99 11.9181L6.53115 19.608C6.05536 20.0406 5.81747 20.2568 5.79643 20.4442C5.77819 20.6066 5.84045 20.7676 5.96319 20.8755C6.10478 21 6.42628 21 7.06929 21H16.456C17.8951 21 18.6147 21 19.1799 20.7582C19.8894 20.4547 20.4547 19.8894 20.7582 19.1799C21 18.6147 21 17.8951 21 16.456C21 15.9717 21 15.7296 20.9471 15.5042C20.8805 15.2208 20.753 14.9554 20.5733 14.7264C20.4303 14.5442 20.2412 14.3929 19.8631 14.0905L17.0658 11.8527C16.6874 11.5499 16.4982 11.3985 16.2898 11.3451C16.1061 11.298 15.9129 11.3041 15.7325 11.3627C15.5279 11.4291 15.3486 11.5921 14.99 11.9181Z"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <div class="flex flex-col gap-[8px]">
            <div class="text-[20px] text-[#101828] leading-[30px]">
              {{ $t('solution.AIImg.part3') }}
            </div>
            <div class="text-[16px] text-[##75467] leading-[24px] font-light">
              {{ $t('solution.AIImg.part3-') }}
            </div>
          </div>
        </div>
        <div class="flex flex-col items-center gap-[20px]">
          <div
            class="px-[12px] py-[12px] rounded-[40px] bg-[#ACBDFF] border-[8px] border-[#CED8FF]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M10 15L6.92474 18.1137C6.49579 18.548 6.28131 18.7652 6.09695 18.7805C5.93701 18.7938 5.78042 18.7295 5.67596 18.6076C5.55556 18.4672 5.55556 18.162 5.55556 17.5515V15.9916C5.55556 15.444 5.10707 15.0477 4.5652 14.9683V14.9683C3.25374 14.7762 2.22378 13.7463 2.03168 12.4348C2 12.2186 2 11.9605 2 11.4444V6.8C2 5.11984 2 4.27976 2.32698 3.63803C2.6146 3.07354 3.07354 2.6146 3.63803 2.32698C4.27976 2 5.11984 2 6.8 2H14.2C15.8802 2 16.7202 2 17.362 2.32698C17.9265 2.6146 18.3854 3.07354 18.673 3.63803C19 4.27976 19 5.11984 19 6.8V11M19 22L16.8236 20.4869C16.5177 20.2742 16.3647 20.1678 16.1982 20.0924C16.0504 20.0255 15.8951 19.9768 15.7356 19.9474C15.5558 19.9143 15.3695 19.9143 14.9969 19.9143H13.2C12.0799 19.9143 11.5198 19.9143 11.092 19.6963C10.7157 19.5046 10.4097 19.1986 10.218 18.8223C10 18.3944 10 17.8344 10 16.7143V14.2C10 13.0799 10 12.5198 10.218 12.092C10.4097 11.7157 10.7157 11.4097 11.092 11.218C11.5198 11 12.0799 11 13.2 11H18.8C19.9201 11 20.4802 11 20.908 11.218C21.2843 11.4097 21.5903 11.7157 21.782 12.092C22 12.5198 22 13.0799 22 14.2V16.9143C22 17.8462 22 18.3121 21.8478 18.6797C21.6448 19.1697 21.2554 19.5591 20.7654 19.762C20.3978 19.9143 19.9319 19.9143 19 19.9143V22Z"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <div class="flex flex-col gap-[8px]">
            <div class="text-[20px] text-[#101828] leading-[30px]">
              {{ $t('solution.AIImg.part4') }}
            </div>
            <div class="text-[16px] text-[##75467] leading-[24px] font-light">
              {{ $t('solution.AIImg.part4-') }}
            </div>
          </div>
        </div>
        <div class="flex flex-col items-center gap-[20px]">
          <div
            class="px-[12px] py-[12px] rounded-[40px] bg-[#ACBDFF] border-[8px] border-[#CED8FF]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M12.9999 2L4.09332 12.6879C3.74451 13.1064 3.57011 13.3157 3.56744 13.4925C3.56512 13.6461 3.63359 13.7923 3.75312 13.8889C3.89061 14 4.16304 14 4.7079 14H11.9999L10.9999 22L19.9064 11.3121C20.2552 10.8936 20.4296 10.6843 20.4323 10.5075C20.4346 10.3539 20.3661 10.2077 20.2466 10.1111C20.1091 10 19.8367 10 19.2918 10H11.9999L12.9999 2Z"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <div class="flex flex-col gap-[8px]">
            <div class="text-[20px] text-[#101828] leading-[30px]">
              {{ $t('solution.AIImg.part5') }}
            </div>
            <div class="text-[16px] text-[##75467] leading-[24px] font-light">
              {{ $t('solution.AIImg.part5-') }}
            </div>
          </div>
        </div>
        <div class="flex flex-col items-center gap-[20px]">
          <div
            class="px-[12px] py-[12px] rounded-[40px] bg-[#ACBDFF] border-[8px] border-[#CED8FF]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M21.4155 15.3411C18.5924 17.3495 14.8895 17.5726 11.877 16M2.58445 8.65889C5.41439 6.64566 9.12844 6.42638 12.1448 8.01149M15.3737 14.1243C18.2604 12.305 19.9319 8.97413 19.601 5.51222M8.58184 9.90371C5.72231 11.7291 4.06959 15.0436 4.39878 18.4878M15.5269 10.137C15.3939 6.72851 13.345 3.61684 10.1821 2.17222M8.47562 13.9256C8.63112 17.3096 10.6743 20.392 13.8177 21.8278M19.071 4.92893C22.9763 8.83418 22.9763 15.1658 19.071 19.071C15.1658 22.9763 8.83416 22.9763 4.92893 19.071C1.02369 15.1658 1.02369 8.83416 4.92893 4.92893C8.83418 1.02369 15.1658 1.02369 19.071 4.92893ZM14.8284 9.17157C16.3905 10.7337 16.3905 13.2663 14.8284 14.8284C13.2663 16.3905 10.7337 16.3905 9.17157 14.8284C7.60948 13.2663 7.60948 10.7337 9.17157 9.17157C10.7337 7.60948 13.2663 7.60948 14.8284 9.17157Z"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <div class="flex flex-col gap-[8px]">
            <div class="text-[20px] text-[#101828] leading-[30px]">
              {{ $t('solution.AIImg.part6') }}
            </div>
            <div class="text-[16px] text-[##75467] leading-[24px] font-light">
              {{ $t('solution.AIImg.part6-') }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import trackPageEvent from '../../packs/trackPageEvent'

  export default {
    props: {},

    data() {
      return {
        currentIndex: 0,
        translateValue: 0,
        srcList: [
          '/images/solution/ImagenAI2.png',
          '/images/solution/ImagenAI5.png',
          '/images/solution/ImagenAI6.png',
          '/images/solution/ImagenAI1.png',
          '/images/solution/ImagenAI3.png',
          '/images/solution/ImagenAI4.png'
        ]
      }
    },

    components: {},

    methods: {
      nextSlide() {
        if (this.currentIndex < this.srcList.length - 1) {
          this.currentIndex++
          this.translateValue -= 392
        }
      },
      prevSlide() {
        if (this.currentIndex > 0) {
          this.currentIndex--
          this.translateValue += 392
        }
      },
      toDemoPage() {
        trackPageEvent({ id: 'demo_imggen', m: 'ProductDemo' })
        window.open(
          'https://opencsg.com/spaces/AIWizards/StableDiffusionSpace'
        )
      }
    },
    mounted() {}
  }
</script>
