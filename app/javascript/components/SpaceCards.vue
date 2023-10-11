<template>
  <div class="flex justify-between">
    <h3 class="pl-4 font-semibold text-xl">Space 列表</h3>
    <el-select v-if="isLoggedInBoolean"
               v-model="filterValue"
               @change="reloadCards"
               class="w-[100px]"
    >
      <el-option
        v-for="item in filterValues"
        :key="item.value"
        :label="item.label"
        :value="item.value"
        :disabled="item.disabled"
      />
    </el-select>
  </div>
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
      isLoggedIn: String
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
        filterValues: [
          {
            value: 'all',
            label: '全部应用'
          },
          {
            value: 'mine',
            label: '我的应用'
          }
        ]
      }
    },
    mounted() {
    },
    methods: {
      async nextPage() {
        const spaceUpdateEndpoint = `api/spaces?page=${this.currentPage}`;
        const response = await fetch(spaceUpdateEndpoint, {
          headers: {
            "Authorization": this.cookies.get('idToken'),
          },
         });
        response.json().then((data) => {
          this.theSpaces = data.spaces
        })
      },
      async reloadCards() {
        if (this.filterValue === 'mine') {
          this.cookies.set('mySpaces', true)
        } else {
          this.cookies.set('mySpaces', false)
        }
        const response = await fetch('api/spaces', {
          headers: {
            "Authorization": this.cookies.get('idToken'),
          },
         });
        response.json().then((data) => {
          this.currentPage = 1
          this.theSpaces = data.spaces
        })
      }
    }
  }
</script>