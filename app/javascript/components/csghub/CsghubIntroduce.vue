<template>
  <div class="pt-[96px] text-center w-full">
    <div class="max-w-[1280px] m-auto">
      <div class="flex flex-col items-center md:px-[20px] mb-[64px] relative">
        <div class="text-[16px] text-[#223B99] mb-[20px]">
          {{ $t('csghub.product.introduce') }}
        </div>
        <div class="text-[36px] leading-[44px] text-[#101828]">
          {{ $t('csghub.product.headline') }}
        </div>
        <div
          class="my-[20px] text-center text-[20px] text-[#606266] leading-[30px] font-light"
        >
          {{ $t('csghub.product.desc1') }}<br/>{{ $t('csghub.product.desc2') }}
        </div>
      </div>
    </div>
  </div>
  <div class="w-full bg-white pb-[48px]">
    <div class="max-w-[1280px] m-auto">
      <div
        class="pl-[32px] lg:px-[32px] flex items-center justify-center lg:flex-col gap-[64px] mb-[64px]"
      >
        <div
          class="mr-[96px] gap-[32px] py-[32px] lg:w-auto lg:grid-cols-1 items-start"
        >
          <div class="flex flex-col items-start gap-[20px] md:px-[24px]">
            <SvgIcon name="csghub_system" />
            <div>
              <div class="text-[20px] leading-[30px] text-[#101828] mb-[8px]">
                {{ $t('csghub.product.part1') }}
              </div>
              <div class="text-[16px] leading-[24px] font-light text-[#475467]">
                {{ $t('csghub.product.part1-') }}
              </div>
            </div>
            <div class="flex flex-col gap-[16px] px-[16px]">
              <div class="flex items-center">
                <SvgIcon name="csghub_hook" width="23" height="23"/>
                <p class="ml-[12px] font-light text-[18px] text-[#475467]">{{ $t('csghub.product.part1-p1') }}</p>
              </div>
              <div class="flex items-center">
                <SvgIcon name="csghub_hook" width="23" height="23"/>
                <p class="ml-[12px] font-light text-[18px] text-[#475467]">{{ $t('csghub.product.part1-p2') }}</p>
              </div>
              <div class="flex items-center">
                <SvgIcon name="csghub_hook" width="23" height="23"/>
                <p class="ml-[12px] font-light text-[18px] text-[#475467]">{{ $t('csghub.product.part1-p3') }}</p>
              </div>
              <div class="flex items-center">
                <SvgIcon name="csghub_hook" width="23" height="23"/>
                <p class="ml-[12px] font-light text-[18px] text-[#475467]">{{ $t('csghub.product.part1-p4') }}</p>
              </div>
              <div class="flex items-center">
                <SvgIcon name="csghub_hook" width="23" height="23"/>
                <p class="ml-[12px] font-light text-[18px] text-[#475467]">{{ $t('csghub.product.part1-p5') }}</p>
              </div>
            </div>
          </div>
        </div>
        <div
          class="grow max-w-[730px] max-h-[620px] lg:rounded-[24px] pr-0 xl:mt-[20px] lg:mt-0 mlg:w-full mlg:px-[32px]"
        >
          <el-image
            src="/images/product/system.png"
            :preview-src-list="['/images/product/computer.png']"
          />
        </div>
      </div>
      
      <div
        class="pl-[32px] lg:px-[32px] flex items-center justify-center lg:flex-col gap-[64px] mb-[64px]"
      >
        <div
          class="grow max-w-[730px] max-h-[620px] lg:rounded-[24px] pl-0 xl:mt-[20px] lg:mt-0 mlg:w-full mlg:px-[32px]"
        >
          <el-image
            src="/images/product/platform.png"
            :preview-src-list="['/images/product/platform.png']"
          />
        </div>
        <div
          class="ml-[96px] gap-[32px] py-[32px] lg:w-auto lg:grid-cols-1 items-start"
        >
          <div class="flex flex-col items-start gap-[20px] md:px-[24px]">
            <SvgIcon name="csghub_sync" />
            <div>
              <div class="text-[20px] leading-[30px] text-[#101828] mb-[8px]">
                {{ $t('csghub.product.part2') }}
              </div>
              <div class="text-[16px] leading-[24px] font-light text-[#475467]">
                {{ $t('csghub.product.part2-') }}
              </div>
            </div>
            <div class="flex flex-col gap-[16px] px-[16px]">
              <div class="flex items-center">   
                <SvgIcon name="csghub_hook" width="23" height="23"/>
                <p class="ml-[12px] font-light text-[18px] text-[#475467]">{{ $t('csghub.product.part2-p1') }}</p>
              </div>
              <div class="flex items-center">
                <SvgIcon name="csghub_hook" width="23" height="23"/>
                <p class="ml-[12px] font-light text-[18px] text-[#475467]">{{ $t('csghub.product.part2-p2') }}</p>
              </div>
              <div class="flex items-center">
                <SvgIcon name="csghub_hook" width="23" height="23"/>
                <p class="ml-[12px] font-light text-[18px] text-[#475467]">{{ $t('csghub.product.part2-p3') }}</p>
              </div>
              <div class="flex items-center">
                <SvgIcon name="csghub_hook" width="23" height="23"/>
                <p class="ml-[12px] font-light text-[18px] text-[#475467]">{{ $t('csghub.product.part2-p4') }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        class="pl-[32px] lg:px-[32px] flex items-center justify-center lg:flex-col gap-[64px] mb-[64px]"
      >
        <div
          class="mr-[96px] gap-[32px] py-[32px] lg:w-auto lg:grid-cols-1 items-start"
        >
          <div class="flex flex-col items-start gap-[20px] md:px-[24px]">
            <SvgIcon name="csghub_platform" />
            <div>
              <div class="text-[20px] leading-[30px] text-[#101828] mb-[8px]">
                {{ $t('csghub.product.part3') }}
              </div>
              <div class="text-[16px] leading-[24px] font-light text-[#475467]">
                {{ $t('csghub.product.part3-') }}
              </div>
            </div>
            <div class="flex flex-col gap-[16px] px-[16px]">
              <div class="flex items-center">
                <SvgIcon name="csghub_hook" width="23" height="23"/>
                <p class="ml-[12px] font-light text-[18px] text-[#475467]">{{ $t('csghub.product.part3-p1') }}</p>
              </div>
              <div class="flex items-center">
                <SvgIcon name="csghub_hook" width="23" height="23"/>
                <p class="ml-[12px] font-light text-[18px] text-[#475467]">{{ $t('csghub.product.part3-p2') }}</p>
              </div>
              <div class="flex items-center">
                <SvgIcon name="csghub_hook" width="23" height="23"/>
                <p class="ml-[12px] font-light text-[18px] text-[#475467]">{{ $t('csghub.product.part3-p3') }}</p>
              </div>
            </div>
          </div>
        </div>
        <div
          class="grow max-w-[730px] max-h-[620px] lg:rounded-[24px] pr-0 xl:mt-[20px] lg:mt-0 mlg:w-full mlg:px-[32px]"
        >
          <el-image
            src="/images/product/sync.png"
            :preview-src-list="['/images/product/computer.png']"
          />
        </div>
      </div>

      <div
        class="pl-[32px] lg:px-[32px] flex items-center justify-center lg:flex-col gap-[64px] mb-[64px]"
      >
        <div
          class="grow max-w-[730px] max-h-[620px] lg:rounded-[24px] pl-0 xl:mt-[20px] lg:mt-0 mlg:w-full mlg:px-[32px]"
        >
          <el-image
            src="/images/product/safe.png"
            :preview-src-list="['/images/product/computer.png']"
          />
        </div>
        <div
          class="ml-[96px] gap-[32px] py-[32px] lg:w-auto lg:grid-cols-1 items-start"
        >
          <div class="flex flex-col items-start gap-[20px] md:px-[24px]">
            <SvgIcon name="csghub_safe" />
            <div>
              <div class="text-[20px] leading-[30px] text-[#101828] mb-[8px]">
                {{ $t('csghub.product.part4') }}
              </div>
              <div class="text-[16px] leading-[24px] font-light text-[#475467]">
                {{ $t('csghub.product.part4-') }}
              </div>
            </div>
            <div class="flex flex-col gap-[16px] px-[16px]">
              <div class="flex items-center">   
                <SvgIcon name="csghub_hook" width="23" height="23"/>
                <p class="ml-[12px] font-light text-[18px] text-[#475467]">{{ $t('csghub.product.part4-p1') }}</p>
              </div>
              <div class="flex items-center">
                <SvgIcon name="csghub_hook" width="23" height="23"/>
                <p class="ml-[12px] font-light text-[18px] text-[#475467]">{{ $t('csghub.product.part4-p2') }}</p>
              </div>
              <div class="flex items-center">
                <SvgIcon name="csghub_hook" width="23" height="23"/>
                <p class="ml-[12px] font-light text-[18px] text-[#475467]">{{ $t('csghub.product.part4-p3') }}</p>
              </div>
              <div class="flex items-center">
                <SvgIcon name="csghub_hook" width="23" height="23"/>
                <p class="ml-[12px] font-light text-[d18px] text-[#475467]">{{ $t('csghub.product.part4-p4') }}</p>
              </div>
              <div class="flex items-center">
                <SvgIcon name="csghub_hook" width="23" height="23"/>
                <p class="ml-[12px] font-light text-[18px] text-[#475467]">{{ $t('csghub.product.part4-p5') }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="StarAIO py-[96px] w-full bg-[#F9FAFB]">
    <div class="max-w-[1280px] m-auto">
      <div class="px-[32px] flex md:flex-col gap-[64px] mb-[64px]">
        <div class="flex flex-col items-start max-w-[380px]">
          <div class="max-w-[301px] mb-[20px] text-[#101828] text-[36px] leading-[44px]">{{ $t('csghub.product.feature-h') }}</div>
          <div class="text-[#667085] mb-[20px] text-[18px] leading-[28px] font-light">{{ $t('csghub.product.feature-p') }}</div>
          <a href="#" target="_blank"
             class="cursosr-pointer mb-[48px] inline-block py-[16px] px-[22px] text-[18px] leading-[28px] text-[#FFF] bg-[#3250BD] border border-[#3250BD] rounded-[8px]"
          >
            {{ $t("csghub.product.feature-button") }}
          </a>
        </div>
        <div class="grid grid-cols-2 gap-[32px] md:grid-cols-1">
          <div class="flex flex-col items-start gap-[32px] px-[24px] py-[24px]">
            <SvgIcon name="csghub_feature_1" />
            <div>
              <div class="text-[18px] leading-[28px] text-[#101828] mb-[8px]">{{ $t('csghub.product.feature-h1') }}</div>
              <div class="text-[16px] leading-[24px] font-light text-[#475467]">{{ $t('csghub.product.feature-p1') }}</div>
            </div>
          </div>
          <div class="flex flex-col items-start gap-[32px] px-[24px] py-[24px]">
            <SvgIcon name="csghub_feature_2" />
            <div>
              <div class="text-[18px] leading-[28px] text-[#101828] mb-[8px]">{{ $t('csghub.product.feature-h2') }}</div>
              <div class="text-[16px] leading-[24px] font-light text-[#475467]">{{ $t('csghub.product.feature-p2') }}</div>
            </div>
          </div>
          <div class="flex flex-col items-start gap-[32px] px-[24px] py-[24px]">
            <SvgIcon name="csghub_feature_3" />
            <div>
              <div class="text-[18px] leading-[28px] text-[#101828] mb-[8px]">{{ $t('csghub.product.feature-h3') }}</div>
              <div class="text-[16px] leading-[24px] font-light text-[#475467]">{{ $t('csghub.product.feature-p3') }}</div>
            </div>
          </div>
          <div class="flex flex-col items-start gap-[32px] px-[24px] py-[24px]">
            <SvgIcon name="csghub_feature_4" />
            <div>
              <div class="text-[18px] leading-[28px] text-[#101828] mb-[8px]">{{ $t('csghub.product.feature-h4') }}</div>
              <div class="text-[16px] leading-[24px] font-light text-[#475467]">{{ $t('csghub.product.feature-p4') }}</div>
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

  components: {},

  mounted() {},
};
</script>
<style scoped>

</style>
