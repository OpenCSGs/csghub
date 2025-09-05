<template>
  <div class="flex items-center gap-4">
    <div class="flex-1 border-b border-gray-200"></div>
    <CsgButton
      class="btn btn-tertiary-gray btn-sm"
      @click="viewMore"
      :name="$t('all.viewMore')"
      :svgName="'chevron-down'"
    />
    <div class="flex-1 border-b border-gray-200"></div>
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
