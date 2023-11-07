<template>
  <div class="sm:px-0 relative">
    <el-carousel :autoplay="false" height="400px">
      <el-carousel-item v-for="campaign in JSON.parse(theRecommendedCampaigns)" :key="campaign.uuid">
        <div>
          <img :src="campaign.desktop_banner_url" class="sm:hidden w-full object-cover h-[400px]" alt="OpenCSG"/>
          <img :src="campaign.mobile_banner_url" class="hidden sm:block w-full object-cover h-[400px]" alt="OpenCSG"/>
        </div>
      </el-carousel-item>
    </el-carousel>
    <div class="flex gap-3 absolute left-[80px] bottom-[45px] sm:left-[50%] sm:transform sm:translate-x-[-50%] sm:translate-y-[-50%]">
      <a href="#" class="w-[96px] h-[40px] flex items-center justify-center bg-[#409EFF] rounded text-white text-[14px] leading-[22px]">立即报名</a>
      <a href="#" class="w-[96px] h-[40px] flex items-center justify-center text-white rounded border-white border-[1px] text-[14px] leading-[22px]">了解更多</a>
    </div>
  </div>
  <div class="xl:px-[20px]">
    <CampaignCard v-for="campaign in JSON.parse(theCampaigns)"
                  :key="campaign.uuid"
                  :name="campaign.name"
                  :content="campaign.content"
                  :organizer="campaign.organizer"
                  :organizer_website="campaign.organizer_website"
                  :start_date="campaign.start_date"
                  :end_date="campaign.end_date"
                  :pageviews="campaign.pageviews"
                  :leads_count="campaign.leads_count"
    />
  </div>
  <el-pagination background
                 v-model:current-page="currentPage"
                 :default-current-page=1
                 :total="Number(theTotalCards)"
                 :page-size="6"
                 layout="prev, pager, next"
                 @update:current-page="nextPage"
                 class="my-[52px] flex justify-center"
  />
</template>

<script>
  import CampaignCard from './CampaignCard.vue'
  import { useCookies } from "vue3-cookies";
  export default {
    props: {
      campaigns: String,
      totalCards: String,
      recommendedCampaigns: String,
    },
    components: {
      CampaignCard
    },
    data() {
      return {
        cookies: useCookies().cookies,
        theCampaigns: this.campaigns,
        currentPage: 1,
        theTotalCards: this.totalCards,
        theRecommendedCampaigns: this.recommendedCampaigns
      }
    },
    mounted() {
    },
    methods: {
      async nextPage() {
        const campaignsUpdateEndpoint = `api/campaigns?page=${this.currentPage}`;
        const response = await fetch(campaignsUpdateEndpoint, {
          headers: { "Authorization": `Bearer ${this.cookies.get('idToken')}` }
        });
        response.json().then((data) => {
          this.theCampaigns = data.campaigns,
          this.theTotalCards = data.total_cards
        })
      }
    }
  }
</script>