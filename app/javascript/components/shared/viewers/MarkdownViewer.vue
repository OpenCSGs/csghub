<template>
  <div class="markdown-body" v-html="mdParser.render(markdownContent)"></div>
</template>

<script setup>
  import { ref } from 'vue';
  import MarkdownIt from 'markdown-it';
  import parseMD from 'parse-md'
  import 'github-markdown-css';

  const props = defineProps({
    content: String,
  })

  const markdownContent = ref('')

  const { _metadata, content } = parseMD(props.content)
  markdownContent.value = content

  const mdParser = new MarkdownIt({ html: true });
</script>