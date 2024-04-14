<template>
  <GradioInitializeGuide :http-clone-url="httpCloneUrl"
                         :ssh-clone-url="sshCloneUrl"
                         :user-name="userName"
                         :user-token="userToken" />
</template>

<script setup>
  import GradioInitializeGuide from './GradioInitializeGuide.vue'

  const props = defineProps({
    httpCloneUrl: String,
    sshCloneUrl: String,
    sdk: String,
    userName: String,
    userToken: String
  })
</script>