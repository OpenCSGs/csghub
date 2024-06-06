<template>
  <div
    class="text-sm text-[#303133] px-[8px] py-[4px] rounded flex items-center border gap-1"
    @click="viewMore"
  >
    +{{ num }}{{ $t('all.more') }}
  </div>
</template>

<script setup>
  const props = defineProps({
    num: String,
    target: String
  })

  const emit = defineEmits(['viewMoreTargets'])

  const viewMore = () => {
    emit('viewMoreTargets', props.target)
  }
</script>
