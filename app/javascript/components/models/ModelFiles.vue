<template>
  <FileList
    :branches="branches"
    :current-branch="currentBranch"
    :current-path="currentPath"
    :namespace-path="namespacePath"
    @change-branch="changeBranch"
    :can-write="canWrite"
  />
</template>

<script setup>
  import FileList from '../shared/FileList.vue'

  const props = defineProps({
    branches: Object,
    currentBranch: String,
    currentPath: String,
    namespacePath: String,
    canWrite: Boolean
  })

  const changeBranch = (branch) => {
    if (branch !== props.currentBranch) {
      window.location.href = `/models/${props.namespacePath}/files/${branch}`
    }
  }
</script>
