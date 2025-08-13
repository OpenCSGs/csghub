<template>
  <span class="flex gap-1 items-center text-sm font-normal text-gray-700 bg-white border border-gray-300 px-2 py-1 rounded-sm cursor-pointer hover:bg-gray-50"
      :style="setTagColor()"
      @click="toggleActive"
  >
    <svg width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g" x1="0.25" y1="6" x2="12.58" y2="6"><stop stop-color="#FF6F00"/><stop offset="1" stop-color="#FFA800"/></linearGradient></defs><g clip-path="url(#c)"><path mask="url(#m1)" d="M11.11 5.43L8.28 3.77L8.11 3.67v1.57l0.06 0.03l1.43 0.84l0.02 1.99L8.28 7.33L8.11 7.23v3.42L6.34 11.67V0.37L11.11 3.09v2.34z" fill="url(#g)"/><path mask="url(#m2)" d="M3.72 3.77L0.89 5.43V3.09L5.67 0.37v11.31L3.89 10.65V3.67L3.72 3.77z" fill="url(#g)"/></g></svg>
    TensorFlow
  </span>
</template>

<script setup>
  const props = defineProps({
    active: Boolean
  })

  const emit = defineEmits(['setActiveFrameworkTag'])

  const toggleActive = () => {
    emit('setActiveFrameworkTag', 'framework', 'tensorflow')
  }
  const setTagColor = () => {
    if (props.active) {
      return "color: white; background-color: #4D6AD6"
    }
  }
</script>