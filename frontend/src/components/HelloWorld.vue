<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <button
      type="button"
      @click="count++"
    >
      count is {{ count }}
    </button>
  </div>

  <p>
    {{ serverMsg }}
  </p>

  <a
    class="block w-full text-center cursor-pointer mt-6"
    @click="routeToTarget"
    >go to {{ target }} page</a
  >
</template>

<script setup>
  import { ref, computed, onMounted } from 'vue'
  import useFetchApi from '@/packs/useFetchApi'

  const props = defineProps({
    msg: String,
    serverMsg: String
  })

  const count = ref(0)

  const target = computed(() =>
    location.pathname === '/test' ? 'Home' : 'Test'
  )

  const routeToTarget = () => {
    if (location.pathname === '/test') {
      location.href = '/'
    } else {
      location.href = '/test'
    }
  }

  const fetchHomeData = async () => {
    const url = `${CSGHUB_SERVER}/api/v1/models`
    
    const { data } = await useFetchApi(url).json()
    console.log(data.value)
  }

  onMounted(() => {
    fetchHomeData()
  })
</script>
