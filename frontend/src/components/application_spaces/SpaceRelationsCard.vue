<template>
  <div class="p-[16px] border-t border-gray-200">
    <h3 class="flex items-center gap-[8px]">
      <SvgIcon name="spaces" width="18px" height="18px" />
      <span class="font-medium text-gray-700 text-md leading-[24px]"> {{ $t('spaces.associated') }} </span>
      <span class="text-gray-500"> {{ spaces.length }} </span>
    </h3>
    <div class="mt-[16px] flex gap-[12px]">
      <a v-for="space in spaces" :href="`/spaces/${space.path}`" data-test="space-item">
        <p class="rounded-md border border-gray-300 bg-white py-0.5 pr-2.5 pl-1.5">
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