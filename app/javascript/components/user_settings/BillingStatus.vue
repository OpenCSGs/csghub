<template>
  <RunningStatus
    v-if="status === 'Running'"
    :status="status"
  />
  <StoppedStatus
    v-if="status === 'Stopped'"
    :status="status"
  />
</template>

<script setup>
  import RunningStatus from './BillingRunningStatus.vue'
  import StoppedStatus from './BillingStoppedStatus.vue'

  const props = defineProps({
    status: String,
  })

</script>
