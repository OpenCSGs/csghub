<template>
  <div class="py-[96px] md:py-[64px] w-full max-w-[1280px] m-auto">
    <div class="max-w-[1280px] m-auto">
      <div class="max-w-[1280px] m-auto md:px-[20px]">
        <div class="flex flex-col items-center mb-[64px] md:mb-[48px] relative">
          <div class="text-[16px] text-[#223B99] mb-[20px]">
            {{ $t('csghub.price.introduce') }}
          </div>
          <div class="text-[36px] leading-[60px] md:leading-[44px] text-[#101828]">
            {{ $t('csghub.price.headline') }}
          </div>
          <div class="my-[20px] text-center text-[20px] md:text-[20px] text-[#606266] leading-[30px] md:leading-[28px] font-light mb-[32px]">
            {{ $t('csghub.price.desc') }}
          </div>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-[32px] mb-[64px] md:grid-cols-1 px-[20px]">
        <div class="flex flex-col border rounded-[16px]">
          <div class="flex justify-between lg:flex-col p-[32px] pb-[16px] border-b">
            <div class="hidden text-[60px] md:block">Free</div>
            <div>
              <p class="text-[24px]">{{ $t('csghub.price.community') }}</p>
              <p class="font-light text-[16px] text-[#475467]">{{ $t('csghub.price.community-p1') }}</p>
            </div>
            <div class="text-[60px] md:hidden">Free</div>
          </div>
          <div class="flex flex-col gap-[24px] p-[32px]">
            <div class="flex flex-col">
              <p class="mb-[16px]">{{ $t('csghub.price.asset') }}</p>
              <div class="flex flex-col gap-[16px] font-light text-[16px] text-[#475467]">
                <div class="flex md:flex-col md:gap-[16px] gap-[32px]">
                  <div class="flex items-start w-[248px]">
                    <SvgIcon name="csghub_price_hook" class="mr-[12px]" />
                    {{ $t('csghub.price.asset-p1') }}
                  </div>
                  <div class="flex items-start w-[248px]">
                    <SvgIcon name="csghub_price_hook" class="mr-[12px]" />
                    {{ $t('csghub.price.asset-p2') }}
                  </div>
                </div>
                <div class="flex md:flex-col md:gap-[16px] gap-[32px]">
                  <div class="flex items-start w-[248px]">
                    <SvgIcon name="csghub_price_hook" class="mr-[12px]" />
                    {{ $t('csghub.price.asset-p3') }}
                  </div>
                  <div class="flex items-start w-[248px]">
                    <SvgIcon name="csghub_price_hook" class="mr-[12px]" />
                    {{ $t('csghub.price.asset-p4') }}
                  </div>
                </div>
                <div class="flex md:flex-col md:gap-[16px] gap-[32px]">
                  <div class="flex items-start w-[248px]">
                    <SvgIcon name="csghub_price_hook" class="mr-[12px]" />
                    {{ $t('csghub.price.asset-p5') }}
                  </div>
                  <div class="flex items-start w-[248px]">
                    <SvgIcon name="csghub_price_hook" class="mr-[12px]" />
                    {{ $t('csghub.price.asset-p6') }}
                  </div>
                </div>
                <div class="flex gap-[32px]">
                  <div class="flex items-start w-[248px]">
                    <SvgIcon name="csghub_price_hook" class="mr-[12px]" />
                    {{ $t('csghub.price.asset-p7') }}
                  </div>
                </div>
              </div>
            </div>
            <div class="flex flex-col">
              <p class="mb-[16px]">{{ $t('csghub.price.ai') }}</p>
              <div class="flex flex-col gap-[16px] font-light text-[16px] text-[#475467]">
                <div class="flex md:flex-col md:gap-[16px] gap-[32px]">
                  <div class="flex items-start w-[248px]">
                    <SvgIcon name="csghub_price_hook" class="mr-[12px]" />
                    {{ $t('csghub.price.ai-p1') }}
                  </div>
                  <div class="flex items-start w-[248px]">
                    <SvgIcon name="csghub_price_hook" class="mr-[12px]" />
                    {{ $t('csghub.price.ai-p2') }}
                  </div>
                </div>
                <div class="flex md:flex-col md:gap-[16px] gap-[32px]">
                  <div class="flex items-start w-[248px]">
                    <SvgIcon name="csghub_price_hook" class="mr-[12px]" />
                    {{ $t('csghub.price.ai-p3') }}
                  </div>
                  <div class="flex items-start w-[248px]">
                    <SvgIcon name="csghub_price_hook" class="mr-[12px]" />
                    {{ $t('csghub.price.ai-p4') }}
                  </div>
                </div>
                <div class="flex gap-[32px]">
                  <div class="flex">
                    <SvgIcon name="csghub_price_hook" class="mr-[12px]" />
                    {{ $t('csghub.price.ai-p5') }}
                  </div>
                </div>
              </div>
            </div>
            <div class="flex flex-col">
              <p class="mb-[16px]">{{ $t('csghub.price.data') }}</p>
              <div class="flex flex-col gap-[16px] font-light text-[16px] text-[#475467]">
                <div class="flex md:flex-col md:gap-[16px] gap-[32px]">
                  <div class="flex items-start w-[248px] md:w-auto">
                    <SvgIcon name="csghub_price_hook" class="mr-[12px]" />
                    {{ $t('csghub.price.data-p1') }}
                  </div>
                  <div class="flex items-start w-[248px] md:w-auto">
                    <SvgIcon name="csghub_price_hook" class="mr-[12px]" />
                    {{ $t('csghub.price.data-p2') }}
                  </div>
                </div>
                <div class="flex md:flex-col md:gap-[16px] gap-[32px]">
                  <div class="flex items-start">
                    <SvgIcon name="csghub_price_hook" class="mr-[12px]" />
                    {{ $t('csghub.price.data-p3') }}
                  </div>
                </div>
              </div>
            </div>
            <div class="flex flex-col mb-[80px] xl:mb-[110px] md:mb-0">
              <p class="mb-[16px]">{{ $t('csghub.price.portal') }}</p>
              <div class="flex flex-col gap-[16px] font-light text-[16px] text-[#475467]">
                <div class="flex items-start gap-[32px]">
                  <div class="flex items-start">
                    <SvgIcon name="csghub_price_hook" class="mr-[12px]" />
                    {{ $t('csghub.price.portal-p1') }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="p-[32px] border-t">
            <a href="https://github.com/OpenCSGs/CSGHub" target="_blank"
              class="flex cursosr-pointer p-[24px] w-auto justify-center items-center text-center h-[48px] text-[18px] leading-[28px] text-[#FFF] bg-[#3250BD] border border-[#3250BD] rounded-[8px]">
              {{ $t("csghub.price.free") }}
            </a>
          </div>
        </div>

        <div class="flex flex-col border rounded-[16px]">
          <div class="flex justify-between lg:flex-col p-[32px] pb-[16px] border-b">
            <div class="w-[277px]">
              <div class="hidden items-end text-[60px] md:flex">
                ¥1999
                <p class="mb-[20px] font-light text-[16px] text-[#475467]">{{ $t('csghub.price.unit') }}</p>
              </div>
              <div class="flex items-center">
                <p class="text-[24px]">{{ $t('csghub.price.company') }}</p>
                <div
                  class="flex items-center justify-center w-auto px-[12px] h-[24px] ml-[8px] border border-[#99AFFF] rounded-[16px] text-[14px] text-[#223B99] bg-[#CED8FF]">
                  {{ $t('csghub.price.recommend') }}
                </div>
              </div>
              <p class="font-light text-[16px] text-[#475467]">{{ $t('csghub.price.company-desc') }}</p>
            </div>
            <div class="flex items-end text-[60px] md:hidden">
              ¥1999
              <p class="mb-[20px] font-light text-[16px] text-[#475467]">{{ $t('csghub.price.unit') }}</p>
            </div>
          </div>
          <div class="flex flex-col gap-[24px] p-[32px]">
            <div class="flex flex-col">
              <p class="mb-[16px]">{{ $t('csghub.price.aiPlus') }}</p>
              <div class="flex flex-col gap-[16px] font-light text-[16px] text-[#475467]">
                <div class="flex gap-[32px] md:flex-col md:gap-[16px]">
                  <div class="flex items-start w-[248px]">
                    <SvgIcon name="csghub_price_hook" class="mr-[12px]" width="24" height="24" />
                    {{ $t('csghub.price.aiPlus-p1') }}
                  </div>
                  <div class="flex items-start w-[248px]">
                    <SvgIcon name="csghub_price_hook" class="mr-[12px]" />
                    {{ $t('csghub.price.aiPlus-p2') }}
                  </div>
                </div>
              </div>
            </div>
            <div class="flex flex-col">
              <p class="mb-[16px]">{{ $t('csghub.price.dataCompany') }}</p>
              <div class="flex flex-col gap-[16px] font-light text-[16px] text-[#475467]">
                <div class="flex gap-[32px] md:flex-col md:gap-[16px]">
                  <div class="flex items-start w-[248px]">
                    <SvgIcon name="csghub_price_hook" class="mr-[12px]" width="24" height="24" />
                    {{ $t('csghub.price.dataCompany-p1') }}
                  </div>
                  <div class="flex items-start w-[248px]">
                    <SvgIcon name="csghub_price_hook" class="mr-[12px]" />
                    {{ $t('csghub.price.dataCompany-p2') }}
                  </div>
                </div>
                <div class="flex items-start gap-[32px]">
                  <div class="flex">
                    <SvgIcon name="csghub_price_hook" class="mr-[12px]" />
                    {{ $t('csghub.price.dataCompany-p3') }}
                  </div>
                </div>
              </div>
            </div>
            <div class="flex flex-col">
              <p class="mb-[16px]">{{ $t('csghub.price.safe') }}</p>
              <div class="flex flex-col gap-[16px] font-light text-[16px] text-[#475467]">
                <div class="flex gap-[32px] md:flex-col md:gap-[16px]">
                  <div class="flex items-start w-[248px]">
                    <SvgIcon name="csghub_price_hook" class="mr-[12px]" />
                    {{ $t('csghub.price.safe-p1') }}
                  </div>
                  <div class="flex items-start w-[248px]">
                    <SvgIcon name="csghub_price_hook" class="mr-[12px]" />
                    {{ $t('csghub.price.safe-p2') }}
                  </div>
                </div>
                <div class="flex md:flex-col md:gap-[16px] gap-[32px]">
                  <div class="flex v w-[248px]">
                    <SvgIcon name="csghub_price_hook" class="mr-[12px]" />
                    {{ $t('csghub.price.safe-p3') }}
                  </div>
                  <div class="flex items-start w-[248px]">
                    <SvgIcon name="csghub_price_hook" class="mr-[12px]" />
                    {{ $t('csghub.price.safe-p4') }}
                  </div>
                </div>
                <div class="flex gap-[32px] md:flex-col md:gap-[16px]">
                  <div class="flex items-start w-[248px]">
                    <SvgIcon name="csghub_price_hook" class="mr-[12px]" />
                    {{ $t('csghub.price.safe-p5') }}
                  </div>
                </div>
              </div>
            </div>
            <div class="flex flex-col">
              <p class="mb-[16px]">{{ $t('csghub.price.made') }}</p>
              <div class="flex flex-col gap-[16px] font-light text-[16px] text-[#475467]">
                <div class="flex gap-[32px] md:flex-col md:gap-[16px]">
                  <div class="flex items-start w-[248px]">
                    <SvgIcon name="csghub_price_hook" class="mr-[12px]" />
                    {{ $t('csghub.price.made-p1') }}
                  </div>
                  <div class="flex items-start w-[248px]">
                    <SvgIcon name="csghub_price_hook" class="mr-[12px]" />
                    {{ $t('csghub.price.made-p2') }}
                  </div>
                </div>
              </div>
            </div>
            <div class="flex flex-col">
              <p class="mb-[16px]">{{ $t('csghub.price.technology') }}</p>
              <div class="flex flex-col gap-[16px] font-light text-[16px] text-[#475467]">
                <div class="flex gap-[32px] md:flex-col md:gap-[16px]">
                  <div class="flex items-start w-[248px] md:w-auto">
                    <SvgIcon name="csghub_price_hook" class="mr-[12px]" />
                    {{ $t('csghub.price.technology-p1') }}
                  </div>
                  <div class="flex items-start w-[248px] md:w-auto">
                    <SvgIcon name="csghub_price_hook" class="mr-[12px]" />
                    {{ $t('csghub.price.technology-p2') }}
                  </div>
                </div>
              </div>
            </div>
            <div class="flex flex-col">
              <p class="mb-[16px]">{{ $t('csghub.price.capacity') }}</p>
              <div class="flex flex-col gap-[16px] font-light text-[16px] text-[#475467]">
                <div class="flex gap-[32px] md:flex-col md:gap-[16px]">
                  <div class="flex items-start w-[248px]">
                    <SvgIcon name="csghub_price_hook" class="mr-[12px]" />
                    {{ $t('csghub.price.capacity-p1') }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="p-[32px] border-t">
            <a href="https://opencsg.com/lead_forms/form/LhkJ4U4Kj9UD_CSGHub_Free_Trail" target="_blank"
              class="flex cursosr-pointer p-[24px] w-auto justify-center items-center text-center h-[48px] text-[18px] leading-[28px] text-[#FFF] bg-[#3250BD] border border-[#3250BD] rounded-[8px]">
              {{ $t("csghub.price.console") }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
