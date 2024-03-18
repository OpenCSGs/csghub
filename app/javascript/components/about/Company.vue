<template>
    <div class="company">
      <div class="bg-[#F9FAFB] pb-40 md:pb-[112px]">
        <div class="mx-auto max-w-[1280px] pt-[96px] md:pt-[64px] md:py-[40px] md:px-[16px] xl:px-[32px]">
          <div class="flex justify-between md:justify-normal gap-[64px] md:flex-col md:gap-[48px]">
            <div>
              <div class="text-[16px] md:text-[14px] md:leading-[20px] leading-[24px] text-[#223B99] mb-[10px]">{{ $t('about.company.ContactUs') }}</div>
              <div class="text-[36px] md:text-[30px] md:leading-[38px] leading-[44px] text-[#101828] mb-[20px]">{{ $t('about.company.ContactTeam') }}</div>
              <div class="text-[20px] md:text-[18px] md:leading-[28px] leading-[30px] text-[#475467]">{{ $t('about.company.Welcome') }}</div>
            </div>
            <div class="flex-col max-w-[390px] mr-[200px] lg:mr-0">
              <div class="flex gap-[16px] mb-[32px]">
                <div><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 12.5C13.6569 12.5 15 11.1569 15 9.5C15 7.84315 13.6569 6.5 12 6.5C10.3431 6.5 9 7.84315 9 9.5C9 11.1569 10.3431 12.5 12 12.5Z" stroke="#3250BD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 22C14 18 20 15.4183 20 10C20 5.58172 16.4183 2 12 2C7.58172 2 4 5.58172 4 10C4 15.4183 10 18 12 22Z" stroke="#3250BD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
                <div>
                  <div class="text-[20px] md:text-[18px] md:leading-[28px] leading-[30px] text-[#101828] mb-[10px]">{{ $t('about.company.Beijing') }}</div>
                  <div class="text-[16px] leading-[24px] font-light text-[#475467]">{{ $t('about.company.BeijingSite') }}</div>
                </div>
              </div>
              <div class="flex gap-[16px]">
                <div><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 12.5C13.6569 12.5 15 11.1569 15 9.5C15 7.84315 13.6569 6.5 12 6.5C10.3431 6.5 9 7.84315 9 9.5C9 11.1569 10.3431 12.5 12 12.5Z" stroke="#3250BD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 22C14 18 20 15.4183 20 10C20 5.58172 16.4183 2 12 2C7.58172 2 4 5.58172 4 10C4 15.4183 10 18 12 22Z" stroke="#3250BD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
                <div>
                  <div class="text-[20px] md:text-[18px] md:leading-[28px] leading-[30px] text-[#101828] mb-[10px]">{{ $t('about.company.ShangHai') }}</div>
                  <div class="text-[16px] leading-[24px] font-light text-[#475467]">{{ $t('about.company.ShangHaiSite') }}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="flex justify-between lg:justify-normal mt-[48px] gap-[64px] lg:flex-col lg:gap-[48px]">
            <el-timeline style="max-width: 600px">
              <el-timeline-item
                placement="top"
                v-for="(activity, index) in activities"
                :key="index"
                :timestamp="activity.timestamp"
              >
                {{ activity.content }}
              </el-timeline-item>
            </el-timeline>
            <div class="flex-col font-light text-[#475467] max-w-[552px] text-[20px] leading-[30px]">
              <div class="mb-[30px]">{{ $t('about.company.Desc1') }}</div>
              <div>{{ $t('about.company.Desc2') }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="bg-[#FFF]">
        <div class="m-auto max-w-[1280px] px-[32px] md:px-[16px] pb-[96px] md:pb-[64px]">
          <img src="/images/company/company_bg.png" class="w-full relative md:bottom-[64px] bottom-[96px]" alt="OpenCSG"/>
        </div>
      </div>
    </div>
  </template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n();


const activities = [
  {
    content: t('about.company.content1'),
    timestamp: t('about.company.timestamp1'),
  },
  {
    content: t('about.company.content2'),
    timestamp: t('about.company.timestamp2'),
  },
  {
    content: t('about.company.content3'),
    timestamp: t('about.company.timestamp3'),
  },
  {
    content: t('about.company.content4'),
    timestamp: t('about.company.timestamp4'),
  },
  {
    content: t('about.company.content5'),
    timestamp: t('about.company.timestamp5'),
  },
]
</script>
