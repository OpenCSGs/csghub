<template>
  <span class="flex gap-[4px] items-center text-[14px] border px-[8px] py-[3px] rounded-sm cursor-pointer"
        :style="setTagColor()"
        @click="toggleActive"
  >
    <svg class="grayscale" :style="setSvgColor()" xmlns="http://www.w3.org/2000/svg" width="16" height="12" viewBox="0 0 16 12" fill="none">
      <g clip-path="url(#clip0_3946_96106)">
        <path d="M9.9818 5.55887L15.0429 7.58987C15.1885 7.64806 15.3132 7.74858 15.4012 7.87806C15.4895 8.00782 15.5368 8.16069 15.538 8.31745C15.5388 8.47422 15.4928 8.62764 15.406 8.75824C15.3194 8.88883 15.1957 8.99046 15.0507 9.05033L8.07081 11.9401C7.87785 12.02 7.66067 12.02 7.4677 11.9401L0.487014 9.05116C0.342222 8.9913 0.218312 8.88939 0.131715 8.75879C0.0448391 8.62848 -0.000824084 8.47505 1.1259e-05 8.31829C0.000846602 8.16152 0.04818 8.00865 0.136448 7.8789C0.224437 7.74942 0.349457 7.6489 0.494807 7.59042L5.64498 5.52406C5.93985 5.406 6.8721 5.75295 7.76898 5.75601C8.72712 5.75907 9.65156 5.42632 9.9818 5.55887ZM2.87833 8.3336L7.76898 10.3579L12.6602 8.3336L7.76898 6.37054L2.87833 8.3336ZM8.06302 0.0570123L15.0429 2.85764C15.1885 2.91612 15.3132 3.01636 15.4012 3.14611C15.4895 3.27559 15.5368 3.42846 15.538 3.58523C15.5388 3.74199 15.4928 3.89542 15.406 4.02601C15.3194 4.1566 15.1957 4.25824 15.0507 4.31838L8.07081 7.20812C7.87785 7.28803 7.66067 7.28803 7.4677 7.20812L0.487014 4.31894C0.342222 4.25907 0.218312 4.15744 0.131715 4.02684C0.0448391 3.89625 -0.000824084 3.74283 1.1259e-05 3.58606C0.000846602 3.4293 0.04818 3.27643 0.136448 3.14667C0.224437 3.01719 0.349457 2.91667 0.494807 2.85848L7.47466 0.0570123C7.66345 -0.0190041 7.87423 -0.0190041 8.06302 0.0570123ZM2.87833 3.60138L7.76898 5.62598L12.6602 3.60138L7.76898 1.63832L2.87833 3.60138Z" fill="black"/>
      </g>
      <defs>
        <clipPath id="clip0_3946_96106">
          <rect width="16" height="12" fill="white"/>
        </clipPath>
      </defs>
    </svg>
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