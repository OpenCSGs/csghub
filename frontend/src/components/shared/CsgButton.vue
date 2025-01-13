<template>
  <button
    :class="class"
    :type="btnType"
  >
    <SvgIcon
      v-if="svgName"
      :name="svgName"
    />
    {{ name }}
  </button>
</template>

<script setup>
  const props = defineProps({
    name: String,
    btnType: {
      type: String,
      default: "button"
    },
    class:{
      type: String,
      default: "",
    },
    svgName: {
      type: String,
      default: "",
    },
  });
</script>
