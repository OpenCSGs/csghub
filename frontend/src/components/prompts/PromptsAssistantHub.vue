<template>
  <div class="w-full flex md:flex-col text-[#101828] min-h-[calc(100vh-153px)] relative">
    <PromptsMenu />
    <PromptsAssistant
      :current-component="currentComponent"
      :namespace="namespace"
      :name="name"
      :file-path="filePath"
      class="flex flex-col"
    />
  </div>
</template>

<script setup>
  import { computed } from 'vue'
  import PromptsMenu from './PromptsMenu.vue'
  import PromptsAssistant from './PromptsAssistant.vue'

</script>
