<template>
  <div class="border border-[#DCDFE6] rounded">
    <Codemirror
      v-model="codeContent"
    />
  </div>
</template>

<script setup>
import { Codemirror } from 'vue-codemirror'

const codeContent = defineModel()
</script>

<style scoped>
  :deep(.cm-editor) {
    border-radius: 4px;
  }

  :deep(.cm-gutters) {
    min-height: 200px !important;
  }

  :deep(.cm-focused) {
    outline: none;
  }
</style>
