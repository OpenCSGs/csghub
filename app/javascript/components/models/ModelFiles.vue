<template>
  <FileList :files="files" :last-commit="lastCommit" />
</template>

<script setup>
  import FileList from '../shared/FileList.vue'

  const props = defineProps({
    files: Object,
    lastCommit: Object,
  })
</script>
