<template>
  <div class="Programming py-[96px] text-center w-full bg-white">
    <div class="max-w-[1280px] m-auto">
      <div class="flex flex-col md:px-[20px] items-center mb-[64px]">
        <div class="text-[36px] leading-[44px] text-[#101828]">
          {{ $t('solution.programming.headline') }}
        </div>
        <div
          class="my-[20px] max-w-[768px] text-[20px] text-[#606266] leading-[30px] font-light"
        >
          {{ $t('solution.programming.desc') }}
        </div>
        <div
          @click="toDemoPage"
          class="cursor-pointer mb-[48px] inline-block py-[16px] px-[22px] text-[18px] leading-[28px] text-[#FFF] bg-[#3250BD] border border-[#3250BD] rounded-[8px]"
        >
          {{ $t('solution.programming.demo') }}
        </div>
      </div>
      <div class="px-[32px] flex gap-[64px] md:flex-col">
        <div class="flex flex-col gap-[48px]">
          <div class="flex flex-col gap-[20px] items-start">
            <div
              class="px-[12px] py-[12px] rounded-[40px] bg-[#ACBDFF] border-[8px] border-[#CED8FF]"
            >
              <SvgIcon name="starcode_codegen" />
            </div>
            <div class="flex flex-col gap-[8px] text-left">
              <div class="text-[20px] text-[#101828] leading-[30px]">
                {{ $t('solution.programming.part1') }}
              </div>
              <div class="text-[16px] text-[##75467] leading-[24px] font-light">
                {{ $t('solution.programming.part1-') }}
              </div>
            </div>
          </div>
          <div class="flex flex-col gap-[20px] items-start">
            <div
              class="px-[12px] py-[12px] rounded-[40px] bg-[#ACBDFF] border-[8px] border-[#CED8FF]"
            >
              <SvgIcon name="starcode_unittest" />
            </div>
            <div class="flex flex-col gap-[8px] text-left">
              <div class="text-[20px] text-[#101828] leading-[30px]">
                {{ $t('solution.programming.part2') }}
              </div>
              <div class="text-[16px] text-[##75467] leading-[24px] font-light">
                {{ $t('solution.programming.part2-') }}
              </div>
            </div>
          </div>
        </div>
        <div
          class="min-w-[461px] min-h-[461px] md:min-w-full codeOptimizationBg"
        ></div>
        <div class="flex flex-col gap-[48px]">
          <div class="flex flex-col gap-[20px] items-start">
            <div
              class="px-[12px] py-[12px] rounded-[40px] bg-[#ACBDFF] border-[8px] border-[#CED8FF]"
            >
              <SvgIcon name="starcode_codechat" />
            </div>
            <div class="flex flex-col gap-[8px] text-left">
              <div class="text-[20px] text-[#101828] leading-[30px]">
                {{ $t('solution.programming.part3') }}
              </div>
              <div class="text-[16px] text-[##75467] leading-[24px] font-light">
                {{ $t('solution.programming.part3-') }}
              </div>
            </div>
          </div>
          <div class="flex flex-col gap-[20px] items-start">
            <div
              class="px-[12px] py-[12px] rounded-[40px] bg-[#ACBDFF] border-[8px] border-[#CED8FF]"
            >
              <SvgIcon name="starcode_codetranslate" />
            </div>
            <div class="flex flex-col gap-[8px] text-left">
              <div class="text-[20px] text-[#101828] leading-[30px]">
                {{ $t('solution.programming.part4') }}
              </div>
              <div class="text-[16px] text-[##75467] leading-[24px] font-light">
                {{ $t('solution.programming.part4-') }}
              </div>
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
      return {}
    },

    components: {},

    methods: {
      toDemoPage() {
        trackPageEvent({ id: 'demo_codegen', m: 'ProductDemo' })
        window.open(
          'https://opencsg.com/spaces/OpenCSG/OpenCSG-DeepSeek-Code-1.3B'
        )
      }
    },

    mounted() {}
  }
</script>
<style scoped>
  .codeOptimizationBg {
    background-image: url('../images/codeOptimization.png');
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
  }
</style>
