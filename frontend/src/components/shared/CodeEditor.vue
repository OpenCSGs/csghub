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
    min-height: 600px !important;
  }

  :deep(.cm-focused) {
    outline: none;
  }

  :deep(.el-tabs__content) {
    padding: 0;
  }

  :deep(.el-tabs__header) {
    background-color: #F2F4F7 !important;
    border-radius: var(--border-radius-md) var(--border-radius-md) 0 0 !important;
  }

  :deep(.d2h-file-header) {
    background-color: #F2F4F7 !important;
  }

  :deep(.el-tabs__nav-scroll) {
    background-color: #F2F4F7 !important;
    border-radius: var(--border-radius-md) var(--border-radius-md) 0 0 !important;
  }

  :deep(.el-tabs) {
    border-radius: var(--border-radius-md) !important;
    border: 1px solid #EAECF0 !important;
    overflow: hidden !important;
  }

  /* 确保内容区域也有正确的圆角 */
  :deep(.el-tabs__content) {
    border-radius: 0 0 var(--border-radius-md) var(--border-radius-md) !important;
    background-color: white !important;
  }

  /* 使用伪元素创建更精确的边框效果 */
  :deep(.el-tabs) {
    position: relative !important;
  }

  :deep(.el-tabs::before) {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: 1px solid #EAECF0;
    border-radius: var(--border-radius-md);
    pointer-events: none;
    z-index: 1;
  }

  /* 确保内部元素不会覆盖边框 */
  :deep(.el-tabs__header),
  :deep(.el-tabs__content) {
    position: relative;
    z-index: 2;
  }

  /* 设置标签页字体颜色 */
  :deep(.el-tabs__item.is-top) {
    color: #344054 !important;
    font-size: 14px !important;
    font-weight: 500 !important;
  }

  :deep(.el-tabs__item.is-top:hover) {
    color: #344054 !important;
    font-size: 14px !important;
    font-weight: 500 !important;
  }

  :deep(.el-tabs__item.is-top.is-active) {
    color: #3250BD !important;
    font-size: 14px !important;
    font-weight: 500 !important;
  }
</style>
