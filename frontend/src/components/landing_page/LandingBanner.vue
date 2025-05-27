<template>
  <div
    ref="container"
    class="w-full relative"
  >
    <div class="w-full overflow-hidden">
      <div
        ref="bannerContainer"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
        @mousedown="handleMouseDown"
        @mousemove="handleMouseMove"
        @mouseup="handleMouseUp"
        class="transition-transform duration-500"
        :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
      >
        <div class="flex">
          <div
            v-for="(item, index) in images"
            :key="index"
            class="md:px-5 w-full bg-center bg-cover flex-shrink-0"
            :style="{ backgroundImage: `url(${item.url})` }"
          >
            <video
              v-if="item.isVideo"
              class="w-full h-full mix-blend-screen md:hidden absolute top-0 left-0 object-cover z-0"
              autoplay
              muted
              loop
              playsinline
            >
              <source
                :src="item.url"
                type="video/mp4"
              />
            </video>
            <div
              class="px-3 flex flex-col relative z-10 justify-center items-start sm:items-baseline page-responsive-width h-[580px] lg:h-[415px] md:h-[352px] sm:h-[200px] pt-[115px] pb-[151px] lg:pt-[60px] lg:pb-[114px] md:pt-[69px] md:pb-[81px]"
            >
              <div class="flex flex-col w-full">
                <div
                  class="max-w-[70%] sm:max-w-full text-gray-900 text-[56px] leading-[78px] lg:text-[48px] lg:leading-[64px] md:text-[32px] md:leading-[48px] sm:text-[24px] sm:leading-[32px] font-semibold mb-4"
                  :class="locale == 'en' ? 'responsiveEnTitle' : ''"
                >
                  <div v-html="computedTitle"></div>
                </div>
                <div
                  class="text-gray-600 text-[20px] leading-[30px] lg:text-[16px] lg:leading-[24px] sm:text-[12px] sm:leading-[18px] lg:font-normal font-light mb-10 lg:mb-[35px] md:mb-10 sm:mb-0"
                  :class="
                    currentIndex == 2 || currentIndex == 3 || currentIndex == 4
                      ? 'text-white'
                      : ''
                  "
                >
                  <div v-html="computedDesc"></div>
                </div>
              </div>
              <a
                v-if="bannerText[currentIndex].showBtn"
                :href="
                  isLoggedIn
                    ? bannerText[currentIndex].loginHref
                    : bannerText[currentIndex].href
                "
                :target="
                  bannerText[currentIndex].openInNewTab ? '_blank' : '_self'
                "
                class="bannerBtn sm:px-3 sm:py-2 md:text-xs sm:hidden hover:bg-[linear-gradient(96deg,_#4AA399_0%,_#4BB7AC_100%)] flex max-w-[max-content] gap-2 px-5 py-3 bg-[#1C8B7F] rounded-lg text-white"
              >
                {{
                  locale == 'en'
                    ? bannerText[currentIndex].buttonText_en
                    : bannerText[currentIndex].buttonText
                }}
                <SvgIcon
                  name="arrow_right"
                  width="16px"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Progress Dots -->
    <div
      class="w-full m-auto px-3 page-responsive-width absolute bottom-[20%] md:bottom-[23%] sm:bottom-[32%] left-1/2 -translate-x-1/2 transform items-end flex sm:justify-center space-x-2"
    >
      <div class="px-5 py-[10px] bg-[#1C8B7F10] rounded-3xl">
        <div class="transform flex space-x-2">
          <div
            v-for="(image, index) in images"
            :key="index"
            class="dot"
            :class="{ active: index === currentIndex }"
            @click="setIndex(index)"
          >
            <span
              class="progress-bar"
              :style="{
                width: index === currentIndex ? progressWidth + '%' : '0%'
              }"
            ></span>
          </div>
        </div>
      </div>
      <div
        class="px-2 py-[5px] bg-[#1C8B7F10] rounded-3xl flex gap-1 md:hidden"
      >
        <SvgIcon
          class="cursor-pointer"
          name="banner-arrow-left"
          @click="preBanner"
        />
        <SvgIcon
          class="cursor-pointer"
          name="banner-arrow-right"
          @click="nextBanner"
        />
      </div>
    </div>

    <!-- banner cards -->
    <div
      class="flex gap-5 lg:gap-0 justify-center items-end lg:flex-wrap w-full page-responsive-width m-auto absolute left-1/2 -translate-x-1/2 -bottom-10 lg:relative lg:left-0 lg:bottom-0 lg:translate-x-0"
    >
      <!-- card -->
      <a
        class="relative card cursor-pointer w-1/4 lg:w-1/4 lg:max-w-[221px] 2xl:w-[304px] justify-center flex-col group py-5 lg:py-[9px] sm:py-2 bg-white rounded-lg border border-white overflow-hidden"
        v-for="item in bannerTabs"
        :key="item"
        :href="item.link"
      >
        <img
          class="absolute group-hover:hidden lg:hidden h-[77px] left-2/3 top-0 h-1/2 -translate-x-1/2"
          src="/images/landing/banner_card_bg.svg"
        />
        <img
          class="absolute hidden group-hover:flex group-hover:lg:hidden lg:hidden left-2/3 top-0 h-1/2 -translate-x-1/2"
          src="/images/landing/banner_card_bg_selected.svg"
        />
        <div
          class="flex w-full flex-col bannerCard items-center lg:justify-center"
        >
          <div
            class="flex w-full items-center lg:justify-center md:flex-col cardTitle gap-3 lg:gap-2 sm:gap-1 px-5 lg:px-0"
          >
            <div class="w-[44px] lg:w-9 sm:w-8 xl:hidden lg:flex">
              <img
                class="w-[44px] lg:w-9 sm:w-8 transition-all duration-300"
                :src="item.icon"
              />
            </div>
            <div
              class="sm:text-center overflow-hidden text-ellipsis whitespace-nowrap text-gray-800 text-base group-hover:text-[#1C8B7F] font-semibold mb-[6px] lg:mb-0 z-10"
            >
              <div
                :title="item.title"
                class="overflow-hidden text-ellipsis whitespace-nowrap text-gray-800 text-base lg:text-sm group-hover:text-[#1C8B7F] font-semibold lg:font-medium mb-[6px] lg:mb-0"
              >
                {{ item.title }}
              </div>
              <div
                :title="item.desc"
                class="overflow-hidden font-normal text-ellipsis whitespace-nowrap lg:hidden text-gray-500 text-sm"
              >
                {{ item.desc }}
              </div>
            </div>
          </div>
          <div
            class="py-[10px] w-full text-xs leading-[18px] justify-center text-center border-t border-gray-200 text-[#1C8B7F] group-hover:flex hidden group-hover:lg:hidden"
          >
            {{ $t('LandingPage.loadMore') }} >>
          </div>
        </div>
      </a>
    </div>
  </div>
