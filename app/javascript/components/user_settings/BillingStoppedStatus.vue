<template>
  <div
    class="max-w-max px-[6px] md:px-[3px] flex items-center justify-center gap-1 text-[#344054] rounded-md border border-[#EAECF0] bg-[#F9FAFB]"
  >
    <div class="w-2 h-2 rounded-full bg-[#667085]"></div>
    {{ $t('billing.' + status) }}
  </div>
</template>

<script setup>
  const props = defineProps({
    status: String
  })
</script>
