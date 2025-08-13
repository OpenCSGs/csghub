<template>
  <div class="flex items-center pr-6">
    <div class="flex-1 border-b"></div>
    <div
      class="mx-2 flex h-8 flex-none items-center cursor-pointer rounded-lg px-2 hover:bg-gray-100"
      @click="viewMore"
    >
      <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 1.5L6 6.5L11 1.5" stroke="#475467" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <div class="text-sm leading-[20px] text-gray-600 font-medium ml-2">{{ $t('all.viewMore') }}</div>
    </div>
    <div class="flex-1 border-b"></div>
  </div>
</template>

<script setup>
  const props = defineProps({
    target: String
  })

  const emit = defineEmits(['viewMoreTargets'])

  const viewMore = () => {
    emit('viewMoreTargets', props.target)
  }
</script>
