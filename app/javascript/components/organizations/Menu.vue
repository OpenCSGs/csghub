<template>
    <div class="border-r border-[#EAECF0]">
      <div class="w-[294px] rounded-[8px] mx-[24px] py-[24px]">
        <div class="flex p-[16px] pt-[16px]">
          <el-avatar :size="60" :src="avatar"> </el-avatar>
          <div class="ml-[10px]">
            <div class="text-[24px] leading-[32px] font-semibold">
              <a>
                ccececece
              </a>
            </div>
            <div class="text-[16px] text-[#909399] leading-[24px]">@2222222222222222222</div>
          </div>
        </div>
        <div class="p-[16px] text-[20px] leading-[30px] text-[#344054]">组织设置</div>
        <div class="flex flex-col">
          <a href="/org"
             class="py-[8px] px-[12px] hover:bg-[#FAFAFA] text-[16px] text-[#667085] leading-[24px] cursor-pointer"
             :class="menuClass('/org')"
          >
              组织信息
          </a>
        </div>
      </div>
    </div>
</template>
<script>
export default {
  props: {},
  data() {
    return {}
  },
  mounted() {},
  methods: {
    menuClass(menuPath) {
      if (menuPath === window.location.pathname) {
        return 'text-[#303133] font-semibold bg-[#FAFAFA]'
      } else {
        return ''
      }
    }
  }
};
</script>
