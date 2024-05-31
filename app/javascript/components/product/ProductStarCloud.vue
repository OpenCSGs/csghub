<template>
  <div class="StarCloud pt-[96px] text-center w-full">
    <div class="max-w-[1280px] m-auto">
      <div class="flex flex-col items-center md:px-[20px] mb-[64px] relative">
        <div class="text-[36px] leading-[44px] text-[#101828]">
          {{ $t('product.starCloud.headline') }}
        </div>
        <div
          class="my-[20px] max-w-[768px] text-[20px] text-[#606266] leading-[30px] text-left font-light"
        >
          {{ $t('product.starCloud.desc') }}
        </div>
        <div class="flex gap-[16px] mb-[16px] product">
          <div
            @click="openDialog"
            class="cursor-pointer py-[12px] px-[18px] flex text-[14px] leading-[20px] text-[#344054] gap-[6px] border border-[#D0D5DD] rounded-[8px]"
          >
            <SvgIcon name="starcloud_video" />
            {{ $t('product.starCloud.demoVideo') }}
          </div>
          <VideoDialog
            ref="videoDialogRef"
            :videoSrc="videoSrc"
          />
        </div>
        <SvgIcon
          class="absolute top-[30%] right-0 w-[20%] lg:hidden"
          name="starcloud_demo"
        />
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
              <SvgIcon name="starcloud_intro_model" />
            </div>
            <div>
              <div class="text-[20px] leading-[30px] text-[#101828] mb-[8px]">
                {{ $t('product.starCloud.part1') }}
              </div>
              <div class="text-[16px] leading-[24px] font-light text-[#475467]">
                {{ $t('product.starCloud.part1-') }}
              </div>
            </div>
          </div>
          <div class="flex flex-col items-start gap-[20px] md:px-[24px]">
            <div
              class="px-[12px] py-[12px] rounded-[40px] bg-[#ACBDFF] border-[8px] border-[#CED8FF]"
            >
              <SvgIcon name="starcloud_intro_process" />
            </div>
            <div>
              <div class="text-[20px] leading-[30px] text-[#101828] mb-[8px]">
                {{ $t('product.starCloud.part2') }}
              </div>
              <div class="text-[16px] leading-[24px] font-light text-[#475467]">
                {{ $t('product.starCloud.part2-') }}
              </div>
            </div>
          </div>
          <div class="flex flex-col items-start gap-[20px] md:px-[24px]">
            <div
              class="px-[12px] py-[12px] rounded-[40px] bg-[#ACBDFF] border-[8px] border-[#CED8FF]"
            >
              <SvgIcon name="starcloud_intro_running" />
            </div>
            <div>
              <div class="text-[20px] leading-[30px] text-[#101828] mb-[8px]">
                {{ $t('product.starCloud.part3') }}
              </div>
              <div class="text-[16px] leading-[24px] font-light text-[#475467]">
                {{ $t('product.starCloud.part3-') }}
              </div>
            </div>
          </div>
          <div class="flex flex-col items-start gap-[20px] md:px-[24px]">
            <div
              class="px-[12px] py-[12px] rounded-[40px] bg-[#ACBDFF] border-[8px] border-[#CED8FF]"
            >
              <SvgIcon name="starcloud_intro_safety" />
            </div>
            <div>
              <div class="text-[20px] leading-[30px] text-[#101828] mb-[8px]">
                {{ $t('product.starCloud.part4') }}
              </div>
              <div class="text-[16px] leading-[24px] font-light text-[#475467]">
                {{ $t('product.starCloud.part4-') }}
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
  import VideoDialog from '../dialog/VideoDialog.vue'
  import trackPageEvent from '../../packs/trackPageEvent'

  export default {
    props: {},
    data() {
      return {
        videoSrc:
          'https://opencsg-public-resource.oss-accelerate.aliyuncs.com/video/starcloud.mp4'
      }
    },

    components: {
      VideoDialog
    },
    computed: {},
    mounted() {},
    methods: {
      openDialog() {
        trackPageEvent({ id: 'demo_video_starcloud', m: 'ProductDemo' })
        this.$refs.videoDialogRef.openDialog()
      }
    }
  }
</script>
