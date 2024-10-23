<template>
  <span class="flex gap-[4px] items-center text-[14px] border px-[8px] py-[3px] rounded-sm cursor-pointer"
        :style="setTagColor()"
        @click="toggleActive"
  >
    <svg class="grayscale" :style="setSvgColor()" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M2.51116 2.42448V3.43907H1.41187V12.561H2.51116V13.5755H13.4909V12.561H14.5883V3.43907H13.4909V2.42448H2.51116ZM3.43916 3.94448H7.49281V6.48001H6.4801V4.96001H4.45375V9.01272H6.4801V8.00001H5.46739V6.98731H7.49187V10.0273H3.43916V3.94448ZM8.50834 5.97272H12.5639V8.50543H11.5483V6.98731H9.5201V11.04H11.5483V10.0273H10.5347V9.01272H12.5629V12.0555H8.50739L8.50834 5.97272Z" fill="black"/>
    </svg>
    GGUF
  </span>
</template>
<script setup lang="ts">
  import { onMounted } from 'vue'
  const props = defineProps({
    activeTag: String
  })

  const emit = defineEmits(['setActiveFrameworkTag'])

  const toggleActive = () => {
    emit('setActiveFrameworkTag', 'GGUF')
  }
  const setTagColor = () => {
    if (props.activeTag?.toLowerCase() === 'gguf') {
      return "color: white; background-color: #4D6AD6"
    }
  }
  const setSvgColor = () => {
    if (props.activeTag?.toLowerCase() === 'gguf') {
      return "filter: drop-shadow(1000px 0 0 white); transform: translate(-1000px);"
    }
  }
  onMounted(() => {
  })
</script>