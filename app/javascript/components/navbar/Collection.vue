<template>
  <a
    href="/collections"
    class="flex items-center hover:text-[#009933]"
    :class="active ? 'text-[#009933]' : ''"
  >
    <SvgIcon
      name="collection_icon"
      width="18"
      height="18"
    />
    <span class="ml-[8px]"> 合集 </span>
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
