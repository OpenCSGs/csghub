<template>
  <div
    class="max-w-max px-[6px] flex items-center justify-center gap-1 text-[#067647] rounded-md border border-[#ABEFC6] bg-[#ECFDF3]"
  >
    <div class="w-2 h-2 rounded-full bg-[#17B26A]"></div>
    {{ $t('billing.' + status) }}
  </div>
</template>

<script setup>
  const props = defineProps({
    status: String
  })
</script>
