<template>
  <button
    :class="btnClass"
    :type="btnType"
    :disabled="disabled || loading || hasDisabledClass"
  >
    <i v-if="loading" class="el-icon is-loading"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><path fill="currentColor" d="M512 64a32 32 0 0 1 32 32v192a32 32 0 0 1-64 0V96a32 32 0 0 1 32-32m0 640a32 32 0 0 1 32 32v192a32 32 0 1 1-64 0V736a32 32 0 0 1 32-32m448-192a32 32 0 0 1-32 32H736a32 32 0 1 1 0-64h192a32 32 0 0 1 32 32m-640 0a32 32 0 0 1-32 32H96a32 32 0 0 1 0-64h192a32 32 0 0 1 32 32M195.2 195.2a32 32 0 0 1 45.248 0L376.32 331.008a32 32 0 0 1-45.248 45.248L195.2 240.448a32 32 0 0 1 0-45.248zm452.544 452.544a32 32 0 0 1 45.248 0L828.8 783.552a32 32 0 0 1-45.248 45.248L647.744 692.992a32 32 0 0 1 0-45.248zM828.8 195.264a32 32 0 0 1 0 45.184L692.992 376.32a32 32 0 0 1-45.248-45.248l135.808-135.808a32 32 0 0 1 45.248 0m-452.544 452.48a32 32 0 0 1 0 45.248L240.448 828.8a32 32 0 0 1-45.248-45.248l135.808-135.808a32 32 0 0 1 45.248 0z"></path></svg></i>
    <SvgIcon
      v-if="svgName"
      :name="svgName"
      :disabled="isDisabled"
    />
    {{ name }}
  </button>
</template>

<script setup>
  import { computed } from 'vue'

  const props = defineProps({
    name: String,
    btnType: {
      type: String,
      default: 'button'
    },
    class: {
      type: String,
      default: ''
    },
    svgName: {
      type: String,
      default: "",
    },
    link: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: ""
    }
  });

  const hasDisabledClass = computed(() => {
    return props.class.includes('disabled');
  });

  const isDisabled = computed(() => {
    return props.disabled || props.loading || hasDisabledClass.value;
  });

  const btnClass = computed(() => {
    if (props.link) {
      return `is-link ${props.class}`
    }

    return props.class
  })
</script>

<style scoped>
  .is-link {
    border-color: transparent;
    background: transparent;
    padding: 2px;
    height: auto;
  }
  
  .disabled-svg :deep(svg path),
  .disabled-svg :deep(svg) {
    stroke: var(--Gray-400) !important;
    fill: var(--Gray-400) !important;
  }
  
  .btn-secondary-gray.disabled :deep(svg path),
  .btn-secondary-gray.disabled :deep(svg) {
    stroke: var(--Gray-400) !important;
    fill: var(--Gray-400) !important;
  }
  
  .btn-secondary-gray[disabled] :deep(svg path),
  .btn-secondary-gray[disabled] :deep(svg) {
    stroke: var(--Gray-400) !important;
    fill: var(--Gray-400) !important;
  }
</style>
