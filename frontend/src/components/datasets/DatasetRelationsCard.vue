<template>
  <div class="p-[16px] border-t border-gray-200">
    <h3 class="flex items-center gap-[8px]">
      <SvgIcon name="datasets" width="18px" height="18px" />
      <span class="font-[500] text-gray-700 text-[16px] leading-[24px]">
        {{ $t('datasets.associated') }}
      </span>
      <span class="text-gray-500"> {{ datasets.length }} </span>
    </h3>
    <div class="mt-[16px] flex flex-col gap-[12px]">
      <RepoItem
        v-for="dataset in datasets"
        :repo="dataset"
        repoType="dataset"
        cardType="relations" />
    </div>
  </div>
</template>

<script setup>
  import RepoItem from '../shared/RepoItem.vue'

  const props = defineProps({
    namespacePath: String,
    datasets: Array
  })
</script>