</template>
<script setup>
  import { onMounted, onUnmounted, ref, computed } from 'vue'
  import { useI18n } from 'vue-i18n'

  const props = defineProps({
    isLoggedIn: Boolean,
    bannerConfig: Array
  })
  const { t, locale } = useI18n()

  const container = ref(null)
  const windowWidth = ref(window.innerWidth)
  const banner = computed(() => props.bannerConfig)
  const images = computed(() => {
    const result = []
    banner.value.forEach((item) => {
      if (windowWidth.value <= 768) {
        result.push({
          url:
            locale.value === 'en'
              ? item.bannerImage_en || item.bannerImage
              : item.bannerImage,
          isVideo: false
        })
      } else {
        if (item.videoUrl) {
          result.push({ url: item.videoUrl, isVideo: true })
        } else {
          result.push({
            url:
              locale.value === 'en'
                ? item.bannerImage_en || item.bannerImage
                : item.bannerImage,
            isVideo: false
          })
        }
      }
    })
    return result
  })
  const currentIndex = ref(0)
  const progressWidth = ref(0)
  const startX = ref(0)
  const endX = ref(0)
  const bannerContainer = ref(null)
  let timer
  let progressTimer
  const setIndex = (index) => {
    currentIndex.value = index
    progressWidth.value = 0 // Reset progress to 0% on dot click
    restartProgress()
    resetTimer()
  }
  // Auto slide
  const autoSlide = () => {
    timer = setInterval(() => {
      currentIndex.value = (currentIndex.value + 1) % images.value.length
      progressWidth.value = 0
      restartProgress() // Start the progress animation
    }, 10000) // Change every 10 seconds
  }

  const restartProgress = () => {
    clearInterval(progressTimer)

    let width = 0
    progressTimer = setInterval(() => {
      width += 100 / 100
      if (width >= 100) {
        clearInterval(progressTimer)
      }
      progressWidth.value = width
    }, 100)
  }
  const resetTimer = () => {
    clearInterval(timer)
    autoSlide()
  }
  const bannerTabs = computed(() => {
    if (windowWidth.value <= 1024) {
      return [
        {
          title: t('LandingPage.banner.tabMdTitle'),
          desc: t('LandingPage.banner.tabDesc'),
          link: '/csghub',
          icon: '/images/landing/landing_csghub_icon.png'
        },
        {
          title: t('LandingPage.banner.tabMdTitle2'),
          desc: t('LandingPage.banner.tabDesc2'),
          link: '/starship',
          icon: '/images/landing/landing_starship_icon.png'
        },
        {
          title: t('LandingPage.banner.tabTitle3'),
          desc: t('LandingPage.banner.tabDesc3'),
          link: '/daily_papers',
          icon: '/images/landing/landing_paper_icon.png'
        },
        {
          title: t('LandingPage.banner.tabMDTitle4'),
          desc: t('LandingPage.banner.tabDesc4'),
          link: '/docs',
          icon: '/images/landing/landing_docs_icon.png'
        }
      ]
    } else {
      return [
        {
          title: t('LandingPage.banner.tabTitle'),
          desc: t('LandingPage.banner.tabDesc'),
          link: '/csghub',
          icon: '/images/landing/landing_csghub_icon.png'
        },
        {
          title: t('LandingPage.banner.tabTitle2'),
          desc: t('LandingPage.banner.tabDesc2'),
          link: '/starship',
          icon: '/images/landing/landing_starship_icon.png'
        },
        {
          title: t('LandingPage.banner.tabTitle3'),
          desc: t('LandingPage.banner.tabDesc3'),
          link: '/daily_papers',
          icon: '/images/landing/landing_paper_icon.png'
        },
        {
          title: t('LandingPage.banner.tabTitle4'),
          desc: t('LandingPage.banner.tabDesc4'),
          link: '/docs',
          icon: '/images/landing/landing_docs_icon.png'
        }
      ]
    }
  })
  const bannerText = ref(props.bannerConfig)
  const computedTitle = computed(() => {
    const banner = bannerText.value[currentIndex.value]
    return locale.value === 'en' ? banner.title_en : banner.title
  })
  const computedDesc = computed(() => {
    const banner = bannerText.value[currentIndex.value]
    return locale.value === 'en' ? banner.description_en : banner.description
  })

  const handleTouchStart = (event) => {
    startX.value = event.touches[0].clientX
    endX.value = event.touches[0].clientX
  }

  const handleTouchMove = (event) => {
    endX.value = event.touches[0].clientX
  }
  const handleMouseDown = (event) => {
    startX.value = event.clientX
    endX.value = event.clientX
  }
  const handleMouseMove = (event) => {
    endX.value = event.clientX
  }
  const handleMouseUp = () => {
    handleTouchEnd()
  }
  const handleTouchEnd = () => {
    const deltaX = startX.value - endX.value
    if (deltaX > 50) {
      nextBanner()
    } else if (deltaX < -50) {
      preBanner()
    } else if (Math.abs(deltaX) < 10 && windowWidth.value <= 640) {
      window.location.href = bannerText.value[currentIndex.value].href
    }
  }
  const nextBanner = () => {
    currentIndex.value = (currentIndex.value + 1) % images.value.length
  }
  const preBanner = () => {
    currentIndex.value =
      (currentIndex.value - 1 + images.value.length) % images.value.length
  }

  const updateWindowWidth = () => {
    windowWidth.value = window.innerWidth
  }

  onMounted(() => {
    autoSlide()
    restartProgress()
    bannerContainer.value.addEventListener('touchstart', handleTouchStart)
    bannerContainer.value.addEventListener('touchmove', handleTouchMove)
    bannerContainer.value.addEventListener('touchend', handleTouchEnd)
    window.addEventListener('resize', updateWindowWidth)
  })

  onUnmounted(() => {
    clearInterval(timer)
    clearInterval(progressTimer)
    bannerContainer.value.removeEventListener('touchstart', handleTouchStart)
    bannerContainer.value.removeEventListener('touchmove', handleTouchMove)
    bannerContainer.value.removeEventListener('touchend', handleTouchEnd)
    window.removeEventListener('resize', updateWindowWidth)
  })
