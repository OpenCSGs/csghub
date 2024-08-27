<template>
  <span class="flex gap-[4px] items-center text-[14px] border px-[8px] py-[3px] rounded-[6px] cursor-pointer"
      :style="setTagColor()"
      @click="toggleActive"
  >
    <svg class="grayscale" :style="setSvgColor()" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="#ffffff">
      <g clip-path="url(#clip0_3946_96047)">
        <mask id="mask0_3946_96047" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="6" y="0" width="6" height="12">
          <path d="M11.2246 3.02222L6.22461 0.17778V11.8667L8.22461 10.7111V7.42222L9.73572 8.28889L9.7135 6.04445L8.22461 5.17778V3.86667L11.2246 5.62222V3.02222Z" fill="white"/>
        </mask>
        <g mask="url(#mask0_3946_96047)">
          <path d="M0.313477 0.133331H12.5801V11.8889H0.313477V0.133331Z" fill="url(#paint0_linear_3946_96047)"/>
        </g>
        <mask id="mask1_3946_96047" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="0" y="0" width="6" height="12">
          <path d="M0.780029 3.02222L5.78003 0.17778V11.8667L3.78003 10.7111V3.86667L0.780029 5.62222V3.02222Z" fill="white"/>
        </mask>
        <g mask="url(#mask1_3946_96047)">
          <path d="M0.246582 0.133331H12.5132V11.8889H0.246582V0.133331Z" fill="url(#paint1_linear_3946_96047)"/>
        </g>
      </g>
      <defs>
        <linearGradient id="paint0_linear_3946_96047" x1="0.313477" y1="6.01111" x2="12.5801" y2="6.01111" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FF6F00"/>
          <stop offset="1" stop-color="#FFA800"/>
        </linearGradient>
        <linearGradient id="paint1_linear_3946_96047" x1="0.246582" y1="6.01111" x2="12.5132" y2="6.01111" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FF6F00"/>
          <stop offset="1" stop-color="#FFA800"/>
        </linearGradient>
        <clipPath id="clip0_3946_96047">
          <rect width="12" height="12" fill="white"/>
        </clipPath>
      </defs>
    </svg>
    TensorFlow
  </span>
</template>
<script setup lang="ts">
  import { onMounted } from 'vue'
  const props = defineProps({
    activeTag: String
  })

  const emit = defineEmits(['setActiveFrameworkTag'])

  const toggleActive = () => {
    emit('setActiveFrameworkTag', 'TensorFlow')
  }
  const setTagColor = () => {
    if (props.activeTag?.toLowerCase() === 'tensorflow') {
      return "color: white; background-color: #4D6AD6"
    }
  }
  const setSvgColor = () => {
    if (props.activeTag?.toLowerCase() === 'tensorflow') {
      return "filter: drop-shadow(1000px 0 0 white); transform: translate(-1000px);"
    }
  }
  onMounted(() => {
  })
</script>