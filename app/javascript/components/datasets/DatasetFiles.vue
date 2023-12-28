<template>
  <FileList
    :files="files"
    :last-commit="lastCommit"
    :branches="branches"
    :current-branch="currentBranch"
    :current-path="currentPath"
    :namespace-path="namespacePath"
    @change-branch="changeBranch"
  />
</template>

<script setup>
  import FileList from '../shared/FileList.vue'

  const props = defineProps({
    files: Object,
    lastCommit: Object,
    branches: Object,
    currentBranch: String,
    currentPath: String,
    namespacePath: String,
  })

  const changeBranch = (branch) => {
    if (branch !== props.currentBranch) {
      window.location.href = `/datasets/${props.namespacePath}/files/${branch}`
    }
  }
</script>
