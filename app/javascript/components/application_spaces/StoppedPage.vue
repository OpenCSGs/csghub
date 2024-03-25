<template>
  <div class="h-[50vh] py-[32px] flex flex-col items-center justify-center sm:px-[20px]">
    <p v-if="appStatus === 'Stopped'"
       class="text-[#6B7280] text-[16px]"
    >
       {{ $t('application_spaces.stoppedDesc') }} </p>
    <p v-if="appStatus === 'Sleeping'"
       class="text-[#6B7280] text-[16px]"
    >
       {{ $t('application_spaces.sleepingDesc') }} </p>
    <button class="border border-[#3250BD] bg-[#3250BD] rounded-[8px] shadow-xs px-[16px] py-[10px] text-white font-[500] text-[16px] leading-[24px] mt-[24px]">
      {{ $t('application_spaces.restart') }}
    </button>
  </div>
</template>

<script setup>
  const props = defineProps({
    appStatus: String
  })
</script>