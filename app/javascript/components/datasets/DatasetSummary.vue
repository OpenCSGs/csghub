<template>
  <div class="flex min-h-[300px] md:px-5 md:flex-col-reverse">
    <div class="pt-4 pb-10 pr-5 break-words flex-1 markdown-body border-t border-b border-[#EBEEF5] md:border-t-0" v-html="mdParser.render(introduction)"></div>
    <div class="py-4 w-[36%] border-l border-[#EBEEF5] md:border-l-0 md:border-b md:w-full md:pl-0">
      <div class="text-[#606266] text-base font-medium leading-[22px] pl-4 md:pl-0">Download last month</div>
      <div class="text-[#303133] text-base font-semibold leading-6 mt-1 pl-4 md:pl-0">{{ downloadCount }}</div>
      <DatasetClone />
    </div>
  </div>
</template>

<script setup>
  import DatasetClone from './DatasetClone.vue';
  import MarkdownIt from 'markdown-it';
  import 'github-markdown-css';

  const props = defineProps({
    introduction: String,
    downloadCount: Number,
  });

  const mdParser = new MarkdownIt();
</script>
