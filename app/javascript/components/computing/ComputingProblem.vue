<template>
  <div class="w-full pb-[96px] md:pb-[50px] banner bg-white">
    <div
      class="flex flex-col flex-wrap gap-[64px] max-w-[1280px] m-auto xl:px-[20px]"
    >
      <div>
        <p class="font-medium text-[36px] mb-[20px]">
          {{ $t('computing.problem.headline') }}
        </p>
        <p class="font-light text-[20px] text-[#475467]">
          {{ $t('computing.problem.desc1') }}
        </p>
        <div class="font-light text-[20px] text-[#475467]">
          {{ $t('computing.problem.desc2') }}
          <a
            href="https://opencsg.com/lead_forms/form/5P4op4FQHwh5_%E7%AE%97%E5%8A%9B%E9%9C%80%E6%B1%82"
            class="underline cursor-pointer"
            >{{ $t('computing.problem.pre-sales') }}</a
          >。
        </div>
      </div>
      <div class="grid grid-cols-3 gap-[32px] md:grid-cols-1">
        <div class="flex flex-col gap-[20px] md:mb-[0px] mb-[48px]">
          <div
            class="flex justify-center items-center w-[64px] h-[64px] rounded-[40px] bg-[#ACBDFF] border-[8px] border-[#CED8FF]"
          >
            <svg
              width="22"
              height="16"
              viewBox="0 0 22 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21 6H1M10 10H5M1 4.2L1 11.8C1 12.9201 1 13.4802 1.21799 13.908C1.40973 14.2843 1.71569 14.5903 2.09202 14.782C2.51984 15 3.07989 15 4.2 15L17.8 15C18.9201 15 19.4802 15 19.908 14.782C20.2843 14.5903 20.5903 14.2843 20.782 13.908C21 13.4802 21 12.9201 21 11.8V4.2C21 3.0799 21 2.51984 20.782 2.09202C20.5903 1.7157 20.2843 1.40974 19.908 1.21799C19.4802 1 18.9201 1 17.8 1L4.2 1C3.0799 1 2.51984 1 2.09202 1.21799C1.7157 1.40973 1.40973 1.71569 1.21799 2.09202C1 2.51984 1 3.07989 1 4.2Z"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <div class="flex flex-col gap-[8px]">
            <div class="text-[20px] text-[#101828] leading-[30px]">
              {{ $t('computing.problem.part1') }}
            </div>
            <div class="text-[16px] text-[##75467] leading-[24px] font-light">
              {{ $t('computing.problem.part1-') }}
            </div>
          </div>
        </div>
        <div class="flex flex-col gap-[20px]">
          <div
            class="flex justify-center items-center w-[64px] h-[64px] rounded-[40px] bg-[#ACBDFF] border-[8px] border-[#CED8FF]"
          >
            <svg
              width="20"
              height="21"
              viewBox="0 0 20 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 6.50224C8.1762 6.00136 8.52397 5.579 8.98173 5.30998C9.43949 5.04095 9.9777 4.9426 10.501 5.03237C11.0243 5.12213 11.499 5.39421 11.8409 5.80041C12.1829 6.20661 12.37 6.72072 12.3692 7.25168C12.3692 8.75056 10.1209 9.5 10.1209 9.5M10.1499 12.5H10.1599M7.9 17.2L9.36 19.1467C9.57712 19.4362 9.68568 19.5809 9.81876 19.6327C9.93534 19.678 10.0647 19.678 10.1812 19.6327C10.3143 19.5809 10.4229 19.4362 10.64 19.1467L12.1 17.2C12.3931 16.8091 12.5397 16.6137 12.7185 16.4645C12.9569 16.2656 13.2383 16.1248 13.5405 16.0535C13.7671 16 14.0114 16 14.5 16C15.8978 16 16.5967 16 17.1481 15.7716C17.8831 15.4672 18.4672 14.8831 18.7716 14.1481C19 13.5967 19 12.8978 19 11.5V5.8C19 4.11984 19 3.27976 18.673 2.63803C18.3854 2.07354 17.9265 1.6146 17.362 1.32698C16.7202 1 15.8802 1 14.2 1H5.8C4.11984 1 3.27976 1 2.63803 1.32698C2.07354 1.6146 1.6146 2.07354 1.32698 2.63803C1 3.27976 1 4.11984 1 5.8V11.5C1 12.8978 1 13.5967 1.22836 14.1481C1.53284 14.8831 2.11687 15.4672 2.85195 15.7716C3.40326 16 4.10218 16 5.5 16C5.98858 16 6.23287 16 6.45951 16.0535C6.76169 16.1248 7.04312 16.2656 7.2815 16.4645C7.46028 16.6137 7.60685 16.8091 7.9 17.2Z"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <div class="flex flex-col gap-[8px]">
            <div class="text-[20px] text-[#101828] leading-[30px]">
              {{ $t('computing.problem.part2') }}
            </div>
            <div class="text-[16px] text-[##75467] leading-[24px] font-light">
              {{ $t('computing.problem.part2-') }}
            </div>
          </div>
        </div>
        <div class="flex flex-col gap-[20px]">
          <div
            class="flex justify-center items-center w-[64px] h-[64px] rounded-[40px] bg-[#ACBDFF] border-[8px] border-[#CED8FF]"
          >
            <svg
              width="22"
              height="20"
              viewBox="0 0 22 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21 8H1M10 17L17.8 17C18.9201 17 19.4802 17 19.908 16.782C20.2843 16.5903 20.5903 16.2843 20.782 15.908C21 15.4802 21 14.9201 21 13.8V6.2C21 5.0799 21 4.51984 20.782 4.09202C20.5903 3.7157 20.2843 3.40974 19.908 3.21799C19.4802 3 18.9201 3 17.8 3H16M10 17L12 19M10 17L12 15M6 17H4.2C3.07989 17 2.51984 17 2.09202 16.782C1.71569 16.5903 1.40973 16.2843 1.21799 15.908C1 15.4802 1 14.9201 1 13.8V6.2C1 5.0799 1 4.51984 1.21799 4.09202C1.40973 3.71569 1.7157 3.40973 2.09202 3.21799C2.51984 3 3.0799 3 4.2 3H12M12 3L10 5M12 3L10 1"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <div class="flex flex-col gap-[8px]">
            <div class="text-[20px] text-[#101828] leading-[30px]">
              {{ $t('computing.problem.part3') }}
            </div>
            <div class="text-[16px] text-[##75467] leading-[24px] font-light">
              {{ $t('computing.problem.part3-') }}
            </div>
          </div>
        </div>
        <div class="flex flex-col gap-[20px]">
          <div
            class="flex justify-center items-center w-[64px] h-[64px] rounded-[40px] bg-[#ACBDFF] border-[8px] border-[#CED8FF]"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 5H5.01M5 17H5.01M4.2 9H17.8C18.9201 9 19.4802 9 19.908 8.78201C20.2843 8.59027 20.5903 8.28431 20.782 7.90798C21 7.48016 21 6.92011 21 5.8V4.2C21 3.0799 21 2.51984 20.782 2.09202C20.5903 1.71569 20.2843 1.40973 19.908 1.21799C19.4802 1 18.9201 1 17.8 1H4.2C3.07989 1 2.51984 1 2.09202 1.21799C1.71569 1.40973 1.40973 1.71569 1.21799 2.09202C1 2.51984 1 3.07989 1 4.2V5.8C1 6.92011 1 7.48016 1.21799 7.90798C1.40973 8.28431 1.71569 8.59027 2.09202 8.78201C2.51984 9 3.0799 9 4.2 9ZM4.2 21H17.8C18.9201 21 19.4802 21 19.908 20.782C20.2843 20.5903 20.5903 20.2843 20.782 19.908C21 19.4802 21 18.9201 21 17.8V16.2C21 15.0799 21 14.5198 20.782 14.092C20.5903 13.7157 20.2843 13.4097 19.908 13.218C19.4802 13 18.9201 13 17.8 13H4.2C3.07989 13 2.51984 13 2.09202 13.218C1.71569 13.4097 1.40973 13.7157 1.21799 14.092C1 14.5198 1 15.0799 1 16.2V17.8C1 18.9201 1 19.4802 1.21799 19.908C1.40973 20.2843 1.71569 20.5903 2.09202 20.782C2.51984 21 3.0799 21 4.2 21Z"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <div class="flex flex-col gap-[8px]">
            <div class="text-[20px] text-[#101828] leading-[30px]">
              {{ $t('computing.problem.part4') }}
            </div>
            <div class="text-[16px] text-[##75467] leading-[24px] font-light">
              {{ $t('computing.problem.part4-') }}
            </div>
          </div>
        </div>
        <div class="flex flex-col gap-[20px]">
          <div
            class="flex justify-center items-center w-[64px] h-[64px] rounded-[40px] bg-[#ACBDFF] border-[8px] border-[#CED8FF]"
          >
            <svg
              width="18"
              height="22"
              viewBox="0 0 18 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 6.50036L7 9.50036L11 11.5004L8 14.5004M17 11.0004C17 15.9088 11.646 19.4788 9.69799 20.6152C9.4766 20.7444 9.3659 20.809 9.20968 20.8425C9.08844 20.8685 8.91156 20.8685 8.79032 20.8425C8.6341 20.809 8.5234 20.7444 8.30201 20.6152C6.35396 19.4788 1 15.9088 1 11.0004V6.21796C1 5.41845 1 5.01869 1.13076 4.67506C1.24627 4.3715 1.43398 4.10064 1.67766 3.88589C1.9535 3.6428 2.3278 3.50243 3.0764 3.22171L8.4382 1.21103C8.6461 1.13307 8.75005 1.09409 8.85698 1.07864C8.95184 1.06493 9.04816 1.06493 9.14302 1.07864C9.24995 1.09409 9.3539 1.13307 9.5618 1.21103L14.9236 3.22171C15.6722 3.50243 16.0465 3.6428 16.3223 3.88589C16.566 4.10064 16.7537 4.3715 16.8692 4.67506C17 5.01869 17 5.41845 17 6.21796V11.0004Z"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <div class="flex flex-col gap-[8px]">
            <div class="text-[20px] text-[#101828] leading-[30px]">
              {{ $t('computing.problem.part5') }}
            </div>
            <div class="text-[16px] text-[##75467] leading-[24px] font-light">
              {{ $t('computing.problem.part5-') }}
            </div>
          </div>
        </div>
        <div class="flex flex-col gap-[20px]">
          <div
            class="flex justify-center items-center w-[64px] h-[64px] rounded-[40px] bg-[#ACBDFF] border-[8px] border-[#CED8FF]"
          >
            <svg
              width="23"
              height="23"
              viewBox="0 0 23 23"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14.0497 5C15.0264 5.19057 15.924 5.66826 16.6277 6.37194C17.3314 7.07561 17.8091 7.97326 17.9997 8.95M14.0497 1C16.0789 1.22544 17.9713 2.13417 19.4159 3.57701C20.8606 5.01984 21.7717 6.91101 21.9997 8.94M10.2266 12.8631C9.02506 11.6615 8.07627 10.3028 7.38028 8.85323C7.32041 8.72854 7.29048 8.66619 7.26748 8.5873C7.18576 8.30695 7.24446 7.96269 7.41447 7.72526C7.46231 7.65845 7.51947 7.60129 7.63378 7.48698C7.98338 7.13737 8.15819 6.96257 8.27247 6.78679C8.70347 6.1239 8.70347 5.26932 8.27247 4.60643C8.15819 4.43065 7.98338 4.25585 7.63378 3.90624L7.43891 3.71137C6.90747 3.17993 6.64174 2.91421 6.35636 2.76987C5.7888 2.4828 5.11854 2.4828 4.55098 2.76987C4.2656 2.91421 3.99987 3.17993 3.46843 3.71137L3.3108 3.86901C2.78117 4.39863 2.51636 4.66344 2.31411 5.02348C2.08969 5.42298 1.92833 6.04347 1.9297 6.5017C1.93092 6.91464 2.01103 7.19687 2.17124 7.76131C3.03221 10.7947 4.65668 13.6571 7.04466 16.045C9.43264 18.433 12.295 20.0575 15.3284 20.9185C15.8928 21.0787 16.1751 21.1588 16.588 21.16C17.0462 21.1614 17.6667 21 18.0662 20.7756C18.4263 20.5733 18.6911 20.3085 19.2207 19.7789L19.3783 19.6213C19.9098 19.0898 20.1755 18.8241 20.3198 18.5387C20.6069 17.9712 20.6069 17.3009 20.3198 16.7333C20.1755 16.448 19.9098 16.1822 19.3783 15.6508L19.1835 15.4559C18.8339 15.1063 18.6591 14.9315 18.4833 14.8172C17.8204 14.3862 16.9658 14.3862 16.3029 14.8172C16.1271 14.9315 15.9523 15.1063 15.6027 15.4559C15.4884 15.5702 15.4313 15.6274 15.3644 15.6752C15.127 15.8453 14.7828 15.904 14.5024 15.8222C14.4235 15.7992 14.3612 15.7693 14.2365 15.7094C12.7869 15.0134 11.4282 14.0646 10.2266 12.8631Z"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <div class="flex flex-col gap-[8px]">
            <div class="text-[20px] text-[#101828] leading-[30px]">
              {{ $t('computing.problem.part6') }}
            </div>
            <div class="text-[16px] text-[##75467] leading-[24px] font-light">
              {{ $t('computing.problem.part6-') }}
            </div>
          </div>
        </div>
      </div>
      <div
        class="flex justify-between md:flex-col items-center md:items-start p-[32px] md:px-[20px] bg-[#F9FAFB] rounded-[16px]"
      >
        <div>
          <p class="font-medium text-[20px] text-[#101828] mb-[8px]">
            {{ $t('computing.problem.problem') }}
          </p>
          <p class="font-light text-[18px] text-[#475467] md:mb-[24px]">
            {{ $t('computing.problem.problem-') }}
          </p>
        </div>
        <div
          @click="
            toNextPage(
              'https://opencsg.com/lead_forms/form/5P4op4FQHwh5_%E7%AE%97%E5%8A%9B%E9%9C%80%E6%B1%82',
              'connect_compute'
            )
          "
          class="flex justify-center items-center bg-[#3250BD] w-[110px] py-[10px] px-[12px] md:mb-[16px] rounded-[8px] cursor-pointer"
        >
          <p class="text-[#FFFFFF] font-medium text-[16px]">
            {{ $t('computing.problem.contact') }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import trackPageEvent from '../../packs/trackPageEvent'

  export default {
    methods: {
      toNextPage(url, id) {
        trackPageEvent({ id: id, m: 'Connect' })
        window.location.href = url
      }
    }
  }
</script>
