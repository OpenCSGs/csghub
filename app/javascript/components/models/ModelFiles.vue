<template>
  <UploadFile v-if="theFlag === 'uploadFile'" @changeFlag="changeFlag"/>
  <FileList v-if="theFlag === 'fileList'" @changeFlag="changeFlag"
    :branches="branches"
    :current-branch="currentBranch"
    :current-path="currentPath"
    :namespace-path="namespacePath"
    @change-branch="changeBranch"
  />
</template>

<script setup>
  import FileList from '../shared/FileList.vue'
  import UploadFile from '../shared/file/UploadFile.vue'
  import {ref} from 'vue'

  let theFlag = ref('uploadFile')

  const props = defineProps({
    branches: Object,
    currentBranch: String,
    currentPath: String,
    namespacePath: String,
  })

  const changeBranch = (branch) => {
    if (branch !== props.currentBranch) {
      window.location.href = `/models/${props.namespacePath}/files/${branch}`
    }
  }

  function changeFlag(flag) {
    console.log(theFlag.value)
    theFlag.value = flag
  }
</script>
