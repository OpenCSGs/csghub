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
    :path="path"
    :lfs="lfs"
    :lfs-pointer-size="lfsPointerSize"
    :lfs-relative-path="lfsRelativePath"
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
    size: Number,
    canWrite: Boolean,
    path: String,
    lfs: Boolean,
    lfsPointerSize: Number,
    lfsRelativePath: String
  })

  const changeBranch = (branch) => {
    if (branch !== props.currentBranch) {
      window.location.href = `/models/${props.namespacePath}/files/${branch}`
    }
  }
</script>
