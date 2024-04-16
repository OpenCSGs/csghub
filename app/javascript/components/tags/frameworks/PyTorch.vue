<template>
  <span class="flex gap-[4px] items-center text-[14px] border px-[8px] py-[3px] rounded-[6px] cursor-pointer"
        :style="setTagColor()"
        @click="toggleActive"
  >
    <svg class="grayscale" :style="setSvgColor()" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="#ffffff">
      <mask id="mask0_3946_95937" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="1" y="0" width="10" height="12">
        <path d="M10.7925 0.1875H1.1438V11.8125H10.7925V0.1875Z" fill="white"/>
      </mask>
      <g mask="url(#mask0_3946_95937)">
        <path d="M9.3525 3.56625C9.80104 4.01262 10.157 4.54322 10.3998 5.12755C10.6427 5.71189 10.7677 6.33845 10.7677 6.97125C10.7677 7.60405 10.6427 8.23062 10.3998 8.81495C10.157 9.39929 9.80104 9.92988 9.3525 10.3763C8.9105 10.8216 8.38472 11.1751 7.80547 11.4163C7.22622 11.6575 6.60496 11.7817 5.9775 11.7817C5.35003 11.7817 4.72877 11.6575 4.14952 11.4163C3.57028 11.1751 3.0445 10.8216 2.6025 10.3763C2.15396 9.92988 1.79803 9.39929 1.55515 8.81495C1.31228 8.23062 1.18726 7.60405 1.18726 6.97125C1.18726 6.33845 1.31228 5.71189 1.55515 5.12755C1.79803 4.54322 2.15396 4.01262 2.6025 3.56625L5.9775 0.191254V1.875L5.6625 2.18625L3.4125 4.43625C2.91017 4.93871 2.56812 5.57884 2.42958 6.27569C2.29104 6.97254 2.36224 7.69482 2.63418 8.35121C2.90611 9.00759 3.36658 9.56861 3.95734 9.96331C4.5481 10.358 5.24263 10.5687 5.95312 10.5687C6.66361 10.5687 7.35814 10.358 7.94891 9.96331C8.53967 9.56861 9.00013 9.00759 9.27207 8.35121C9.544 7.69482 9.6152 6.97254 9.47666 6.27569C9.33813 5.57884 8.99607 4.93871 8.49375 4.43625L9.3525 3.56625ZM7.665 3.375C7.54008 3.37575 7.41776 3.33933 7.31358 3.27039C7.20941 3.20145 7.12808 3.1031 7.07993 2.98783C7.03179 2.87256 7.01899 2.74558 7.04318 2.62302C7.06737 2.50047 7.12745 2.38787 7.21578 2.29954C7.30411 2.21121 7.41671 2.15113 7.53927 2.12694C7.66182 2.10275 7.78881 2.11554 7.90407 2.16369C8.01934 2.21184 8.1177 2.29316 8.18664 2.39734C8.25558 2.50152 8.29199 2.62384 8.29125 2.74875C8.29026 2.91454 8.22397 3.07326 8.10674 3.19049C7.9895 3.30772 7.83079 3.37402 7.665 3.375Z" fill="#EE4C2C"/>
      </g>
    </svg>
    PyTorch
  </span>
</template>
<script setup lang="ts">
  import { onMounted } from 'vue'
  const props = defineProps({
    activeTag: String
  })

  const emit = defineEmits(['setActiveFrameworkTag'])

  const toggleActive = () => {
    emit('setActiveFrameworkTag', 'PyTorch')
  }
  const setTagColor = () => {
    if (props.activeTag?.toLowerCase() === 'pytorch') {
      return "color: white; background-color: #4D6AD6;"
    }
  }
  const setSvgColor = () =>{
    if (props.activeTag?.toLowerCase() === 'pytorch') {
      return "filter: drop-shadow(1000px 0 0 white); transform: translate(-1000px);"
    }
  }
  onMounted(() => {
  })
</script>