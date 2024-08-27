<template>
  <el-tooltip class="item" effect="dark" :content="content" placement="top">
    <SvgIcon name="input_tip" class="cursor-pointer" />
  </el-tooltip>
</template>

<script setup>
  import SvgIcon from "../SvgIcon.vue"

  const props = defineProps({
    content: String
  })
</script>
