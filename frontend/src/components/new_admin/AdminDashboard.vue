<template>
  <div class="p-9">{{ $t('admin.dashboard.intro') }}</div>
</template>

<script setup>
  import { onMounted } from 'vue'

  const emit = defineEmits(['showAdminMenu'])

  onMounted(() => {
    emit('showAdminMenu')
  })
</script>
