<template>
  <div class="border border-[#DCDFE6] rounded">
    <Codemirror
      :modelValue="modelValue"
      @change="onChange"
      :options="options"
      :autofocus="true"
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

const options = {
  line: true,
  tabSize: 2, // 制表符的宽度
  indentUnit: 2, // 一个块应该缩进多少个空格，默认值为 2
  firstLineNumber: 1, // 从哪个数字开始计算行数，默认值为 1
  smartIndent: true, // 上下文缩进
  lineNumbers: false, // 是否显示行号
  styleActiveLine: true, // 高亮选中行
  viewportMargin: Infinity, //处理高度自适应时搭配使用
  showCursorWhenSelecting: true, // 当选择处于活动状态时是否应绘制游标
  autofocus: true, // 自动获取焦点
}

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
