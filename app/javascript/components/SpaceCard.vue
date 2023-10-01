<template>
  <div class="mt-4 h-[311px] w-[416px] rounded bg-gray-50 p-4">
    <div class="flex justify-between items-center mb-1">
      <h3 class="text-[#303133] font-semibold leading-6">{{ title }}</h3>
      <SpaceRunning v-if="status === 'running'" />
      <SpaceStopped v-else />
    </div>
    <div class="text-sm leading-snug text-[#606266] flex justify-between">
      <p>
        <span class="mr-2">{{author}}</span>
        <span class="mr-2">·</span>
        <span>{{createdAt}}</span>
      </p>
      <SpaceEdit :title="title" />
    </div>
    <div class="mt-2">
      <img :src="coverImage" />
    </div>
    <div class="flex gap-2 my-2 flex-wrap">
      <p v-for="tag in JSON.parse(tags)" class="rounded px-2 h-4 flex items-center text-xs bg-[#E7F4F6]">
        <span :class="[`text-[${tag.color}]`]"> {{ tag.name }}</span>
      </p>
    </div>
    <el-popover
      placement="top-start"
      :width="384"
      trigger="hover"
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

export default {
  props: {
    title: String,
    desc: String,
    author: String,
    createdAt: String,
    coverImage: String,
    tags: Object,
    status: String
  },
  components: {
    SpaceRunning,
    SpaceStopped,
    SpaceEdit
  },
  mounted() {
    console.log(this.tags)
  }
}
</script>