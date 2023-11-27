<template>
  <div class="flex min-h-[300px] sm:px-5 sm:flex-col-reverse">
    <div class="pt-4 pb-10 pr-5 break-words flex-1 markdown-body" v-html="md.render(introduction)"></div>
    <div class="p-4 w-[36%] border-l border-[#EBEEF5] sm:border-l-0 sm:border-b sm:w-full sm:pl-0">
      <div class="text-[#606266] text-base font-medium leading-[22px]">Download last month</div>
      <div class="text-[#303133] text-base font-semibold leading-6 mt-1">6558</div>
    </div>
  </div>
</template>

<script setup>
  import MarkdownIt from 'markdown-it';
  import 'github-markdown-css';

  const props = defineProps({
    introduction: String,
  });

  const md = new MarkdownIt();
</script>
