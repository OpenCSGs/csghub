<template>
  <Hero />
  <Feature />
  <Team v-if="false" />
  <Joinus>
  </Joinus>
</template>
<script setup>
  import Hero from './Hero.vue'
  import Feature from './Feature.vue'
  import Joinus from './Joinus.vue'
  import Team from './Team.vue'
</script>