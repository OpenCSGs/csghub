<template>
  <div class="StarCloud pt-[96px] text-center w-full">
    <div class="max-w-[1280px] m-auto">
      <div class="flex flex-col items-center md:px-[20px] mb-[64px] relative">
        <div class="text-[36px] leading-[44px] text-[#101828]">
          {{ $t("product.starCloud.headline") }}
        </div>
        <div
          class="my-[20px] max-w-[768px] text-[20px] text-[#606266] leading-[30px] text-left font-light"
        >
          {{ $t("product.starCloud.desc") }}
        </div>
        <div class="flex gap-[16px] mb-[16px] product">
          <div
            @click="openDialog"
            class="cursor-pointer py-[12px] px-[18px] flex text-[14px] leading-[20px] text-[#344054] gap-[6px] border border-[#D0D5DD] rounded-[8px]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <g clip-path="url(#clip0_661_4)">
                <path
                  d="M9.99984 18.3337C14.6022 18.3337 18.3332 14.6027 18.3332 10.0003C18.3332 5.39795 14.6022 1.66699 9.99984 1.66699C5.39746 1.66699 1.6665 5.39795 1.6665 10.0003C1.6665 14.6027 5.39746 18.3337 9.99984 18.3337Z"
                  stroke="#344054"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M7.9165 7.47144C7.9165 7.0737 7.9165 6.87483 7.99962 6.76381C8.07206 6.66705 8.18293 6.60652 8.30349 6.59791C8.44182 6.58803 8.60911 6.69557 8.94368 6.91065L12.8775 9.43954C13.1678 9.62618 13.313 9.71949 13.3631 9.83815C13.4069 9.94183 13.4069 10.0588 13.3631 10.1625C13.313 10.2812 13.1678 10.3745 12.8775 10.5611L8.94368 13.09C8.60911 13.3051 8.44182 13.4126 8.30349 13.4027C8.18293 13.3941 8.07206 13.3336 7.99962 13.2368C7.9165 13.1258 7.9165 12.927 7.9165 12.5292V7.47144Z"
                  stroke="#344054"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_661_4">
                  <rect width="20" height="20" fill="white" />
                </clipPath>
              </defs>
            </svg>
            {{ $t("product.starCloud.demoVideo") }}
          </div>
          <VideoDialog ref="videoDialogRef" :videoSrc="videoSrc" />
        </div>
        <SvgIcon name="cloud_guide" />
      </div>
    </div>
  </div>
  <div class="w-full bg-white pb-[48px]">
    <div class="max-w-[1280px] m-auto">
      <div
        class="pl-[32px] lg:px-[32px] flex items-center justify-center lg:flex-col gap-[64px] mb-[64px]"
      >
        <div
          class="grow grid grid-cols-2 max-w-[576px] gap-[32px] py-[32px] lg:w-auto lg:grid-cols-1 items-start"
        >
          <div class="flex flex-col items-start gap-[20px] md:px-[24px]">
            <div
              class="px-[12px] py-[12px] rounded-[40px] bg-[#ACBDFF] border-[8px] border-[#CED8FF]"
            >
              <SvgIcon name="cloud_info_icon1" />
            </div>
            <div>
              <div class="text-[20px] leading-[30px] text-[#101828] mb-[8px]">
                {{ $t("product.starCloud.part1") }}
              </div>
              <div class="text-[16px] leading-[24px] font-light text-[#475467]">
                {{ $t("product.starCloud.part1-") }}
              </div>
            </div>
          </div>
          <div class="flex flex-col items-start gap-[20px] md:px-[24px]">
            <div
              class="px-[12px] py-[12px] rounded-[40px] bg-[#ACBDFF] border-[8px] border-[#CED8FF]"
            >
              <SvgIcon name="cloud_info_icon2" />
            </div>
            <div>
              <div class="text-[20px] leading-[30px] text-[#101828] mb-[8px]">
                {{ $t("product.starCloud.part2") }}
              </div>
              <div class="text-[16px] leading-[24px] font-light text-[#475467]">
                {{ $t("product.starCloud.part2-") }}
              </div>
            </div>
          </div>
          <div class="flex flex-col items-start gap-[20px] md:px-[24px]">
            <div
              class="px-[12px] py-[12px] rounded-[40px] bg-[#ACBDFF] border-[8px] border-[#CED8FF]"
            >
              <SvgIcon name="cloud_info_icon3" />
            </div>
            <div>
              <div class="text-[20px] leading-[30px] text-[#101828] mb-[8px]">
                {{ $t("product.starCloud.part3") }}
              </div>
              <div class="text-[16px] leading-[24px] font-light text-[#475467]">
                {{ $t("product.starCloud.part3-") }}
              </div>
            </div>
          </div>
          <div class="flex flex-col items-start gap-[20px] md:px-[24px]">
            <div
              class="px-[12px] py-[12px] rounded-[40px] bg-[#ACBDFF] border-[8px] border-[#CED8FF]"
            >
              <SvgIcon name="cloud_info_icon4" />
            </div>
            <div>
              <div class="text-[20px] leading-[30px] text-[#101828] mb-[8px]">
                {{ $t("product.starCloud.part4") }}
              </div>
              <div class="text-[16px] leading-[24px] font-light text-[#475467]">
                {{ $t("product.starCloud.part4-") }}
              </div>
            </div>
          </div>
        </div>
        <div
          class="grow bg-[#F2F4F7] max-w-[730px] max-h-[620px] rounded-l-[24px] lg:rounded-[24px] pr-0 xl:mt-[20px] lg:mt-0 mlg:w-full mlg:px-[32px]"
        >
          <el-image
            src="/images/product/computer.png"
            :preview-src-list="['/images/product/computer.png']"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VideoDialog from "../dialog/VideoDialog.vue";
export default {
  props: {},
  data() {
    return {
      videoSrc:
        "https://opencsg-public-resource.oss-accelerate.aliyuncs.com/video/starcloud.mp4",
    };
  },

  components: {
    VideoDialog,
  },
  computed: {},
  mounted() {},
  methods: {
    goDemo() {
      window.open("https://starcloud-stg.opencsg.com/ ", "_blank");
    },
    openDialog() {
      this.$refs.videoDialogRef.openDialog();
    },
  },
};
</script>
