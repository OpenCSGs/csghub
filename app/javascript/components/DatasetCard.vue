<template>
  <div class="flex flex-col w-[410px] h-[270px] bg-white p-4 gap-y-4 rounded-lg border">
    <div class="flex flex-col gap-y-[4px]">
      <p class="text-xl font-semibold">{{ title }}</p>
      <p class="text-sm font-normal">{{ protocol }}</p>
    </div>

    <div v-if="Tags.length !== 0" class="h-[24px] flex gap-x-[7px] text-xs leading-[20px] text-[#606266]">
      <div v-for="tag in Tags" :key="tag" class="border rounded px-[8px]" >
        <span>{{ tag }}</span>
      </div>
    </div>

    <el-popover
        :width="378"
        trigger="hover"
        :placement="bottom"
        effect="dark"
        :content="desc"
    >
      <template #reference>
        <p class="h-[69px] leading-[23px] text-[#606266] text-sm overflow-hidden overflow-ellipsis line-clamp-3 cursor-pointer">
          {{ desc }}
        </p>
      </template>
    </el-popover>

    <div class="flex flex-col gap-x-[4px] h-[16px] gap-y-[4px]">
      <p v-if="other.length !== 0" class="text-[#909399] text-sm">{{ other }}</p>
      <a href="{{url}}" class="text-base text-yellow-700 underline">下载</a>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    type: String,
    tags: String,
    protocol: String,
    title: String,
    desc: String,
    url: String,
    other: String
  },

  data() {
    return {
      Tags: this.tags ? this.tags.split(",") : [],
    };
  },

  components: {},

  mounted() {
    console.log(this.Tags)
  }
}
</script>
