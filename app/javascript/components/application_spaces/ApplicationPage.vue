<template>
  <div class="py-[20px] overflow-scroll">
    <iframe
      :src="endpointWithToken"
      allow="clipboard-write"
      id="application-space-iframe"
      frameborder="0"
      class="w-full h-[100vh]"
    ></iframe>
  </div>
</template>

<script setup>
  import { useCookies } from "vue3-cookies";
  import { onMounted, computed } from "vue";
  const { cookies } = useCookies();

  const props = defineProps({
    appEndpoint: String
  })

  const endpointWithToken = computed(() => {
    const userToken = cookies.get('user_token')
    return `${props.appEndpoint}?jwt=${userToken}`
  })
</script>