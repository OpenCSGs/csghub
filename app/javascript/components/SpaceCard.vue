<template>
  <div class="mt-4 h-[311px] w-[416px] rounded bg-gray-50 p-4">
    <div class="flex justify-between items-center mb-1">
      <div class="flex items-center">
        <h3 class="max-w-[150px] text-[#303133] font-semibold leading-6 truncate mr-[15px]">{{ title }}</h3>
        <span v-if="spaceTypes === 'private'" class="h-[16px] w-[50px] flex items-center justify-center rounded-[100px] bg-[#CDD0D6] text-[#606266] text-[12px]">{{ spaceTypes }}</span>
      </div>
      <SpaceRunning v-if="status === 'running'" />
      <SpaceStopped v-else />
    </div>
    <div class="text-sm leading-snug text-[#606266] flex justify-between">
      <p>
        <span class="mr-2">{{author}}</span>
        <span class="mr-2">·</span>
        <span>{{createdAt}}</span>
      </p>
      <SpaceEdit v-if="authorUuid === currentAuthor"
                 :title="title"
                 :tags="tags"
                 :star-chain-id="starChainId"
                 :raw-image-url="coverImageUrl"
                 :space-type="spaceType"
                 @retriveSpaceCard="retriveSpaceCard"
      />
    </div>
    <div class="mt-2">
      <img :src="coverImageUrl" @click="toSpaceDetail" class="h-[147px] w-full object-cover rounded cursor-pointer hover:opacity-50" />
    </div>
    <div class="flex gap-2 my-2 overflow-x-auto no-scrollbar">
      <p v-for="tag in JSON.parse(spaceTags)"
         class="rounded px-2 h-4 flex items-center text-xs bg-[#E7F4F6] mr-2 whitespace-nowrap"
         :key="tag.name"
      >
        <span :class="[`text-[${tag.color}]`]"> {{ tag.name }}</span>
      </p>
    </div>
    <el-popover
      :width="384"
      trigger="hover"
      :placement="bottom"
      effect="dark"
      :content="desc"

    >
      <template #reference>
        <p class="h-[40px] text-[#606266] text-sm overflow-hidden overflow-ellipsis line-clamp-2">
          {{ desc }}
        </p>
      </template>
    </el-popover>
  </div>
</template>

<script>
import SpaceRunning from './sub/SpaceRunning.vue'
import SpaceStopped from './sub/SpaceStopped.vue'
import SpaceEdit from './sub/SpaceEdit.vue'
import { useCookies } from "vue3-cookies";

export default {
  props: {
    title: String,
    desc: String,
    author: String,
    createdAt: String,
    coverImage: String,
    tags: String,
    status: String,
    starChainId: String,
    spaceType: String,
    authorUuid: String
  },

  data() {
    return {
      coverImageUrl: this.coverImage,
      spaceTags: this.tags,
      spaceTypes: this.spaceType,
      currentAuthor: useCookies().cookies.get('authingUuid')
    };
  },

  components: {
    SpaceRunning,
    SpaceStopped,
    SpaceEdit
  },

  mounted() {
  },

  methods: {
    async retriveSpaceCard(data) {
      // leave here for a reference
      //const spaceUpdateEndpoint = `api/spaces/${this.starChainId}`;
      //const response = await fetch(spaceUpdateEndpoint, {
      //  headers: {
      //    "Authorization": this.cookies.get('idToken'),
      //  },
      // });
      //response.json().then((data) => {
      //  this.spaceTags = data.tags
      //  console.log(data.tags)
      //  console.log(data.cover_image)
      //  this.coverImageUrl = data.cover_image
      //})
      if (data.tags != undefined) {
        this.spaceTags = data.tags
      }
      if (data.cover_image != undefined) {
        this.coverImageUrl = data.cover_image
      }
      if (this.spaceTypes != data.space_type) {
        this.spaceTypes = data.space_type
      }
    },
    toSpaceDetail() {
      window.location.pathname = `/spaces/${this.starChainId}`
    }
  }
}
</script>
