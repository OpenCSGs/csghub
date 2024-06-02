<template>
  <div class="StarShip py-[96px] md:py-[16px] text-center w-full">
    <div class="max-w-[1280px] m-auto">
      <div class="flex flex-col items-center mlg:px-[20px] mb-[64px]">
        <div class="text-[36px] leading-[44px] text-[#101828]">
          {{ $t('product.starShip.headline') }}
        </div>
        <div
          class="my-[20px] max-w-[768px] text-[20px] text-[#606266] leading-[30px] text-left font-light text-center"
        >
          {{ $t('product.starShip.desc') }}
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
                  <rect
                    width="20"
                    height="20"
                    fill="white"
                  />
                </clipPath>
              </defs>
            </svg>
            {{ $t('product.starShip.demo') }}
          </div>
          <VideoDialog
            ref="videoDialogRef"
            :videoSrc="videoSrc"
          />
          <div
            @click="goApply"
            class="cursor-pointer py-[12px] px-[18px] text-[14px] leading-[20px] text-[#FFF] bg-[#3250BD] border border-[#3250BD] rounded-[8px]"
          >
            {{ $t('product.starShip.trailApply') }}
          </div>
        </div>
        <div class="w-[768px] mlg:w-full mt-[16px] rounded-[10px]">
          <el-image
            src="/images/product/demo.png"
            :preview-src-list="['/images/product/demo.png']"
          />
        </div>
        <div class="flex md:flex-col md:gap-[16px] mt-[80px] text-left">
          <div
            class="max-w-[405px] cursor-pointer pt-[24px] px-[16px] border-t-[4px] border-t-[#F2F4F7] hover:border-t-[#3250BD]"
            v-for="item in data"
            :key="item.id"
          >
            <div class="text-[#101828] text-[20px] leading-[30px] text-center">
              {{ this.$i18n.locale === 'zh' ? item.title : item.title_en }}
            </div>
            <div
              class="text-[#475467] text-[16px] leading-[24px] font-light pt-[8px] font-light break-normal"
            >
              {{ this.$i18n.locale === 'zh' ? item.desc : item.desc_en }}
            </div>
          </div>
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
          'https://opencsg-public-resource.oss-accelerate.aliyuncs.com/video/opencsg-starship.mp4',
        data: [
          {
            id: '1',
            title: '自动生成代码',
            title_en: 'Automatically generate code',
            desc: '使用 StarShip 可以根据用户写的 issue 自动生成代码，并创建出一个可以直接进入审查流程的 Merge Request',
            desc_en:
              'Using StarShip, you can automatically generate code based on issues written by users and create a Merge Request that can directly enter the review process.'
          },
          {
            id: '2',
            title: '自动进行代码审查',
            title_en: 'Automate code reviews',
            desc: 'StarShip 可以帮助您做代码审查，只需简单配置，就可以自动给每一个提交的 Merge Request 进行代码审查',
            desc_en:
              'StarShip can help you do code review. With simple configuration, it can automatically conduct code review for every Merge Request submitted.'
          },
          {
            id: '3',
            title: '快速解答代码问题',
            title_en: 'Quick answers to code questions',
            desc: '不论是 GitLab 的使用问题，还是项目代码的理解。都可以在 StarShip 中直接提问，帮您更快的解决问题',
            desc_en:
              "Whether it's the use of GitLab or the understanding of project code. You can ask questions directly in StarShip to help you solve the problem faster"
          }
        ]
      }
    },

    components: {
      VideoDialog
    },
    computed: {},
    mounted() {},
    methods: {
      goApply() {
        window.open(
          'https://opencsg.com/lead_forms/form/S3s2wpq1pjvT_Starship_Free_Trail',
          '_blank'
        )
      },
      openDialog() {
        trackPageEvent({ id: 'demo_video_starship', m: 'ProductDemo' })
        this.$refs.videoDialogRef.openDialog()
      }
    }
  }
</script>
