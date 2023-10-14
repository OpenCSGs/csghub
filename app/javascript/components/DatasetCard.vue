<template>
  <div class="flex flex-col w-[410px] h-[290px] bg-white p-4 gap-y-4 rounded-lg border">
    <div class="flex flex-col gap-y-[4px]">
      <p class="text-xl font-semibold">{{ title }}</p>
      <p class="text-sm font-normal">开源协议：Apache License 2.0</p>
    </div>

    <div class="h-[24px] flex gap-x-[7px] text-xs leading-[20px] text-[#606266]">
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

    <div class="flex flex-wrap gap-x-[4px] h-[16px] gap-y-[4px]">
      <p class="text-[#909399] text-sm">{{ other }}</p>
<!--      <div class="flex w-[16px] h-[16px] mt-[2px]">-->
<!--        <div class="w-6/12 border-r-2 border-solid border-[#DCDFE6]"></div>-->
<!--      </div>-->
      <a href="{{url}}" class="text-sm text-yellow-700 underline">{{ url }}</a>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    type: String,
    tags: String,
    title: String,
    desc: String,
    url: String,
    other: String
  },

  data() {
    return {
      Tags: this.tags ? this.tags.split(",") : []
    };
  },

  components: {},

  mounted() {}
}
</script>
