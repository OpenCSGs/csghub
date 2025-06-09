<template>
  <file-list
    :current-path="currentPath"
    :namespace-path="namespacePath"
    :can-write="canWrite"
    @change-branch="changeBranch"
  />
</template>

<script setup>
  import FileList from '../shared/FileList.vue'
  import { useRepoTabStore } from '../../stores/RepoTabStore'
  
  const { setRepoTab, repoTab } = useRepoTabStore()

  const props = defineProps({
    currentPath: String,
    namespacePath: String,
    canWrite: Boolean,
    repoType: String
  })

  const changeBranch = (branch) => {
    if (branch !== repoTab.currentBranch) {
      // window.location.href = `/${props.repoType}s/${props.namespacePath}/files/${branch}`
      setRepoTab({
        currentBranch: branch
      })
    }
  }
</script>
