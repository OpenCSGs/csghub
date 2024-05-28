<template>
  <div class="grid grid-cols-2">
    <div>
      Test man
    </div>
    <div>
    </div>
    <div>
    </div>
    <div>
    </div>
  </div>
</template>

<script setup>
  const props = defineProps({
    appEndpoint: String,
    hardware: String,
    modelId: String,
    private: String,
    appInstanceNumber: String
  })
</script>