<template>
    <div class="pl-[54px]">
      <div>
       <el-avatar :size="120" :src="avatar"> </el-avatar>
      </div>
      <div class="text-[24px] leading-[32px] font-semibold mb-[41px]">{{name}}</div>
      <!-- <div class="text-[16px] text-[#909399] leading-[24px] mb-[24px]">@handle</div> -->
      <EditMenu />
    </div>
</template>
<script>
import EditMenu from './EditMenu.vue'
export default {
  props: {
    name: String,
    avatar: String,
  },
  components: {
    EditMenu
  },
  data() {
    return {};
  },
  mounted() {},
};
</script>
