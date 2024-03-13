<template>
  <file-list
    :branches="branches"
    :current-branch="currentBranch"
    :current-path="currentPath"
    :namespace-path="namespacePath"
    :can-write="canWrite"
    @change-branch="changeBranch"
    :size = "size"
    :path="path"
    :lfs="lfs"
    :lfs-pointer-size="lfsPointerSize"
    :lfs-relative-path="lfsRelativePath"
  />
</template>

<script setup>
  import FileList from '../shared/FileList.vue'

  const props = defineProps({
    branches: Object,
    currentBranch: String,
    currentPath: String,
    namespacePath: String,
    size: Number,
    canWrite: Boolean,
    path: String,
    lfs: Boolean,
    lfsPointerSize: Number,
    lfsRelativePath: String,
    repoType: String
  })

  const changeBranch = (branch) => {
    if (branch !== props.currentBranch) {
      window.location.href = `/${props.repoType}s/${props.namespacePath}/files/${branch}`
    }
  }
</script>
