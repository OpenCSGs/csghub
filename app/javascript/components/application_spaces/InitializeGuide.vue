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
  import jwtFetch from '../../packs/jwtFetch'
  import { useCookies } from 'vue3-cookies'
  import { onMounted } from 'vue'

  const props = defineProps({
    httpCloneUrl: String,
    sshCloneUrl: String,
    sdk: String,
    userName: String
  })

  const currentUser = ref(cookies.get('current_user'))
  const accessToken = ref('')
  const { cookies } = useCookies()

  const fetchUserToken = async () => {
    const res = await jwtFetch(
      `${csghubServer}/api/v1/user/${currentUser}/tokens?app=git`
    )
    if (!res.ok) {
      res.json().then((error) => {
        ElMessage({ message: error.msg, type: 'warning' })
      })
    } else {
      res.json().then((body) => {
        if (body.data) {
          accessToken.value = body.data[0].token
        }
      })
    }
  }

  onMounted(() => {
    fetchUserToken()
  })
</script>