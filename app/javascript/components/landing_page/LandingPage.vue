<template>
  <div class="flex flex-col justify-center bg-white">
    <!-- banner -->
    <div
      class="text-center w-full bg-top bg-no-repeat bg-[url('images/landing/BackgroundPattern.png')] py-[96px] md:px-[16px]"
    >
      <div class="sm:w-full max-w-[1280px] m-auto">
        <div
          class="relative mb-[24px] tracking-[-1.2px] md:tracking-[-0.72px] m-auto text-[60px] md:text-[36px] md:leading-[44px] text-[#101828] leading-[72px]"
        >
          <span class="relative z-10 font-medium md:font-normal">
            {{ $t('landingPage.banner.title') }}
          </span>
          <!-- underline svg -->
          <SvgIcon
            name="landing_page_hero_purpleline"
            class="absolute bottom-0 left-[40%] md:hidden"
          />
          <SvgIcon
            name="landing_page_hero_purpleline_mobile"
            class="absolute bottom-0 left-[37%] hidden md:block"
          />
        </div>
        <div class="text-[20px] font-light text-[#475467] leading-[30px] mb-[48px] md:mb-[32px]">
          {{ $t('landingPage.banner.subtitle') }}
        </div>
        <a
          v-if="!isLoggedIn"
          href="/login"
          class="md:block md:mx-[20px] px-[22px] py-[16px] rounded-[8px] text-[#FFF] bg-[#32508D] border border-[32508D] cursor-pointer"
        >
          {{ $t('landingPage.banner.joinButton') }}
        </a>
      </div>
    </div>

    <!-- 社区热门趋势 -->
    <div
      class="bg-[#F9FAFB] flex flex-col mlg:px-[20px] justify-center py-[96px] md:py-[64px] text-center"
    >
      <div class="max-w-[1280px] m-auto">
        <div
          class="text-[16px] leading-[24px] md:text-[14px] md:leading-[20px] text-[#223B99] mb-[8px]"
        >
          {{ $t('landingPage.hotTrend.subtitle') }}
        </div>
        <div
          class="text-[48px] leading-[60px] md:text-[30px] md:leading-[38px] text-[#101828] mb-[20px]"
        >
          {{ $t('landingPage.hotTrend.title') }}
        </div>
        <div
          class="text-[20px] leading-[30px] md:text-[18px] md:leading-[28px] text-[#475467] mb-[64px]"
        >
          {{ $t('landingPage.hotTrend.desc') }}
        </div>
      </div>
      <div class="max-w-[1340px] xl:w-full m-auto flex xl:flex-col xl:gap-[64px] gap-[32px]">
        <!-- 热门模型 -->
        <div class="flex flex-col gap-[16px] items-center">
          <p class="flex items-center gap-[4px] mb-[12px]">
            <SvgIcon
              name="models"
              width="18"
              height="18"
            />
            <span>
              {{ $t('landingPage.hotTrend.models') }}
            </span>
          </p>
          <RepoItem
            v-for="model in hotModels"
            :repo="model"
            repo-type="model"
          />
          <div class="w-full relative flex items-center">
            <div class="flex-grow border border-[#EAECF0]"></div>
            <span class="text-[14px] text-[#475467] px-3 text-gray-500">
              <a href="/models">
                {{ $t('landingPage.hotTrend.loadMore') }}
              </a>
            </span>
            <div class="flex-grow border border-[#EAECF0]"></div>
          </div>
        </div>

        <!-- 热门空间 -->
        <div class="flex flex-col gap-[16px] items-center">
          <p class="flex items-center gap-[4px] mb-[12px]">
            <SvgIcon
              name="spaces"
              width="18"
              height="18"
            />
            <span>
              {{ $t('landingPage.hotTrend.spaces') }}
            </span>
          </p>
          <ApplicationSpaceItem
            v-for="space in hotSpaces"
            :repo="space"
          />
          <div class="w-full relative flex items-center">
            <div class="flex-grow border border-[#EAECF0]"></div>
            <span class="text-[14px] text-[#475467] px-3 text-gray-500">
              <a href="/spaces">
                {{ $t('landingPage.hotTrend.loadMore') }}
              </a>
            </span>
            <div class="flex-grow border border-[#EAECF0]"></div>
          </div>
        </div>

        <!-- 热门数据集 -->
        <div class="flex flex-col gap-[16px] items-center">
          <p class="flex items-center gap-[4px] mb-[12px]">
            <SvgIcon
              name="datasets"
              width="18"
              height="18"
            />
            <span>
              {{ $t('landingPage.hotTrend.datasets') }}
            </span>
          </p>
          <RepoItem
            v-for="dataset in hotDatasets"
            :repo="dataset"
            repo-type="dataset"
          />
          <div class="w-full relative flex items-center">
            <div class="flex-grow border border-[#EAECF0]"></div>
            <span class="text-[14px] text-[#475467] px-3 text-gray-500">
              <a href="/datasets">
                {{ $t('landingPage.hotTrend.loadMore') }}
              </a>
            </span>
            <div class="flex-grow border border-[#EAECF0]"></div>
          </div>
        </div>
      </div>
    </div>

    <ProductStarShip />

    <!-- 云上算力资源 -->
    <div class="w-full px-5">
      <div class="flex items-center max-w-[1280px] m-auto md:flex-col md:gap-12">
        <div class="flex flex-col gap-8 w-1/2 md:w-full items-start">
          <div class="text-[48px] leading-[60px] md:text-[30px] md:leading-[38px]">
            云上算力资源
          </div>
          <div class="text-[20px] leading-[30px] md:hidden font-light">
            传神社区为您提供多种算力服务
          </div>
          <div class="flex flex-col gap-5 px-4">
            <div class="flex gap-3 text-[18px] leading-[28px] font-light">
              <SvgIcon name="landing_check" />一键打开Notebook，快速体验
            </div>
            <div class="flex gap-3 text-[18px] leading-[28px] font-light">
              <SvgIcon name="landing_check" />Demo应用托管，CPU资源长期免费
            </div>
            <div class="flex gap-3 text-[18px] leading-[28px] font-light">
              <SvgIcon name="landing_check" />丰富的算力资源，为您量身打造租赁计划
            </div>
          </div>
          <div class="flex items-center justify-center text-center md:w-full">
            <div
              class="cursor-pointer md:w-full py-3 px-[18px] text-[16px] leading-[24px] text-[#FFF] bg-[#3250BD] border border-[#3250BD] rounded-[8px]"
            >
              查看详情
            </div>
          </div>
        </div>
        <div class="w-1/2 md:w-full">
          <img
            src="images/landing/Image.png"
            class="w-full"
          />
        </div>
      </div>
    </div>

    <div
      v-if="customers.length"
      class="bg-[#F9FAFB] py-[96px]"
    >
      <p class="text-4xl mb-[32px] tracking-[-0.72px] text-[#101828] text-center">
        {{ $t('landingPage.customers.title') }}
      </p>
      <div
        class="swiper_box overflow-hidden flex items-center justify-start max-w-[1280px] m-auto md:px-[32px] md:pt-[64px]"
      >
        <div class="swiperProduce">
          <div
            v-for="item in customers"
            :key="item"
            class="mr-[36px] px-[36px] py-[24px]"
          >
            <img
              :src="item.logo"
              :alt="item.name"
              class="w-auto h-[88px]"
            />
          </div>
        </div>
        <div class="swiperProduce">
          <div
            v-for="item in customers"
            :key="item"
            class="mr-[36px] px-[36px] py-[24px]"
          >
            <img
              :src="item.logo"
              :alt="item.name"
              class="w-auto h-[88px]"
            />
          </div>
        </div>
      </div>
    </div>
    <div
      class="flex flex-col justify-center py-[96px] sm:pb-[50px] h-screen sm:h-auto pl-20 md:px-[16px]"
    >
      <div
        class="flex justify-center items-center md:flex-col md:gap-[48px] sm:w-full max-w-[1280px] m-auto"
      >
        <div class="md:text-center">
          <div class="text-[64px] md:text-[30px] md:leading-[38px] text-[#303133]">
            {{ $t('landingPage.value.title1') }}
            <br />
            {{ $t('landingPage.value.title2') }}
          </div>
          <div class="text-[20px] leading-[28px] md:text-[18px] md:font-light text-[#606266]">
            {{ $t('landingPage.value.subtitle') }}
          </div>
        </div>
        <div>
          <img
            src="images/landing/frame.png"
            alt=""
            class="w-full max-h-[600px]"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import ProductStarShip from '../product/ProductStarShip.vue'
  import RepoItem from '../shared/RepoItem.vue'
  import ApplicationSpaceItem from '../application_spaces/ApplicationSpaceItem.vue'
  import useWxShare from '../hooks/useWxShare'
  import { onMounted } from 'vue'

  const props = defineProps({
    isLoggedIn: Boolean,
    hotModels: Object,
    hotDatasets: Object,
    hotSpaces: Object,
    customers: Array
  })
  onMounted(() => {
    useWxShare({
      title: 'OpenCSG 打造中国本土化 Huggingface plus',
      desc: '让大模型赋能每一个人,大模型驱动全民，推动技术创新，OpenCSG——平台有各个领域的大模型，提供模型探索体验、推理、训练、部署和应用的一站式服务，共建模型开源社区，发现、学习、定制和分享心仪的模型。',
      link: window.location.href
    })
  })
</script>

<style scoped>
  @keyframes marqueeScroll {
    0% {
      transform: translate(0, 0);
    }

    100% {
      transform: translate(-100%, 0);
    }
  }
  .swiper_box {
    mask-image: linear-gradient(
      var(--mask-direction, to right),
      transparent,
      #000 10%,
      #000 90%,
      transparent
    );
  }
  .swiperProduce {
    display: flex;
    animation: marqueeScroll 80s linear infinite forwards;
    animation-duration: 80s;
    animation-timing-function: linear;
    animation-delay: 0s;
    animation-iteration-count: infinite;
    animation-direction: normal;
    animation-fill-mode: forwards;
    animation-play-state: running;
    animation-name: marqueeScroll;
  }
</style>
