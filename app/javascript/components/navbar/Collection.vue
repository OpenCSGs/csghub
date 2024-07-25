<template>
  <a
    href="/collections"
    class="flex items-center hover:text-[#009933]"
    :class="active ? 'text-[#009933]' : ''"
  >
    <SvgIcon
      name="collections"
      width="18"
      height="18"
    />
    <span class="ml-[8px]"> {{ $t('collections.collection')}} </span>
  </a>
</template>

<script setup>
  import { ref, inject, onBeforeMount } from 'vue'
  const active = ref(false)

  onBeforeMount(() => {
    if (window.location.pathname.match(/\/collections/)) {
      active.value = true
    }
  })
</script>
