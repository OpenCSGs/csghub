<template>
  <Hero />
  <Feature />
  <Team v-if="false" />
  <Joinus>
  </Joinus>
  <Company />
</template>
<script setup>
  import Hero from './Hero.vue'
  import Feature from './Feature.vue'
  import Joinus from './Joinus.vue'
  import Team from './Team.vue'
  import Company from './Company.vue'
</script>