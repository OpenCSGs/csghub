<template>
  <div class="markdown-body overflow-auto" v-html="mdParser.render(markdownContent)"></div>
</template>

<script setup>
  import { ref } from 'vue';
  import MarkdownIt from 'markdown-it';
  import parseMD from 'parse-md'
  import 'github-markdown-css';

  const props = defineProps({
    content: String,
    setDefaultText: Boolean
  })

  const defaultText = '```\nREADME文件内容为空，请下载文件，补充描述内容。\n```'

  const markdownContent = ref('')

  const { _metadata, content } = parseMD(props.content)

  markdownContent.value = props.setDefaultText ? (content.trim() || defaultText) : content

  const mdParser = new MarkdownIt({ html: true });
</script>