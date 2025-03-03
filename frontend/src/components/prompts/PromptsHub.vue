<template>
  <div class="w-full h-[calc(100vh-153px)] flex md:flex-col text-[#101828] relative">
    <PromptsMenu />
    <PromptsLibrary
      :current-component="currentComponent"
      :namespace="namespace"
      :name="name"
      :file-path="path"
      :licenses="licenses"
    />
  </div>
</template>

<script setup>
  import { computed } from 'vue'
  import PromptsMenu from './PromptsMenu.vue'
  import PromptsLibrary from './PromptsLibrary.vue'

  const props = defineProps({
    namespace: String,
    name: String,
    path: String,
    licenses: Array
  })
  const currentComponent = computed(() => {
    return props.namespace && props.name && props.path
      ? 'PromptsDetails'
      : props.namespace && props.name
      ? 'PromptsList'
      : 'PromptsIndex'
  })
</script>
