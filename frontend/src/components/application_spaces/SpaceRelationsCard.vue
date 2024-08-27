<template>
  <div class="p-[16px] border-t border-[#EBEEF5]">
    <h3 class="flex items-center gap-[8px]">
      <SvgIcon name="spaces" width="18px" height="18px" />
      <span class="font-[500] text-[#344054] text-[16px] leading-[24px]"> {{ $t('spaces.using') }} </span>
      <span class="text-[#344054]"> {{ namespacePath }} </span>
      <span class="text-[#667085]"> {{ spaces.length }} </span>
    </h3>
    <div class="mt-[16px] flex gap-[12px]">
      <a v-for="space in spaces" :href="`/spaces/${space.path}`">
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