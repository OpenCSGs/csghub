<template>
  <div class="grid grid-cols-3 xl:grid-cols-2 mlg:grid-cols-1 gap-[10px] justify-items-center min-h-[664px]">
    <SpaceCard v-for="space in JSON.parse(theSpaces)" 
      :title="space.title"
      :desc="space.desc"
      :author="space.author"
      :createdAt="space.created_at"
      :coverImage="space.cover_image"
      :tags="space.tags"
      :status="space.status"
      :starChainId="space.space_starchain_id"
      :spaceType="space.readable_type"
    />
  </div>
</template>

<script>
  import SpaceCard from './SpaceCard.vue'
  export default {
    props: {
      spaces: String
    },
    components: {
      SpaceCard
    },
    data() {
      return {
        theSpaces: this.spaces
      }
    },
    mounted() {
      console.log(JSON.parse(this.theSpaces))
    }
  }
</script>