<template>
  <div class="py-4 flex gap-[16px] justify-center items-center text-xs font-normal border-t w-full sm:text-[10px] xl:flex-col bg-white sm:hidden">
    <div class="flex items-center gap-[16px] mr-40 text-[14px] text-[#475467] cursor-pointer xl:mr-0 sm:flex-col sm:gap-[4px] sm:mr-0">
      <a href="https://portal.opencsg.com/about">{{ $t('footer.company') }}</a>
      <a href="https://opencsg.com/blog" target="_blank">{{ $t('footer.news') }}</a>
      <a href="https://portal.opencsg.com/docs" target="_blank">{{ $t('footer.docs') }}</a>
      <a href="https://portal.opencsg.com#joinUs">{{ $t('footer.join') }}</a>
      <a @click="showDialog" target="_blank">{{ $t('footer.contact') }}</a>
      <a href="/policy" target="_blank">{{ $t('footer.policy') }}</a>
    </div>
    <div class="flex items-center sm:flex-col lg:mt-[4px] lg:ml-[8px]">
      <div class="flex gap-x-1.5 mx-[5px]">
        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none">
          <g clip-path="url(#clip0_9_14638)">
            <path
                d="M4.92677 7.8571L7.7286 10.6589L5.32493 13.0626L0.759148 8.49681C0.413879 8.15154 0.413579 7.59184 0.758477 7.2462L6.99128 1H11.7839L4.92677 7.8571Z"
                fill="#0096E0"/>
            <path
                d="M12.0732 7.85726L9.2714 5.05544L11.6751 2.65176L16.2409 7.21755C16.5861 7.56281 16.5864 8.12251 16.2415 8.46815L10.0087 14.7144H5.21613L12.0732 7.85726Z"
                fill="#D6000F"/>
          </g>
          <defs>
            <clipPath id="clip0_9_14638">
              <rect class="h-4 w-4" fill="white" transform="translate(0.5)"/>
            </clipPath>
          </defs>
        </svg>
        <p><a href="https://12377.cn/" target="_blank">{{ $t('footer.illegal') }}</a></p>
      </div>
      <div class="flex gap-x-1.5 mx-[5px]">
        <!-- <p class="lg:hidden">｜</p> -->
        <img :src="emblemLogo" class="h-4 w-4" alt="OpenCSG Logo"/>
        <p><a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=11011202004415">
          {{ $t('footer.police') }}</a></p>
      </div>
      <div class="flex gap-x-1.5 mx-[5px]">
        <!-- <p class="lg:hidden">｜</p> -->
        <p><a href="https://beian.miit.gov.cn/#/Integrated/index" target="_blank"> {{ $t('footer.ICP') }} </a></p>
      </div>
    </div>

    <div class="flex items-center gap-3">
      <a href="https://twitter.com/OpenCsg" target="_blank">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <g clip-path="url(#clip0_9734_38852)">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M10.6303 15.3334L6.9307 10.0602L2.29924 15.3334H0.339844L6.06139 8.82081L0.339844 0.666748H5.37048L8.85732 5.63676L13.2262 0.666748H15.1856L9.72955 6.87774L15.6609 15.3334H10.6303ZM12.8123 13.8468H11.4932L3.14541 2.15341H4.46474L7.80808 6.83552L8.38623 7.64799L12.8123 13.8468Z" fill="#98A2B3"/>
          </g>
          <defs>
            <clipPath id="clip0_9734_38852">
              <rect width="16" height="16" fill="white"/>
            </clipPath>
          </defs>
        </svg>
      </a>
      <a href="https://huggingface.co/opencsg" target="_blank">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <g clip-path="url(#clip0_9734_38854)">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M8 0C3.5816 0 0 3.5872 0 8.0136C0 11.5536 2.292 14.5576 5.4712 15.6168C5.8712 15.6904 6.0168 15.4432 6.0168 15.2304C6.0168 15.0408 6.0104 14.536 6.0064 13.868C3.7808 14.352 3.3112 12.7936 3.3112 12.7936C2.948 11.8672 2.4232 11.6208 2.4232 11.6208C1.6968 11.1248 2.4784 11.1344 2.4784 11.1344C3.2808 11.1904 3.7032 11.96 3.7032 11.96C4.4168 13.184 5.576 12.8304 6.0312 12.6256C6.1048 12.108 6.3112 11.7552 6.54 11.5552C4.764 11.3528 2.896 10.6648 2.896 7.5944C2.896 6.72 3.208 6.004 3.7192 5.444C3.6368 5.2416 3.3624 4.4264 3.7976 3.324C3.7976 3.324 4.4696 3.108 5.9976 4.1448C6.65021 3.96681 7.32355 3.87615 8 3.8752C8.68 3.8784 9.364 3.9672 10.0032 4.1448C11.5304 3.108 12.2008 3.3232 12.2008 3.3232C12.6376 4.4264 12.3624 5.2416 12.2808 5.444C12.7928 6.004 13.1032 6.72 13.1032 7.5944C13.1032 10.6728 11.232 11.3504 9.4504 11.5488C9.7376 11.796 9.9928 12.2848 9.9928 13.0328C9.9928 14.1032 9.9832 14.968 9.9832 15.2304C9.9832 15.4448 10.1272 15.6944 10.5336 15.616C12.1266 15.0817 13.5115 14.0602 14.4924 12.696C15.4733 11.3318 16.0007 9.69385 16 8.0136C16 3.5872 12.4176 0 8 0Z" fill="#98A2B3"/>
          </g>
          <defs>
            <clipPath id="clip0_9734_38854">
              <rect width="16" height="16" fill="white"/>
            </clipPath>
          </defs>
        </svg>
        </a>
    </div>

  </div>
  <div class="hidden sm:block p-[24px]">
    <div class="flex gap-[40px]">
      <div class="flex flex-none items-start flex-col gap-y-4 mr-[20px]">
        <p class="text-base font-semibold">{{ $t('footer.about') }}</p>
        <div class="flex text-sm sm:text-[12px] font-normal items-start flex-col gap-y-2">
          <p><a href="https://portal.opencsg.com/about">{{ $t('footer.company') }}</a></p>
          <p><a href="https://opencsg.com/blog" target="_blank">{{ $t('footer.news') }}</a></p>
          <p><a href="https://portal.opencsg.com/docs" target="_blank">{{ $t('footer.docs') }}</a></p>
          <p><a href="https://portal.opencsg.com#joinUs">{{ $t('footer.join') }}</a></p>
        </div>
      </div>
      <div class="flex gap-x-[100px] mt-[5px] mlg:mt-0">
        <div class="flex flex-none items-start flex-col gap-y-4">
          <p class="text-base font-semibold">{{ $t('footer.contact') }}</p>
          <div class="flex text-sm sm:text-[12px] font-normal items-start flex-col gap-y-2 ">
            <p>{{ $t('footer.partner') }}: partner@opencsg.com</p>
            <p>{{ $t('footer.resume') }}: hr@opencsg.com</p>
            <p>{{ $t('footer.pr') }}: pr@opencsg.com</p>
            <p>{{ $t('footer.ir') }}: ir@opencsg.com</p>
          </div>
        </div>
      </div>
    </div>
    <div class="border-t mt-[30px] mb-[4px] font-normal"></div>
    <div class="flex flex-col gap-[12px]">
      <div class="flex gap-[24px] text-[14px] font-normal">
        <a href="/policy">{{ $t('footer.policy') }}</a>
        <!-- <p>{{ $t('footer.cookies') }}</p> -->
      </div>
      <div class="text-[14px] text-[#909399] font-normal">{{ $t('footer.publish') }}</div>
      <div class="flex flex-col gap-[4px] text-[12px] text-[#666666] font-normal">
        <div class="flex gap-x-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none">
            <g clip-path="url(#clip0_9_14638)">
              <path
                  d="M4.92677 7.8571L7.7286 10.6589L5.32493 13.0626L0.759148 8.49681C0.413879 8.15154 0.413579 7.59184 0.758477 7.2462L6.99128 1H11.7839L4.92677 7.8571Z"
                  fill="#0096E0"/>
              <path
                  d="M12.0732 7.85726L9.2714 5.05544L11.6751 2.65176L16.2409 7.21755C16.5861 7.56281 16.5864 8.12251 16.2415 8.46815L10.0087 14.7144H5.21613L12.0732 7.85726Z"
                  fill="#D6000F"/>
            </g>
            <defs>
              <clipPath id="clip0_9_14638">
                <rect class="h-4 w-4" fill="white" transform="translate(0.5)"/>
              </clipPath>
            </defs>
          </svg>
          <p><a href="https://12377.cn/" target="_blank">{{ $t('footer.police') }}</a></p>
        </div>
        <div class="flex gap-x-1.5">
          <img :src="emblemLogo" class="h-4 w-4" alt="OpenCSG Logo"/>
          <p><a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=11011202004415">
            {{ $t('footer.police') }}</a></p>
        </div>
        <p class="text-[12px]"><a href="https://beian.miit.gov.cn/#/Integrated/index" target="_blank"> {{ $t('footer.ICP') }} </a></p>
      </div>
    </div>
  </div>
  <ContactUs ref='child' />
</template>

<script>
import ContactUs from "../form/ContactUs.vue";

export default {
  props: {
    emblemLogo: String
  },
  components: {
    ContactUs,
  },
  data() {
    return {}
  },
  mounted() {
  },
  methods: {
    showDialog() {
      this.$refs.child.showDialog()
    }
  },
}
</script>