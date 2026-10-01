<template>
  <div>
    <el-tabs
      type="border-card"
      v-model="activeName"
      @tab-change="changeTab"
      class="rounded-t-md"
    >
      <el-tab-pane :label="$t('shared.edit')" name="edit">
        <Codemirror
          v-model="codeContent"
        />
      </el-tab-pane>
      <el-tab-pane :label="$t('shared.preview')" class="p-4" name="preview">
        <MarkdownViewer v-if="isMarkdown" :content="codeContent"></MarkdownViewer>
        <div v-else class="flex flex-col gap-3">
          <!-- Diff Toolbar -->
          <div
            class="flex items-center justify-between px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs"
            data-testid="diff-toolbar"
          >
            <div class="flex items-center gap-3">
              <span class="font-medium text-gray-700">{{ $t('all.changes') }}</span>
              <div class="flex items-center gap-2" data-testid="diff-stats">
                <span
                  class="text-green-700 font-medium bg-green-50 px-2 py-0.5 rounded border border-green-200"
                  data-testid="diff-additions"
                >
                  +{{ additionsCount }}
                </span>
                <span
                  class="text-red-700 font-medium bg-red-50 px-2 py-0.5 rounded border border-red-200"
                  data-testid="diff-deletions"
                >
                  -{{ deletionsCount }}
                </span>
              </div>
            </div>
            <!-- Unified vs Split Toggle -->
            <div
              class="inline-flex rounded-md shadow-xs"
              role="group"
              data-testid="diff-view-toggle"
            >
              <button
                type="button"
                @click="toggleDiffView('line-by-line')"
                :class="[
                  'px-2.5 py-1 text-xs font-medium rounded-l-md border transition-colors cursor-pointer',
                  diffViewMode === 'line-by-line'
                    ? 'bg-brand-600 text-white border-brand-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                ]"
                data-testid="toggle-unified"
              >
                {{ $t('all.unifiedDiff') }}
              </button>
              <button
                type="button"
                @click="toggleDiffView('side-by-side')"
                :class="[
                  'px-2.5 py-1 text-xs font-medium rounded-r-md border-t border-b border-r transition-colors cursor-pointer',
                  diffViewMode === 'side-by-side'
                    ? 'bg-brand-600 text-white border-brand-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                ]"
                data-testid="toggle-split"
              >
                {{ $t('all.splitDiff') }}
              </button>
            </div>
          </div>
          <div v-html="previewDiff" data-testid="diff-content"></div>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- Editor Status Bar -->
    <div
      class="flex items-center justify-between px-3.5 py-1.5 bg-gray-50 border border-t-0 border-gray-200 rounded-b-md text-xs text-gray-500"
      data-testid="editor-status-bar"
    >
      <div class="flex items-center gap-2">
        <span
          class="px-2 py-0.5 bg-gray-200 text-gray-700 rounded text-2xs font-mono font-medium"
          data-testid="detected-language"
        >
          {{ detectedLanguage }}
        </span>
        <span
          v-if="isModified"
          class="text-amber-600 font-medium text-2xs flex items-center gap-1"
          data-testid="modified-indicator"
        >
          ● {{ $t('all.modified') }}
        </span>
      </div>
      <div class="flex items-center gap-2 font-mono text-2xs text-gray-500" data-testid="editor-metrics">
        <span data-testid="editor-lines">{{ lineCount }} {{ lineCount === 1 ? $t('shared.line') : $t('shared.lines') }}</span>
        <span>·</span>
        <span data-testid="editor-chars">{{ charCount }} {{ $t('all.characters') }}</span>
      </div>
    </div>
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
const diffViewMode = ref('side-by-side')
const additionsCount = ref(0)
const deletionsCount = ref(0)

const isMarkdown = computed(() => {
  return props.fileName?.endsWith('.md')
})

const detectedLanguage = computed(() => {
  if (!props.fileName) return 'Plain Text'
  const ext = props.fileName.split('.').pop()?.toLowerCase()
  const map = {
    py: 'Python',
    js: 'JavaScript',
    jsx: 'React (JSX)',
    ts: 'TypeScript',
    tsx: 'React (TSX)',
    json: 'JSON',
    md: 'Markdown',
    yml: 'YAML',
    yaml: 'YAML',
    sh: 'Shell',
    bash: 'Bash',
    go: 'Go',
    rs: 'Rust',
    java: 'Java',
    c: 'C',
    cpp: 'C++',
    h: 'C/C++ Header',
    hpp: 'C++ Header',
    html: 'HTML',
    css: 'CSS',
    sql: 'SQL',
    dockerfile: 'Dockerfile',
    txt: 'Plain Text'
  }
  return map[ext] || (ext ? ext.toUpperCase() : 'Plain Text')
})

const lineCount = computed(() => {
  if (!codeContent.value) return 0
  return codeContent.value.split('\n').length
})

const charCount = computed(() => {
  return codeContent.value?.length || 0
})

const isModified = computed(() => {
  return (codeContent.value || '') !== (props.originalCodeContent || '')
})

const preview = () => {
  const diffString = createPatch(
    props.fileName || 'untitled file',
    props.originalCodeContent || '',
    codeContent.value || ''
  )

  const diffJson = parse(diffString)

  let addCount = 0
  let delCount = 0
  if (diffJson && diffJson.length > 0) {
    diffJson.forEach((file) => {
      addCount += file.addedLines || 0
      delCount += file.deletedLines || 0
    })
  }
  additionsCount.value = addCount
  deletionsCount.value = delCount

  const diffContent = html(diffJson, {
    drawFileList: false,
    fileListToggle: false,
    fileListStartVisible: false,
    fileContentToggle: false,
    matching: 'lines',
    outputFormat: diffViewMode.value,
    synchronisedScroll: true,
    highlight: true,
    renderNothingWhenEmpty: false,
  })

  previewDiff.value = diffContent
}

const toggleDiffView = (mode) => {
  diffViewMode.value = mode
  preview()
}

const changeTab = (tabName) => {
  if (tabName === 'preview' && !isMarkdown.value) {
    preview()
  }
}

defineExpose({
  activeName,
  diffViewMode,
  additionsCount,
  deletionsCount,
  lineCount,
  charCount,
  detectedLanguage,
  isModified,
  toggleDiffView,
  preview,
  previewDiff
})
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
    border-radius: var(--border-radius-md) var(--border-radius-md) 0 0 !important;
    border: 1px solid #EAECF0 !important;
    overflow: hidden !important;
  }

  /* 确保内容区域也有正确的圆角 */
  :deep(.el-tabs__content) {
    border-radius: 0 !important;
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
    border-radius: var(--border-radius-md) var(--border-radius-md) 0 0;
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
