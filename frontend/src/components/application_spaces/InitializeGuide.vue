<template>
  <GradioInitializeGuide v-show="sdk == 'gradio'"
                         :http-clone-url="httpCloneUrl"
                         :ssh-clone-url="sshCloneUrl"
                         :user-name="userName"
                         :user-token="accessToken"
                         :sdk="sdk" />

  <StreamlitInitializeGuide v-show="sdk == 'streamlit'"
                            :http-clone-url="httpCloneUrl"
                            :ssh-clone-url="sshCloneUrl"
                            :user-name="userName"
                            :user-token="accessToken"
                            :sdk="sdk" />
</template>

<script setup>
  import GradioInitializeGuide from './GradioInitializeGuide.vue'
  import StreamlitInitializeGuide from './StreamlitInitializeGuide.vue'
  import useFetchApi from '../../packs/useFetchApi'
  import { useCookies } from 'vue3-cookies'
  import { ref, onMounted } from 'vue'

  const props = defineProps({
    httpCloneUrl: String,
    sshCloneUrl: String,
    sdk: String,
    userName: String
  })

  const { cookies } = useCookies()

  const currentUser = ref(cookies.get('current_user'))
  const accessToken = ref('')

  const fetchUserToken = async () => {
    const { data, error } = await useFetchApi(
      `/user/${currentUser.value}/tokens?app=git`
    ).json()

    if (error.value) {
      ElMessage({
        message: error.value.msg,
        type: 'warning'
      })
    } else {
      const tokens = data.value.data
      accessToken.value = tokens[0]?.token || ''
    }
  }

  onMounted(() => {
    if (currentUser.value) {
      fetchUserToken()
    }
  })
</script>