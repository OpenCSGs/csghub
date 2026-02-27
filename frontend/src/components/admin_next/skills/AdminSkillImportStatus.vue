<template>
  <div
    class="flex items-center gap-[6px] border rounded-sm py-[2px] px-[8px]"
    :class="statusClass"
  >
    <SvgIcon
      path="codeImport"
      :name="status || 'notStarted'"
    />
    <p
      class="text-xs font-normal leading-[18px]"
      :class="textClass"
    >
      {{ statusName }}
    </p>
  </div>
</template>

<script setup>
  import { computed } from 'vue'

  const props = defineProps({
    status: String,
    statusName: String
  })

  const statusClass = computed(() => {
    switch (props.status) {
      case 'completed':
        return 'border-success-200 bg-success-100'
      case 'pending':
        return 'border-gray-200 bg-gray-50'
      case 'failed':
        return 'border-error-200 bg-error-50'
      case 'inprogress':
        return 'border-brand-200 bg-brand-50'
      default:
        return 'border-gray-200 bg-gray-50'
    }
  })

  const textClass = computed(() => {
    switch (props.status) {
      case 'completed':
        return 'text-success-700'
      case 'pending':
        return 'text-gray-700'
      case 'failed':
        return 'text-error-700'
      case 'inprogress':
        return 'text-brand-700'
      default:
        return 'text-gray-700'
    }
  })
</script>