</script>
<style scoped>
  @media (min-width: 1025px) {
    .card {
      height: 98px;
      transition: height 0.3s linear;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.05); /* 黑色，5%透明 */
      background: linear-gradient(277deg, #fff 0%, #f8f8fa 100%);
    }
    .card:hover {
      justify-content: space-between;
      height: 138px;
      transition: height 0.3s linear;
      box-shadow: 0 12px 40px rgba(12, 37, 105, 0.1);
    }
    .card:hover .cardTitle {
      padding-bottom: 20px;
    }
    .cardTitle {
      padding-bottom: 0;
    }
  }
  .responsiveEnTitle {
    font-size: 48px;
    @media (max-width: 1024px) {
      font-size: 32px;
    }
    @media (max-width: 837px) {
      font-size: 24px;
    }
  }
  .bannerCard {
    @media (max-width: 390px) {
      flex-direction: column;
    }
  }
  .bannerBtn {
    background: linear-gradient(96deg, #1c8b7f 0%, #1da597 100%);
  }
  .bannerBtn:hover {
    background: linear-gradient(96deg, #4aa399 0%, #4bb7ac 100%);
  }
  .dot {
    position: relative;
    width: 8px;
    height: 8px;
    background-color: #ffffff70;
    border-radius: 9999px;
    overflow: hidden;
    cursor: pointer;
  }

  .progress-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 100%;
    background-color: #1c8b7f;
    transition: width 0.1s;
  }
  .active {
    width: 32px;
    background-color: #ffffff;
  }
</style>
