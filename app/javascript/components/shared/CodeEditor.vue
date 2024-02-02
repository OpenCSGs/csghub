<template>
  <div class="border border-[#DCDFE6] rounded">
    <Codemirror
      :modelValue="modelValue"
      @change="onChange"
    />
  </div>
</template>

<script setup>
import { defineEmits } from 'vue'
import { Codemirror } from 'vue-codemirror'

const props = defineProps({
  modelValue: String
})

const emits = defineEmits(['update:modelValue'])

const onChange = (code) => {
  if (props.modelValue !== code) {
    emits('update:modelValue', code)
  }
}
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
