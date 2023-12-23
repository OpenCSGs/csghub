<template>
  <div class="markdown-body" v-html="mdParser.render(markdownContent)"></div>
</template>

<script setup>
  import { onMounted, ref } from 'vue';
  import MarkdownIt from 'markdown-it';
  import 'github-markdown-css';

  const props = defineProps({
    content: String,
  })

  const markdownContent = ref('')

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
    const { _metadata, content } = parseMetadata(props.content)
    markdownContent.value = content || props.content
  })

  const mdParser = new MarkdownIt({ html: true });
</script>