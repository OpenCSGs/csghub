<template>
  <div class="flex min-h-[300px] md:px-5 md:flex-col-reverse">
    <div class="max-w-[80%] sm:max-w-[100%] pt-4 pb-10 pr-5 sm:pr-0 break-words flex-1 markdown-body border-t border-[#EBEEF5] md:border-t-0" v-html="mdParser.render(markdownContent)"></div>
    <div class="p-4 w-[20%] border-l border-[#EBEEF5] md:border-l-0 md:border-b md:w-full md:pl-0">
      <div class="text-[#606266] text-base font-medium leading-[22px]">下载量</div>
      <div class="text-[#303133] text-base font-semibold leading-6 mt-1">{{ downloadCount }}</div>
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import MarkdownIt from 'markdown-it';
  import parseMD from 'parse-md'
  import 'github-markdown-css';

  const props = defineProps({
    readme: String,
    downloadCount: Number,
  })

  const markdownContent = ref('')
  const defaultText = '```\nREADME文件内容为空，请下载文件，补充描述内容。\n```'

  const { _metadata, content } = parseMD(props.readme)
  markdownContent.value = content || defaultText

  const mdParser = new MarkdownIt({ html: true })
</script>
