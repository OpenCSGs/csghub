<template>
  <GradioInitializeGuide
    v-show="sdk == 'gradio'"
    :http-clone-url="httpCloneUrl"
    :ssh-clone-url="sshCloneUrl"
    :user-name="userStore.username"
    :user-token="accessToken"
    :sdk="sdk" />

  <StreamlitInitializeGuide
    v-show="sdk == 'streamlit'"
    :http-clone-url="httpCloneUrl"
    :ssh-clone-url="sshCloneUrl"
    :user-name="userStore.username"
    :user-token="accessToken"
    :sdk="sdk" />
</template>

<script setup>
  import GradioInitializeGuide from './GradioInitializeGuide.vue'
  import StreamlitInitializeGuide from './StreamlitInitializeGuide.vue'
  import useFetchApi from '../../packs/useFetchApi'
  import useUserStore from '../../stores/UserStore'
  import { ref, onMounted, watch } from 'vue'
  import { ElMessage } from 'element-plus'

  const userStore = useUserStore()

  const props = defineProps({
    httpCloneUrl: String,
    sshCloneUrl: String,
    sdk: String
  })

  const accessToken = ref('')

  watch(
    () => userStore.username,
    () => {
      fetchUserToken()
    }
  )

  const fetchUserToken = async () => {
    const { data, error } = await useFetchApi(
      `/user/${userStore.username}/tokens?app=git`
    ).json()

    if (error.value) {
      ElMessage.warning('error.value.msg')
    } else {
      const tokens = data.value.data
      accessToken.value = tokens[0]?.token || ''
    }
  }

  onMounted(() => {
    if (userStore.initialized) {
      fetchUserToken()
    }
  })
</script>