<template>
  <div class="flex flex-col p-[16px] bg-white gap-y-[15px] justify-between rounded-lg border w-full">
    <div class="max-w-[270px]">
      <img :src="logo" class="max-w-full max-h-[48px]" alt="OpenCSG Logo"/>
    </div>
    <div class="flex gap-x-[7px] text-xs leading-[20px] text-[#606266]">
      <div class="border rounded px-[8px]" v-for="tag in theTags" :key="tag">
        <span>{{ tag }}</span>
      </div>
    </div>
    <a class="leading-[20px] cursor-pointer text-[#303133] hover:text-[#409EFF] font-semibold" :href="site" target="_blank">{{ name }}</a>
    <div>
      <el-popover
          :width="378"
          trigger="hover"
          :placement="bottom"
          effect="dark"
          :content="desc"
      >
        <template #reference>
          <p class="h-[115px] leading-[23px] text-[#606266] text-sm overflow-hidden overflow-ellipsis line-clamp-2 cursor-pointer">
            {{ desc }}
          </p>
        </template>
      </el-popover>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    name: String,
    site: String,
    tags: String,
    desc: String,
    logo: String
  },

  data() {
    return {
      theTags: this.tags ? this.tags.split(",") : []
    };
  },

  components: {},

  mounted() {}
}
</script>

