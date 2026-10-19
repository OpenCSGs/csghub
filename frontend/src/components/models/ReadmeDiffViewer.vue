<template>
  <div class="readme-diff-viewer">
    <el-skeleton v-if="loading" :rows="8" animated />

    <div v-else-if="!readmeA && !readmeB" class="py-12">
      <el-empty :description="$t('shared.noData') || 'No README / Model Card files available for comparison'" />
    </div>

    <div v-else class="space-y-4">
      <!-- Missing file warning -->
      <el-alert
        v-if="!readmeA"
        type="warning"
        :closable="false"
        show-icon
        title="Baseline (Version A) does not contain a README.md / Model Card"
        class="mb-2"
      />
      <el-alert
        v-if="!readmeB"
        type="warning"
        :closable="false"
        show-icon
        title="Target (Version B) does not contain a README.md / Model Card"
        class="mb-2"
      />

      <!-- Controls -->
      <div class="flex items-center justify-between flex-wrap gap-4 pb-3 border-b border-gray-200">
        <div class="flex items-center gap-2">
          <span class="text-sm font-medium text-gray-700">Model Card Diff:</span>
          <el-tag size="small" type="success" effect="plain" v-if="summary.additions">
            +{{ summary.additions }} lines added
          </el-tag>
          <el-tag size="small" type="danger" effect="plain" v-if="summary.deletions">
            -{{ summary.deletions }} lines removed
          </el-tag>
        </div>

        <el-radio-group v-model="displayMode" size="small">
          <el-radio-button value="unified" label="unified">Unified Diff</el-radio-button>
          <el-radio-button value="split" label="split">Split View</el-radio-button>
          <el-radio-button value="rendered" label="rendered">Rendered Target</el-radio-button>
        </el-radio-group>
      </div>

      <!-- Unified Diff View -->
      <div v-if="displayMode === 'unified'" class="diff-container font-mono text-xs rounded border border-gray-200 overflow-x-auto bg-gray-950 text-gray-100 p-4 leading-relaxed">
        <div
          v-for="(line, idx) in unifiedLines"
          :key="idx"
          :class="[
            'flex items-start py-0.5 px-2 rounded-sm text-xs font-mono',
            line.type === 'add' ? 'bg-green-950/80 text-green-300 font-semibold' : '',
            line.type === 'delete' ? 'bg-red-950/80 text-red-300 font-semibold opacity-90' : '',
            line.type === 'same' ? 'text-gray-400 opacity-80' : ''
          ]"
        >
          <span class="select-none w-10 text-right pr-3 text-gray-500 text-[11px] shrink-0">{{ line.lineNoA || '' }}</span>
          <span class="select-none w-10 text-right pr-3 text-gray-500 text-[11px] shrink-0">{{ line.lineNoB || '' }}</span>
          <span class="select-none w-4 text-center text-gray-400 shrink-0">{{ line.type === 'add' ? '+' : line.type === 'delete' ? '-' : ' ' }}</span>
          <span class="whitespace-pre-wrap break-all flex-1">{{ line.text }}</span>
        </div>
      </div>

      <!-- Split View -->
      <div v-else-if="displayMode === 'split'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Version A Column -->
        <div class="border border-gray-200 rounded overflow-hidden">
          <div class="bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-700 border-b border-gray-200">
            Version A (Baseline)
          </div>
          <div class="p-4 font-mono text-xs overflow-x-auto bg-gray-900 text-gray-200 max-h-[500px] overflow-y-auto">
            <div
              v-for="(line, idx) in splitLines.colA"
              :key="idx"
              :class="[
                'py-0.5 px-2 rounded-sm whitespace-pre-wrap break-all',
                line.type === 'delete' ? 'bg-red-950 text-red-300' : 'text-gray-300'
              ]"
            >
              <span class="select-none inline-block w-8 opacity-50 text-right mr-2">{{ line.lineNo || '' }}</span>
              <span>{{ line.text }}</span>
            </div>
          </div>
        </div>

        <!-- Version B Column -->
        <div class="border border-gray-200 rounded overflow-hidden">
          <div class="bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-700 border-b border-gray-200">
            Version B (Target)
          </div>
          <div class="p-4 font-mono text-xs overflow-x-auto bg-gray-900 text-gray-200 max-h-[500px] overflow-y-auto">
            <div
              v-for="(line, idx) in splitLines.colB"
              :key="idx"
              :class="[
                'py-0.5 px-2 rounded-sm whitespace-pre-wrap break-all',
                line.type === 'add' ? 'bg-green-950 text-green-300' : 'text-gray-300'
              ]"
            >
              <span class="select-none inline-block w-8 opacity-50 text-right mr-2">{{ line.lineNo || '' }}</span>
              <span>{{ line.text }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Rendered Target View -->
      <div v-else class="p-4 border border-gray-200 rounded bg-white">
        <MarkdownViewer :content="readmeB || readmeA || ''" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { diffLines } from 'diff'
import MarkdownViewer from '../shared/viewers/MarkdownViewer.vue'

const props = defineProps({
  readmeA: String,
  readmeB: String,
  loading: Boolean
})

const displayMode = ref('unified')

const diffParts = computed(() => {
  const textA = props.readmeA || ''
  const textB = props.readmeB || ''
  return diffLines(textA, textB)
})

const summary = computed(() => {
  let additions = 0
  let deletions = 0

  diffParts.value.forEach((part) => {
    const lineCount = (part.value.match(/\n/g) || []).length || (part.value ? 1 : 0)
    if (part.added) additions += lineCount
    if (part.removed) deletions += lineCount
  })

  return { additions, deletions }
})

const unifiedLines = computed(() => {
  const result = []
  let lineNoA = 1
  let lineNoB = 1

  diffParts.value.forEach((part) => {
    const rawLines = part.value.split('\n')
    // Remove trailing empty line if it resulted from ending newline split
    if (rawLines.length > 1 && rawLines[rawLines.length - 1] === '') {
      rawLines.pop()
    }

    rawLines.forEach((text) => {
      if (part.added) {
        result.push({
          type: 'add',
          lineNoA: null,
          lineNoB: lineNoB++,
          text
        })
      } else if (part.removed) {
        result.push({
          type: 'delete',
          lineNoA: lineNoA++,
          lineNoB: null,
          text
        })
      } else {
        result.push({
          type: 'same',
          lineNoA: lineNoA++,
          lineNoB: lineNoB++,
          text
        })
      }
    })
  })

  return result
})

const splitLines = computed(() => {
  const colA = []
  const colB = []

  let lineNoA = 1
  let lineNoB = 1

  diffParts.value.forEach((part) => {
    const rawLines = part.value.split('\n')
    if (rawLines.length > 1 && rawLines[rawLines.length - 1] === '') {
      rawLines.pop()
    }

    rawLines.forEach((text) => {
      if (part.added) {
        colB.push({ type: 'add', lineNo: lineNoB++, text })
      } else if (part.removed) {
        colA.push({ type: 'delete', lineNo: lineNoA++, text })
      } else {
        colA.push({ type: 'same', lineNo: lineNoA++, text })
        colB.push({ type: 'same', lineNo: lineNoB++, text })
      }
    })
  })

  return { colA, colB }
})
</script>

<style scoped>
.diff-container {
  max-height: 500px;
  overflow-y: auto;
}
</style>
