<template>
  <FileList :files="files" :last-commit="lastCommit" :branches="branches" />
</template>

<script setup>
  import FileList from '../shared/FileList.vue'

  const props = defineProps({
    files: Object,
    lastCommit: Object,
    branches: Object,
  })
</script>
