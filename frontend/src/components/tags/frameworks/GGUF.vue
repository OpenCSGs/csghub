<template>
  <span class="flex gap-1 items-center text-sm font-normal text-gray-700 bg-white border border-gray-300 px-2 py-1 rounded-sm cursor-pointer hover:bg-gray-50"
        :style="setTagColor()"
        @click="toggleActive"
  >
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5114 3.90998H2.96882V3.9448V10.0276V10.4982H3.4394H7.49211H7.9627V10.0276V6.98763V6.95092H7.96364V6.48033V3.9448V3.47422H7.49305H3.4394H2.98199V3.43939V2.89539H13.0206V3.43939V3.90998H13.4912H14.118V12.0907H13.4912H13.0338V12.0559V9.01304V8.97633H13.0347V8.50575V5.97304V5.50245H12.5641H8.50858H8.03806L8.03799 5.97297L8.03705 12.0558L8.03698 12.5265H8.50764H12.5632H13.0206V12.5613V13.1053H2.98199V12.5613V12.0907H2.5114H1.8827V3.90998H2.5114ZM6.00976 6.48033V6.51704H5.46764H4.99705V6.98763V8.00033V8.47092H5.46764H6.00976V8.54245H4.92458V5.43092H6.00976V6.48033ZM11.078 8.50575V8.54245H10.5349H10.0643V9.01304V10.0276V10.4982H10.5349H11.078V10.5697H9.99093V7.45822H11.078V8.50575Z" fill="black" stroke="black" stroke-width="0.941177"/></svg>
    GGUF
  </span>
</template>
<script setup>
  const props = defineProps({
    active: Boolean
  })

  const emit = defineEmits(['setActiveFrameworkTag'])

  const toggleActive = () => {
    emit('setActiveFrameworkTag', 'framework', 'gguf')
  }

  const setTagColor = () => {
    if (props.active) {
      return "color: white; background-color: #4D6AD6"
    }
  }
</script>