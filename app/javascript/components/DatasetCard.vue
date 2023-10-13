<template>
  <div class="flex flex-col w-[410px] h-[241px] bg-white p-4 gap-y-4 rounded-lg border">
    <div class="flex flex-col gap-y-[4px]">
      <p class="text-xl font-semibold">{{ title }}</p>
      <p class="text-sm font-normal">{{ name }}</p>
    </div>

    <div class="flex gap-x-[7px] text-xs leading-[20px] text-[#606266]">
      <div v-for="tag in Tags" :key="tag" class="border rounded px-[8px]" >
        <span>{{ tag }}</span>
      </div>
    </div>

    <!--desc-->
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

    <div class="flex gap-x-[4px] h-[16px] text-sm font-normal text-[#909399]">
      <p>数据集作者</p>
      <div class="flex w-[16px] h-[16px] mt-[2px]">
        <div class="w-6/12 border-r-2 border-solid border-[#DCDFE6]"></div>
      </div>
      <p>{{ create_at }}</p>
    </div>

  </div>
</template>

<script>
export default {
  props: {
    name: String,
    type: String,
    tags: String,
    title: String,
    desc: String,
    create_at: String
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
