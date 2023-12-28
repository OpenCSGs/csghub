<template>
  <div class="flex min-h-[300px] md:px-5 md:flex-col-reverse">
    <div class="max-w-[80%] pt-4 pb-10 pr-5 break-words flex-1 markdown-body border-t border-[#EBEEF5] md:border-t-0" v-html="mdParser.render(markdownContent)"></div>
    <div class="p-4 w-[20%] border-l border-[#EBEEF5] md:border-l-0 md:border-b md:w-full md:pl-0">
      <div class="text-[#606266] text-base font-medium leading-[22px]">月下载量</div>
      <div class="text-[#303133] text-base font-semibold leading-6 mt-1">{{ downloadCount }}</div>
    </div>
  </div>
</template>

<script setup>
  import { onMounted, ref } from 'vue';
  import MarkdownIt from 'markdown-it';
  import 'github-markdown-css';

  const props = defineProps({
    readme: String,
    downloadCount: Number,
  })

  const markdownContent = ref('')
  const defaultText = '```\nREADME文件内容为空，请下载文件，补充描述内容。\n```'

  const parseMetadata = (input) => {
    if (!input.trim().startsWith('---\n')) {
      return {
        metadata: '',
        content: input
      }
    }

    const separator = '---\n'
    const [_, metadata, content] = input.split(separator, 3)

    return {
      metadata,
      content
    }
  }

  onMounted(() => {
    const { _metadata, content } = parseMetadata(props.readme)
    markdownContent.value = content.trim() || defaultText
  })

  const mdParser = new MarkdownIt({ html: true })
</script>
