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
  import { ref, onMounted, inject } from 'vue'

  const props = defineProps({
    httpCloneUrl: String,
    sshCloneUrl: String,
    sdk: String,
    userName: String
  })

  const { cookies } = useCookies()
  const csghubServer = inject('csghubServer')

  const currentUser = ref(cookies.get('current_user'))
  const accessToken = ref('')

  const fetchUserToken = async () => {
    const res = await jwtFetch(
      `${csghubServer}/api/v1/user/${currentUser.value}/tokens?app=git`
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
    if (currentUser.value) {
      fetchUserToken()
    }
  })
</script>