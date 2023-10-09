<template>
  <div class="grid grid-cols-3 xl:grid-cols-2 mlg:grid-cols-1 gap-[10px] justify-items-center">
    <SpaceCard v-for="space in JSON.parse(theSpaces)" 
      :key="space.star_chain_id"
      :title="space.title"
      :desc="space.desc"
      :author="space.author"
      :createdAt="space.created_at"
      :coverImage="space.cover_image"
      :tags="space.tags"
      :status="space.status"
      :starChainId="space.star_chain_id"
      :spaceType="space.space_type"
    />
  </div>
  <el-pagination background
                 v-model:current-page="currentPage"
                 :default-current-page=1
                 :total="Number(totalCards)"
                 :page-size="6"
                 layout="prev, pager, next"
                 @update:current-page="reloadCards"
                 class="my-[52px] flex justify-center"
  />
</template>

<script>
  import SpaceCard from './SpaceCard.vue'
  import { useCookies } from "vue3-cookies";
  export default {
    props: {
      spaces: String,
      totalCards: String
    },
    components: {
      SpaceCard
    },
    data() {
      return {
        cookies: useCookies().cookies,
        theSpaces: this.spaces,
        currentPage: 1
      }
    },
    mounted() {
    },
    methods: {
      async reloadCards() {
        const spaceUpdateEndpoint = `api/spaces?page=${this.currentPage}`;
        const response = await fetch(spaceUpdateEndpoint, {
          headers: {
            "Authorization": this.cookies.get('idToken'),
          },
         });
        response.json().then((data) => {
          this.theSpaces = data.spaces
        })
      }
    }
  }
</script>