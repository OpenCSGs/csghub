<template>
  <GradioInitializeGuide :http-clone-url="httpCloneUrl"
                         :ssh-clone-url="sshCloneUrl" />
</template>

<script setup>
  import GradioInitializeGuide from './GradioInitializeGuide.vue'

  const props = defineProps({
    httpCloneUrl: String,
    sshCloneUrl: String,
    sdk: String
  })
</script>