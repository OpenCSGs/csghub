<template>
  <file-list
    :branches="branches"
    :current-branch="currentBranch"
    :current-path="currentPath"
    :namespace-path="namespacePath"
    :can-write="canWrite"
    @change-branch="changeBranch"
  />
</template>

<script setup>
  import FileList from '../shared/FileList.vue'

  const props = defineProps({
    branches: Object,
    currentBranch: String,
    currentPath: String,
    namespacePath: String,
    canWrite: Boolean,
    repoType: String
  })

  const changeBranch = (branch) => {
    if (branch !== props.currentBranch) {
      window.location.href = `/${props.repoType}s/${props.namespacePath}/files/${branch}`
    }
  }
</script>
