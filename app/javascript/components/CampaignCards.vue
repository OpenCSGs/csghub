<template>
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