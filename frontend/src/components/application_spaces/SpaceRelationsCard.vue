<template>
  <div class="p-[16px] border-t border-gray-200">
    <h3 class="flex items-center gap-2">
      <SvgIcon name="spaces" width="18px" height="18px" />
      <span class="font-medium text-gray-700 text-md leading-6"> {{ $t('spaces.associated') }} </span>
      <span class="text-gray-500"> {{ spaces.length }} </span>
    </h3>
    <div class="mt-4 flex flex-wrap gap-3">
      <ApplicationSpaceItem 
        v-for="space in spaces" 
        :key="space.path"
        :repo="space"
      />
    </div>
  </div>
</template>

<script setup>
  import ApplicationSpaceItem from './ApplicationSpaceItem.vue'
  
  const props = defineProps({
    namespacePath: String,
    spaces: Array
  })
</script>