<template>
  <div class="flex justify-between">
    <h3 class="pl-[10px] xl:pl-[25px] mb-[20px] font-semibold text-xl">{{ $t('space.SpaceList') }}</h3>
    <el-select v-if="isLoggedInBoolean"
               v-model="filterValue"
               @change="reloadCards"
               class="w-[100px] xl:mr-[20px]">
      <el-option v-for="item in filterValues"
                 :key="item.value"
                 :label="$i18n.locale === 'zh'? item.label: item.label_en"
                 :value="item.value"
                 :disabled="item.disabled"/>
    </el-select>
  </div>
  <div class="grid grid-cols-3 xl:grid-cols-2 mlg:grid-cols-1 gap-[20px] justify-items-center xl:px-[20px]">
    <SpaceCard v-for="space in JSON.parse(theSpaces)"
      :key="space.star_chain_id"
      :title="space.title"
      :desc="space.desc"
      :author="space.author"
      :current-user-login-identity="currentUserLoginIdentity"
      :createdAt="space.created_at"
      :coverImage="space.cover_image"
      :tags="space.tags"
      :status="space.status"
      :starChainId="space.star_chain_id"
      :spaceType="space.space_type"
      :authorUuid="space.author_uuid"
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
  import SpaceCard from './SpaceCard.vue'
  import { useCookies } from "vue3-cookies";
  export default {
    props: {
      spaces: String,
      totalCards: String,
      isLoggedIn: String,
      currentUserLoginIdentity: String
    },
    components: {
      SpaceCard
    },
    data() {
      return {
        cookies: useCookies().cookies,
        theSpaces: this.spaces,
        currentPage: 1,
        isLoggedInBoolean: JSON.parse(this.isLoggedIn.toLowerCase()),
        filterValue: "all",
        theTotalCards: this.totalCards,
        filterValues: [
          {
            value: 'all',
            label: '全部应用',
            label_en: 'All Space'
          },
          {
            value: 'mine',
            label: '我的应用',
            label_en: 'My Space'
          }
        ]
      }
    },
    mounted() {
      console.log(this.$t('space.AllSpace'))
    },
    methods: {
      async nextPage() {
        const spaceUpdateEndpoint = `/internal_api/spaces?page=${this.currentPage}`;
        const response = await fetch(spaceUpdateEndpoint);
        response.json().then((data) => {
          this.theSpaces = data.spaces,
          this.theTotalCards = data.total_cards
        })
      },
      async reloadCards() {
        this.cookies.set('mySpaces', this.filterValue === 'mine');
        const response = await fetch('/internal_api/spaces');
        response.json().then((data) => {
          this.currentPage = 1
          this.theSpaces = data.spaces
          this.theTotalCards = data.total_cards
        })
      }
    }
  }
</script>