<template>
  <div class="p-[16px] border-t border-[#EBEEF5]">
    <h3 class="flex items-center gap-[8px]">
      <SvgIcon name="codes" width="18px" height="18px" />
      <span class="font-[500] text-gray-700 text-[16px] leading-[24px]"> {{ $t('codes.codesUsedToTrain') }} </span>
      <span class="text-gray-700"> {{ namespacePath }} </span>
    </h3>
    <div class="mt-[16px] flex flex-col gap-[12px]">
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