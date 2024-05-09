<template>
  <GradioInitializeGuide v-show="sdk == 'gradio'"
                         :http-clone-url="httpCloneUrl"
                         :ssh-clone-url="sshCloneUrl"
                         :user-name="userName"
                         :user-token="userToken"
                         :sdk="sdk" />

  <StreamlitInitializeGuide v-show="sdk == 'streamlit'"
                            :http-clone-url="httpCloneUrl"
                            :ssh-clone-url="sshCloneUrl"
                            :user-name="userName"
                            :user-token="userToken"
                            :sdk="sdk" /> 
</template>

<script setup>
  import GradioInitializeGuide from './GradioInitializeGuide.vue'
  import StreamlitInitializeGuide from './StreamlitInitializeGuide.vue'

  const props = defineProps({
    httpCloneUrl: String,
    sshCloneUrl: String,
    sdk: String,
    userName: String,
    userToken: String,
  })
</script>