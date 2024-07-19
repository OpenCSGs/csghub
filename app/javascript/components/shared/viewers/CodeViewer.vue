<template>
  <div class="overflow-x-auto">
    <table class="w-full text-sm code-preview">
      <tr :id="`L${index + 1}`" v-for="row, index in highlightContent.split('\n')" :key="row">
        <td class="blob-line-number w-8 text-center text-gray-300 cursor-pointer hover:text-black" :data-line-number="index + 1"></td>
        <td class="overflow-visible whitespace-pre px-3" v-html="row"></td>
      </tr>
    </table>
  </div>
</template>

<script setup>
  import { computed } from 'vue';
  import hljs from 'highlight.js';
  import 'highlight.js/styles/atom-one-light.css';

  const props = defineProps({
    content: String,
    extension: String,
  })

  const detectLanguage = () => {
    const { extension } = props;

    switch (extension) {
      case 'rb':
        return 'ruby';
      case 'gitattributes':
        return 'cal';
      case 'json':
        return 'json';
      case 'yaml':
      case 'yml':
        return 'yaml';
      case 'sh':
        return 'shell';
      case 'py':
        return 'python';
      case 'js':
        return 'javascript';
      case 'ts':
        return 'typescript';
      case 'cpp':
        return 'cpp';
      case 'c':
        return 'c';
    }
  }
  
  const highlightContent = computed(() => {
    if (detectLanguage()) {
      return hljs.highlight(props.content, { language: detectLanguage() }).value
    } else {
      return hljs.highlightAuto(props.content).value
    }
  })

</script>

<style scoped>
  .code-preview {
    font-family: 'Ubuntu Mono', monospace;
  }

  .blob-line-number::before {
    content: attr(data-line-number);
  }
</style>
