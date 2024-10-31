<template>
  <div>
    <el-tabs
      type="border-card"
      v-model="activeName"
      @tab-change="changeTab"
      class="rounded"
    >
      <el-tab-pane :label="$t('shared.edit')" name="edit">
        <Codemirror
          v-model="codeContent"
        />
      </el-tab-pane>
      <el-tab-pane :label="$t('shared.preview')" class="p-4" name="preview">
        <MarkdownViewer v-if="isMarkdown" :content="codeContent"></MarkdownViewer>
        <div v-else v-html="previewDiff"></div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import MarkdownViewer from './viewers/MarkdownViewer.vue'
import { Codemirror } from 'vue-codemirror'
import { createPatch } from 'diff'
import { parse, html } from 'diff2html'
import "../../styles/codediff.css"

const props = defineProps({
  originalCodeContent: String,
  fileName: String
})

const codeContent = defineModel()

const previewDiff = ref('')
const activeName = ref('edit')

const isMarkdown = computed(() => {
  return props.fileName?.endsWith('.md')
})

const preview = () => {
  const diffString = createPatch(props.fileName || 'untitled file', props.originalCodeContent, codeContent.value)

  const diffJson = parse(diffString)

  const diffContent = html(diffJson, {
    drawFileList: false,
    fileListToggle: false,
    fileListStartVisible: false,
    fileContentToggle: false,
    matching: 'lines',
    outputFormat: 'side-by-side',
    synchronisedScroll: true,
    highlight: true,
    renderNothingWhenEmpty: false,
  })

  previewDiff.value = diffContent
}

const changeTab = (tabName) => {
  if (tabName === 'preview' && !isMarkdown.value) {
    preview()
  }
}
</script>

<style scoped>
  :deep(.cm-editor) {
    border-radius: var(--border-radius-xs);
  }

  :deep(.cm-gutters) {
    min-height: 200px !important;
  }

  :deep(.cm-focused) {
    outline: none;
  }

  :deep(.el-tabs__content) {
    padding: 0;
  }

  :deep(.el-tabs__header) {
    background-color: #F5F7FA !important;
  }

  :deep(.d2h-file-header) {
    background-color: #F5F7FA !important;
  }
</style>
