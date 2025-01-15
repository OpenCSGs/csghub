<template>
  <div class="p-[16px] border-t border-gray-200">
    <h3 class="flex items-center gap-2">
      <SvgIcon name="spaces" width="18px" height="18px" />
      <span class="font-medium text-gray-700 text-md leading-6"> {{ $t('spaces.associated') }} </span>
      <span class="text-gray-500"> {{ spaces.length }} </span>
    </h3>
    <div class="mt-4 flex flex-wrap gap-3">
      <a v-for="space in spaces" :href="`/spaces/${space.path}`" data-test="space-item">
        <p class="rounded-sm text-gray-700 border border-gray-300 bg-white py-1 px-2 hover:bg-gray-50">
          {{ space.path }}
        </p>
      </a>
    </div>
  </div>
</template>

<script setup>
  const props = defineProps({
    namespacePath: String,
    spaces: Array
  })
</script>