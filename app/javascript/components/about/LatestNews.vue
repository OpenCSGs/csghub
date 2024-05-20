<template>
  <div class="flex flex-col justify-center py-[96px] md:py-[64px] text-center">
    <div class="max-w-[1280px] m-auto md:px-[16px]">
      <div class="text-[16px] leading-[24px] md:text-[14px] md:leading-[20px] text-[#223B99] mb-[8px]">
        {{ $t('landingPage.blog.subtitle') }}
      </div>
      <div class="text-[36px] leading-[44px] md:text-[30px] md:leading-[38px] text-[#101828] mb-[20px]">
        {{ $t('landingPage.blog.title') }}
      </div>
      <div class="text-[20px] leading-[30px] md:text-[18px] md:leading-[28px] text-[#475467] mb-[64px] md:mb-[48px]" >
        {{ $t('landingPage.blog.desc') }}
      </div>
      <div class="grid grid-cols-3 mb-[64px] md:grid-cols-1 gap-[32px] text-left">
        <div v-for="blog in latestNews" class="flex flex-col">
          <a :href="blog.url">
            <div class="mb-[20px] rounded-[16px]">
              <img :src="blog.image" alt="" class="w-full" />
            </div>
            <div class="text-[14px] text-[#223B99] leading-[20px] mb-[8px]">
              {{ blog.date }}
            </div>
            <div class="overflow-hidden whitespace-nowrap text-ellipsis text-[24px] mb-[8px] md:text-[20px] md:leading-[30px] text-[#101828] leading-[32px]"
                 :title="blog.title"
            >
                 {{ blog.title }}
            </div>
            <div class="text-[16px] text-[#475467] leading-[24px] font-light mb-[24px]">
              {{ blog.desc }} ...
            </div>
            <div class="flex gap-[8px] text-[14px] leading-[20px]">
              <div v-for="tag in blog.tags"
                   class="px-[10px] py-[2px] rounded-[16px] border"
                   :class="tagColor(tag)"
              >
                {{ tag }}
              </div>
            </div>
          </a>
        </div>
      </div>
      <a href="https://blog.opencsg.com/"
         target="_blank"
         class="inline md:block px-[22px] py-[16px] rounded-[8px] text-[#FFF] bg-[#32508D] border border-[32508D] cursor-pointer"
      >
        {{ $t('landingPage.blog.view_more') }}
      </a>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted } from "vue"

  const latestNews = ref([])

  onMounted(() => {
    fetchLatestNews()
  })

  const tagColor = (tag) => {
    if (tag === 'Tech') {
      return 'tech_tag'
    } else if (tag === 'AI') {
      return 'ai_tag'
    } else if (tag === 'AIGC') {
      return 'aigc_tag'
    }
  }

  const fetchLatestNews = async() => {
    res = await fetch('/internal_api/system_config/latest-news')
    if (res.ok) {
      res.json().then((data) => {
        latestNews.value = data.latest_news
      })
    } else {
      res.json().then((err) => {
        console.log(`Load latest news error: ${err.message}`)
      })
    }
  }
</script>

<style scoped>
  .tech_tag {
    border-color: #99AFFF;
    background-color: #CED8FF;
    color: #223B99;
  }
  .ai_tag {
    border-color: #C7D7FE;
    background-color: #EEF4FF;
    color: #3538CD;
  }
  .aigc_tag {
    border-color: #FCCEEE;
    background-color: #FDF2FA;
    color: #C11574;
  }
</style>