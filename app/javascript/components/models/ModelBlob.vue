<template>
  <Blob
    :content="content"
    :last-commit="lastCommit"
    :branches="branches"
    :current-branch="currentBranch"
    :current-path="currentPath"
    :namespace-path="namespacePath"
    @change-branch="changeBranch"
    :size = "size"
    :can-write="canWrite"
  />
</template>

<script setup>
  import Blob from '../shared/Blob.vue';

  const props = defineProps({
    content: String,
    lastCommit: Object,
    branches: Object,
    currentBranch: String,
    currentPath: String,
    namespacePath: String,
    size: String,
    canWrite: Boolean
  })

  const changeBranch = (branch) => {
    if (branch !== props.currentBranch) {
      window.location.href = `/models/${props.namespacePath}/files/${branch}`
    }
  }
</script>
