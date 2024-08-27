<template>
  <span
    class="px-[8px] py-[3px] flex items-center justify-center border rounded-md text-[#344054] text-[12px]"
    >{{ thePayMode }}
  </span>
</template>

<script setup>
  import { computed } from 'vue'

  const props = defineProps({
    payMode: String
  })
  const thePayMode = computed(() => {
    switch (props.payMode) {
      case 'free':
        return '免费'
      case 'minute':
        return '按需付费'
      case 'year':
      case 'month':
        return '包年包月'
      default:
        return '包年包月'
    }
  })
</script>
