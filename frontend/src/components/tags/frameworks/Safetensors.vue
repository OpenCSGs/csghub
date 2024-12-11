<template>
  <span class="flex gap-1 items-center text-sm font-normal text-gray-700 bg-white border border-gray-300 px-2 py-1 rounded-sm cursor-pointer hover:bg-gray-50"
        :style="setTagColor()"
        @click="toggleActive"
  >
    <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_3946_96106)"><path d="M14.991 7.719l.0002.0001c.12.048.223.13.295.237l.0001.0001c.073.107.112.233.113.362.001.129-.037.255-.109.363l-.0002.0002c-.071.108-.173.191-.292.24l-.0002.0001-6.98 2.89c-.159.066-.338.066-.497 0l-.00003-.0001-6.98-2.889c-.12-.05-.221-.133-.293-.24-.072-.108-.11-.234-.109-.363.001-.13.04-.255.112-.362.073-.107.175-.19.295-.237l3.957-1.588 1.716.71-3.393 1.363-.317.127.315.13 4.891 2.025.053.022.053-.022 4.891-2.025.316-.13-.317-.127-3.393-1.362 1.717-.71 3.956 1.587zm-7.675-2.13c-.28-.03-.553-.083-.802-.13l-.007-.001c-.19-.036-.367-.07-.516-.086-.143-.016-.288-.021-.398.023l-.0001.0001-1.088.436-3.965-1.641c-.119-.05-.221-.133-.292-.24-.072-.108-.11-.234-.109-.363.001-.13.04-.255.112-.362.073-.107.175-.19.295-.238l6.98-2.801c.155-.063.329-.063.484 0l6.98 2.8c.12.049.223.131.295.238.073.107.112.233.113.362.001.129-.037.255-.109.363-.071.107-.173.191-.293.24l-3.964 1.641-1-.401c-.115-.046-.264-.047-.414-.034-.155.013-.337.043-.532.076l-.036.004c-.262.044-.55.093-.85.12l4.511-1.867.316-.131-.317-.127-4.891-1.963-.052-.021-.052.021-4.89 1.963-.317.127.315.131 4.491 1.859zm2.614.099l.735.295-1.716.71-1.128-.452-.052-.02-.052.02-1.128.453-1.716-.71.824-.331c.038-.015.12-.021.263-.005.136.016.303.047.496.083l.017.003c.377.071.84.16 1.297.161h0c.475.002.941-.077 1.323-.142l.042-.007c.197-.033.368-.061.51-.073.146-.013.237-.005.287.015l.052-.13-.052.13zm-2.161.833l.812.325-.563.234c-.159.066-.338.066-.497 0l-.563-.234.811-.325z" fill="#000" stroke="#000" stroke-width=".278"/></g><defs><clipPath id="clip0_3946_96106"><rect width="16" height="12" fill="#fff"/></clipPath></defs></svg>
    Safetensors
  </span>
</template>
<script setup lang="ts">
  import { onMounted } from 'vue'
  const props = defineProps({
    activeTag: String
  })

  const emit = defineEmits(['setActiveFrameworkTag'])

  const toggleActive = () => {
    emit('setActiveFrameworkTag', 'Safetensors')
  }
  const setTagColor = () => {
    if (props.activeTag?.toLowerCase() === 'safetensors') {
      return "color: white; background-color: #4D6AD6"
    }
  }
  const setSvgColor = () => {
    if (props.activeTag?.toLowerCase() === 'safetensors') {
      return "filter: drop-shadow(1000px 0 0 white); transform: translate(-1000px);"
    }
  }
  onMounted(() => {
  })
</script>