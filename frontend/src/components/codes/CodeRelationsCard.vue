<template>
  <div class="p-4 border-t border-gray-200">
    <h3 class="flex items-center gap-2">
      <SvgIcon name="codes" width="18px" height="18px" />
      <span class="font-medium text-gray-700 text-md leading-6"> {{ $t('codes.associated') }} </span>
      <span class="text-gray-500"> {{ codes.length }} </span>
    </h3>
    <div class="mt-4 flex flex-col gap-3">
      <RepoItem v-for="code in codes" :repo="code" repoType="code" cardType="relations" />
    </div>
  </div>
</template>

<script setup>
  import RepoItem from '../shared/RepoItem.vue';

  const props = defineProps({
    namespacePath: String,
    codes: Array
  })
</script>