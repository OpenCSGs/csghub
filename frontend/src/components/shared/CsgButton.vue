<template>
  <button
    :class="className"
    :type="btnType"
    :disabled="loading || disabled"
    :data-disabled="loading || disabled"
  >
    <i v-if="loading" class="el-icon is-loading"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><path fill="currentColor" d="M512 64a32 32 0 0 1 32 32v192a32 32 0 0 1-64 0V96a32 32 0 0 1 32-32m0 640a32 32 0 0 1 32 32v192a32 32 0 1 1-64 0V736a32 32 0 0 1 32-32m448-192a32 32 0 0 1-32 32H736a32 32 0 1 1 0-64h192a32 32 0 0 1 32 32m-640 0a32 32 0 0 1-32 32H96a32 32 0 0 1 0-64h192a32 32 0 0 1 32 32M195.2 195.2a32 32 0 0 1 45.248 0L376.32 331.008a32 32 0 0 1-45.248 45.248L195.2 240.448a32 32 0 0 1 0-45.248zm452.544 452.544a32 32 0 0 1 45.248 0L828.8 783.552a32 32 0 0 1-45.248 45.248L647.744 692.992a32 32 0 0 1 0-45.248zM828.8 195.264a32 32 0 0 1 0 45.184L692.992 376.32a32 32 0 0 1-45.248-45.248l135.808-135.808a32 32 0 0 1 45.248 0m-452.544 452.48a32 32 0 0 1 0 45.248L240.448 828.8a32 32 0 0 1-45.248-45.248l135.808-135.808a32 32 0 0 1 45.248 0z"></path></svg></i>
    <SvgIcon
      v-if="svgName"
      :name="svgName"
      :class="['fill-current text-inherit', getIconSizeClass]"
      :style="{ color: 'currentColor' }"
      :applyColorFilter="loading || disabled || isDisabledClass"
    />
    <span v-if="name">{{ name }}</span>
  </button>
</template>

<script setup>
  import { computed } from 'vue';

  const props = defineProps({
    name: String,
    btnType: {
      type: String,
      default: "button"
    },
    class: {
      type: String,
      default: "",
    },
    svgName: {
      type: String,
      default: "",
    },
    loading: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  });

  // Map the reserved keyword 'class' to a regular variable 'className'
  const className = computed(() => props.class);

  // Check if the class contains disabled class
  const isDisabledClass = computed(() => {
    return props.class.includes('disabled');
  });

  // Calculate icon size based on button size
  const getIconSizeClass = computed(() => {
    if (props.class.includes('btn-2xl')) {
      return 'w-6 h-6'; // 24px
    } else if (props.class.includes('btn-xl')) {
      return 'w-[18px] h-[18px]'; // 18px
    } else if (props.class.includes('btn-lg')) {
      return 'w-4 h-4'; // 16px
    } else if (props.class.includes('btn-md')) {
      return 'w-3.5 h-3.5'; // 14px
    } else if (props.class.includes('btn-sm')) {
      return 'w-3 h-3'; // 12px
    } else {
      return 'w-4 h-4'; // Default size
    }
  });
</script>

<style scoped>
  /* Use stronger selectors to ensure SVG colors match button text */
  button :deep(svg),
  button :deep(svg path),
  button :deep(svg rect),
  button :deep(svg circle),
  button :deep(svg *) {
    fill: currentColor !important;
    color: inherit !important;
    stroke: currentColor !important;
  }
  
  /* Special handling for disabled state */
  button[data-disabled="true"] :deep(svg),
  button[data-disabled="true"] :deep(svg path),
  button[data-disabled="true"] :deep(svg rect),
  button[data-disabled="true"] :deep(svg circle),
  button[data-disabled="true"] :deep(svg *) {
    fill: currentColor !important;
    color: inherit !important;
    stroke: currentColor !important;
  }

  /* Add to global CSS file */
  .btn svg,
  .btn svg path,
  .btn svg rect,
  .btn svg circle,
  .btn svg * {
    fill: currentColor !important;
    color: inherit !important;
    stroke: currentColor !important;
  }
</style>
