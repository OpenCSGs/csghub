<template>
  <div class="text-center w-full bg-white">
    <div class="max-w-[1280px] m-auto py-[96px]">
      <div
        class="m-auto text-[72px] md:text-[48px] md:leading-[60px] text-[#101828] leading-[90px]"
      >
        {{ $t("ekb.title") }}
      </div>
      <div
        class="m-auto mb-[24px] font-semibold text-[64px] md:text-[36px] leading-[90px] md:leading-[50px] bg-clip-text text-transparent bg-gradient-to-r from-[#2E1492] via-[#B73FA9] to-[#A45FE6]"
      >
        {{ $t("ekb.desc") }}
      </div>
      <div
        class="text-[20px] mb-[24px] font-light text-[#475467] leading-[30px]"
      >
        {{ $t("ekb.tips") }}
      </div>
      <a href="https://ekb.opencsg.com/" target="_blank"
        class="cursor-pointer mb-[48px] inline-block py-[16px] px-[22px] text-[18px] leading-[28px] text-[#FFF] bg-[#3250BD] border border-[#3250BD] rounded-[8px]"
      >
        {{ $t("solution.knowledge.demo") }}
      </a>
      <div class="grow flex justify-center items-center">
        <div class="w-[592px] md:w-full">
          <video style="width: 100%" controls autoplay muted>
            <source
              src="https://opencsg-public-resource.oss-accelerate.aliyuncs.com/video/EKBAI.mp4"
              type="video/mp4"
            />
          </video>
        </div>
      </div>
    </div>
  </div>
</template>